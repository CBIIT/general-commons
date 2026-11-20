import React, { useEffect, useMemo, useRef, useState } from 'react';
import { TextField, withStyles } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import debounce from 'lodash/debounce';
import { SearchList } from '@bento-core/local-find';
import bentoSearchBoxStyles from '@bento-core/local-find/dist/SearchBox/styles';
import ToolTip from '@bento-core/tool-tip';
import { getParticipantIdSuggestions } from './BentoFilterUtils';

const SUGGESTION_DELAY_MS = 300;
const MIN_PREFIX_LENGTH = 2;

function ParticipantIdSearchBox({ classes = {}, value = [], onChange = () => {} }) {
  const [options, setOptions] = useState([]);
  const [open, setOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const requestId = useRef(0);

  const search = useMemo(
    () =>
      debounce(async (prefix, id) => {
        const ids = await getParticipantIdSuggestions(prefix);
        if (id !== requestId.current) {
          return;
        }
        setOptions(ids.map((title) => ({ type: 'subjectIds', title })));
        setOpen(true);
      }, SUGGESTION_DELAY_MS),
    [],
  );

  useEffect(() => () => search.cancel(), [search]);

  const handleInputChange = (event, nextValue, reason) => {
    search.cancel();
    const id = requestId.current + 1;
    requestId.current = id;
    const prefix = (nextValue || '').trim();
    if (reason !== 'input' || prefix.length < MIN_PREFIX_LENGTH) {
      setOptions([]);
      setOpen(false);
      return;
    }
    setOptions([]);
    search(prefix, id);
  };

  const onDelete = (title) => onChange(value.filter((item) => item.title !== title));

  return (
    <div>
      <SearchList classes={classes} items={value.map((item) => item.title)} onDelete={onDelete} />
      <ToolTip
        open={isHovered && !isFocused}
        title="Enter Participant ID to search data"
        placement="top"
        classes={{
          tooltip: classes.customTooltip,
          arrow: classes.customArrow,
        }}
        arrow
      >
        <div className={classes.searchBoxRoot} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
          <Autocomplete
            id="local_find_input"
            aria-label="Search by Participant IDs"
            multiple
            disableClearable
            className={classes.autocomplete}
            classes={{
              paper: classes.paper,
              listbox: classes.listbox,
              noOptions: classes.noOptions,
              inputRoot: classes.inputRoot,
            }}
            open={open}
            onOpen={() => setOpen(true)}
            onClose={() => {
              search.cancel();
              requestId.current += 1;
              setOpen(false);
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            value={value}
            options={options}
            filterOptions={(serverOptions) => serverOptions}
            getOptionLabel={(option) => option.title || ''}
            getOptionSelected={() => false}
            onChange={(_, nextValue, reason, details) => {
              if (reason === 'select-option' && value.some((item) => item.title === details.option.title)) {
                return;
              }
              onChange(nextValue);
            }}
            onInputChange={handleInputChange}
            noOptionsText="No matching items found"
            renderTags={() => null}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="e.g. PARTICIPANT-10102"
                variant="outlined"
                size="small"
                InputProps={{
                  ...params.InputProps,
                  classes: { root: classes.inputRoot },
                  inputProps: {
                    ...params.inputProps,
                    'aria-label': 'Search by Participant IDs',
                  },
                }}
              />
            )}
          />
        </div>
      </ToolTip>
    </div>
  );
}

export default withStyles(bentoSearchBoxStyles)(ParticipantIdSearchBox);

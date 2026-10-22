import React, { useEffect, useMemo, useRef, useState } from 'react';
import { TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import debounce from 'lodash/debounce';
import { getParticipantIdSuggestions } from './BentoFilterUtils';

const SUGGESTION_DELAY_MS = 300;
const MIN_PREFIX_LENGTH = 2;

function ParticipantIdSearchBox({ value = [], onChange = () => {} }) {
  const [options, setOptions] = useState([]);
  const [open, setOpen] = useState(false);
  const requestId = useRef(0);

  const search = useMemo(() => debounce(async (prefix, id) => {
    const ids = await getParticipantIdSuggestions(prefix);
    if (id !== requestId.current) {
      return;
    }
    setOptions(ids.map((title) => ({ type: 'subjectIds', title })));
    setOpen(true);
  }, SUGGESTION_DELAY_MS), []);

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

  return (
    <Autocomplete
      id="local_find_input"
      aria-label="Search by Participant IDs"
      multiple
      disableClearable
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => {
        search.cancel();
        requestId.current += 1;
        setOpen(false);
      }}
      value={value}
      options={options}
      filterOptions={(serverOptions) => serverOptions}
      getOptionLabel={(option) => option.title || ''}
      getOptionSelected={(option, selected) => option.title === selected.title}
      onChange={(event, nextValue) => onChange(nextValue)}
      onInputChange={handleInputChange}
      noOptionsText="No matching items found"
      renderTags={() => null}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="e.g. PARTICIPANT-10102"
          InputProps={{
            ...params.InputProps,
            inputProps: {
              ...params.inputProps,
              'aria-label': 'Search by Participant IDs',
            },
          }}
        />
      )}
    />
  );
}

export default ParticipantIdSearchBox;

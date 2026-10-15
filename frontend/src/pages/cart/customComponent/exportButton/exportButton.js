import React, { useEffect, useState, useRef } from 'react';
import gql from 'graphql-tag';
import { Paper, Button, ClickAwayListener, Grow, MenuItem, MenuList, Portal, Snackbar, withStyles } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ToolTip from '@bento-core/tool-tip';
import clsx from 'clsx';
import { useQuery } from '@apollo/client';
import { MY_CART_MANIFEST_QUERY } from '../../../../bento/tableDownloadCSV';
import { manifestData, myFilesPageData } from '../../../../bento/fileCentricCartWorkflowData';
import cgcIcon from './assets/cgc.svg';
import { getManifestData } from './util/TableService';
import { useManifestDownload } from './util/useManifestDownload';
import { exportStyles } from './exportStyles';

const StyledMenuItem = withStyles(() => ({
  root: {
    padding: '2px 21px',
    whiteSpace: 'normal',
  },
}))(MenuItem);

const ExportButtonView = (props) => {
  const { classes, filesId } = props;

  const { downloadManifest, failed, dismissFailure } = useManifestDownload();
  const [sbgUrl, setSBGUrl] = useState('');
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };
  function handleListKeyDown(event) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    }
  }

  const STORE_MANIFEST_QUERY = gql`
    query storeManifest($manifestString: String!) {
      storeManifest(manifest: $manifestString)
    }
  `;

  const getManifestPayload = () => {
    const { data } = getManifestData(MY_CART_MANIFEST_QUERY, filesId);

    if (!data) {
      return null;
    }
    const appendString = 'drs://nci-crdc.datacommons.io/';
    const processedStoreManifestPayload = data.filesInList.map((el) => {
      const obj = {};
      for (let i = 0; i < manifestData.keysToInclude.length; i++) {
        if (manifestData.keysToInclude[i] === 'file_id') {
          obj[manifestData.header[i]] = el && el[manifestData.keysToInclude[i]] ? appendString + el[manifestData.keysToInclude[i]] : '';
        } else {
          const val = el && el[manifestData.keysToInclude[i]] ? el[manifestData.keysToInclude[i]] : '';
          obj[manifestData.header[i]] = Array.isArray(val) ? val.join(', ') : val;
        }
      }
      return obj;
    });
    return processedStoreManifestPayload;
  };

  const { data } = useQuery(STORE_MANIFEST_QUERY, {
    variables: { manifestString: JSON.stringify(getManifestPayload()) },
    context: { clientName: 'interopService' },
    skip: !getManifestPayload(),
    fetchPolicy: 'no-cache',
  });

  useEffect(() => {
    if (data && data.storeManifest) {
      setSBGUrl(data.storeManifest);
    }
  }, [data]);

  const exportOptions = [
    {
      label: 'Export to Cancer Genomics Cloud',
      icon: cgcIcon,
      onSelect: () =>
        window.open(
          `https://cgc.sbgenomics.com/import-redirect/drs/csv?URL=${encodeURIComponent(sbgUrl)}`,
          '_blank',
          'noopener,noreferrer',
        ),
    },
    {
      label: 'Download Manifest',
      guidance: myFilesPageData.tooltipMessage,
      itemClassName: classes.manifestMenuItem,
      onSelect: downloadManifest,
    },
  ];

  const options = exportOptions.map(({ label, icon, guidance, itemClassName, onSelect }) => {
    const menuItem = (
      <StyledMenuItem
        key={label}
        className={clsx(classes.styledMenuItem, itemClassName)}
        onClick={() => {
          onSelect();
          setOpen(false);
        }}
      >
        {icon && <img className={classes.menuItemIcon} src={icon} alt="" />}
        {label}
      </StyledMenuItem>
    );

    if (!guidance) {
      return menuItem;
    }

    return (
      <ToolTip
        key={label}
        title={guidance}
        placement="right"
        arrow
        classes={{
          tooltip: classes.guidanceTooltip,
          arrow: classes.guidanceTooltipArrow,
        }}
      >
        {menuItem}
      </ToolTip>
    );
  });

  return (
    <div className={classes.dropdownWrapper}>
      <Button
        classes={{
          root: open ? classes.availableDownloadDropdownBtnIsOpen : classes.availableDownloadDropdownBtn,
          startIcon: classes.availableDownloadDropdownBtnStartIcon,
        }}
        startIcon={<ArrowDropDownIcon className={open ? classes.caretOpen : classes.caret} />}
        ref={anchorRef}
        aria-controls={open ? 'menu-list-grow' : undefined}
        aria-haspopup="true"
        aria-expanded={open}
        onClick={handleToggle}
      >
        Export and Download
      </Button>
      <Grow in={open} unmountOnExit style={{ transformOrigin: 'center top' }}>
        <Paper className={classes.dropdownPaper}>
          <ClickAwayListener onClickAway={handleClose}>
            <MenuList
              autoFocusItem={open}
              id="menu-list-grow"
              onKeyDown={handleListKeyDown}
              classes={{
                root: classes.dropdownMenuList,
              }}
            >
              {options}
            </MenuList>
          </ClickAwayListener>
        </Paper>
      </Grow>
      <Portal>
        <Snackbar open={failed} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
          <Alert severity="error" onClose={dismissFailure}>
            The Manifest could not be downloaded. Please try again.
          </Alert>
        </Snackbar>
      </Portal>
    </div>
  );
};
export default withStyles(exportStyles)(ExportButtonView);

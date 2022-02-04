import React from 'react';
import { useLocation } from 'react-router-dom';
import { Paper, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { css } from '@emotion/react';
import { SubCategoryItem } from 'src/types';
import { useIpc } from 'src/utils';
import { ipcConstants } from 'src/constants';

const styles = {
  container: css`
    display: flex;
    flex-direction: row;
    padding: 12px;
    height: 100%;
    overflow: auto;
  `
}

export const SubCategory = () => {
  const location = useLocation();
  const { sendIpcMessage } = useIpc();
  const { subCategoryList } = location.state as { subCategoryList: SubCategoryItem[] };

  const handleItemClick = (item: SubCategoryItem) => {
    sendIpcMessage(ipcConstants.START_CRAWLING, JSON.stringify(item));
  }
  return (
    <Paper css={styles.container} elevation={2}>
      <List css={css`flex: 1`}>
        {
          subCategoryList.map((subCategory) => (
            <ListItem key={subCategory.label} disablePadding>
              <ListItemButton onClick={() => { handleItemClick(subCategory) }}>
                <ListItemText primary={subCategory.label}/>
              </ListItemButton>
            </ListItem>
          ))
        }
      </List>
    </Paper>
  )
  
}
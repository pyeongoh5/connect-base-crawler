import React from 'react';
import { useLocation } from 'react-router-dom';
import { Paper, List, ListItem, ListItemButton, ListItemText, Box, Button } from '@mui/material';
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
    console.log('sendIpcMessage', ipcConstants.START_CRAWLING, {item, category: (location?.state as any)?.title})
    sendIpcMessage(ipcConstants.START_CRAWLING, JSON.stringify({item, category: (location?.state as any)?.title}));
  }

  const handleAllCrawling = () => {
    console.log('sendIpcMessage', ipcConstants.START_CRAWLING_ALL, {items: subCategoryList, category: (location?.state as any)?.title})
    sendIpcMessage(
      ipcConstants.START_CRAWLING_ALL,
      JSON.stringify({items: subCategoryList, category: (location?.state as any)?.title})
    );
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
      <Box sx={{position: 'fixed', display: 'inline-block', right: 40, bottom: 20, backgroundColor: 'white'}}>
        <Button variant="outlined" onClick={handleAllCrawling}>
          전체 저장
        </Button>
      </Box>
    </Paper>
  )
  
}
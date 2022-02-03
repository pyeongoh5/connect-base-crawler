import React, { useEffect } from 'react';
import { Button } from '@mui/material';
import { useIpc } from 'src/utils';
import { ipcConstants } from 'src/constants';

export const Main = () => {
  const { sendIpcMessage } = useIpc();

  const handleIpcCall = () => {
    sendIpcMessage(ipcConstants.START_SELENIUM, 'start');
  }
  return(
    <div>
      Main Page
      <Button size="small" onClick={handleIpcCall}> 셀레니움 호출 테스트 </Button>
    </div>
  )
}

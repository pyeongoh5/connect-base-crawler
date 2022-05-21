import React, { PropsWithChildren, useEffect } from 'react';
import { css } from '@emotion/react';
import { Header } from 'src/components';
import { HEADER_SIZE } from 'src/types';
import { useIpc } from 'src/utils';

export const CommonLayout: React.FC<PropsWithChildren<{}>> = ({children}) => {
  const { ipcMessages, addIpcListener } = useIpc();

  useEffect(() => {
    addIpcListener('alert');
  }, [])

  useEffect(() => {
    const alertMessage = ipcMessages.get('alert');
    console.log('ipcMessages', alertMessage);
    if (alertMessage) {
      alert(alertMessage);
    }
  }, [ipcMessages]);

  return (
    <>
      <Header />
      <div css={css`height: calc(100% - ${HEADER_SIZE}px)`}>
        {children}  
      </div>
    </>
  )
}
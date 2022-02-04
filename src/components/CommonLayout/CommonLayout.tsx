import React from 'react';
import { css } from '@emotion/react';
import { Header } from 'src/components';
import { HEADER_SIZE } from 'src/types';

export const CommonLayout: React.FC = ({children}) => {
  return (
    <>
      <Header />
      <div css={css`height: calc(100% - ${HEADER_SIZE}px)`}>
        {children}  
      </div>
    </>
  )
}
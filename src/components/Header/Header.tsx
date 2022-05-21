import React from 'react';
import { Button, Typography } from '@mui/material';
import { ArrowBackIos as ArrowBackIosIcon } from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom'
import { css } from '@emotion/react';

const styles = {
  container: css`
    display: flex;
    position: relative;
  `,
  title: css`
    position: absolute;
    flex: 1;
    left: 50%;
    line-height: 36px;
    font-size: 22px;
    font-weight: 600;
    transform: translateX(-50%);
  `
}

export const Header = () => {
  const navigator = useNavigate()
  const location = useLocation();

  console.log('location', location);
  
  return (
    <header css={styles.container}>
      <Button onClick={() => navigator(-1)} css={css`flex: 0`}>
        <ArrowBackIosIcon />
      </Button>
      <Typography css={styles.title} variant='h1'>
        {(location?.state as any)?.title || 'Home'}
      </Typography>
    </header>
  )
}
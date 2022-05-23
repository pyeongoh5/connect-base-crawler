import React, { useState, useEffect } from 'react';
import { Paper, TextField, Button, Box, Typography } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { ipcConstants } from 'src/constants';
import { useIpc } from 'src/utils';
import { homedir } from 'os';
import path from 'path';

const { chromeDriverVersion } = require('../../../package.json');

export function Setup() {
  const navigator = useNavigate();
  const location = useLocation();
  const { sendIpcMessage } = useIpc();

  const ref = React.useRef<HTMLInputElement>(null);

  const [chromeDriverPath, setChromeDriverPath] = useState<string>();
  const [savePath, setSavePath] = useState<string>();

  useEffect(() => {
    navigator('/', {
      replace: true,
      state: {
        title: '환경 설정 설정',
      },
    });
  }, []);

  React.useEffect(() => {
    if (ref.current !== null) {
      const inputElement = ref.current.getElementsByTagName('input')[0]!;
      console.log('ref.current', inputElement);
      inputElement.setAttribute('directory', '');
      inputElement.setAttribute('webkitdirectory', '');
      inputElement.setAttribute('multiple', '');
    }
  }, [ref]);

  useEffect(() => {
    if (chromeDriverPath) {
      console.log('chromeDriverPath', chromeDriverPath);
      sendIpcMessage(
        ipcConstants.SET_CHROME_DRIVER_PATH,
        JSON.stringify({ chromeDriverPath }),
      );
    }
  }, [chromeDriverPath]);

  const setNewSavePath = () => {
    if (savePath) {
      console.log('savePath', savePath);
      sendIpcMessage(
        ipcConstants.SET_SAVE_PATH,
        JSON.stringify({ savePath }),
      );
    }
  };

  const moveToCategoryPage = () => {
    navigator('/category');
  };

  return (
    <Paper
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        p: 1.5,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flex: 1,
          alignItems: 'center',
          justifyContent: 'space-around',
        }}
      >
        {/* 크롬 드라이버 설정 */}
        <Box sx={{flex:1}}>
          <Typography variant="h5" component="h2">
            {' '}
            크롬 드라이버 설정
          </Typography>
          <Typography>
            현재 기본 드라이버 버전: {chromeDriverVersion}
          </Typography>
          <TextField
            sx={{ height: '48px' }}
            type="file"
            inputProps={{
              accepts: '*',
            }}
            onChange={(e) => {
              const file = (e.target as any)?.files[0];
              if (file) {
                setChromeDriverPath(file.path);
              }
            }}
          />
        </Box>

        <Box sx={{flex:1}}>
          <Typography variant="h5" component="h2">
            기본저장 위치는 바탕화면이고, 추가적인 폴더 디렉토리를 설정할 수 있습니다.
          </Typography>
          <Typography>저장 경로: {savePath || '설정 되지 않음'}</Typography>
          <TextField
            style={{ height: '48px' }}
            type="text"
            ref={ref}
            placeholder="testFolder/test/"
            onChange={(e) => {
              setSavePath(path.join(homedir(), e.target.value));
              console.log('ee', homedir() + e.target.value)
            }}
          />
          <Button variant="outlined" onClick={setNewSavePath}>
            저장 경로 설정
          </Button>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" onClick={moveToCategoryPage}>
          다음
        </Button>
      </Box>
    </Paper>
  );
}

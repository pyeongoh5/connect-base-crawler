import { ipcRenderer } from 'electron';
import React, { useCallback, useState, useEffect, useRef } from 'react';

export const useIpc = () => {
  const ipcChannels = useRef<Set<string>>(new Set());
  const [ipcMessages, setIpcMessages] = useState<Map<string, any>>(new Map());

  useEffect(() => {
    return () => {
      console.log('ipcChannels.current.values()', ipcChannels.current.values());
      for (let channelName of ipcChannels.current.values()) {
        console.log('channelName', channelName);
        ipcRenderer.removeAllListeners(channelName);
      }
    }
  }, [])
  const addIpcListener = useCallback((channel: string): void => {
    ipcChannels.current.add(channel);
    ipcRenderer.on(channel, (event, ...args) => {
      console.log('receive message in renderer', args[0]);

      setIpcMessages((prevIPCMessages) => {
        let parsedValue;
        try{
          parsedValue = JSON.parse(args[0]);
        } catch(e) {
          parsedValue = args[0];
        }
        return new Map(prevIPCMessages.set(channel, parsedValue));
      });
    });
  }, []);

  const sendIpcMessage = useCallback((channel: string, message: string):void => {
    ipcRenderer.send(channel, message);
  }, []);

  return {ipcMessages, addIpcListener, sendIpcMessage};
}
import {ipcMain} from 'electron';
import { ipcConstants } from '../src/constants';
import { Crawler } from './controller/Crawler'
const { crawlingTarget } = require('../package.json');

ipcMain.on(ipcConstants.START_SELENIUM, async (event, ...args) => {
  console.log('ipcMain receive message::', args[0], crawlingTarget);
  const crawler = new Crawler();
  await crawler.launch(crawlingTarget);
  await crawler.getSearchList();
})
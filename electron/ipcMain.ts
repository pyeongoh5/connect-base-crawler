import {ipcMain} from 'electron';
import { existsSync } from 'fs';
import { ipcConstants } from '../src/constants';
import { Crawler } from './controller/Crawler'
const { crawlingTarget } = require('../package.json');

const crawler = new Crawler();

ipcMain.on(ipcConstants.START_SELENIUM, async (event, ...args) => {
  console.log('ipcMain receive message::', args[0], crawlingTarget);
  await crawler.createDriver();
  await crawler.launch(crawlingTarget);
  await crawler.getSearchList();
  crawler.close();
})

ipcMain.on(ipcConstants.START_CRAWLING, async (event, ...args) => {
  console.log('ipcMain receive message::', JSON.parse(args[0]));
  const { item, category } = JSON.parse(args[0]);
  const { link, label } = item;
  try {
    await crawler.createDriver();
    await crawler.setCategoryPath(category);
    await crawler.launch(link);
    await crawler.startCrawlCompanies(label);
    await crawler.resetData();
    crawler.close();
    event.sender.send('alert', '완료');
  } catch (err) {
    const isChromeDriverProblem = err.message.includes('ChromeDriver only supports Chrome version');
    if (isChromeDriverProblem) {
      event.sender.send('alert', 'chrome driver 버전을 최신화해주세요. https://chromedriver.chromium.org/downloads')
    } else {
      event.sender.send('alert', err.message);
    }
  }
})

ipcMain.on(ipcConstants.START_CRAWLING_ALL, async (event, ...args) => {
  const { items, category } = JSON.parse(args[0]);
  try {
    await crawler.createDriver();
    for(let item of items) {
      const { link, label } = item;
      await crawler.setCategoryPath(category);
      await crawler.launch(link);
      console.log('crawler.startCrawlCompanies');
      await crawler.startCrawlCompanies(label);
      console.log('crawler.resetData');
      await crawler.resetData();
    }
    crawler.close();
    event.sender.send('alert', '완료');
  } catch (err) {
    const isChromeDriverProblem = err.message.includes('ChromeDriver only supports Chrome version');
    if (isChromeDriverProblem) {
      event.sender.send('alert', 'chrome driver 버전을 최신화해주세요. https://chromedriver.chromium.org/downloads')
    } else {
      event.sender.send('alert', err.message);
    }
  }
})

ipcMain.on(ipcConstants.SET_CHROME_DRIVER_PATH, (event, ...args) => {
  const { chromeDriverPath } = JSON.parse(args[0]);
  console.log('driverPath', chromeDriverPath);
  crawler.setDriverPath(chromeDriverPath);
});

ipcMain.on(ipcConstants.SET_SAVE_PATH, (event, ...args) => {
  const { savePath } = JSON.parse(args[0]);
  console.log('savePath', savePath);
  if (existsSync(savePath)) {
    crawler.setSavePath(savePath);
    event.sender.send('alert', '저장경로가 설정 되었습니다.');
  } else {
    event.sender.send('alert', '저장경로가 존재하지 않습니다.');
  }
});
import { Driver } from 'selenium-webdriver/chrome';
import * as isDev from 'electron-is-dev';

import { Category, WebElement, CrawlerFile, Company, DataManager } from '../model';
import { FileManager } from '../manager';
import { Scheduler } from '../helper';

const path = require('path');
const { Builder } = require('selenium-webdriver');
const { ServiceBuilder } = require('selenium-webdriver/chrome');
const chrome = require('selenium-webdriver/chrome');
const chromeDriverPath = isDev ? path.resolve('chromedriver') : path.join(__dirname, '/../../chromedriver');
console.log('default chromeDriverPath', chromeDriverPath)
const By = require('selenium-webdriver').By;

export class Crawler {
  driver: Driver;
  driverPath: string;
  categories: Category[];
  scheduler: Scheduler;
  rootElement: WebElement;
  prevUrl: string;
  dataManagaer: DataManager;

  constructor() {
    this.categories = [];
    this.scheduler = new Scheduler(2000);
    this.dataManagaer = new DataManager();
    this.driverPath = chromeDriverPath;
  }

  createDriver() {
    const serviceBuilder = new ServiceBuilder(this.driverPath);
    this.driver = new Builder()
    .forBrowser('chrome')
    // .setChromeOptions(new chrome.Options().headless())
    .setChromeService(serviceBuilder)
    .build();
  }

  setDriverPath(driverPath: string) {
    this.driverPath = driverPath;
  }

  setSavePath(savePath: string) {
    this.dataManagaer.setSavePath(savePath);
  }

  setCategoryPath(categoryName: string) {
    this.dataManagaer.setCategoryPath(categoryName);
  }

  resetData() {
    this.dataManagaer.resetData();
  }

  async launch(url: string) {
    await this.moveTo(url);
  }

  close() {
    this.driver.quit();
  }

  async moveTo(url: string) {
    await this.driver.get(url);

    const bodyEl = await this.driver.findElement(By.css('body'));
    this.rootElement = new WebElement(bodyEl);
  }

  async watchModalToClose() {
    console.log('watchModalToClose');
    try {
      const modalBtn = await this.rootElement.findElement('.modalClose-btn');
      const classNames = await modalBtn.getAttribute('class');
      if (classNames.includes('modalBanner__show')) {
        await (await modalBtn.findElement('.x-btn')).getOriginal().click();
      }
    } catch(err) {
      console.log('watchModalToClose err::', err.message);
    }
    await this.driver.executeScript(
      `
        var observer = new MutationObserver(function(mutations) {
          mutations.forEach(function(mutationRecord) {
            console.log('style changed!');
            console.log(mutationRecord.type);
            const closeButton = document.getElementsByClassName('modalClose-btn')[0];
            closeButton.click();
            window.observer.disconnect();
          });  
        });
        
        window.observer = observer;
        // 감시자의 설정:
  
        var target = document.getElementsByClassName('modalBanner__overlay')[0];
        // 감시자 옵션 포함, 대상 노드에 전달
        if (target) {
          window.observer.observe(target, { attributes : true, attributeFilter : ['style', 'class'] });
        }
      `
    );
  }

  async startCrawlCompanies (label: string) {
    await this.watchModalToClose();

    const companyList = await this.collectCompanyList();
    console.log('companyList', companyList.length);
    const urls = await this.getCompanyDetailPages(companyList);

    this.prevUrl = await this.driver.getCurrentUrl();
    for(let url of urls) {
      await this.getCompanyInfo(url);
    }

    try {
      await this.moveTo(this.prevUrl);
      const next = (await this.rootElement.findElement('.pagenation a[rel="next"]'));
      console.log('next', await next.getText());
      const nextUrl = await next.getAttribute('href');
      await this.moveTo(nextUrl);
      await this.startCrawlCompanies(label);
    } catch(err) {
      console.log('err', err);
      console.log(this.dataManagaer.getWeight());
      this.dataManagaer.saveToFile(label);
    }
  }

  async crawlCurrentPage () {

  }

  async getCompanyDetailPages(companyList: WebElement[]) {
    const urls = [];
    for(let company of companyList) {
      const detailUrl = await (await company.findElement('h4 a')).getAttribute('href');
      urls.push(detailUrl);
    }
    return urls;
  }

  async collectCompanyList() {
    return await this.rootElement.findElements('.searches__result__list');
  }

  async getCompanyInfo(url: string) {
    await this.moveTo(url);
    await this.watchModalToClose();

    const basicInfoContainer = await this.rootElement.findElement('.node__basicinfo');
    const basicInfoDls = await basicInfoContainer.findElements('dl');

    const contactInfoContainer = await this.rootElement.findElement('.node__contact')
    const contactInfoList = await contactInfoContainer.findElements('.node__box__heading+.cf p');

    try {
      const companyData = new Company();
      const companyName = await (await this.rootElement.findElement('.node__header__text__title')).getText();
      companyData.setData('company', companyName);

      for (const dl of basicInfoDls) {
        const dt = await dl.findElement('dt');
        const dd = await dl.findElement('dd');
        const dtName = await dt.getText();
        const ddName = await dd.getText();
        companyData.setData(dtName, ddName);
      }

      for (const contact of contactInfoList) {
        const aTag = await contact.findElement('a');
        const name = await aTag.getText();
        const value = await aTag.getAttribute('href');
        companyData.setData(name, value);
      }

      this.dataManagaer.addCompanyData(companyData);
    } catch(err) {
      console.log('getCompanyInfo err:: ', err);
      throw err;
    }

  }

  // 큰 카테고리 박스들이 세로열로 나열되어 있어서 그 세로열(좌, 우로 구성)을 구성하는 엘리먼트를 서치
  async getSearchList() {
    const homeBoxEls = await this.driver.findElements(By.css('.home__category'));

    for(let homeBoxEl of homeBoxEls) {
      await this.getCategories(new WebElement(homeBoxEl));
    }

    // this.displayCategoryItems();
    const categoryFile = new CrawlerFile(this.categories);
    const fileManager = FileManager.getInstance();
    fileManager.addFile('category', categoryFile);
    fileManager.extractFile(path.resolve('./test'), 'json');
  }

  // 각 세로열에 해당하는 엘리먼트, 이 안에서 각각의 카테고리에 해당하는 아이템을 찾음
  async getCategories(homeBoxEl: WebElement) {
    const categoryEls = await homeBoxEl.findElements('.home__category__box');
    for(let categoryEl of categoryEls) {
      await this.getCategoryItem(categoryEl);
    }
  }

  // 각각의 카테고리 아이템의 정보를 찾음 (큰 카테고리 제목, 세부 카테고리의 제목과 링크)
  async getCategoryItem(categoryEl: WebElement) {
    try {
      const headerEl = await categoryEl.findElement('.home__headlink__heading');
      const categoryName = await headerEl.getText();
      const categoryItem = new Category(categoryName);
      const itemListEls = await categoryEl.findElements('.home__category__box__list li');
      for(let itemEl of itemListEls) {
        const link = await (await itemEl.findElement('a')).getAttribute('href');
        const title = await (await itemEl.findElement('p')).getText();
        if (title === '') {
          throw new Error('empty title');
        }
        categoryItem.addItem({label: title, link});
      }
      this.categories.push(categoryItem);
    } catch(e) {
      console.log('occur exceptional error at getCategoryItem at Crawler.ts::', e);
    }
  }

  displayCategoryItems() {
    for(let item of this.categories) {
      item.toString();
    }
  }
}
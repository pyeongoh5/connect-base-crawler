import { Driver } from 'selenium-webdriver/chrome';
import { Category, WebElement } from '../model/';

const path = require('path');
const { Builder } = require('selenium-webdriver');
const { ServiceBuilder } = require('selenium-webdriver/chrome');
const chrome = require('selenium-webdriver/chrome');
const chromeDriverPath = path.resolve('chromedriver');
const By = require('selenium-webdriver').By;

export class Crawler {
  driver: Driver;
  categories: Category[];
  constructor() {
    this.categories = [];
    const serviceBuilder = new ServiceBuilder(chromeDriverPath);
    this.driver = new Builder()
    .forBrowser('chrome')
    .setChromeOptions(new chrome.Options().headless())
    .setChromeService(serviceBuilder)
    .build();
  }

  async launch(url) {
    await this.driver.get('https://baseconnect.in/')
    await this.watchModalToClose();
  }

  async watchModalToClose() {
    await this.driver.executeScript(
      `
        console.log('observer start');
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
        window.observer.observe(target, { attributes : true, attributeFilter : ['style', 'class'] });
      `
    );
  }

  // 큰 카테고리 박스들이 세로열로 나열되어 있어서 그 세로열(좌, 우로 구성)을 구성하는 엘리먼트를 서치
  async getSearchList() {
    const homeBoxEls = await this.driver.findElements(By.css('.home__category'));
    console.log('homeBoxEls', homeBoxEls);

    for(let homeBoxEl of homeBoxEls) {
      await this.getCategories(new WebElement(homeBoxEl));
    }

    this.displayCategoryItems();
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
        this.categories.push(categoryItem);
      }
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
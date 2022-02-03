import { Category } from '../model/Category';

const path = require('path');
const { Builder } = require('selenium-webdriver');
const { ServiceBuilder } = require('selenium-webdriver/chrome');
const chrome = require('selenium-webdriver/chrome');
const chromeDriverPath = path.resolve('chromedriver');
const By = require('selenium-webdriver').By;

export class Crawler {
  driver: any;
  categories: Category[];
  constructor() {
    this.categories = [];
    const serviceBuilder = new ServiceBuilder(chromeDriverPath);
    this.driver = new Builder()
    .forBrowser('chrome')
    .setChromeOptions(new chrome.Options().headless())
    .setChromeService(serviceBuilder)
    // .usingServer('http://127.0.0.1:8080')
    // .setProxy(proxy.manual({http: 'http://127.0.0.1:8080'}))
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
    // for(let i = 0; i < homeBoxEls.length; i++) {
    //   const homeBoxEl = homeBoxEls[i];
    //   await this.getCategories(homeBoxEl);
    // }
    for(let homeBoxEl of homeBoxEls) {
      await this.getCategories(homeBoxEl);
    }

    this.displayCategoryItems();
  }

  // 각 세로열에 해당하는 엘리먼트, 이 안에서 각각의 카테고리에 해당하는 아이템을 찾음
  async getCategories(homeBoxEl) {
    const categoryEls = await homeBoxEl.findElements(By.css('.home__category__box'));
    // for(let i = 0; i < categoryEls.length; i++) {
    //   const categoryEl = categoryEls[i]
    //   await this.getCategoryItem(categoryEl);
    // }
    for(let categoryEl of categoryEls) {
      await this.getCategoryItem(categoryEl);
    }
  }

  // 각각의 카테고리 아이템의 정보를 찾음 (큰 카테고리 제목, 세부 카테고리의 제목과 링크)
  async getCategoryItem(categoryEl) {
    try {
      const headerEl = await categoryEl.findElement(By.css('.home__headlink__heading'));
      const categoryName = await headerEl.getText();
      console.log('categoryName', categoryName)
      const categoryItem = new Category(categoryName);
      const itemListEls = await categoryEl.findElements(By.css('.home__category__box__list li'));
      for(let itemEl of itemListEls) {
      // for(let i = 0; i < itemListEls.length; i++) {
      //   const itemEl = itemListEls[i];
        const linkEl = await itemEl.findElement(By.css('a'));
        const link = await linkEl.getAttribute('href');
        const titleEl = await linkEl.findElement(By.css('p'));
        const title = await titleEl.getText();
        if (title === '') {
          throw new Error('empty title');
        }
        categoryItem.addItem({label: title, link});
        // console.log('categoryItem', categoryItem);
        this.categories.push(categoryItem);
      }
    } catch(e) {
      console.log('occur exceptional error at getCategoryItem at Crawler.ts::', e);
    }
  }

  displayCategoryItems() {
    // console.log('displayCategoryItems', this.categories)
    for(let item of this.categories) {
      item.toString();
    }
  }
}
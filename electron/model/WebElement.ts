import { WebElement as SeleniumWebElement } from "selenium-webdriver";
const By = require('selenium-webdriver').By;

export class WebElement {
  private webElement: SeleniumWebElement;

  constructor(element: SeleniumWebElement) {
    this.webElement = element;
  }

  async findElement(selector: string): Promise<WebElement> {
    try {
      const element = await this.webElement.findElement(By.css(selector));
      return new WebElement(element);
    } catch(err) {
      console.log('findElement err::', err);
      throw err;
    }
  }

  async findElements(selector: string): Promise<WebElement[]> {
    try {
      const elements = await this.webElement.findElements(By.css(selector));
      return elements.map((element) => new WebElement(element));
    } catch(err) {
      console.log('findElements err::', err);
      throw err;
    }
  }

  async getText(): Promise<string> {
    try {
      return await this.webElement.getText();
    }  catch(err) {
      console.log('getText err::', err);
      throw err;
    }
  }

  async getAttribute(attributeName: string) {
    try {
      return await this.webElement.getAttribute(attributeName);
    } catch(err) {
      console.log('getAttribute err::', err);
      throw err;
    }
  }

  getOriginal(): SeleniumWebElement {
    return this.webElement;
  }
} 
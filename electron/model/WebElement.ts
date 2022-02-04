import { WebElement as SeleniumWebElement } from "selenium-webdriver";
const By = require('selenium-webdriver').By;

export class WebElement {
  private webElement: SeleniumWebElement;

  constructor(element: SeleniumWebElement) {
    this.webElement = element;
  }

  async findElement(selector: string): Promise<WebElement> {
    const element = await this.webElement.findElement(By.css(selector));
    return new WebElement(element);
  }

  async findElements(selector: string): Promise<WebElement[]> {
    const elements = await this.webElement.findElements(By.css(selector));
    return elements.map((element) => new WebElement(element));
  }

  async getText() {
    return await this.webElement.getText();
  }

  async getAttribute(attributeName: string) {
    return await this.webElement.getAttribute(attributeName);
  }
}
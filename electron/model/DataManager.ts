import { flexbox } from '@mui/system';
import { existsSync, fstat, mkdir, mkdirSync } from 'fs';
import { homedir } from 'os';
import * as XLSX from 'xlsx';
import { Company } from '.';

const { utils, writeFile } = XLSX;

export class DataManager {
  private keyBalancePoint: {[key: string]: number};

  private companyData: Company[];

  private savePath: string;

  private categoryPath: string;

  constructor() {
    this.keyBalancePoint = {};
    this.companyData = [];
    this.savePath = homedir();
  }

  setSavePath(savePath: string) {
    this.savePath = savePath;
  }

  setCategoryPath(categoryPath: string) {
    this.categoryPath = categoryPath;
  }

  resetData() {
    this.companyData = [];
    this.keyBalancePoint = {};
  }

  addCompanyData(data: Company) {
    this.companyData.push(data);
    this.addWeight(data);
  }

  // 수집한 데이터의 key의 가중치를 더한다.
  private addWeight(data: Company) {
    const companyRawData = data.getAllData();

    Object.keys(companyRawData).forEach((key) => {
      if (this.keyBalancePoint[key]) {
        this.keyBalancePoint[key]++;
      } else {
        this.keyBalancePoint[key] = 1;
      }
    });
  }

  getWeight(): {[key: string]: number} {
    return this.keyBalancePoint;
  }

  private getSortedKeyByWeight(): string[] {
    const keys = Object.keys(this.keyBalancePoint);
    return keys.sort((a, b) => this.keyBalancePoint[b] - this.keyBalancePoint[a]);
  }

  checkValidSavePath(): string {
    console.log('checkValidSavePath', this.savePath, this.categoryPath);
    const path = `${this.savePath}/${this.categoryPath}`;
    try {
      if (!existsSync(path)) {
        mkdirSync(path);
      }
      return path;
    } catch(err) {
      console.log('errer occured at checkValidSavePath', err);
      throw err;
    }
  }

  saveToFile(filename: string) {
    const savePath = this.checkValidSavePath();

    const sortedkeys = this.getSortedKeyByWeight();
    const excelData = [];
    const header = ['index', ...sortedkeys];
    excelData.push(header);

    this.companyData.forEach((data, index) => {
      const row = [];
      row.push(index);
      sortedkeys.map((key) => {
        const rawData = data.getAllData();
        if (rawData[key]) {
          row.push(rawData[key]);
        } else {
          row.push('NA');
        }
      });
      excelData.push(row);
    });

    console.log('excelData', excelData.length);

    try {
      const wb = utils.book_new();
      const sheet = utils.aoa_to_sheet(excelData);
      // console.log('sheet', sheet);
      utils.book_append_sheet(wb, sheet, 'output');
      console.log('path:: ', `${savePath}/${filename}.csv`);
      writeFile(wb, `${savePath}/${filename}.csv`);
      return true;
    } catch (e) {
      console.error('error occured when save To Excel::', e.message);
      return false;
    }
  }
}

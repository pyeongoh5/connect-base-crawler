import type { FileExtension } from '../types';
import { CrawlerFile } from '../model';
import * as XLSX from "xlsx";
import * as fs from 'fs'

const { readFile, utils, writeFile } = XLSX;

export class FileExtractor {
  static extractFile(file: CrawlerFile, extension: FileExtension, savePath: string) {
    switch (extension) {
      case "csv":
        FileExtractor.extractToCSV(file, savePath);
        break;
      case "json":
        FileExtractor.extractToJson(file, savePath);
        break;
      case "txt":
        break;
    }
  }
  static extractToCSV(file: CrawlerFile, path: string) {
    const workbook = utils.book_new();
  }

  /**
   * 
   * @param file 저장할 데이터 파일
   * @param path 파일명을 포함하는 저장경로 (확장자는 미포함)
   */
  private static extractToJson(file: CrawlerFile, path: string) {
    console.log('path', path);
    fs.writeFile(`${path}.json`, file.toString(), (err) => {
      if (err) {
        console.error('Unexcepted error occured at extractToJson at FileExctractor!!');
        throw err;
      }
    })
  }
}

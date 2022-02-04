import { FileExtractor } from '../helper';
import { CrawlerFile } from '../model';
import type { FileExtension } from '../types';

export class FileManager {
  private static instance: FileManager;
  static getInstance() {
    if (!FileManager.instance) {
      FileManager.instance = new FileManager();
    }
    return FileManager.instance;
  }

  private files: Map<string, CrawlerFile>;

  constructor() {
    this.files = new Map();
  }

  addFile(title: string, file: CrawlerFile) {
    this.files.set(title, file);
  }

  extractFile(path: string, extension: FileExtension) {
    this.files.forEach((file) => {
      FileExtractor.extractFile(file, 'json', path);
    })
  }
}
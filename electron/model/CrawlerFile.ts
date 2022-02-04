export class CrawlerFile {
  private data: any;
  constructor(data: any) {
    this.data = data;
  }

  toString() {
    try {
      return JSON.stringify(this.data);
    } catch (err) {
      console.error('해당 파일은 JSONString 포맷으로 변환할 수 없습니다.::', typeof this.data);
      throw err;
    }
  }
}
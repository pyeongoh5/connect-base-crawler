
export class Company {
  private data: {[key: string]: string};

  constructor() {
    this.data = {};
  }

  seData(key: string, value: string) {
    if (key) {
      this.data[key] = value;
    }
  }

  getData(key: string): string {
    return this.data[key]
  }
  getAllData(): {[key: string]: string} {
    return this.data;
  }
}
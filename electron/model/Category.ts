interface CategoryItem {
  label: string;
  link: string;
}

export class Category {
  private id: string;
  private list: CategoryItem[];
  constructor(id: string) {
    this.id = id;
    this.list = [];
  }

  addItem(item: CategoryItem) {
    // console.log('addItem', item);
    this.list.push(item);
  }

  toString() {
    console.log('CategoryItem', this.id, this.list);
  }
}
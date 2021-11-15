export default class Paging<T> {
  private _raw: T[];

  constructor() {
    this._raw = [];
  }

  get raw() {
    return this._raw;
  }

  set(raw: T[] | undefined = []) {
    if (Array.isArray(raw)) {
      this._raw = raw;
    }
    return this;
  }

  getAll(): Page<T> {
    return {
      curPage: 0,
      totalElements: this._raw.length,
      totalPage: 1,
      item: this._raw,
    };
  }

  getByPaging(page: number, size: number): Page<T> {
    let item: T[], curPage: number;
    if (page < 0 || size < 0) {
      item = [];
      curPage = 0;
    } else if (page * size + 1 > this._raw.length) {
      // 当前页数超过总页数
      item = [];
      curPage = page;
    } else {
      item = [...this._raw.slice(page * size, (page + 1) * size)];
      curPage = page;
    }
    return {
      curPage,
      totalElements: this._raw.length,
      totalPage: getTotalPage(this._raw.length, size),
      item,
    };
  }
}

const getTotalPage = (totalElements: number, size: number): number => {
  if (size < 1) return 0;
  return Math.floor(totalElements / size) + 1;
};

export interface Page<T> {
  curPage: number;
  totalElements: number;
  totalPage: number;
  item: T[];
}

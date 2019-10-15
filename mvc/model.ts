export interface IItemModel {
  name: string;
  value: number;
}

export interface IItemData {
  name: string;
  value?: number;
  onChange?: (value: number) => void;
}

export default class Model {
  public items: Record<string, IItemModel> = {};
  public total: number = 100;

  public getEqualParts(n: number): number[] {
    const values = [];
    let total = this.total;

    while (total > 0 && n > 0) {
      let a = total / n;

      if (a % 2 == 0) {
        a = Math.floor(total / n);
      } else {
        a = Math.ceil(total / n);
      }

      total -= a;
      n--;
      values.push(a);
    }

    return values;
  }

  public getSumOfItems() {
    return Object
      .keys(this.items)
      .reduce((acc, item) => {
        const currValue = this.items[item].value;
        return isNaN(currValue) ? acc : acc + currValue;
      }, 0);
  }

  public isValidValue(value: number) {
    var value = isNaN(value) ? 0 : value;
    return this.getSumOfItems() + value <= this.total;
  }

  public hasNoItems() {
    return Object.keys(this.items).length === 0;
  }

  public makeSumEqualTotal(items: IItemData[], sum: number) {
    const deficit = this.total - sum;
    const lastIndex = items.length - 1;
    items[lastIndex].value = (items[lastIndex].value || 0) + deficit;
  }
}

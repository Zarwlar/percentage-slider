export interface IItemModel {
  name: string;
  value: number;
}

export interface IItemData {
  name: string;
  value: number;
  color?: string;
  onChange?: (value: number) => void;
}

export default class Model {
  public items: Record<string, IItemModel> = {};

  static readonly TOTAL: number = 100;

  // Gets the same cube of 100 by the given number of elements. For example
  // getEqualParts(2) -> [50, 50]
  // getEqualParts(3) -> [33, 33, 33]
  // getEqualParts(4) -> [25, 25, 25, 250
  // and so on..
  public getEqualParts(n: number): number[] {
    const values = [];
    let total = Model.TOTAL;

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

  public getSumOfItems(): number {
    return Object
      .keys(this.items)
      .reduce((acc, item) => {
        const currValue = this.items[item].value;
        return isNaN(currValue) ? acc : acc + currValue;
      }, 0);
  }

  public isValidValue(value?: number): boolean {
    var value = value && isNaN(value) ? 0 : value;
    return this.getSumOfItems() + (value || 0) <= Model.TOTAL;
  }

  public hasNoItems(): boolean {
    return Object.keys(this.items).length === 0;
  }

  public makeSumEqualTotal(items: IItemData[], sum: number): void {
    const deficit = Model.TOTAL - sum;
    const lastIndex = items.length - 1;
    items[lastIndex].value = (items[lastIndex].value || 0) + deficit;
  }
}

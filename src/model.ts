export interface LineModel {
  name: string;
  value: number;
}

export default class Model {
  public lines: Record<string, LineModel> = {};

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

  public getSumOfLines(): number {
    return Object
      .keys(this.lines)
      .reduce((acc, line) => {
        const currValue = this.lines[line].value;
        return isNaN(currValue) ? acc : acc + currValue;
      }, 0);
  }

  public isValidValue(value?: number): boolean {
    var value = value && isNaN(value) ? 0 : value;
    return this.getSumOfLines() + (value || 0) <= Model.TOTAL;
  }

  public hasNoLines(): boolean {
    return Object.keys(this.lines).length === 0;
  }
}

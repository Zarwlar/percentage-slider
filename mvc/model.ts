export default class Model {
  public items = {};
  public total: number = 100;

  public getEqualParts(n: number) {
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
      .reduce(function (acc, item) {
        var currValue = this.items[item].value;
        return isNaN(currValue) ? acc : acc + currValue;
      }, 0);
  }

  public isValidValue(value: number) {
    return this.getSumOfItems() + value <= this.total;
  }

  public hasNoItems() {
    return Object.keys(this.items).length === 0;
  }
}

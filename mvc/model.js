function Model() {
  this.items = {}
  this.total = 100;
}

Model.prototype.getEqualParts = function (n) {
  var values = [];
  var total = this.total;
  while (total > 0 && n > 0) {
    var a = total / n;
    if (a % 2 == 0)
      a = Math.floor(total / n);
    else
      a = Math.ceil(total / n);
    total -= a;
    n--;
    values.push(a);
  }
  return values;
}

Model.prototype.getSumOfItems = function () {
  var _this = this;
  return Object.keys(this.items).reduce(function (acc, item) {
    var currValue = _this.items[item].value;
    return isNaN(currValue) ? acc : acc + currValue;
  }, 0);
}

Model.prototype.isValidValue = function (value) {
  var value = isNaN(value) ? 0 : value;
  return this.getSumOfItems() + value <= this.total;
}

Model.prototype.hasNoItems = function () {
  return Object.keys(this.items).length === 0;
}

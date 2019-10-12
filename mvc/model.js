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

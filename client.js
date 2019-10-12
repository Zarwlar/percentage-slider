var node = document.getElementById('slider-root');
var addItemBtn = document.getElementById('add-item-btn');
var itemNameInput = document.getElementById('item-name-input');
var itemValueInput = document.getElementById('item-value-input');

const slider = new Slider(node);

addItemBtn.addEventListener('click', function () {
  var name = itemNameInput.value;
  var value = Number.parseInt(itemNameInput.value) || undefined;

  slider.addItem(name, value);
})

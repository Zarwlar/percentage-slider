var node = document.getElementById('slider-root');
var addItemBtn = document.getElementById('add-item-btn');
var removeItemBtn = document.getElementById('remove-item-btn');
var itemNameInput = document.getElementById('item-name-input');
var itemValueInput = document.getElementById('item-value-input');
var itemsList = document.getElementById('items-list');

const slider = new Slider(node);

addItemBtn.addEventListener('click', function () {
  var name = itemNameInput.value;
  var value = Number.parseInt(itemValueInput.value, 10);

  var fragment = document.createElement('div');
  fragment.classList.add(name);

  var nameFragment = document.createElement('span');
  nameFragment.classList.add('item-name');
  nameFragment.textContent = name;

  var valueFragment = document.createElement('span');
  valueFragment.classList.add('item-value');
  valueFragment.textContent = value;

  fragment.appendChild(nameFragment);
  fragment.appendChild(valueFragment)
  itemsList.appendChild(fragment);

  slider.addItem(name, value, updateValue);

  function updateValue(value) {
    valueFragment.textContent = value + '%';
  }
});

removeItemBtn.addEventListener('click', function () {
  var name = itemNameInput.value;

  slider.removeItem(name, remove);

  function remove() {
    var removingFragment = document.querySelector('.' + name);
    removingFragment.parentNode.removeChild(removingFragment);
  }
});

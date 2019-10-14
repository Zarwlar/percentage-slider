import Slider from './index';

const node = document.getElementById('slider-root')!;
const addItemBtn = document.getElementById('add-item-btn')!;
const removeItemBtn = document.getElementById('remove-item-btn')!;
const itemNameInput = document.getElementById('item-name-input')! as HTMLInputElement;
const itemValueInput = document.getElementById('item-value-input')! as HTMLInputElement;
const itemsList = document.getElementById('items-list')!;

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
  valueFragment.textContent = String(value);

  fragment.appendChild(nameFragment);
  fragment.appendChild(valueFragment)
  itemsList.appendChild(fragment);

  slider.addItem(name, value, updateValue);

  function updateValue(value: number) {
    valueFragment.textContent = value + '%';
  }
});

removeItemBtn.addEventListener('click', function () {
  var name = itemNameInput.value;

  slider.removeItem(name, remove);

  function remove() {
    var removingFragment = document.querySelector('.' + name);

    if (!removingFragment || !removingFragment.parentNode) { return; }

    removingFragment.parentNode.removeChild(removingFragment);
  }
});

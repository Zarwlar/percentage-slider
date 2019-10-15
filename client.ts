import Slider from './index';

const node = document.getElementById('slider-root')!;
const addItemBtn = document.getElementById('add-item-btn')!;
const removeItemBtn = document.getElementById('remove-item-btn')!;
const addSetOfItemsBtn = document.getElementById('add-set-of-items')!;
const itemNameInput = document.getElementById('item-name-input')! as HTMLInputElement;
const itemValueInput = document.getElementById('item-value-input')! as HTMLInputElement;
const itemsList = document.getElementById('items-list')!;

const slider = new Slider(node);

addItemBtn.addEventListener('click', function () {
  var name = itemNameInput.value;
  var value = Number.parseInt(itemValueInput.value, 10);

  const fragment = createSegmentValueView(name, value);
  const valueFragment = fragment.querySelector('.item-value')!;

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

addSetOfItemsBtn.addEventListener('click', function () {
  var itemsData = [
    { name: 'a', value: 15, onChange: undefined },
    { name: 'b', value: 60, onChange: undefined },
    { name: 'c', value: 15, onChange: undefined },
    { name: 'f', value: 1, onChange: undefined },
  ];

  const valueFragments = itemsData.map(item => {
    return createSegmentValueView(item.name, item.value);
  }).map(fragment => {
    return fragment.querySelector('.item-value')!;
  });

  const onChanges = valueFragments.map(valueFragment => {
    return (value: number) => {
      valueFragment.textContent = value + '%';
    }
  });

  const withOnChangeItemsData = itemsData.map((item, index) => {
    return {
      ...item,
      onChange: onChanges[index],
    };
  })

  slider.addItems(withOnChangeItemsData, {
    force: true,
  });
});

function createSegmentValueView(name: string, value: number) {
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

  return fragment;
}

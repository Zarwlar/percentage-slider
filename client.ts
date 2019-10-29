import PercentageSlider from './index';

const node = document.getElementById('slider-root')!;
const addItemBtn = document.getElementById('add-item-btn')!;
const addSetOfItemsBtn = document.getElementById('add-set-of-items')!;
const itemNameInput = document.getElementById('item-name-input')! as HTMLInputElement;
const itemValueInput = document.getElementById('item-value-input')! as HTMLInputElement;
const itemsList = document.getElementById('items-list')!;

const slider = new PercentageSlider(node);

addItemBtn.addEventListener('click', function () {
  const name = itemNameInput.value;
  const value = parseInt(itemValueInput.value, 10);
  const color = getRandomColor();

  const fragment = createSegmentValueView(name, value, color);
  const valueFragment = fragment.querySelector('.item-value')!;

  const itemData = {
    name,
    value,
    onChange: updateValue,
    color,
  };

  slider.addItem(itemData);

  function updateValue(value: number) {
    valueFragment.textContent = value + '%';
  }
});

addSetOfItemsBtn.addEventListener('click', function () {
  addSetOfItemsBtn.remove();

  const itemsData = [
    { name: 'Apples', value: 15, onChange: undefined, color: 'rgb(61, 91, 100)' },
    { name: 'Bananas', value: 60, onChange: undefined, color: 'rgb(186, 29, 127)' },
    { name: 'Oranges', value: 15, onChange: undefined, color: 'rgb(57, 126, 143)' },
    { name: 'Avocados', value: 1, onChange: undefined, color: 'rgb(152, 170, 177)' },
  ];

  const valueFragments = itemsData.map(item => {
    return createSegmentValueView(item.name, item.value, item.color);
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
  });

  slider.addItems(withOnChangeItemsData, {
    force: true,
  });

});

function createSegmentValueView(name: string, value: number, color: string) {
  const fragment = document.createElement('div');
  fragment.classList.add(name);
  fragment.classList.add('item-view');
  fragment.style.backgroundColor = color;

  const dataContainer = document.createElement('div');
  dataContainer.classList.add('data-container');

  const removeItemContainer = document.createElement('div');
  removeItemContainer.classList.add('remove-item-container');

  const removeButton = document.createElement('button');
  removeButton.textContent = `Remove item`;
  removeButton.classList.add('btn_remove');

  removeButton.addEventListener('click', function () {
    slider.removeItem(name, () => {
      fragment.remove();
    });
  });

  removeItemContainer.appendChild(removeButton);

  const nameFragment = document.createElement('span');
  nameFragment.classList.add('item-name');
  nameFragment.textContent = name;

  const valueFragment = document.createElement('span');
  valueFragment.classList.add('item-value');
  valueFragment.textContent = String(value);

  dataContainer.appendChild(nameFragment);
  dataContainer.appendChild(valueFragment);

  fragment.appendChild(dataContainer);
  fragment.appendChild(removeItemContainer);

  itemsList.appendChild(fragment);

  return fragment;
}

function getRandomColor(): string {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

window.handleSearchPageInputKeyup = (event) => {
  const searchVal = event.target.value;
  handleEnableInputCrossBtn(searchVal);
};

window.handleSearchPageInputClear = () => {
  document.querySelector('.search-input').value = '';
  document.querySelector('.close-icon').classList.add('hidden');
};

window.handleEnableInputCrossBtn = (searchVal) => {
  if (searchVal.length > 0) {
    document.querySelector('.close-icon').classList.remove('hidden');
  } else {
    document.querySelector('.close-icon').classList.add('hidden');
  }
};

window.customCounterRender = (count) => count;

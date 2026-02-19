const paramString = new URLSearchParams(window.location.search);
window.defaultOrdering = paramString.get('sort_by') || 'bestsellers';
window.sortLabel = document.querySelector('.sort-label-text');
window.sortButtonText = (ordering) => {
  switch (ordering) {
    case 'bestsellers':
      return DukaanData.DUKAAN_LANGUAGE.FEATURED;
    case 'better_discount':
      return DukaanData.DUKAAN_LANGUAGE.DISCOUNT;
    case 'price_low_to_high':
      return DukaanData.DUKAAN_LANGUAGE.PRICE_LOW_TO_HIGH;
    case 'price_high_to_low':
      return DukaanData.DUKAAN_LANGUAGE.PRICE_HIGH_TO_LOW;
    default:
      return DukaanData.DUKAAN_LANGUAGE.FEATURED;
  }
};

document
  .querySelector(`.sort-price-dropdown button[value="${defaultOrdering}"]`)
  .classList.add('selected');

window.sortDropDownHandler = (sortBy) => {
  const dropDownButton = document.querySelectorAll(
    '.sort-price-dropdown button'
  );
  dropDownButton.forEach((element) => element.classList.remove('selected'));
  document
    .querySelector(`.sort-price-dropdown button[value="${sortBy}"]`)
    .classList.add('selected');
  sortLabel.textContent = sortButtonText(sortBy);
  document.querySelector('.sort-btn-group').classList.remove('show');
};

document.querySelector('.sort-btn-toggle').addEventListener('click', () => {
  document.querySelector('.sort-btn-group').classList.toggle('show');
});

document.addEventListener('click', (event) => {
  const ele = event.target;
  if (
    document.querySelector('.sort-btn-group') &&
    !document.querySelector('.sort-btn-group').contains(ele)
  ) {
    document.querySelector('.sort-btn-group').classList.remove('show');
  }
});

window.noFilterDataHandler = () => {
  document
    .querySelector('.seller-section')
    .classList.add('main-container__no-filter');
};

// To Detect change in Selected Filter Tags
const filterTags = document.querySelector('filter-tags');
const callback = (mutationList) => {
  // eslint-disable-next-line no-restricted-syntax
  for (const mutation of mutationList) {
    if (mutation.type === 'childList') {
      filterTags.style.marginBottom = filterTags.querySelectorAll(
        '.tag-wrapper'
      ).length
        ? '12px'
        : '0';
    }
  }
};
const observer = new MutationObserver(callback);
observer.observe(filterTags, {
  attributes: true,
  childList: true,
  subtree: true,
});

window.getProductCardsAdditionalRenderer = (products) => {
  if (!products) return;
  const productsLength = products?.length;
  const sortContainer = document.querySelector('.sort-btn-group');

  if (!productsLength && !sortContainer.classList.contains('hidden')) {
    sortContainer.classList.add('hidden');
  } else {
    sortContainer.classList.remove('hidden');
  }
};

window.customScrollToTop = () => {
  const element = document.querySelector('category-cards');
  const y = element.getBoundingClientRect().top;
  const currentScrollPosition =
    document.documentElement.scrollTop || document.body.scrollTop;
  if (currentScrollPosition > y)
    window.scroll({
      top: y,
      behavior: 'smooth',
    });
};

window.appInitializer = () => {
  sortLabel.textContent = sortButtonText(defaultOrdering);
  checkCouponSticky();
  checkStoreClosedSticky();
  GAPage();
};

window.renderCategoriesList = (categories, nextUrl, firstFetch) => {
  if (categories?.length === 0 && firstFetch) {
    document
      .getElementById('main-categories-container')
      .classList.add('hidden');
    document.getElementById('no-categories-found').classList.remove('hidden');
    return;
  }

  customTag('categories-list-template', (element) =>
    categoriesRenderer(element, categories, nextUrl)
  );
};

window.renderShimmerForCategories = (count) => {
  const categoryListElem = document.querySelector('categories-list-template');
  const shimmerTemplate = document.getElementById('categories-card-shimmer');

  [...Array(count)].forEach(() => {
    const shimmerCard = document.importNode(shimmerTemplate.content, true);
    categoryListElem.appendChild(shimmerCard);
  });
};

window.categoriesRenderer = (mountElement, categories, next) => {
  document
    .querySelectorAll('.categories-box-shimmer')
    ?.forEach((el) => el.remove());

  const categoryCardTemplate = document.getElementById(
    'category-card-template'
  );

  categories.forEach((category) => {
    const categoryCard = document.importNode(
      categoryCardTemplate.content,
      true
    );

    categoryCard
      .querySelectorAll('a')
      .forEach((el) =>
        el.setAttribute(
          'href',
          `${getCategoryCardLink(category, DukaanData.DUKAAN_BASE_URL)}`
        )
      );

    categoryCard
      .querySelector('.category-image')
      .setAttribute('src', `${getCdnUrl(category.image, 700)}`);
    categoryCard.querySelector('.category-name').textContent = category.name;
    mountElement.appendChild(categoryCard);
  });

  const currentEventObserver = document.getElementById(
    'categories-list-observer'
  );

  if (next) {
    if (currentEventObserver) {
      currentEventObserver?.remove();
    }

    const newObserverElement = document.createElement('div');
    newObserverElement.setAttribute('id', 'categories-list-observer');
    mountElement.appendChild(newObserverElement);

    const observerElement = document.getElementById('categories-list-observer');

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        // renderShimmerForCategories(6);
        fetchStoreCategoriesInit({
          nextUrl: next,
          cb: renderCategoriesList,
        });
      }
    });
    observer.observe(observerElement);
  } else {
    currentEventObserver?.remove();
  }
};

window.fetchStoreCategoriesInit = null;

window.appInitializer = () => {
  fetchStoreCategoriesInit = fetchStoreCategories();
  fetchStoreCategoriesInit({
    cb: renderCategoriesList,
    loadPoint: 'categories-list-template',
    firstFetch: true,
  });
};
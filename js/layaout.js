window.showMenuDropdown = (event, parentId, index) => {
  const { target } = event;
  if (index === '0') {
    q$.selectAll(`.second-menu-item-list ul.menu-items-list`).addClassAll(
      'hidden'
    );
    q$.selectAll(`.third-menu-item-list ul.menu-items-list`).addClassAll(
      'hidden'
    );
    q$.selectAll(`.first-menu-item-list ul li`).removeClassAll(
      'active-nav-item'
    );
    q$.selectAll(`.second-menu-item-list ul li`).removeClassAll(
      'active-nav-item'
    );
    q$.selectAll(`.third-menu-item-list ul li`).removeClassAll(
      'active-nav-item'
    );
  } else if (index === '1') {
    q$.selectAll(`.third-menu-item-list ul.menu-items-list`).addClassAll(
      'hidden'
    );
    q$.selectAll(`.second-menu-list ul li`).removeClassAll(
      'active-nav-item'
    );
    q$.selectAll(`.third-menu-item-list ul li`).removeClassAll(
      'active-nav-item'
    );
  } else if (index === '2') {
    q$.selectAll(`.third-menu-list ul li`).removeClassAll(
      'active-nav-item'
    );
  }
  target.classList.add('active-nav-item');
  q$.select(
    `ul.menu-items-list[data-parent-dropdown-id="${parentId}"]`
  ).removeClass('hidden');
};

window.initMenuItems = () => {
  const menu = { shop: '/categories', contact: '/contact', about: '/about-us' };
  const header = document.getElementsByClassName('menu-content');
  const mobileHeader = document.getElementsByClassName('mobile-menu-content');
  const btns = [
    ...(header?.[0]?.children || []),
    ...(mobileHeader?.[0]?.children || []),
  ];
  
  // Safety check: filter out text nodes or elements without classList
  const validBtns = [...btns].filter(el => el && el.classList);

  const pathname =
    window.location.pathname.split(`/${DukaanData.DUKAAN_STORE.link}`)?.[1] ||
    '';
  if (validBtns.length > 1) {
    const active = Object.entries(menu).find((el) => pathname.includes(el[1]));
    validBtns.forEach((el) => {
      el.classList.remove('active');
    });
    if (active) {
      const elements = validBtns.filter((el) => el.id === active[0]);
      elements.forEach((ele) => {
        ele.classList.add('active');
      });
    } else if (pathname === '') {
      validBtns.forEach((ele) => {
        if (ele.id === 'home') {
          ele.classList.add('active');
        }
      });
    }
  }
};

window.initBottomMenu = () => {
  const page = window.location.href;
  const shopIcon = document.querySelector('#mobile-shop-icon');
  const homeIcon = document.querySelector('#mobile-home-icon');

  if (page.includes('/categories')) {
    if(shopIcon) {
      shopIcon.querySelector('.active-state')?.classList.remove('hidden');
      shopIcon.querySelector('.deactive-state')?.classList.add('hidden');
    }
    if(homeIcon) {
      homeIcon.querySelector('.active-state')?.classList.add('hidden');
      homeIcon.querySelector('.deactive-state')?.classList.remove('hidden');
    }
  } else {
    if(homeIcon) {
      homeIcon.querySelector('.active-state')?.classList.remove('hidden');
      homeIcon.querySelector('.deactive-state')?.classList.add('hidden');
    }
    if(shopIcon) {
      shopIcon.querySelector('.active-state')?.classList.add('hidden');
      shopIcon.querySelector('.deactive-state')?.classList.remove('hidden');
    }
  }
};

window.initMenu = () => {
  const hamburger = document.querySelector('.menu-hamburger');
  const closeMenuBtn = document.getElementById('closeMenu');
  const mobileMenu = document.querySelector('.mobile-menu-section');

  if(hamburger) {
    hamburger.addEventListener('click', () => {
      mobileMenu?.classList.add('active');
    });
  }

  if(closeMenuBtn) {
    closeMenuBtn.addEventListener('click', () => {
      mobileMenu?.classList.remove('active');
    });
  }

  const { isMobile } = deviceType();
  if (isMobile) {
    const vogueSlides = document.getElementsByClassName('slide');
    const g = document.getElementsByClassName('thumbImageWrapper');

    let currentSlide = 0;
    const maxSlide = vogueSlides.length - 1;

    Array.from(vogueSlides).forEach((slide, index) => {
      slide.style.transform = `translateX(${index * 100}%)`;
    });

    for (let i = 0, len = g.length; i < len; i += 1) {
      // eslint-disable-next-line no-loop-func
      (function (index) {
        g[i].onclick = function () {
          if (index > currentSlide) {
            if (currentSlide !== maxSlide) {
              currentSlide = index;
            }

            Array.from(vogueSlides).forEach((slide, idx) => {
              slide.style.transform = `translateX(${
                100 * (idx - currentSlide)
              }%)`;
            });
          } else {
            if (currentSlide !== 0) {
              currentSlide = index;
            }

            Array.from(vogueSlides).forEach((slide, idx) => {
              slide.style.transform = `translateX(${
                100 * (idx - currentSlide)
              }%)`;
            });
          }
        };
      })(i);
    }
  }
};

window.handleMenuHamburgerClick = () => {
  const dropdownBtn = document.querySelector('.menu-dropdown__button');
  const closeMenuBtn = document.getElementById('closeMenu');
  const mobileMenu = document.querySelector('.mobile-menu-section');

  dropdownBtn?.addEventListener('click', () => {
    mobileMenu?.classList.add('active');
  });

  closeMenuBtn?.addEventListener('click', () => {
    mobileMenu?.classList.remove('active');
  });
};

window.closeMenuItemDrawer = (e) => {
  if (e.target !== e.currentTarget) return;
  document.querySelector('.mobile-menu-section')?.classList.remove('active');
};

window.getDataFromLocalStorageV2 = (key) =>
  JSON.parse(localStorage.getItem(key)) || [];

// Removed the useless line: window.getDataFromLocalStorageV2 || [];

window.getHistoryStoragekey = () =>
  `v3-${window.DukaanData.DUKAAN_STORE.link}-search-history`;

window.setDataFromLocalStorage = (key, value) => {
  localStorage.setItem(getHistoryStoragekey(), JSON.stringify(value));
};

window.setHistory = (term) => {
  const prevHistory = window.getDataFromLocalStorageV2(getHistoryStoragekey());
  let newHistory;
  if (prevHistory.some((historyItem) => historyItem.term === term)) {
    newHistory = [
      { term },
      ...prevHistory.filter((historyItem) => historyItem.term !== term),
    ];
  } else {
    newHistory = [{ term }, ...prevHistory.slice(0, 3)];
  }
  window.setDataFromLocalStorage(getHistoryStoragekey(), newHistory);
  return newHistory;
};

window.clearRecentSearches = () => {
  localStorage.removeItem(getHistoryStoragekey());
  window.renderRecentSearches();
};

window.clearInputSearch = (e) => {
  e.preventDefault();
  const searchInput = document.querySelector('.search-input');
  if(searchInput) searchInput.value = '';
  
  document.querySelector('.search-meta')?.classList.remove('hidden');
  document.querySelector('.search-predictions')?.classList.add('hidden');
  document.querySelector('.prediction-section-heading')?.classList.add('hidden');
  document.querySelector('.cancel-btn')?.classList.add('hidden');
};

// Search

window.commonInitializer = () => {
  window.initMenu();
  window.initMenuItems();
  window.initBottomMenu();

  window.mobileMenuItems = document.querySelectorAll('.dropdown-menu');

  mobileMenuItems.forEach((element) => {
    let rotation = 0;
    element.querySelector('.icon')?.addEventListener('click', function () {
      rotation += 180;
      this.style.transform = `rotate(${rotation}deg)`;
      element.nextElementSibling?.classList.toggle('hidden');
      element.classList.toggle('menu-accordion-active');
    });
  });
  // for second level
  const subMenuItems = document.querySelectorAll('.mobile-sub-menu-item');
  subMenuItems.forEach((element) => {
    let rotation = 0;
    element.querySelector('.icon')?.addEventListener('click', function () {
      rotation += 180;
      this.style.transform = `rotate(${rotation}deg)`;
      element.nextElementSibling?.classList.toggle('hidden');
      element.classList.toggle('menu-active');
    });
  });
  // for third level

  const subSubMenuItems = document.querySelectorAll('.sub-sub-child-menu-item');

  subSubMenuItems.forEach((element) => {
    let rotation = 0;
    element.querySelector('.icon')?.addEventListener('click', function () {
      rotation += 180;
      this.style.transform = `rotate(${rotation}deg)`;
      element.nextElementSibling?.classList.toggle('hidden');
      element.classList.toggle('menu-active');
    });
  });
};

window.debounce = (callback, timeout = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      callback.apply(this, args);
    }, timeout);
  };
};

window.renderRecentSearches = () => {
  const recentSearchList = window.getDataFromLocalStorageV2(getHistoryStoragekey());
  if (recentSearchList.length > 0) {
    document
      .querySelectorAll('.recent-searches')
      .forEach((el) => el.classList.remove('hidden'));

    const recentSearchListElements = document.querySelectorAll(
      '.recent-searches-list'
    );
    recentSearchListElements.forEach((recentSearchListEl) => {
      recentSearchListEl.replaceChildren();

      const recentSearchItemTemplate = document.getElementById(
        'recent-searches-template'
      );

      recentSearchList.forEach((search) => {
        const resentSearchItemElement = document.importNode(
          recentSearchItemTemplate.content,
          true
        );
        resentSearchItemElement.querySelector(
          '.recent-search-item-text'
        ).textContent = search.term;
        resentSearchItemElement
          .querySelector('.recent-search-item')
          .setAttribute('onclick', `window.redirectToSearchPage('${search.term}')`);
        recentSearchListEl.appendChild(resentSearchItemElement);
      });
    });
  } else {
    document
      .querySelectorAll('.recent-searches')
      .forEach((el) => el.classList.add('hidden'));
  }
};

window.renderPredictions = (predictions) => {
  const searchPredictionsElement = document.querySelector(
    '.search-predictions'
  );
  const heading = document.querySelector('.prediction-section-heading');
  document.querySelector('.cancel-btn')?.classList.remove('hidden');
  
  if(searchPredictionsElement) searchPredictionsElement.innerHTML = '';
  if(searchPredictionsElement) searchPredictionsElement.classList.remove('hidden');
  if(heading) heading.classList.remove('hidden');
  document.querySelector('.search-meta')?.classList.add('hidden');

  const searchPredictionsTemplate = document.getElementById(
    'search-prediction-item'
  );

  if (!predictions.length) {
    document
      .querySelector('.prediction-section-heading')
      ?.classList.add('hidden');
    if(searchPredictionsElement) {
      searchPredictionsElement.innerHTML = `<p class="no-prediction">${window.DukaanData.DUKAAN_LANGUAGE.WE_FOUND_NO_SEARCH_RESULTS}!</p>`;
    }
    return;
  }

  predictions.forEach((prediction) => {
    const categoryItemElement = document.importNode(
      searchPredictionsTemplate.content,
      true
    );
    // FIXED: Changed categoryItem to categoryItemElement
    categoryItemElement
      .querySelector('.search-prediction-item')
      .setAttribute(
        'href',
        `${window.DukaanData.DUKAAN_BASE_URL}/products/${prediction.slug}`
      );

    categoryItemElement
      .querySelector('.search-prediction-item-image')
      .setAttribute('src', `${getCdnUrl(prediction.image, 500)}`);
    
    // FIXED: Changed categoryItem to categoryItemElement
    categoryItemElement.querySelector(
      '.prediction-label-product-name'
    ).textContent = prediction.name;

    const categoryName = prediction?.categories?.[0]?.name;
    if (categoryName) {
      // FIXED: Changed categoryItem to categoryItemElement
      categoryItemElement.querySelector(
        '.prediction-label-category-name'
      ).textContent = `In ${categoryName}`;
    }

    searchPredictionsElement.appendChild(categoryItemElement);
  });
};

window.handleSearchRedirection = (event) => {
  window.location.href = dknGetSearchUrl(event.target.value);
};

window.renderCategoryList = (categories, nextUrl, isFirstFetch) => {
  const categoryListElement = document.querySelector('.category-list');
  const categoryItemTemplate = document.getElementById('category-list-item');

  if (!categories?.length && isFirstFetch) {
    if(categoryListElement) categoryListElement.innerHTML = '';
    return;
  }

  if (isFirstFetch) {
    if(categoryListElement) categoryListElement.innerHTML = '';
  }

  categories.forEach((category) => {
    const categoryItemElement = document.importNode(
      categoryItemTemplate.content,
      true
    );
    if (category?.parent_id !== null) {
      categoryItemElement
        .querySelector('a')
        .setAttribute(
          'href',
          `${window.DukaanData.DUKAAN_BASE_URL}/categories/${category.slug}?category_ids=${category.id}`
        );
    } else {
      categoryItemElement
        .querySelector('a')
        .setAttribute(
          'href',
          `${getCategoryCardLink(category, window?.DukaanData?.DUKAAN_BASE_URL)}`
        );
    }
    // FIXED: Changed categoryItem to categoryItemElement
    categoryItemElement.querySelector('.category-name').textContent =
      category.name;
    // FIXED: Changed categoryItem to categoryItemElement
    categoryItemElement
      .querySelector('.category-image')
      .setAttribute('src', `${getCdnUrl(category.image, 500)}`);
    categoryListElement.appendChild(categoryItemElement);
  });

  const currentEventObserver = document.getElementById(
    'search-categories-list-observer'
  );

  if (nextUrl) {
    if (currentEventObserver) {
      currentEventObserver?.remove();
    }

    const newObserverElement = document.createElement('div');
    newObserverElement.setAttribute('id', 'search-categories-list-observer');
    categoryListElement.appendChild(newObserverElement);

    const observerElement = document.getElementById(
      'search-categories-list-observer'
    );

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        window.fetchStoreCategoriesSearchDrawer({
          nextUrl: nextUrl, cb: window.renderCategoryList
        });
      }
    });
    observer.observe(observerElement);
  } else {
    currentEventObserver?.remove();
  }
};

window.closeSearchDrawer = () => {
  const modal = document.getElementById('search-drawer');
  if(modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = 'initial';
  }
};

window.fetchStoreCategoriesSearchDrawer = null;

window.openSearchDrawer = () => {
  const modal = document.getElementById('search-drawer');
  if(modal) {
    modal.classList.remove('hidden');
    const input = modal.querySelector('.search-input');
    if(input) input.focus();
    document.body.style.overflow = 'hidden';
    window.renderRecentSearches();
    window.fetchStoreCategoriesSearchDrawer = window.fetchStoreCategories();
    window.fetchStoreCategoriesSearchDrawer({
      cb: window.renderCategoryList,
      firstFetch: true,
    });
  }
};

window.handleInputChange = (event) => {
  const query = event.target.value;
  if (query.length === 0) {
    document
      .querySelectorAll('.search-meta')
      .forEach((el) => el.classList.remove('hidden'));
    document
      .querySelectorAll('.prediction-section-heading')
      .forEach((el) => el.classList.add('hidden'));
    document
      .querySelectorAll('.search-predictions')
      .forEach((el) => {
         el.classList.add('hidden');
      });
    document.querySelector('.cancel-btn')?.classList.add('hidden');
    window.renderRecentSearches();
  }
  if (query.length < 2) return;
  // setHistory(query);
  fetch(
    `${window.DukaanData.CLIENT_API_ENDPOINT}/api/advanced-search/${window.Dukaan.DUKAAN_STORE.id}/`,
    {
      method: 'post',
      body: JSON.stringify({ query, page_size: 15 }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-requested-with': window?.DukaanData?.DUKAAN_SESSION_ID,
      },
    }
  )
    .then((res) => res.json())
    .then((res) => {
      const predictions = res?.data?.products || [];
      window.renderPredictions(predictions);
    })
    .catch(() => {});
};

window.APP_IDS = {
  ...(window.APP_IDS || {}),
  STORE_LOCATOR: '6286104b4f1ca25e2256f6b7',
};

window.addEventListener('DOMContentLoaded', () => {
  const menuItems = document.querySelectorAll(
    '.menu-dropdown:not(.menu-dropdown__button)'
  );

  let i = 0;
  for (i = 0; i < menuItems.length; i += 1) {
    menuItems[i].addEventListener('mouseenter', (event) => {
      document.querySelectorAll('.menu-drop-ul')?.forEach((el) => {
        el?.classList.add('hidden');
      });
      const { target: parentMenuItem } = event;
      const menuId = parentMenuItem.dataset.menuId || '';
      const menuDropDown = document.getElementById(menuId);
      if (menuDropDown) {
        menuDropDown.classList.remove('hidden');
        menuDropDown.style.position = 'absolute';
        menuDropDown.style.top = '100%';
        if (!menuDropDown.classList.contains('overflow-menu-container')) {
          menuDropDown.style.left = `${
            parentMenuItem.getBoundingClientRect().left
          }px`;
        }
      }
      
      // Note: Removing anonymous event listeners is technically impossible in JS
      // without keeping a reference. The logic below works for simple use cases
      // but might stack listeners if not managed carefully.
      const closeMenu = (e) => {
        const { target: hoverTarget } = e;
        const mainHeader = document.querySelector('.header-main');
        if (
          !(
            menuDropDown?.contains(hoverTarget) ||
            mainHeader?.contains(hoverTarget)
          )
        ) {
          menuDropDown?.classList?.add('hidden');
          document.removeEventListener('mousemove', closeMenu, true);
        }
      };
      
      document.addEventListener('mousemove', closeMenu, true);
    });
  }
});

window.addEventListener('DOMContentLoaded', () => {
  // eslint-disable-next-line no-restricted-syntax
  if (typeof axios !== 'undefined') {
    axios
      .get(
        `https://apps.mydukaan.io/public/v2/apps/store/${window.DukaanData.DUKAAN_STORE.id}/`
      )
      .then((response) => {
        const { store_apps_list: appList } = response.data;
        const availablePlugins = appList?.reduce((acc, item) => {
          if (item.isActive) {
            // eslint-disable-next-line no-underscore-dangle
            acc[item._id] = item;
          }
          return acc;
        }, {});
        const isStoreLocatorPresent = Boolean(
          !!availablePlugins && availablePlugins[window.APP_IDS.STORE_LOCATOR]
        );
        const storeLocatorTags = document.querySelectorAll('.store-locator-link');
        if (isStoreLocatorPresent) {
          storeLocatorTags.forEach((tag) => tag.classList.remove('hidden'));
        } else {
          storeLocatorTags.forEach((tag) => tag.remove());
        }
      })
      .finally(() => {
        const menuItems = document.querySelectorAll(
          '.menu-dropdown:not(.menu-dropdown__button)'
        );
        const mainMenu = document.querySelector('.menu-main');
        const dropdownBtn = document.querySelector('.menu-dropdown__button');
        
        if(!mainMenu || !dropdownBtn) return;

        const mainMenuWidth = mainMenu.offsetWidth;
        let menuWidth = 0;
        let i = 0;
        for (i = 0; i < menuItems.length; i += 1) {
          menuWidth += menuItems[i].offsetWidth + 24;
          if (
            menuWidth >=
            mainMenuWidth - dropdownBtn.offsetWidth
          ) {
            document.fonts.ready.then(() => {
              dropdownBtn.classList.remove('hidden');
            });
            break;
          }
        }
      })
      .catch(() => {});
  }
});

window.redirectToSearchPage = (value) => {
  value = value.trim();
  if (Boolean(value) && value.length > 0) {
    window.setHistory(value);
    window.location.href = window.dknGetSearchUrl(value);
  }
};

window.splideSlideIndex = (allImages, primaryImage) => {
  const index = allImages?.indexOf(primaryImage);
  window?.splideSlider?.go(index);
};

// variant modal functions
window.handleModalChanges = (product, currentSKU) => {
  const element = document.querySelector('.product-variant-selection-modal');
  if (!element) return;

  if (element.querySelector('.product-name')) {
    element.querySelector('.product-name').textContent = `${product.name}`;
  }

  // renders product modal carousel with splide if exist.
  const productSplideTemplate = document.querySelector(
    '#product-modal-splide-container'
  );

  if (productSplideTemplate) {
    const productSplideList = element.querySelector('.splide__list');

    if (typeof window.splideSlider === 'undefined') {
      if (product.all_images?.length > 1) {
        productSplideList.replaceChildren();
        // eslint-disable-next-line no-restricted-syntax
        for (const image of product.all_images) {
          const productSplide = document.importNode(
            productSplideTemplate.content,
            true
          );
          productSplide
            .querySelector('.product-modal-splide-image')
            .setAttribute(
              'src',
              `${window.getCdnUrl(image || currentSKU.primary_image, 700)}`
            );
          productSplideList.appendChild(productSplide);
        }

        window.splideSlider = new Splide('#splide-product-modal-images', {
          type: 'loop',
          autoplay: false,
          arrows: true,
          pauseOnHover: false,
          pagination: false,
          interval: 1000,
          classes: {
            arrows: 'splide__arrows',
          },
        }).mount();
      } else {
        const productImagesElem = element.querySelector('.product-images');
        if (productImagesElem) {
          productImagesElem.replaceChildren();

          const imageWrapperElem = document.createElement('div');
          imageWrapperElem.classList.add('image-wrapper');
          productImagesElem.appendChild(imageWrapperElem);

          const imgElem = document.createElement('img');
          imgElem.setAttribute('class', 'product-image');
          imageWrapperElem.appendChild(imgElem);
          element
            .querySelector('.product-image')
            .setAttribute(
              'src',
              `${window.getCdnUrl(product.image || currentSKU.primary_image, 700)}`
            );
        }
      }
    }
    if (!currentSKU?.primary_image.includes('category-def.jpg')) {
      const allImages = product?.all_images || product?.image;
      if (typeof window.splideSlideIndex !== 'undefined')
        window.splideSlideIndex(allImages, currentSKU.primary_image);
    }
  }

  const originalPrice = currentSKU?.original_price;
  const sellingPrice = currentSKU?.selling_price;

  if (element.querySelector('.product-selling-price')) {
    element.querySelector('.product-selling-price').textContent =
      window.formatMoney(sellingPrice);
  }

  if (element.querySelector('.product-original-price')) {
    if (originalPrice === sellingPrice) {
      element.querySelector('.product-original-price').classList.add('hidden');
    } else {
      element
        .querySelector('.product-original-price')
        .classList.remove('hidden');
      element.querySelector('.product-original-price').textContent =
        window.formatMoney(originalPrice);
    }
  }

  if (element.querySelector('.product-discount-badge')) {
    if (originalPrice === sellingPrice) {
      element.querySelector('.product-discount-badge').classList.add('hidden');
    } else {
      element
        .querySelector('.product-discount-badge')
        .classList.remove('hidden');
      const discount = window.calculateDiscount(originalPrice, sellingPrice);
      if (discount > 0) {
        element.querySelector(
          '.product-discount-badge'
        ).textContent = `(${discount}% OFF)`;
      }
    }
  }

  if (currentSKU.meta.size) {
    const sizeListHeadingLabel = element.querySelector(
      '.size-selection-heading'
    );

    if (sizeListHeadingLabel) {
      if (currentSKU.meta.size.attributeLabel) {
        sizeListHeadingLabel.innerHTML = `${currentSKU.meta.size.attributeLabel}`;
      } else {
        sizeListHeadingLabel.innerHTML = window.DukaanData.DUKAAN_LANGUAGE.SIZE;
      }
    }
  }

  if (currentSKU.meta.color) {
    const colorListHeadingLabel = element.querySelector(
      '.color-selection-heading'
    );

    if (colorListHeadingLabel) {
      if (currentSKU.meta.color.attributeLabel) {
        colorListHeadingLabel.innerHTML = `${currentSKU.meta.color.attributeLabel}`;
      } else {
        colorListHeadingLabel.innerHTML =
          window.DukaanData.DUKAAN_LANGUAGE.COLOR;
      }
    }
  }
};

window.handleVariantChange = (productUUID, { buttonTemplateId } = {}) => {
  if (!productUUID) return;

  const addToBagElement = document.querySelector('add-to-bag-button');
  const buyNowElement = document.querySelector('buy-now-button-load-point');

  const formData = new FormData(
    document.querySelector('form#variant-selection')
  );
  const data = [...formData.entries()].reduce((acc, [key, value]) => {
    acc[key] = value;
    return acc;
  }, {});

  const product = window.DukaanData.PRODUCTS_MAP[productUUID];
  const { skus } = product;
  const currentSKU = skus.find(
    (sku) =>
      (!data.size || sku.meta.size.value === data.size) &&
      (!data.color || sku.meta.color.value === data.color)
  );
  if (!currentSKU) return;

  if (addToBagElement) {
    addToBagElement.dataset.productUuid = productUUID;
    addToBagElement.dataset.skuUuid = currentSKU.uuid;
    window.addToBagButtonRenderer(addToBagElement);
  }

  if (buyNowElement) {
    buyNowElement.dataset.productUuid = productUUID;
    buyNowElement.dataset.skuUuid = currentSKU.uuid;
    window.buyNowButtonRenderer(buyNowElement);
  }

  if (buttonTemplateId) {
    const additionalButtonElement = document.querySelector(buttonTemplateId);
    additionalButton.dataset.productUuid = productUUID;
    additionalButton.dataset.skuUuid = currentSKU.uuid;

    if (
      buttonTemplateId === `[data-template-id="modal-wishlist-button-template"]`
    ) {
      if (typeof window.addToWishlistButtonRenderer !== 'undefined') {
        window.addToWishlistButtonRenderer(additionalButtonElement);
      }
    }
  }
  window.handleModalChanges(product, currentSKU);
};

window.redirectToSearchPageOnSubmit = (e) => {
  e.preventDefault();
  const formData = new FormData(document.querySelector('form#search-form'));
  const value = formData.get('search');
  window.redirectToSearchPage(value);
};

// FIXED: Syntax error in debounce closure
window.onInputChange = window.debounce((event) => {
  window.handleInputChange(event);
}, 300);

window.getCustomDiscountText = (discount) => `${discount}% OFF`;

window.productCardAdditionalRenderer = (productCard, product) => {
  // need to reconsider this during add-to-bag-refactor
  if (!product.in_stock) {
    // FIXED: Removed whitespace and fixed syntax
    window.q$.selectAll('.dkn-product-card-price-label', productCard)
      .addClassAll('hidden');
    window.q$.selectAll('.dkn-sold-out-label', productCard)
      .removeClassAll('hidden');
  }
  
  // REMOVED: Broken function definition block below.
  // Assuming this function is defined elsewhere or was a copy-paste error.
  // If you need to render the carousel here, uncomment and fix:
  // window.productCardImageCarouselRenderer(product, productCard);
};
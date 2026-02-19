window.appInitializer = () => {
  // Initialize necessary analytics and data mapping
  hashProductMap(window.DukaanData.DUKAAN_CATALOG);
  druidStorePageView();
  fetchCouponsAndOffersOnIndex();
  initProductSplide();

  let loading = false;
  const offsetCount = DukaanData.DUKAAN_CATALOG_PROPS.offset;
  let { offset } = DukaanData.DUKAAN_CATALOG_PROPS;
  let hasMore = true;

  // Fetch product coupons based on available categories
  fetchProductCoupons(getProductIdsFromCategories(DukaanData.DUKAAN_CATALOG));

  const productListMountElement = document.querySelector(
    'best-seller-load-point'
  );
  
  // Initialize wishlist buttons if the function exists
  if (typeof dknRenderWishlistButtons !== 'undefined') {
    window.dknRenderWishlistButtons(productListMountElement);
  }

  // Function to fetch Best Sellers via API
  const fetchBestSellers = async () => {
    if (loading) return;
    loading = true;

    try {
      const response = await fetch(
        `${window.DukaanData.CLIENT_API2_ENDPOINT}/api/store/buyer/${window.DukaanData.DUKAAN_STORE.link}/bestseller/v3/?offset=${offset}`
      );
      const res = await response?.json();
      const { results: rawResults = [] } = res || {};
      const count = rawResults?.length;
      
      // Serialize results for the frontend and filter out empty categories
      const results = window.bestSellerSerializer(
        rawResults?.filter((rR) => rR.products.length > 0),
        DukaanData.DUKAAN_USER_SELECTED_LANGUAGE
      );

      hashProductMap(results);
      hashCategory(results);
      
      // Render 8 products per category as per the template
      renderBestSellers(results, 8);

      if (count < offsetCount) {
        hasMore = false;
        removeScroller({ observeThis: 'bestseller-observer' });
      } else {
        hasMore = true;
        offset += offsetCount;
      }
    } catch (error) {
      console.error('Error fetching best sellers:', error);
      // Handle error or stop loading if needed
      hasMore = false;
    } finally {
      loading = false;
    }
  };

  // Setup Infinite Scroll Observer
  applyScroller({
    loading,
    hasMore,
    cb: fetchBestSellers,
    observeThis: 'bestseller-observer',
    loadPoint: document.querySelector('best-seller-load-point'),
  });

  // Initialize Desktop Banner Slider
  if (document.querySelector('#splide-banners')) {
    new Splide('#splide-banners', {
      type: 'slide',
      autoplay: true,
      interval: 5000,
      arrows: false,
      rewind: true,
      pauseOnHover: false,
    }).mount();
  }

  // Initialize Mobile Banner Slider
  if (document.querySelector('#splide-banners-mobile')) {
    new Splide('#splide-banners-mobile', {
      type: 'slide',
      autoplay: true,
      interval: 5000,
      arrows: false,
      rewind: true,
      pauseOnHover: false,
    }).mount();
  }
};
window.mainCarousel = null;
window.thumbnails = null;

document.addEventListener('DOMContentLoaded', () => {
  // Check if Splide library is loaded
  if (typeof Splide === 'undefined') {
    console.error('Splide library is missing.');
    return;
  }

  mainCarousel = new Splide('#main-carousel', {
    type: 'fade',
    rewind: true,
    pagination: false,
    arrows: false,
  });
  
  mainCarousel.on('click', (e) => {
    if (typeof playProductVideo === 'function') {
      playProductVideo(e);
    }
  });

  thumbnails = new Splide('#thumbnail-carousel', {
    fixedWidth: 140,
    fixedHeight: 175,
    perPage: 3,
    gap: 10,
    pagination: false,
    isNavigation: true,
    arrows: true,
    direction: 'ttb',
    height: '420px',
    classes: {
      prev: 'active',
    },
    breakpoints: {
      // MATCHES CSS MEDIA QUERY: Destroys slider at 1024px
      // This allows the CSS 'flex-wrap' to take effect for the grid layout.
      1024: {
        destroy: true, 
      },
      600: {
        // This acts as a fallback if the 1024 breakpoint doesn't trigger
        direction: false,
      },
    },
  });

  thumbnails.on('click', () => {
    if (typeof pauseAllProductVideos === 'function') {
      pauseAllProductVideos();
    }
  });

  mainCarousel.sync(thumbnails);
  mainCarousel.mount();
  thumbnails.mount();
});

window.SIMILAR_PRODUCT_LIMIT = 0;

window.appInitializer = () => {
  // Check if deviceType function exists before calling
  const isMobile = (typeof deviceType === 'function') ? deviceType().isMobile : window.innerWidth < 768;
  
  SIMILAR_PRODUCT_LIMIT = isMobile ? 6 : 12;

  // Ensure DukaanData exists
  if (!window.DukaanData || !window.DukaanData.DUKAAN_PRODUCT) {
    console.error('DukaanData is not defined.');
    return;
  }

  const productFromServer = DukaanData.DUKAAN_PRODUCT;
  
  const serializedSKUs = (typeof serializeSKUs === 'function') 
    ? serializeSKUs(productFromServer.skus || []) 
    : [];
    
  const attributes = (typeof getAllProductAttributeValues === 'function')
    ? getAllProductAttributeValues(serializedSKUs)
    : [];

  const product = {
    ...productFromServer,
    skus: serializedSKUs,
    attributes,
  };
  window.DukaanData.PRODUCTS_DETAILS = product;
  window.DukaanData.PRODUCTS_MAP = {
    ...(DukaanData.PRODUCTS_MAP || []),
    [product.uuid]: product,
  };

  if (typeof checkCouponSticky === 'function') checkCouponSticky();
  if (typeof checkStoreClosedSticky === 'function') checkStoreClosedSticky();
  
  if (typeof fetchPDPSizeChartData !== 'undefined') {
    fetchPDPSizeChartData();
  }
  
  retrieveSKUs(productFromServer, () => {
    if (typeof addSKUToBagFromQueryParams !== 'undefined') {
      addSKUToBagFromQueryParams();
    }
  });
  
  if (typeof fetchCouponsAndOffersOnPDP === 'function') fetchCouponsAndOffersOnPDP();
  if (typeof setFooterBottomMarginEqualToHeightOfPDPButtonWrapperClassElement === 'function') {
    setFooterBottomMarginEqualToHeightOfPDPButtonWrapperClassElement();
  }
  
  if (typeof initCountdownTimer !== 'undefined') initCountdownTimer();
  
  if (typeof fetchSimilarProducts === 'function') {
    window.fetchSimilarProducts(productFromServer);
  }
  
  if (typeof druidProductPageView === 'function') druidProductPageView();

  const mountElem = document.querySelector('.detail-inner');
  if (mountElem && typeof dknRenderWishlistButtons !== 'undefined') {
    window.dknRenderWishlistButtons(mountElem);
  }
};

window.scrollToSKUImage = (activeSKU) => {
  if (!activeSKU || !activeSKU.primary_image) return;
  
  const primaryImage = activeSKU.primary_image;
  const allImages = (window.DukaanData && window.DukaanData.DUKAAN_PRODUCT) 
    ? window.DukaanData.DUKAAN_PRODUCT.all_images 
    : [];
  
  if (allImages.length > 0) {
    const index = allImages.indexOf(primaryImage);
    if (index >= 0) {
      if (mainCarousel) mainCarousel.go(index);
      
      // Only scroll thumbnails if the slider is active (not destroyed on mobile)
      if (thumbnails && thumbnails.State && thumbnails.State.isInitialized) { 
        thumbnails.go(index);
      }
    }
  }
};

// Initialize App
if (typeof deviceType !== 'undefined') {
  window.appInitializer();
} else {
  window.appInitializer();
}
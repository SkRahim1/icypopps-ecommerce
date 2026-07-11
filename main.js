import './style.css';
import { products, flavorShowcase } from './src/products.js';

// Application State
const state = {
  cart: [],
  wishlist: [],
  currentFlavorIndex: 0,
  currentTestimonialIndex: 0,
  currentHeroSlideIndex: 0,
  activePromo: null,
  activePromoDiscount: 0 // 0.2 means 20%
};

// DOM Elements
const DOM = {
  cartDrawer: document.getElementById('cart-drawer'),
  cartOverlay: document.getElementById('cart-overlay'),
  cartCountBadge: document.getElementById('cart-count'),
  cartDrawerCount: document.getElementById('cart-drawer-count'),
  cartDrawerItems: document.getElementById('cart-drawer-items'),
  cartSubtotal: document.getElementById('cart-subtotal'),
  promoInput: document.getElementById('promo-code'),
  applyPromoBtn: document.getElementById('apply-promo'),
  checkoutBtn: document.getElementById('checkout-btn'),
  closeCart: document.getElementById('close-cart'),
  
  wishlistDrawer: document.getElementById('wishlist-drawer'),
  wishlistOverlay: document.getElementById('wishlist-overlay'),
  wishlistCountBadge: document.getElementById('wishlist-count'),
  wishlistDrawerCount: document.getElementById('wishlist-drawer-count'),
  wishlistDrawerItems: document.getElementById('wishlist-drawer-items'),
  closeWishlist: document.getElementById('close-wishlist'),

  mobileNavDrawer: document.getElementById('mobile-nav-drawer'),
  closeMobileNavBtn: document.getElementById('close-mobile-nav'),
  mobileMenuToggle: document.getElementById('mobile-menu-toggle'),

  searchModal: document.getElementById('search-modal'),
  searchToggle: document.getElementById('search-toggle'),
  closeSearchBtn: document.getElementById('close-search'),
  searchInput: document.getElementById('search-input'),
  searchResults: document.getElementById('search-results'),

  quickviewModal: document.getElementById('quickview-modal'),
  closeQuickviewBtn: document.getElementById('close-quickview'),
  quickviewContent: document.getElementById('quickview-grid-content'),

  checkoutModal: document.getElementById('checkout-modal'),
  closeCheckoutBtn: document.getElementById('close-checkout'),
  checkoutForm: document.getElementById('checkout-form'),
  checkoutItemsList: document.getElementById('checkout-items-list'),
  checkoutItemsTotal: document.getElementById('checkout-items-total'),
  checkoutShipping: document.getElementById('checkout-shipping'),
  checkoutDiscountRow: document.getElementById('checkout-discount-row'),
  checkoutDiscount: document.getElementById('checkout-discount'),
  checkoutGrandTotal: document.getElementById('checkout-grand-total'),

  successOverlay: document.getElementById('success-overlay'),
  successSummary: document.getElementById('success-order-summary'),
  closeSuccessBtn: document.getElementById('close-success-btn'),

  productsGrid: document.getElementById('products-grid'),
  flavorTabs: document.getElementById('flavor-tabs'),
  flavorCard: document.getElementById('flavor-details-card'),
  flavorImage: document.getElementById('flavor-pop-image'),
  flavorName: document.getElementById('flavor-pop-name'),
  flavorTagline: document.getElementById('flavor-pop-tagline'),
  shopFlavorBtn: document.getElementById('shop-flavor-btn'),

  // Hero section and slideshow
  heroSlidesWrapper: document.getElementById('hero-slides-wrapper'),
  heroSliderPagination: document.getElementById('hero-slider-pagination'),

  // Featured Product elements
  heroMainImg: document.getElementById('hero-main-img'),
  heroThumbs: document.querySelectorAll('.media-thumbnails .thumb'),
  heroQtyInput: document.querySelector('.quick-add-container .qty-input'),
  heroQtyDec: document.querySelector('.quick-add-container .qty-dec'),
  heroQtyInc: document.querySelector('.quick-add-container .qty-inc'),
  heroOptionBtns: document.querySelectorAll('.quick-add-container .option-btn'),
  heroAddToCartBtn: document.querySelector('.quick-add-container .hero-add-to-cart'),

  // Testimonials
  testimonialTrack: document.getElementById('testimonial-track'),
  prevReviewBtn: document.getElementById('prev-review'),
  nextReviewBtn: document.getElementById('next-review'),

  // Forms
  contactForm: document.getElementById('contact-form'),
  contactSuccess: document.getElementById('contact-success'),
  newsletterForm: document.getElementById('newsletter-form'),
  newsletterSuccess: document.getElementById('newsletter-success'),
};

// Initialize Application
function init() {
  loadLocalStorage();
  renderProducts();
  renderFlavorTabs();
  selectFlavor(0);
  initHeroSlider();
  bindEvents();
  updateCartUI();
  updateWishlistUI();
}

// ----------------------------------------------------
// STATE PERSISTENCE
// ----------------------------------------------------
function saveLocalStorage() {
  localStorage.setItem('bubblebox_cart', JSON.stringify(state.cart));
  localStorage.setItem('bubblebox_wishlist', JSON.stringify(state.wishlist));
}

function loadLocalStorage() {
  const localCart = localStorage.getItem('bubblebox_cart');
  const localWishlist = localStorage.getItem('bubblebox_wishlist');
  if (localCart) state.cart = JSON.parse(localCart);
  if (localWishlist) state.wishlist = JSON.parse(localWishlist);
}

// ----------------------------------------------------
// HERO SLIDER LOGIC (GIF Background Columns)
// ----------------------------------------------------
let sliderInterval = null;

function initHeroSlider() {
  if (!DOM.heroSlidesWrapper) return;
  
  const slides = DOM.heroSlidesWrapper.querySelectorAll('.hero-slide-item');
  const slideCount = slides.length;
  
  if (slideCount === 0) return;

  // Render pagination dots
  if (DOM.heroSliderPagination) {
    DOM.heroSliderPagination.innerHTML = Array.from({ length: slideCount })
      .map((_, idx) => `<span class="slider-dot ${idx === 0 ? 'active' : ''}" data-index="${idx}"></span>`)
      .join('');
  }

  // Auto transition
  startSliderAutoplay();

  // Click on pagination dots
  const dots = document.querySelectorAll('.slider-dot');
  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      stopSliderAutoplay();
      const targetIndex = parseInt(dot.dataset.index);
      selectHeroSlide(targetIndex);
      startSliderAutoplay();
    });
  });
}

function selectHeroSlide(index) {
  state.currentHeroSlideIndex = index;
  const slides = DOM.heroSlidesWrapper.querySelectorAll('.hero-slide-item');
  const dots = document.querySelectorAll('.slider-dot');

  slides.forEach((slide, idx) => {
    if (idx === index) {
      slide.classList.add('active');
    } else {
      slide.classList.remove('active');
    }
  });

  dots.forEach((dot, idx) => {
    if (idx === index) {
      dot.classList.add('active');
    } else {
      dot.classList.remove('active');
    }
  });
}

function nextHeroSlide() {
  const slides = DOM.heroSlidesWrapper.querySelectorAll('.hero-slide-item');
  const nextIdx = (state.currentHeroSlideIndex + 1) % slides.length;
  selectHeroSlide(nextIdx);
}

function startSliderAutoplay() {
  sliderInterval = setInterval(nextHeroSlide, 5000); // 5 seconds
}

function stopSliderAutoplay() {
  if (sliderInterval) {
    clearInterval(sliderInterval);
  }
}

// ----------------------------------------------------
// PRODUCT CATALOG RENDERING
// ----------------------------------------------------
function renderProducts() {
  if (!DOM.productsGrid) return;
  DOM.productsGrid.innerHTML = products.map(prod => {
    const defaultOption = prod.options[0];
    const isWishlisted = state.wishlist.includes(prod.id);
    const wishIconFill = isWishlisted ? 'currentColor' : 'none';
    
    return `
      <div class="product-card" data-id="${prod.id}">
        <span class="card-badge">SALE</span>
        <div class="card-media">
          <img src="${prod.images[0]}" alt="${prod.title}" class="prod-img-main" id="img-${prod.id}" />
          <div class="media-hover-overlay">
            <button class="wishlist-btn-toggle" data-id="${prod.id}" aria-label="Add to Wishlist">
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="${wishIconFill}"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
            </button>
            <button class="quickview-trigger" data-id="${prod.id}" aria-label="Quick View">
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
            </button>
          </div>
        </div>
        <div class="card-info">
          <span class="category">${prod.category}</span>
          <h3>${prod.title}</h3>
          <div class="price-row">
            <span class="price" id="price-${prod.id}">Rs. ${defaultOption.price.toFixed(2)}</span>
            <span class="regular" id="reg-price-${prod.id}">Rs. ${defaultOption.regularPrice.toFixed(2)}</span>
          </div>
          <p class="desc">${prod.description}</p>
          <div class="card-actions">
            <select class="option-select" data-id="${prod.id}">
              ${prod.options.map(opt => `<option value="${opt.name}">${opt.name}</option>`).join('')}
            </select>
            <button class="primary-btn quick-add-btn" data-id="${prod.id}">ADD</button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// ----------------------------------------------------
// INTERACTIVE FLAVORS TAB RENDERING
// ----------------------------------------------------
function renderFlavorTabs() {
  if (!DOM.flavorTabs) return;
  DOM.flavorTabs.innerHTML = flavorShowcase.map((flav, idx) => `
    <button class="flavor-tab ${idx === 0 ? 'active' : ''}" data-index="${idx}">
      ${flav.name}
    </button>
  `).join('');
}

function selectFlavor(index) {
  state.currentFlavorIndex = index;
  const flavor = flavorShowcase[index];
  
  // Highlight active tab
  const tabs = document.querySelectorAll('.flavor-tab');
  tabs.forEach((tab, idx) => {
    if (idx === index) tab.classList.add('active');
    else tab.classList.remove('active');
  });

  // Animate and update Flavor details card
  if (DOM.flavorCard) {
    // Fade elements out briefly
    DOM.flavorImage.style.transform = 'scale(0.8) rotate(15deg)';
    DOM.flavorImage.style.opacity = '0';
    DOM.flavorName.style.opacity = '0';
    DOM.flavorTagline.style.opacity = '0';
    
    setTimeout(() => {
      // Set background color/gradient
      const cardBg = DOM.flavorCard.querySelector('.flavor-card-background');
      if (cardBg) cardBg.style.background = flavor.gradient;
      
      // Update contents
      DOM.flavorImage.src = flavor.image;
      DOM.flavorImage.alt = `${flavor.name} Pani Puri`;
      DOM.flavorName.textContent = flavor.name;
      DOM.flavorTagline.textContent = flavor.tagline;
      
      // Fade elements back in
      DOM.flavorImage.style.transform = 'scale(1) rotate(0deg)';
      DOM.flavorImage.style.opacity = '1';
      DOM.flavorName.style.opacity = '1';
      DOM.flavorTagline.style.opacity = '1';
    }, 250);
  }
}

// ----------------------------------------------------
// SHOPPING CART LOGIC
// ----------------------------------------------------
function addToCart(productId, optionName, quantity = 1) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const option = product.options.find(o => o.name === optionName);
  if (!option) return;

  // Check if item already exists in cart with same option
  const existingItemIndex = state.cart.findIndex(
    item => item.id === productId && item.option === optionName
  );

  if (existingItemIndex > -1) {
    state.cart[existingItemIndex].quantity += quantity;
  } else {
    state.cart.push({
      id: productId,
      title: product.title,
      option: optionName,
      price: option.price,
      image: product.images[0],
      quantity: quantity
    });
  }

  saveLocalStorage();
  updateCartUI();
  openDrawer(DOM.cartDrawer, DOM.cartOverlay);
}

// Update quantity
function updateCartQuantity(productId, optionName, quantity) {
  const itemIndex = state.cart.findIndex(
    item => item.id === productId && item.option === optionName
  );
  if (itemIndex === -1) return;

  if (quantity <= 0) {
    state.cart.splice(itemIndex, 1);
  } else {
    state.cart[itemIndex].quantity = quantity;
  }
  
  saveLocalStorage();
  updateCartUI();
}

function removeFromCart(productId, optionName) {
  state.cart = state.cart.filter(item => !(item.id === productId && item.option === optionName));
  saveLocalStorage();
  updateCartUI();
}

function updateCartUI() {
  const totalCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  
  // Update Header badge counts
  if (DOM.cartCountBadge) DOM.cartCountBadge.textContent = totalCount;
  if (DOM.cartDrawerCount) DOM.cartDrawerCount.textContent = totalCount;

  // Render Drawer items
  if (!DOM.cartDrawerItems) return;
  if (state.cart.length === 0) {
    DOM.cartDrawerItems.innerHTML = `
      <div class="cart-empty-message">
        <svg viewBox="0 0 24 24" width="48" height="48" stroke="currentColor" stroke-width="1.5" fill="none"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
        <p>Your cart is empty.</p>
      </div>
    `;
    DOM.cartSubtotal.textContent = "Rs. 0.00";
    return;
  }

  DOM.cartDrawerItems.innerHTML = state.cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.title}" class="cart-item-img" />
      <div class="cart-item-details">
        <h4>${item.title}</h4>
        <div class="option">${item.option}</div>
        <div class="price-row">
          <span class="price">Rs. ${(item.price * item.quantity).toFixed(2)}</span>
          <div class="qty-stepper">
            <button class="cart-qty-dec" data-id="${item.id}" data-option="${item.option}">-</button>
            <input type="number" value="${item.quantity}" readonly />
            <button class="cart-qty-inc" data-id="${item.id}" data-option="${item.option}">+</button>
          </div>
        </div>
        <button class="remove-item-btn" data-id="${item.id}" data-option="${item.option}">Remove</button>
      </div>
    </div>
  `).join('');

  // Calculate subtotals
  let subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Apply Promo discount if any
  if (state.activePromo) {
    subtotal = subtotal * (1 - state.activePromoDiscount);
  }

  DOM.cartSubtotal.textContent = `Rs. ${subtotal.toFixed(2)}`;
}

// ----------------------------------------------------
// WISHLIST LOGIC
// ----------------------------------------------------
function toggleWishlist(productId) {
  const index = state.wishlist.indexOf(productId);
  if (index > -1) {
    state.wishlist.splice(index, 1);
  } else {
    state.wishlist.push(productId);
  }
  
  saveLocalStorage();
  updateWishlistUI();
  renderProducts(); // re-render catalog grid to update heart shapes
}

function updateWishlistUI() {
  const count = state.wishlist.length;
  if (DOM.wishlistCountBadge) DOM.wishlistCountBadge.textContent = count;
  if (DOM.wishlistDrawerCount) DOM.wishlistDrawerCount.textContent = count;

  if (!DOM.wishlistDrawerItems) return;
  if (count === 0) {
    DOM.wishlistDrawerItems.innerHTML = `
      <div class="wishlist-empty-message">
        <svg viewBox="0 0 24 24" width="48" height="48" stroke="currentColor" stroke-width="1.5" fill="none"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
        <p>Your wishlist is empty.</p>
      </div>
    `;
    return;
  }

  DOM.wishlistDrawerItems.innerHTML = state.wishlist.map(id => {
    const product = products.find(p => p.id === id);
    if (!product) return '';
    return `
      <div class="wishlist-item">
        <img src="${product.images[0]}" alt="${product.title}" class="wishlist-item-img" />
        <div class="wishlist-item-details">
          <h4>${product.title}</h4>
          <span class="price">From Rs. ${product.options[0].price.toFixed(2)}</span>
          <div>
            <button class="primary-btn remove-item-btn wishlist-add-cart-btn" data-id="${product.id}" style="color:#fff; padding:6px 12px; font-size:0.75rem; margin-top:8px;">Add to Cart</button>
            <button class="remove-item-btn wishlist-remove-btn" data-id="${product.id}" style="margin-left: 10px;">Remove</button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// ----------------------------------------------------
// QUICK VIEW MODAL
// ----------------------------------------------------
function openQuickview(productId) {
  const prod = products.find(p => p.id === productId);
  if (!prod) return;

  const defaultOption = prod.options[0];

  DOM.quickviewContent.innerHTML = `
    <div class="quickview-media">
      <img src="${prod.images[0]}" alt="${prod.title}" class="main-img" id="qv-main-img" />
      <div class="quickview-thumbs">
        ${prod.images.map((img, idx) => `<img src="${img}" class="qv-thumb ${idx === 0 ? 'active' : ''}" alt="Thumb ${idx}" />`).join('')}
      </div>
    </div>
    <div class="quickview-info" data-product-id="${prod.id}">
      <span class="category">${prod.category}</span>
      <h2>${prod.title}</h2>
      <div class="price-row">
        <span class="price" id="qv-price">Rs. ${defaultOption.price.toFixed(2)}</span>
        <span class="regular" id="qv-reg-price">Rs. ${defaultOption.regularPrice.toFixed(2)}</span>
      </div>
      <p class="desc">${prod.description}</p>
      
      <ul class="details-bullets">
        ${prod.features ? prod.features.map(f => `<li>✓ ${f}</li>`).join('') : `<li>✓ Enriched with Vitamin C</li><li>✓ Made with 100% RO Water</li>`}
      </ul>

      <div class="option-selectors">
        ${prod.options.map((opt, idx) => `<button class="option-btn qv-option-btn ${idx === 0 ? 'active' : ''}" data-value="${opt.name}">${opt.name}</button>`).join('')}
      </div>

      <div class="purchase-actions">
        <div class="quantity-stepper">
          <button class="qv-qty-dec">-</button>
          <input type="number" value="1" min="1" class="qv-qty-input" readonly />
          <button class="qv-qty-inc">+</button>
        </div>
        <button class="primary-btn qv-add-to-cart">ADD TO CART</button>
      </div>
    </div>
  `;

  // Bind Quickview specific thumbnail and stepper events
  const qvMain = document.getElementById('qv-main-img');
  const qvThumbs = document.querySelectorAll('.qv-thumb');
  qvThumbs.forEach(thumb => {
    thumb.addEventListener('click', (e) => {
      qvThumbs.forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
      qvMain.src = thumb.src;
    });
  });

  const qvOptionBtns = document.querySelectorAll('.qv-option-btn');
  qvOptionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      qvOptionBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Update Price display based on option selection
      const optName = btn.dataset.value;
      const optDetails = prod.options.find(o => o.name === optName);
      if (optDetails) {
        document.getElementById('qv-price').textContent = `Rs. ${optDetails.price.toFixed(2)}`;
        document.getElementById('qv-reg-price').textContent = `Rs. ${optDetails.regularPrice.toFixed(2)}`;
      }
    });
  });

  // stepper bindings
  const qvQtyInput = document.querySelector('.qv-qty-input');
  document.querySelector('.qv-qty-dec').addEventListener('click', () => {
    let val = parseInt(qvQtyInput.value);
    if (val > 1) qvQtyInput.value = val - 1;
  });
  document.querySelector('.qv-qty-inc').addEventListener('click', () => {
    let val = parseInt(qvQtyInput.value);
    qvQtyInput.value = val + 1;
  });

  // Quickview Add to Cart button
  document.querySelector('.qv-add-to-cart').addEventListener('click', () => {
    const activeOptBtn = document.querySelector('.qv-option-btn.active');
    const selectedOption = activeOptBtn ? activeOptBtn.dataset.value : prod.options[0].name;
    const qty = parseInt(qvQtyInput.value);
    
    addToCart(prod.id, selectedOption, qty);
    closeModal(DOM.quickviewModal);
  });

  openModal(DOM.quickviewModal);
}

// ----------------------------------------------------
// CHECKOUT SIMULATION
// ----------------------------------------------------
function openCheckout() {
  if (state.cart.length === 0) {
    alert("Your cart is empty! Add products before checking out.");
    return;
  }

  // Populate checkout summaries
  if (DOM.checkoutItemsList) {
    DOM.checkoutItemsList.innerHTML = state.cart.map(item => `
      <div class="checkout-item-row">
        <span class="name">${item.title} (${item.option})</span>
        <span class="qty-price">${item.quantity} x Rs. ${item.price.toFixed(2)}</span>
        <span class="subtotal">Rs. ${(item.price * item.quantity).toFixed(2)}</span>
      </div>
    `).join('');
  }

  const itemsTotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  let shipping = itemsTotal >= 999 ? 0 : 60; // Free shipping over Rs. 999
  
  DOM.checkoutItemsTotal.textContent = `Rs. ${itemsTotal.toFixed(2)}`;
  DOM.checkoutShipping.textContent = shipping === 0 ? "FREE" : `Rs. ${shipping.toFixed(2)}`;

  let discount = 0;
  if (state.activePromo) {
    discount = itemsTotal * state.activePromoDiscount;
    DOM.checkoutDiscountRow.classList.remove('hide');
    DOM.checkoutDiscount.textContent = `-Rs. ${discount.toFixed(2)}`;
  } else {
    DOM.checkoutDiscountRow.classList.add('hide');
  }

  const grandTotal = itemsTotal - discount + shipping;
  DOM.checkoutGrandTotal.textContent = `Rs. ${grandTotal.toFixed(2)}`;

  closeDrawer(DOM.cartDrawer, DOM.cartOverlay);
  openModal(DOM.checkoutModal);
}

function processCheckoutOrder(e) {
  e.preventDefault();
  
  const name = document.getElementById('checkout-name').value;
  const email = document.getElementById('checkout-email').value;
  const phone = document.getElementById('checkout-phone').value;
  const address = document.getElementById('checkout-address').value;
  const payment = document.querySelector('input[name="payment"]:checked').value;

  const orderId = "IP-" + Math.floor(100000 + Math.random() * 900000);
  
  // Format items subtotal
  const itemsTotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  let shipping = itemsTotal >= 999 ? 0 : 60;
  let discount = state.activePromo ? itemsTotal * state.activePromoDiscount : 0;
  const grandTotal = itemsTotal - discount + shipping;

  // Build celebration summary
  DOM.successSummary.innerHTML = `
    <div><strong>Order Reference:</strong> ${orderId}</div>
    <div><strong>Customer Name:</strong> ${name}</div>
    <div><strong>Shipping Address:</strong> ${address}</div>
    <div><strong>Payment Type:</strong> ${payment.toUpperCase()} (Mocked Approval)</div>
    <div style="margin-top:10px;"><strong>Grand Total Paid:</strong> Rs. ${grandTotal.toFixed(2)}</div>
    <div style="font-size: 0.8rem; color:#777; margin-top:10px;">This order is mock processed for demonstration showcase.</div>
  `;

  // Clear Cart
  state.cart = [];
  state.activePromo = null;
  state.activePromoDiscount = 0;
  saveLocalStorage();
  updateCartUI();

  // Switch overlays
  closeModal(DOM.checkoutModal);
  DOM.successOverlay.classList.remove('hide');
}

// ----------------------------------------------------
// EVENT BINDINGS
// ----------------------------------------------------
function bindEvents() {
  // Mobile Nav Drawer Toggle
  if (DOM.mobileMenuToggle) {
    DOM.mobileMenuToggle.addEventListener('click', () => openDrawer(DOM.mobileNavDrawer));
  }
  if (DOM.closeMobileNavBtn) {
    DOM.closeMobileNavBtn.addEventListener('click', () => closeDrawer(DOM.mobileNavDrawer));
  }
  // Click mobile link closes drawer
  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => closeDrawer(DOM.mobileNavDrawer));
  });

  // Cart Drawer open/close
  if (DOM.cartToggle) {
    DOM.cartToggle.addEventListener('click', () => openDrawer(DOM.cartDrawer, DOM.cartOverlay));
  }
  if (DOM.closeCart) {
    DOM.closeCart.addEventListener('click', () => closeDrawer(DOM.cartDrawer, DOM.cartOverlay));
  }
  if (DOM.cartOverlay) {
    DOM.cartOverlay.addEventListener('click', () => closeDrawer(DOM.cartDrawer, DOM.cartOverlay));
  }

  // Wishlist Drawer open/close
  if (DOM.wishlistToggle) {
    DOM.wishlistToggle.addEventListener('click', () => openDrawer(DOM.wishlistDrawer, DOM.wishlistOverlay));
  }
  if (DOM.closeWishlist) {
    DOM.closeWishlist.addEventListener('click', () => closeDrawer(DOM.wishlistDrawer, DOM.wishlistOverlay));
  }
  if (DOM.wishlistOverlay) {
    DOM.wishlistOverlay.addEventListener('click', () => closeDrawer(DOM.wishlistDrawer, DOM.wishlistOverlay));
  }

  // Search Modal Toggle
  if (DOM.searchToggle) {
    DOM.searchToggle.addEventListener('click', () => openModal(DOM.searchModal));
  }
  if (DOM.closeSearchBtn) {
    DOM.closeSearchBtn.addEventListener('click', () => closeModal(DOM.searchModal));
  }
  if (DOM.searchModal) {
    DOM.searchModal.addEventListener('click', (e) => {
      if (e.target === DOM.searchModal) closeModal(DOM.searchModal);
    });
  }

  // Search logic
  if (DOM.searchInput) {
    DOM.searchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      if (!q) {
        DOM.searchResults.innerHTML = '';
        return;
      }
      const matches = products.filter(p => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
      if (matches.length === 0) {
        DOM.searchResults.innerHTML = '<div style="color:#777; text-align:center;">No results found.</div>';
        return;
      }
      DOM.searchResults.innerHTML = matches.map(m => `
        <div class="search-item-row" data-id="${m.id}" style="display:flex; gap:10px; align-items:center; margin-bottom:15px; border-bottom:1px solid #eee; padding-bottom:8px; cursor:pointer;">
          <img src="${m.images[0]}" alt="${m.title}" style="width:40px; height:40px; object-fit:contain;" />
          <div>
            <div style="font-weight:700; font-size:0.9rem;">${m.title}</div>
            <div style="color:var(--color-accent); font-weight:700; font-size:0.8rem;">Rs. ${m.options[0].price.toFixed(2)}</div>
          </div>
        </div>
      `).join('');

      // add click handlers to search items
      document.querySelectorAll('.search-item-row').forEach(row => {
        row.addEventListener('click', () => {
          closeModal(DOM.searchModal);
          openQuickview(row.dataset.id);
        });
      });
    });
  }

  // Cart actions inside drawer
  if (DOM.cartDrawerItems) {
    DOM.cartDrawerItems.addEventListener('click', (e) => {
      const btn = e.target;
      if (btn.classList.contains('cart-qty-dec') || btn.classList.contains('cart-qty-inc')) {
        const id = btn.dataset.id;
        const opt = btn.dataset.option;
        const item = state.cart.find(c => c.id === id && c.option === opt);
        if (item) {
          const change = btn.classList.contains('cart-qty-dec') ? -1 : 1;
          updateCartQuantity(id, opt, item.quantity + change);
        }
      } else if (btn.classList.contains('remove-item-btn')) {
        removeFromCart(btn.dataset.id, btn.dataset.option);
      }
    });
  }

  // Wishlist actions inside drawer
  if (DOM.wishlistDrawerItems) {
    DOM.wishlistDrawerItems.addEventListener('click', (e) => {
      const btn = e.target;
      if (btn.classList.contains('wishlist-add-cart-btn')) {
        const prod = products.find(p => p.id === btn.dataset.id);
        if (prod) {
          addToCart(prod.id, prod.options[0].name, 1);
          closeDrawer(DOM.wishlistDrawer, DOM.wishlistOverlay);
        }
      } else if (btn.classList.contains('wishlist-remove-btn')) {
        toggleWishlist(btn.dataset.id);
      }
    });
  }

  // Catalog item events (card select and card quick buy)
  if (DOM.productsGrid) {
    DOM.productsGrid.addEventListener('click', (e) => {
      const target = e.target;
      
      // Wishlist toggle
      const wishBtn = target.closest('.wishlist-btn-toggle');
      if (wishBtn) {
        toggleWishlist(wishBtn.dataset.id);
        return;
      }

      // Quick View Modal
      const qvBtn = target.closest('.quickview-trigger');
      if (qvBtn) {
        openQuickview(qvBtn.dataset.id);
        return;
      }

      // Quick add to cart
      const quickAddBtn = target.closest('.quick-add-btn');
      if (quickAddBtn) {
        const id = quickAddBtn.dataset.id;
        const select = document.querySelector(`.option-select[data-id="${id}"]`);
        const opt = select ? select.value : products.find(p => p.id === id).options[0].name;
        addToCart(id, opt, 1);
        return;
      }
    });

    // Update product card prices when option changes
    DOM.productsGrid.addEventListener('change', (e) => {
      if (e.target.classList.contains('option-select')) {
        const select = e.target;
        const id = select.dataset.id;
        const prod = products.find(p => p.id === id);
        if (prod) {
          const opt = prod.options.find(o => o.name === select.value);
          if (opt) {
            document.getElementById(`price-${id}`).textContent = `Rs. ${opt.price.toFixed(2)}`;
            document.getElementById(`reg-price-${id}`).textContent = `Rs. ${opt.regularPrice.toFixed(2)}`;
          }
        }
      }
    });
  }

  // Close modals
  if (DOM.closeQuickviewBtn) DOM.closeQuickviewBtn.addEventListener('click', () => closeModal(DOM.quickviewModal));
  if (DOM.closeCheckoutBtn) DOM.closeCheckoutBtn.addEventListener('click', () => closeModal(DOM.checkoutModal));
  
  // Close Modals by clicking on overlay
  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal(modal);
    });
  });

  // Flavor Showcase selection
  if (DOM.flavorTabs) {
    DOM.flavorTabs.addEventListener('click', (e) => {
      const tab = e.target.closest('.flavor-tab');
      if (tab) {
        selectFlavor(parseInt(tab.dataset.index));
      }
    });
  }

  // Shop selected flavor button redirects to catalog
  if (DOM.shopFlavorBtn) {
    DOM.shopFlavorBtn.addEventListener('click', () => {
      const activeFlav = flavorShowcase[state.currentFlavorIndex].name;
      // Scroll to catalog grid
      const section = document.getElementById('products-section');
      if (section) section.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Nav Dropdown links select flavor showcase (handles desktop dropdowns & mobile accordion links)
  document.querySelectorAll('.dropdown a, .accordion-panel a').forEach(link => {
    link.addEventListener('click', (e) => {
      const index = link.dataset.flavorIndex;
      if (index !== undefined) {
        selectFlavor(parseInt(index));
      }
    });
  });

  // Mobile Accordion Toggle Click Handlers
  document.querySelectorAll('.accordion-toggle').forEach(toggle => {
    toggle.addEventListener('click', () => {
      const item = toggle.closest('.mobile-nav-item');
      if (item) {
        const isExpanded = item.classList.contains('active');
        // Close all other accordions first to keep drawer clean
        document.querySelectorAll('.mobile-nav-item').forEach(i => {
          if (i !== item) i.classList.remove('active');
        });
        document.querySelectorAll('.accordion-toggle').forEach(t => {
          if (t !== toggle) t.setAttribute('aria-expanded', 'false');
        });
        
        if (!isExpanded) {
          item.classList.add('active');
          toggle.setAttribute('aria-expanded', 'true');
        } else {
          item.classList.remove('active');
          toggle.setAttribute('aria-expanded', 'false');
        }
      }
    });
  });

  // Featured Product interactive thumbnails
  DOM.heroThumbs.forEach((thumb, idx) => {
    thumb.addEventListener('click', () => {
      DOM.heroThumbs.forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
      DOM.heroMainImg.src = thumb.src;
    });
  });

  // Featured Product Option selector
  DOM.heroOptionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      DOM.heroOptionBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const optName = btn.dataset.value;
      const opt = products[0].options.find(o => o.name === optName);
      if (opt) {
        document.querySelector('.featured-meta .price').textContent = `Rs. ${opt.price.toFixed(2)}`;
        document.querySelector('.featured-meta .regular-price').textContent = `Rs. ${opt.regularPrice.toFixed(2)}`;
      }
    });
  });

  // Featured Stepper
  if (DOM.heroQtyDec) {
    DOM.heroQtyDec.addEventListener('click', () => {
      let val = parseInt(DOM.heroQtyInput.value);
      if (val > 1) DOM.heroQtyInput.value = val - 1;
    });
  }
  if (DOM.heroQtyInc) {
    DOM.heroQtyInc.addEventListener('click', () => {
      let val = parseInt(DOM.heroQtyInput.value);
      DOM.heroQtyInput.value = val + 1;
    });
  }

  // Featured Add to Cart
  if (DOM.heroAddToCartBtn) {
    DOM.heroAddToCartBtn.addEventListener('click', () => {
      const activeOpt = document.querySelector('.quick-add-container .option-btn.active');
      const optName = activeOpt ? activeOpt.dataset.value : products[0].options[0].name;
      const qty = parseInt(DOM.heroQtyInput.value);
      addToCart("assorted-flavours", optName, qty);
    });
  }

  // Testimonial reviews slider navigation
  if (DOM.nextReviewBtn) {
    DOM.nextReviewBtn.addEventListener('click', () => {
      const cardCount = document.querySelectorAll('.testimonial-card').length;
      state.currentTestimonialIndex = (state.currentTestimonialIndex + 1) % cardCount;
      updateTestimonialUI();
    });
  }
  if (DOM.prevReviewBtn) {
    DOM.prevReviewBtn.addEventListener('click', () => {
      const cardCount = document.querySelectorAll('.testimonial-card').length;
      state.currentTestimonialIndex = (state.currentTestimonialIndex - 1 + cardCount) % cardCount;
      updateTestimonialUI();
    });
  }

  // Promo Code Application
  if (DOM.applyPromoBtn) {
    DOM.applyPromoBtn.addEventListener('click', () => {
      const code = DOM.promoInput.value.toUpperCase().trim();
      if (code === "NOSTALGIA20" || code === "CHILL20") {
        state.activePromo = code;
        state.activePromoDiscount = 0.20; // 20% discount
        DOM.promoInput.value = '';
        updateCartUI();
        alert("Success! 20% promo discount applied to your checkout.");
      } else {
        alert("Invalid promo code. Try using NOSTALGIA20 or CHILL20");
      }
    });
  }

  // Forms Submits handlers
  if (DOM.checkoutBtn) {
    DOM.checkoutBtn.addEventListener('click', openCheckout);
  }
  if (DOM.checkoutForm) {
    DOM.checkoutForm.addEventListener('submit', processCheckoutOrder);
  }
  if (DOM.closeSuccessBtn) {
    DOM.closeSuccessBtn.addEventListener('click', () => {
      DOM.successOverlay.classList.add('hide');
    });
  }

  if (DOM.contactForm) {
    DOM.contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      DOM.contactForm.classList.add('hide');
      DOM.contactSuccess.classList.remove('hide');
      setTimeout(() => {
        DOM.contactForm.reset();
        DOM.contactForm.classList.remove('hide');
        DOM.contactSuccess.classList.add('hide');
      }, 5000);
    });
  }

  if (DOM.newsletterForm) {
    DOM.newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      DOM.newsletterForm.classList.add('hide');
      DOM.newsletterSuccess.classList.remove('hide');
      setTimeout(() => {
        DOM.newsletterForm.reset();
        DOM.newsletterForm.classList.remove('hide');
        DOM.newsletterSuccess.classList.add('hide');
      }, 4000);
    });
  }

  // Subpage Contact Form Handler
  const subpageContactForm = document.getElementById('subpage-contact-form');
  const subpageContactSuccess = document.getElementById('contact-form-success');
  const resetContactBtn = document.getElementById('reset-contact-btn');

  if (subpageContactForm) {
    subpageContactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      subpageContactForm.classList.add('hide');
      if (subpageContactSuccess) subpageContactSuccess.classList.remove('hide');
    });
  }
  if (resetContactBtn) {
    resetContactBtn.addEventListener('click', () => {
      if (subpageContactSuccess) subpageContactSuccess.classList.add('hide');
      if (subpageContactForm) {
        subpageContactForm.reset();
        subpageContactForm.classList.remove('hide');
      }
    });
  }

  // Subpage Franchise Form Handler
  const subpageFranchiseForm = document.getElementById('subpage-franchise-form');
  const subpageFranchiseSuccess = document.getElementById('franchise-form-success');
  const resetFranchiseBtn = document.getElementById('reset-franchise-btn');

  if (subpageFranchiseForm) {
    subpageFranchiseForm.addEventListener('submit', (e) => {
      e.preventDefault();
      subpageFranchiseForm.classList.add('hide');
      if (subpageFranchiseSuccess) subpageFranchiseSuccess.classList.remove('hide');
    });
  }
  if (resetFranchiseBtn) {
    resetFranchiseBtn.addEventListener('click', () => {
      if (subpageFranchiseSuccess) subpageFranchiseSuccess.classList.add('hide');
      if (subpageFranchiseForm) {
        subpageFranchiseForm.reset();
        subpageFranchiseForm.classList.remove('hide');
      }
    });
  }
}

// Drawer animation handlers
function openDrawer(drawerEl, overlayEl) {
  if (drawerEl) drawerEl.classList.add('active');
  if (overlayEl) overlayEl.classList.add('active');
  document.body.style.overflow = 'hidden'; // lock scroll
}

function closeDrawer(drawerEl, overlayEl) {
  if (drawerEl) drawerEl.classList.remove('active');
  if (overlayEl) overlayEl.classList.remove('active');
  document.body.style.overflow = ''; // unlock scroll
}

// Modal Animation Handlers
function openModal(modalEl) {
  if (modalEl) modalEl.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal(modalEl) {
  if (modalEl) modalEl.classList.remove('active');
  document.body.style.overflow = '';
}

// Testimonials translate
function updateTestimonialUI() {
  if (!DOM.testimonialTrack) return;
  const offset = -100 * state.currentTestimonialIndex;
  DOM.testimonialTrack.style.transform = `translateX(${offset}%)`;
}

// Launch application on DOM Load
document.addEventListener('DOMContentLoaded', init);

// Initialize Lucide Icons
document.addEventListener('DOMContentLoaded', () => {
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
  
  // Initialize features
  initColorCustomizer();
  initQtyCalculator();
  initSpecsAccordion();
  initReviewsFilter();
  initScrollReveal();
  initOrderForm();
  initStickyHeader();
  
  // New section initializations
  initAppSimulator();
  initFaqAccordion();
  
  // Dynamic Scroll & UI Interactions [ADD]
  initScrollProgress();
  initBackToTop();
  initCard3DTilt();
  initStatCounters();
});

// 1. Color Customizer Logic
function initColorCustomizer() {
  const colorDots = document.querySelectorAll('.color-dot');
  const mainProductImg = document.getElementById('main-product-img');
  const checkoutProductImg = document.getElementById('checkout-product-img');
  const specsVisualImg = document.getElementById('specs-visual-img');
  const colorNameText = document.getElementById('color-name-text');
  const checkoutColorName = document.getElementById('checkout-color-name');
  const userColorSelect = document.getElementById('user-color-select');

  const colorData = {
    black: {
      name: 'Midnight Black',
      imgSrc: 'assets/headphone-black.png',
      bodyClass: 'theme-black'
    },
    silver: {
      name: 'Platinum Silver',
      imgSrc: 'assets/headphone-silver.png',
      bodyClass: 'theme-silver'
    },
    blue: {
      name: 'Aurora Blue',
      imgSrc: 'assets/headphone-blue.png',
      bodyClass: 'theme-blue'
    }
  };

  function updateProductColor(colorKey) {
    const selected = colorData[colorKey];
    if (!selected) return;

    // 1. Update Body Theme Class
    document.body.className = '';
    document.body.classList.add(selected.bodyClass);

    // 2. Animate and Swap Hero Image
    mainProductImg.classList.remove('active');
    setTimeout(() => {
      mainProductImg.src = selected.imgSrc;
      mainProductImg.alt = `Aethera Sound Max ${selected.name}`;
      mainProductImg.classList.add('active');
    }, 250);

    // 3. Update Specs Visual Image (Left Side of specs section)
    if (specsVisualImg) {
      specsVisualImg.src = selected.imgSrc;
    }

    // 4. Update Checkout Preview Image
    if (checkoutProductImg) {
      checkoutProductImg.src = selected.imgSrc;
      checkoutProductImg.alt = `Aethera ${selected.name}`;
    }

    // 5. Update Color Names
    if (colorNameText) colorNameText.textContent = selected.name;
    if (checkoutColorName) checkoutColorName.textContent = selected.name;

    // 6. Sync with Order Form Select Dropdown
    if (userColorSelect) {
      userColorSelect.value = colorKey;
    }

    // 7. Update Active Dot Styling
    colorDots.forEach(dot => {
      if (dot.getAttribute('data-color') === colorKey) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  // Event Listeners for Color Dots
  colorDots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      const colorKey = e.target.getAttribute('data-color');
      updateProductColor(colorKey);
    });
  });

  // Event Listener for Form Dropdown (Sync backward to customizer)
  if (userColorSelect) {
    userColorSelect.addEventListener('change', (e) => {
      const colorKey = e.target.value;
      updateProductColor(colorKey);
    });
  }
}

// 2. Quantity & Price Calculator
function initQtyCalculator() {
  const qtyInput = document.getElementById('qty-input');
  const qtyMinusBtn = document.getElementById('qty-minus');
  const qtyPlusBtn = document.getElementById('qty-plus');
  const totalPriceText = document.getElementById('total-price-text');
  
  const unitPrice = 280000; // 사전예약 할인가 28만원

  function updatePrice() {
    const qty = parseInt(qtyInput.value) || 1;
    const total = qty * unitPrice;
    totalPriceText.textContent = total.toLocaleString() + '원';
  }

  if (qtyMinusBtn && qtyPlusBtn && qtyInput) {
    qtyMinusBtn.addEventListener('click', () => {
      let val = parseInt(qtyInput.value) || 1;
      if (val > 1) {
        qtyInput.value = val - 1;
        updatePrice();
      }
    });

    qtyPlusBtn.addEventListener('click', () => {
      let val = parseInt(qtyInput.value) || 1;
      if (val < 10) { // 인당 최대 10개 구매 제한
        qtyInput.value = val + 1;
        updatePrice();
      }
    });
  }
}

// 3. Technical Specifications Accordion
function initSpecsAccordion() {
  const accordionHeaders = document.querySelectorAll('.accordion-header');

  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const currentItem = header.parentElement;
      const isActive = currentItem.classList.contains('active');
      
      // Close all accordion items
      document.querySelectorAll('.accordion-item').forEach(item => {
        item.classList.remove('active');
      });

      // Toggle current
      if (!isActive) {
        currentItem.classList.add('active');
      }
    });
  });
}

// 4. Reviews Filter
function initReviewsFilter() {
  const filterBtns = document.querySelectorAll('.btn-filter');
  const reviewsContainer = document.getElementById('reviews-container');
  const reviewCards = document.querySelectorAll('.review-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Toggle active classes on buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      // Fade animation container
      reviewsContainer.style.opacity = '0.3';

      setTimeout(() => {
        reviewCards.forEach(card => {
          const cardRating = card.getAttribute('data-rating');
          
          if (filterValue === 'all' || cardRating === filterValue) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
        
        reviewsContainer.style.opacity = '1';
      }, 200);
    });
  });
}

// 5. Scroll Reveal Animation using IntersectionObserver
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  const observerOptions = {
    root: null, // Viewport
    rootMargin: '0px',
    threshold: 0.12 // Trigger when 12% of element is visible
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Stop observing once animated
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });
}

// 6. Order Form & Success Modal Logic
function initOrderForm() {
  const purchaseForm = document.getElementById('purchase-form');
  const successModal = document.getElementById('success-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const cartCounter = document.getElementById('cart-counter');
  
  // Modal Fields
  const receiptName = document.getElementById('receipt-name');
  const receiptProduct = document.getElementById('receipt-product');
  const receiptTotal = document.getElementById('receipt-total');
  const receiptPhone = document.getElementById('receipt-phone');

  if (purchaseForm) {
    purchaseForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Retrieve Form Values
      const name = document.getElementById('user-name-input').value;
      const phone = document.getElementById('user-phone-input').value;
      const colorVal = document.getElementById('user-color-select').value;
      const qty = parseInt(document.getElementById('qty-input').value) || 1;
      
      const colorMap = {
        black: 'Midnight Black',
        silver: 'Platinum Silver',
        blue: 'Aurora Blue'
      };

      const finalColorName = colorMap[colorVal] || 'Midnight Black';
      const finalPrice = (qty * 280000).toLocaleString() + '원';

      // 1. Populating Modal Content
      if (receiptName) receiptName.textContent = name;
      if (receiptProduct) receiptProduct.textContent = `Aethera Sound Max (${finalColorName}) x ${qty}대`;
      if (receiptTotal) receiptTotal.textContent = finalPrice;
      if (receiptPhone) receiptPhone.textContent = phone;

      // 2. Open Modal
      if (successModal) {
        successModal.classList.add('active');
      }

      // 3. Update Cart Badge Count
      if (cartCounter) {
        cartCounter.textContent = qty;
        cartCounter.style.transform = 'scale(1.3)';
        setTimeout(() => {
          cartCounter.style.transform = 'scale(1)';
        }, 300);
      }
    });
  }

  // Close Modal
  if (modalCloseBtn && successModal) {
    modalCloseBtn.addEventListener('click', () => {
      successModal.classList.remove('active');
      // Reset Form
      if (purchaseForm) {
        purchaseForm.reset();
        // Reset qty to 1 and recalculate price
        const qtyInput = document.getElementById('qty-input');
        if (qtyInput) {
          qtyInput.value = '1';
          const totalPriceText = document.getElementById('total-price-text');
          if (totalPriceText) totalPriceText.textContent = '280,000원';
        }
      }
    });
  }
}

// 7. Sticky Header scroll styling
function initStickyHeader() {
  const header = document.getElementById('main-header');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.style.padding = '0.75rem 2rem';
      header.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.5)';
      header.style.backgroundColor = 'rgba(6, 6, 8, 0.85)';
    } else {
      header.style.padding = '1.25rem 2rem';
      header.style.boxShadow = 'none';
      header.style.backgroundColor = 'rgba(18, 18, 22, 0.6)';
    }
  });

  // Smooth scroll links highlighting
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let currentSection = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= (sectionTop - 150)) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').includes(currentSection)) {
        link.classList.add('active');
      }
    });
  });
}

// ==========================================
// [ADD] 8. Phone App Simulator Interactions
// ==========================================
function initAppSimulator() {
  const sliderBass = document.getElementById('eq-bass');
  const sliderMid = document.getElementById('eq-mid');
  const sliderTreble = document.getElementById('eq-treble');
  
  const valBass = document.getElementById('val-bass');
  const valMid = document.getElementById('val-mid');
  const valTreble = document.getElementById('val-treble');
  
  const eqFeedbackText = document.getElementById('eq-feedback-text');
  const eqBars = document.querySelectorAll('.eq-bar');
  
  const simAncButtons = document.querySelectorAll('.btn-sim-anc');

  // Update EQ Feedback and Animation
  function updateEqProfile() {
    const bassVal = parseInt(sliderBass.value);
    const midVal = parseInt(sliderMid.value);
    const trebleVal = parseInt(sliderTreble.value);

    // 1. Set text displays
    valBass.textContent = (bassVal > 0 ? '+' : '') + bassVal;
    valMid.textContent = (midVal > 0 ? '+' : '') + midVal;
    valTreble.textContent = (trebleVal > 0 ? '+' : '') + trebleVal;

    // 2. Determine profile description
    let profileName = '균형 잡힌 균일 사운드 (기본 프로필)';
    
    if (bassVal > 4 && trebleVal > 4) {
      profileName = '파워풀한 V자형 다이내믹 프로필';
    } else if (bassVal > 5) {
      profileName = '풍부하고 웅장한 저음 강화 프로필';
    } else if (trebleVal > 5) {
      profileName = '선명하고 화사한 고음 강조 프로필';
    } else if (midVal > 5) {
      profileName = '보컬 및 대사 해상도 극대화 프로필';
    } else if (bassVal < -4) {
      profileName = '저음 차단 플랫 분석 프로필';
    }

    eqFeedbackText.textContent = profileName;

    // 3. Dynamic Soundwave Pulse Speed Based on EQ Values
    const totalGain = Math.abs(bassVal) + Math.abs(midVal) + Math.abs(trebleVal);
    // Base speed is 1.2s. Higher gain makes wave pulse faster
    const animDuration = Math.max(0.4, 1.4 - (totalGain * 0.05)) + 's';
    
    eqBars.forEach((bar, index) => {
      bar.style.animationDuration = animDuration;
      // Also slightly adjust simulated heights
      const randomMultiplier = 0.5 + (Math.random() * 0.5);
      const targetHeight = Math.min(100, Math.max(10, 50 + (bassVal * 3) + (index * 5 * randomMultiplier))) + '%';
      // Use animation or transient style overrides for variety
      bar.style.opacity = 0.6 + (totalGain * 0.02);
    });
  }

  // Event Listeners for Range Input Sliders
  if (sliderBass && sliderMid && sliderTreble) {
    [sliderBass, sliderMid, sliderTreble].forEach(slider => {
      slider.addEventListener('input', updateEqProfile);
    });
  }

  // ANC Mode Button Selector Click Handlers
  simAncButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      simAncButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const mode = btn.getAttribute('data-mode');
      let statusMsg = '';

      if (mode === 'anc') {
        statusMsg = '하이브리드 ANC 활성화 (소음 -40dB 차단)';
      } else if (mode === 'ambient') {
        statusMsg = '주변 소리 듣기(Ambient) 모드 활성화';
      } else {
        statusMsg = '노이즈 캔슬링 꺼짐 (배터리 절약)';
      }

      eqFeedbackText.textContent = statusMsg;

      // Update wave height dynamically to reflect background noise status
      eqBars.forEach((bar) => {
        if (mode === 'anc') {
          // Wave looks calm and flat in ANC mode
          bar.style.animationPlayState = 'running';
        } else if (mode === 'ambient') {
          // Ambient mode has slightly more ambient jitter
          bar.style.animationPlayState = 'running';
        } else {
          // Mode off
          bar.style.animationPlayState = 'paused';
          bar.style.height = '15%';
        }
      });
    });
  });
}

// ==========================================
// [ADD] 9. FAQ Accordion Logic
// ==========================================
function initFaqAccordion() {
  const faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentItem = btn.parentElement;
      const isActive = currentItem.classList.contains('active');

      // Optional: Close all FAQ items first
      document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
      });

      // Toggle current item
      if (!isActive) {
        currentItem.classList.add('active');
      }
    });
  });
}


// ==========================================
// [ADD] 10. Scroll & Interactive JS Effects
// ==========================================

// Scroll Progress Bar Indicator
function initScrollProgress() {
  const progress = document.getElementById('scroll-progress');
  if (!progress) return;
  
  window.addEventListener('scroll', () => {
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
    progress.style.width = scrolled + '%';
  });
}

// Floating Back to Top Button
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// 3D Card Tilt Effect on Mousemove (Hero Card & Specs Card)
function initCard3DTilt() {
  const cards = document.querySelectorAll('.product-showcase-card, .specs-visual-card');
  
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; 
      const y = e.clientY - rect.top;  
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Max tilt of 8 degrees
      const rotateX = ((centerY - y) / centerY) * 8;
      const rotateY = ((x - centerX) / centerX) * 8;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    });
  });
}

// Statistics Numbers Count-up Animation on Viewport Enter
function initStatCounters() {
  const counters = document.querySelectorAll('.count-up');
  
  const counterObserverOptions = {
    root: null,
    threshold: 0.5
  };

  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const targetVal = parseInt(target.getAttribute('data-target')) || 0;
        let count = 0;
        const duration = 1200; // 1.2s count up duration
        const stepTime = 16; // ~60fps
        const totalSteps = duration / stepTime;
        const increment = targetVal / totalSteps;
        
        const timer = setInterval(() => {
          count += increment;
          if (count >= targetVal) {
            target.textContent = targetVal;
            clearInterval(timer);
          } else {
            target.textContent = Math.floor(count);
          }
        }, stepTime);
        
        observer.unobserve(target);
      }
    });
  }, counterObserverOptions);

  counters.forEach(counter => {
    counterObserver.observe(counter);
  });
}

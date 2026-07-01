// === Syed Cycle Mart — Interactive Engine ===

document.addEventListener('DOMContentLoaded', () => {
  /* --- Product Quick View Modal --- */
  const productData = {
    "Wholesale Cycles & Spare Parts": {
      desc: "Bulk wholesale supply of premium bicycles and genuine spare parts. High-quality Shimano components, durable chain links, heavy-duty inner tubes, alloy wheel rims, and original cycle accessories for retailers and individuals.",
      price: "Wholesale & Bulk Rates Available Upon Direct Request"
    },
    "Children's BMX & Balance Bikes": {
      desc: "Vibrant, impact-resistant kids cycle range including high-tensile steel frames, integrated non-slip training wheels, adjustable growth saddles, full-coverage chain guards for optimal child safety, and high-visibility spoke safety reflectors.",
      price: "Estimated Price: ₹4,800 – ₹8,500"
    },
    "Ladies Heritage Collections": {
      desc: "Classic step-through city commuters featuring ergonomics optimized for female riders. Complete with an integrated robust front wire storage basket, complete rear wheel skirt guards, rigid premium mudguards, and low-maintenance multi-surface mechanical rim brakes.",
      price: "Estimated Price: ₹6,200 – ₹11,500"
    }
  };

  const modalOverlay = document.getElementById('quick-view-modal');
  const modalBackdrop = document.getElementById('modal-backdrop');
  const modalClose = document.getElementById('modal-close');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-desc');
  const modalPrice = document.getElementById('modal-price');
  const modalPanel = document.querySelector('.modal-panel');
  const btnInquiry = document.getElementById('btn-modal-inquiry');
  
  const quickViewBtns = document.querySelectorAll('.quick-view-btn');
  let previouslyFocusedElement = null;

  function openModal(productName) {
    const data = productData[productName];
    if (!data) return;

    previouslyFocusedElement = document.activeElement;
    
    modalTitle.textContent = productName;
    modalDesc.textContent = data.desc;
    modalPrice.textContent = data.price;
    
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    modalPanel.setAttribute('tabindex', '-1');
    modalPanel.focus();
  }

  function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
    if (previouslyFocusedElement) previouslyFocusedElement.focus();
  }

  quickViewBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(btn.dataset.product);
    });
  });

  modalClose.addEventListener('click', closeModal);
  modalBackdrop.addEventListener('click', closeModal);
  
  btnInquiry.addEventListener('click', () => {
    closeModal();
    document.getElementById('inquiry-form').scrollIntoView({ behavior: 'smooth' });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });


  /* --- Testimonials Carousel --- */
  const track = document.getElementById('carousel-track');
  const slides = document.querySelectorAll('.carousel-slide');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  const dotsContainer = document.getElementById('carousel-dots');
  
  let currentSlide = 0;
  const slideCount = slides.length;
  let carouselInterval;

  // Create dots
  slides.forEach((_, idx) => {
    const dot = document.createElement('button');
    dot.className = `carousel-dot ${idx === 0 ? 'active' : ''}`;
    dot.setAttribute('aria-label', `Go to testimonial ${idx + 1}`);
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-selected', idx === 0);
    dot.addEventListener('click', () => goToSlide(idx));
    dotsContainer.appendChild(dot);
  });
  const dots = document.querySelectorAll('.carousel-dot');

  function updateCarousel() {
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    dots.forEach((dot, idx) => {
      const isActive = idx === currentSlide;
      dot.classList.toggle('active', isActive);
      dot.setAttribute('aria-selected', isActive);
    });
  }

  function goToSlide(idx) {
    currentSlide = idx;
    updateCarousel();
    resetCarouselTimer();
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % slideCount;
    updateCarousel();
  }

  function prevSlide() {
    currentSlide = (currentSlide - 1 + slideCount) % slideCount;
    updateCarousel();
  }

  function startCarouselTimer() {
    carouselInterval = setInterval(nextSlide, 5000);
  }

  function resetCarouselTimer() {
    clearInterval(carouselInterval);
    startCarouselTimer();
  }

  prevBtn.addEventListener('click', () => { prevSlide(); resetCarouselTimer(); });
  nextBtn.addEventListener('click', () => { nextSlide(); resetCarouselTimer(); });
  
  startCarouselTimer();


  /* --- Contact Form Handler --- */
  const form = document.querySelector('form');
  const toast = document.getElementById('success-toast');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    // Show toast
    toast.classList.add('active');
    form.reset();

    // Hide toast after 6 seconds
    setTimeout(() => {
      toast.classList.remove('active');
    }, 6000);
  });

  /* --- Portfolio-Inspired Animations --- */
  
  // 1. Reveal on Scroll (Intersection Observer)
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target); // Only reveal once
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  
  revealEls.forEach(el => revealObserver.observe(el));

  // 2. 3D Tilt Effect on Product Cards
  const tiltCards = document.querySelectorAll('.product-card');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -5; // max 5deg tilt
      const rotateY = ((x - centerX) / centerX) * 5;
      
      // We keep the scale from our CSS hover effect (1.03) but add the 3D rotation
      card.style.transform = `perspective(1000px) scale(1.03) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = ''; // Reverts to CSS hover/default state
    });
  });

  // 3. Ambient Cursor Glow
  const glow = document.getElementById('cursorGlow');
  if (glow && window.innerWidth > 768) { // Only enable on desktop
    document.addEventListener('mousemove', e => {
      // Small optimization using requestAnimationFrame can be added, but direct style works fine for glow
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
    });
  }
});

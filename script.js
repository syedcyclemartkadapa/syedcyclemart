// === Syed Cycle Mart Interactive Engine ===

document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.classList.add('js-ready');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --- Product Quick View Modal --- */
  const productData = {
    'Wholesale Cycles & Spare Parts': {
      desc: 'Bulk wholesale supply of premium bicycles and genuine spare parts. High-quality Shimano components, durable chain links, heavy-duty inner tubes, alloy wheel rims, and original cycle accessories for retailers and individuals.',
      price: 'Wholesale and bulk rates available upon direct request'
    },
    "Children's BMX & Balance Bikes": {
      desc: 'Vibrant, impact-resistant kids cycle range including high-tensile steel frames, integrated non-slip training wheels, adjustable growth saddles, full-coverage chain guards for optimal child safety, and high-visibility spoke safety reflectors.',
      price: 'Estimated Price: Rs 4,800 - Rs 8,500'
    },
    'Ladies Heritage Collections': {
      desc: 'Classic step-through city commuters featuring ergonomics optimized for female riders. Complete with an integrated robust front wire storage basket, rear wheel skirt guards, rigid premium mudguards, and low-maintenance multi-surface mechanical rim brakes.',
      price: 'Estimated Price: Rs 6,200 - Rs 11,500'
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
    if (!data || !modalOverlay || !modalPanel) return;

    previouslyFocusedElement = document.activeElement;
    modalTitle.textContent = productName;
    modalDesc.textContent = data.desc;
    modalPrice.textContent = data.price;

    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    modalPanel.setAttribute('tabindex', '-1');
    modalPanel.focus({ preventScroll: true });
  }

  function closeModal() {
    if (!modalOverlay) return;

    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
    if (previouslyFocusedElement) previouslyFocusedElement.focus({ preventScroll: true });
  }

  quickViewBtns.forEach((btn) => {
    btn.addEventListener('click', (event) => {
      event.preventDefault();
      openModal(btn.dataset.product);
    });
  });

  modalClose?.addEventListener('click', closeModal);
  modalBackdrop?.addEventListener('click', closeModal);

  btnInquiry?.addEventListener('click', () => {
    closeModal();
    document.getElementById('inquiry-form')?.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modalOverlay?.classList.contains('active')) closeModal();
  });

  /* --- Testimonials Carousel --- */
  const track = document.getElementById('carousel-slides');
  const slides = document.querySelectorAll('.carousel-slide');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  const dotsContainer = document.getElementById('carousel-dots');

  if (track && slides.length && dotsContainer) {
    let currentSlide = 0;
    let carouselInterval;

    slides.forEach((_, idx) => {
      const dot = document.createElement('button');
      dot.className = `carousel-dot ${idx === 0 ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Go to testimonial ${idx + 1}`);
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-selected', String(idx === 0));
      dot.addEventListener('click', () => goToSlide(idx));
      dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.carousel-dot');

    function updateCarousel() {
      track.style.transform = `translateX(-${currentSlide * 100}%)`;
      dots.forEach((dot, idx) => {
        const isActive = idx === currentSlide;
        dot.classList.toggle('active', isActive);
        dot.setAttribute('aria-selected', String(isActive));
      });
    }

    function goToSlide(idx) {
      currentSlide = idx;
      updateCarousel();
      resetCarouselTimer();
    }

    function nextSlide() {
      currentSlide = (currentSlide + 1) % slides.length;
      updateCarousel();
    }

    function prevSlide() {
      currentSlide = (currentSlide - 1 + slides.length) % slides.length;
      updateCarousel();
    }

    function startCarouselTimer() {
      if (prefersReducedMotion) return;
      carouselInterval = window.setInterval(nextSlide, 5500);
    }

    function resetCarouselTimer() {
      window.clearInterval(carouselInterval);
      startCarouselTimer();
    }

    prevBtn?.addEventListener('click', () => {
      prevSlide();
      resetCarouselTimer();
    });

    nextBtn?.addEventListener('click', () => {
      nextSlide();
      resetCarouselTimer();
    });

    startCarouselTimer();
  }

  /* --- Contact Form Handler (WhatsApp Redirect) --- */
  const form = document.querySelector('form');
  const toast = document.getElementById('success-toast');

  form?.addEventListener('submit', (event) => {
    event.preventDefault();

    const nameVal = document.getElementById('name').value.trim() || 'Not specified';
    const phoneVal = document.getElementById('phone').value.trim() || 'Not specified';
    const typeVal = document.getElementById('type').value;
    const msgVal = document.getElementById('message').value.trim() || 'No additional details';

    const text = `*Syed Cycle Mart - New Website Inquiry*\n\n` +
                 `• *Name:* ${nameVal}\n` +
                 `• *Contact Phone:* ${phoneVal}\n` +
                 `• *Inquiry Type:* ${typeVal}\n` +
                 `• *Details/Requirements:* ${msgVal}`;

    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/919642452124?text=${encodedText}`;

    // Open WhatsApp in a new tab
    window.open(whatsappUrl, '_blank');

    // Show success feedback toast and reset form
    toast?.classList.add('active');
    form.reset();

    window.setTimeout(() => {
      toast?.classList.remove('active');
    }, 6000);
  });

  /* --- Reveal on Scroll --- */
  const revealEls = document.querySelectorAll('.reveal');
  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.01, rootMargin: '0px 0px 180px 0px' });

    revealEls.forEach((el, idx) => {
      el.style.transitionDelay = `${Math.min(idx * 70, 220)}ms`;
      revealObserver.observe(el);
    });
  } else {
    revealEls.forEach((el) => el.classList.add('visible'));
  }

  /* --- Desktop Product Card Tilt --- */
  const canTilt = window.matchMedia('(hover: hover) and (pointer: fine)').matches && !prefersReducedMotion;
  if (canTilt) {
    document.querySelectorAll('.product-card').forEach((card) => {
      let frame = 0;
      let latestEvent = null;

      function updateTilt() {
        frame = 0;
        if (!latestEvent) return;

        const rect = card.getBoundingClientRect();
        const x = latestEvent.clientX - rect.left;
        const y = latestEvent.clientY - rect.top;
        const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -4;
        const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 4;

        card.style.transform = `perspective(900px) translateY(-4px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      }

      card.addEventListener('mousemove', (event) => {
        latestEvent = event;
        if (!frame) frame = window.requestAnimationFrame(updateTilt);
      });

      card.addEventListener('mouseleave', () => {
        latestEvent = null;
        if (frame) window.cancelAnimationFrame(frame);
        frame = 0;
        card.style.transform = '';
      });
    });
  }

  /* --- Premium Floating Navbar Interaction --- */
  const nav = document.querySelector('.site-nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  /* --- Ambient Cursor Glow --- */
  const glow = document.getElementById('cursorGlow');
  const canGlow = glow && window.matchMedia('(hover: hover) and (pointer: fine)').matches && !prefersReducedMotion;
  if (canGlow) {
    let glowFrame = 0;
    let nextX = 0;
    let nextY = 0;

    document.addEventListener('mousemove', (event) => {
      nextX = event.clientX;
      nextY = event.clientY;

      if (!glowFrame) {
        glowFrame = window.requestAnimationFrame(() => {
          glowFrame = 0;
          glow.style.left = `${nextX}px`;
          glow.style.top = `${nextY}px`;
        });
      }
    }, { passive: true });
  }

  /* --- Interactive Hero Particles --- */
  const particleContainer = document.getElementById('heroParticles');
  const heroElement = document.querySelector('.hero');
  if (particleContainer && heroElement && !prefersReducedMotion) {
    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;';
    particleContainer.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    function resize() {
      canvas.width = particleContainer.offsetWidth;
      canvas.height = particleContainer.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    let mouse = { x: -9999, y: -9999 };
    heroElement.addEventListener('mousemove', (e) => {
      const rect = heroElement.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    }, { passive: true });

    heroElement.addEventListener('mouseleave', () => {
      mouse.x = -9999;
      mouse.y = -9999;
    }, { passive: true });

    const BLUE = 'rgba(14, 165, 233,';
    const WHITE = 'rgba(255, 255, 255,';
    const count = window.innerWidth < 768 ? 40 : 80;

    function createParticle() {
      const isBlue = Math.random() > 0.4;
      const size = isBlue ? (Math.random() * 2.5 + 1) : (Math.random() * 1.5 + 0.5);
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size,
        baseSize: size,
        vx: (Math.random() - 0.5) * 0.25,
        vy: -(Math.random() * 0.4 + 0.15),
        alpha: Math.random() * 0.55 + 0.15,
        pulse: Math.random() * Math.PI * 2,
        color: isBlue ? BLUE : WHITE,
        twinkleSpeed: Math.random() * 0.015 + 0.005
      };
    }

    let particles = Array.from({ length: count }, createParticle);

    function resetTop(p) {
      p.x = Math.random() * canvas.width;
      p.y = canvas.height + p.size * 2;
      p.vx = (Math.random() - 0.5) * 0.25;
      p.vy = -(Math.random() * 0.4 + 0.15);
      p.alpha = Math.random() * 0.55 + 0.15;
      p.pulse = Math.random() * Math.PI * 2;
    }

    const REPEL_RADIUS = 90;
    const REPEL_FORCE = 1.6;

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.pulse += p.twinkleSpeed;
        const flickerAlpha = p.alpha * (0.75 + 0.25 * Math.sin(p.pulse));
        const flickerSize = p.baseSize * (0.9 + 0.1 * Math.sin(p.pulse * 1.2));

        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < REPEL_RADIUS && dist > 0) {
          const force = (1 - dist / REPEL_RADIUS) * REPEL_FORCE;
          p.vx += (dx / dist) * force * 0.05;
          p.vy += (dy / dist) * force * 0.05;
        }

        p.vx *= 0.98;
        p.vy = p.vy * 0.98 - 0.004;

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -p.size) p.x = canvas.width + p.size;
        else if (p.x > canvas.width + p.size) p.x = -p.size;
        if (p.y < -p.size * 4) resetTop(p);

        if (p.color === BLUE && flickerSize > 1.2) {
          const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, flickerSize * 2.5);
          grd.addColorStop(0, p.color + (flickerAlpha * 0.5) + ')');
          grd.addColorStop(1, p.color + '0)');
          ctx.beginPath();
          ctx.arc(p.x, p.y, flickerSize * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = grd;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, flickerSize, 0, Math.PI * 2);
        ctx.fillStyle = p.color + flickerAlpha + ')';
        ctx.fill();
      });

      window.requestAnimationFrame(draw);
    }
    window.requestAnimationFrame(draw);
  }
});

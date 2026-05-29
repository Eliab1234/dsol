/* ============================================
   D' Sol - Fotografía y Video | Main Script
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  // ===== 1. HEADER SCROLL EFFECT =====
  const header = document.querySelector('.header');
  let lastScroll = 0;

  window.addEventListener('scroll', function () {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 80) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  });

  // ===== 2. MOBILE MENU =====
  const hamburger = document.querySelector('.hamburger');
  const nav = document.querySelector('.nav');

  if (hamburger && nav) {
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('active');
      nav.classList.toggle('active');
      document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu on link click
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('active');
        nav.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // ===== 3. ACTIVE NAV LINK =====
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  nav.querySelectorAll('a').forEach(function (link) {
    const linkPage = link.getAttribute('href');
    if (linkPage === currentPage) {
      link.classList.add('active');
    }
  });

  // ===== 4. LIGHTBOX (Gallery) =====
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');
  const lightboxCounter = document.getElementById('lightbox-counter');

  let currentIndex = 0;
  let galleryImages = [];

  function initLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item img');
    galleryImages = Array.from(galleryItems).map(function (img) {
      return img.getAttribute('src');
    });

    galleryItems.forEach(function (img, index) {
      img.parentElement.addEventListener('click', function () {
        openLightbox(index);
      });
    });
  }

  function openLightbox(index) {
    currentIndex = index;
    updateLightboxImage();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function updateLightboxImage() {
    if (lightboxImg && galleryImages.length > 0) {
      lightboxImg.setAttribute('src', galleryImages[currentIndex]);
      if (lightboxCounter) {
        lightboxCounter.textContent = (currentIndex + 1) + ' / ' + galleryImages.length;
      }
    }
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function prevImage() {
    currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
    updateLightboxImage();
  }

  function nextImage() {
    currentIndex = (currentIndex + 1) % galleryImages.length;
    updateLightboxImage();
  }

  if (lightbox) {
    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxPrev) lightboxPrev.addEventListener('click', prevImage);
    if (lightboxNext) lightboxNext.addEventListener('click', nextImage);

    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
    });
  }

  if (document.querySelector('.gallery-grid')) {
    initLightbox();
  }

  // ===== 5. TESTIMONIAL CAROUSEL =====
  const carousel = document.querySelector('.testimonial-carousel');
  if (carousel) {
    const slides = carousel.querySelectorAll('.testimonial-slide');
    const dots = carousel.querySelectorAll('.carousel-dot');
    const prevBtn = carousel.querySelector('.carousel-prev');
    const nextBtn = carousel.querySelector('.carousel-next');
    let currentSlide = 0;
    let slideInterval;

    function showSlide(index) {
      slides.forEach(function (slide, i) {
        slide.classList.toggle('active', i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === index);
      });
      currentSlide = index;
    }

    function nextSlide() {
      showSlide((currentSlide + 1) % slides.length);
    }

    function prevSlide() {
      showSlide((currentSlide - 1 + slides.length) % slides.length);
    }

    function startAutoSlide() {
      slideInterval = setInterval(nextSlide, 5000);
    }

    function stopAutoSlide() {
      clearInterval(slideInterval);
    }

    if (slides.length > 0) {
      showSlide(0);
      startAutoSlide();

      if (prevBtn) prevBtn.addEventListener('click', function () { stopAutoSlide(); prevSlide(); startAutoSlide(); });
      if (nextBtn) nextBtn.addEventListener('click', function () { stopAutoSlide(); nextSlide(); startAutoSlide(); });

      dots.forEach(function (dot) {
        dot.addEventListener('click', function () {
          stopAutoSlide();
          showSlide(parseInt(this.getAttribute('data-index')));
          startAutoSlide();
        });
      });

      carousel.addEventListener('mouseenter', stopAutoSlide);
      carousel.addEventListener('mouseleave', startAutoSlide);
    }
  }

  // ===== 6. TESTIMONIALS GRID (page) =====
  // No extra functionality needed for grid

  // ===== 7. SMOOTH SCROLL FOR ANCHOR LINKS =====
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ===== 8. FORM SUBMISSION (Formspree) =====
  const forms = document.querySelectorAll('form[data-formspree]');

  forms.forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.textContent : 'Enviar';
      const formspreeId = form.getAttribute('data-formspree');

      if (!formspreeId || formspreeId === 'REEMPLAZAR_CON_TU_ID') {
        alert('Configuración pendiente: reemplaza el ID de Formspree en el atributo data-formspree.');
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';
      }

      const formData = new FormData(form);
      const data = {};
      formData.forEach(function (value, key) { data[key] = value; });

      fetch('https://formspree.io/f/' + formspreeId, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
      })
        .then(function (response) {
          if (response.ok) {
            form.innerHTML = '<div class="form-success"><i class="fas fa-check-circle"></i><h3>¡Mensaje enviado!</h3><p>Gracias por contactarnos. Te responderemos a la brevedad.</p></div>';
          } else {
            throw new Error('Error al enviar');
          }
        })
        .catch(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
          }
          alert('Hubo un error al enviar el mensaje. Por favor intenta de nuevo.');
        });
    });
  });

  // ===== 9. SCROLL REVEAL ANIMATION =====
  const revealElements = document.querySelectorAll('.service-card, .service-detailed-card, .testimonial-card, .gallery-item, .about-grid');

  if (revealElements.length > 0 && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    revealElements.forEach(function (el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(el);
    });
  } else {
    revealElements.forEach(function (el) {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });
  }

}); // end DOMContentLoaded

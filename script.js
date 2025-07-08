// Animación de entrada solo cuando las cards de beneficios entran al viewport
function animateBenefitCards() {
    const cards = document.querySelectorAll('.benefits-grid .card');
    const observer = new window.IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-viewport');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    cards.forEach(card => {
      observer.observe(card);
    });
  }
  window.addEventListener('DOMContentLoaded', animateBenefitCards);

// Funcionalidad de acordeón para Preguntas Frecuentes
function setupFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    question.addEventListener('click', () => {
      const expanded = question.getAttribute('aria-expanded') === 'true';
      question.setAttribute('aria-expanded', !expanded);
      item.classList.toggle('open');
      if (!expanded) {
        answer.setAttribute('tabindex', '-1');
        answer.focus();
      }
    });
    question.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        question.click();
      }
    });
  });
}
window.addEventListener('DOMContentLoaded', setupFAQAccordion);

// Header Dinámico - Aparece cuando el usuario hace scroll
function setupDynamicHeader() {
    const header = document.getElementById('dynamicHeader');
    const hero = document.querySelector('.hero');
    
    if (!header || !hero) return;
    
    let isHeaderVisible = false;
    let lastScrollTop = 0;
    
    function handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const heroBottom = hero.offsetTop + hero.offsetHeight;
        
        // Mostrar header cuando el usuario sale del hero y hace scroll hacia abajo
        if (scrollTop > heroBottom - 100 && scrollTop > lastScrollTop && !isHeaderVisible) {
            header.classList.add('visible');
            isHeaderVisible = true;
        }
        // Ocultar header cuando el usuario vuelve al hero
        else if (scrollTop <= heroBottom - 100 && isHeaderVisible) {
            header.classList.remove('visible');
            isHeaderVisible = false;
        }
        
        lastScrollTop = scrollTop;
    }
    
    // Agregar event listener para scroll
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Verificar estado inicial
    handleScroll();
}


window.addEventListener('DOMContentLoaded', setupDynamicHeader);


// Cargar AOS JS en diferido
function loadAOS() {
  const script = document.createElement('script');
  script.src = 'https://unpkg.com/aos@2.3.1/dist/aos.js';
  script.onload = function() {
    if (window.AOS) {
      AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        offset: 100
      });
    }
  };
  document.head.appendChild(script);
}

// Cargar AOS cuando el usuario hace scroll
let aosLoaded = false;
window.addEventListener('scroll', function() {
  if (!aosLoaded && window.pageYOffset > 100) {
    loadAOS();
    aosLoaded = true;
  }
}, { passive: true });

// Cargar AOS después de 2 segundos si no se ha hecho scroll
setTimeout(function() {
  if (!aosLoaded) {
    loadAOS();
    aosLoaded = true;
  }
}, 2000);

// Lazy Loading para imágenes
function setupLazyLoading() {
  const lazyImages = document.querySelectorAll('.lazy-image');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.add('loaded');
          imageObserver.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.1
    });

    lazyImages.forEach(img => {
      imageObserver.observe(img);
    });
  } else {
    // Fallback para navegadores que no soportan Intersection Observer
    lazyImages.forEach(img => {
      img.src = img.dataset.src;
      img.classList.add('loaded');
    });
  }
}

// Inicializar lazy loading cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', setupLazyLoading);

// Envío AJAX del formulario de contacto
const form = document.getElementById('contact-form');
const responseBox = document.getElementById('form-response');
const submitBtn = form ? form.querySelector('button[type="submit"]') : null;

if (form && responseBox && submitBtn) {
  form.addEventListener('submit', async function (e) {
    e.preventDefault(); // Evita recargar la página

    const formData = new FormData(form);

    // Anti-bot: si el campo honeypot tiene contenido, cancelamos
    if (formData.get('website')) return;

    // Estado loading
    submitBtn.disabled = true;
    responseBox.style.display = 'none';
    responseBox.textContent = '';
    responseBox.className = '';

    try {
      const token = await grecaptcha.execute('6Let_norAAAAAGLJubmK22lpFTIACv20xt_CCGmG', { action: 'submit' });
      formData.set('recaptcha_token', token);

      const res = await fetch("https://aivagesolutions.xyz/webhook/form-landing", {
        method: "POST",
        body: formData
      });

      if (res.ok) {
        form.reset();
        responseBox.textContent = '¡Gracias! Tu mensaje fue enviado correctamente. Te contactaremos pronto.';
        responseBox.className = 'form-response-success';
      } else {
        throw new Error('No se pudo enviar el formulario.');
      }
    } catch (err) {
      responseBox.textContent = 'Hubo un error al enviar el mensaje. Por favor, intenta nuevamente.';
      responseBox.className = 'form-response-error';
    }

    responseBox.style.display = 'block';
    submitBtn.disabled = false;
  });
}




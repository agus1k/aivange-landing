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

// Inicialización de AOS (Animaciones al hacer scroll)
document.addEventListener('DOMContentLoaded', function() {
  if (window.AOS) {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      offset: 100
    });
  }
});

// Tabs modernos con underline animado y accesibilidad
function setupModernTabs() {
  const tabList = document.querySelector('.modern-tabs');
  if (!tabList) return;
  const tabs = Array.from(tabList.querySelectorAll('.modern-tab'));
  const panels = Array.from(document.querySelectorAll('.modern-tab-panel'));

  // Crear underline animado
  let underline = document.createElement('div');
  underline.className = 'modern-tab-underline';
  tabList.appendChild(underline);

  function updateUnderline() {
    const activeIdx = tabs.findIndex(tab => tab.getAttribute('aria-selected') === 'true');
    if (activeIdx === -1) return;
    const activeTab = tabs[activeIdx];
    const tabRect = activeTab.getBoundingClientRect();
    const listRect = tabList.getBoundingClientRect();
    underline.style.left = (activeTab.offsetLeft) + 'px';
    underline.style.width = activeTab.offsetWidth + 'px';
  }

  function activateTab(idx) {
    tabs.forEach((tab, i) => {
      tab.setAttribute('aria-selected', i === idx ? 'true' : 'false');
      tab.tabIndex = i === idx ? 0 : -1;
      panels[i].hidden = i !== idx;
    });
    updateUnderline();
    tabs[idx].focus();
  }

  tabs.forEach((tab, idx) => {
    tab.addEventListener('click', () => activateTab(idx));
    tab.addEventListener('keydown', (e) => {
      let newIdx = idx;
      if (e.key === 'ArrowRight') newIdx = (idx + 1) % tabs.length;
      if (e.key === 'ArrowLeft') newIdx = (idx - 1 + tabs.length) % tabs.length;
      if (newIdx !== idx) {
        activateTab(newIdx);
      }
    });
  });

  window.addEventListener('resize', updateUnderline);
  // Inicializar
  setTimeout(updateUnderline, 100); // Espera a que renderice
}
document.addEventListener('DOMContentLoaded', setupModernTabs);
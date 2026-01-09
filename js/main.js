/*!
 * Melinda Sostenibilità - Main JavaScript
 * Smooth Scroll Garantito
 */

// ============================================
// SMOOTH SCROLL con jQuery-like animation
// ============================================
(function() {
    'use strict';

    console.log('🍎 Melinda JS inizializzato');

    // ============================================
    // 1. NAVBAR SCROLL EFFECT
    // ============================================
    const navbar = document.getElementById('navbar-main');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // ============================================
    // 2. SMOOTH SCROLL FUNCTION (ROBUSTO)
    // ============================================
    function smoothScroll(target, duration) {
        duration = duration || 1000;
        
        const targetPosition = target;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            
            // Easing function (easeInOutCubic)
            const eased = progress < 0.5
                ? 4 * progress * progress * progress
                : 1 - Math.pow(-2 * progress + 2, 3) / 2;
            
            window.scrollTo(0, startPosition + distance * eased);
            
            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        }

        requestAnimationFrame(animation);
    }

    // ============================================
    // 3. CLICK HANDLER per link anchor
    // ============================================
    document.addEventListener('click', function(e) {
        // Trova se il click è su un link o dentro un link
        let target = e.target;
        while (target && target !== document) {
            if (target.tagName === 'A' && target.getAttribute('href') && target.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                e.stopPropagation();
                
                const href = target.getAttribute('href');
                console.log('🎯 Smooth scroll verso:', href);
                
                if (href === '#' || href === '') return;
                
                const targetElement = document.querySelector(href);
                
                if (targetElement) {
                    const navbarHeight = window.innerWidth <= 768 ? 80 : 100;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                    
                    console.log('✅ Scrolling to position:', targetPosition);
                    smoothScroll(targetPosition, 1200);
                    
                    // Chiudi menu mobile se aperto
                    const navCollapse = document.querySelector('.navbar-collapse.show');
                    if (navCollapse) {
                        const bsCollapse = new bootstrap.Collapse(navCollapse);
                        bsCollapse.hide();
                    }
                } else {
                    console.log('❌ Target non trovato:', href);
                }
                
                return false;
            }
            target = target.parentNode;
        }
    }, true); // true = capturing phase

    // ============================================
    // 4. BACK TO TOP BUTTON
    // ============================================
    const backToTopBtn = document.getElementById('backToTopBtn');
    
    if (backToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });
        
        backToTopBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('⬆️ Back to top');
            smoothScroll(0, 1000);
        });
    }

    // ============================================
    // 5. COUNTER ANIMATION (CORRETTO)
    // ============================================
    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const suffix = element.getAttribute('data-suffix') || '';
        
        if (isNaN(target)) return;
        
        const duration = 2000; // 2 secondi
        const steps = 80;
        const increment = target / steps;
        let current = 0;
        let step = 0;

        const timer = setInterval(function() {
            step++;
            current = Math.floor(increment * step);
            
            if (current >= target) {
                element.textContent = target + suffix;
                clearInterval(timer);
            } else {
                element.textContent = current + suffix;
            }
        }, duration / steps);
    }

    // Intersection Observer per counters
    if ('IntersectionObserver' in window) {
        const counterObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    
                    // Controlla se già animato
                    if (counter.classList.contains('counted')) return;
                    
                    // Marca come animato
                    counter.classList.add('counted');
                    
                    // Reset a 0 prima di animare
                    counter.textContent = '0';
                    
                    // Avvia animazione
                    setTimeout(function() {
                        animateCounter(counter);
                    }, 200);
                }
            });
        }, { threshold: 0.3 }); // Trigger al 30% visibilità

        document.querySelectorAll('.counter-display').forEach(function(counter) {
            counterObserver.observe(counter);
        });
        
        console.log('✅ Counter observer attivo');
    } else {
        // Fallback senza observer (anima subito)
        console.log('⚠️ IntersectionObserver non supportato, animo subito');
        document.querySelectorAll('.counter-display').forEach(function(counter) {
            animateCounter(counter);
        });
    }


    // ============================================
    // 6. ACTIVE NAV LINK
    // ============================================
    let sections = [];
    let navLinks = [];

    window.addEventListener('load', function() {
        sections = document.querySelectorAll('section[id]');
        navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    });

    window.addEventListener('scroll', function() {
        if (sections.length === 0) return;
        
        let current = '';
        const scrollY = window.pageYOffset + 150;

        sections.forEach(function(section) {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(function(link) {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });

    console.log('✅ Smooth scroll attivo!');

})();

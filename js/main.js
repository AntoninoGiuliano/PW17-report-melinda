/*!
 * Melinda Sostenibilità - Main JavaScript
 * Smooth Scroll Garantito
 */

// ============================================
// SMOOTH SCROLL con jQuery-like animation
// ============================================
(function() {
    'use strict';

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
                if (href === '#' || href === '') return;
                
                const targetElement = document.querySelector(href);
                
                if (targetElement) {
                    const navbarHeight = window.innerWidth <= 768 ? 80 : 100;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                    
                    smoothScroll(targetPosition, 1200);
                    
                    // Chiudi menu mobile se aperto
                    const navCollapse = document.querySelector('.navbar-collapse.show');
                    if (navCollapse) {
                        const bsCollapse = new bootstrap.Collapse(navCollapse);
                        bsCollapse.hide();
                    }
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
        
    } else {
        // Fallback senza observer (anima subito)
        document.querySelectorAll('.counter-display').forEach(function(counter) {
            animateCounter(counter);
        });
    }

    // ============================================
    // 8. DONUT CHART ANIMATION con Counter Dinamico
    // ============================================
    function animateDonutChart(donutElement) {
        const percentage = parseInt(donutElement.getAttribute('data-percentage')) || 30;
        const color = donutElement.getAttribute('data-color') || '#0ea5e9';
        const valueElement = donutElement.querySelector('.donut-value');
        
        if (!valueElement) return;
        
        // Calcola i gradi (360° × percentuale)
        const degrees = (percentage / 100) * 360;
        
        // Animazione simultanea: grafico + numero
        let currentDegree = 0;
        let currentNumber = 0;
        const frames = 60; // Numero di frame per animazione
        const degreeIncrement = degrees / frames;
        const numberIncrement = percentage / frames;
        let frame = 0;
        
        const animationInterval = setInterval(function() {
            frame++;
            currentDegree += degreeIncrement;
            currentNumber += numberIncrement;
            
            if (frame >= frames) {
                currentDegree = degrees;
                currentNumber = percentage;
                clearInterval(animationInterval);
            }
            
            // Aggiorna background con conic-gradient
            donutElement.style.background = `conic-gradient(
                ${color} 0deg ${currentDegree}deg, 
                #e5e7eb ${currentDegree}deg 360deg
            )`;
            
            // Aggiorna numero centrale (arrotondato)
            valueElement.textContent = Math.floor(currentNumber) + '%';
            
        }, 25); // ~40fps (1500ms totale / 60 frame)
        
        // Aggiungi classe per animazione rotazione
        donutElement.classList.add('animated');
    }

    // Intersection Observer per donut chart
    if ('IntersectionObserver' in window) {
        const donutObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const donut = entry.target;
                    
                    // Evita doppie animazioni
                    if (donut.classList.contains('donut-animated')) return;
                    donut.classList.add('donut-animated');
                    
                    // Reset numero a 0 prima di animare
                    const valueElement = donut.querySelector('.donut-value');
                    if (valueElement) {
                        valueElement.textContent = '0%';
                    }
                    
                    // Avvia animazione dopo delay
                    setTimeout(function() {
                        animateDonutChart(donut);
                    }, 300);
                }
            });
        }, { threshold: 0.5 });

        document.querySelectorAll('.donut-chart').forEach(function(donut) {
            donutObserver.observe(donut);
        });
        
    } else {
        // Fallback senza observer
        document.querySelectorAll('.donut-chart').forEach(function(donut) {
            animateDonutChart(donut);
        });
    }


    // ============================================
    // 7. HERO FADE-IN LENTO (Forzato)
    // ============================================
    window.addEventListener('load', function() {
        
        const heroTitle = document.querySelector('#chi-siamo h1');
        const heroText = document.querySelector('#chi-siamo .lead');
        const heroButton = document.querySelector('#chi-siamo .btn-melinda');
        
        if (heroTitle && heroText && heroButton) {
            // Imposta opacità 0 iniziale via JS
            heroTitle.style.opacity = '0';
            heroText.style.opacity = '0';
            heroButton.style.opacity = '0';
            
            // Titolo - fade in dopo 500ms, durata 3000ms
            setTimeout(function() {
                fadeIn(heroTitle, 3000);
            }, 500);
            
            // Paragrafo - fade in dopo 2000ms, durata 3500ms
            setTimeout(function() {
                fadeIn(heroText, 3500);
            }, 2000);
            
            // Bottone - fade in dopo 4000ms, durata 2500ms
            setTimeout(function() {
                fadeIn(heroButton, 2500);
            }, 4000);
        }
    });
    
    // Funzione fade-in graduale
    function fadeIn(element, duration) {
        let opacity = 0;
        const interval = 50; // Update ogni 50ms
        const increment = interval / duration;
        
        const fade = setInterval(function() {
            opacity += increment;
            if (opacity >= 1) {
                opacity = 1;
                clearInterval(fade);
            }
            element.style.opacity = opacity;
        }, interval);
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

})();

document.addEventListener('DOMContentLoaded', () => {

    // Header Scroll Effect
    const header = document.querySelector('.main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
    });

    // Smooth Scroll for Anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Hover effect for cards (Tilt)
    const cards = document.querySelectorAll('.glass-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--x', `${x}px`);
            card.style.setProperty('--y', `${y}px`);
        });
    });

    // Scroll Reveal Observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal-on-scroll').forEach(el => {
        observer.observe(el);
    });

    // Countdown Timer (End of Month)
    const countdownElement = document.getElementById('countdown-timer');
    if (countdownElement) {
        const launchDate = new Date('Jan 16, 2026 08:00:00').getTime();

        const updateTimer = () => {
            const currentTime = new Date().getTime();
            const distance = launchDate - currentTime;

            if (distance < 0) {
                countdownElement.innerHTML = "<h3 style='color: var(--color-primary);'>WE ARE LIVE!</h3>";
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            document.getElementById('days').innerText = String(days).padStart(2, '0');
            document.getElementById('hours').innerText = String(hours).padStart(2, '0');
            document.getElementById('minutes').innerText = String(minutes).padStart(2, '0');
            document.getElementById('seconds').innerText = String(seconds).padStart(2, '0');
        };

        setInterval(updateTimer, 1000);
        updateTimer();
    }

    // Hero Parallax
    const heroDecor = document.querySelectorAll('.animate-float');

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;

        if (scrolled < window.innerHeight) {
            const content = document.querySelector('.hero-content');
            if (content) {
                content.style.transform = `translateY(${scrolled * 0.4}px)`;
                content.style.opacity = 1 - (scrolled / 700);
            }

            heroDecor.forEach((el, index) => {
                const speed = (index + 1) * 0.2;
                el.style.transform = `translateY(${scrolled * speed * -1}px)`;
            });
        }
    });

    // Power Line Progress (How It Works)
    const processSection = document.querySelector('.section-py[style*="overflow: hidden"]');
    if (processSection) {
        let powerLine = processSection.querySelector('.power-line-fill');
        if (!powerLine) {
            const container = processSection.querySelector('div[style*="position: absolute"]');
            if (container) {
                container.classList.add('power-line-container');
                container.innerHTML = '<div class="power-line-fill"></div>';
                powerLine = container.querySelector('.power-line-fill');
            }
        }

        window.addEventListener('scroll', () => {
            const rect = processSection.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            let percentage = 0;
            const start = windowHeight * 0.8;
            const end = -rect.height * 0.2;

            if (rect.top < start && rect.bottom > 0) {
                const total = start - end;
                const current = start - rect.top;
                percentage = (current / total) * 100;
                percentage = Math.min(Math.max(percentage, 0), 100);

                if (powerLine) powerLine.style.width = `${percentage}%`;
            }
        });
    }

    // Mobile Menu Toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');

            const icon = mobileBtn.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const icon = mobileBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });
    }

    // Scroll Blur Effect for Video Section
    const videoSection = document.querySelector('.video-section');
    const talentSection = document.getElementById('talent');

    if (videoSection && talentSection) {
        window.addEventListener('scroll', () => {
            const talentTop = talentSection.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;

            if (talentTop < windowHeight && talentTop > 0) {
                const progress = 1 - (talentTop / windowHeight);
                const blurAmount = progress * 20;
                const opacityAmount = 1 - progress;

                videoSection.style.filter = `blur(${blurAmount}px) opacity(${opacityAmount})`;
            } else if (talentTop >= windowHeight) {
                videoSection.style.filter = 'blur(0px) opacity(1)';
            } else {
                videoSection.style.filter = 'blur(20px) opacity(0)';
            }
        });
    }

    // Contact Form Handling with Safety
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const submitBtn = document.getElementById('submit-btn');
            const successMsg = document.getElementById('form-success');
            const originalBtnText = submitBtn.innerText;

            // 1. Honeypot Check (Bot Protection)
            const honeypot = document.getElementById('website').value;
            if (honeypot) {
                console.log('Bot detected.');
                return;
            }

            // 2. Rate Limiting (Client-side)
            const lastSubmission = localStorage.getItem('last_submission');
            const now = Date.now();
            if (lastSubmission && (now - lastSubmission < 60000)) {
                alert('Please wait a minute before sending another message.');
                return;
            }

            // 3. Validation
            const email = document.getElementById('email').value.trim();

            if (!email || !email.includes('@')) {
                alert('Please enter a valid email address.');
                return;
            }

            // 4. UX: Process
            submitBtn.disabled = true;
            submitBtn.innerText = 'Sending...';

            // 5. Simulate Network Request
            setTimeout(() => {
                successMsg.style.display = 'block';
                contactForm.reset();
                localStorage.setItem('last_submission', Date.now());

                submitBtn.innerText = 'Sent!';
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.innerText = originalBtnText;
                    successMsg.style.display = 'none';
                }, 3000);

            }, 1500);
        });
    }

    // ------------------------------------------------
    // NEW: Animated Counter for Stats
    // ------------------------------------------------
    const counters = document.querySelectorAll('[data-count]');
    if (counters.length > 0) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseInt(el.getAttribute('data-count'), 10);
                    const suffix = el.getAttribute('data-suffix') || '';
                    const duration = 2000;
                    const start = 0;
                    const startTime = performance.now();

                    function updateCounter(currentTime) {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        const eased = 1 - Math.pow(1 - progress, 3);
                        const current = Math.floor(eased * (target - start) + start);

                        el.textContent = current.toLocaleString() + suffix;

                        if (progress < 1) {
                            requestAnimationFrame(updateCounter);
                        } else {
                            el.textContent = target.toLocaleString() + suffix;
                        }
                    }

                    requestAnimationFrame(updateCounter);
                    counterObserver.unobserve(el);
                }
            });
        }, { threshold: 0.3 });

        counters.forEach(counter => counterObserver.observe(counter));
    }

    // ------------------------------------------------
    // NEW: Journey Timeline Step Animation
    // ------------------------------------------------
    const journeySteps = document.querySelectorAll('.journey-step');
    if (journeySteps.length > 0) {
        const journeyObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const steps = entry.target.querySelectorAll('.journey-step');
                    steps.forEach((step, index) => {
                        setTimeout(() => {
                            step.style.opacity = '1';
                            step.style.transform = 'translateY(0)';
                        }, index * 150);
                    });
                    journeyObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        const timeline = document.querySelector('.journey-timeline');
        if (timeline) {
            journeySteps.forEach(step => {
                step.style.opacity = '0';
                step.style.transform = 'translateY(20px)';
                step.style.transition = 'all 0.5s ease';
            });
            journeyObserver.observe(timeline);
        }
    }

    // ------------------------------------------------
    // NEW: Language Toggle (Hindi)
    // ------------------------------------------------
    function setLanguagePreference(lang) {
        document.cookie = `googtrans=${lang}; path=/`;
        document.cookie = `googtrans=${lang}; path=/; domain=` + location.hostname;
        if (location.hostname.includes('amaplayer.com')) {
            const parts = location.hostname.split('.');
            if (parts.length > 2) {
                document.cookie = `googtrans=${lang}; path=/; domain=.` + parts.slice(-2).join('.');
            }
        }
    }

    window.toggleHindi = function() {
        var isHindi = document.cookie.indexOf('googtrans=/en/hi') !== -1;
        if (isHindi) {
            setLanguagePreference('/en/en');
        } else {
            setLanguagePreference('/en/hi');
        }
        window.location.reload();
    };

    // Inject Google Translate script silently
    const gtDiv = document.createElement('div');
    gtDiv.id = 'google_translate_element';
    gtDiv.style.display = 'none';
    document.body.appendChild(gtDiv);

    window.googleTranslateElementInit = function() {
        new google.translate.TranslateElement({
            pageLanguage: 'en',
            includedLanguages: 'en,hi',
            autoDisplay: false
        }, 'google_translate_element');
    };

    const gtScript = document.createElement('script');
    gtScript.type = 'text/javascript';
    gtScript.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    document.head.appendChild(gtScript);

    // Add Toggle Button to Header
    const authButtonsContainer = document.querySelector('.main-header .auth-buttons');
    if (authButtonsContainer) {
        const langBtn = document.createElement('button');
        langBtn.onclick = window.toggleHindi;
        langBtn.className = 'btn btn-outline flex-center';
        langBtn.style.padding = '0.5rem 1rem';
        langBtn.style.marginRight = '0.5rem';
        langBtn.style.fontSize = '0.85rem';
        langBtn.style.height = '40px';
        langBtn.style.borderRadius = '50px';
        langBtn.style.cursor = 'pointer';
        langBtn.style.background = 'rgba(255, 255, 255, 0.05)';
        langBtn.style.border = '1px solid rgba(255, 255, 255, 0.2)';
        
        var isHindi = document.cookie.indexOf('googtrans=/en/hi') !== -1;
        langBtn.innerHTML = isHindi ? '<i class="fas fa-language" style="margin-right: 5px;"></i> EN' : '<i class="fas fa-language" style="margin-right: 5px;"></i> हिन्दी';
        
        // Add hover effect
        langBtn.addEventListener('mouseover', () => {
            langBtn.style.background = 'var(--color-white)';
            langBtn.style.color = 'var(--color-bg-darker)';
        });
        langBtn.addEventListener('mouseout', () => {
             langBtn.style.background = 'rgba(255, 255, 255, 0.05)';
             langBtn.style.color = 'var(--color-white)';
        });

        authButtonsContainer.prepend(langBtn);
    }
});

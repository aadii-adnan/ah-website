document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.getElementById('navbar');
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const hamburgerIcon = hamburgerMenu.querySelector('i');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section, footer');

    // 1. Scrolled State
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Toggle Mobile Menu
    const toggleMenu = () => {
        const isOpen = mobileMenu.classList.contains('open');
        
        if (isOpen) {
            // Close menu
            mobileMenu.classList.remove('open');
            hamburgerIcon.classList.replace('bx-x', 'bx-menu');
            document.body.classList.remove('menu-open');
        } else {
            // Open menu
            mobileMenu.classList.add('open');
            hamburgerIcon.classList.replace('bx-menu', 'bx-x');
            document.body.classList.add('menu-open');
        }
    };

    hamburgerMenu.addEventListener('click', toggleMenu);

    // 3. Close mobile menu on link click and smooth scroll
    mobileLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Note: CSS smooth scrolling handles the actual scroll
            toggleMenu();
        });
    });

    // 4. Intersection Observer for Active Nav Link
    const observerOptions = {
        root: null,
        rootMargin: '-50px 0px -50% 0px', // Adjust triggering area
        threshold: 0
    };

    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentId = entry.target.id;
                
                // Update Desktop Navigation
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${currentId}`) {
                        link.classList.add('active');
                    }
                });
                
                // Update Mobile Navigation Text Color (Optional highlight)
                mobileLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${currentId}`) {
                        link.style.color = 'var(--accent)';
                    } else {
                        link.style.color = 'var(--text-primary)';
                    }
                });
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    sections.forEach(section => {
        if(section.id) {
            observer.observe(section);
        }
    });

    // --- HERO SECTION TYPEWRITER ---
    const typewriterText = document.querySelector('.typewriter-text');
    if (typewriterText) {
        const words = ["AI Systems", "RAG Pipelines", "LLM Applications", "Real-World Software"];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        
        function type() {
            const currentWord = words[wordIndex];
            
            if (isDeleting) {
                typewriterText.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typewriterText.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
            }
            
            let typeSpeed = isDeleting ? 40 : 80;
            
            if (!isDeleting && charIndex === currentWord.length) {
                typeSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typeSpeed = 500;
            }
            
            setTimeout(type, typeSpeed);
        }
        
        setTimeout(type, 1000);
    }

    // --- SCROLL REVEAL ANIMATION (ALL SECTIONS) ---
    const scrollSections = document.querySelectorAll('section');
    const revealObserverOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.2
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const reveals = entry.target.querySelectorAll('.reveal-left, .reveal-right, .reveal-up');
                reveals.forEach(el => el.classList.add('active'));
                observer.unobserve(entry.target);
            }
        });
    }, revealObserverOptions);

    scrollSections.forEach(section => revealObserver.observe(section));

    // --- EXPERIENCE JS (TIMELINE LINE REVEAL) ---
    const expObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const line = entry.target.querySelector('.timeline-line');
                if (line) line.classList.add('active');
                expObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    const expSection = document.getElementById('experience');
    if (expSection) {
        expObserver.observe(expSection);
    }

    // --- PROJECTS JS (FILTERING LOGIC) ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.classList.remove('remove');
                    setTimeout(() => card.classList.remove('hide'), 20);
                } else {
                    card.classList.add('hide');
                    setTimeout(() => {
                        if (card.classList.contains('hide')) {
                            card.classList.add('remove');
                        }
                    }, 350);
                }
            });
        });
    });

    // --- CONTACT FORM JS ---
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const formSuccess = document.getElementById('formSuccess');

    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Button loading state
            const btnText = submitBtn.querySelector('span');
            const btnIcon = submitBtn.querySelector('i');
            btnText.textContent = 'Sending...';
            btnIcon.className = 'bx bx-loader-alt bx-spin';
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.8';

            const formData = new FormData(contactForm);

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    // Success state
                    btnText.textContent = 'Sent!';
                    btnIcon.className = 'bx bx-check';
                    submitBtn.style.opacity = '1';
                    submitBtn.style.background = '#22C55E';

                    formSuccess.style.display = 'flex';
                    formSuccess.style.opacity = '0';
                    setTimeout(() => {
                        formSuccess.style.transition = 'opacity 0.5s ease';
                        formSuccess.style.opacity = '1';
                    }, 100);

                    // Reset form after 3 seconds
                    setTimeout(() => {
                        contactForm.reset();
                        btnText.textContent = 'Send Message';
                        btnIcon.className = 'bx bx-send';
                        submitBtn.disabled = false;
                        submitBtn.style.background = 'var(--accent)';
                        formSuccess.style.opacity = '0';
                        setTimeout(() => {
                            formSuccess.style.display = 'none';
                        }, 500);
                    }, 3000);

                } else {
                    // Error state
                    btnText.textContent = 'Failed — Try Again';
                    btnIcon.className = 'bx bx-error';
                    submitBtn.disabled = false;
                    submitBtn.style.opacity = '1';
                    submitBtn.style.background = '#EF4444';

                    setTimeout(() => {
                        btnText.textContent = 'Send Message';
                        btnIcon.className = 'bx bx-send';
                        submitBtn.style.background = 'var(--accent)';
                    }, 3000);
                }
            } catch (error) {
                // Network error
                btnText.textContent = 'Network Error — Try Again';
                btnIcon.className = 'bx bx-wifi-off';
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
                submitBtn.style.background = '#EF4444';

                setTimeout(() => {
                    btnText.textContent = 'Send Message';
                    btnIcon.className = 'bx bx-send';
                    submitBtn.style.background = 'var(--accent)';
                }, 3000);
            }
        });
    }
});

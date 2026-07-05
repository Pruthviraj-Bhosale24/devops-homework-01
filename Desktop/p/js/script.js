
document.addEventListener('DOMContentLoaded', () => {


    const preloader = document.getElementById('preloader');
        const hidePreloader = () => {
        if (preloader && !preloader.classList.contains('fade-out')) {
            preloader.classList.add('fade-out');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 600); // match transition duration
        }
    };

    window.addEventListener('load', hidePreloader);
    
    setTimeout(hidePreloader, 2500);


    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    

    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'light') {
        body.classList.remove('dark-theme');
    } else {
        body.classList.add('dark-theme'); 
    }

    // Toggle theme callback
    const toggleTheme = () => {
        // Simple page transition effect
        body.style.transition = 'background-color 0.4s ease, color 0.4s ease';
        
        if (body.classList.contains('dark-theme')) {
            body.classList.remove('dark-theme');
            localStorage.setItem('theme', 'light');
        } else {
            body.classList.add('dark-theme');
            localStorage.setItem('theme', 'dark');
        }
        
        // Refresh icons if lucide is available
        if (window.lucide) {
            window.lucide.createIcons();
        }
    };

    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }


    // ==========================================================================
    // 3. SCROLL PROGRESS & STICKY NAVBAR
    // ==========================================================================
    const header = document.querySelector('.header');
    const scrollProgress = document.getElementById('scroll-progress');
    const backToTopBtn = document.getElementById('back-to-top');

    const handleScrollEffects = () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        
        // 3a. Navbar shadow on scroll
        if (scrollTop > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // 3b. Horizontal scroll progress indicator
        if (scrollProgress && docHeight > 0) {
            const scrollPercent = (scrollTop / docHeight) * 100;
            scrollProgress.style.width = `${scrollPercent}%`;
        }

        // 3c. Back to top button visibility
        if (backToTopBtn) {
            if (scrollTop > 600) {
                backToTopBtn.classList.add('active');
            } else {
                backToTopBtn.classList.remove('active');
            }
        }
    };

    window.addEventListener('scroll', handleScrollEffects);
    handleScrollEffects(); // initial check

    // Back to top click handler
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }


    // ==========================================================================
    // 4. MOBILE NAVIGATION DRAWER
    // ==========================================================================
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    const toggleMenu = () => {
        const isOpen = navMenu.classList.contains('open');
        if (isOpen) {
            navMenu.classList.remove('open');
            menuToggle.setAttribute('aria-expanded', 'false');
        } else {
            navMenu.classList.add('open');
            menuToggle.setAttribute('aria-expanded', 'true');
        }
    };

    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMenu);
    }

    // Close menu when link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu && navMenu.classList.contains('open')) {
                toggleMenu();
            }
        });
    });


    // ==========================================================================
    // 5. TYPING TEXT ANIMATION
    // ==========================================================================
    const typingText = document.getElementById('typing-text');
    const roles = ["IT Diploma Student", "Frontend Developer", "Future Full Stack Developer"];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    const performTyping = () => {
        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            // Backspace characters
            typingText.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 40; // faster delete speed
        } else {
            // Write characters
            typingText.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 80;
        }

        // Handle text completions transitions
        if (!isDeleting && charIndex === currentRole.length) {
            typeSpeed = 2000; // Pause at full word
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typeSpeed = 500; // Pause before typing next word
        }

        setTimeout(performTyping, typeSpeed);
    };

    if (typingText) {
        setTimeout(performTyping, 1000);
    }


    // ==========================================================================
    // 6. SCROLL REVEAL INTERSECTION OBSERVER
    // ==========================================================================
    const revealItems = document.querySelectorAll('.reveal-fade-up, .reveal-fade-left, .reveal-fade-right, .reveal-scale-in');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
                
                // Triggers skills bento progress bar animation when skill card reveals
                const progressFill = entry.target.querySelector('.progress-fill');
                if (progressFill) {
                    const finalWidth = progressFill.style.width;
                    progressFill.style.width = '0';
                    setTimeout(() => {
                        progressFill.style.width = finalWidth;
                    }, 100);
                }
                
                observer.unobserve(entry.target); // Reveal once
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    revealItems.forEach(item => {
        revealObserver.observe(item);
    });


    // ==========================================================================
    // 7. ACTIVE NAVIGATION MENU STATE LINKING
    // ==========================================================================
    const sections = document.querySelectorAll('section[id]');
    
    const navObserverOptions = {
        threshold: 0.35,
        rootMargin: '-60px 0px -40px 0px'
    };

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, navObserverOptions);

    sections.forEach(section => {
        navObserver.observe(section);
    });


    // ==========================================================================
    // 8. JOURNEY TIMELINE INTERACTION
    // ==========================================================================
    const timelineItems = document.querySelectorAll('.timeline-item');
    const timelineProgress = document.querySelector('.timeline-progress');
    const timelineContainer = document.querySelector('.timeline-container');

    const handleTimelineScroll = () => {
        if (!timelineContainer || !timelineProgress) return;
        
        const containerRect = timelineContainer.getBoundingClientRect();
        const triggerPoint = window.innerHeight * 0.7; // observer focus line
        
        const containerStart = containerRect.top;
        const containerEnd = containerRect.bottom;
        const totalHeight = containerRect.height;
        
        let progressHeight = 0;
        
        if (containerStart < triggerPoint) {
            // Element is within screen focus
            const delta = triggerPoint - containerStart;
            progressHeight = Math.min(delta, totalHeight);
            
            // Adjust progression height percentage
            const percentage = (progressHeight / totalHeight) * 100;
            timelineProgress.style.height = `${percentage}%`;
        } else {
            timelineProgress.style.height = `0%`;
        }

        // Highlight active milestones
        timelineItems.forEach(item => {
            const itemRect = item.getBoundingClientRect();
            if (itemRect.top < triggerPoint) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    };

    window.addEventListener('scroll', handleTimelineScroll);
    handleTimelineScroll(); // initial check


    // ==========================================================================
    // 9. PREMIUM CONTACT FORM VALIDATION & FEEDBACK
    // ==========================================================================
    const contactForm = document.getElementById('contact-form');
    const formFeedback = document.getElementById('form-feedback');
    const closeFeedback = document.getElementById('close-feedback');

    const validateInput = (inputEl, errorElId) => {
        const errorEl = document.getElementById(errorElId);
        const groupEl = inputEl.parentElement;
        
        let isValid = true;
        
        if (!inputEl.value.trim()) {
            isValid = false;
        } else if (inputEl.type === 'email') {
            // standard regex email validate
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            isValid = emailPattern.test(inputEl.value.trim());
        }

        if (!isValid) {
            groupEl.classList.add('invalid');
        } else {
            groupEl.classList.remove('invalid');
        }
        
        return isValid;
    };

    // Attach input listeners to remove error highlights on keyup
    if (contactForm) {
        const nameInput = document.getElementById('form-name');
        const emailInput = document.getElementById('form-email');
        const msgInput = document.getElementById('form-message');

        nameInput.addEventListener('input', () => nameInput.parentElement.classList.remove('invalid'));
        emailInput.addEventListener('input', () => emailInput.parentElement.classList.remove('invalid'));
        msgInput.addEventListener('input', () => msgInput.parentElement.classList.remove('invalid'));

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const isNameValid = validateInput(nameInput, 'name-error');
            const isEmailValid = validateInput(emailInput, 'email-error');
            const isMsgValid = validateInput(msgInput, 'message-error');
            
            if (isNameValid && isEmailValid && isMsgValid) {
                const submitBtn = contactForm.querySelector('.submit-btn');
                const originalText = submitBtn.innerHTML;
                
                // Add sending mock visual state
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span>Sending...</span>';
                
                setTimeout(() => {
                    // Show custom success screen modal overlay
                    formFeedback.classList.add('active');
                    
                    // Reset fields
                    contactForm.reset();
                    
                    // Restore button state
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                }, 1200);
            }
        });
    }

    if (closeFeedback && formFeedback) {
        closeFeedback.addEventListener('click', () => {
            formFeedback.classList.remove('active');
        });
    }

});

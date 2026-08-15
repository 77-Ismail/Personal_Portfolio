/**
 * Ismail Khan - Portfolio Script
 * Interactive logic, project filtering, stat counting, resume modal & form handling
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Navigation & Sticky Header
    const header = document.querySelector('header');
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const navLinks = document.querySelectorAll('.nav-links a, .mobile-menu a');
    const sections = document.querySelectorAll('section, header');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Active nav tracking
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id') || '';
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    });

    // Mobile Hamburger Menu
    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
        });

        // Close on link click
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
            });
        });

        // Close on click outside
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
            }
        });
    }

    // 2. Reveal on Scroll (Intersection Observer)
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // 3. Animated Metric Counters
    const statNumbers = document.querySelectorAll('.stat-number');
    let counted = false;

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !counted) {
                counted = true;
                statNumbers.forEach(stat => {
                    const target = stat.getAttribute('data-target');
                    const suffix = stat.getAttribute('data-suffix') || '';
                    const prefix = stat.getAttribute('data-prefix') || '';
                    const isFloat = target.includes('.');
                    const duration = 1800;
                    const startTime = performance.now();
                    const targetVal = parseFloat(target);

                    const updateCount = (currentTime) => {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        // Ease out cubic
                        const easeOut = 1 - Math.pow(1 - progress, 3);
                        const current = targetVal * easeOut;

                        if (isFloat) {
                            stat.textContent = `${prefix}${current.toFixed(2)}${suffix}`;
                        } else {
                            stat.textContent = `${prefix}${Math.floor(current)}${suffix}`;
                        }

                        if (progress < 1) {
                            requestAnimationFrame(updateCount);
                        } else {
                            stat.textContent = `${prefix}${target}${suffix}`;
                        }
                    };

                    requestAnimationFrame(updateCount);
                });
            }
        });
    }, { threshold: 0.3 });

    const statsSection = document.querySelector('.stats-bar');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }

    // 4. Project Filtering Tabs
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category.includes(filter)) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 250);
                }
            });
        });
    });

    // 5. Resume Modal Logic
    const resumeModal = document.getElementById('resumeModal');
    const openResumeBtns = document.querySelectorAll('.open-resume-btn');
    const closeResumeBtn = document.getElementById('closeResumeBtn');

    if (resumeModal) {
        openResumeBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                resumeModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        if (closeResumeBtn) {
            closeResumeBtn.addEventListener('click', () => {
                resumeModal.classList.remove('active');
                document.body.style.overflow = '';
            });
        }

        resumeModal.addEventListener('click', (e) => {
            if (e.target === resumeModal) {
                resumeModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && resumeModal.classList.contains('active')) {
                resumeModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // 6. Contact Form Submission
    const contactForm = document.getElementById('contactForm');
    const toast = document.getElementById('toast');

    function showToast(message, isSuccess = true) {
        if (!toast) return;
        toast.textContent = message;
        toast.style.background = isSuccess ? '#0f172a' : '#dc2626';
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 4000);
    }

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject') ? document.getElementById('subject').value.trim() : 'Portfolio Inquiry';
            const message = document.getElementById('message').value.trim();

            if (!name || !email || !message) {
                showToast('Please fill out all required fields.', false);
                return;
            }

            // Fallback direct mailto or Formspree
            const mailtoLink = `mailto:ismaailkhan2020@gmail.com?subject=${encodeURIComponent('Portfolio Contact: ' + name + ' - ' + subject)}&body=${encodeURIComponent('Name: ' + name + '\nEmail: ' + email + '\n\nMessage:\n' + message)}`;
            
            showToast('Thank you, Ismail will get back to you shortly! Opening email client...');
            
            setTimeout(() => {
                window.location.href = mailtoLink;
                contactForm.reset();
            }, 800);
        });
    }

    // 7. Quick Copy to Clipboard for email and phone
    const copyBtns = document.querySelectorAll('.copy-btn');
    copyBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const textToCopy = btn.getAttribute('data-copy');
            if (navigator.clipboard && textToCopy) {
                navigator.clipboard.writeText(textToCopy).then(() => {
                    showToast(`Copied "${textToCopy}" to clipboard!`);
                });
            }
        });
    });
});

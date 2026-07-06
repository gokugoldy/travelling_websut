document.addEventListener('DOMContentLoaded', () => {

    // Custom Cursor
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (!isTouchDevice && cursor && follower) {
        document.addEventListener('mousemove', (e) => {
            const x = e.clientX;
            const y = e.clientY;

            // Direct mapping for small dot
            cursor.style.left = `${x}px`;
            cursor.style.top = `${y}px`;

            // Setup lerp for follower
            follower.animate({
                left: `${x}px`,
                top: `${y}px`
            }, { duration: 300, fill: "forwards" });
        });

        // Add hover classes
        const hoverElements = document.querySelectorAll('a, button, input, .card');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                document.body.classList.add('cursor-hover');
            });
            el.addEventListener('mouseleave', () => {
                document.body.classList.remove('cursor-hover');
            });
        });
    }

    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            navLinks.classList.remove('active'); // Close mobile menu on click
            const href = this.getAttribute('href');
            if (href === '#') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }
            try {
                const target = document.querySelector(href);
                if(target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            } catch (error) {
                console.error("Invalid selector for smooth scroll:", href);
            }
        });
    });

    // 3D Tilt Effect on Cards
    const cards = document.querySelectorAll('.tilt-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            if (isTouchDevice) return;
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            setTimeout(() => {
                card.style.transition = 'var(--transition)';
            }, 50);
        });
        
        card.addEventListener('mouseenter', () => {
            card.style.transition = 'none';
        });
    });

    // Scroll Revel Animations (Vanilla JS Intersection Observer)
    const fadeElements = document.querySelectorAll('.fade-up');
    const revealElements = document.querySelectorAll('.reveal');
    const counterElements = document.querySelectorAll('.counter');

    // Initial fade in for hero
    setTimeout(() => {
        fadeElements.forEach(el => el.classList.add('active'));
    }, 100);

    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // If it contains a counter, start counting
                if (entry.target.classList.contains('about-container')) {
                    // Handled natively by observing counterElements directly
                } else if (entry.target.classList.contains('counter')) {
                   runSingleCounter(entry.target);
                }
            }
        });
    }, observerOptions);

    revealElements.forEach(el => scrollObserver.observe(el));
    counterElements.forEach(el => scrollObserver.observe(el));

    // Counter Function
    function runSingleCounter(counter) {
        if(counter.classList.contains('counted')) return;
        
        const target = +counter.getAttribute('data-target');
        const h3 = counter.querySelector('h3');
        let count = 0;
        const speed = 200; // lower is slower
        
        const updateCount = () => {
            const inc = target / speed;
            if (count < target) {
                count += inc;
                h3.innerText = Math.ceil(count).toLocaleString() + (target >= 50000 ? '+' : '');
                requestAnimationFrame(updateCount);
            } else {
                h3.innerText = target.toLocaleString() + (target >= 50000 ? '+' : '');
                counter.classList.add('counted');
            }
        };
        updateCount();
    }
});

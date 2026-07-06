document.addEventListener('DOMContentLoaded', () => {

    // Custom Cursor (reused logic)
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (!isTouchDevice && cursor && follower) {
        document.addEventListener('mousemove', (e) => {
            const x = e.clientX;
            const y = e.clientY;

            cursor.style.left = `${x}px`;
            cursor.style.top = `${y}px`;

            follower.animate({
                left: `${x}px`,
                top: `${y}px`
            }, { duration: 300, fill: "forwards" });
        });

        const hoverElements = document.querySelectorAll('a, button, input, .login-card');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                document.body.classList.add('cursor-hover');
            });
            el.addEventListener('mouseleave', () => {
                document.body.classList.remove('cursor-hover');
            });
        });
    }

    // GSAP Animations
    // Floating background circles
    gsap.to(".circle-1", {
        y: 100, x: 50, duration: 10, repeat: -1, yoyo: true, ease: "sine.inOut"
    });
    gsap.to(".circle-2", {
        y: -150, x: -100, duration: 15, repeat: -1, yoyo: true, ease: "sine.inOut"
    });
    gsap.to(".circle-3", {
        y: 80, x: -60, duration: 12, repeat: -1, yoyo: true, ease: "sine.inOut"
    });

    // Advanced Form Entrance Animation
    const tl = gsap.timeline();
    
    // Split text on header for advanced letter animation
    const headerTitle = document.querySelector(".login-header h2");
    if(headerTitle) {
        const text = headerTitle.innerText;
        headerTitle.innerHTML = text.split("").map(char => `<span class="char" style="display:inline-block">${char === " " ? "&nbsp;" : char}</span>`).join("");
    }
    
    // Initial state setup
    gsap.set(".login-card", { visibility: "visible" });
    gsap.set(".circle", { scale: 0, opacity: 0 });
    
    // Animate circles in
    tl.to(".circle", {
        scale: 1,
        opacity: 1,
        duration: 1.5,
        stagger: 0.2,
        ease: "elastic.out(1, 0.5)"
    })
    // Bring in the login card with a 3D flip-up effect
    .from(".login-card", {
        y: 100,
        rotationX: 45,
        scale: 0.8,
        opacity: 0,
        duration: 1.2,
        transformOrigin: "center bottom",
        ease: "power4.out"
    }, "-=1")
    // Stagger in the header icon and subtitle
    .from(".login-header .login-icon, .login-header p", {
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.2,
        ease: "power2.out"
    }, "-=0.6")
    // Stagger in the individual letters of "Welcome Back"
    .from(".char", {
        y: 20,
        opacity: 0,
        rotationX: -90,
        transformOrigin: "50% 50% -20",
        duration: 0.6,
        stagger: 0.05,
        ease: "back.out(1.5)"
    }, "-=0.8")
    // Slide in form inputs and button with blur
    .from(".stagger-item", {
        x: -30,
        opacity: 0,
        filter: "blur(10px)",
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out"
    }, "-=0.4");
    
    // Add glowing trail effect to inputs on focus
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            gsap.to(input.parentElement, {
                scale: 1.02,
                duration: 0.3,
                ease: "power2.out"
            });
        });
        input.addEventListener('blur', () => {
            gsap.to(input.parentElement, {
                scale: 1,
                duration: 0.3,
                ease: "power2.out"
            });
        });
    });

    // 3D Tilt Effect on Login Card
    const card = document.querySelector('.tilt-card');
    if(card && !isTouchDevice) {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;
            
            gsap.to(card, {
                rotationX: rotateX,
                rotationY: rotateY,
                transformPerspective: 1000,
                duration: 0.5,
                ease: "power2.out"
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                rotationX: 0,
                rotationY: 0,
                duration: 0.5,
                ease: "power2.out"
            });
        });
    }

    // Advanced Magnetic Effect applied to Submit Button
    const submitBtn = document.querySelector('.submit-btn');
    if (submitBtn && !isTouchDevice) {
        submitBtn.addEventListener('mousemove', (e) => {
            const rect = submitBtn.getBoundingClientRect();
            // Calculate distance from center
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            // Move the button slightly towards mouse
            gsap.to(submitBtn, {
                x: x * 0.2,
                y: y * 0.2,
                duration: 0.3,
                ease: "power2.out"
            });
            // Move text a bit more for parallax
            gsap.to(submitBtn, {
                color: "#fff",
                duration: 0.2
            });
        });

        submitBtn.addEventListener('mouseleave', () => {
            gsap.to(submitBtn, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: "elastic.out(1, 0.3)"
            });
        });
    }

    // Form Submission Interactive Animation
    const loginForm = document.querySelector('.login-form');
    if(loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent actual submission for demo purposes
            
            if(!submitBtn) return;
            
            // Store original text
            const origText = submitBtn.innerText;
            
            // Animation sequence for submit button
            const submitTl = gsap.timeline();
            
            submitTl.to(submitBtn, {
                width: "50px", // morph into a circle
                color: "transparent",
                duration: 0.4,
                ease: "power3.inOut",
                onComplete: () => {
                    // Inject an SVG spinner dynamically
                    submitBtn.style.color = "transparent";
                    submitBtn.innerHTML = `
                        <svg class="spinner" viewBox="0 0 50 50" style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); width:30px; height:30px;">
                            <circle class="path" cx="25" cy="25" r="20" fill="none" stroke="#000" stroke-width="5" style="stroke-linecap:round; animation: dash 1.5s ease-in-out infinite, rotate 2s linear infinite; stroke-dasharray: 1, 200; stroke-dashoffset: 0;"></circle>
                        </svg>
                    `;
                }
            })
            // Wait to simulate network request
            .to({}, {duration: 2})
            // Morph into a success state
            .to(submitBtn, {
                width: "100%",
                background: "#28a745",
                borderColor: "#28a745",
                duration: 0.6,
                ease: "power3.out",
                onStart: () => {
                    submitBtn.innerHTML = '';
                    submitBtn.style.color = "white";
                    submitBtn.innerText = "Success!";
                }
            })
            // Animate card away (redirect simulation)
            .to(".login-card", {
                y: -100,
                opacity: 0,
                rotationX: -10,
                scale: 0.9,
                duration: 0.8,
                ease: "power3.in"
            }, "+=0.5")
            .call(() => {
                // Actually redirect in a real scenario
                window.location.href = "index.html";
            });
            
            // Add CSS keyframes for spinner dynamically if not present
            if(!document.getElementById('spinner-styles')) {
                const style = document.createElement('style');
                style.id = 'spinner-styles';
                style.innerHTML = `
                    @keyframes rotate { 100% { transform: translate(-50%, -50%) rotate(360deg); } }
                    @keyframes dash {
                        0% { stroke-dasharray: 1, 200; stroke-dashoffset: 0; }
                        50% { stroke-dasharray: 89, 200; stroke-dashoffset: -35px; }
                        100% { stroke-dasharray: 89, 200; stroke-dashoffset: -124px; }
                    }
                `;
                document.head.appendChild(style);
            }
        });
    }
});

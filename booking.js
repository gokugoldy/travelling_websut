document.addEventListener('DOMContentLoaded', () => {

    // Inherit cursor logic
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

        const hoverElements = document.querySelectorAll('a, button, input, select, textarea, .booking-form-container');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
        });
    }

    // GSAP Advanced Parallax & Title Split Animation
    const headerTitle = document.querySelector(".split-text");
    if(headerTitle) {
        const text = headerTitle.innerText;
        headerTitle.innerHTML = text.split("").map(char => `<span class="char" style="display:inline-block">${char === " " ? "&nbsp;" : char}</span>`).join("");
    }

    const tl = gsap.timeline();
    
    tl.from(".char", {
        y: 50,
        opacity: 0,
        rotationX: -90,
        transformOrigin: "50% 50% -20",
        duration: 0.8,
        stagger: 0.05,
        ease: "back.out(1.5)"
    })
    .from(".fade-subtitle", {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out"
    }, "-=0.6")
    .from(".stagger-panel", {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out"
    }, "-=0.4");

    // Parallax background blobs reacting to mouse
    const blobs = document.querySelectorAll('.blob');
    if(!isTouchDevice) {
        document.addEventListener('mousemove', (e) => {
            const xOffset = (e.clientX / window.innerWidth - 0.5) * 40;
            const yOffset = (e.clientY / window.innerHeight - 0.5) * 40;
            
            gsap.to(blobs[0], { x: xOffset, y: yOffset, duration: 1, ease: 'power2.out' });
            gsap.to(blobs[1], { x: -xOffset * 1.5, y: -yOffset * 1.5, duration: 1.5, ease: 'power2.out' });
        });
    }

    // Dynamic Image Previewer based on dropdown selection
    const selects = document.querySelectorAll('.dest-select, .hotel-select');
    const dynamicImg = document.getElementById('dynamic-preview');
    
    if(selects.length > 0 && dynamicImg) {
        selects.forEach(select => {
            select.addEventListener('change', (e) => {
                const val = e.target.value;
                let targetImg = 'assets/images/dest_safari.png'; // default
                
                if(val === 'maldives') targetImg = 'assets/images/dest_beach.png';
                if(val === 'swiss') targetImg = 'assets/images/dest_mountain.png';
                if(val === 'japan') targetImg = 'assets/images/dest_city.png';
                if(val === 'santorini') targetImg = 'assets/images/dest_santorini.png';
                if(val === 'cappadocia') targetImg = 'assets/images/dest_cappadocia.png';
    
                // Hotels
                if(val === 'hotel_horizon') targetImg = 'assets/images/hotel_exterior.png';
                if(val === 'hotel_royal') targetImg = 'assets/images/hotel_interior.png';
                if(val === 'hotel_azure') targetImg = 'assets/images/hotel_pool.png';
                if(val === 'hotel_mountain') targetImg = 'assets/images/hotel_mountain.png';
                if(val === 'hotel_forest') targetImg = 'assets/images/hotel_forest.png';
                if(val === 'hotel_desert') targetImg = 'assets/images/hotel_desert.png';
    
                // Animate transition of image
                gsap.to(dynamicImg, {
                    opacity: 0,
                    duration: 0.3,
                    onComplete: () => {
                        dynamicImg.src = targetImg;
                        gsap.to(dynamicImg, { opacity: 1, duration: 0.4, ease: "power2.inOut" });
                    }
                });
            });
        });
    }

    // Step-by-Step Navigation Logic
    const steps = document.querySelectorAll('.form-section');
    const nextBtns = document.querySelectorAll('.next-btn');
    const prevBtns = document.querySelectorAll('.prev-btn');
    let currentStepIndex = 0;

    function goToStep(index) {
        // Animate out current
        gsap.to(steps[currentStepIndex], {
            x: -30,
            opacity: 0,
            duration: 0.3,
            onComplete: () => {
                steps[currentStepIndex].classList.add('hidden');
                steps[currentStepIndex].classList.remove('active');
                
                // Update index
                currentStepIndex = index;
                
                // Animate in new
                steps[currentStepIndex].classList.remove('hidden');
                steps[currentStepIndex].classList.add('active');
                
                gsap.fromTo(steps[currentStepIndex], 
                    { x: 30, opacity: 0 }, 
                    { x: 0, opacity: 1, duration: 0.4, ease: "power2.out" }
                );
            }
        });
    }

    nextBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Very simple validation (can be enhanced)
            const inputs = steps[currentStepIndex].querySelectorAll('input[required], select[required]');
            let isValid = true;
            inputs.forEach(input => {
                if(!input.value) isValid = false;
            });
            
            if(!isValid) {
                // Shake animation for error
                gsap.to(steps[currentStepIndex], { x: 10, duration: 0.1, yoyo: true, repeat: 3 });
                return;
            }

            if(currentStepIndex < steps.length - 1) {
                goToStep(currentStepIndex + 1);
            }
        });
    });

    prevBtns.forEach(btn => {
        btn.addEventListener('click', () => {
             // Animate out current to the right
            gsap.to(steps[currentStepIndex], {
                x: 30,
                opacity: 0,
                duration: 0.3,
                onComplete: () => {
                    steps[currentStepIndex].classList.add('hidden');
                    steps[currentStepIndex].classList.remove('active');
                    
                    // Update index
                    currentStepIndex--;
                    
                    // Animate in new from the left
                    steps[currentStepIndex].classList.remove('hidden');
                    steps[currentStepIndex].classList.add('active');
                    
                    gsap.fromTo(steps[currentStepIndex], 
                        { x: -30, opacity: 0 }, 
                        { x: 0, opacity: 1, duration: 0.4, ease: "power2.out" }
                    );
                }
            });
        });
    });

    // Form Submit handling with Success Modal
    const form = document.getElementById('premium-booking-form');
    const successOverlay = document.querySelector('.success-overlay');
    const submitBtn = document.querySelector('.final-submit-btn');

    if(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Button loading state
            const origText = submitBtn.innerText;
            submitBtn.innerText = "Processing...";
            submitBtn.style.opacity = "0.7";
            submitBtn.disabled = true;

            setTimeout(() => {
                successOverlay.classList.add('active');
            }, 1000);
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lenis for Smooth Scrolling
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });

    lenis.on('scroll', (e) => {
        ScrollTrigger.update();
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    gsap.ticker.add((time)=>{
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // 2. Custom Cursor Logic
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    
    if(cursorDot && cursorOutline && window.innerWidth > 768) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;
            
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;
            
            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: "forwards" });
        });

        const interactables = document.querySelectorAll('a, button, .product-card, input, textarea');
        interactables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorOutline.style.width = '60px';
                cursorOutline.style.height = '60px';
                cursorOutline.style.backgroundColor = 'rgba(200, 16, 46, 0.1)';
                cursorOutline.style.borderColor = 'transparent';
            });
            el.addEventListener('mouseleave', () => {
                cursorOutline.style.width = '40px';
                cursorOutline.style.height = '40px';
                cursorOutline.style.backgroundColor = 'transparent';
                cursorOutline.style.borderColor = 'rgba(200, 16, 46, 0.5)';
            });
        });
    }

    // 3. Navbar scroll effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 4. Advanced GSAP Scroll Animations
    gsap.registerPlugin(ScrollTrigger);

    // ==========================================
    // HIGH-END PINNED HERO ANIMATION SEQUENCE
    // ==========================================
    const heroTl = gsap.timeline({
        scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom bottom", // Uses the 350vh height of the hero section
            scrub: 1, // Smooth scrubbing effect
            pin: ".hero-pin-container",
            anticipatePin: 1
        }
    });

    // Animate the timeline based on scroll progress
    heroTl
        // Scale the background and show the kicker
        .to(".hero-media", { scale: 1.15, duration: 2, ease: "power1.inOut" }, 0)
        .to(".hero-kicker", { opacity: 1, duration: 0.5 }, 0)
        
        // Show graphic
        .to(".hero-graphic", { opacity: 0.6, duration: 1 }, 0.5)

        // Stagger in the main title words (sliding up from below)
        .to(".word-1", { y: 0, opacity: 1, duration: 0.8, ease: "back.out(1.2)" }, 0.5)
        .to(".word-2", { y: 0, opacity: 1, duration: 0.8, ease: "back.out(1.2)" }, 0.8)
        .to(".word-3", { y: 0, opacity: 1, duration: 0.8, ease: "back.out(1.2)" }, 1.1)

        // Spin the geometric rings as the user scrolls
        .to(".ring-1", { rotation: 180, duration: 4, ease: "none" }, 0)
        .to(".ring-2", { rotation: -180, duration: 4, ease: "none" }, 0)
        .to(".ring-3", { rotation: 360, scale: 1.1, duration: 4, ease: "power1.inOut" }, 0)

        // Fade in subtitle and buttons
        .to(".hero-subtitle", { opacity: 1, duration: 1 }, 1.5)
        .to(".hero-cta", { opacity: 1, y: 0, duration: 1, ease: "power2.out" }, 1.8)

        // Final transition: Elements fade/fly away as the hero finishes its pin
        .to(".hero-text-wrapper", { y: -150, opacity: 0, duration: 1.5, ease: "power2.in" }, 3)
        .to(".hero-graphic", { x: 150, opacity: 0, duration: 1.5, ease: "power2.in" }, 3)
        .to(".hero-overlay", { opacity: 0, duration: 1 }, 3.5);


    // ==========================================
    // REST OF PAGE SCROLL REVEALS
    // ==========================================

    const fadeElements = gsap.utils.toArray('.fade-up');
    fadeElements.forEach(el => {
        gsap.fromTo(el, 
            { y: 50, opacity: 0 },
            { 
                y: 0, 
                opacity: 1, 
                duration: 1, 
                ease: "power3.out",
                scrollTrigger: {
                    trigger: el,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    });

    gsap.from(".product-card", {
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
            trigger: ".product-grid",
            start: "top 80%"
        }
    });

    gsap.fromTo(".sourcing-bg-img", 
        { yPercent: -10 },
        {
            yPercent: 10,
            ease: "none",
            scrollTrigger: {
                trigger: ".sourcing",
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        }
    );

    gsap.fromTo(".map-img",
        { scale: 0.9, opacity: 0, rotationX: 15 },
        { 
            scale: 1, 
            opacity: 1, 
            rotationX: 0, 
            duration: 1.5, 
            ease: "power3.out",
            scrollTrigger: {
                trigger: ".map-container",
                start: "top 75%"
            }
        }
    );

    gsap.from(".why-card i", {
        scale: 0,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "back.out(1.7)",
        scrollTrigger: {
            trigger: ".why-grid",
            start: "top 80%"
        }
    });

    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        
        ScrollTrigger.create({
            trigger: counter,
            start: "top 90%",
            once: true,
            onEnter: () => {
                gsap.to(counter, {
                    innerHTML: target,
                    duration: 2.5,
                    ease: "power3.out",
                    snap: { innerHTML: 1 },
                    onUpdate: function() {
                        counter.innerHTML = Math.ceil(this.targets()[0].innerHTML);
                    }
                });
            }
        });
    });
});

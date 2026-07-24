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

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // 2. Custom Cursor Logic
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    if (cursorDot && cursorOutline && window.innerWidth > 768) {
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

        const interactables = document.querySelectorAll('a, button, .catalogue-card, input, textarea');
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
                },
                onComplete: () => el.classList.add('ready'),
                onReverseComplete: () => el.classList.remove('ready')
            }
        );
    });

    gsap.from(".catalogue-card", {
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: {
            each: 0.1,
            onComplete: function () {
                this.targets()[0].classList.add('ready');
            }
        },
        ease: "power2.out",
        scrollTrigger: {
            trigger: ".catalogue-grid",
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
        stagger: {
            each: 0.1,
            onComplete: function () {
                this.targets()[0].closest('.why-card').classList.add('ready');
            }
        },
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
                    onUpdate: function () {
                        counter.innerHTML = Math.ceil(this.targets()[0].innerHTML);
                    }
                });
            }
        });
    });

    // ==========================================
    // PRODUCTS PAGE LOGIC
    // ==========================================
    const productsGrid = document.getElementById('products-grid');
    if (productsGrid) {
        // We are on products.html

        const productsData = [
            // Brochure Products
            {
                name: 'UPVC Drainage Pipes & Fittings',
                desc: 'Complete range of uPVC drainage pipes & fittings (32 mm – 1000 mm). Ideal for domestic and industrial drainage applications.',
                specs: { 'Material': 'uPVC', 'Standard': 'British-European standards', 'Joints': 'Solvent weld and rubber ring' },
                img: 'assets/Screenshot 2026-07-23 170328.png',
                images: [
                    'assets/Screenshot 2026-07-23 170328.png',
                    'assets/Hepworth.jpg',
                    'assets/images%20(1).jpg'
                ],
                badge: 'Premium',
                industries: ['Commercial', 'Infrastructure', 'Industrial', 'Residential'],
                brands: ['Hepworth']
            },
            {
                name: 'Soundproof Pipes & Fittings',
                desc: 'Innovative mineral reinforced polypropylene (CPP) soil & waste system. Optimized 3-layer pipe structure & higher weight for reduced noise levels.',
                specs: { 'Material': 'Mineral reinforced PP', 'Standard': 'EN-1451-1, EN 13501 & DIN EN 14366' },
                img: 'assets/Screenshot 2026-07-23 170345.png',
                images: [
                    'assets/Screenshot 2026-07-23 170345.png',
                    'assets/Wavin-India-Website-Images.webp'
                ],
                industries: ['Commercial', 'Residential'],
                brands: ['Wavin', 'SiTech+', 'AS+']
            },
            {
                name: 'High Pressure Pipes & Fittings',
                desc: 'Distribution of cold water under pressure, air conditioning drain systems, piping networks for swimming pools, and transport of chemicals.',
                specs: { 'Material': 'PVC', 'Applications': 'High Pressure Fluids' },
                img: 'assets/Screenshot 2026-07-23 170414.png',
                images: [
                    'assets/Screenshot 2026-07-23 170414.png',
                    'assets/pvc-pipe-fittings-500x500.webp',
                    'assets/RACCORDI-PVC_1S.webp'
                ],
                industries: ['Industrial', 'Infrastructure'],
                brands: ['Hepworth', 'wavin']
            },
            {
                name: 'HDPE Pressure Pipes & Fittings',
                desc: 'Suitable for all types of drainage applications including soil & waste, above-ground, below-ground, and chemical waste systems.',
                specs: { 'Material': 'HDPE', 'Standard': 'EN 1519 - 1' },
                img: 'assets/hdpe-pipes.png',
                images: [
                    'assets/hdpe-pipes.png',
                    'assets/images%20(2).jpg'
                ],
                industries: ['Commercial', 'Infrastructure', 'Industrial', 'Utility'],
                brands: ['Hepworth']
            },
            {
                name: 'UPVC Duct Pipes & Fabricated Fittings',
                desc: 'DUCT Pipes are manufactured as per DIN 8062 and BS 3506 standards. UPVC is self-extinguishing and will not support combustion.',
                specs: { 'Material': 'uPVC', 'Standard': 'DIN 8062, BS 3506' },
                img: 'assets/Screenshot 2026-07-23 170403.png',
                images: [
                    'assets/Screenshot 2026-07-23 170403.png',
                    'assets/images%20(3).jpg'
                ],
                industries: ['Infrastructure', 'Utility'],
                brands: ['Hycount']
            },
            {
                name: 'Generators',
                desc: 'Generates electrical power and hot water simultaneously from a single heat source. Operates using gas, wood, and multiple fuel types.',
                specs: { 'Output': '1–2 kW electrical', 'Application': 'Residential, commercial, off-grid' },
                img: 'assets/sterling-sge-25-pr-25-kva-generator.jpg',
                images: [
                    'assets/sterling-sge-25-pr-25-kva-generator.jpg',
                    'assets/sterling gen 2.jpg'
                ],
                badge: 'Sustainable',
                industries: ['Residential', 'Commercial', 'Off-grid'],
                brands: ['Sterling Generators']
            },
            {
                name: 'PVC Conduits & Accessories',
                desc: 'High impact strength, UV stabilized PVC conduits and complete range of GI boxes. Low smoke for fire retardant.',
                specs: { 'Material': 'PVC', 'Standard': 'BSEN4607, IEC61386' },
                img: 'assets/high-pressure-pipes.png',
                images: [
                    'assets/high-pressure-pipes.png',
                    'assets/images%20(5).jpg'
                ],
                industries: ['Commercial', 'Residential', 'Industrial'],
                brands: ['Rexton']
            },
            {
                name: 'Row DBs & ONU Cabinets',
                desc: 'Designed & fabricated as per specifications of telecom operators. Tempered glass door with ventilation provision.',
                specs: { 'Material': 'Electro Galvanized Sheet Steel', 'Standard': 'RAL7035, RAL9010' },
                img: 'assets/image.png',
                images: [
                    'assets/image.png',

                ],
                industries: ['Telecom', 'Commercial'],
                brands: ['Rexton']
            },
            {
                name: 'GI Conduits & Accessories',
                desc: 'Class 3 & 4 GI conduits - Hot dip galvanized coated for corrosion protection. Non-Flame propagating.',
                specs: { 'Material': 'GI', 'Standard': 'British & European standards' },
                img: 'assets/image copy 2.png',
                images: [
                    'assets/image copy 2.png',

                ],
                industries: ['Infrastructure', 'Industrial'],
                brands: ['Caparo']
            },

            // Giacomini Products
            {
                name: 'Pressure Independent Control Valve (PICV)',
                desc: 'Enables to regulate and keep constant the flow rate in the terminal unit when the differential pressure of the main circuit varies.',
                specs: { 'Max working pressure': '25 bar', 'Working temp': '5÷110 °C' },
                img: 'assets/picv.jpg',
                images: [
                    'assets/picv.jpg',
                    'assets/check%20valve.jpg'
                ],
                industries: ['HVAC', 'Commercial', 'Residential'],
                brands: ['Giacomini']
            },
            {
                name: 'Static Balancing Valve',
                desc: 'Static balancing valves allow a gradual and precise regulation of the flow rate. Venturi principle flowmeter.',
                specs: { 'Max working pressure': '25 bar', 'Working temp': '5÷110 °C' },
                img: 'assets/staticbalancing.png',
                images: [
                    'assets/staticbalancing.png',
                    'assets/staticblancing2.png'
                ],
                industries: ['HVAC', 'Hydronic Distribution'],
                brands: ['Giacomini']
            },
            {
                name: 'Thermostatic Mixer',
                desc: 'Thermostatic mixer for domestic water systems with high efficiency thermo-electric probe.',
                specs: { 'Max working pressure': '16 bar', 'Max working temp': '100 °C' },
                img: 'assets/thermostatic.jpg',
                images: [
                    'assets/thermostatic.jpg',
                    'assets/thermostatic%202.jpg'
                ],
                industries: ['Residential', 'Commercial'],
                brands: ['Giacomini']
            },
            {
                name: 'Diaphragm Pressure Reducer',
                desc: 'Automatic valve that reduces and stabilizes the pressure of a fluid in a water distribution conduit according to a preset value.',
                specs: { 'Max working pressure': '25 bar', 'Sound class': 'II' },
                img: 'assets/image copy.png',
                images: [
                    'assets/image copy.png',

                ],
                badge: 'Safety',
                industries: ['HVAC', 'Plumbing', 'Commercial'],
                brands: ['Giacomini']
            },
            {
                name: 'Hydraulic Separators',
                desc: 'Hydraulic separator with flanged connections. Equipped with automatic air vent and drain cock. Varnished steel body.',
                specs: { 'Max working pressure': '10 bar', 'Temperature': '0÷110 °C' },
                img: 'assets/hydrulic.jpg',
                images: [
                    'assets/hydrulic.jpg',

                ],
                industries: ['HVAC', 'Industrial'],
                brands: ['Giacomini']
            },

            // NEWAY Products


            {
                name: 'Resilient Seated Gate Valves',
                desc: 'Gate valves ensuring zero leakage and reliable isolation in high-demand water transmission systems.',
                specs: { 'Type': 'NRS / OS&Y', 'Application': 'Isolation' },
                img: 'assets/check%20valve%202.jpg',
                images: [
                    'assets/check%20valve%202.jpg',
                    'assets/infrastructure%20valve.jpeg'
                ],
                badge: 'Zero Leakage',
                industries: ['Potable Waterworks', 'Wastewater Treatment', 'Data Centres'],
                brands: ['NEWAY']
            },
            {
                name: 'Double Door Check Valves',
                desc: 'Non-return valves designed to prevent backflow in critical pipeline systems, minimizing water hammer.',
                specs: { 'Type': 'Non-return', 'Feature': 'Silent check' },
                img: 'assets/check%20valve.jpg',
                images: [
                    'assets/check%20valve.jpg',
                    'assets/check%20valve%202.jpg'
                ],
                industries: ['Desalination Plants', 'District Cooling', 'Potable Waterworks'],
                brands: ['NEWAY']
            },

            {
                name: 'Strainers',
                desc: 'Y-Strainers and Foot valves designed for efficient filtration and pump protection in pipelines.',
                specs: { 'Type': 'Y-Strainer / Foot valve', 'Application': 'Filtration' },
                img: 'assets/y strainer.jpg',
                images: [
                    'assets/y strainer.jpg',
                    'assets/infrastructure%20valve.jpeg'
                ],
                industries: ['Desalination Plants', 'Data Centres', 'Potable Waterworks'],
                brands: ['NEWAY']
            },
            {
                name: 'Water Meter',
                desc: 'Piston type flow regulators and automatic control valves for precise flow management in critical facilities.',
                specs: { 'Type': 'Piston type', 'Application': 'Flow Regulation' },
                img: 'assets/ultrasonic%20wate%20rmeter.jpeg',
                images: [
                    'assets/ultrasonic%20wate%20rmeter.jpeg',
                    'assets/infrastructure%20valve.jpeg'
                ],
                badge: 'Precision',
                industries: ['Desalination Plants', 'District Cooling', 'Wastewater Treatment'],
                brands: ['NEWAY']
            }
        ];

        let gridHTML = '';
        productsData.forEach((item, index) => {
            const badgeHTML = item.badge ? `<div class="catalogue-badge">${item.badge}</div>` : '';

            gridHTML += `
                <div class="catalogue-card product-item" data-index="${index}">
                    <div class="catalogue-image">
                        <img src="${item.img}" alt="${item.name}">
                        ${badgeHTML}
                    </div>
                    <div class="catalogue-content">
                        <h3>${item.name}</h3>
                        <p style="margin-bottom: 0;">${item.desc}</p>
                        <a href="javascript:void(0)" class="btn-primary-outline catalogue-btn view-details-btn" style="margin-top: 1.5rem;">View Details <i data-lucide="arrow-right"></i></a>
                    </div>
                </div>
            `;
        });

        productsGrid.innerHTML = gridHTML;

        // Modal Logic
        const modal = document.getElementById('product-modal');
        const modalClose = document.getElementById('modal-close');

        let currentImages = [];
        let currentImageIndex = 0;
        const modalPrevBtn = document.getElementById('modal-prev-btn');
        const modalNextBtn = document.getElementById('modal-next-btn');
        const modalSliderDots = document.getElementById('modal-slider-dots');
        const modalImg = document.getElementById('modal-img');

        const updateSlider = () => {
            if (!currentImages || currentImages.length <= 1) {
                if (modalPrevBtn) modalPrevBtn.style.display = 'none';
                if (modalNextBtn) modalNextBtn.style.display = 'none';
                if (modalSliderDots) modalSliderDots.style.display = 'none';
                if (modalImg) modalImg.src = currentImages[0] || '';
                return;
            }
            if (modalPrevBtn) modalPrevBtn.style.display = 'flex';
            if (modalNextBtn) modalNextBtn.style.display = 'flex';
            if (modalSliderDots) modalSliderDots.style.display = 'flex';

            if (modalImg) modalImg.src = currentImages[currentImageIndex];

            if (modalSliderDots) {
                let dotsHTML = '';
                currentImages.forEach((_, idx) => {
                    dotsHTML += `<div class="modal-dot ${idx === currentImageIndex ? 'active' : ''}" data-idx="${idx}"></div>`;
                });
                modalSliderDots.innerHTML = dotsHTML;
                document.querySelectorAll('.modal-dot').forEach(dot => {
                    dot.addEventListener('click', (e) => {
                        currentImageIndex = parseInt(e.target.getAttribute('data-idx'));
                        updateSlider();
                    });
                });
            }
        };

        if (modalPrevBtn && modalNextBtn) {
            modalPrevBtn.addEventListener('click', () => {
                if (currentImages.length > 1) {
                    currentImageIndex = (currentImageIndex - 1 + currentImages.length) % currentImages.length;
                    updateSlider();
                }
            });
            modalNextBtn.addEventListener('click', () => {
                if (currentImages.length > 1) {
                    currentImageIndex = (currentImageIndex + 1) % currentImages.length;
                    updateSlider();
                }
            });
        }

        const openModal = (item) => {
            document.getElementById('modal-title').textContent = item.name;
            document.getElementById('modal-desc').textContent = item.desc;

            currentImages = item.images && item.images.length > 0 ? item.images : [item.img];
            currentImageIndex = 0;
            updateSlider();

            const badge = document.getElementById('modal-badge');
            if (item.badge) {
                badge.style.display = 'inline-block';
                badge.textContent = item.badge;
            } else {
                badge.style.display = 'none';
            }

            let specsHTML = '';
            for (const [key, value] of Object.entries(item.specs)) {
                specsHTML += `<li><span>${key}:</span> ${value}</li>`;
            }
            document.getElementById('modal-specs').innerHTML = specsHTML;

            let industriesHTML = '';
            if (item.industries && item.industries.length > 0) {
                item.industries.forEach(industry => {
                    industriesHTML += `<span class="industry-tag">${industry}</span>`;
                });
            }
            document.getElementById('modal-industries').innerHTML = industriesHTML;

            let brandsHTML = '';
            if (item.brands && item.brands.length > 0) {
                item.brands.forEach(brand => {
                    brandsHTML += `<span class="brand-tag"><i data-lucide="award" style="width: 14px; height: 14px; display: inline; margin-right: 4px;"></i>${brand}</span>`;
                });
            } else {
                brandsHTML = '<span style="color: var(--text-muted); font-size: 0.9rem;">Not specified</span>';
            }

            // We need to inject the brands section. Let's add it dynamically or update an existing container.
            const brandsContainer = document.getElementById('modal-brands');
            if (brandsContainer) {
                brandsContainer.innerHTML = brandsHTML;
            }

            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            // Re-initialize lucide icons inside the modal after content is injected
            lucide.createIcons();
        };

        const closeModal = () => {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        };

        document.querySelectorAll('.product-item').forEach(card => {
            card.querySelector('.view-details-btn').addEventListener('click', () => {
                const index = card.getAttribute('data-index');
                openModal(productsData[index]);
            });
        });

        modalClose.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeModal();
        });

        // Trigger GSAP animations for dynamically added elements
        setTimeout(() => {
            lucide.createIcons();

            // Stagger the product cards smoothly
            gsap.from(".product-item", {
                y: 60,
                opacity: 0,
                duration: 0.8,
                stagger: {
                    each: 0.1,
                    onComplete: function () {
                        this.targets()[0].classList.add('ready');
                    }
                },
                ease: "power2.out",
                scrollTrigger: {
                    trigger: "#products-grid",
                    start: "top 95%"
                }
            });

            const fadeElements = gsap.utils.toArray('.fade-up');
            fadeElements.forEach(el => {
                gsap.fromTo(el,
                    { y: 50, opacity: 0 },
                    { y: 0, opacity: 1, duration: 1, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 95%" }, onComplete: () => el.classList.add('ready') }
                );
            });
            ScrollTrigger.refresh();
        }, 100);
    }

    // Cookie Consent Logic
    const cookieBanner = document.getElementById('cookie-consent');
    if (cookieBanner) {
        // Check if user has already made a choice
        const cookieConsent = localStorage.getItem('mechway_cookie_consent');

        if (!cookieConsent) {
            // Show banner after a slight delay
            setTimeout(() => {
                cookieBanner.classList.add('show');
            }, 1500);
        }

        const handleConsent = (choice) => {
            localStorage.setItem('mechway_cookie_consent', choice);
            cookieBanner.classList.remove('show');
        };

        document.getElementById('cookie-accept')?.addEventListener('click', () => handleConsent('accepted'));
        document.getElementById('cookie-reject')?.addEventListener('click', () => handleConsent('rejected'));
    }
});

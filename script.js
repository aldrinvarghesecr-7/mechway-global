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

    // 3. Navbar scroll effect - Entire navbar banner (logo, links, phone number) goes away on scrolling
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 40) {
                navbar.classList.add('nav-hidden');
            } else {
                navbar.classList.remove('nav-hidden');
            }
        });
    }

    // 4. Advanced GSAP Animations
    gsap.registerPlugin(ScrollTrigger);

    // ==========================================
    // AUTOMATIC HERO ENTRANCE ANIMATION SEQUENCE
    // ==========================================
    const heroMedia = document.querySelector('.hero-media');
    if (heroMedia) {
        const heroTl = gsap.timeline({
            defaults: { ease: "power3.out" }
        });

        heroTl
            .to(".hero-media", { scale: 1.08, duration: 2.2, ease: "power1.out" }, 0)
            .to(".hero-kicker", { opacity: 1, y: 0, duration: 0.8 }, 0.2)
            .to(".hero-graphic", { opacity: 0.7, duration: 1.2 }, 0.4)
            .to(".word-1", { y: 0, opacity: 1, duration: 0.9, ease: "back.out(1.4)" }, 0.5)
            .to(".word-2", { y: 0, opacity: 1, duration: 0.9, ease: "back.out(1.4)" }, 0.75)
            .to(".word-3", { y: 0, opacity: 1, duration: 0.9, ease: "back.out(1.4)" }, 1.0)
            .to(".hero-subtitle", { opacity: 1, y: 0, duration: 1 }, 1.25)
            .to(".hero-cta", { opacity: 1, y: 0, duration: 1 }, 1.45)
            .to(".scroll-indicator", { opacity: 1, duration: 1 }, 1.7);

        // Continuous ambient rotation for geometric rings
        gsap.to(".ring-1", { rotation: 360, duration: 35, repeat: -1, ease: "none" });
        gsap.to(".ring-2", { rotation: -360, duration: 28, repeat: -1, ease: "none" });
        gsap.to(".ring-3", { rotation: 360, duration: 22, repeat: -1, ease: "none" });
    }


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
    // PRODUCTS & BRANDS LOGIC
    // ==========================================

    // Master Products Database
    const productsData = [
        {
            name: 'UPVC Drainage Pipes & Fittings',
            desc: 'Complete range of uPVC drainage pipes & fittings (32 mm – 1000 mm) manufactured to British and European standards for domestic, commercial, and infrastructure applications.',
            specs: {
                'Material': 'uPVC (Unplasticized Polyvinyl Chloride)',
                'Standards': 'BS EN 1329 / BS EN 1401 / DIN standards',
                'Applications': 'Building Services, Infrastructure, Landscaping',
                'Features': 'Corrosion resistant, high flow capacity, durable rubber ring/solvent joints'
            },
            badge: 'Infrastructure Grade',
            icon: 'layers',
            industries: ['Building Services - Residential & Commercial', 'Infrastructure', 'Landscaping'],
            brands: ['Hepworth', 'Supreme']
        },
        {
            name: 'PPR pipes and fittings',
            desc: 'High-performance Polypropylene Random Copolymer (PPR) piping systems for hot and cold pressure distribution networks.',
            specs: {
                'Material': 'PPR (Polypropylene Random Copolymer)',
                'Pressure Rating': 'PN10, PN16, PN20',
                'Applications': 'Hot & Cold Water Supply, HVAC Systems',
                'Features': 'Homogeneous fusion welding, leak-proof joints, non-corrosive'
            },
            badge: 'Hot & Cold Water',
            icon: 'repeat',
            industries: ['Building Services - Residential & Commercial'],
            brands: ['Supreme']
        },
        {
            name: 'PEX pipe and fittings',
            desc: 'Flexible cross-linked polyethylene (PEX) piping system providing exceptional temperature resistance and long-term mechanical durability.',
            specs: {
                'Material': 'Cross-linked Polyethylene (PEX)',
                'Temperature Range': '-40°C to +95°C',
                'Applications': 'Plumbing, Underfloor Heating, Chilled Water',
                'Features': 'High flexibility, scale resistance, freeze resistant'
            },
            badge: 'Flexible Piping',
            icon: 'corner-down-right',
            industries: ['Building Services - Residential & Commercial'],
            brands: ['Supreme']
        },
        {
            name: 'Sound proof Drainage Pipes & Fittings',
            desc: 'Acoustically optimized 3-layer mineral-reinforced soil & waste system designed to eliminate drainage noise in high-end developments.',
            specs: {
                'Material': 'Mineral-Reinforced Polypropylene (CPP)',
                'Standards': 'EN 1451-1, DIN EN 14366 acoustic test certified',
                'Noise Level': '< 15 dB acoustic dampening',
                'Features': 'High weight structure, sound dampening core'
            },
            badge: 'Acoustic Silent',
            icon: 'shield',
            industries: ['Building Services - Residential & Commercial'],
            brands: ['Wavin']
        },
        {
            name: 'High Pressure Pipes & Fittings',
            desc: 'Heavy-duty pressure piping systems designed for demanding fluid distribution, chemical transport, and air conditioning condensate loops.',
            specs: {
                'Material': 'Heavy-duty uPVC / PVC',
                'Pressure Class': 'Up to 16 Bar (PN16)',
                'Applications': 'Chilled Water, Condensate Drain, Swimming Pools',
                'Features': 'High tensile strength, UV resistant'
            },
            badge: 'High Pressure',
            icon: 'gauge',
            industries: ['Building Services - Residential & Commercial'],
            brands: ['Hepworth', 'Comer']
        },
        {
            name: 'HDPE Pipes & Fittings',
            desc: 'High-Density Polyethylene (HDPE) pressure pipes offering flexibility, superior chemical resistance, and robust joint integrity.',
            specs: {
                'Material': 'PE100 High-Density Polyethylene',
                'Standards': 'EN 1519-1 / ISO 4427',
                'Joint Method': 'Butt Fusion & Electrofusion',
                'Features': 'Impact resistant, ground movement flexible'
            },
            badge: 'Heavy Duty',
            icon: 'box',
            industries: ['Building Services - Residential & Commercial'],
            brands: ['Hepworth']
        },
        {
            name: 'Duct Pipes & Accessories',
            desc: 'Precision uPVC cable ducting pipes and fabricated accessories for power, telecom, infrastructure, and underground protection.',
            specs: {
                'Material': 'Self-extinguishing uPVC',
                'Standards': 'DIN 8062, BS 3506',
                'Applications': 'Electrical, Telecom, Utility Ducts',
                'Features': 'Non-conductive, flame retardant, high impact'
            },
            badge: 'Cable Protection',
            icon: 'grid',
            industries: ['Building Services - Residential & Commercial', 'Infrastructure', 'Landscaping'],
            brands: ['Hepworth', 'HYCOUNT']
        },
        {
            name: 'Copper Alloy Plumbing & HVAC Valves',
            desc: 'Precision brass and bronze alloy valves for domestic water supply, pressure control, and hydronic heating/cooling distribution.',
            specs: {
                'Material': 'Dezincification Resistant (DZR) Brass & Bronze',
                'Pressure Class': 'PN16 / PN25',
                'Temperature Rating': '-10°C to +110°C',
                'Types': 'Ball valves, Check valves, Strainers, Gate valves'
            },
            badge: 'Precision Alloy',
            icon: 'sliders',
            industries: ['Building Services - Residential & Commercial'],
            brands: ['Giacomini']
        },
        {
            name: 'Iron Body Plumbing & HVAC Valves',
            desc: 'Heavy industrial ductile and cast iron body isolation and check valves engineered for major commercial HVAC mains and plumbing risers.',
            specs: {
                'Material': 'Ductile Iron GGG40 / Cast Iron GG25',
                'End Connections': 'Flanged BS EN 1092-2 / ANSI 150',
                'Features': 'Resilient seated, epoxy coated internal/external',
                'Applications': 'Central Plant, Risers, Chilled Water Mains'
            },
            badge: 'Industrial Grade',
            icon: 'anchor',
            industries: ['Building Services - Residential & Commercial'],
            brands: ['Giacomini', 'Neway']
        },
        {
            name: 'Pre-Assembled FCU Valve Package',
            desc: 'Factory-tested pre-assembled Fan Coil Unit (FCU) hook-up packages integrating PICV, strainers, bypass valves, and drain ports.',
            specs: {
                'Components': 'PICV, Y-Strainer, 3-Port Bypass Valve, Test Points',
                'Testing': '100% Factory Pressure & Flow Tested',
                'Features': 'Drastically reduces on-site installation time and leaks',
                'Applications': 'Fan Coil Units, Chilled Beams'
            },
            badge: 'Pre-Fab Modular',
            icon: 'package-check',
            industries: ['Building Services - Residential & Commercial'],
            brands: ['Giacomini']
        },
        {
            name: 'Plumbing Speciality Valves',
            desc: 'Specialized hydronic control devices including pressure reducing valves, thermostatic mixing valves, and automatic air vents.',
            specs: {
                'Types': 'Pressure Reducers, TMVs, Dynamic Balancing, Air Vents',
                'Standard': 'EN 1567 sound class certified',
                'Max Working Temp': 'Up to 100°C',
                'Features': 'Diaphragm operation, tamper-proof setpoints'
            },
            badge: 'Specialty Control',
            icon: 'filter',
            industries: ['Building Services - Residential & Commercial'],
            brands: ['Giacomini']
        },
        {
            name: 'Industrial Valves',
            desc: 'High-performance butterfly, gate, globe, check, and ball valves engineered for heavy industrial processes, marine, and energy networks.',
            specs: {
                'Types': 'Triple-Offset Butterfly, OS&Y Gate, Swing Check, Ball Valves',
                'Pressure Ratings': 'Class 150 to Class 1500 / PN10-PN100',
                'Standards': 'API 600, API 609, BS 5163',
                'Applications': 'Infrastructure, Landscaping, Marine, Oil & Gas'
            },
            badge: 'Heavy Industrial',
            icon: 'wrench',
            industries: ['Infrastructure', 'Landscaping', 'Marine', 'Oil & Gas'],
            brands: ['Neway']
        },
        {
            name: 'Water & Thermal Energy Metering Solutions',
            desc: 'High-accuracy static ultrasonic water meters, thermal energy meters (BTU meters), and smart sub-metering infrastructure.',
            specs: {
                'Technology': 'Ultrasonic Transit-Time & Thermal Sensors',
                'Communication': 'M-Bus, Modbus, LoRaWAN, Pulse Output',
                'Accuracy': 'MID Class 2 / ISO 4064',
                'Applications': 'District Cooling, Tenant Sub-Metering, Commercial'
            },
            badge: 'Smart Metering',
            icon: 'gauge',
            industries: ['Building Services - Residential & Commercial'],
            brands: ['Maddalena']
        }
    ];

    // Helper: Generate Multiple Image Placeholders per Product
    const generateProductPlaceholders = (item) => {
        const title = item.name.toUpperCase();

        const svg1 = `data:image/svg+xml;utf8,${encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="100%" height="100%">
                <defs>
                    <linearGradient id="bg1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#0f172a" />
                        <stop offset="100%" stop-color="#1e293b" />
                    </linearGradient>
                    <pattern id="grid1" width="30" height="30" patternUnits="userSpaceOnUse">
                        <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#bg1)" />
                <rect width="100%" height="100%" fill="url(#grid1)" />
                <circle cx="300" cy="170" r="75" fill="none" stroke="rgba(200, 16, 46, 0.35)" stroke-width="2"/>
                <circle cx="300" cy="170" r="105" fill="none" stroke="rgba(200, 16, 46, 0.15)" stroke-width="1" stroke-dasharray="6,6"/>
                <rect x="250" y="120" width="100" height="100" rx="18" fill="rgba(255,255,255,0.04)" stroke="rgba(200,16,46,0.6)" stroke-width="2"/>
                <text x="300" y="315" text-anchor="middle" fill="#ffffff" font-family="sans-serif" font-size="18" font-weight="700" letter-spacing="1.5">${title}</text>
                <text x="300" y="342" text-anchor="middle" fill="#94a3b8" font-family="sans-serif" font-size="12" font-weight="500" letter-spacing="1">VIEW 01 - TECHNICAL SCHEMATIC & DRAFT</text>
            </svg>
        `)}`;

        const svg2 = `data:image/svg+xml;utf8,${encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="100%" height="100%">
                <defs>
                    <linearGradient id="bg2" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#111827" />
                        <stop offset="100%" stop-color="#0f172a" />
                    </linearGradient>
                    <pattern id="grid2" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(200,16,46,0.08)" stroke-width="1"/>
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#bg2)" />
                <rect width="100%" height="100%" fill="url(#grid2)" />
                <line x1="80" y1="180" x2="520" y2="180" stroke="rgba(255,255,255,0.2)" stroke-width="2" stroke-dasharray="8,8"/>
                <line x1="300" y1="60" x2="300" y2="300" stroke="rgba(255,255,255,0.2)" stroke-width="2" stroke-dasharray="8,8"/>
                <circle cx="300" cy="180" r="65" fill="rgba(200,16,46,0.12)" stroke="#c8102e" stroke-width="2"/>
                <text x="300" y="315" text-anchor="middle" fill="#ffffff" font-family="sans-serif" font-size="18" font-weight="700" letter-spacing="1.5">${title}</text>
                <text x="300" y="342" text-anchor="middle" fill="#94a3b8" font-family="sans-serif" font-size="12" font-weight="500" letter-spacing="1">VIEW 02 - SPECIFICATION & DIMENSIONAL MATRIX</text>
            </svg>
        `)}`;

        const svg3 = `data:image/svg+xml;utf8,${encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="100%" height="100%">
                <defs>
                    <linearGradient id="bg3" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#1e1b4b" />
                        <stop offset="100%" stop-color="#0f172a" />
                    </linearGradient>
                </defs>
                <rect width="100%" height="100%" fill="url(#bg3)" />
                <polygon points="300,80 385,225 215,225" fill="none" stroke="rgba(200, 16, 46, 0.45)" stroke-width="2.5"/>
                <circle cx="300" cy="175" r="40" fill="rgba(255,255,255,0.05)" stroke="#ffffff" stroke-width="1.5"/>
                <text x="300" y="315" text-anchor="middle" fill="#ffffff" font-family="sans-serif" font-size="18" font-weight="700" letter-spacing="1.5">${title}</text>
                <text x="300" y="342" text-anchor="middle" fill="#94a3b8" font-family="sans-serif" font-size="12" font-weight="500" letter-spacing="1">VIEW 03 - ISO CERTIFICATION & MATERIAL PROFILE</text>
            </svg>
        `)}`;

        return [svg1, svg2, svg3];
    };

    // Helper: Map brand names to logo images for Brands Available section
    const getBrandLogoImageCard = (brandName) => {
        const brandsMap = {
            'Hepworth': { img: 'assets/hepworth logo.png', color: '#c8102e' },
            'Supreme': { img: 'assets/supreme.png', color: '#004b93' },
            'Wavin': { img: 'assets/wavin logo.png', color: '#0072ce' },
            'Comer': { img: 'assets/comer.png', color: '#e65100' },
            'HYCOUNT': { img: 'assets/Screenshot 2026-07-23 121141.png', color: '#2e7d32' },
            'Giacomini': { img: 'assets/giacomni.png', color: '#c8102e' },
            'Neway': { img: 'assets/neway.png', color: '#0052cc' },
            'Maddalena': { img: null, color: '#6a1b9a' }
        };

        const b = brandsMap[brandName] || { img: null, color: '#c8102e' };

        let imageTag = '';
        if (b.img) {
            imageTag = `<img src="${b.img}" alt="${brandName} Logo" class="brand-available-img" onerror="this.style.display='none'; this.nextElementSibling.style.display='inline-block';" />
            <span class="brand-fallback-text" style="display:none; color: ${b.color}; font-weight: 700;">${brandName}</span>`;
        } else {
            imageTag = `<span class="brand-fallback-text" style="color: #ffffff; font-weight: 800; font-family: 'Outfit', sans-serif;">${brandName}</span>`;
        }

        return `
            <div class="brand-available-card" data-brand="${brandName}" title="Click to view all ${brandName} products">
                <div class="brand-available-img-box">
                    ${imageTag}
                </div>
                <span class="brand-available-title">${brandName}</span>
                <span class="brand-click-hint"><i data-lucide="arrow-up-right"></i> View Products</span>
            </div>
        `;
    };

    // Render Products Grid (if on products.html)
    const productsGrid = document.getElementById('products-grid');
    if (productsGrid) {
        let gridHTML = '';
        productsData.forEach((item, index) => {
            const badgeHTML = item.badge ? `<div class="modal-badge" style="position: absolute; top: 1rem; left: 1rem; z-index: 5;">${item.badge}</div>` : '';
            const iconName = item.icon || 'package';

            gridHTML += `
                <div class="catalogue-card product-item" data-index="${index}">
                    <div class="product-placeholder-banner">
                        <div class="placeholder-graphic">
                            <svg viewBox="0 0 400 240" class="placeholder-svg">
                                <defs>
                                    <linearGradient id="gridGrad-${index}" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stop-color="#1e293b" />
                                        <stop offset="100%" stop-color="#0f172a" />
                                    </linearGradient>
                                    <pattern id="grid-${index}" width="20" height="20" patternUnits="userSpaceOnUse">
                                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
                                    </pattern>
                                </defs>
                                <rect width="100%" height="100%" fill="url(#gridGrad-${index})" />
                                <rect width="100%" height="100%" fill="url(#grid-${index})" />
                                <circle cx="200" cy="110" r="50" fill="none" stroke="rgba(200, 16, 46, 0.25)" stroke-width="2"/>
                                <circle cx="200" cy="110" r="70" fill="none" stroke="rgba(200, 16, 46, 0.12)" stroke-width="1" stroke-dasharray="4,4"/>
                            </svg>
                            <div class="placeholder-icon-wrapper">
                                <i data-lucide="${iconName}" class="placeholder-icon"></i>
                            </div>
                            <span class="placeholder-label">SPECIFICATION PLACEHOLDER</span>
                        </div>
                        ${badgeHTML}
                    </div>
                    <div class="catalogue-content">
                        <div style="display: flex; gap: 0.4rem; flex-wrap: wrap; margin-bottom: 0.75rem;">
                            ${item.brands.map(b => `<span class="brand-tag-mini"><i data-lucide="award" style="width: 12px; height: 12px;"></i> ${b}</span>`).join('')}
                        </div>
                        <h3>${item.name}</h3>
                        <p style="margin-bottom: 0;">${item.desc}</p>
                        <a href="javascript:void(0)" class="btn-primary-outline catalogue-btn view-details-btn" style="margin-top: 1.5rem;">View Specs & Details <i data-lucide="arrow-right"></i></a>
                    </div>
                </div>
            `;
        });
        productsGrid.innerHTML = gridHTML;
    }

    // Modal Logic Setup
    const modal = document.getElementById('product-modal');
    const modalClose = document.getElementById('modal-close');
    const brandProductsModal = document.getElementById('brand-products-modal');
    const brandModalClose = document.getElementById('brand-modal-close');

    let currentPlaceholders = [];
    let currentPlaceholderIndex = 0;

    const modalPrevBtn = document.getElementById('modal-prev-btn');
    const modalNextBtn = document.getElementById('modal-next-btn');
    const modalSliderDots = document.getElementById('modal-slider-dots');
    const modalImg = document.getElementById('modal-img');

    const updateSlider = () => {
        if (!currentPlaceholders || currentPlaceholders.length === 0) return;
        if (modalImg) modalImg.src = currentPlaceholders[currentPlaceholderIndex];

        if (modalSliderDots) {
            let dotsHTML = '';
            currentPlaceholders.forEach((_, idx) => {
                dotsHTML += `<div class="modal-dot ${idx === currentPlaceholderIndex ? 'active' : ''}" data-idx="${idx}"></div>`;
            });
            modalSliderDots.innerHTML = dotsHTML;

            document.querySelectorAll('.modal-dot').forEach(dot => {
                dot.addEventListener('click', (e) => {
                    currentPlaceholderIndex = parseInt(e.target.getAttribute('data-idx'));
                    updateSlider();
                });
            });
        }
    };

    if (modalPrevBtn && modalNextBtn) {
        modalPrevBtn.addEventListener('click', () => {
            if (currentPlaceholders.length > 1) {
                currentPlaceholderIndex = (currentPlaceholderIndex - 1 + currentPlaceholders.length) % currentPlaceholders.length;
                updateSlider();
            }
        });
        modalNextBtn.addEventListener('click', () => {
            if (currentPlaceholders.length > 1) {
                currentPlaceholderIndex = (currentPlaceholderIndex + 1) % currentPlaceholders.length;
                updateSlider();
            }
        });
    }

    const openProductModal = (item) => {
        if (!modal) return;

        document.getElementById('modal-title').textContent = item.name;
        document.getElementById('modal-desc').textContent = item.desc;

        // Generate and set multiple image placeholders
        currentPlaceholders = generateProductPlaceholders(item);
        currentPlaceholderIndex = 0;
        updateSlider();

        const badge = document.getElementById('modal-badge');
        if (badge) {
            if (item.badge) {
                badge.style.display = 'inline-block';
                badge.textContent = item.badge;
            } else {
                badge.style.display = 'none';
            }
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

        // Render Brand Logo Images inside Brands Available section
        let brandsHTML = '';
        if (item.brands && item.brands.length > 0) {
            item.brands.forEach(brandName => {
                brandsHTML += getBrandLogoImageCard(brandName);
            });
        } else {
            brandsHTML = '<span style="color: var(--text-muted); font-size: 0.9rem;">Not specified</span>';
        }

        const brandsContainer = document.getElementById('modal-brands');
        if (brandsContainer) {
            brandsContainer.innerHTML = brandsHTML;

            // Add click events to brand cards inside the product modal
            brandsContainer.querySelectorAll('.brand-available-card').forEach(bCard => {
                bCard.addEventListener('click', () => {
                    const selectedBrand = bCard.getAttribute('data-brand');
                    closeProductModal();
                    openBrandProductsModal(selectedBrand);
                });
            });
        }

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        lenis.stop();
        lucide.createIcons();
    };

    const closeProductModal = () => {
        if (modal) modal.classList.remove('active');
        document.body.style.overflow = '';
        lenis.start();
    };

    // Open Brand Products Modal
    const openBrandProductsModal = (brandName) => {
        if (!brandProductsModal) return;

        const titleEl = document.getElementById('brand-modal-title');
        const subtitleEl = document.getElementById('brand-modal-subtitle');
        const logoWrapper = document.getElementById('brand-modal-logo-wrapper');
        const gridEl = document.getElementById('brand-products-grid');

        if (titleEl) titleEl.textContent = `${brandName} Products`;

        // Map logo image
        const brandImageMap = {
            'Hepworth': 'assets/hepworth logo.png',
            'Supreme': 'assets/supreme.png',
            'Wavin': 'assets/wavin logo.png',
            'Comer': 'assets/comer.png',
            'HYCOUNT': 'assets/Screenshot 2026-07-23 121141.png',
            'Giacomini': 'assets/giacomni.png',
            'Neway': 'assets/neway.png'
        };

        const imgSrc = brandImageMap[brandName];
        if (logoWrapper) {
            if (imgSrc) {
                logoWrapper.innerHTML = `<img src="${imgSrc}" alt="${brandName} Logo" />`;
            } else {
                logoWrapper.innerHTML = `<span style="color: var(--text-main); font-weight: 800; font-family: 'Outfit'; font-size: 1.3rem;">${brandName}</span>`;
            }
        }

        // Filter products matching this brand
        const filteredProducts = productsData.filter(p => p.brands && p.brands.includes(brandName));
        if (subtitleEl) subtitleEl.textContent = `Showing all ${filteredProducts.length} engineering components available from ${brandName}.`;

        let bGridHTML = '';
        filteredProducts.forEach((item) => {
            const originalIndex = productsData.findIndex(p => p.name === item.name);
            const iconName = item.icon || 'package';

            bGridHTML += `
                <div class="catalogue-card product-item" data-index="${originalIndex}">
                    <div class="product-placeholder-banner">
                        <div class="placeholder-graphic">
                            <div class="placeholder-icon-wrapper">
                                <i data-lucide="${iconName}" class="placeholder-icon"></i>
                            </div>
                            <span class="placeholder-label">${brandName.toUpperCase()} PRODUCT</span>
                        </div>
                    </div>
                    <div class="catalogue-content">
                        <h3>${item.name}</h3>
                        <p style="margin-bottom: 0;">${item.desc}</p>
                        <button class="btn-primary-outline catalogue-btn view-details-btn" style="margin-top: 1.25rem; width: 100%;">View Specifications <i data-lucide="arrow-right"></i></button>
                    </div>
                </div>
            `;
        });

        if (gridEl) {
            gridEl.innerHTML = bGridHTML;
            gridEl.querySelectorAll('.view-details-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const card = e.target.closest('.product-item');
                    const index = card.getAttribute('data-index');
                    closeBrandProductsModal();
                    openProductModal(productsData[index]);
                });
            });
        }

        brandProductsModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        lenis.stop();
        lucide.createIcons();
    };

    const closeBrandProductsModal = () => {
        if (brandProductsModal) brandProductsModal.classList.remove('active');
        document.body.style.overflow = '';
        lenis.start();
    };

    // Attach click handlers to product cards on products.html
    document.querySelectorAll('.product-item').forEach(card => {
        const btn = card.querySelector('.view-details-btn');
        if (btn) {
            btn.addEventListener('click', () => {
                const index = card.getAttribute('data-index');
                openProductModal(productsData[index]);
            });
        }
    });

    // Attach click handlers to interactive brand cards on brands.html
    document.querySelectorAll('.brand-card-interactive').forEach(bCard => {
        bCard.addEventListener('click', () => {
            const brandName = bCard.getAttribute('data-brand');
            openBrandProductsModal(brandName);
        });
    });

    // Modal Close Events
    if (modalClose) modalClose.addEventListener('click', closeProductModal);
    if (brandModalClose) brandModalClose.addEventListener('click', closeBrandProductsModal);

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeProductModal();
        });
    }

    if (brandProductsModal) {
        brandProductsModal.addEventListener('click', (e) => {
            if (e.target === brandProductsModal) closeBrandProductsModal();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeProductModal();
            closeBrandProductsModal();
        }
    });

    // Refresh lucide icons and GSAP scroll animations
    setTimeout(() => {
        lucide.createIcons();

        if (productsGrid) {
            gsap.from(".product-item", {
                y: 60,
                opacity: 0,
                duration: 0.8,
                stagger: {
                    each: 0.1,
                    onComplete: function () {
                        if (this.targets()[0]) this.targets()[0].classList.add('ready');
                    }
                },
                ease: "power2.out",
                scrollTrigger: {
                    trigger: "#products-grid",
                    start: "top 95%"
                }
            });
        }

        const fadeElements = gsap.utils.toArray('.fade-up');
        fadeElements.forEach(el => {
            gsap.fromTo(el,
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 95%" }, onComplete: () => el.classList.add('ready') }
            );
        });
        ScrollTrigger.refresh();
    }, 100);

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

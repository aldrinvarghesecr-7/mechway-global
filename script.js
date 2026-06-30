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
            onComplete: function() {
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
            onComplete: function() {
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
                    onUpdate: function() {
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
        
        const productsData = {
            'infrastructure': {
                title: 'Infrastructure',
                desc: 'Robust materials and components forming the backbone of major construction and development projects worldwide.',
                items: [
                    { name: 'High-Tensile Rebar', desc: 'Grade 60 structural steel reinforcement bars.', specs: { 'Tensile Strength': '60,000 psi', 'Standard': 'ASTM A615' }, img: 'https://images.unsplash.com/photo-1518458028785-8fbcd101ebb9?auto=format&fit=crop&w=500&q=80', badge: 'Core' },
                    { name: 'Structural H-Beams', desc: 'Heavy-duty steel beams for large-scale framework.', specs: { 'Material': 'Carbon Steel', 'Yield Strength': '345 MPa' }, img: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=500&q=80' },
                    { name: 'Precast Concrete Panels', desc: 'Accelerated construction panels with high durability.', specs: { 'Compressive Strength': '40 MPa', 'Fire Rating': '4 Hours' }, img: 'https://images.unsplash.com/photo-1541888086425-d81bb19240f5?auto=format&fit=crop&w=500&q=80' },
                    { name: 'Heavy-Duty Scaffold Tubes', desc: 'Galvanized steel scaffolding tubes for safety.', specs: { 'Thickness': '3.2mm', 'Standard': 'EN 39' }, img: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=500&q=80' },
                    { name: 'Geotextile Membranes', desc: 'Soil reinforcement and drainage solutions.', specs: { 'Type': 'Non-woven', 'Tensile': '15 kN/m' }, img: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=500&q=80' },
                    { name: 'Industrial Fasteners', desc: 'High-strength structural bolts and nuts.', specs: { 'Grade': '10.9', 'Coating': 'Hot Dip Galvanized' }, img: 'https://images.unsplash.com/photo-1530983821650-7c229c159813?auto=format&fit=crop&w=500&q=80' },
                    { name: 'Expansion Joints', desc: 'Bridge and structural movement accommodation.', specs: { 'Movement': 'Up to 200mm', 'Material': 'Neoprene/Steel' }, img: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=500&q=80' },
                    { name: 'Trench Drain Systems', desc: 'Heavy load capacity surface water drainage.', specs: { 'Load Class': 'F900', 'Material': 'Polymer Concrete' }, img: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=500&q=80' },
                    { name: 'Steel Sheet Piles', desc: 'Retaining walls and earth support systems.', specs: { 'Section Modulus': '1600 cm³/m', 'Thickness': '10mm' }, img: 'https://images.unsplash.com/photo-1518458028785-8fbcd101ebb9?auto=format&fit=crop&w=500&q=80' },
                    { name: 'Bridge Bearings', desc: 'Elastomeric pads for load distribution.', specs: { 'Load Capacity': '5000 kN', 'Lifespan': '50+ Years' }, img: 'https://images.unsplash.com/photo-1541888086425-d81bb19240f5?auto=format&fit=crop&w=500&q=80' }
                ]
            },
            'plumbing': {
                title: 'Plumbing',
                desc: 'Advanced pipes, fittings, and fluid control systems designed for reliability and seamless integration.',
                items: [
                    { name: 'PPR Pipes', desc: 'High-temperature resistant plumbing pipes.', specs: { 'Pressure Rating': 'PN20', 'Material': 'Polypropylene' }, img: 'https://images.unsplash.com/photo-1585695026601-52ab53f7fdb0?auto=format&fit=crop&w=500&q=80', badge: 'Popular' },
                    { name: 'Copper Tubing', desc: 'Premium copper tubes for water supply.', specs: { 'Type': 'L & K', 'Purity': '99.9%' }, img: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=500&q=80' },
                    { name: 'Brass Gate Valves', desc: 'Heavy-duty shut-off valves for industrial use.', specs: { 'Pressure': 'PN16', 'Size': '1/2" to 4"' }, img: 'https://images.unsplash.com/photo-1584988775269-e0d00fbdcc94?auto=format&fit=crop&w=500&q=80' },
                    { name: 'UPVC Drainage Pipes', desc: 'Chemical resistant underground drainage.', specs: { 'Standard': 'BS EN 1401', 'Stiffness': 'SN4' }, img: 'https://images.unsplash.com/photo-1585695026601-52ab53f7fdb0?auto=format&fit=crop&w=500&q=80' },
                    { name: 'Water Pressure Pumps', desc: 'Variable speed booster pump systems.', specs: { 'Flow': '10 m³/h', 'Head': '60m' }, img: 'https://images.unsplash.com/photo-1518314916381-77a37c2a49ae?auto=format&fit=crop&w=500&q=80' },
                    { name: 'Stainless Steel Fittings', desc: 'Corrosion resistant threaded fittings.', specs: { 'Grade': '316L', 'Thread': 'NPT / BSPT' }, img: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=500&q=80' },
                    { name: 'PEX Tubing', desc: 'Flexible cross-linked polyethylene for radiant heat.', specs: { 'Temperature': 'Max 95°C', 'Size': '16mm - 32mm' }, img: 'https://images.unsplash.com/photo-1585695026601-52ab53f7fdb0?auto=format&fit=crop&w=500&q=80' },
                    { name: 'Water Meters', desc: 'High precision multi-jet flow meters.', specs: { 'Accuracy': 'Class B', 'Max Temp': '50°C' }, img: 'https://images.unsplash.com/photo-1584988775269-e0d00fbdcc94?auto=format&fit=crop&w=500&q=80' },
                    { name: 'Manifold Systems', desc: 'Distribution manifolds for complex plumbing.', specs: { 'Outlets': '2 to 12', 'Material': 'Brass' }, img: 'https://images.unsplash.com/photo-1518314916381-77a37c2a49ae?auto=format&fit=crop&w=500&q=80' },
                    { name: 'Grease Interceptors', desc: 'Commercial kitchen wastewater filtration.', specs: { 'Capacity': '50 GPM', 'Material': 'Stainless Steel' }, img: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=500&q=80' }
                ]
            },
            'mep': {
                title: 'MEP',
                desc: 'Comprehensive Mechanical, Electrical, and Plumbing solutions delivering operational excellence.',
                items: [
                    { name: 'Vibration Isolators', desc: 'Mounts for reducing noise and vibration in MEP setups.', specs: { 'Deflection': '25mm', 'Type': 'Spring / Rubber' }, img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=500&q=80', badge: 'Essential' },
                    { name: 'Unistrut Channels', desc: 'Metal framing systems for structural support.', specs: { 'Finish': 'Pre-Galvanized', 'Size': '41x41mm' }, img: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=500&q=80' },
                    { name: 'Cable Trays', desc: 'Perforated and ladder trays for wire management.', specs: { 'Width': '100 - 600mm', 'Material': 'GI / Aluminum' }, img: 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=500&q=80' },
                    { name: 'Pipe Hangers', desc: 'Clevis hangers and supports for fluid pipes.', specs: { 'Load Rating': '1000 lbs', 'Standard': 'MSS SP-58' }, img: 'https://images.unsplash.com/photo-1585695026601-52ab53f7fdb0?auto=format&fit=crop&w=500&q=80' },
                    { name: 'BMS Controllers', desc: 'Building Management System intelligent control units.', specs: { 'Protocol': 'BACnet / Modbus', 'I/O': '32 Points' }, img: 'https://images.unsplash.com/photo-1563206767-5b18f218e8de?auto=format&fit=crop&w=500&q=80' },
                    { name: 'Motor Control Centers', desc: 'Low voltage MCCs for pump and fan control.', specs: { 'Voltage': '415V', 'Rating': 'Up to 3200A' }, img: 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=500&q=80' },
                    { name: 'Ductwork Accessories', desc: 'Volume control dampers and flexible ducts.', specs: { 'Leakage': 'Class C', 'Material': 'Galvanized' }, img: 'https://images.unsplash.com/photo-1617882255776-880358897c8d?auto=format&fit=crop&w=500&q=80' },
                    { name: 'Thermal Insulation', desc: 'Elastomeric rubber for chilled water pipes.', specs: { 'Thickness': '13 - 50mm', 'Fire Rating': 'Class 0' }, img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=500&q=80' },
                    { name: 'Expansion Tanks', desc: 'Hydronic system pressure regulation.', specs: { 'Volume': '50 - 1000 L', 'Max Pressure': '10 Bar' }, img: 'https://images.unsplash.com/photo-1518314916381-77a37c2a49ae?auto=format&fit=crop&w=500&q=80' },
                    { name: 'Variable Frequency Drives', desc: 'VFDs for energy efficient motor speed control.', specs: { 'Power': '0.75 - 250 kW', 'Harmonics': '< 5% THDi' }, img: 'https://images.unsplash.com/photo-1563206767-5b18f218e8de?auto=format&fit=crop&w=500&q=80' }
                ]
            },
            'fire-fighting': {
                title: 'Fire Fighting',
                desc: 'State-of-the-art fire suppression and safety equipment protecting lives and critical assets.',
                items: [
                    { name: 'Fire Sprinkler Heads', desc: 'Pendent and upright automatic sprinklers.', specs: { 'K-Factor': '5.6', 'Response': 'Standard / Quick' }, img: 'https://images.unsplash.com/photo-1616781442999-52e6973e215e?auto=format&fit=crop&w=500&q=80', badge: 'UL Listed' },
                    { name: 'Fire Pump Sets', desc: 'Diesel and electric driven UL/FM fire pumps.', specs: { 'Capacity': '500 - 1500 GPM', 'Pressure': '100 - 200 PSI' }, img: 'https://images.unsplash.com/photo-1518314916381-77a37c2a49ae?auto=format&fit=crop&w=500&q=80' },
                    { name: 'Alarm Check Valves', desc: 'Wet pipe system alarm valves.', specs: { 'Size': '4" to 8"', 'Approval': 'UL / FM' }, img: 'https://images.unsplash.com/photo-1584988775269-e0d00fbdcc94?auto=format&fit=crop&w=500&q=80' },
                    { name: 'Fire Extinguishers', desc: 'DCP and CO2 portable fire extinguishers.', specs: { 'Capacity': '4.5kg - 6kg', 'Rating': '21A 113B' }, img: 'https://images.unsplash.com/photo-1616781442999-52e6973e215e?auto=format&fit=crop&w=500&q=80' },
                    { name: 'Fire Hydrants', desc: 'Pillar type hydrants for external protection.', specs: { 'Outlets': '2x 2.5"', 'Material': 'Cast Iron' }, img: 'https://images.unsplash.com/photo-1585695026601-52ab53f7fdb0?auto=format&fit=crop&w=500&q=80' },
                    { name: 'Hose Reels', desc: 'Swinging manual and automatic fire hose reels.', specs: { 'Length': '30m', 'Diameter': '1"' }, img: 'https://images.unsplash.com/photo-1616781442999-52e6973e215e?auto=format&fit=crop&w=500&q=80' },
                    { name: 'FM200 Systems', desc: 'Clean agent fire suppression for server rooms.', specs: { 'Agent': 'HFC-227ea', 'Discharge Time': '10 seconds' }, img: 'https://images.unsplash.com/photo-1563206767-5b18f218e8de?auto=format&fit=crop&w=500&q=80' },
                    { name: 'Smoke Detectors', desc: 'Photoelectric smoke sensors for alarms.', specs: { 'Voltage': '24V DC', 'Coverage': '80m²' }, img: 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=500&q=80' },
                    { name: 'Fire Rated Cables', desc: 'LSZH cables for emergency systems.', specs: { 'Rating': 'CWZ', 'Survival': '3 Hours' }, img: 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=500&q=80' },
                    { name: 'Grooved Fittings', desc: 'Fast-installation pipe joining systems.', specs: { 'Pressure': '300 PSI', 'Material': 'Ductile Iron' }, img: 'https://images.unsplash.com/photo-1530983821650-7c229c159813?auto=format&fit=crop&w=500&q=80' }
                ]
            },
            'hvac': {
                title: 'HVAC',
                desc: 'High-efficiency Heating, Ventilation, and Air Conditioning units for optimal climate control.',
                items: [
                    { name: 'Air Handling Units (AHU)', desc: 'Customizable air handlers for commercial spaces.', specs: { 'Airflow': 'Up to 50,000 CFM', 'Filters': 'MERV 13' }, img: 'https://images.unsplash.com/photo-1617882255776-880358897c8d?auto=format&fit=crop&w=500&q=80', badge: 'High Efficiency' },
                    { name: 'Water Cooled Chillers', desc: 'Centrifugal chillers for large building cooling.', specs: { 'Capacity': '500 - 2000 Tons', 'Refrigerant': 'R-134a' }, img: 'https://images.unsplash.com/photo-1518314916381-77a37c2a49ae?auto=format&fit=crop&w=500&q=80' },
                    { name: 'Fan Coil Units (FCU)', desc: 'Concealed and exposed FCUs for individual rooms.', specs: { 'Cooling': '1 - 4 Tons', 'Noise': '< 40 dB(A)' }, img: 'https://images.unsplash.com/photo-1617882255776-880358897c8d?auto=format&fit=crop&w=500&q=80' },
                    { name: 'Cooling Towers', desc: 'Open and closed circuit cooling towers.', specs: { 'Type': 'Crossflow', 'Material': 'FRP' }, img: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=500&q=80' },
                    { name: 'VAV Boxes', desc: 'Variable Air Volume terminal units.', specs: { 'Control': 'DDC', 'Airflow': '100 - 3000 CFM' }, img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=500&q=80' },
                    { name: 'Exhaust Fans', desc: 'Centrifugal roof and inline exhaust fans.', specs: { 'Static Pressure': 'Up to 3" wg', 'Motor': 'TEFC' }, img: 'https://images.unsplash.com/photo-1617882255776-880358897c8d?auto=format&fit=crop&w=500&q=80' },
                    { name: 'Pre-Insulated Ducts', desc: 'PIR duct panels for energy efficient routing.', specs: { 'Density': '45 kg/m³', 'Fire Rating': 'Class 0' }, img: 'https://images.unsplash.com/photo-1585695026601-52ab53f7fdb0?auto=format&fit=crop&w=500&q=80' },
                    { name: 'Chilled Water Pumps', desc: 'End suction and split case pumps.', specs: { 'Head': '20 - 150m', 'Efficiency': '> 80%' }, img: 'https://images.unsplash.com/photo-1518314916381-77a37c2a49ae?auto=format&fit=crop&w=500&q=80' },
                    { name: 'HVAC Sensors', desc: 'Temperature, humidity, and CO2 sensors.', specs: { 'Output': '4-20mA / 0-10V', 'Accuracy': '± 0.2°C' }, img: 'https://images.unsplash.com/photo-1563206767-5b18f218e8de?auto=format&fit=crop&w=500&q=80' },
                    { name: 'Grilles & Diffusers', desc: 'Linear slot diffusers and return grilles.', specs: { 'Material': 'Extruded Aluminum', 'Finish': 'Powder Coated' }, img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=500&q=80' }
                ]
            },
            'electrical': {
                title: 'Electrical',
                desc: 'Premium electrical components and power distribution solutions ensuring uninterrupted performance.',
                items: [
                    { name: 'Power Transformers', desc: 'Cast resin dry-type transformers.', specs: { 'Rating': '1000 kVA', 'Voltage': '11kV / 415V' }, img: 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=500&q=80', badge: 'Critical' },
                    { name: 'Switchgear Panels', desc: 'Main Distribution Boards (MDB) & SMDBs.', specs: { 'Fault Level': '50kA / 1 sec', 'Enclosure': 'IP54' }, img: 'https://images.unsplash.com/photo-1563206767-5b18f218e8de?auto=format&fit=crop&w=500&q=80' },
                    { name: 'Armored Cables', desc: 'XLPE/SWA/PVC low voltage power cables.', specs: { 'Cores': '4 Core', 'Size': '16mm² - 300mm²' }, img: 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=500&q=80' },
                    { name: 'Busbar Trunking', desc: 'Compact sandwich type busbar systems.', specs: { 'Rating': '800A - 4000A', 'Conductor': 'Copper / Aluminum' }, img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=500&q=80' },
                    { name: 'LED High Bay Lights', desc: 'Industrial grade LED lighting fixtures.', specs: { 'Lumen': '20,000 lm', 'Lifespan': '50,000 Hrs' }, img: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=500&q=80' },
                    { name: 'Circuit Breakers (ACB/MCCB)', desc: 'Molded case and air circuit breakers.', specs: { 'Poles': '3P / 4P', 'Trip Unit': 'Electronic' }, img: 'https://images.unsplash.com/photo-1563206767-5b18f218e8de?auto=format&fit=crop&w=500&q=80' },
                    { name: 'Uninterruptible Power Supply', desc: 'Three-phase online UPS systems.', specs: { 'Capacity': '20 - 500 kVA', 'Autonomy': '15 - 60 Mins' }, img: 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=500&q=80' },
                    { name: 'Wiring Accessories', desc: 'Switches, sockets, and faceplates.', specs: { 'Standard': 'BS 1363', 'Finish': 'Brushed Steel / White' }, img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=500&q=80' },
                    { name: 'Earthing Systems', desc: 'Copper clad earth rods and lightning protection.', specs: { 'Resistance': '< 1 Ohm', 'Material': 'Solid Copper' }, img: 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=500&q=80' },
                    { name: 'Diesel Generators', desc: 'Backup prime and standby power gen-sets.', specs: { 'Output': '500 kVA', 'Engine': 'Cummins / Perkins' }, img: 'https://images.unsplash.com/photo-1518314916381-77a37c2a49ae?auto=format&fit=crop&w=500&q=80' }
                ]
            }
        };

        const urlParams = new URLSearchParams(window.location.search);
        let categoryParam = urlParams.get('category');
        
        // Default to infrastructure if invalid
        if (!categoryParam || !productsData[categoryParam]) {
            categoryParam = 'infrastructure';
        }

        const category = productsData[categoryParam];

        document.getElementById('category-title').textContent = category.title;
        document.getElementById('category-desc').textContent = category.desc;

        let gridHTML = '';
        category.items.forEach((item, index) => {
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
        
        const openModal = (item) => {
            document.getElementById('modal-title').textContent = item.name;
            document.getElementById('modal-desc').textContent = item.desc;
            document.getElementById('modal-img').src = item.img;
            
            const badge = document.getElementById('modal-badge');
            if(item.badge) {
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

            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // prevent background scrolling
        };

        const closeModal = () => {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        };

        document.querySelectorAll('.product-item').forEach(card => {
            card.querySelector('.view-details-btn').addEventListener('click', () => {
                const index = card.getAttribute('data-index');
                openModal(category.items[index]);
            });
        });

        modalClose.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
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
                    onComplete: function() {
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

import React, { useRef } from 'react';
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import SplitText from "gsap/SplitText";
import CustomEase from "gsap/CustomEase";
import { Flip } from "gsap/all";
// import Lenis from "lenis"; // ❌ HATA DE (App.jsx sambhal lega)
import Matter from "matter-js";
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { useGSAP } from "@gsap/react";
// import ''; // ✅ CSS Import Zaroori hai (400vh height ke liye)
import { Link } from 'react-router-dom';
import NavBar from '../components/Navbar';


// Register Plugins
gsap.registerPlugin(CustomEase, SplitText, ScrollTrigger, Flip);

const Home = () => {
    // Refs
    const modelContainerRef = useRef(null);
    const spotlightRef = useRef(null);
    const footerRef = useRef(null);
    const footerObjContainerRef = useRef(null);

    useGSAP(() => {
        /* ❌ LENIS SETUP REMOVED 
           Kyunki App.jsx mein <Lenis root> already laga hua hai.
           Double Lenis = No Scroll.
        */

        /* ================= 1. SECTION 1 – 3D MODEL ================= */
        const modelSection = () => {
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
            camera.position.set(0, 0.6, 4);
            camera.lookAt(0, 0, 0);

            const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            renderer.outputColorSpace = THREE.SRGBColorSpace;
            renderer.toneMapping = THREE.ACESFilmicToneMapping;
            renderer.shadowMap.enabled = true;

            if (modelContainerRef.current) {
                modelContainerRef.current.appendChild(renderer.domElement);
            }

            scene.add(new THREE.AmbientLight(0xffffff, 0.3));
            const keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
            keyLight.position.set(3, 5, 5);
            scene.add(keyLight);
            const rimLight = new THREE.DirectionalLight(0xffffff, 0.6);
            rimLight.position.set(-3, 2, -5);
            scene.add(rimLight);

            let model;
            let scrollRotationX = 0;
            const baseRotationY = Math.PI / 2;

            const loader = new GLTFLoader();
            // Agar purana model use kar raha hai toh extension fix yahan lagana padega
            // loader.register((parser) => new KHRMaterialsPbrSpecularGlossinessExtension(parser)); 
            
            loader.load('/assets/gaming_chair_kiiro-v1.glb', (gltf) => {
                model = gltf.scene;
                // Material Fix logic
                model.traverse((node) => {
                    if (node.isMesh && node.material) {
                        node.material.color.set(0xffc400);
                        node.material.metalness = 0.4;
                        node.material.roughness = 0.35;
                        node.material.envMapIntensity = 1;
                        node.material.needsUpdate = true;
                    }
                });

                const box = new THREE.Box3().setFromObject(model);
                const center = box.getCenter(new THREE.Vector3());
                model.position.sub(center);
                model.scale.set(0.3, 0.3, 0.3);
                model.rotation.set(0, baseRotationY, 0);
                scene.add(model);

                gsap.to(model.scale, { x: 0.3, y: 0.3, z: 0.3, duration: 1, ease: 'power3.out' });

                ScrollTrigger.create({
                    trigger: ".opening",
                    start: "top top",
                    end: "bottom bottom",
                    pin: modelContainerRef.current,
                    pinSpacing: false,
                    scrub: 1,
                    onUpdate: (self) => { scrollRotationX = self.progress * Math.PI * 2; }
                });
            });

            // Drag Logic
            let isDragging = false, lastX = 0, lastY = 0, dragRotationY = 0, dragRotationX = 0;
            const dragSpeed = 0.005;
            renderer.domElement.addEventListener('pointerdown', (e) => {
                isDragging = true; lastX = e.clientX; lastY = e.clientY;
            });
            window.addEventListener('pointermove', (e) => {
                if (!isDragging || !model) return;
                dragRotationY += (e.clientX - lastX) * dragSpeed;
                dragRotationX += (e.clientY - lastY) * dragSpeed;
                dragRotationX = Math.max(-Math.PI / 4, Math.min(Math.PI / 4, dragRotationX));
                lastX = e.clientX; lastY = e.clientY;
            });
            window.addEventListener('pointerup', () => { isDragging = false; });

            const animate = () => {
                if (model) {
                    model.position.y = Math.sin(Date.now() * 0.001 * 1.5) * 0.2;
                    model.rotation.y = baseRotationY + dragRotationY;
                    model.rotation.x = scrollRotationX + dragRotationX;
                }
                renderer.render(scene, camera);
                requestAnimationFrame(animate);
            };
            animate();
        };

        /* ================= 2. SECTION 2 – SPOTLIGHT ================= */
        const spotLight = () => {
            const images = spotlightRef.current.querySelectorAll(".s2-img");
            const coverImg = spotlightRef.current.querySelector(".s2-cover-img");
            const introHeader = spotlightRef.current.querySelector(".s2-intro-header h1");
            const outroHeader = spotlightRef.current.querySelector(".s2-outro-header h1");

            // Safe Check incase elements render nahi hue
            if(!introHeader || !outroHeader) return;

            const introHeaderSplit = new SplitText(introHeader, { type: "words" });
            const outroHeaderSplit = new SplitText(outroHeader, { type: "words" });
            gsap.set(outroHeaderSplit.words, { opacity: 0 });

            const scatterDirections = [
                { x: 1.3, y: 0.7 }, { x: -1.5, y: 1 }, { x: 1.1, y: -1.3 }, { x: -1.7, y: -0.8 },
                { x: 0.8, y: 1.4 }, { x: -1.0, y: -1.5 }, { x: 1.6, y: 0.3 }, { x: -0.7, y: 1.7 },
                { x: 1.2, y: 0.6 }, { x: -1.4, y: 0.9 }, { x: 1.8, y: -0.5 }, { x: -1.1, y: -1.8 },
                { x: 0.9, y: 1.8 }, { x: -1.9, y: 0.4 }, { x: 1.0, y: -1.9 }, { x: -0.8, y: 1.9 },
                { x: 1.7, y: -1.0 }, { x: -1.3, y: -1.2 }, { x: 0.7, y: 2.0 }, { x: 1.25, y: -0.2 }
            ];

            const scatterMultiplier = window.innerWidth < 1000 ? 2.5 : 0.5;

            ScrollTrigger.create({
                trigger: ".s2-spotlight",
                start: "top top",
                end: `+=${window.innerHeight * 15}px`,
                pin: true,
                scrub: 1,
                onUpdate: (self) => {
                    const progress = self.progress;
                    images.forEach((img, index) => {
                        const staggerDelay = index * 0.03;
                        let imageProgress = Math.max(0, (progress - staggerDelay) * 4);
                        const dets = scatterDirections[index % scatterDirections.length];
                        
                        gsap.set(img, {
                            z: gsap.utils.interpolate(-1000, 2000, imageProgress),
                            x: gsap.utils.interpolate(0, dets.x * window.innerWidth * scatterMultiplier, imageProgress),
                            y: gsap.utils.interpolate(0, dets.y * window.innerHeight * scatterMultiplier, imageProgress),
                            scale: gsap.utils.interpolate(0, 1, imageProgress * (window.innerWidth < 1000 ? 4 : 2))
                        });
                    });

                    const coverProgress = Math.max(0, (progress - 0.7) * 4);
                    gsap.set(coverImg, { z: -1000 + 1000 * coverProgress, scale: Math.min(1, coverProgress * 2) });

                    // Headers Fade Logic
                    if (progress >= 0.8) {
                        const outroReveal = (progress - 0.8) / 0.15;
                        outroHeaderSplit.words.forEach((word, i) => {
                            const wordProg = i / outroHeaderSplit.words.length;
                            gsap.set(word, { opacity: outroReveal >= wordProg + 0.1 ? 1 : (outroReveal <= wordProg ? 0 : (outroReveal - wordProg) / 0.1) });
                        });
                    }
                    if (progress >= 0.6 && progress <= 0.75) {
                        const introFade = (progress - 0.6) / 0.15;
                        introHeaderSplit.words.forEach((word, i) => {
                            const wordProg = i / introHeaderSplit.words.length;
                            gsap.set(word, { opacity: introFade >= wordProg + 0.1 ? 0 : (introFade <= wordProg ? 1 : 1 - (introFade - wordProg) / 0.1) });
                        });
                    }
                }
            });
        };

        /* ================= 3. FOOTER (MATTER.JS) ================= */
        const footerGrab = () => {
            const config = { gravity: { x: 0, y: 1 }, restitution: 0.5, friction: 0.2, frictionAir: 0.02, density: 0.002, wallThickness: 200, mouseStiffness: 0.6 };
            let engine, bodies = [];

            const initPhysics = () => {
                engine = Matter.Engine.create();
                engine.gravity = config.gravity;
                const container = footerObjContainerRef.current;
                const rect = container.getBoundingClientRect();

                const walls = [
                    Matter.Bodies.rectangle(rect.width / 2, rect.height + 100, rect.width + 200, 200, { isStatic: true }),
                    Matter.Bodies.rectangle(-100, rect.height / 2, 200, rect.height + 200, { isStatic: true }),
                    Matter.Bodies.rectangle(rect.width + 100, rect.height / 2, 200, rect.height + 200, { isStatic: true })
                ];
                Matter.World.add(engine.world, walls);

                const objects = container.querySelectorAll(".ft-object");
                objects.forEach((obj, index) => {
                    const body = Matter.Bodies.rectangle((index * (rect.width / objects.length)) + 75, -200 - (index * 250), 150, 150, { restitution: 0.5, friction: 0.2, frictionAir: 0.02, density: 0.002 });
                    Matter.Body.setAngle(body, (Math.random() - 0.5) * Math.PI);
                    bodies.push({ body, element: obj });
                    Matter.World.add(engine.world, body);
                });

                const mouseConstraint = Matter.MouseConstraint.create(engine, { mouse: Matter.Mouse.create(container), constraint: { stiffness: 0.6, render: { visible: false } } });
                Matter.World.add(engine.world, mouseConstraint);
                Matter.Runner.run(Matter.Runner.create(), engine);

                const update = () => {
                    bodies.forEach(({ body, element }) => {
                        element.style.left = `${body.position.x - 75}px`;
                        element.style.top = `${body.position.y - 75}px`;
                        element.style.transform = `rotate(${body.angle}rad)`;
                    });
                    requestAnimationFrame(update);
                };
                update();
            };

            ScrollTrigger.create({
                trigger: ".ft-footer",
                start: "top 75%",
                once: true,
                onEnter: initPhysics
            });
        };

        modelSection();
        spotLight();
        footerGrab();

        // Cleanup: Lenis destroy mat kar yahan, sirf ScrollTrigger kill kar
        return () => {
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, []);

    // 🚨 IMPORTANT: Tere JSX mein koi change nahi hai, wahi return block use kar jo tune bheja.
    return (
        <div className="main-app">
            <NavBar/>
            {/* Same JSX content as you provided... */}
            {/* ... */}
            {/* Main content same rahega */}
             <section className="opening">
            {/* Three.js Canvas Ref */}
            <div className="model" ref={modelContainerRef}></div>



            <section className="intro">
                <div className="header-row">
                    <h1>Office for</h1>
                </div>
                <div className="header-row">
                    <h1>Future</h1>
                    <p>Innovative Furniture Studio. Crafting sustainable, bespoke, and functional solutions for homes and businesses.</p>
                </div>
                <div className="header-row">
                    <h1>Furnituring</h1>
                </div>
            </section>

            {/* Collection / Archive Section */}
            <section className="archive">
                <div className="archive-header">
                    <p>Collection</p>
                </div>
                <div className="archive-item">
                    <h2>Ripple Bench</h2>
                    <div className="archive-info">
                        <p>US / EU</p>
                        <p>Design Concept</p>
                        <p>Bench</p>
                        <p>Outdoor</p>
                    </div>
                </div>
                <div className="archive-item">
                    <h2>Arc Table</h2>
                    <div className="archive-info">
                        <p>US / EU</p>
                        <p>Design Concept</p>
                        <p>Table</p>
                        <p>Modern</p>
                    </div>
                </div>
                <div className="archive-item">
                    <h2>Gaming Chair</h2>
                    <div className="archive-info">
                        <p>US / EU</p>
                        <p>Immersive Experience</p>
                        <p>Chair</p>
                        <p>Indoor</p>
                    </div>
                </div>
                <div className="archive-item">
                    <h2>Flow Chair</h2>
                    <div className="archive-info">
                        <p>US / EU</p>
                        <p>Design Concept</p>
                        <p>ArmChair</p>
                        <p>Minimalist</p>
                    </div>
                </div>
                <div className="archive-item">
                    <h2>Halo Pendant</h2>
                    <div className="archive-info">
                        <p>US / EU</p>
                        <p>Project Details</p>
                        <p>Lighting</p>
                        <p>Modern</p>
                    </div>
                </div>
            </section>

            <section className="outro">
                <div className="outro-copy">
                    <h2>We are an Indian, German and Italian multidisciplinary design atelier specializing in bespoken furniture, spatial installation, and immersive visual experiences</h2>
                    <p>About <span>mev.puremev.com</span></p>
                    <p>Contact <span>mev.puremev.com</span></p>
                </div>
                <div className="outro-footer">
                    <p>We are an Indian, German and Italian multidisciplinary design atelier specializing in bespoken furniture, spatial installation, and immersive visual experiences</p>
                </div>
            </section>
        </section>

        {/* ================= SECTION 2 – SPOTLIGHT ================= */}
        <section className="s2-spotlight" ref={spotlightRef}>
            <div className="s2-spotlight-images">
                {/* 20 Images (Logic handles their scatter) */}
                {[...Array(20)].map((_, i) => (
                    <div className="s2-img" key={i}>
                        <img 
                            src={i % 2 === 0 
                                ? "https://images.unsplash.com/photo-1732020858816-93c130ab8f49?w=500" 
                                : "https://images.unsplash.com/photo-1725961476494-efa87ae3106a?w=500"} 
                            alt={`spotlight-${i}`} 
                        />
                    </div>
                ))}
            </div>

            <div className="s2-cover-img">
                <img src="https://images.unsplash.com/photo-1732020858816-93c130ab8f49?w=500" alt="cover" />
            </div>

            <div className="s2-intro-header">
                <h1>When Motion and Stillness Collide in Layers</h1>
            </div>

            <div className="s2-outro-header">
                <h1>What Follows is not Stillness but Reverberation</h1>
            </div>
        </section>

        {/* ================= SECTION 3 – FOOTER (MATTER.JS) ================= */}
        <section className="ft-footer" ref={footerRef}>
            <div className="ft-object-container" ref={footerObjContainerRef}>
                <div className="ft-object">Chair</div>
                <div className="ft-object">Table</div>
                <div className="ft-object">Bed</div>
                <div className="ft-object">Sofa</div>
                <div className="ft-object">Recliner</div>
                <div className="ft-object">Dining Table</div>
                <div className="ft-object">Bookshelf</div>
                <div className="ft-object">Armchair</div>
                <div className="ft-object">Wardrobe</div>
            </div>

            <div className="ft-footer-content">
                <h1>Designed to be felt, not catalogued.</h1>
            </div>
        </section>
        </div>
    );
};

export default Home;
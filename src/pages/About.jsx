import React, { useRef} from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import '../styles/About.css';
import NavBar from '../components/Navbar';


const slideImages = [
    "https://images.unsplash.com/photo-1732020858816-93c130ab8f49?w=500",
    "https://images.unsplash.com/photo-1725961476494-efa87ae3106a?w=500",
    "https://images.unsplash.com/photo-1658487476847-a180f98870d0?w=500",
    "https://images.unsplash.com/photo-1634986666676-ec8fd927c23d?w=500",
    "https://images.unsplash.com/photo-1706606999710-72658165a73d?w=500",
    "https://images.unsplash.com/photo-1637666505754-7416ebd70cbf?w=500",
    "https://plus.unsplash.com/premium_photo-1719864933065-6639a2d32e56?w=500",
    "https://plus.unsplash.com/premium_photo-1725198933305-8ad7fb751056?w=500",
    "https://images.unsplash.com/photo-1704098712161-67949aaf0eee?w=500",
    "https://images.unsplash.com/photo-1658487476833-f094aaf4a66c?w=500",
    "https://images.unsplash.com/photo-1642059893618-22daf30e92a2?w=500"
];

const slideTitles = [
    "Ivory Lounge Chair", "Oakline Dining Table", "Cedar Comfort Sofa", "Stonewood Coffee Table",
    "Linen Rest Armchair", "Walnut Frame Bed", "Softline Recliner", "Classic Oak Bookshelf",
    "Marble Touch Side Table", "Urban Comfort Sofa", "Natural Wood Dining Set"
];

const About = () => {
    const sliderRef = useRef(null);
    const wheelRef = useRef(null);
    const titleRef = useRef(null);

    // Using refs for animation variables to avoid unnecessary re-renders
    const pos = useRef({ currentX: 0, targetX: 0 });
    const config = useRef({
        totalSlides: slideImages.length,
        endScale: 5,
        slideWidth: window.innerWidth * (window.innerWidth < 1000 ? 0.75 : 0.45),
        viewportCenter: window.innerWidth / 2,
        isMobile: window.innerWidth < 1000
    });

    useGSAP(() => {
        const slider = sliderRef.current;
        const wheel = wheelRef.current;
        const totalWidth = config.current.totalSlides * config.current.slideWidth;

        // Initial setup
        const centerOffset = window.innerWidth / 2 - config.current.slideWidth / 2;
        pos.current.currentX = centerOffset;
        pos.current.targetX = centerOffset;

        /* ================= 1. THE MAIN ANIMATION LOOP ================= */
        const animate = () => {
            // Lerping current position
            pos.current.currentX += (pos.current.targetX - pos.current.currentX) * 0.1;

            // Infinite Loop Logic
            if (pos.current.currentX > 0) {
                pos.current.currentX -= totalWidth;
                pos.current.targetX -= totalWidth;
            } else if (pos.current.currentX < -totalWidth) {
                pos.current.currentX += totalWidth;
                pos.current.targetX += totalWidth;
            }

            let centerSlideIndex = 0;
            let closestToCenter = Infinity;

            const slides = slider.querySelectorAll(".slide");
            slides.forEach((slide, index) => {
                const x = index * config.current.slideWidth + pos.current.currentX;
                gsap.set(slide, { x: x });

                // Scale Calculation Logic
                const slideCenterX = x + config.current.slideWidth / 2;
                const distanceFromCenter = Math.abs(slideCenterX - config.current.viewportCenter);
                const outerDistance = config.current.slideWidth * 3;
                const progress = Math.min(distanceFromCenter / outerDistance, 1);

                // Tera Exact Easing Formula
                const eased = progress < 0.5
                    ? 2 * progress * progress
                    : 1 - Math.pow(-2 * progress + 2, 2) / 2;

                const scale = 1 + eased * (config.current.endScale - 1);
                gsap.set(slide.querySelector("img"), { scale: scale });

                if (distanceFromCenter < closestToCenter) {
                    closestToCenter = distanceFromCenter;
                    centerSlideIndex = index % config.current.totalSlides;
                }
            });

            // Update Title and Wheel
            if (titleRef.current) titleRef.current.textContent = slideTitles[centerSlideIndex];
            updateThumbnailItems(pos.current.currentX);

            requestAnimationFrame(animate);
        };

        /* ================= 2. THUMBNAIL WHEEL TRIGONOMETRY ================= */
        const updateThumbnailItems = (currX) => {
            const exactSlideProcess = Math.abs(currX) / config.current.slideWidth;
            const currentRotationAngle = -(exactSlideProcess * (360 / config.current.totalSlides)) + 90;

            const thumbnails = wheel.querySelectorAll(".thumbnail-item");
            const radius = config.current.isMobile ? 150 : 350;

            thumbnails.forEach((thumbnail, i) => {
                const baseAngle = (i / config.current.totalSlides) * Math.PI * 2;
                const currentAngle = baseAngle + (currentRotationAngle * Math.PI) / 180;

                const tx = radius * Math.cos(currentAngle) + window.innerWidth / 2;
                const ty = radius * Math.sin(currentAngle) + window.innerHeight / 2 - 25;

                gsap.set(thumbnail, { x: tx, y: ty, rotation: 0 });
            });
        };

        /* ================= 3. EVENT LISTENERS ================= */
        const handleScroll = (e) => {
            const scrollIntensity = e.deltaY || e.detail || e.wheelDelta * -1;
            pos.current.targetX -= scrollIntensity * 1;
        };

        const handleResize = () => {
            config.current.isMobile = window.innerWidth < 1000;
            config.current.slideWidth = window.innerWidth * (config.current.isMobile ? 0.75 : 0.45);
            config.current.viewportCenter = window.innerWidth / 2;
        };

        window.addEventListener("wheel", handleScroll, { passive: false });
        window.addEventListener("resize", handleResize);
        
        const animationId = requestAnimationFrame(animate);

        // Cleanup on unmount
        return () => {
            window.removeEventListener("wheel", handleScroll);
            window.removeEventListener("resize", handleResize);
            cancelAnimationFrame(animationId);
        };
    }, []);

    return (
        <div className="about-page">
            <NavBar/>
            <div className="slider" ref={sliderRef}>
                <p className="slide-title" ref={titleRef}>Pure Mev Vision</p>
                {/* Triple Buffer for Infinite Effect (totalSlides * 3) */}
                {[...Array(slideImages.length * 3)].map((_, i) => (
                    <div key={i} className="slide">
                        <img src={slideImages[i % slideImages.length]} alt="" />
                    </div>
                ))}
            </div>

            <div className="thumbnail-wheel" ref={wheelRef}>
                {slideImages.map((_, i) => (
                    <div key={i} className="thumbnail-item">
                        <img src={slideImages[(i + 1) % slideImages.length]} alt="" />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default About;
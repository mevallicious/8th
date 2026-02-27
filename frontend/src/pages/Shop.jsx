import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom"; // 1. IMPORTED THIS
import gsap from "gsap";
import products from "../data/products";
import "../styles/Shop.css";
import NavBar from "../components/Navbar";

const Shop = () => {

  const navigate = useNavigate();

  const productsContainer = useRef(null);
  const productName = useRef(null);
  const productPreview = useRef(null);
  const previewName = useRef(null);
  const previewImg = useRef(null);
  const previewTag = useRef(null);
  const productBanner = useRef(null);
  const bannerImg = useRef(null);
  const controllerInner = useRef(null);
  const controllerOuter = useRef(null);
  const prevBtn = useRef(null);
  const nextBtn = useRef(null);
  const closeIconSpans = useRef([]);

  /* ===== STATE (PERSISTENT) ===== */
  const currentProductIndex = useRef(0);
  const slideItems = useRef([]);
  const isPreviewAnimating = useRef(false);
  const isPreviewOpen = useRef(false);

  const BUFFER_SIZE = 5;
  const spacing = 0.375;
  const slideWidth = spacing * 1000;

  const handleViewDetails = () => {
    // Find the currently active product based on your GSAP index logic
    const idx = ((currentProductIndex.current % products.length) + products.length) % products.length;
    const activeProduct = products[idx];
    
    // Convert the name "Oak Lounge Chair" into "oak-lounge-chair"
    const slug = activeProduct.name.toLowerCase().replace(/\s+/g, '-');
    
    // Send the user to the dynamic route
    navigate(`/product/${slug}`);
  };

  /* ===== SLIDES ===== */

  const addSlideItem = (relativeIndex) => {
    const productIndex =
      (((currentProductIndex.current + relativeIndex) % products.length) +
        products.length) %
      products.length;

    const product = products[productIndex];

    const li = document.createElement("li");
    li.innerHTML = `<img src="${product.img}" alt="${product.name}" />`;
    li.dataset.relativeIndex = relativeIndex;

    gsap.set(li, {
      x: relativeIndex * slideWidth,
      scale: relativeIndex === 0 ? 1.25 : 0.75,
      zIndex: relativeIndex === 0 ? 100 : 1,
    });

    productsContainer.current.appendChild(li);
    slideItems.current.push({ element: li, relativeIndex });
  };

  const removeSlideItem = (relativeIndex) => {
    const index = slideItems.current.findIndex(
      (item) => item.relativeIndex === relativeIndex
    );

    if (index !== -1) {
      slideItems.current[index].element.remove();
      slideItems.current.splice(index, 1);
    }
  };

  const updateSliderPosition = () => {
    slideItems.current.forEach((item) => {
      const isActive = item.relativeIndex === 0;

      gsap.to(item.element, {
        x: item.relativeIndex * slideWidth,
        scale: isActive ? 1.25 : 0.75,
        zIndex: isActive ? 100 : 1,
        duration: 0.75,
        ease: "power3.out",
      });
    });
  };

  /* ===== CONTENT ===== */

  const updateProductName = () => {
    const idx =
      ((currentProductIndex.current % products.length) + products.length) %
      products.length;

    productName.current.textContent = products[idx].name;
  };

  const updatePreviewContent = () => {
    const idx =
      ((currentProductIndex.current % products.length) + products.length) %
      products.length;

    const p = products[idx];

    previewName.current.textContent = p.name;
    previewImg.current.src = p.img;
    previewTag.current.textContent = p.tag;
    // previewUrl.current.href = p.url;
    bannerImg.current.src = p.img;
  };

  const updateButtonStates = () => {
    if (isPreviewAnimating.current || isPreviewOpen.current) {
      prevBtn.current?.classList.add("disabled");
      nextBtn.current?.classList.add("disabled");
    } else {
      prevBtn.current?.classList.remove("disabled");
      nextBtn.current?.classList.remove("disabled");
    }
  };

  /* ===== ANIMATIONS ===== */

  const animateSlideItems = (hide = false) => {
    slideItems.current.forEach((item) => {
      const abs = Math.abs(item.relativeIndex);

      if (abs === 1 || abs === 2) {
        gsap.to(item.element, {
          x: hide
            ? item.relativeIndex * slideWidth * 1.5
            : item.relativeIndex * slideWidth,
          opacity: hide ? 0 : 1,
          duration: 0.75,
          ease: "power3.inOut",
        });
      }
    });
  };

  const animateControllerTransition = (opening = false) => {
    gsap.to([".controller-label p", ".nav-btn"], {
      opacity: opening ? 0 : 1,
      duration: 0.2,
      delay: opening ? 0 : 0.4,
    });

    gsap.to(controllerOuter.current, {
      clipPath: opening
        ? "circle(0% at 50% 50%)"
        : "circle(50% at 50% 50%)",
      duration: 0.75,
    });

    gsap.to(controllerInner.current, {
      clipPath: opening
        ? "circle(50% at 50% 50%)"
        : "circle(40% at 50% 50%)",
      duration: 0.75,
    });

    gsap.to(closeIconSpans.current, {
      width: opening ? "20px" : "0px",
      duration: 0.3,
      stagger: 0.05,
    });
  };

  /* ===== PREVIEW + FULLSCREEN BACKGROUND IMAGE ===== */

  const togglePreview = () => {
    if (isPreviewAnimating.current) return;

    isPreviewAnimating.current = true;
    updateButtonStates();

    if (!isPreviewOpen.current) updatePreviewContent();

    gsap.to(productPreview.current, {
      y: isPreviewOpen.current ? "120%" : "-50%",
      duration: 0.75,
      ease: "power3.inOut",
    });

    gsap.to(productBanner.current, {
      opacity: isPreviewOpen.current ? 0 : 1,
      duration: 0.5,
      ease: "power3.out",
    });

    gsap.to(bannerImg.current, {
      scale: isPreviewOpen.current ? 1.2 : 1,
      duration: 1,
      ease: "expo.out",
    });

    animateSlideItems(!isPreviewOpen.current);
    animateControllerTransition(!isPreviewOpen.current);

    setTimeout(() => {
      isPreviewOpen.current = !isPreviewOpen.current;
      isPreviewAnimating.current = false;
      updateButtonStates();
    }, 600);
  };

  /* ===== NAVIGATION ===== */

  const moveNext = () => {
    if (isPreviewAnimating.current || isPreviewOpen.current) return;

    currentProductIndex.current++;
    removeSlideItem(-BUFFER_SIZE);

    slideItems.current.forEach((i) => i.relativeIndex--);
    addSlideItem(BUFFER_SIZE);

    updateSliderPosition();
    updateProductName();
    updatePreviewContent();
  };

  const movePrev = () => {
    if (isPreviewAnimating.current || isPreviewOpen.current) return;

    currentProductIndex.current--;
    removeSlideItem(BUFFER_SIZE);

    slideItems.current.forEach((i) => i.relativeIndex++);
    addSlideItem(-BUFFER_SIZE);

    updateSliderPosition();
    updateProductName();
    updatePreviewContent();
  };

  /* ===== INIT ===== */

  useEffect(() => {
    if (!productsContainer.current) return;

    for (let i = -BUFFER_SIZE; i <= BUFFER_SIZE; i++) {
      addSlideItem(i);
    }

    updateProductName();
    updatePreviewContent();
    updateButtonStates();

    gsap.set(productPreview.current, { y: "120%" });
    gsap.set(bannerImg.current, { scale: 1.2 });

    const prev = prevBtn.current;
    const next = nextBtn.current;
    const ctrl = controllerInner.current;

    if (prev) prev.onclick = movePrev;
    if (next) next.onclick = moveNext;
    if (ctrl) ctrl.onclick = togglePreview;

    return () => {
      if (prev) prev.onclick = null;
      if (next) next.onclick = null;
      if (ctrl) ctrl.onclick = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ===== JSX ===== */

  return (
    <div className="shop-container">
      <NavBar/>
      <div className="shop-nav">
        <div className="product-name">
          <p ref={productName}></p>
        </div>
      </div>

      <div className="gallery">
        <ul className="products" ref={productsContainer}></ul>

        <div className="controller">
          <div className="controller-inner" ref={controllerInner}>
            <div className="close-icon">
              <span ref={(el) => (closeIconSpans.current[0] = el)}></span>
              <span ref={(el) => (closeIconSpans.current[1] = el)}></span>
            </div>
          </div>

          <div className="controller-outer" ref={controllerOuter}>
            <div className="controller-label">
              <p>Menu</p>
            </div>
            <div className="nav-btn prev" ref={prevBtn}>◀</div>
            <div className="nav-btn next" ref={nextBtn}>▶</div>
          </div>
        </div>
      </div>

      <div className="product-banner" ref={productBanner}>
        <img ref={bannerImg} alt="" />
      </div>

      <div className="product-preview" ref={productPreview}>
        <div className="product-preview-info">
          <div className="product-preview-name">
            <p ref={previewName}></p>
          </div>
          <div className="product-preview-tag">
            <p ref={previewTag}></p>
          </div>
        </div>

        <div className="product-preview-img">
          <img ref={previewImg} alt="" />
        </div>

        <div className="product-url">
          <div className="btn">
           <button 
              onClick={handleViewDetails} 
              style={{
                background: 'transparent', 
                border: 'none', 
                color: 'inherit', 
                fontFamily: 'inherit', 
                fontSize: 'inherit', 
                cursor: 'pointer',
                padding: '0' // Adjusted to keep your existing styling intact
              }}
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;

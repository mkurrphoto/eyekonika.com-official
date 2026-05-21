import { projects } from '../projects-data.js';

document.addEventListener("DOMContentLoaded", function () {
    gsap.registerPlugin(CustomEase);
    CustomEase.create("hop",    "M0,0 C0.071,0.505 0.192,0.726 0.318,0.852 0.45,0.984 0.504,1 1,1");
    CustomEase.create("smooth", "M0,0 C0.25,0.1 0.25,1 1,1");

    const sliderNav       = document.querySelector(".slider-nav");
    const slidesContainer = document.querySelector(".slides");
    const bgOverlay       = document.querySelector(".bg-overlay");
    const slideTitle      = document.querySelector('.slide-title');
    const floatingImg     = document.querySelector('.floating-img');
    const floatingImgEl   = floatingImg ? floatingImg.querySelector('img') : null;
    const scrollHint      = document.querySelector('.scroll-hint');

    const projectCard    = document.querySelector('.project-card');
    const counterCurrent = projectCard ? projectCard.querySelector('.counter-current') : null;
    const counterTotal   = projectCard ? projectCard.querySelector('.counter-total')   : null;
    const locationEl     = projectCard ? projectCard.querySelector('.project-location') : null;
    const nameEl         = projectCard ? projectCard.querySelector('.project-name')     : null;
    const typeEl         = projectCard ? projectCard.querySelector('.project-type')     : null;
    const ctaBtn         = projectCard ? projectCard.querySelector('.project-cta')      : null;

    const numberOfItems = projects.length;
    let isTransitioning = false;
    let scrollTimeout   = null;
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    // Set hint text based on input device
    if (scrollHint) {
        scrollHint.textContent = isTouchDevice ? 'Swipe to explore' : 'Scroll to explore';
    }

    // CTA navigates to current project detail page
    if (ctaBtn) {
        ctaBtn.addEventListener('click', () => {
            window.location.href = `projects/${projects[currentIndex].slug}.html`;
        });
    }

    // ── Letter watermark animation ──────────────────────
    function updateTitle(newIndex) {
        if (!slideTitle) return;
        const watermark = projects[newIndex].watermark;
        const titleRows = slideTitle.querySelectorAll(".slide-title-row");

        titleRows.forEach((row, rowIndex) => {
            row.querySelectorAll(".letter").forEach((letter, letterIndex) => {
                const existingSpan = letter.querySelector("span");
                if (existingSpan) letter.removeChild(existingSpan);

                const newSpan = document.createElement("span");
                const direction = newIndex > currentIndex ? 150 : -150;
                gsap.set(newSpan, { x: direction });
                newSpan.textContent = watermark[rowIndex][letterIndex] || "";
                letter.appendChild(newSpan);
                gsap.to(newSpan, { x: 0, duration: 1.2, ease: 'smooth', delay: 0.05 });
            });
        });
    }

    // ── Floating secondary image parallax + crossfade ───
    function updateFloatingImg(newIndex) {
        if (!floatingImg || !floatingImgEl) return;
        const direction = newIndex > currentIndex ? 50 : -50;
        gsap.to(floatingImg, { x: direction, duration: 0.45, ease: 'smooth', onComplete: () => {
            gsap.to(floatingImg, { x: 0, duration: 1.3, ease: 'smooth' });
        }});
        gsap.to(floatingImgEl, { opacity: 0, duration: 0.22, onComplete: () => {
            floatingImgEl.src = projects[newIndex].thumbnail || projects[newIndex].image;
            floatingImgEl.style.objectPosition = projects[newIndex].thumbPosition || 'center center';
            gsap.to(floatingImgEl, { opacity: 0.75, duration: 0.45 });
        }});
    }

    // ── Project card content transition ─────────────────
    function updateProjectCard(newIndex) {
        if (!projectCard) return;
        const direction = newIndex > currentIndex ? 1 : -1;

        gsap.to(projectCard, {
            y: direction * -18, opacity: 0, duration: 0.28, ease: 'smooth',
            onComplete: () => {
                if (counterCurrent) counterCurrent.textContent = String(newIndex + 1).padStart(2, '0');
                if (locationEl)     locationEl.textContent     = projects[newIndex].location;
                if (nameEl)         nameEl.textContent         = projects[newIndex].name;
                if (typeEl)         typeEl.textContent         = projects[newIndex].type;
                gsap.fromTo(projectCard,
                    { y: direction * 18, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.45, ease: 'smooth' }
                );
            }
        });
    }

    // ── Main slide transition ────────────────────────────
    function goToSlide(newIndex) {
        if (isTransitioning || newIndex === currentIndex || newIndex < 0 || newIndex >= numberOfItems) return;
        isTransitioning = true;

        if (scrollHint) scrollHint.classList.add('has-interacted');

        document.querySelectorAll(".nav-item-wrapper").forEach((nav, i) => {
            nav.classList.toggle("active", i === newIndex);
        });

        gsap.to(slidesContainer, {
            x: `${-newIndex * 100}vw`,
            duration: 0.65,
            ease: "smooth",
            onComplete: () => { isTransitioning = false; }
        });

        gsap.to(bgOverlay, { backgroundColor: projects[newIndex].color, duration: 0.7, ease: "smooth" });

        updateTitle(newIndex);
        updateFloatingImg(newIndex);
        updateProjectCard(newIndex);

        history.replaceState(null, '', `#${projects[newIndex].slug}`);

        currentIndex = newIndex;
    }

    if (slidesContainer) slidesContainer.style.width = `${numberOfItems * 100}vw`;

    // ── Build nav dots + slide elements ──────────────────
    for (let i = 0; i < numberOfItems; i++) {
        const navWrapper = document.createElement('div');
        navWrapper.classList.add("nav-item-wrapper");
        const navItem = document.createElement('div');
        navItem.classList.add('nav-item');
        navWrapper.appendChild(navItem);
        sliderNav.appendChild(navWrapper);
        navWrapper.addEventListener("click", () => goToSlide(i));

        const slide = document.createElement("div");
        slide.classList.add("slide");
        slide.title = projects[i].name;
        slide.style.cursor = 'pointer';

        const imgWrapper = document.createElement("div");
        imgWrapper.classList.add("img");
        const img = document.createElement("img");
        img.src = projects[i].image;
        img.alt = projects[i].name;
        imgWrapper.appendChild(img);
        slide.appendChild(imgWrapper);

        slide.addEventListener('click', () => {
            window.location.href = `projects/${projects[i].slug}.html`;
        });

        slidesContainer.appendChild(slide);
    }

    // ── Init — resolve starting slide from URL hash ──────
    const initialSlug  = location.hash.slice(1);
    const initialIndex = Math.max(0, projects.findIndex(p => p.slug === initialSlug));
    let currentIndex   = initialIndex;

    gsap.set(slidesContainer, { x: `${-initialIndex * 100}vw` });
    gsap.set(bgOverlay, { backgroundColor: projects[initialIndex].color });

    document.querySelectorAll('.nav-item-wrapper').forEach((nav, i) => {
        nav.classList.toggle('active', i === initialIndex);
    });

    if (projectCard) {
        if (counterTotal)   counterTotal.textContent   = String(numberOfItems).padStart(2, '0');
        if (counterCurrent) counterCurrent.textContent = String(initialIndex + 1).padStart(2, '0');
        if (locationEl)     locationEl.textContent     = projects[initialIndex].location;
        if (nameEl)         nameEl.textContent         = projects[initialIndex].name;
        if (typeEl)         typeEl.textContent         = projects[initialIndex].type;
    }

    if (floatingImgEl) {
        floatingImgEl.src = projects[initialIndex].thumbnail || projects[initialIndex].image;
        floatingImgEl.style.objectPosition = projects[initialIndex].thumbPosition || 'center center';
        gsap.set(floatingImg, { opacity: 0 });
        gsap.to(floatingImg, { opacity: 1, duration: 0.9, delay: 0.5 });
    }

    updateTitle(initialIndex);

    // ── Keyboard navigation ───────────────────────────────
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            goToSlide(currentIndex === numberOfItems - 1 ? 0 : currentIndex + 1);
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            goToSlide(currentIndex === 0 ? numberOfItems - 1 : currentIndex - 1);
        }
    });

    // ── Mouse wheel (desktop) ─────────────────────────────
    let wheelDelta = 0;
    const wheelThreshold = 50;

    if (!isTouchDevice) {
        window.addEventListener("wheel", (e) => {
            e.preventDefault();
            wheelDelta += e.deltaY;
            if (scrollTimeout) clearTimeout(scrollTimeout);

            scrollTimeout = setTimeout(() => {
                if (Math.abs(wheelDelta) > wheelThreshold) {
                    goToSlide(wheelDelta > 0
                        ? (currentIndex === numberOfItems - 1 ? 0 : currentIndex + 1)
                        : (currentIndex === 0 ? numberOfItems - 1 : currentIndex - 1)
                    );
                    wheelDelta = 0;
                }
            }, 100);
        }, { passive: false });
    }

    // ── Touch / swipe (mobile) ────────────────────────────
    let touchStartX = 0, touchStartY = 0;
    const swipeThreshold         = 50;
    const verticalSwipeThreshold = 80;
    const container = document.querySelector('.container');

    container.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    container.addEventListener('touchend', (e) => {
        if (isTransitioning) return;
        const deltaX = e.changedTouches[0].screenX - touchStartX;
        const deltaY = e.changedTouches[0].screenY - touchStartY;

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            if (Math.abs(deltaX) > swipeThreshold) {
                e.preventDefault();
                goToSlide(deltaX > 0
                    ? (currentIndex === 0 ? numberOfItems - 1 : currentIndex - 1)
                    : (currentIndex === numberOfItems - 1 ? 0 : currentIndex + 1)
                );
            }
        } else if (Math.abs(deltaY) > verticalSwipeThreshold) {
            e.preventDefault();
            goToSlide(deltaY < 0
                ? (currentIndex === numberOfItems - 1 ? 0 : currentIndex + 1)
                : (currentIndex === 0 ? numberOfItems - 1 : currentIndex - 1)
            );
        }
    }, { passive: false });
});

import { titles } from './data.js';

const projects = [
    {
        slug: 'jordanville',
        name: 'Holy Trinity Monastery',
        location: 'Jordanville, NY',
        type: 'Iconography & Sacred Art',
        color: '#12172e'
    },
    {
        slug: 'lakewood',
        name: 'St. Alexander Nevsky Cathedral',
        location: 'Howell, NJ',
        type: 'Cathedral Photography',
        color: '#0e1e30'
    },
    {
        slug: 'st-tikhons',
        name: "St. Tikhon's Monastery",
        location: 'Waymart, PA',
        type: 'Monastic Documentary',
        color: '#121e16'
    },
];

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

    // Project card elements (may not exist on older pages)
    const projectCard    = document.querySelector('.project-card');
    const counterCurrent = projectCard ? projectCard.querySelector('.counter-current') : null;
    const counterTotal   = projectCard ? projectCard.querySelector('.counter-total')   : null;
    const locationEl     = projectCard ? projectCard.querySelector('.project-location') : null;
    const nameEl         = projectCard ? projectCard.querySelector('.project-name')     : null;
    const typeEl         = projectCard ? projectCard.querySelector('.project-type')     : null;
    const ctaBtn         = projectCard ? projectCard.querySelector('.project-cta')      : null;

    const numberOfItems  = projects.length;
    let currentIndex     = 0;
    let isTransitioning  = false;
    let scrollTimeout    = null;

    // Populate initial card content
    if (projectCard) {
        if (counterTotal)   counterTotal.textContent   = String(numberOfItems).padStart(2, '0');
        if (counterCurrent) counterCurrent.textContent = '01';
        if (locationEl)     locationEl.textContent     = projects[0].location;
        if (nameEl)         nameEl.textContent         = projects[0].name;
        if (typeEl)         typeEl.textContent         = projects[0].type;
    }

    // CTA navigates to current project's detail page
    if (ctaBtn) {
        ctaBtn.addEventListener('click', () => {
            sessionStorage.setItem('returnSection', 'two');
            window.location.href = `projects/${projects[currentIndex].slug}.html`;
        });
    }

    // ── Letter watermark animation ──────────────────
    function updateTitle(newIndex) {
        if (!slideTitle) return;
        const title     = titles(newIndex);
        const titleRows = slideTitle.querySelectorAll(".slide-title-row");

        titleRows.forEach((row, rowIndex) => {
            row.querySelectorAll(".letter").forEach((letter, letterIndex) => {
                const existingSpan = letter.querySelector("span");
                if (existingSpan) letter.removeChild(existingSpan);

                const newSpan = document.createElement("span");
                const direction = newIndex > currentIndex ? 150 : -150;
                gsap.set(newSpan, { x: direction });
                newSpan.textContent = title[rowIndex][letterIndex] || "";
                letter.appendChild(newSpan);
                gsap.to(newSpan, { x: 0, duration: 1.2, ease: 'smooth', delay: 0.05 });
            });
        });
    }

    // ── Floating secondary image parallax + crossfade ──
    function updateFloatingImg(newIndex) {
        if (!floatingImg || !floatingImgEl) return;
        const direction = newIndex > currentIndex ? 50 : -50;
        gsap.to(floatingImg, { x: direction, duration: 0.45, ease: 'smooth', onComplete: () => {
            gsap.to(floatingImg, { x: 0, duration: 1.3, ease: 'smooth' });
        }});
        gsap.to(floatingImgEl, { opacity: 0, duration: 0.22, onComplete: () => {
            floatingImgEl.src = `images/gallery/${newIndex + 1}.jpg`;
            gsap.to(floatingImgEl, { opacity: 0.75, duration: 0.45 });
        }});
    }

    // ── Project card content transition ────────────────
    function updateProjectCard(newIndex) {
        if (!projectCard) return;
        const direction = newIndex > currentIndex ? 1 : -1;

        gsap.to(projectCard, {
            y: direction * -18, opacity: 0, duration: 0.28, ease: 'smooth',
            onComplete: () => {
                if (counterCurrent) counterCurrent.textContent = String(newIndex + 1).padStart(2, '0');
                if (locationEl)     locationEl.textContent = projects[newIndex].location;
                if (nameEl)         nameEl.textContent     = projects[newIndex].name;
                if (typeEl)         typeEl.textContent     = projects[newIndex].type;
                gsap.fromTo(projectCard,
                    { y: direction * 18, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.45, ease: 'smooth' }
                );
            }
        });
    }

    // ── Main slide transition ───────────────────────────
    function goToSlide(newIndex) {
        if (isTransitioning || newIndex === currentIndex || newIndex < 0 || newIndex >= numberOfItems) return;
        isTransitioning = true;

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

        currentIndex = newIndex;
    }

    if (slidesContainer) slidesContainer.style.width = `${numberOfItems * 100}vw`;

    // ── Build nav dots + slide elements ─────────────────
    for (let i = 0; i < numberOfItems; i++) {
        const navWrapper = document.createElement('div');
        navWrapper.classList.add("nav-item-wrapper");
        if (i === 0) navWrapper.classList.add("active");
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
        img.src = `images/gallery/${i + 1}.jpg`;
        img.alt = projects[i].name;
        imgWrapper.appendChild(img);
        slide.appendChild(imgWrapper);

        slide.addEventListener('click', () => {
            sessionStorage.setItem('returnSection', 'two');
            window.location.href = `projects/${projects[i].slug}.html`;
        });

        slidesContainer.appendChild(slide);
    }

    // ── Init state ───────────────────────────────────────
    gsap.set(bgOverlay, { backgroundColor: projects[0].color });

    if (floatingImgEl) {
        floatingImgEl.src = 'images/gallery/2.jpg';
        gsap.set(floatingImg, { opacity: 0 });
        gsap.to(floatingImg, { opacity: 1, duration: 0.9, delay: 0.5 });
    }

    updateTitle(0);

    // ── Keyboard navigation ──────────────────────────────
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            goToSlide(currentIndex === numberOfItems - 1 ? 0 : currentIndex + 1);
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            goToSlide(currentIndex === 0 ? numberOfItems - 1 : currentIndex - 1);
        }
    });

    // ── Mouse wheel (desktop) ────────────────────────────
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
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

    // ── Touch / swipe (mobile) ───────────────────────────
    let touchStartX = 0, touchStartY = 0;
    const swipeThreshold = 50;
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

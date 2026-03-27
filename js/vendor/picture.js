import { titles } from './data.js';

const projects = [
    { slug: 'jordanville',  name: 'Holy Trinity Monastery',        location: 'Jordanville, NY' },
    { slug: 'lakewood',     name: 'St. Alexander Nevsky Cathedral', location: 'Howell, NJ'      },
    { slug: 'st-tikhons',   name: "St. Tikhon's Monastery",         location: 'Waymart, PA'     },
];

document.addEventListener("DOMContentLoaded", function () {
    gsap.registerPlugin(CustomEase);
    CustomEase.create(
        "hop",
        "M0,0 C0.071,0.505 0.192,0.726 0.318,0.852 0.45,0.984 0.504,1 1,1"
    );
    CustomEase.create(
        "smooth",
        "M0,0 C0.25,0.1 0.25,1 1,1"
    );

    const sliderNav        = document.querySelector(".slider-nav");
    const slidesContainer  = document.querySelector(".slides");
    const bgOverlay        = document.querySelector(".bg-overlay");
    const slideTitle       = document.querySelector('.slide-title');
    const floatingImg      = document.querySelector('.floating-img');
    const floatingImgEl    = floatingImg ? floatingImg.querySelector('img') : null;

    const numberOfItems    = projects.length;
    let currentIndex       = 0;
    let isTransitioning    = false;
    let scrollTimeout      = null;

    function getRandomColor() {
        const palette = ['#2a1a4e', '#1a3a4e', '#3a1a3a', '#1a2a4e', '#1e2a3a', '#2a2a1e'];
        return palette[Math.floor(Math.random() * palette.length)];
    }

    function updateTitle(newIndex, color) {
        const title     = titles(newIndex);
        const titleRows = slideTitle.querySelectorAll(".slide-title-row");

        titleRows.forEach((row, rowIndex) => {
            row.querySelectorAll(".letter").forEach((letter, letterIndex) => {
                const existingSpan = letter.querySelector("span");
                if (existingSpan) letter.removeChild(existingSpan);

                const newSpan = document.createElement("span");
                const direction = newIndex > currentIndex ? 150 : -150;
                gsap.set(newSpan, { x: direction, color: color });
                newSpan.textContent = title[rowIndex][letterIndex] || "";
                letter.appendChild(newSpan);
                gsap.to(newSpan, { x: 0, duration: 1.2, ease: 'smooth', delay: 0.1 });
            });
        });
    }

    function updateFloatingImg(newIndex) {
        if (!floatingImg || !floatingImgEl) return;

        // Parallax: float opposite direction to slides, then drift back
        const direction = newIndex > currentIndex ? 60 : -60;
        gsap.to(floatingImg, { x: direction, duration: 0.5, ease: 'smooth', onComplete: () => {
            gsap.to(floatingImg, { x: 0, duration: 1.4, ease: 'smooth' });
        }});

        // Crossfade to next project image
        gsap.to(floatingImgEl, { opacity: 0, duration: 0.25, onComplete: () => {
            floatingImgEl.src = `images/picture/${newIndex + 1}.jpg`;
            gsap.to(floatingImgEl, { opacity: 0.75, duration: 0.5 });
        }});
    }

    function updateProjectInfo(newIndex) {
        const allInfos = document.querySelectorAll('.project-info');
        allInfos.forEach((info, i) => {
            if (i === newIndex) {
                gsap.to(info, { opacity: 1, y: 0, duration: 0.6, ease: 'smooth', delay: 0.2 });
            } else {
                gsap.to(info, { opacity: 0, y: 20, duration: 0.3, ease: 'smooth' });
            }
        });
    }

    function goToSlide(newIndex) {
        if (isTransitioning || newIndex === currentIndex || newIndex < 0 || newIndex >= numberOfItems) return;

        isTransitioning = true;

        document.querySelectorAll(".nav-item-wrapper").forEach(nav => nav.classList.remove("active"));
        const navItems = document.querySelectorAll(".nav-item-wrapper");
        if (navItems[newIndex]) navItems[newIndex].classList.add("active");

        const translateXValue = -newIndex * 100;
        gsap.to(slidesContainer, {
            x: `${translateXValue}vw`,
            duration: 0.6,
            ease: "smooth",
            onComplete: () => { isTransitioning = false; }
        });

        const newColor = getRandomColor();
        gsap.to(bgOverlay, { backgroundColor: newColor, duration: 0.7, ease: "smooth" });

        updateTitle(newIndex, newColor);
        updateFloatingImg(newIndex);
        updateProjectInfo(newIndex);

        currentIndex = newIndex;
    }

    if (slidesContainer) slidesContainer.style.width = `${numberOfItems * 100}vw`;

    // Build nav items + slides
    for (let i = 0; i < numberOfItems; i++) {
        // Nav item
        const navItemWrapper = document.createElement('div');
        navItemWrapper.classList.add("nav-item-wrapper");
        if (i === 0) navItemWrapper.classList.add("active");
        const navItem = document.createElement("div");
        navItem.classList.add("nav-item");
        navItemWrapper.appendChild(navItem);
        sliderNav.appendChild(navItemWrapper);
        navItemWrapper.addEventListener("click", () => goToSlide(i));

        // Slide
        const slide = document.createElement("div");
        slide.classList.add("slide");
        if (i === 0) slide.classList.add("active");
        slide.style.cursor = 'pointer';
        slide.title = `View ${projects[i].name}`;

        // Main image
        const imgWrapper = document.createElement("div");
        imgWrapper.classList.add("img");
        const img = document.createElement("img");
        img.src = `images/picture/${i + 1}.jpg`;
        img.alt = projects[i].name;
        imgWrapper.appendChild(img);
        slide.appendChild(imgWrapper);

        // Project info overlay
        const projectInfo = document.createElement("div");
        projectInfo.classList.add("project-info");
        if (i !== 0) gsap.set(projectInfo, { opacity: 0, y: 20 });

        const locationEl = document.createElement("p");
        locationEl.classList.add("project-location");
        locationEl.textContent = projects[i].location;

        const nameEl = document.createElement("h2");
        nameEl.classList.add("project-name");
        nameEl.textContent = projects[i].name;

        const ctaEl = document.createElement("span");
        ctaEl.classList.add("project-cta");
        ctaEl.textContent = "View Project →";

        projectInfo.appendChild(locationEl);
        projectInfo.appendChild(nameEl);
        projectInfo.appendChild(ctaEl);
        slide.appendChild(projectInfo);

        // Click to navigate to project page
        slide.addEventListener('click', () => {
            sessionStorage.setItem('returnSection', 'two');
            window.location.href = `projects/${projects[i].slug}.html`;
        });

        slidesContainer.appendChild(slide);
    }

    // Set initial floating image
    if (floatingImgEl) {
        floatingImgEl.src = `images/picture/2.jpg`;
        gsap.set(floatingImg, { opacity: 0 });
        gsap.to(floatingImg, { opacity: 1, duration: 0.8, delay: 0.4 });
    }

    updateTitle(0, getComputedStyle(bgOverlay).backgroundColor);

    // Mouse wheel (desktop)
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    let wheelDelta = 0;
    const wheelThreshold = 50;

    if (!isTouchDevice) {
        window.addEventListener("wheel", (e) => {
            e.preventDefault();
            wheelDelta += e.deltaY;
            if (scrollTimeout) clearTimeout(scrollTimeout);

            if (currentIndex === 0 && wheelDelta < 0)                  goToSlide(numberOfItems - 1);
            if (currentIndex === numberOfItems - 1 && wheelDelta > 0)  goToSlide(0);

            scrollTimeout = setTimeout(() => {
                if (Math.abs(wheelDelta) > wheelThreshold) {
                    goToSlide(wheelDelta > 0 ? currentIndex + 1 : currentIndex - 1);
                    wheelDelta = 0;
                }
            }, 100);
        }, { passive: false });
    }

    // Touch/swipe (mobile)
    let touchStartX = 0, touchStartY = 0, touchEndX = 0, touchEndY = 0;
    const swipeThreshold = 50;
    const verticalSwipeThreshold = 80;
    const container = document.querySelector('.container');

    container.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    container.addEventListener('touchend', (e) => {
        if (isTransitioning) return;
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            if (Math.abs(deltaX) > swipeThreshold) {
                e.preventDefault();
                if (deltaX > 0) {
                    goToSlide(currentIndex === 0 ? numberOfItems - 1 : currentIndex - 1);
                } else {
                    goToSlide(currentIndex === numberOfItems - 1 ? 0 : currentIndex + 1);
                }
            }
        } else {
            if (Math.abs(deltaY) > verticalSwipeThreshold) {
                e.preventDefault();
                if (deltaY < 0) {
                    goToSlide(currentIndex === numberOfItems - 1 ? 0 : currentIndex + 1);
                } else {
                    goToSlide(currentIndex === 0 ? numberOfItems - 1 : currentIndex - 1);
                }
            }
        }
    }, { passive: false });
});

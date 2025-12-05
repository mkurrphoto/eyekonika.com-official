import { titles } from './data.js';

document.addEventListener("DOMContentLoaded", function () {
    gsap.registerPlugin(CustomEase);
    CustomEase.create(
        "hop",
        "M0,0 C0.071,0.505 0.192,0.726 0.318,0.852 0.45,0.984 0.504,1 1,1"
    );
    // Smoother ease for slide transitions
    CustomEase.create(
        "smooth",
        "M0,0 C0.25,0.1 0.25,1 1,1"
    );

    const sliderNav = document.querySelector(".slider-nav");
    const slidesContainer = document.querySelector(".slides");
    const bgOverlay = document.querySelector(".bg-overlay");
    const slideTitle = document.querySelector('.slide-title');
    const numberOfItems = 3;
    let currentIndex = 0;
    let isTransitioning = false; // Prevent rapid transitions
    let scrollTimeout = null; // Throttle scroll events

    // Helper: random accent color for background and title
    function getRandomColor() {
        const letters = "0123456789ABCDEF";
        let color = "#"
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
    // Helper: animate title rows/letters when slide changes
    function updateTitle(newIndex, color) {
        const title = titles(newIndex);
        const titleRows = slideTitle.querySelectorAll(".slide-title-row")

        titleRows.forEach((row, rowIndex) => {
            row.querySelectorAll(".letter").forEach((letter, letterIndex) => {
                const existingSpan = letter.querySelector("span");
                if (existingSpan) {
                    letter.removeChild(existingSpan)
                }

                const newSpan = document.createElement("span");
                const direction = newIndex > currentIndex ? 150 : -150;
                gsap.set(newSpan, {
                    x: direction,
                    color: color,
                })
                newSpan.textContent = title[rowIndex][letterIndex] || "";
                letter.appendChild(newSpan);
                gsap.to(newSpan, {
                    x: 0,
                    duration: 1.2,
                    ease: 'smooth',
                    delay: 0.1
                })

            })
        })
    }

    // Function to navigate to a specific slide
    function goToSlide(newIndex) {
        // Prevent navigation if already transitioning or same index
        if (isTransitioning || newIndex === currentIndex || newIndex < 0 || newIndex >= numberOfItems) {
            return;
        }

        isTransitioning = true;

        // Update nav items
        document
            .querySelectorAll(".nav-item-wrapper")
            .forEach((nav) => nav.classList.remove("active"));
        const navItems = document.querySelectorAll(".nav-item-wrapper");
        if (navItems[newIndex]) {
            navItems[newIndex].classList.add("active");
        }

        // Move slides container based on index
        const translateXValue = -newIndex * 100;
        gsap.to(slidesContainer, {
            x: `${translateXValue}vw`,
            duration: 0.6,
            ease: "smooth",
            onComplete: () => {
                isTransitioning = false;
            }
        });

        const newColor = getRandomColor();
        gsap.to(bgOverlay, {
            backgroundColor: newColor,
            duration: 0.7,
            ease: "smooth"
        });

        updateTitle(newIndex, newColor);
        currentIndex = newIndex;
    }

    // Ensure slides container width matches number of items
    if (slidesContainer) {
        slidesContainer.style.width = `${numberOfItems * 100}vw`;
    }

    // Build nav items + slides
    for (let i = 0; i < numberOfItems; i++) {
        const navItemWrapper = document.createElement('div');
        navItemWrapper.classList.add("nav-item-wrapper");
        if (i === 0) {
            navItemWrapper.classList.add("active");
        }

        const navItem = document.createElement("div")
        navItem.classList.add("nav-item");

        navItemWrapper.appendChild(navItem);
        sliderNav.appendChild(navItemWrapper);

        // Click handler for each nav item
        navItemWrapper.addEventListener("click", () => {
            goToSlide(i);
        })

        const slide = document.createElement("div");
        slide.classList.add("slide");
        if( i === 0 ){
            slide.classList.add("active"); 
        }

        const imgWrapper = document.createElement("div");
        imgWrapper.classList.add("img");

        const img = document.createElement("img");
        img.src = `images/picture/${i+1}.jpg`;
        img.alt = "";

        imgWrapper.appendChild(img);
        slide.appendChild(imgWrapper);
        slidesContainer.appendChild(slide);
    }

    updateTitle(0, getComputedStyle(bgOverlay).backgroundColor)

    // Mouse wheel scroll handler
    let wheelDelta = 0;
    const wheelThreshold = 50; // Minimum scroll delta to trigger slide change

    window.addEventListener("wheel", (e) => {
        // Prevent default page scrolling
        e.preventDefault();

        // Accumulate wheel delta
        wheelDelta += e.deltaY;
        console.log(currentIndex);
        // Clear existing timeout
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        if(currentIndex === 0 && wheelDelta < 0){
            goToSlide(numberOfItems - 1);
        }
        if(currentIndex === numberOfItems - 1 && wheelDelta > 0){
            goToSlide(0);
        }

        // Throttle scroll events
        scrollTimeout = setTimeout(() => {
            if (Math.abs(wheelDelta) > wheelThreshold) {
                if (wheelDelta > 0) {
                    // Scrolled down - go to next slide
                    goToSlide(currentIndex + 1);
                } else {
                    // Scrolled up - go to previous slide
                    goToSlide(currentIndex - 1);
                }
                wheelDelta = 0; // Reset delta
            }
        }, 100);
    }, { passive: false });

})
/* =========================================================
   CBB BBQ — interactions
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    /* ==== Mobile Navigation ==== */
    const navToggle = document.querySelector(".nav-toggle");
    const primaryNavigation = document.querySelector(".primary-navigation");

    const closeNavigation = () => {
        if (!navToggle || !primaryNavigation) return;

        navToggle.classList.remove("is-active");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.setAttribute("aria-label", "Open navigation");
        primaryNavigation.classList.remove("is-open");
        document.body.classList.remove("nav-open");
    };

    if (navToggle && primaryNavigation) {
        navToggle.addEventListener("click", () => {
            const isOpen = navToggle.getAttribute("aria-expanded") === "true";

            navToggle.classList.toggle("is-active", !isOpen);
            navToggle.setAttribute("aria-expanded", String(!isOpen));
            navToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
            primaryNavigation.classList.toggle("is-open", !isOpen);
            document.body.classList.toggle("nav-open", !isOpen);
        });

        primaryNavigation.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", closeNavigation);
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") closeNavigation();
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 850) closeNavigation();
        });
    }

    /* ==== Menu Carousel ==== */
    const menuTrack = document.querySelector(".menu-carousel-track");
    const menuCards = Array.from(document.querySelectorAll(".menu-card"));
    const menuPrev = document.querySelector(".carousel-prev");
    const menuNext = document.querySelector(".carousel-next");
    const menuStatus = document.querySelector(".carousel-status");
    const menuProgress = document.querySelector(".carousel-progress span");
    let menuIndex = 0;

    const getVisibleMenuCards = () => {
        if (window.innerWidth <= 560) return 1;
        if (window.innerWidth <= 850) return 2;
        if (window.innerWidth <= 1100) return 2;
        return 3;
    };

    const updateMenuCarousel = () => {
        if (!menuTrack || !menuCards.length) return;

        const visibleCards = getVisibleMenuCards();
        const maxIndex = Math.max(0, menuCards.length - visibleCards);
        menuIndex = Math.min(menuIndex, maxIndex);

        const cardStyle = window.getComputedStyle(menuCards[0]);
        const trackStyle = window.getComputedStyle(menuTrack);
        const gap = parseFloat(trackStyle.columnGap || trackStyle.gap) || 0;
        const cardWidth = menuCards[0].getBoundingClientRect().width;
        menuTrack.style.transform = `translateX(-${menuIndex * (cardWidth + gap)}px)`;

        if (menuStatus) {
            const current = String(menuIndex + 1).padStart(2, "0");
            const total = String(menuCards.length).padStart(2, "0");
            menuStatus.innerHTML = `${current} <span>/</span> ${total}`;
        }

        if (menuProgress) {
            const progress = ((menuIndex + visibleCards) / menuCards.length) * 100;
            menuProgress.style.width = `${Math.min(100, progress)}%`;
        }

        if (menuPrev) menuPrev.disabled = menuIndex <= 0;
        if (menuNext) menuNext.disabled = menuIndex >= maxIndex;
    };

    menuPrev?.addEventListener("click", () => {
        menuIndex = Math.max(0, menuIndex - 1);
        updateMenuCarousel();
    });

    menuNext?.addEventListener("click", () => {
        const maxIndex = Math.max(0, menuCards.length - getVisibleMenuCards());
        menuIndex = Math.min(maxIndex, menuIndex + 1);
        updateMenuCarousel();
    });

    if (menuTrack) {
        updateMenuCarousel();
        window.addEventListener("resize", updateMenuCarousel);
    }

    /* ==== Current Footer Year ==== */
    const currentYear = document.getElementById("currentYear");
    if (currentYear) currentYear.textContent = new Date().getFullYear();

    /* ==== Demo Policy Notice ==== */
    document.querySelectorAll("[data-policy-link]").forEach((link) => {
        link.addEventListener("click", (event) => {
            const targetId = link.dataset.policyLink === "terms" ? "termsNotice" : "privacyNotice";
            const target = document.getElementById(targetId);

            if (target) {
                event.preventDefault();
                target.scrollIntoView({ behavior: "smooth", block: "center" });
                target.setAttribute("tabindex", "-1");
                target.focus({ preventScroll: true });
            }
        });
    });
});

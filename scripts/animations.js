const motionOk = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const observerOptions = { threshold: 0.15, rootMargin: '0px 0px -10% 0px' };
let observer = null;

if (motionOk && 'IntersectionObserver' in window) {
    observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
}

function registerReveal(element, delayMs) {
    if (!element || element.dataset.revealInit) return;
    element.dataset.revealInit = '1';
    element.classList.add('reveal');
    if (typeof delayMs === 'number') {
        element.style.transitionDelay = `${delayMs}ms`;
    }
    if (observer) {
        observer.observe(element);
    } else {
        element.classList.add('is-visible');
    }
}

function initializeAnimations(root = document) {
    const sections = root.querySelectorAll('.main-content section');
    sections.forEach((section, index) => registerReveal(section, index * 90));

    const postCards = root.querySelectorAll('.post-card');
    postCards.forEach((card, index) => registerReveal(card, 120 + index * 70));

    const experienceItems = root.querySelectorAll('.experience-item, .education-item');
    experienceItems.forEach((item, index) => registerReveal(item, 160 + index * 50));

    const resumeCards = root.querySelectorAll('.resume-card, .resume-block');
    resumeCards.forEach((card, index) => registerReveal(card, 140 + index * 70));
}

const mutationObserver = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
        mutation.addedNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
                initializeAnimations(node);
            }
        });
    }
});

mutationObserver.observe(document.documentElement, { childList: true, subtree: true });

window.addEventListener('load', () => {
    document.body.classList.add('js-ready');

    const loadingBar = document.createElement('div');
    loadingBar.classList.add('loading-bar');
    document.body.appendChild(loadingBar);

    setTimeout(() => {
        loadingBar.style.opacity = '0';
        setTimeout(() => {
            loadingBar.remove();
        }, 300);
    }, 1000);

    if (!document.querySelector('.embers')) {
        const embers = document.createElement('div');
        embers.classList.add('embers');
        document.body.prepend(embers);
    }

    initializeAnimations();
});

// Ambient cursor glow + card tilt (decorative only, desktop pointer devices)
if (motionOk && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const glow = document.createElement('div');
    glow.classList.add('cursor-glow');
    glow.style.opacity = '0';
    document.body.appendChild(glow);

    let glowX = window.innerWidth / 2;
    let glowY = window.innerHeight / 2;
    let targetX = glowX;
    let targetY = glowY;
    let glowRafId = null;

    function tickGlow() {
        glowX += (targetX - glowX) * 0.12;
        glowY += (targetY - glowY) * 0.12;
        glow.style.transform = `translate3d(${glowX}px, ${glowY}px, 0)`;
        glowRafId = window.requestAnimationFrame(tickGlow);
    }

    window.addEventListener('pointermove', (event) => {
        targetX = event.clientX;
        targetY = event.clientY;
        glow.style.opacity = '1';
        if (!glowRafId) {
            glowX = targetX;
            glowY = targetY;
            tickGlow();
        }
    });

    const TILT_SELECTOR = '.hero-card, .post-card, .resume-card';
    let tiltEl = null;

    function resetTilt() {
        if (tiltEl) {
            tiltEl.style.transform = '';
            tiltEl = null;
        }
    }

    window.addEventListener('pointermove', (event) => {
        const el = event.target.closest ? event.target.closest(TILT_SELECTOR) : null;
        if (el !== tiltEl) {
            resetTilt();
            tiltEl = el;
        }
        if (!tiltEl) return;
        const rect = tiltEl.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width - 0.5;
        const py = (event.clientY - rect.top) / rect.height - 0.5;
        const rotateY = px * 8;
        const rotateX = py * -8;
        tiltEl.style.transform = `perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    window.addEventListener('mouseout', (event) => {
        if (!event.relatedTarget) resetTilt();
    });
}

// Fade the page out before navigating to another page on this site, so
// following a link (e.g. to chronicles.html or a post) feels like a
// transition instead of an instant cut. The new page's own scroll-reveal
// system handles the fade-in on arrival.
if (motionOk) {
    document.addEventListener('click', (event) => {
        if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        const link = event.target.closest ? event.target.closest('a[href]') : null;
        if (!link || link.target === '_blank') return;
        if (link.protocol !== window.location.protocol || link.host !== window.location.host) return;
        if (link.href.startsWith('javascript:')) return;
        if (link.href === window.location.href) return;

        event.preventDefault();
        document.body.classList.add('page-transition-out');
        window.setTimeout(() => {
            window.location.href = link.href;
        }, 220);
    });

    window.addEventListener('pageshow', (event) => {
        if (event.persisted) {
            document.body.classList.remove('page-transition-out');
        }
    });
}

if (motionOk) {
    let rafId = null;
    const updateSections = () => {
        const sections = document.querySelectorAll('.main-content section');
        const viewportCenter = window.innerHeight * 0.6;
        sections.forEach((section) => {
            const rect = section.getBoundingClientRect();
            const offset = ((rect.top - viewportCenter) / window.innerHeight) * -12;
            section.style.setProperty('--panel-shift', `${offset}px`);
        });
        rafId = null;
    };
    window.addEventListener('scroll', () => {
        if (rafId) return;
        rafId = window.requestAnimationFrame(updateSections);
    });
    window.addEventListener('resize', () => {
        if (rafId) return;
        rafId = window.requestAnimationFrame(updateSections);
    });
}

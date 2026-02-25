"use strict";
let isExpanded = false;
let isAnimating = false;
let isTrans = false;
let isOnuButtonHovered = false;
let isPlayButtonHovered = false;
const bOnu = document.getElementById('onu-button');
const playButton = document.getElementById('play-button');
bOnu.style.userSelect = 'none';
bOnu.style.outline = 'none';
bOnu.style['WebkitTapHighlightColor'] = 'transparent';
playButton.style.userSelect = 'none';
playButton.style.outline = 'none';
playButton.style['WebkitTapHighlightColor'] = 'transparent';
bOnu.addEventListener('mousedown', transformButtonOnu);
bOnu.addEventListener('touchstart', transformButtonOnu);
bOnu.addEventListener('mouseenter', () => {
    isOnuButtonHovered = true;
});
bOnu.addEventListener('mouseleave', () => {
    isOnuButtonHovered = false;
});
document.addEventListener('keydown', (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && isPlayButtonHovered) {
        e.preventDefault();
        window.location.href = 'menu.html';
    }
    else if ((e.key === 'Enter' || e.key === ' ') && isOnuButtonHovered) {
        e.preventDefault();
        transformButtonOnu.call(bOnu);
    }
});
playButton.addEventListener('mouseenter', () => {
    isPlayButtonHovered = true;
});
playButton.addEventListener('mouseleave', () => {
    isPlayButtonHovered = false;
});
playButton.addEventListener('mousedown', () => {
    if (!isTrans) {
        isTrans = true;
        window.location.href = 'menu.html';
    }
});
playButton.addEventListener('touchstart', () => {
    if (!isTrans) {
        isTrans = true;
        window.location.href = 'menu.html';
    }
});
function verifyKey(event) {
    if ((event.key === 'Enter' || event.key === ' ') && isOnuButtonHovered) {
        event.preventDefault();
        transformButtonOnu.call(this);
    }
}
function transformButtonOnu() {
    if (isAnimating)
        return;
    isAnimating = true;
    if (!isExpanded) {
        this.style.transform = 'translateX(-200px)';
        playButton.style.display = 'block';
        setTimeout(() => {
            playButton.style.opacity = '1';
            playButton.style.transform = 'translate(-50%, -50%) scale(1)';
            setTimeout(() => {
                isAnimating = false;
            }, 500);
        }, 10);
    }
    else {
        this.style.transform = 'translateX(0)';
        playButton.style.opacity = '0';
        playButton.style.transform = 'translate(-50%, -50%) scale(0)';
        setTimeout(() => {
            playButton.style.display = 'none';
            isAnimating = false;
        }, 500);
    }
    isExpanded = !isExpanded;
}
let _cleanup = null;
function setup() {
    // Setup: attach listeners, start loops, etc.
    const onClick = (e) => { };
    document.getElementById('miBoton')?.addEventListener('click', onClick);
    const rafId = requestAnimationFrame(function loop() {
        // tu bucle o render
        requestAnimationFrame(loop);
    });
    // devolver función de limpieza
    return () => {
        document.getElementById('miBoton')?.removeEventListener('click', onClick);
        cancelAnimationFrame(rafId);
    };
}
function init() {
    if (_cleanup) {
        _cleanup();
        _cleanup = null;
    }
    _cleanup = setup();
}
document.addEventListener('DOMContentLoaded', init);
window.addEventListener('pageshow', (e) => {
    // si la página viene de bfcache, e.persisted === true
    // pero es seguro llamar siempre a init()
    init();
});
window.addEventListener('popstate', init); // opcional si usas history.pushState

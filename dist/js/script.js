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
        window.location.href = 'game.html';
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
        window.location.href = 'game.html';
    }
});
playButton.addEventListener('touchstart', () => {
    if (!isTrans) {
        isTrans = true;
        window.location.href = 'game.html';
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

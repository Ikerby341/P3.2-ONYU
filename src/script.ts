let isExpanded = false;
let isAnimating = false;
let isTrans = false;
let isOnuButtonHovered = false;
let isPlayButtonHovered = false;

const bOnuEl = document.getElementById('onu-button');
const playButtonEl = document.getElementById('play-button');
let optionsButtonEl = document.getElementById('options');

if (!bOnuEl) throw new Error('Element with id "onu-button" not found in DOM');
if (!playButtonEl) throw new Error('Element with id "play-button" not found in DOM');

const bOnu = bOnuEl as HTMLButtonElement;
const playButton = playButtonEl as HTMLButtonElement;

let optionsButton: HTMLButtonElement;
if (!optionsButtonEl) {
    const fallback = document.createElement('button');
    fallback.id = 'options';
    fallback.textContent = 'Options';
    fallback.style.display = 'none';
    const menuContainer = document.getElementById('menu') || document.body;
    menuContainer.appendChild(fallback);
    optionsButton = fallback;
} else {
    optionsButton = optionsButtonEl as HTMLButtonElement;
}

bOnu.style.userSelect = 'none';
bOnu.style.outline = 'none';
(bOnu.style as any)['WebkitTapHighlightColor'] = 'transparent';
playButton.style.userSelect = 'none';
playButton.style.outline = 'none';
(playButton.style as any)['WebkitTapHighlightColor'] = 'transparent';
optionsButton.style.userSelect = 'none';
optionsButton.style.outline = 'none';
(optionsButton.style as any)['WebkitTapHighlightColor'] = 'transparent';


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

function verifyKey(this: HTMLButtonElement, event: KeyboardEvent) {
    if ((event.key === 'Enter' || event.key === ' ') && isOnuButtonHovered) {
        event.preventDefault();
        transformButtonOnu.call(this);
    }
}

function transformButtonOnu(this: HTMLButtonElement) {
    if (isAnimating) return;
    isAnimating = true;
    if (!isExpanded) {
        this.style.transform = 'translateX(-200px)';
        playButton.style.display = 'block';
        optionsButton.style.display = 'block';
        setTimeout(() => {
            playButton.style.opacity = '1';
            playButton.style.transform = 'translate(-50%, -50%) scale(1)';
            optionsButton.style.opacity = '1';
            optionsButton.style.transform = 'translate(-50%, -50%) scale(1)';
            setTimeout(() => {
                isAnimating = false;
            }, 500);
        }, 10);
    } else {
        this.style.transform = 'translateX(0)';
        playButton.style.opacity = '0';
        playButton.style.transform = 'translate(-50%, -50%) scale(0)';
        optionsButton.style.opacity = '0';
        optionsButton.style.transform = 'translate(-50%, -50%) scale(0)';
        setTimeout(() => {
            playButton.style.display = 'none';
            optionsButton.style.display = 'none';
            isAnimating = false;
        }, 500);
    }
    isExpanded = !isExpanded;
}

let _cleanup: (() => void) | null = null;

function setup(): () => void {
  // Setup: attach listeners, start loops, etc.
  const onClick = (e: Event) => { /* ... */ };
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
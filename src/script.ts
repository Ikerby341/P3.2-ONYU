let isExpanded = false;
let isAnimating = false;
let isTrans = false;
let isOnuButtonHovered = false;
let isPlayButtonHovered = false;

const bOnuEl = document.getElementById('onu-button');
const playButtonEl = document.getElementById('play-button');
const optionsButtonEl = document.getElementById('options');

if (!bOnuEl) throw new Error('Element with id "onu-button" not found in DOM');
if (!playButtonEl) throw new Error('Element with id "play-button" not found in DOM');

const bOnu = bOnuEl as HTMLButtonElement;
const playButton = playButtonEl as HTMLButtonElement;

const optionsButton = optionsButtonEl as HTMLButtonElement;

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
optionsButton.addEventListener('mousedown', openOptionsMenu);
optionsButton.addEventListener('touchstart', openOptionsMenu);
optionsButton.addEventListener('mouseenter', () => {
    isoptionsButtonHovered = true;
});
optionsButton.addEventListener('mouseleave', () => {
    isoptionsButtonHovered = false;
});
document.addEventListener('keydown', (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && isPlayButtonHovered) {
        e.preventDefault();
        window.location.href = 'menu.html';
    }
    else if ((e.key === 'Enter' || e.key === ' ') && isoptionsButtonHovered) {
        e.preventDefault();
        openOptionsMenu();
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
let isoptionsButtonHovered = false;
// Abrir menú de opciones desde el menú principal

function loadSettings() {
    try {
        const raw = localStorage.getItem('osu_settings');
        if (!raw) return { volume: 1, key: 'k' };
        const s = JSON.parse(raw);
        return { volume: typeof s.volume === 'number' ? s.volume : 1, key: typeof s.key === 'string' ? s.key : 'k' };
    } catch (err) {
        return { volume: 1, key: 'k' };
    }
}

function saveSettings(volume: number, key: string) {
    const s = { volume: Math.max(0, Math.min(1, volume)), key };
    localStorage.setItem('osu_settings', JSON.stringify(s));
}

function openOptionsMenu() {
    const settings = loadSettings();

    const overlay = document.createElement('div');
    overlay.className = 'pause-overlay';

    const box = document.createElement('div');
    box.className = 'pause-box';

    const title = document.createElement('div');
    title.className = 'pause-title';
    title.textContent = 'OPCIONES';
    box.appendChild(title);

    // Volume
    const label = document.createElement('div');
    label.textContent = 'Volumen';
    label.className = 'volume-label';
    box.appendChild(label);

    const slider = document.createElement('input') as HTMLInputElement;
    slider.type = 'range';
    slider.min = '0';
    slider.max = '100';
    slider.value = String(Math.round(settings.volume * 100));
    slider.className = 'volume-slider';
    box.appendChild(slider);

    const volumePercent = document.createElement('div');
    volumePercent.className = 'volume-percent';
    volumePercent.textContent = `${Math.round(settings.volume * 100)}%`;
    box.appendChild(volumePercent);

    slider.addEventListener('input', (e) => {
        const val = parseFloat((e.target as HTMLInputElement).value);
        volumePercent.textContent = `${Math.round(val)}%`;
        saveSettings(val / 100, loadSettings().key);
    });

    // Key input
    const sep = document.createElement('div');
    sep.style.height = '1px';
    sep.style.backgroundColor = '#666';
    sep.style.margin = '20px 0';
    box.appendChild(sep);

    const keyLabel = document.createElement('div');
    keyLabel.className = 'volume-label';
    keyLabel.textContent = 'Tecla para clicar círculos';
    box.appendChild(keyLabel);

    const keyInput = document.createElement('input') as HTMLInputElement;
    keyInput.type = 'text';
    keyInput.maxLength = 1;
    keyInput.value = settings.key.toUpperCase();
    keyInput.className = 'key-input';
    keyInput.style.padding = '8px';
    keyInput.style.fontSize = '16px';
    keyInput.style.textAlign = 'center';
    keyInput.style.width = '100%';
    keyInput.style.boxSizing = 'border-box';
    keyInput.style.marginBottom = '10px';
    box.appendChild(keyInput);

    keyInput.addEventListener('keydown', (e) => {
        e.preventDefault();
        const key = (e.key || '').toLowerCase();
        if (key.length === 1 || ['enter', ' ', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'shift', 'control', 'alt'].includes(key)) {
            const mapped = key === 'enter' ? 'enter' : key === ' ' ? ' ' : key;
            keyInput.value = mapped === 'enter' ? 'ENTER' : mapped === ' ' ? 'SPACE' : mapped.toUpperCase();
            saveSettings(loadSettings().volume, mapped);
        }
    });

    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Cerrar';
    closeBtn.className = 'pause-button';
    closeBtn.addEventListener('mousedown', () => overlay.remove());
    box.appendChild(closeBtn);

    overlay.appendChild(box);
    document.body.appendChild(overlay);
}

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
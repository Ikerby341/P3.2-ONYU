"use strict";
document.addEventListener('DOMContentLoaded', prepareGame);
const audio = document.createElement('audio');
const startButton = document.createElement('button');
let spawnIntervalId = null;
let hoveredButton2 = null;
let isInCircle = false; // Para evitar múltiples clicks en el mismo círculo
let keyClickCircle = 'k'; // Tecla para clicar círculos (además de click/touch)
let activeCircle = null;
function prepareGame() {
    const urlParams = new URLSearchParams(window.location.search);
    const song = urlParams.get('song');
    const diff = urlParams.get('diff') || 'Easy';
    if (song) {
        // Evitar barras de desplazamiento y asegurar layout de toda la ventana
        document.documentElement.style.height = '100%';
        document.documentElement.style.overflow = 'hidden';
        document.body.style.margin = '0';
        document.body.style.height = '100%';
        document.body.style.overflow = 'hidden';
        const audioPath = `song/${song}.mp3`;
        audio.src = audioPath;
        audio.id = 'game-audio';
        audio.className = 'hidden-audio';
        document.body.appendChild(audio);
        // Crear contenedor del área del juego para evitar que los círculos se corten
        const gameArea = document.createElement('div');
        gameArea.id = 'game-area';
        gameArea.className = 'game-area';
        document.body.appendChild(gameArea);
        // Crear botón Start y situarlo centrado en el área de juego
        startButton.textContent = 'Start';
        startButton.id = 'start-button';
        startButton.className = 'start-button';
        startButton.addEventListener('mousedown', () => començar(diff, gameArea));
        startButton.addEventListener('touchstart', () => començar(diff, gameArea));
        startButton.addEventListener('mouseenter', () => {
            hoveredButton2 = startButton;
        });
        startButton.addEventListener('mouseleave', () => {
            if (hoveredButton2 === startButton) {
                hoveredButton2 = null;
            }
        });
        document.addEventListener('keydown', (e) => {
            if ((e.key === 'Enter' || e.key === ' ') && hoveredButton2 === startButton) {
                e.preventDefault();
                començar(diff, gameArea);
            }
        });
        gameArea.appendChild(startButton);
    }
    else {
        console.error('No song specified');
    }
}
function començar(diff, gameArea) {
    audio.play().catch(err => console.warn('Audio play prevented:', err));
    startButton.style.display = 'none';
    const intervalMs = diff === 'Medium' ? 750 : diff === 'Difficult' ? 500 : 1000;
    const diameter = 120; // px
    const approachScale = 3;
    const approachDuration = intervalMs;
    let contador = 1;
    let zIndexCounter = 1;
    let totalScore = 0;
    let isPaused = false;
    // HUD: puntuación + barra de progreso
    const hud = document.createElement('div');
    hud.className = 'hud';
    const scoreEl = document.createElement('div');
    scoreEl.textContent = 'Score: 0';
    scoreEl.className = 'score';
    const progressWrap = document.createElement('div');
    progressWrap.className = 'progress-wrap';
    const progressFill = document.createElement('div');
    progressFill.className = 'progress-fill';
    progressWrap.appendChild(progressFill);
    hud.appendChild(scoreEl);
    hud.appendChild(progressWrap);
    document.body.appendChild(hud);
    function updateScoreDisplay() {
        scoreEl.textContent = `Puntuación: ${totalScore}`;
    }
    function updateProgress() {
        if (!audio.duration || isNaN(audio.duration) || audio.duration === Infinity)
            return;
        const pct = Math.min(1, Math.max(0, audio.currentTime / audio.duration));
        progressFill.style.width = `${pct * 100}%`;
    }
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', updateProgress);
    // Crear botón de pausa en la esquina superior derecha
    const pauseBtn = document.createElement('button');
    pauseBtn.textContent = 'Pausar';
    pauseBtn.className = 'pause-button-hud';
    pauseBtn.addEventListener('mousedown', () => {
        if (!isPaused && !audio.ended) {
            isPaused = true;
            audio.pause();
            if (spawnIntervalId !== null) {
                clearInterval(spawnIntervalId);
                spawnIntervalId = null;
            }
            const { pauseOverlay } = createPauseMenu();
            gameArea.appendChild(pauseOverlay);
        }
    });
    pauseBtn.addEventListener('touchstart', () => {
        if (!isPaused && !audio.ended) {
            isPaused = true;
            audio.pause();
            if (spawnIntervalId !== null) {
                clearInterval(spawnIntervalId);
                spawnIntervalId = null;
            }
            const { pauseOverlay } = createPauseMenu();
            gameArea.appendChild(pauseOverlay);
        }
    });
    document.body.appendChild(pauseBtn);
    // Listener global para tecla K
    const handleKeyPress = (e) => {
        if ((e.key === keyClickCircle || e.key === keyClickCircle.toUpperCase()) && activeCircle) {
            e.preventDefault();
            activeCircle(e);
        }
    };
    document.addEventListener('keydown', handleKeyPress);
    function spawnCircle() {
        const rect = gameArea.getBoundingClientRect();
        const maxLeft = Math.max(0, rect.width - diameter);
        const maxTop = Math.max(0, rect.height - diameter);
        const minTop = 60;
        const left = Math.random() * maxLeft;
        const top = minTop + Math.random() * (maxTop - minTop);
        // Crear círculo objetivo (hit)
        const circle = document.createElement('div');
        circle.className = 'spawn-circle';
        circle.textContent = contador.toString();
        circle.style.left = `${left}px`;
        circle.style.top = `${top}px`;
        circle.style.width = `${diameter}px`;
        circle.style.height = `${diameter}px`;
        circle.style.zIndex = (zIndexCounter + 1).toString();
        // Crear círculo de acercamiento (círculo más grande que se contrae)
        const approach = document.createElement('div');
        approach.className = 'approach-circle';
        const approachSize = diameter * approachScale;
        // posicionar para que el approach esté centrado sobre el círculo objetivo
        const approachLeft = left - (approachSize - diameter) / 2;
        const approachTop = top - (approachSize - diameter) / 2;
        approach.className = 'approach-circle';
        approach.style.left = `${approachLeft}px`;
        approach.style.top = `${approachTop}px`;
        approach.style.width = `${approachSize}px`;
        approach.style.height = `${approachSize}px`;
        approach.style.transform = `scale(1)`;
        approach.style.transformOrigin = 'center';
        approach.style.transition = `transform ${approachDuration}ms linear`;
        approach.style.zIndex = zIndexCounter.toString();
        // Añadir el approach debajo del círculo objetivo
        gameArea.appendChild(approach);
        gameArea.appendChild(circle);
        const spawnTime = performance.now();
        let clicked = false;
        let mouseInCircle = false; // Variable local para este círculo específico
        function showFloatingText(text, color = 'white') {
            const t = document.createElement('div');
            t.textContent = text;
            t.className = 'floating-text';
            t.style.left = `${left + diameter / 2}px`;
            t.style.top = `${top - 10}px`;
            t.style.color = color;
            t.style.zIndex = (zIndexCounter + 100).toString();
            gameArea.appendChild(t);
            setTimeout(() => {
                t.classList.add('hide');
            }, 50);
            setTimeout(() => t.remove(), 850);
        }
        function handleHit(score) {
            if (clicked)
                return;
            clicked = true;
            if (score > 0) {
                showFloatingText(`+${score}`, score === 100 ? '#ffd700' : '#ffffff');
                totalScore += score;
                updateScoreDisplay();
            }
            else {
                // show red X
                showFloatingText('X', '#ff4d4d');
            }
            circle.remove();
            approach.remove();
        }
        circle.addEventListener('mousedown', (e) => {
            handleTouchStart(e);
        });
        circle.addEventListener('touchstart', (e) => {
            handleTouchStart(e);
        });
        circle.addEventListener('mouseenter', () => {
            mouseInCircle = true;
            activeCircle = handleTouchStart;
        });
        circle.addEventListener('mouseleave', () => {
            mouseInCircle = false;
            if (activeCircle === handleTouchStart) {
                activeCircle = null;
            }
        });
        function handleTouchStart(e) {
            e.stopPropagation();
            const now = performance.now();
            const elapsed = now - spawnTime;
            const fraction = Math.min(1, elapsed / approachDuration);
            // fraction == 1 significa que el approach llegó al círculo (perfecto)
            let score = 0;
            if (fraction >= 0.95)
                score = 100;
            else if (fraction >= 0.5)
                score = 50;
            else if (fraction >= 0.25)
                score = 25;
            else
                score = 0;
            handleHit(score);
        }
        // Iniciar la contracción del approach en el siguiente frame (de approachSize a diameter)
        // Añadir pequeño retraso para asegurar renderizado en dificultad baja
        setTimeout(() => {
            requestAnimationFrame(() => {
                approach.style.transform = `scale(${1 / approachScale})`;
            });
        }, 10);
        // Si el approach termina y no se ha clicado -> fallo
        const missTimeout = window.setTimeout(() => {
            if (!clicked) {
                // show red X and remove
                showFloatingText('X', '#ff4d4d');
                circle.remove();
                approach.remove();
            }
        }, approachDuration + 50);
        contador++;
        zIndexCounter += 2;
    }
    // Guardar intervalo original de spawn para pausa/reanudar
    const originalSpawnInterval = intervalMs;
    // Generar uno inmediatamente y luego a intervalos
    spawnCircle();
    spawnIntervalId = window.setInterval(() => {
        // Do not spawn after audio ended
        if (audio.ended)
            return;
        spawnCircle();
    }, intervalMs);
    function endGame() {
        // parar spawn
        if (spawnIntervalId !== null) {
            clearInterval(spawnIntervalId);
            spawnIntervalId = null;
        }
        // eliminar círculos/approaches/textos flotantes restantes
        const leftovers = gameArea.querySelectorAll('.spawn-circle, .approach-circle');
        leftovers.forEach(n => n.remove());
        // mostrar overlay de puntuación final
        const overlay = document.createElement('div');
        overlay.className = 'end-overlay';
        overlay.textContent = `Puntuación: ${totalScore}`;
        document.body.appendChild(overlay);
        // detener actualizaciones de progreso
        audio.removeEventListener('timeupdate', updateProgress);
    }
    audio.addEventListener('ended', endGame);
    // Menú de pausa
    function createPauseMenu() {
        const pauseOverlay = document.createElement('div');
        pauseOverlay.className = 'pause-overlay';
        const pauseBox = document.createElement('div');
        pauseBox.className = 'pause-box';
        const title = document.createElement('div');
        title.textContent = 'PAUSADO';
        title.className = 'pause-title';
        pauseBox.appendChild(title);
        function createButton(text, callback) {
            const btn = document.createElement('button');
            btn.textContent = text;
            btn.className = 'pause-button';
            btn.addEventListener('mousedown', callback);
            return btn;
        }
        // Botón Reanudar
        pauseBox.appendChild(createButton('Reanudar', () => {
            isPaused = false;
            audio.play();
            if (spawnIntervalId !== null) {
                clearInterval(spawnIntervalId);
            }
            spawnIntervalId = window.setInterval(() => {
                if (audio.ended)
                    return;
                spawnCircle();
            }, originalSpawnInterval);
            pauseOverlay.remove();
        }));
        // Settings button
        pauseBox.appendChild(createButton('Ajustes', () => {
            showVolumeSettings(pauseBox);
        }));
        // Restart button
        pauseBox.appendChild(createButton('Reiniciar', () => {
            window.location.reload();
        }));
        // Exit button
        pauseBox.appendChild(createButton('Salir', () => {
            window.location.href = 'menu.html';
        }));
        pauseOverlay.appendChild(pauseBox);
        return { pauseOverlay, pauseBox };
    }
    function showVolumeSettings(pauseBox) {
        // Vaciar pauseBox y mostrar ajustes
        pauseBox.innerHTML = '';
        const backBtn = document.createElement('button');
        backBtn.textContent = '← Atrás';
        backBtn.className = 'back-button';
        pauseBox.appendChild(backBtn);
        const label = document.createElement('div');
        label.textContent = 'Volumen';
        label.className = 'volume-label';
        pauseBox.appendChild(label);
        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = '0';
        slider.max = '100';
        slider.value = (audio.volume * 100).toString();
        slider.className = 'volume-slider';
        slider.addEventListener('input', (e) => {
            const val = parseFloat(e.target.value);
            audio.volume = val / 100;
        });
        pauseBox.appendChild(slider);
        const volumePercent = document.createElement('div');
        volumePercent.textContent = `${Math.round(audio.volume * 100)}%`;
        volumePercent.className = 'volume-percent';
        pauseBox.appendChild(volumePercent);
        slider.addEventListener('input', () => {
            volumePercent.textContent = `${Math.round(audio.volume * 100)}%`;
        });
        // Separador
        const separator = document.createElement('div');
        separator.style.height = '1px';
        separator.style.backgroundColor = '#666';
        separator.style.margin = '20px 0';
        pauseBox.appendChild(separator);
        // Label para tecla de click
        const keyLabel = document.createElement('div');
        keyLabel.textContent = 'Tecla para clicar círculos';
        keyLabel.className = 'volume-label';
        pauseBox.appendChild(keyLabel);
        // Input para cambiar la tecla
        const keyInput = document.createElement('input');
        keyInput.type = 'text';
        keyInput.maxLength = 1;
        keyInput.value = keyClickCircle.toUpperCase();
        keyInput.className = 'key-input';
        keyInput.style.padding = '8px';
        keyInput.style.fontSize = '16px';
        keyInput.style.textAlign = 'center';
        keyInput.style.width = '100%';
        keyInput.style.boxSizing = 'border-box';
        keyInput.style.marginBottom = '10px';
        keyInput.addEventListener('keydown', (e) => {
            e.preventDefault();
            const key = e.key.toLowerCase();
            if (key.length === 1 || ['enter', ' ', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'shift', 'control', 'alt'].includes(key)) {
                keyClickCircle = key === 'enter' ? 'enter' : key === ' ' ? ' ' : key;
                keyInput.value = key === 'enter' ? 'ENTER' : key === ' ' ? 'SPACE' : key.toUpperCase();
            }
        });
        pauseBox.appendChild(keyInput);
        backBtn.addEventListener('mousedown', () => {
            pauseBox.innerHTML = '';
            const title = document.createElement('div');
            title.textContent = 'PAUSADO';
            title.className = 'pause-title';
            pauseBox.appendChild(title);
            function createButton(text, callback) {
                const btn = document.createElement('button');
                btn.textContent = text;
                btn.className = 'pause-button';
                btn.addEventListener('mousedown', callback);
                return btn;
            }
            pauseBox.appendChild(createButton('Reanudar', () => {
                isPaused = false;
                audio.play();
                if (spawnIntervalId !== null) {
                    clearInterval(spawnIntervalId);
                }
                spawnIntervalId = window.setInterval(() => {
                    if (audio.ended)
                        return;
                    spawnCircle();
                }, originalSpawnInterval);
                pauseBox.parentElement.remove();
            }));
            pauseBox.appendChild(createButton('Ajustes', () => {
                showVolumeSettings(pauseBox);
            }));
            pauseBox.appendChild(createButton('Reiniciar', () => {
                window.location.reload();
            }));
            pauseBox.appendChild(createButton('Salir', () => {
                window.location.href = 'menu.html';
            }));
        });
    }
    // Tecla ESC para pausar
    document.addEventListener('keydown', togglePause);
    function togglePause(e) {
        if (e.key === 'Escape' && !isPaused && !audio.ended) {
            e.preventDefault();
            isPaused = true;
            audio.pause();
            // Parar generación de círculos
            if (spawnIntervalId !== null) {
                clearInterval(spawnIntervalId);
                spawnIntervalId = null;
            }
            const { pauseOverlay } = createPauseMenu();
            gameArea.appendChild(pauseOverlay);
        }
    }
}

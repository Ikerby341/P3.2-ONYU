const songs: string[] = [
    'Shiawase',
    'Inferno by Mrs.GREEN APPLE',
    'Bokurano by EVE'
];

let selectedSong: string | null = null;
let isTransitioning = false;
let hoveredButton: HTMLButtonElement | null = null;

document.addEventListener('DOMContentLoaded', () => {
    const container = document.body;

    songs.forEach((song, index) => {
        const songButton = document.createElement('button');
        songButton.textContent = song;
        songButton.className = 'song-button';
        songButton.dataset.index = index.toString();
        songButton.style.userSelect = 'none';
        songButton.style.outline = 'none';
        (songButton.style as any)['WebkitTapHighlightColor'] = 'transparent';
        songButton.addEventListener('mousedown', () => selectSong(song, songButton));
        songButton.addEventListener('touch', () => selectSong(song, songButton));
        songButton.addEventListener('mouseenter', () => {
            hoveredButton = songButton;
        });
        songButton.addEventListener('mouseleave', () => {
            if (hoveredButton === songButton) {
                hoveredButton = null;
            }
        });
        document.addEventListener('keydown', (e) => {
            if ((e.key === 'Enter' || e.key === ' ') && hoveredButton === songButton) {
                e.preventDefault();
                selectSong(song, songButton);
            }
        });
        container.appendChild(songButton);

        const difficulties = ['Easy', 'Medium', 'Difficult'];
        difficulties.forEach((diff, diffIndex) => {
            const diffButton = document.createElement('button');
            diffButton.textContent = diff;
            diffButton.className = 'difficulty-button';
            diffButton.dataset.songIndex = index.toString();
            diffButton.style.userSelect = 'none';
            diffButton.style.outline = 'none';
            (diffButton.style as any)['WebkitTapHighlightColor'] = 'transparent';
            diffButton.style.display = 'none';
            diffButton.style.opacity = '0';
            diffButton.style.transform = 'translateY(-20px)';
            diffButton.addEventListener('mousedown', () => {
                if (!isTransitioning) {
                    isTransitioning = true;
                    window.location.href = `ingame.html?song=${encodeURIComponent(song)}&diff=${encodeURIComponent(diff)}`;
                }
            });
            diffButton.addEventListener('touch', () => {
                if (!isTransitioning) {
                    isTransitioning = true;
                    window.location.href = `ingame.html?song=${encodeURIComponent(song)}&diff=${encodeURIComponent(diff)}`;
                }
            });
            diffButton.addEventListener('mouseenter', () => {
                hoveredButton = diffButton;
            });
            diffButton.addEventListener('mouseleave', () => {
                if (hoveredButton === diffButton) {
                    hoveredButton = null;
                }
            });
            document.addEventListener('keydown', (e) => {
                if ((e.key === 'Enter' || e.key === ' ') && hoveredButton === diffButton) {
                    e.preventDefault();
                    window.location.href = `ingame.html?song=${encodeURIComponent(song)}&diff=${encodeURIComponent(diff)}`;
                }
            });
            container.appendChild(diffButton);
        });
    });

    // Crear botón de volver
    const backButton = document.createElement('button');
    backButton.textContent = 'Volver';
    backButton.className = 'back-button';
    backButton.style.userSelect = 'none';
    backButton.style.outline = 'none';
    (backButton.style as any)['WebkitTapHighlightColor'] = 'transparent';
    backButton.addEventListener('mousedown', () => {
        if (!isTransitioning) {
            isTransitioning = true;
            window.location.href = 'index.html';
        }
    });
    backButton.addEventListener('touch', () => {
        if (!isTransitioning) {
            isTransitioning = true;
            window.location.href = 'index.html';
        }
    });
    backButton.addEventListener('mouseenter', () => {
        hoveredButton = backButton;
    });
    backButton.addEventListener('mouseleave', () => {
        if (hoveredButton === backButton) {
            hoveredButton = null;
        }
    });
    document.addEventListener('keydown', (e) => {
        if ((e.key === 'Enter' || e.key === ' ') && hoveredButton === backButton) {
            e.preventDefault();
            if (!isTransitioning) {
                isTransitioning = true;
                window.location.href = 'index.html';
            }
        }
    });
    container.appendChild(backButton);

    updatePositions();
});

// Si la página se restaura desde bfcache al usar atrás/adelante,
// restaurar el estado necesario para que los botones respondan.
window.addEventListener('pageshow', (e) => {
    // siempre resetear la transición para permitir nuevas navegaciones
    isTransitioning = false;
    // limpiar hover por si quedó apuntando a un botón ya no válido
    hoveredButton = null;
    // opcional: resetear selección
    selectedSong = null;
    updatePositions();
});

window.addEventListener('popstate', () => {
    isTransitioning = false;
    hoveredButton = null;
    selectedSong = null;
    updatePositions();
});

function selectSong(song: string, button: HTMLButtonElement) {
    const songIndex = parseInt(button.dataset.index!);

    if (selectedSong === song) {
        selectedSong = null;
    } else {
        selectedSong = song;
    }

    updatePositions();
}

function updatePositions() {
    const songButtons = document.querySelectorAll('.song-button') as NodeListOf<HTMLButtonElement>;
    const diffButtons = document.querySelectorAll('.difficulty-button') as NodeListOf<HTMLButtonElement>;

    let currentTop = 20;

    songs.forEach((song, index) => {
        const songButton = songButtons[index];
        songButton.style.top = `${currentTop}px`;
        currentTop += 140;

        if (selectedSong === song) {
            const difficulties = ['Easy', 'Medium', 'Difficult'];
            difficulties.forEach((diff, diffIndex) => {
                const diffButton = Array.from(diffButtons).find(btn => btn.dataset.songIndex === index.toString() && btn.textContent === diff)!;
                diffButton.style.top = `${currentTop}px`;
                diffButton.style.display = 'block';
                setTimeout(() => {
                    diffButton.style.opacity = '1';
                    diffButton.style.transform = 'translateY(0)';
                }, diffIndex * 100);
                currentTop += 50;
            });
        } else {
            const songDiffButtons = Array.from(diffButtons).filter(btn => btn.dataset.songIndex === index.toString());
            songDiffButtons.forEach(btn => {
                btn.style.display = 'none';
                btn.style.opacity = '0';
                btn.style.transform = 'translateY(-20px)';
            });
        }
    });
}

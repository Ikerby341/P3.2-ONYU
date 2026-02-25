# Joc Rítmic OSU! - P3.2

## 📋 Descripció

Aquesta aplicació està inspirada en el videojoc **OSU!**. Es tracta d'un joc rítmic on has d'escollit una cançó i una dificultat per jugar, i després clicar a les boletes seguint el ritme de la música.

## 🎮 Característiques

- ✅ Menú principal amb selecció de cançons
- ✅ Selector de dificultats (Easy, Medium, Difficult)
- ✅ Sistema de puntuació basat en la precisió del clic
- ✅ Menú de pausa amb botó visible en pantalla
- ✅ Ajustes de volum i canvi de tecla de clic
- ✅ Compatibilitat total amb tàctil (móbil)
- ✅ Controls per teclat, ratón i touch

## 🕹️ Com Jugar

1. Selecciona una cançó del menú principal
2. Tria una dificultat
3. Clica el botó "Start" per iniciar el joc
4. **Clica** les boletes quan el cercle de aproximació es trobi al seu punt més just:
   - **100 punts**: Clic perfecte (>95% del temporizador)
   - **50 punts**: Clic bon (≥50% del temporizador)
   - **25 punts**: Clic acceptable (≥25% del temporizador)
   - **0 punts**: Clic massa ràpid (<25% del temporizador)

5. Pausa el joc en qualsevol moment amb **ESC** o el botó "Pausar"

## ⌨️ Gestió d'Events

### script.ts - Menú Principal
- **Teclat (16-24)**: [script.ts#L16-L24](src/script.ts#L16-L24) - Events de mousedown, touchstart, mouseenter, mouseleave i keydown dels botons
- **Ratón (16-50)**: [script.ts#L16-L50](src/script.ts#L16-L50) - Clicks i hovers en els botons OÑU! i Play

### menuScript.ts - Selector de Cançons
- **Teclat (32-39)**: [menuScript.ts#L32-L39](src/menuScript.ts#L32-L39) - Listeners de keydown per validar Enter/Space
- **Ratón (22-28)**: [menuScript.ts#L22-L28](src/menuScript.ts#L22-L28) - Clicks i hovers en botons de cançons
- **Touch (23, 58-61)**: [menuScript.ts#L23,L58-L61](src/menuScript.ts#L23) - Events de touchstart i touch
- **Botó Volver (89-114)**: [menuScript.ts#L89-L114](src/menuScript.ts#L89-L114) - Events per al botó inferior esquerra

### inGameScript.ts - Joc Principal
- **Teclat (41-51, 107-162)**: [inGameScript.ts#L41-L51](src/inGameScript.ts#L41-L51) - Start button i keydown global
- **Botó Pausa (107-131)**: [inGameScript.ts#L107-L131](src/inGameScript.ts#L107-L131) - Listeners mousedown i touchstart per pausar
- **Cercles de Joc (214-224)**: [inGameScript.ts#L214-L224](src/inGameScript.ts#L214-L224) - Events mousedown, touchstart, mouseenter, mouseleave
- **Clics de Cercles amb Teclat (140)**: [inGameScript.ts#L140](src/inGameScript.ts#L140) - Listener global keydown per a la tecla configurada
- **Ajustes (409-417)**: [inGameScript.ts#L409-L417](src/inGameScript.ts#L409-L417) - Input de tecla amb keydown para a capturar tecles especials
- **Pausa ESC (459)**: [inGameScript.ts#L459](src/inGameScript.ts#L459) - Toggle de pausa amb tecla Escape

## 🎯 Controles

| Acció | Teclat | Ratón | Tàctil |
|-------|--------|-------|--------|
| Clicar botó | Enter / Space | Click | Tap |
| Clicar cercle | K (personalitzable) | Click | Tap |
| Pausar | ESC | Botó "Pausar" | Botó "Pausar" |
| Navegar menú | Enter / Space | Click | Tap |

## 🎵 Cançons Disponibles

- Shiawase
- Inferno by Mrs.GREEN APPLE
- Bokurano by EVE

## 👨‍💻 Desenvolupadors

**Iker Novo i Anghelo Pardo** - Projecte P3.2 DAW2
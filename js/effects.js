// Visual Effects
// ==============
// Functions for visual effects like glitch and matrix

// Glitch effect for welcome ASCII art
export function randomGlitch() {
    console.log('🎨 randomGlitch() called');
    const asciiArt = document.querySelector('.ascii-art');
    console.log('🎯 Found ASCII art element:', asciiArt);

    if (!asciiArt) {
        console.log('❌ No .ascii-art element found!');
        return;
    }

    console.log('✅ Starting glitch loop');

    function checkGlitch() {
        if (Math.random() < 0.95) {
            console.log('⚡ Triggering glitch!');
            asciiArt.classList.add('glitch');
            asciiArt.setAttribute('data-text', asciiArt.textContent);

            const glitchDuration = Math.floor(Math.random() * 1700) + 800;
            setTimeout(() => {
                asciiArt.classList.remove('glitch');
                console.log('✅ Glitch removed');
            }, glitchDuration);
        }

        const nextCheck = Math.floor(Math.random() * 5500) + 500;
        setTimeout(checkGlitch, nextCheck);
    }

    checkGlitch();
}

// Matrix digital rain effect
export function createMatrixEffect() {
    console.log('🎬 Matrix effect started!');

    // ============================================
    // CONFIGURATION - Change these to test different styles!
    // ============================================
    const config = {
        scope: 'fullpage',        // 'fullpage' or 'terminal'
        background: 'dim',        // 'hide', 'dim', or 'visible'
        duration: 10000,          // milliseconds (10 seconds)
        backgroundOpacity: 0.4    // 0.0 = fully transparent, 1.0 = solid black
    };
    console.log('⚙️ Config:', config);
    // ============================================

    // Create overlay container
    const overlay = document.createElement('div');
    console.log('📦 Overlay created:', overlay);
    overlay.id = 'matrix-overlay';
    overlay.style.position = 'fixed';
    overlay.style.zIndex = '1000';
    overlay.style.backgroundColor = `rgba(0, 0, 0, ${config.backgroundOpacity})`;
    overlay.style.opacity = '1';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';

    // Apply CRT effects to overlay
    overlay.className = 'crt-scanlines crt-flicker crt-colorsep';

    // Set scope (fullpage or terminal-only)
    const terminalElement = document.querySelector('.crt-screen');
    if (config.scope === 'fullpage') {
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100vw';
        overlay.style.height = '100vh';
    } else {
        // Terminal-only scope
        const rect = terminalElement.getBoundingClientRect();
        overlay.style.top = rect.top + 'px';
        overlay.style.left = rect.left + 'px';
        overlay.style.width = rect.width + 'px';
        overlay.style.height = rect.height + 'px';
        overlay.style.borderRadius = '8px';
    }

    // Set background visibility (what happens to content behind)
    if (config.background === 'hide') {
        terminalElement.style.opacity = '0';
    } else if (config.background === 'dim') {
        terminalElement.style.opacity = '0.3';
    } else {
        terminalElement.style.opacity = '1';
    }

    // Create canvas for Matrix effect
    const canvas = document.createElement('canvas');
    canvas.style.display = 'block';
    canvas.style.position = 'relative';
    canvas.style.zIndex = '1001';

    // Add canvas to overlay and overlay to page FIRST (before reading dimensions)
    overlay.appendChild(canvas);
    document.body.appendChild(overlay);
    console.log('✅ Overlay appended to body');

    // Force a reflow to ensure dimensions are calculated
    overlay.offsetHeight;

    // NOW read the actual rendered dimensions
    const overlayWidth = overlay.offsetWidth || window.innerWidth;
    const overlayHeight = overlay.offsetHeight || window.innerHeight;

    canvas.width = overlayWidth;
    canvas.height = overlayHeight;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    console.log('📐 Canvas dimensions:', canvas.width, 'x', canvas.height);
    console.log('📐 Overlay dimensions:', overlayWidth, 'x', overlayHeight);
    console.log('📐 Window dimensions:', window.innerWidth, 'x', window.innerHeight);

    // Safety check
    if (canvas.width === 0 || canvas.height === 0) {
        console.error('❌ Canvas has zero dimensions! Aborting.');
        terminalElement.style.opacity = '1';
        if (overlay.parentNode) {
            overlay.parentNode.removeChild(overlay);
        }
        return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error('❌ Could not get canvas context! Aborting.');
        terminalElement.style.opacity = '1';
        if (overlay.parentNode) {
            overlay.parentNode.removeChild(overlay);
        }
        return;
    }

    // Matrix characters - katakana, numbers, symbols
    const matrixChars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789:・."=*+-<>¦|';
    const chars = matrixChars.split('');

    const fontSize = 16;
    const columns = Math.floor(canvas.width / fontSize);

    // Array to track drop position for each column
    const drops = [];
    for (let x = 0; x < columns; x++) {
        drops[x] = Math.floor(Math.random() * -100);
    }

    // Draw function for animation
    function draw() {
        // Semi-transparent black to create trail effect
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.font = fontSize + 'px monospace';

        // Draw characters for each column
        for (let i = 0; i < drops.length; i++) {
            // Random character
            const text = chars[Math.floor(Math.random() * chars.length)];
            const x = i * fontSize;
            const y = drops[i] * fontSize;

            // Draw with chromatic aberration effect (RGB split like terminal prompt)
            // Magenta/pink layer (offset right) - STRONGER EFFECT
            ctx.fillStyle = 'rgba(234, 54, 175, 0.8)';
            ctx.fillText(text, x + 2, y);

            // Cyan/green layer (offset left) - STRONGER EFFECT
            ctx.fillStyle = 'rgba(117, 250, 105, 0.8)';
            ctx.fillText(text, x - 2, y);

            // Main bright green text (centered)
            ctx.fillStyle = '#0F0';
            ctx.fillText(text, x, y);

            // Reset drop to top randomly after reaching bottom
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }

            // Move drop down
            drops[i]++;
        }
    }

    // Function to clean up and remove overlay
    function cleanup() {
        clearInterval(intervalId);
        document.removeEventListener('keydown', exitHandler, { capture: true });
        document.removeEventListener('touchstart', exitHandler, { capture: true });
        document.removeEventListener('click', exitHandler, { capture: true });
        terminalElement.style.opacity = '1'; // Restore visibility
        if (overlay.parentNode) {
            overlay.parentNode.removeChild(overlay);
        }
    }

    // Exit handler for keypress/touch/click
    function exitHandler(e) {
        e.preventDefault();
        e.stopPropagation();
        cleanup();
    }

    // Start animation
    const intervalId = setInterval(draw, 33);
    console.log('🎬 Animation started with', columns, 'columns');

    // Auto-stop after duration
    setTimeout(() => {
        cleanup();
    }, config.duration);

    // Exit on any keypress, touch, or click - use capture phase to intercept BEFORE terminal input
    document.addEventListener('keydown', exitHandler, { capture: true });
    document.addEventListener('touchstart', exitHandler, { capture: true });
    document.addEventListener('click', exitHandler, { capture: true });
    console.log('⌨️ Keydown, touch, and click listeners added (capture phase)');

    console.log('✅ Matrix effect fully initialized!');
}

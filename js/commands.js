// Command Implementations
// =======================
// All terminal commands and command processing logic

import { SESSION_START, ARCH_LOGO } from './config.js';
import { createMatrixEffect } from './effects.js';
import { renderWelcome, addOutput, scrollToBottom } from './rendering.js';

// Get output element (will be set from main.js)
let output;

export function setOutputElement(outputEl) {
    output = outputEl;
}

// Available commands
export const commands = {
    help: () => {
        return `
Available commands:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  help       - Display this help message
  about      - Information about this terminal
  neofetch   - Display system information
  date       - Display current date and time
  clear      - Clear the terminal screen
  echo       - Echo back the input text
  whoami     - Display current user
  ls         - List files (simulated)
  cat        - Display file contents (simulated)
  welcome    - Show the welcome message again
  matrix     - Mini matrix effect
  uptime     - System uptime
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;
    },

    about: () => {
        return `
CRT Terminal Simulator
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Created with pure HTML, CSS, and JavaScript
Features authentic CRT effects:
  • Scanlines
  • RGB chromatic aberration
  • Phosphor glow
  • Subtle flicker

Built with nostalgia for the golden age of
computing. No frameworks, just code.
`;
    },

    date: () => {
        return new Date().toString();
    },

    clear: () => {
        output.innerHTML = '';
        return null;
    },

    echo: (args) => {
        return args.join(' ') || '';
    },

    whoami: () => {
        return 'guest';
    },

    ls: () => {
        return `
documents/
downloads/
images/
projects/
readme.txt
config.sys
autoexec.bat
`;
    },

    cat: (args) => {
        const file = args[0];
        if (!file) {
            return 'cat: missing file operand';
        }
        if (file === 'readme.txt') {
            return `
README.TXT
═══════════════════════════════════════
This is a simulated file system.
Not a real filesystem - just for show!

Have fun exploring the terminal.
`;
        }
        return 'cat: ' + file + ': No such file or directory';
    },

    welcome: () => {
        renderWelcome();
        return null;
    },

    matrix: () => {
        // Thin wrapper - calls the effect implementation
        createMatrixEffect();
        return 'Matrix effect started. Press any key or tap to exit.';
    },

    uptime: () => {
        const uptime = Math.floor(performance.now() / 1000);
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = uptime % 60;
        return 'System uptime: ' + hours + 'h ' + minutes + 'm ' + seconds + 's';
    },

    neofetch: () => {
        const uptimeMs = Date.now() - SESSION_START;
        const uptime = Math.floor(uptimeMs / 1000);
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);

        return {
            type: 'neofetch',
            data: {
                logo: ARCH_LOGO,
                header: 'guest@terminal',
                divider: '──────────────────────',
                info: [
                    { label: 'OS', value: 'Arch Linux x86_64' },
                    { label: 'Host', value: 'Terminal Simulator' },
                    { label: 'Kernel', value: '6.1.0-retro' },
                    { label: 'Uptime', value: `${hours} hours, ${minutes} mins` },
                    { label: 'Packages', value: '420 (pacman)' },
                    { label: 'Shell', value: 'bash 5.2.15' },
                    { label: 'Resolution', value: `${window.innerWidth}x${window.innerHeight}` },
                    { label: 'DE', value: 'CRT Terminal' },
                    { label: 'WM', value: 'Retro' },
                    { label: 'Theme', value: 'CRT-Green [GTK3]' },
                    { label: 'Icons', value: 'Phosphor [GTK3]' },
                    { label: 'Terminal', value: 'crt-terminal' },
                    { label: 'CPU', value: 'Intel i9-9900K (8) @ 5.0GHz' },
                    { label: 'GPU', value: 'NVIDIA GeForce RTX 3080' },
                    { label: 'Memory', value: '2048MiB / 16384MiB' }
                ]
            }
        };
    }
};

// Add command to output
export function addCommand(cmd) {
    const div = document.createElement('div');
    div.className = 'command-line';
    div.innerHTML = `<span class="prompt">guest@terminal:~$</span> ${cmd}`;
    output.appendChild(div);
}

// Configuration for memory management
const MAX_COMMAND_HISTORY = 50; // Keep last 50 commands

// Process command
export function processCommand(cmd, input, updateCursorPositionFn) {
    cmd = cmd.trim();
    if (!cmd) return;

    // Get command history from main.js
    const { commandHistory, setHistoryIndex } = window.terminalState || {};

    // Add to history with limit to prevent memory bloat
    if (commandHistory) {
        commandHistory.unshift(cmd);
        // Trim history if it exceeds max size
        if (commandHistory.length > MAX_COMMAND_HISTORY) {
            commandHistory.length = MAX_COMMAND_HISTORY;
            console.log(`♻️ Trimmed command history to ${MAX_COMMAND_HISTORY} entries`);
        }
        setHistoryIndex(-1);
    }

    // Display command
    addCommand(cmd);

    // Parse command
    const parts = cmd.split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    // Execute command
    if (commands[command]) {
        const result = commands[command](args);
        if (result !== null) {
            addOutput(result);
        }
    } else {
        addOutput(`Command not found: ${command}`, 'error-text');
        addOutput('Type "help" for available commands.');
    }

    // Clear input
    input.value = '';
    updateCursorPositionFn();
}

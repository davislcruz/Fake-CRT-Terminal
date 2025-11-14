// Configuration and Constants
// ===========================
// All static configuration values, ASCII art, and templates

// Session tracking
export const SESSION_START = Date.now();

// ASCII Art for Arch Linux logo (used in neofetch)
export const ARCH_LOGO = `                   -\`
                  .o+\`
                 \`ooo/
                \`+oooo:
               \`+oooooo:
               -+oooooo+:
             \`/:-:++oooo+:
            \`/++++/+++++++:
           \`/++++++++++++++:
          \`/+++ooooooooooooo/\`
         ./ooosssso++osssssso+\`
        .oossssso-\`\`\`\`/ossssss+\`
       -osssssso.      :ssssssso.
      :osssssss/        osssso+++.
     /ossssssss/        +ssssooo/-
   \`/ossssso+/:-        -:/+osssso+-
  \`+sso+:-\`                 \`.-/+oso:
 \`++:.                           \`-/+/
 .\`                                 \`/`;

// Set of characters that indicate ASCII art lines
export const asciiArtLeaders = new Set([
    '▄','█','▀','╔','╗','╚','╝','╦','╩','╬','╠','╣','╤','╧','╪','╫','╟','╢','╥','╨',
    '╒','╕','╘','╛','╞','╡','╖','╓','╙','╳','╱','╲','┌','┐','└','┘','┼','├','┤','┬',
    '┴','─','│','╭','╮','╯','╰','░','▒','▓','╪','═','▁','▂','▃','▅','▆','▇'
]);

// Main ASCII art banner
export const asciiArt =
` ███████████                                                ██████████
░░███░░░░░███                                              ░░███░░░░███
 ░███    ░███   ██████   █████ █████  ██████  ████████      ░███   ░░███  ██████  █████ █████
 ░██████████   ░░░░░███ ░░███ ░░███  ███░░███░░███░░███     ░███    ░███ ███░░███░░███ ░░███
 ░███░░░░░███   ███████  ░███  ░███ ░███ ░███ ░███ ░███     ░███    ░███░███████  ░███  ░███
 ░███    ░███  ███░░███  ░░███ ███  ░███ ░███ ░███ ░███     ░███    ███ ░███░░░   ░░███ ███
 █████   █████░░████████  ░░█████   ░░██████  ████ █████ ██ ██████████  ░░██████   ░░█████
░░░░░   ░░░░░  ░░░░░░░░    ░░░░░     ░░░░░░  ░░░░ ░░░░░ ░░ ░░░░░░░░░░    ░░░░░░     ░░░░░    `;

// Welcome message template
export const welcomeTemplate = `
<pre class="output-line ascii-art welcome-text">
${asciiArt}
</pre>
<div class="output-line welcome-text">Welcome to my website!</div>
<div class="output-line info-text">Type 'help' for available commands.</div>
<div class="output-line welcome-divider">══════════════════════════════════════</div>
`;

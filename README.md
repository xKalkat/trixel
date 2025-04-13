# Trixel

Trixel is a modern, glowy take on classic Tetris you can play right in your browser.

## Features

- Smooth and responsive keyboard controls with DAS/ARR handling
- Ghost piece visibility toggle
- Animated lock delay with visual feedback
- Persistent game state using local storage
- Restart and pause functionality
- Modular and well-documented codebase

## Getting Started

You can either run the game locally from source, or download a compiled release.

### Option 1: Download the Release (Simplest)

1. Go to the [Releases](https://github.com/xKalkat/trixel/releases) page.
2. Download the latest `trixel-vX.X.zip` file.
3. Extract it and open `index.html` in your browser.

This version is production-ready and stripped of any dev-only files.

### Option 2: Clone and Run Locally

1. Clone the repository:

   ```bash
   git clone https://github.com/xKalkat/trixel.git
   cd trixel
   ```

2. Open `index.html` in your browser.

   Or, to serve with a local web server (recommended for Chrome):

   ```bash
   python3 -m http.server
   # Visit http://localhost:8000 in your browser
   ```

## Controls

| Key             | Action              |
|------------------|----------------------|
| Left / A         | Move left           |
| Right / D        | Move right          |
| Down / S         | Soft drop           |
| Up / W           | Rotate              |
| Space            | Hard drop           |
| X                | Toggle ghost piece  |
| Pause button     | Pause/resume        |
| Restart button   | Reset the game      |

## Project Structure

```
trixel/
├── index.html          # Main HTML entry point
├── styles.css          # Game styling
├── main.js             # Game bootstrap logic
├── manifest.json       # Optional Chrome extension manifest
├── README.md           # Project info and instructions
├── image.png           # Optional screenshot
├── trixel-logo.png     # Logo used in UI
├── trixel-name.png     # Name title image
├── js/
│   ├── arena.js        # Arena logic (collisions, clearing lines)
│   ├── canvas.js       # Canvas initialization and scaling
│   ├── constants.js    # Game constants (colors, keys, scoring)
│   ├── controls.js     # Keyboard input handlers
│   ├── gameState.js    # Central game state object
│   ├── matrix.js       # Matrix utilities
│   ├── overlay.js      # Display/hide control overlays
│   ├── pieces.js       # Piece definitions and shuffling
│   ├── player.js       # Player movement, rotation, and reset
│   ├── playerState.js  # Merge logic and game over checks
│   ├── renderer.js     # All canvas rendering
│   ├── storage.js      # Saving/loading game state
│   ├── uiEvents.js     # Pause/restart button events
│   └── updateLoop.js   # Main game loop and timers
```

## Chrome Extension Support

Trixel includes a `manifest.json` that lets you run it as a browser extension.

To install as an unpacked extension:

1. Go to `chrome://extensions`
2. Enable "Developer mode"
3. Click "Load unpacked" and select the `trixel` folder

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Created and maintained by [Ahaan](https://github.com/xKalkat)
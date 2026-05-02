Proposed File Structure
We will break the monolithic app.js into focused ES modules.

    1 /src
    2   /constants
    3     alphabet.js       # Character sets (Latin, Katakana, etc.)
    4     colors.js         # Color palettes (Green, Red, Disco, etc.)
    5     config.js         # Default settings (Speed, FontSize, Transitions)
    6   /models
    7     MatrixString.js   # Encapsulated logic for a single rain column
    8     Coordinate.js     # Simple {x, y} value object
    9   /engine

10 Renderer.js # Core Canvas API wrapper (using requestAnimationFrame)
11 Physics.js # Movement and boundary logic
12 /state
13 StateManager.js # Single source of truth for app state (Mode, Disco, Speed)
14 /controllers
15 InputHandler.js # Keyboard and mouse event orchestration
16 /ui
17 MenuController.js # Modern DOM manipulation and accessibility updates
18 main.js # Entry point: bootstrapping and dependency injection

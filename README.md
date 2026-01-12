# 🎨 Paint Doodler

A modern, feature-rich paint and doodler web application built with React.js and Vite.

## Features

- ✏️ **Drawing Tools**: Brush and Eraser tools
- 🎨 **Color Palette**: 12 preset colors plus custom color picker
- 📏 **Adjustable Brush Size**: Choose from preset sizes or use slider (1-50px)
- ↩️ **Undo/Redo**: Full history support for your drawings
- 🗑️ **Clear Canvas**: Start fresh with one click
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🎯 **Intuitive UI**: Clean and modern interface

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone this repository:
```bash
git clone <your-repo-url>
cd Paint-Type-Doodler
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

1. **Select a Tool**: Choose between Brush or Eraser from the toolbar
2. **Pick a Color**: Click on a preset color or use the color picker for custom colors
3. **Adjust Brush Size**: Select a preset size or use the slider for precise control
4. **Start Drawing**: Click and drag on the canvas to draw
5. **Undo/Redo**: Use the action buttons to undo or redo your strokes
6. **Clear Canvas**: Click the Clear button to start over

## Project Structure

```
Paint-Type-Doodler/
├── src/
│   ├── components/
│   │   ├── Canvas.jsx         # Main drawing canvas component
│   │   ├── Canvas.css         # Canvas styling
│   │   ├── Toolbar.jsx        # Tools and controls component
│   │   └── Toolbar.css        # Toolbar styling
│   ├── App.jsx                # Main application component
│   ├── App.css                # App styling
│   ├── main.jsx               # Entry point
│   └── index.css              # Global styles
├── public/                     # Static assets
├── index.html                 # HTML template
├── package.json               # Dependencies and scripts
└── vite.config.js             # Vite configuration
```

## Technologies Used

- **React.js** - UI library
- **Vite** - Build tool and dev server
- **HTML5 Canvas API** - Drawing functionality
- **CSS3** - Styling and animations

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Future Enhancements

- Save/Export drawings as images
- Import images to draw over
- Additional drawing tools (shapes, text, fill)
- Layer support
- Touch support for mobile devices
- Keyboard shortcuts

## License

MIT License

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

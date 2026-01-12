import { useState, useRef } from 'react';
import Canvas from './components/Canvas';
import Toolbar from './components/Toolbar';
import './App.css';

function App() {
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const [tool, setTool] = useState('brush');

  const clearRef = useRef(null);
  const undoRef = useRef(null);
  const redoRef = useRef(null);

  const handleClear = () => {
    if (clearRef.current) {
      clearRef.current();
    }
  };

  const handleUndo = () => {
    if (undoRef.current) {
      undoRef.current();
    }
  };

  const handleRedo = () => {
    if (redoRef.current) {
      redoRef.current();
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🎨 Paint Doodler</h1>
      </header>
      
      <div className="app-content">
        <Toolbar
          color={color}
          setColor={setColor}
          brushSize={brushSize}
          setBrushSize={setBrushSize}
          tool={tool}
          setTool={setTool}
          onClear={handleClear}
          onUndo={handleUndo}
          onRedo={handleRedo}
        />
        
        <div className="canvas-container">
          <Canvas
            color={color}
            brushSize={brushSize}
            tool={tool}
            onClear={clearRef}
            onUndo={undoRef}
            onRedo={redoRef}
          />
        </div>
      </div>
    </div>
  );
}

export default App;

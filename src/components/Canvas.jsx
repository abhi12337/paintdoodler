import { useRef, useEffect, useState, useCallback } from 'react';
import './Canvas.css';

const Canvas = ({ color, brushSize, tool, onClear, onUndo, onRedo }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyStep, setHistoryStep] = useState(-1);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [snapshot, setSnapshot] = useState(null);

  // Draw grid lines
  const drawGrid = (ctx, width, height) => {
    const gridSize = 20; // Grid spacing in pixels
    
    // Add blur effect
    ctx.shadowBlur = 1;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.strokeStyle = '#666666';
    ctx.lineWidth = 1;
    
    // Draw vertical lines
    for (let x = 0; x <= width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    
    // Draw horizontal lines
    for (let y = 0; y <= height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    
    // Reset shadow
    ctx.shadowBlur = 0;
  };

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const container = canvas.parentElement;
    const rect = container.getBoundingClientRect();
    
    // Set canvas size
    canvas.width = rect.width - 40; // Account for padding
    canvas.height = rect.height - 40;
    
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid
    drawGrid(ctx, canvas.width, canvas.height);
    
    // Save initial state
    const initialState = canvas.toDataURL();
    setHistory([initialState]);
    setHistoryStep(0);
  }, []);

  const saveToHistory = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const dataUrl = canvas.toDataURL();
    setHistory(prev => {
      const newHistory = prev.slice(0, historyStep + 1);
      return [...newHistory, dataUrl];
    });
    setHistoryStep(prev => prev + 1);
  }, [historyStep]);

  const restoreState = useCallback((step) => {
    const canvas = canvasRef.current;
    if (!canvas || !history[step]) return;
    
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = history[step];
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
  }, [history]);

  useEffect(() => {
    if (onUndo) {
      onUndo.current = () => {
        if (historyStep > 0) {
          const newStep = historyStep - 1;
          setHistoryStep(newStep);
          restoreState(newStep);
        }
      };
    }
  }, [historyStep, onUndo, restoreState]);

  useEffect(() => {
    if (onRedo) {
      onRedo.current = () => {
        if (historyStep < history.length - 1) {
          const newStep = historyStep + 1;
          setHistoryStep(newStep);
          restoreState(newStep);
        }
      };
    }
  }, [historyStep, history.length, onRedo, restoreState]);

  useEffect(() => {
    if (onClear) {
      onClear.current = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        drawGrid(ctx, canvas.width, canvas.height);
        saveToHistory();
      };
    }
  }, [onClear, saveToHistory]);

  const startDrawing = (e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);
    setStartPos({ x, y });
    
    // Save snapshot for shape drawing
    if (tool === 'rectangle' || tool === 'circle' || tool === 'line') {
      setSnapshot(ctx.getImageData(0, 0, canvas.width, canvas.height));
    }
    
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.strokeStyle = 'rgba(0,0,0,1)';
      ctx.beginPath();
      ctx.moveTo(x, y);
    } else if (tool === 'brush') {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(x, y);
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
    }
  };

  const draw = (e) => {
    e.preventDefault();
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (tool === 'brush' || tool === 'eraser') {
      ctx.lineTo(x, y);
      ctx.stroke();
    } else if (tool === 'rectangle' || tool === 'circle' || tool === 'line') {
      // Restore snapshot to show live preview
      if (snapshot) {
        ctx.putImageData(snapshot, 0, 0);
      }
      
      ctx.beginPath();
      
      if (tool === 'rectangle') {
        const width = x - startPos.x;
        const height = y - startPos.y;
        ctx.strokeRect(startPos.x, startPos.y, width, height);
      } else if (tool === 'circle') {
        const radius = Math.sqrt(Math.pow(x - startPos.x, 2) + Math.pow(y - startPos.y, 2));
        ctx.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI);
        ctx.stroke();
      } else if (tool === 'line') {
        ctx.moveTo(startPos.x, startPos.y);
        ctx.lineTo(x, y);
        ctx.stroke();
      }
    }
  };

  const stopDrawing = (e) => {
    if (e) e.preventDefault();
    if (isDrawing) {
      setIsDrawing(false);
      setSnapshot(null);
      saveToHistory();
    }
  };

  return (
    <canvas
      ref={canvasRef}
      className="drawing-canvas"
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={stopDrawing}
      onMouseLeave={stopDrawing}
      style={{ display: 'block' }}
    />
  );
};

export default Canvas;

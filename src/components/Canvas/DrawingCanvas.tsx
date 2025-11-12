import { useRef, useEffect } from 'react';
import { DrawingTool } from '../../types';
import { useCanvas } from '../../hooks/useCanvas';
import { useGame } from '../../context/GameContext';

interface DrawingCanvasProps {
  tool: DrawingTool;
  onExport?: (imageData: string) => void;
}

export function DrawingCanvas({ tool, onExport }: DrawingCanvasProps) {
  const { gameState } = useGame();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const {
    startDrawing,
    draw,
    stopDrawing,
    undo,
    redo,
    clearCanvas,
    exportCanvas,
    canUndo,
    canRedo,
  } = useCanvas(canvasRef, tool);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseleave', stopDrawing);

    canvas.addEventListener('touchstart', startDrawing);
    canvas.addEventListener('touchmove', draw);
    canvas.addEventListener('touchend', stopDrawing);

    return () => {
      canvas.removeEventListener('mousedown', startDrawing);
      canvas.removeEventListener('mousemove', draw);
      canvas.removeEventListener('mouseup', stopDrawing);
      canvas.removeEventListener('mouseleave', stopDrawing);

      canvas.removeEventListener('touchstart', startDrawing);
      canvas.removeEventListener('touchmove', draw);
      canvas.removeEventListener('touchend', stopDrawing);
    };
  }, [startDrawing, draw, stopDrawing]);

  const handleExport = () => {
    const imageData = exportCanvas();
    if (onExport) {
      onExport(imageData);
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      {/* Canvas Container */}
      <div className="border-4 border-gray-300 rounded-lg shadow-lg bg-white overflow-hidden">
        <canvas
          ref={canvasRef}
          width={gameState.currentCanvasSize.width}
          height={gameState.currentCanvasSize.height}
          className="max-w-full h-auto cursor-crosshair touch-none"
          style={{ display: 'block' }}
        />
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between bg-gray-100 p-4 rounded-lg">
        <div className="flex items-center space-x-2">
          <button
            onClick={undo}
            disabled={!canUndo}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Undo"
          >
            ↶ Undo
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Redo"
          >
            ↷ Redo
          </button>
          <button
            onClick={clearCanvas}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            title="Clear Canvas"
          >
            🗑️ Clear
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">
            Canvas: <span className="font-semibold">{gameState.currentCanvasSize.name}</span> ({gameState.currentCanvasSize.width}x{gameState.currentCanvasSize.height})
          </div>
          <button
            onClick={handleExport}
            className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700"
          >
            🤖 Submit to AI
          </button>
        </div>
      </div>
    </div>
  );
}

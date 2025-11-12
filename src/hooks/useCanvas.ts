import { useRef, useCallback, useState, useEffect, RefObject } from 'react';
import { DrawingTool } from '../types';
import { getMousePos } from '../utils/canvasUtils';
import { MAX_HISTORY_STATES } from '../utils/constants';

interface CanvasState {
  isDrawing: boolean;
  history: ImageData[];
  historyStep: number;
}

export function useCanvas(
  canvasRef: RefObject<HTMLCanvasElement>,
  tool: DrawingTool
) {
  const [canvasState, setCanvasState] = useState<CanvasState>({
    isDrawing: false,
    history: [],
    historyStep: -1,
  });

  const lastPos = useRef<{ x: number; y: number } | null>(null);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set white background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Save initial state
    saveState();
  }, [canvasRef]);

  const saveState = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    setCanvasState((prev) => {
      // Remove any redo history
      const newHistory = prev.history.slice(0, prev.historyStep + 1);

      // Add new state
      newHistory.push(imageData);

      // Limit history size
      if (newHistory.length > MAX_HISTORY_STATES) {
        newHistory.shift();
        return {
          ...prev,
          history: newHistory,
          historyStep: newHistory.length - 1,
        };
      }

      return {
        ...prev,
        history: newHistory,
        historyStep: newHistory.length - 1,
      };
    });
  }, [canvasRef]);

  const startDrawing = useCallback(
    (e: MouseEvent | TouchEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      e.preventDefault();
      const pos = getMousePos(canvas, e);

      lastPos.current = pos;
      setCanvasState((prev) => ({ ...prev, isDrawing: true }));
    },
    [canvasRef]
  );

  const draw = useCallback(
    (e: MouseEvent | TouchEvent) => {
      const canvas = canvasRef.current;
      if (!canvas || !canvasState.isDrawing || !lastPos.current) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      e.preventDefault();
      const pos = getMousePos(canvas, e);

      ctx.beginPath();
      ctx.moveTo(lastPos.current.x, lastPos.current.y);
      ctx.lineTo(pos.x, pos.y);

      if (tool.mode === 'erase') {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.strokeStyle = 'rgba(0,0,0,1)';
      } else {
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = tool.color;
      }

      ctx.lineWidth = tool.brushSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();

      lastPos.current = pos;
    },
    [canvasRef, canvasState.isDrawing, tool]
  );

  const stopDrawing = useCallback(() => {
    if (canvasState.isDrawing) {
      setCanvasState((prev) => ({ ...prev, isDrawing: false }));
      lastPos.current = null;
      saveState();
    }
  }, [canvasState.isDrawing, saveState]);

  const undo = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || canvasState.historyStep <= 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setCanvasState((prev) => {
      const newStep = prev.historyStep - 1;
      ctx.putImageData(prev.history[newStep], 0, 0);
      return { ...prev, historyStep: newStep };
    });
  }, [canvasRef, canvasState.historyStep]);

  const redo = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || canvasState.historyStep >= canvasState.history.length - 1)
      return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setCanvasState((prev) => {
      const newStep = prev.historyStep + 1;
      ctx.putImageData(prev.history[newStep], 0, 0);
      return { ...prev, historyStep: newStep };
    });
  }, [canvasRef, canvasState.historyStep, canvasState.history.length]);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveState();
  }, [canvasRef, saveState]);

  const exportCanvas = useCallback((): string => {
    const canvas = canvasRef.current;
    if (!canvas) return '';

    return canvas.toDataURL('image/png', 0.8);
  }, [canvasRef]);

  const canUndo = canvasState.historyStep > 0;
  const canRedo = canvasState.historyStep < canvasState.history.length - 1;

  return {
    startDrawing,
    draw,
    stopDrawing,
    undo,
    redo,
    clearCanvas,
    exportCanvas,
    canUndo,
    canRedo,
  };
}

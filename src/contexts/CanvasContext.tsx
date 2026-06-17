'use client';

import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react';

type CanvasEventType =
  | 'themeChange'
  | 'soundToggle'
  | 'musicToggle'
  | 'spokenToggle'
  | 'sunsetToggle'
  | 'paintToggle'
  | 'canvasClear'
  | 'canvasDirty'
  | 'colorChange'
  | 'menuToggle'
  | 'notePlayed';

type EventMap = {
  themeChange: { theme: 'dark' | 'light' };
  soundToggle: { enabled: boolean };
  musicToggle: { active: boolean };
  spokenToggle: { active: boolean };
  sunsetToggle: { active: boolean };
  paintToggle: { active: boolean };
  canvasClear: undefined;
  canvasDirty: { dirty: boolean };
  colorChange: { color: string };
  menuToggle: undefined;
  notePlayed: { note: string };
};

type EventHandler<T> = (detail: T) => void;

interface CanvasContextValue {
  emit: <K extends keyof EventMap>(name: K, detail: EventMap[K]) => void;
  on: <K extends keyof EventMap>(name: K, handler: EventHandler<EventMap[K]>) => () => void;
  paintColor: string;
  setPaintColor: (color: string) => void;
  resetPaintColor: () => void;
  getPaintColor: () => string;
}

const CanvasContext = createContext<CanvasContextValue | null>(null);

export function CanvasProvider({ children }: { children: ReactNode }) {
  const handlersRef = useRef(new Map<CanvasEventType, Set<EventHandler<unknown>>>());
  const [paintColor, setPaintColorState] = useState('');

  const emit = useCallback<CanvasContextValue['emit']>((name, detail) => {
    const eventHandlers = handlersRef.current.get(name as CanvasEventType);
    if (!eventHandlers) return;

    eventHandlers.forEach((handler) => {
      (handler as EventHandler<typeof detail>)(detail);
    });
  }, []);

  const on = useCallback<CanvasContextValue['on']>((name, handler) => {
    if (!handlersRef.current.has(name as CanvasEventType)) {
      handlersRef.current.set(name as CanvasEventType, new Set());
    }

    const handlersSet = handlersRef.current.get(name as CanvasEventType)!;
    handlersSet.add(handler as EventHandler<unknown>);

    return () => {
      handlersSet.delete(handler as EventHandler<unknown>);
      if (handlersSet.size === 0) {
        handlersRef.current.delete(name as CanvasEventType);
      }
    };
  }, []);

  const setPaintColor = useCallback((color: string) => {
    const normalized = color || '';
    setPaintColorState(normalized);
    emit('colorChange', { color: normalized });
  }, [emit]);

  const resetPaintColor = useCallback(() => {
    setPaintColorState('');
    emit('colorChange', { color: '' });
  }, [emit]);

  const getPaintColor = useCallback(() => paintColor, [paintColor]);

  const value = useMemo<CanvasContextValue>(() => ({
    emit,
    on,
    paintColor,
    setPaintColor,
    resetPaintColor,
    getPaintColor,
  }), [emit, on, paintColor, setPaintColor, resetPaintColor, getPaintColor]);

  return (
    <CanvasContext.Provider value={value}>
      {children}
    </CanvasContext.Provider>
  );
}

export function useCanvas() {
  const context = useContext(CanvasContext);
  if (!context) {
    throw new Error('useCanvas must be used within CanvasProvider');
  }
  return context;
}

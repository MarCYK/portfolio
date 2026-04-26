'use client';

import { createContext, useContext, type ReactNode } from 'react';

type CanvasEventType =
  | 'themeChange'
  | 'soundToggle'
  | 'musicToggle'
  | 'discoToggle'
  | 'sunsetToggle'
  | 'canvasClear'
  | 'canvasDirty'
  | 'colorChange'
  | 'menuToggle'
  | 'notePlayed';

type EventMap = {
  themeChange: { theme: 'dark' | 'light' };
  soundToggle: { enabled: boolean };
  musicToggle: { active: boolean };
  discoToggle: { active: boolean };
  sunsetToggle: { active: boolean };
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
}

const CanvasContext = createContext<CanvasContextValue | null>(null);

export function CanvasProvider({ children }: { children: ReactNode }) {
  const handlers = new Map<CanvasEventType, Set<EventHandler<unknown>>>();

  function emit<K extends keyof EventMap>(name: K, detail: EventMap[K]): void {
    const eventHandlers = handlers.get(name as CanvasEventType);
    if (eventHandlers) {
      eventHandlers.forEach((handler) => {
        (handler as EventHandler<EventMap[K]>)(detail);
      });
    }
  }

  function on<K extends keyof EventMap>(
    name: K,
    handler: EventHandler<EventMap[K]>
  ): () => void {
    if (!handlers.has(name as CanvasEventType)) {
      handlers.set(name as CanvasEventType, new Set());
    }
    const handlersSet = handlers.get(name as CanvasEventType)!;
    handlersSet.add(handler as EventHandler<unknown>);

    return () => {
      handlersSet.delete(handler as EventHandler<unknown>);
      if (handlersSet.size === 0) {
        handlers.delete(name as CanvasEventType);
      }
    };
  }

  return (
    <CanvasContext.Provider value={{ emit, on }}>
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

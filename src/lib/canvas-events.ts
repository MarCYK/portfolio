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
};

type EventHandler<T> = (detail: T) => void;

function emit<K extends keyof EventMap>(name: K, detail: EventMap[K]): void {
  window.dispatchEvent(new CustomEvent(name, { detail }));
}

function on<K extends keyof EventMap>(name: K, handler: EventHandler<EventMap[K]>): () => void {
  const listener = (event: Event) => handler((event as CustomEvent<EventMap[K]>).detail);
  window.addEventListener(name, listener);
  return () => window.removeEventListener(name, listener);
}

export const canvasEvents = { emit, on };

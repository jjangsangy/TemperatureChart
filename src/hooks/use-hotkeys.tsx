import { useEffect, useCallback } from 'react';

type HotkeyCallback = (event: KeyboardEvent) => void;

interface HotkeyMap {
  [key: string]: HotkeyCallback;
}

export function useHotkeys(hotkeyMap: HotkeyMap) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const handler = hotkeyMap[event.key];
      if (handler) {
        event.preventDefault();
        handler(event);
      }
    },
    [hotkeyMap],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
}

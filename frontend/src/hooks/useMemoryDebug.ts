"use client";

import { useState, useEffect } from 'react';
import { MemoryDebugState, memoryDebugManager } from '../lib/debug/memory-debug';

export const useMemoryDebug = () => {
  const [debugState, setDebugState] = useState<MemoryDebugState>(() => memoryDebugManager.getState());

  useEffect(() => {
    // Subscribe to state updates in debug state manager
    const unsubscribe = memoryDebugManager.subscribe((newState) => {
      setDebugState(newState);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return {
    state: debugState,
    updateState: memoryDebugManager.updateState,
    resetState: memoryDebugManager.reset,
    copyDebugData: memoryDebugManager.copyDebugDataToClipboard,
  };
};

export default useMemoryDebug;

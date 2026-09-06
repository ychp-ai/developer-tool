import { useCallback, useReducer } from 'react'

import { historyReducer } from '@/lib/history'

export function useUndoRedo(initialValue = '') {
  const [state, dispatch] = useReducer(historyReducer, initialValue, (value) => ({
    entries: [value],
    index: 0,
  }))
  const setValue = useCallback((value: string) => dispatch({ type: 'set', value }), [])
  const undo = useCallback(() => dispatch({ type: 'undo' }), [])
  const redo = useCallback(() => dispatch({ type: 'redo' }), [])
  const reset = useCallback((value = '') => dispatch({ type: 'reset', value }), [])

  return {
    value: state.entries[state.index],
    setValue,
    undo,
    redo,
    canUndo: state.index > 0,
    canRedo: state.index < state.entries.length - 1,
    reset,
  }
}

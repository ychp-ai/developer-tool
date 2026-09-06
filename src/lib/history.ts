interface HistoryState {
  entries: string[]
  index: number
}

type HistoryAction = { type: 'set' | 'reset'; value: string } | { type: 'undo' | 'redo' }

export function historyReducer(state: HistoryState, action: HistoryAction): HistoryState {
  switch (action.type) {
    case 'set': {
      if (state.entries[state.index] === action.value) return state
      const entries = [...state.entries.slice(0, state.index + 1), action.value]
      return { entries, index: entries.length - 1 }
    }
    case 'reset':
      return { entries: [action.value], index: 0 }
    case 'undo':
      return { ...state, index: Math.max(0, state.index - 1) }
    case 'redo':
      return { ...state, index: Math.min(state.entries.length - 1, state.index + 1) }
  }
}

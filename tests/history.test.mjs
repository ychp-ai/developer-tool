import { test } from 'node:test'
import assert from 'node:assert/strict'
import { historyReducer } from '../src/lib/history.ts'

test('history undo/redo and edits after undo preserve the correct branch', () => {
  let state = { entries: [''], index: 0 }
  for (const value of ['one', 'two']) state = historyReducer(state, { type: 'set', value })
  state = historyReducer(state, { type: 'undo' })
  assert.equal(state.entries[state.index], 'one')
  state = historyReducer(state, { type: 'redo' })
  assert.equal(state.entries[state.index], 'two')
  state = historyReducer(state, { type: 'undo' })
  state = historyReducer(state, { type: 'set', value: 'three' })
  assert.deepEqual(state.entries, ['', 'one', 'three'])
  assert.equal(historyReducer(state, { type: 'redo' }).index, 2)
  assert.equal(historyReducer(state, { type: 'set', value: 'three' }), state)
  assert.deepEqual(historyReducer(state, { type: 'reset', value: '' }), { entries: [''], index: 0 })
})

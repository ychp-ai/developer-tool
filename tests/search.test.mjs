import { test } from 'node:test';
import assert from 'node:assert/strict';
import { toolGroups } from '../src/features/tool-registry/registry.ts';
import { filterToolGroups } from '../src/features/navigation/search.ts';

test('global search matches names, descriptions and categories with normalized input', () => {
  assert.equal(
    filterToolGroups(toolGroups, ' UUID ')[0].tools[0].path,
    '/uuid',
  );
  assert.equal(
    filterToolGroups(toolGroups, 'AI 工具').flatMap((group) => group.tools)
      .length,
    11,
  );
  assert.equal(
    filterToolGroups(toolGroups, '数据库存储')[0].tools[0].path,
    '/text-length-calculator',
  );
  assert.equal(filterToolGroups(toolGroups, 'does-not-exist').length, 0);
  assert.equal(filterToolGroups(toolGroups, '   ').length, toolGroups.length);
});

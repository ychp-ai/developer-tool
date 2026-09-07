import type { ToolGroup } from '../tool-registry/types';

export function filterToolGroups(
  groups: ToolGroup[],
  query: string,
): ToolGroup[] {
  const normalized = query.trim().toLowerCase();
  return groups
    .map((group) => ({
      ...group,
      tools: group.tools.filter((tool) =>
        `${tool.name} ${tool.description ?? ''} ${group.name}`
          .toLowerCase()
          .includes(normalized),
      ),
    }))
    .filter((group) => group.tools.length > 0);
}

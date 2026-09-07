import { useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Search, X } from 'lucide-react';

import { homeTools, toolGroups } from '@/features/tool-registry/registry';
import type { ToolNavigationContext } from '@/features/navigation/types';
import { CalendarSearchPanel } from '@/components/shared/CalendarSearchPanel';

const categories = toolGroups.filter((group) =>
  group.tools.some((tool) => tool.showOnHome !== false),
);
const categoryDescriptions: Record<string, string> = {
  格式化: '让代码与数据井井有条',
  编码转换: '在不同编码之间自由转换',
  文本处理: '查找、比较，整理每一段文本',
  转换工具: '时间、颜色与数字，换个表达',
  生成器: '把重复工作交给一次点击',
  媒体工具: '处理图片，预览表格数据',
  加密工具: '计算摘要，查看令牌内容',
  浏览器扩展: '发现浏览器里的实用帮手',
  生活查询: '也为工作之外的小事省点心',
  'AI 工具': '从提示词到模型，辅助 AI 开发',
};
const defaultQuickTools = [
  {
    path: '/json-formatter',
    name: 'JSON 格式化',
    description: '从一行数据，到清晰结构',
    glyph: '{ }',
    caption: 'JSON',
    className: 'quick-tool-blue',
  },
  {
    path: '/timestamp',
    name: '时间戳转换',
    description: '让时间变成看得懂的日期',
    glyph: '↔',
    caption: 'TIME',
    className: 'quick-tool-teal',
  },
  {
    path: '/diff-checker',
    name: '文本对比',
    description: '快速找到两段文本的不同',
    glyph: '±',
    caption: 'DIFF',
    className: 'quick-tool-violet',
  },
];

export function Home() {
  const {
    searchQuery: query,
    setSearchQuery: setQuery,
    selectedSearchIndex,
    homeSearchInputRef,
    filteredMenuGroups,
    flattenedTools,
    favoriteTools,
    recentToolsList,
  } = useOutletContext<ToolNavigationContext>();
  const [activeCategory, setActiveCategory] = useState('全部工具');
  const normalizedQuery = query.trim().toLowerCase();
  const visibleGroups = normalizedQuery
    ? filteredMenuGroups
    : categories
        .filter(
          (group) =>
            activeCategory === '全部工具' || group.name === activeCategory,
        )
        .map((group) => ({
          ...group,
          tools: group.tools.filter((tool) => tool.showOnHome !== false),
        }));
  const quickPaths = [
    ...new Set([
      ...favoriteTools.map((tool) => tool.path),
      ...recentToolsList.map((tool) => tool.path),
      ...defaultQuickTools.map((tool) => tool.path),
    ]),
  ].slice(0, 3);
  const quickTools = quickPaths.map((path, index) => {
    const definition = toolGroups
      .flatMap((group) => group.tools)
      .find((tool) => tool.path === path)!;
    const fallback = defaultQuickTools.find((tool) => tool.path === path);
    return {
      ...definition,
      glyph: fallback?.glyph,
      description:
        definition.description ??
        fallback?.description ??
        `打开${definition.name}`,
      className: defaultQuickTools[index].className,
      caption: favoriteTools.some((tool) => tool.path === path)
        ? '已收藏'
        : recentToolsList.some((tool) => tool.path === path)
          ? '最近使用'
          : '推荐工具',
    };
  });
  const resultCount = visibleGroups.reduce(
    (count, group) => count + group.tools.length,
    0,
  );

  return (
    <div className="workbench space-y-9">
      <section className="workbench-intro" aria-labelledby="workbench-title">
        <div className="flex items-center justify-between gap-4 mb-6">
          <span className="workbench-eyebrow">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            开发者的日常工作台
          </span>
          <span className="font-mono text-xs text-muted-foreground hidden sm:block">
            TOOLS / READY TO USE
          </span>
        </div>
        <h1 id="workbench-title" className="workbench-title">
          把琐碎，<span className="text-primary">交给工具。</span>
        </h1>
        <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
          格式化一段数据，转换一个时间，或整理新的灵感。
          <br className="sm:hidden" /> 你需要的工具，就在手边。
        </p>
        <CalendarSearchPanel>
          <div className="home-search">
            <Search
              className="h-5 w-5 shrink-0 text-primary"
              aria-hidden="true"
            />
            <input
              ref={homeSearchInputRef}
              role="combobox"
              aria-label="查找工具"
              aria-autocomplete="list"
              aria-expanded={Boolean(normalizedQuery)}
              aria-controls="home-search-results"
              aria-activedescendant={
                normalizedQuery && selectedSearchIndex >= 0
                  ? `home-result-${selectedSearchIndex}`
                  : undefined
              }
              placeholder="搜索全部工具…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Escape') {
                  event.stopPropagation();
                  setQuery('');
                }
              }}
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label="清空工具搜索"
                className="p-1 rounded-md hover:bg-accent"
              >
                <X className="h-4 w-4" />
              </button>
            ) : (
              <span className="text-xs text-muted-foreground shrink-0 hidden sm:block">
                {homeTools.length} 个工具
              </span>
            )}
          </div>
        </CalendarSearchPanel>
      </section>

      {!normalizedQuery && activeCategory === '全部工具' && (
        <section aria-labelledby="quick-tools-title">
          <div className="flex items-center justify-between mb-4">
            <h2 id="quick-tools-title" className="text-sm font-semibold">
              快捷工作区
            </h2>
            <span className="text-xs text-muted-foreground">
              收藏优先，接着上次的工作
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {quickTools.map((tool) => (
              <Link
                key={tool.path}
                to={tool.path}
                target={tool.isExternal ? '_blank' : undefined}
                rel={tool.isExternal ? 'noopener noreferrer' : undefined}
                className={`quick-tool ${tool.className}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="quick-tool-glyph" aria-hidden="true">
                    {tool.glyph ?? <tool.icon className="h-8 w-8" />}
                  </span>
                  <span className="font-mono text-xs opacity-80 hidden sm:inline">
                    {tool.caption}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2 mt-5">
                  <div>
                    <h3 className="text-xs sm:text-sm font-semibold">
                      {tool.name}
                    </h3>
                    <p className="text-xs mt-1.5 opacity-75 hidden sm:block">
                      {tool.description}
                    </p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 shrink-0 hidden sm:block" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section aria-labelledby="all-tools-title" className="space-y-5">
        <div className="flex items-center justify-between">
          <h2
            id="all-tools-title"
            className="text-lg font-semibold tracking-tight"
          >
            工具目录
            <span className="ml-3 font-mono text-xs font-normal text-muted-foreground">
              {homeTools.length}
            </span>
          </h2>
          <span className="text-xs text-muted-foreground" role="status">
            {normalizedQuery
              ? `全局找到 ${resultCount} 个工具`
              : '按需取用，即开即用'}
          </span>
        </div>
        <div
          className="flex flex-wrap gap-1.5"
          role="group"
          aria-label="筛选工具分类"
        >
          {['全部工具', ...categories.map((group) => group.name)].map(
            (category) => (
              <button
                type="button"
                key={category}
                aria-pressed={!normalizedQuery && activeCategory === category}
                onClick={() => {
                  setQuery('');
                  setActiveCategory(category);
                }}
                className={`category-filter ${!normalizedQuery && activeCategory === category ? 'category-filter-active' : ''}`}
              >
                {category}
              </button>
            ),
          )}
        </div>
        {visibleGroups.length > 0 ? (
          <div
            id="home-search-results"
            role={normalizedQuery ? 'listbox' : undefined}
            aria-label="工具搜索结果"
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 items-start"
          >
            {visibleGroups.map((group) => {
              const Icon = group.icon;
              return (
                <section key={group.name} className="catalog-card">
                  <div className="flex items-center gap-3 px-5 pt-5 pb-4">
                    <span className="catalog-icon">
                      <Icon className="h-[18px] w-[18px]" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-semibold">{group.name}</h3>
                      <p className="text-[11px] text-muted-foreground mt-1">
                        {categoryDescriptions[group.name] ??
                          '值得收藏的实用工具'}
                      </p>
                    </div>
                    <span className="text-[11px] font-mono text-muted-foreground">
                      {group.tools.length}
                    </span>
                  </div>
                  <div className="mx-5 border-t" />
                  <div className="p-2.5">
                    {group.tools.map((tool) => {
                      const ToolIcon = tool.icon;
                      const index = flattenedTools.findIndex(
                        (item) => item.path === tool.path,
                      );
                      const isSelected =
                        normalizedQuery && index === selectedSearchIndex;
                      const resultProps = {
                        id: `home-result-${index}`,
                        role: normalizedQuery ? 'option' : undefined,
                        'aria-selected': normalizedQuery
                          ? Boolean(isSelected)
                          : undefined,
                        onClick: () => setQuery(''),
                        className: `catalog-link ${isSelected ? 'bg-accent text-accent-foreground ring-1 ring-inset ring-primary' : ''}`,
                      };
                      const content = (
                        <>
                          <ToolIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
                          <span className="flex-1">{tool.name}</span>
                          {tool.isExternal ? (
                            <ArrowUpRight className="catalog-arrow" />
                          ) : (
                            <ArrowRight className="catalog-arrow" />
                          )}
                        </>
                      );
                      return tool.isExternal ? (
                        <a
                          key={tool.path}
                          href={tool.path}
                          target="_blank"
                          rel="noopener noreferrer"
                          {...resultProps}
                        >
                          {content}
                        </a>
                      ) : (
                        <Link key={tool.path} to={tool.path} {...resultProps}>
                          {content}
                        </Link>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        ) : (
          <div
            id="home-search-results"
            role="listbox"
            aria-label="工具搜索结果"
            className="rounded-xl border border-dashed p-12 text-center"
          >
            <Search className="h-7 w-7 text-muted-foreground mx-auto mb-3" />
            <p className="font-medium">没有找到匹配的工具</p>
            <p className="text-sm text-muted-foreground mt-2">
              试试“格式化”或“文本”，也可以清除筛选重新浏览。
            </p>
            <button
              type="button"
              className="text-sm text-primary mt-5 underline underline-offset-4"
              onClick={() => {
                setQuery('');
                setActiveCategory('全部工具');
              }}
            >
              查看全部工具
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

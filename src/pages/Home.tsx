import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Search, X } from 'lucide-react';

import { homeTools, toolGroups } from '@/features/tool-registry/registry';
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
const quickTools = [
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
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('全部工具');
  const normalizedQuery = query.trim().toLowerCase();
  const visibleGroups = categories
    .filter(
      (group) => activeCategory === '全部工具' || group.name === activeCategory,
    )
    .map((group) => ({
      ...group,
      tools: group.tools.filter(
        (tool) =>
          tool.showOnHome !== false &&
          `${tool.name} ${tool.description ?? ''} ${group.name}`
            .toLowerCase()
            .includes(normalizedQuery),
      ),
    }))
    .filter((group) => group.tools.length > 0);
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
              aria-label="查找工具"
              placeholder="想处理什么？搜索 JSON、时间戳、Base64…"
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
              少一点重复，多一点专注
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {quickTools.map((tool) => (
              <Link
                key={tool.path}
                to={tool.path}
                className={`quick-tool ${tool.className}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="quick-tool-glyph" aria-hidden="true">
                    {tool.glyph}
                  </span>
                  <span className="font-mono text-[10px] tracking-widest opacity-70 hidden sm:inline">
                    {tool.caption}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2 mt-5">
                  <div>
                    <h3 className="text-[11px] sm:text-sm font-semibold">
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
              ? `找到 ${resultCount} 个工具`
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
                aria-pressed={activeCategory === category}
                onClick={() => setActiveCategory(category)}
                className={`category-filter ${activeCategory === category ? 'category-filter-active' : ''}`}
              >
                {category}
              </button>
            ),
          )}
        </div>
        {visibleGroups.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 items-start">
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
                          className="catalog-link"
                        >
                          {content}
                        </a>
                      ) : (
                        <Link
                          key={tool.path}
                          to={tool.path}
                          className="catalog-link"
                        >
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
          <div className="rounded-xl border border-dashed p-12 text-center">
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

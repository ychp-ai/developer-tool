import type { ReactNode } from 'react';
import { Outlet, Link } from 'react-router-dom';
import {
  Code2,
  Clock,
  Home,
  Menu,
  FileSearch,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
  Star,
  StarOff,
  ExternalLink,
} from 'lucide-react';
import { useToolNavigation } from '@/features/navigation/useToolNavigation';
import type { ToolDefinition } from '@/features/tool-registry/types';
import { homeTools, toolByPath } from '@/features/tool-registry/registry';
import { Button } from '../components/ui/button';
import { ThemeToggle } from '../components/ThemeToggle';
import { PWAInstallPrompt } from '../components/ui/PWAInstallPrompt';

interface MenuToolLinkProps {
  tool: ToolDefinition;
  className: string;
  children: ReactNode;
  onClick?: () => void;
  title?: string;
}

function MenuToolLink({
  tool,
  className,
  children,
  onClick,
  title,
}: MenuToolLinkProps) {
  if (tool.isExternal) {
    return (
      <a
        href={tool.path}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        onClick={onClick}
        title={title}
      >
        {children}
      </a>
    );
  }

  return (
    <Link to={tool.path} className={className} onClick={onClick} title={title}>
      {children}
    </Link>
  );
}

export function Layout() {
  const {
    sidebarOpen,
    setSidebarOpen,
    sidebarCollapsed,
    setSidebarCollapsed,
    hoveredGroup,
    setHoveredGroup,
    popupStyle,
    setPopupStyle,
    searchQuery,
    setSearchQuery,
    favorites,
    favoritesOpen,
    setFavoritesOpen,
    recentOpen,
    setRecentOpen,
    selectedSearchIndex,
    setSelectedSearchIndex,
    searchInputRef,
    location,
    isToolActive,
    isGroupActive,
    filteredMenuGroups,
    openGroups,
    closePopup,
    cancelClose,
    flattenedTools,
    toggleGroup,
    toggleFavorite,
    removeFromRecent,
    favoriteTools,
    recentToolsList,
  } = useToolNavigation();

  return (
    <div className="h-screen flex flex-col overflow-hidden relative z-10">
      <header className="app-header flex-shrink-0 border-b bg-card">
        <div className="flex h-[72px] items-center justify-between px-4 lg:px-6 gap-4">
          <div className="flex items-center gap-3 lg:gap-7">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              aria-label="切换导航菜单"
              aria-expanded={sidebarOpen}
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <Link to="/" className="flex items-center gap-3 shrink-0">
              <span className="brand-mark">
                <Code2 className="h-5 w-5" />
              </span>
              <span className="flex flex-col gap-0.5">
                <span className="text-[15px] font-bold tracking-wide">
                  在线工具箱
                </span>
                <span className="brand-caption">DEVELOPER TOOLS</span>
              </span>
            </Link>
            <div className="hidden lg:flex items-center gap-3 text-xs text-muted-foreground border-l pl-7">
              <span>工作空间</span>
              <ChevronRight className="h-3 w-3" />
              <span className="text-foreground">
                {toolByPath.get(location.pathname)?.name ?? '工具概览'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden md:inline text-xs text-muted-foreground">
              {homeTools.length} 个工具，随时就绪
            </span>
            <span className="h-5 border-l hidden md:block" />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside
          aria-label="工具导航"
          className={`app-sidebar fixed lg:relative inset-y-0 left-0 z-40 transform border-r bg-card transition-all duration-200 ease-in-out flex flex-col ${
            sidebarOpen
              ? 'translate-x-0'
              : '-translate-x-full invisible lg:visible'
          } ${sidebarCollapsed ? 'w-16' : 'w-[232px]'} lg:translate-x-0`}
        >
          <nav
            className="flex-1 flex flex-col overflow-hidden p-3 pt-5"
            aria-label="主导航"
          >
            {!sidebarCollapsed && (
              <div className="flex items-center justify-between px-3 mb-4">
                <span className="nav-eyebrow">工作台</span>
                <button
                  type="button"
                  aria-label="关闭导航菜单"
                  onClick={() => setSidebarOpen(false)}
                  className="lg:hidden p-1"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
            <Link
              to="/"
              className={`flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 mb-4 ${
                sidebarCollapsed ? 'justify-center' : 'space-x-3'
              } ${
                location.pathname === '/'
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              }`}
              onClick={() => setSidebarOpen(false)}
            >
              <div
                className={`p-1.5 rounded-md transition-colors ${location.pathname === '/' ? 'bg-primary/10 text-primary' : 'text-muted-foreground'}`}
              >
                <Home className="h-3.5 w-3.5 shrink-0" />
              </div>
              {!sidebarCollapsed && (
                <span className="font-semibold">工具概览</span>
              )}
            </Link>

            {!sidebarCollapsed && (
              <div className="mb-3 relative flex-shrink-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
                <input
                  ref={searchInputRef}
                  type="text"
                  aria-label="搜索导航工具"
                  placeholder="搜索工具..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-20 py-2.5 text-xs rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-ring transition-colors placeholder:text-muted-foreground"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] font-medium text-muted-foreground bg-muted dark:bg-slate-800 dark:text-slate-500 rounded border border-slate-200 dark:border-slate-700">
                    ⌘ / Ctrl K
                  </kbd>
                  {searchQuery && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedSearchIndex(-1);
                      }}
                      aria-label="清空导航搜索"
                      className="text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {!sidebarCollapsed &&
              !searchQuery &&
              (favoriteTools.length > 0 || recentToolsList.length > 0) && (
                <div className="grid grid-cols-2 gap-2 mb-3 flex-shrink-0">
                  {favoriteTools.length > 0 && (
                    <div
                      className="relative"
                      onMouseEnter={() => {
                        cancelClose();
                        setRecentOpen(false);
                      }}
                      onMouseLeave={closePopup}
                    >
                      <button
                        onClick={() => setFavoritesOpen(!favoritesOpen)}
                        className={`w-full flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg border transition-all duration-200 ${
                          favoritesOpen
                            ? 'bg-amber-100 dark:bg-amber-900/40 border-amber-300 dark:border-amber-700 shadow-sm shadow-amber-200 dark:shadow-amber-900/20'
                            : 'bg-amber-50/80 dark:bg-amber-950/20 border-amber-200/60 dark:border-amber-900/30 hover:bg-amber-100 dark:hover:bg-amber-900/40'
                        }`}
                        title="我的收藏"
                      >
                        <Star className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 fill-amber-600 dark:fill-amber-400" />
                        <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">
                          {favoriteTools.length}
                        </span>
                      </button>
                      {favoritesOpen && (
                        <div
                          className="absolute left-0 top-full mt-2 z-20 w-56 rounded-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/50 shadow-lg overflow-hidden"
                          onMouseEnter={cancelClose}
                          onMouseLeave={closePopup}
                        >
                          <div className="px-3 py-2.5 border-b border-amber-200 dark:border-amber-900/50 bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-950/40 dark:to-amber-900/30">
                            <div className="flex items-center gap-2">
                              <Star className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                              <span className="text-sm font-semibold text-amber-900 dark:text-amber-100">
                                我的收藏
                              </span>
                            </div>
                          </div>
                          <div className="max-h-80 overflow-y-auto p-1.5">
                            {favoriteTools.map((tool) => {
                              const ToolIcon = tool.icon;
                              return (
                                <div
                                  key={tool.path}
                                  className="relative group/fav-tool"
                                >
                                  <MenuToolLink
                                    tool={tool}
                                    className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-all duration-200 ${
                                      isToolActive(tool)
                                        ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 font-medium'
                                        : 'text-slate-700 dark:text-slate-300 hover:bg-amber-50 dark:hover:bg-amber-950/30'
                                    }`}
                                    onClick={() => {
                                      setSidebarOpen(false);
                                      setFavoritesOpen(false);
                                    }}
                                  >
                                    <ToolIcon className="h-4 w-4 shrink-0 opacity-70" />
                                    <span className="truncate flex-1">
                                      {tool.name}
                                    </span>
                                    {tool.isExternal && (
                                      <ExternalLink
                                        className="h-3.5 w-3.5 shrink-0 opacity-60"
                                        aria-hidden="true"
                                      />
                                    )}
                                  </MenuToolLink>
                                  <button
                                    onClick={(e) => {
                                      toggleFavorite(tool.path, e);
                                      if (favoriteTools.length === 1)
                                        setFavoritesOpen(false);
                                    }}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded opacity-0 group-hover/fav-tool:opacity-100 focus-visible:opacity-100 hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-all"
                                    title="取消收藏"
                                  >
                                    <X className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  {recentToolsList.length > 0 && (
                    <div
                      className="relative"
                      onMouseEnter={() => {
                        cancelClose();
                        setFavoritesOpen(false);
                      }}
                      onMouseLeave={closePopup}
                    >
                      <button
                        onClick={() => setRecentOpen(!recentOpen)}
                        className={`w-full flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg border transition-all duration-200 ${
                          recentOpen
                            ? 'bg-emerald-100 dark:bg-emerald-900/40 border-emerald-300 dark:border-emerald-700 shadow-sm shadow-emerald-200 dark:shadow-emerald-900/20'
                            : 'bg-emerald-50/80 dark:bg-emerald-950/20 border-emerald-200/60 dark:border-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/40'
                        }`}
                        title="最近使用"
                      >
                        <Clock className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                          {recentToolsList.length}
                        </span>
                      </button>
                      {recentOpen && (
                        <div
                          className="absolute left-0 top-full mt-2 z-20 w-56 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900/50 shadow-lg overflow-hidden"
                          onMouseEnter={cancelClose}
                          onMouseLeave={closePopup}
                        >
                          <div className="px-3 py-2.5 border-b border-emerald-200 dark:border-emerald-900/50 bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-950/40 dark:to-emerald-900/30">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                              <span className="text-sm font-semibold text-emerald-900 dark:text-emerald-100">
                                最近使用
                              </span>
                            </div>
                          </div>
                          <div className="max-h-80 overflow-y-auto p-1.5">
                            {recentToolsList.map((tool) => {
                              if (!tool) return null;
                              const ToolIcon = tool.icon;
                              return (
                                <div
                                  key={tool.path}
                                  className="relative group/recent-tool"
                                >
                                  <MenuToolLink
                                    tool={tool}
                                    className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-all duration-200 ${
                                      isToolActive(tool)
                                        ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200 font-medium'
                                        : 'text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/30'
                                    }`}
                                    onClick={() => {
                                      setSidebarOpen(false);
                                      setRecentOpen(false);
                                    }}
                                  >
                                    <ToolIcon className="h-4 w-4 shrink-0 opacity-70" />
                                    <span className="truncate flex-1">
                                      {tool.name}
                                    </span>
                                  </MenuToolLink>
                                  <button
                                    onClick={(e) => {
                                      removeFromRecent(tool.path, e);
                                      if (recentToolsList.length === 1)
                                        setRecentOpen(false);
                                    }}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded opacity-0 group-hover/recent-tool:opacity-100 focus-visible:opacity-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                                    title="从历史记录中删除"
                                  >
                                    <X className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

            {!sidebarCollapsed && (
              <p className="nav-eyebrow px-3 mt-3 mb-3">工具分类</p>
            )}
            <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0 sidebar-scrollbar">
              {filteredMenuGroups.map((group) => {
                const GroupIcon = group.icon;
                const isOpen = searchQuery
                  ? true
                  : openGroups.has(group.name) || isGroupActive(group);

                return (
                  <div key={group.name} className="mb-1">
                    {!sidebarCollapsed ? (
                      <>
                        {!searchQuery && (
                          <button
                            aria-expanded={Boolean(isOpen)}
                            onClick={() => toggleGroup(group.name)}
                            className="w-full flex items-center justify-between rounded-lg px-3 py-2.5 text-[13px] font-medium transition-colors text-muted-foreground hover:bg-accent hover:text-foreground group/header"
                          >
                            <div className="flex items-center space-x-3 overflow-hidden">
                              <div
                                className={`p-1.5 rounded-md transition-colors ${isOpen ? 'bg-primary/10 text-primary' : 'text-muted-foreground group-hover/header:text-primary'}`}
                              >
                                <GroupIcon className="h-3.5 w-3.5 shrink-0" />
                              </div>
                              <span className="font-semibold">
                                {group.name}
                              </span>
                            </div>
                            <ChevronDown
                              className={`h-4 w-4 shrink-0 transition-transform duration-200 text-slate-400 dark:text-slate-500 ${isOpen ? 'rotate-180' : ''}`}
                            />
                          </button>
                        )}

                        {isOpen && (
                          <div className="ml-5 mt-1 space-y-0.5 pl-2 border-l">
                            {group.tools.map((tool) => {
                              const ToolIcon = tool.icon;
                              const globalIndex = flattenedTools.findIndex(
                                (t) => t.path === tool.path,
                              );
                              const isSelected =
                                searchQuery &&
                                globalIndex === selectedSearchIndex;
                              return (
                                <div
                                  key={tool.path}
                                  className="relative group/tool"
                                >
                                  <MenuToolLink
                                    tool={tool}
                                    className={`flex items-center justify-between space-x-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                                      isSelected
                                        ? 'bg-primary text-primary-foreground pr-8 ring-2 ring-ring'
                                        : isToolActive(tool)
                                          ? 'bg-primary/10 text-primary pr-8'
                                          : 'text-muted-foreground hover:bg-accent hover:text-foreground pr-8'
                                    }`}
                                    onClick={() => setSidebarOpen(false)}
                                    title={
                                      tool.isExternal
                                        ? `${tool.name}（新标签页打开）`
                                        : tool.name
                                    }
                                  >
                                    <div className="flex items-center space-x-2.5 overflow-hidden">
                                      <ToolIcon className="h-3.5 w-3.5 shrink-0" />
                                      <span className="truncate">
                                        {tool.name}
                                      </span>
                                      {tool.isExternal && (
                                        <ExternalLink
                                          className="h-3 w-3 shrink-0 opacity-60"
                                          aria-hidden="true"
                                        />
                                      )}
                                    </div>
                                  </MenuToolLink>
                                  <button
                                    onClick={(e) =>
                                      toggleFavorite(tool.path, e)
                                    }
                                    className={`absolute right-1 top-1/2 -translate-y-1/2 p-1 rounded opacity-0 group-hover/tool:opacity-100 focus-visible:opacity-100 transition-all ${
                                      favorites.has(tool.path)
                                        ? 'opacity-100'
                                        : ''
                                    } hover:bg-amber-100 dark:hover:bg-amber-900/30`}
                                    title={
                                      favorites.has(tool.path)
                                        ? '取消收藏'
                                        : '收藏'
                                    }
                                  >
                                    {favorites.has(tool.path) ? (
                                      <Star className="h-3.5 w-3.5 text-amber-500 dark:text-amber-400 fill-amber-500 dark:fill-amber-400" />
                                    ) : (
                                      <StarOff className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                                    )}
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="relative" onMouseLeave={closePopup}>
                        <button
                          onMouseEnter={(e) => {
                            cancelClose();
                            const rect =
                              e.currentTarget.getBoundingClientRect();
                            const centerY = rect.top + rect.height / 2;
                            setPopupStyle({
                              position: 'fixed',
                              left: `${rect.right + 8}px`,
                              top: `${centerY}px`,
                              transform: 'translateY(-50%)',
                            });
                            setHoveredGroup(group.name);
                          }}
                          className={`w-full flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                            isGroupActive(group)
                              ? 'bg-accent text-accent-foreground'
                              : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                          }`}
                          title={group.name}
                          type="button"
                        >
                          <GroupIcon className="h-4 w-4 shrink-0" />
                        </button>

                        {hoveredGroup === group.name && popupStyle && (
                          <div
                            className="bg-popover border rounded-lg shadow-lg p-2 min-w-[200px] z-[100]"
                            style={popupStyle}
                            onMouseEnter={cancelClose}
                            onMouseLeave={closePopup}
                          >
                            <p className="px-3 py-2 text-sm font-medium text-muted-foreground border-b">
                              {group.name}
                            </p>
                            <div className="mt-1 space-y-1">
                              {group.tools.map((tool) => {
                                const ToolIcon = tool.icon;
                                return (
                                  <div
                                    key={tool.path}
                                    className="relative group/tool-popup"
                                  >
                                    <MenuToolLink
                                      tool={tool}
                                      className={`flex items-center justify-between space-x-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                                        isToolActive(tool)
                                          ? 'bg-accent text-accent-foreground'
                                          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                                      }`}
                                      onClick={() => {
                                        setSidebarOpen(false);
                                        setHoveredGroup(null);
                                      }}
                                    >
                                      <div className="flex items-center space-x-2 overflow-hidden">
                                        <ToolIcon className="h-4 w-4 shrink-0" />
                                        <span className="truncate">
                                          {tool.name}
                                        </span>
                                        {tool.isExternal && (
                                          <ExternalLink
                                            className="h-3 w-3 shrink-0 opacity-60"
                                            aria-hidden="true"
                                          />
                                        )}
                                      </div>
                                    </MenuToolLink>
                                    <button
                                      onClick={(e) => {
                                        toggleFavorite(tool.path, e);
                                        setHoveredGroup(null);
                                      }}
                                      className={`absolute right-1 top-1/2 -translate-y-1/2 p-1 rounded opacity-0 group-hover/tool-popup:opacity-100 focus-visible:opacity-100 transition-all ${
                                        favorites.has(tool.path)
                                          ? 'opacity-100'
                                          : ''
                                      } hover:bg-amber-100 dark:hover:bg-amber-900/30`}
                                      title={
                                        favorites.has(tool.path)
                                          ? '取消收藏'
                                          : '收藏'
                                      }
                                    >
                                      {favorites.has(tool.path) ? (
                                        <Star className="h-3.5 w-3.5 text-amber-500 dark:text-amber-400 fill-amber-500 dark:fill-amber-400" />
                                      ) : (
                                        <StarOff className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                                      )}
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              {searchQuery && filteredMenuGroups.length === 0 && (
                <div className="text-center py-8 px-4">
                  <FileSearch className="h-10 w-10 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    未找到相关工具
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                    试试其他关键词
                  </p>
                </div>
              )}
            </div>
          </nav>

          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className={`flex-shrink-0 flex items-center justify-center border-t transition-colors h-12 w-full ${
              sidebarCollapsed ? 'hover:bg-accent' : 'gap-2 hover:bg-accent/50'
            }`}
            title={sidebarCollapsed ? '展开菜单' : '收起菜单'}
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">收起导航</span>
              </>
            )}
          </button>
        </aside>

        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <main id="main-content" className="flex-1 min-w-0 overflow-y-auto">
          <div className="min-h-full flex flex-col px-4 py-7 sm:px-7 lg:px-10 lg:py-9">
            <div className="flex-1 mb-8">
              <div className="tool-workspace max-w-[1320px] mx-auto">
                <Outlet />
              </div>
            </div>

            <footer className="py-5 text-center text-xs text-muted-foreground border-t mt-3">
              <div className="max-w-7xl mx-auto space-y-3">
                <div className="flex items-center justify-center gap-4 flex-wrap">
                  <span>© 2026 Create By 云止.</span>
                  <a
                    href="https://github.com/ychp/developer-tool"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-1"
                  >
                    <Code2 className="h-3.5 w-3.5" />
                    本站源代码
                  </a>
                </div>
                <div>
                  <a
                    href="https://beian.miit.gov.cn/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80 transition-colors"
                  >
                    备案号: 浙ICP备2024102079号-2
                  </a>
                </div>
              </div>
            </footer>
          </div>
        </main>
      </div>
      <PWAInstallPrompt />
    </div>
  );
}

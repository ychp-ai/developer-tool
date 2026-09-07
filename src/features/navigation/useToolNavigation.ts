import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  toolGroups as menuGroups,
  toolByPath,
} from '../tool-registry/registry';
import type { ToolDefinition } from '../tool-registry/types';
import { useToolHistory } from './useToolHistory';
import { filterToolGroups } from './search';

export function useToolNavigation() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [hoveredGroup, setHoveredGroup] = useState<string | null>(null);
  const [popupStyle, setPopupStyle] = useState<React.CSSProperties | null>(
    null,
  );
  const [searchQuery, updateSearchQuery] = useState('');
  const [searchFocusRequest, setSearchFocusRequest] = useState(0);
  const [favoritesOpen, setFavoritesOpen] = useState(false);
  const [recentOpen, setRecentOpen] = useState(false);
  const [selectedSearchIndex, setSelectedSearchIndex] = useState(-1);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const homeSearchInputRef = useRef<HTMLInputElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const { favorites, setFavorites, recentTools, setRecentTools } =
    useToolHistory(location.pathname);

  const isToolActive = useCallback(
    (tool: ToolDefinition) =>
      !tool.isExternal && location.pathname === tool.path,
    [location.pathname],
  );
  const isGroupActive = useCallback(
    (group: (typeof menuGroups)[0]) => group.tools.some(isToolActive),
    [isToolActive],
  );

  const filteredMenuGroups = useMemo(
    () => filterToolGroups(menuGroups, searchQuery),
    [searchQuery],
  );

  const [groupSelection, setGroupSelection] = useState<{
    pathname: string;
    groups: Set<string>;
  } | null>(null);
  const activeGroup = menuGroups.find(isGroupActive);
  const openGroups =
    groupSelection?.pathname === location.pathname
      ? groupSelection.groups
      : new Set(activeGroup ? [activeGroup.name] : []);
  const setOpenGroups = (groups: Set<string>) =>
    setGroupSelection({ pathname: location.pathname, groups });

  const closePopup = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    closeTimeoutRef.current = setTimeout(() => {
      setHoveredGroup(null);
    }, 100);
  };

  const cancelClose = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  const flattenedTools = useMemo(
    () => filteredMenuGroups.flatMap((group) => group.tools),
    [filteredMenuGroups],
  );

  const setSearchQuery = useCallback((query: string) => {
    updateSearchQuery(query);
    setSelectedSearchIndex(-1);
  }, []);

  useEffect(() => {
    if (searchFocusRequest > 0) searchInputRef.current?.focus();
  }, [searchFocusRequest]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.isComposing) return;
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (homeSearchInputRef.current) {
          homeSearchInputRef.current.focus();
          return;
        }
        setSidebarCollapsed(false);
        if (window.innerWidth < 1024) setSidebarOpen(true);
        setSearchFocusRequest((request) => request + 1);
        return;
      }

      if (e.key === 'Escape') {
        if (searchQuery) {
          setSearchQuery('');
          setSelectedSearchIndex(-1);
        } else if (sidebarOpen) {
          setSidebarOpen(false);
        } else if (hoveredGroup) {
          setHoveredGroup(null);
        } else if (favoritesOpen) {
          setFavoritesOpen(false);
        } else if (recentOpen) {
          setRecentOpen(false);
        }
        return;
      }

      if (
        (document.activeElement === searchInputRef.current ||
          document.activeElement === homeSearchInputRef.current) &&
        searchQuery.trim() &&
        flattenedTools.length > 0
      ) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedSearchIndex((prev) =>
            prev < flattenedTools.length - 1 ? prev + 1 : prev,
          );
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedSearchIndex((prev) => (prev > 0 ? prev - 1 : 0));
        } else if (e.key === 'Enter') {
          e.preventDefault();
          const selectedTool = flattenedTools[Math.max(0, selectedSearchIndex)];
          if (selectedTool) {
            if (selectedTool.isExternal) {
              window.open(selectedTool.path, '_blank', 'noopener,noreferrer');
            } else {
              navigate(selectedTool.path);
            }
            setSearchQuery('');
            setSelectedSearchIndex(-1);
            if (window.innerWidth < 1024) {
              setSidebarOpen(false);
            }
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    searchQuery,
    selectedSearchIndex,
    flattenedTools,
    sidebarOpen,
    hoveredGroup,
    favoritesOpen,
    recentOpen,
    navigate,
    setSearchQuery,
  ]);

  useEffect(() => {
    if (selectedSearchIndex < 0) return;
    const prefix =
      document.activeElement === homeSearchInputRef.current ? 'home' : 'nav';
    document
      .getElementById(`${prefix}-result-${selectedSearchIndex}`)
      ?.scrollIntoView({ block: 'nearest' });
  }, [selectedSearchIndex]);

  const toggleGroup = (groupName: string) => {
    if (openGroups.has(groupName)) {
      setOpenGroups(new Set());
    } else {
      setOpenGroups(new Set([groupName]));
    }
  };

  const toggleFavorite = (toolPath: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(toolPath)) {
        newFavorites.delete(toolPath);
      } else {
        newFavorites.add(toolPath);
      }
      return newFavorites;
    });
  };

  const removeFromRecent = (toolPath: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setRecentTools((prev) => prev.filter((path) => path !== toolPath));
  };

  const favoriteTools = menuGroups.flatMap((group) =>
    group.tools.filter((tool) => favorites.has(tool.path)),
  );

  const recentToolsList = recentTools
    .map((path) => toolByPath.get(path))
    .filter((tool): tool is NonNullable<typeof tool> => Boolean(tool));

  useEffect(
    () => () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    },
    [],
  );

  return {
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
    homeSearchInputRef,
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
  };
}

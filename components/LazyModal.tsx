import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useLanguage, getContextualTerminology } from './LanguageContext';
import { Suggestion } from './types';
import { SuggestionItem } from './SuggestionItem';

interface LazyModalProps {
  showModal: boolean;
  onClose: () => void;
  suggestions: Suggestion[];
  searchTerm: string;
  showTrending: boolean;
  copyMode: boolean;
  behaviorMode: 'new-tab' | 'same-tab' | 'floating-tab' | 'copy';
  onItemClick: (suggestion: Suggestion) => void;
  searchEngines: Array<{ name: string; value: string; url: string }>;
  selectedEngine: string;
  downloadCSV: (filteredSuggestions: Suggestion[], filterType: string) => void;
}

type FilterType = 'all' | 'explored' | 'remaining';

// Simple Virtual List Component - Same styling as main page
const SimpleVirtualList: React.FC<{
  items: Suggestion[];
  containerHeight: number;
  onItemClick: (suggestion: Suggestion) => void;
  copyMode: boolean;
  behaviorMode: 'new-tab' | 'same-tab' | 'floating-tab' | 'copy';
}> = ({ items, containerHeight, onItemClick, copyMode, behaviorMode }) => {
  const [scrollTop, setScrollTop] = useState(0);
  
  const ITEM_HEIGHT = 76; // Same as main page suggestion items
  const BUFFER_SIZE = 5;
  
  const { startIndex, endIndex, visibleItems, totalHeight, offsetY } = useMemo(() => {
    if (items.length === 0) {
      return { startIndex: 0, endIndex: 0, visibleItems: [], totalHeight: 0, offsetY: 0 };
    }
    
    const startIndex = Math.max(0, Math.floor(scrollTop / ITEM_HEIGHT) - BUFFER_SIZE);
    const visibleCount = Math.ceil(containerHeight / ITEM_HEIGHT);
    const endIndex = Math.min(items.length, startIndex + visibleCount + BUFFER_SIZE * 2);
    
    const visibleItems = items.slice(startIndex, endIndex);
    const totalHeight = items.length * ITEM_HEIGHT;
    const offsetY = startIndex * ITEM_HEIGHT;
    
    return { startIndex, endIndex, visibleItems, totalHeight, offsetY };
  }, [items, scrollTop, containerHeight]);
  
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);
  
  return (
    <div
      style={{
        height: containerHeight,
        overflowY: 'auto',
        overflowX: 'hidden'
      }}
      onScroll={handleScroll}
      className="modal-suggestions-list"
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div
          style={{
            transform: `translateY(${offsetY}px)`,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
          }}
        >
          {visibleItems.map((suggestion) => (
            <div key={suggestion.id}>
              <SuggestionItem
                suggestion={suggestion}
                isSimpleModal={false} // Use same styling as main page
                copyMode={copyMode}
                behaviorMode={behaviorMode}
                onClick={onItemClick}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const LazyModal: React.FC<LazyModalProps> = ({
  showModal,
  onClose,
  suggestions,
  searchTerm,
  showTrending,
  copyMode,
  behaviorMode,
  onItemClick,
  searchEngines,
  selectedEngine,
  downloadCSV
}) => {
  const { t, language } = useLanguage();
  const [currentFilter, setCurrentFilter] = useState<FilterType>('all');
  
  // Get context-aware terminology
  const terminology = getContextualTerminology(t, copyMode);
  
  // Process suggestions based on current filter
  const filteredSuggestions = useMemo(() => {
    if (!suggestions || suggestions.length === 0) {
      return [];
    }
    
    let filtered: Suggestion[];
    
    switch (currentFilter) {
      case 'explored':
        filtered = suggestions.filter(s => s.opened);
        break;
      case 'remaining':
        filtered = suggestions.filter(s => !s.opened);
        break;
      default: // 'all'
        filtered = [...suggestions];
        break;
    }
    
    // Sort: remaining first, then explored sorted by recent
    const remaining = filtered.filter(s => !s.opened);
    const explored = filtered.filter(s => s.opened).sort((a, b) => (b.openedAt || 0) - (a.openedAt || 0));
    
    return [...remaining, ...explored];
  }, [suggestions, currentFilter]);
  
  const handleItemClick = useCallback((suggestion: Suggestion) => {
    onItemClick(suggestion);
  }, [onItemClick]);
  
  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);
  
  // Handle ESC key
  useEffect(() => {
    if (!showModal) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showModal, onClose]);
  
  // Lock body scroll when modal is open
  useEffect(() => {
    if (showModal) {
      document.body.classList.add('modal-open');
      return () => document.body.classList.remove('modal-open');
    }
  }, [showModal]);
  
  // Download handler that uses the CSV function with proper UTF-8 encoding
  const handleDownload = useCallback(() => {
    if (filteredSuggestions.length === 0) {
      return;
    }
    
    // Use the enhanced downloadCSV function with proper UTF-8 encoding
    downloadCSV(filteredSuggestions, currentFilter);
  }, [filteredSuggestions, currentFilter, downloadCSV]);
  
  if (!showModal) {
    return null;
  }
  
  const remainingCount = suggestions.filter(s => !s.opened).length;
  const exploredCount = suggestions.filter(s => s.opened).length;
  const totalCount = suggestions.length;
  
  // Calculate current view counts
  const currentViewCounts = {
    all: totalCount,
    explored: exploredCount,  
    remaining: remainingCount
  };
  
  const modalHeight = Math.min(window.innerHeight * 0.8, 600);
  const headerHeight = 140; // Adjusted for better proportions
  const contentHeight = modalHeight - headerHeight;
  
  return (
    <div 
      className="modal show d-block" 
      tabIndex={-1}
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={handleBackdropClick}
    >
      <div className="modal-dialog modal-xl modal-dialog-centered">
        <div className="modal-content">
          {/* Simplified Modal Header - Clean and minimal */}
          <div className="modal-header border-bottom">
            <div className="w-100">
              {/* Title and Actions Row - Simplified */}
              <div className="d-flex align-items-start justify-content-between mb-3">
                <div className="flex-grow-1 me-3">
                  <h3 className="modal-title mb-0">
                    {showTrending ? t.searchSuggestions : `${searchTerm}`}
                  </h3>
                </div>
                <div className="d-flex align-items-center gap-2 flex-shrink-0">
                  {/* Download Button - Consistent sizing */}
                  <button
                    type="button"
                    className="btn btn-outline-success btn-sm d-flex align-items-center gap-2"
                    onClick={handleDownload}
                    disabled={filteredSuggestions.length === 0}
                    title={t.download}
                  >
                    <i className="bi bi-download"></i>
                    <span className="d-none d-sm-inline">{t.download}</span>
                  </button>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={onClose}
                    aria-label="Close"
                  />
                </div>
              </div>
              
              {/* Filter Buttons Row - Clean layout */}
              <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                <div className="d-flex align-items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    className={`btn btn-sm ${currentFilter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setCurrentFilter('all')}
                  >
                    {t.all} ({currentViewCounts.all.toLocaleString()})
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm ${currentFilter === 'remaining' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setCurrentFilter('remaining')}
                    disabled={remainingCount === 0}
                  >
                    {terminology.remainingCapital} ({currentViewCounts.remaining.toLocaleString()})
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm ${currentFilter === 'explored' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setCurrentFilter('explored')}
                    disabled={exploredCount === 0}
                  >
                    {terminology.exploredCapital} ({currentViewCounts.explored.toLocaleString()})
                  </button>
                </div>
                
                {/* Mode indicators - Minimal and clean */}
                <div className="d-flex align-items-center gap-2">
                  {behaviorMode === 'copy' && <span className="badge bg-info">{t.copyMode}</span>}
                  {behaviorMode === 'same-tab' && <span className="badge bg-secondary">{t.sameTab}</span>}
                  {behaviorMode === 'floating-tab' && <span className="badge bg-primary">{t.floatingTab}</span>}
                </div>
              </div>
            </div>
          </div>
          
          {/* Modal Body - Same styling as main page */}
          <div className="modal-body p-4">
            {filteredSuggestions.length > 0 ? (
              <SimpleVirtualList
                items={filteredSuggestions}
                containerHeight={contentHeight}
                onItemClick={handleItemClick}
                copyMode={copyMode}
                behaviorMode={behaviorMode}
              />
            ) : (
              <div className="text-center py-5 text-muted">
                <i className="bi bi-inbox display-1 mb-3"></i>
                <h5>
                  {currentFilter === 'explored' && exploredCount === 0 && 'No suggestions explored yet'}
                  {currentFilter === 'remaining' && remainingCount === 0 && 'All suggestions have been explored'}
                  {currentFilter === 'all' && totalCount === 0 && 'No suggestions available'}
                </h5>
                <p className="small">
                  {currentFilter === 'explored' && 'Explore some suggestions to see them here'}
                  {currentFilter === 'remaining' && 'Great job exploring all suggestions!'}
                  {currentFilter === 'all' && 'Start typing to generate search suggestions'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

LazyModal.displayName = 'LazyModal';
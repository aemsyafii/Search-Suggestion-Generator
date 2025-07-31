import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useLanguage, getContextualTerminology } from './components/LanguageContext';
import { Suggestion, SearchEngine } from './components/types';
import { 
  generateInitialSuggestions,
  generateInitialSuggestionsAsync,
  generateAdditionalSuggestions, 
  generateTrendingTopics,
  generateTrendingTopicsAsync
} from './components/utils/suggestionGenerators';
import { SuggestionItem } from './components/SuggestionItem';
import { LazyModal } from './components/LazyModal';
import { useDebounce } from './components/hooks/useDebounce';
import { toast } from 'sonner@2.0.3';

export function SearchSuggestions() {
  const { t, language, setLanguage, isRTL } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [trendingSuggestions, setTrendingSuggestions] = useState<Suggestion[]>([]);
  const [openedItems, setOpenedItems] = useState<Set<string>>(new Set());
  const [selectedEngine, setSelectedEngine] = useState<string>('google');
  const [queryCount, setQueryCount] = useState<number>(100);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [isLoadingRandom, setIsLoadingRandom] = useState<boolean>(false);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [isGeneratingLarge, setIsGeneratingLarge] = useState<boolean>(false);
  const [showTrending, setShowTrending] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [previousQueryCount, setPreviousQueryCount] = useState<number>(100);
  const [previousSearchTerm, setPreviousSearchTerm] = useState<string>('');
  const [copyMode, setCopyMode] = useState<boolean>(false);
  const [sameTab, setSameTab] = useState<boolean>(false);
  const [behaviorMode, setBehaviorMode] = useState<'new-tab' | 'same-tab' | 'copy'>('new-tab');
  const [darkMode, setDarkMode] = useState<boolean>(true);
  
  // Get context-aware terminology
  const terminology = getContextualTerminology(t, copyMode);
  
  // RTL-aware statistics formatter
  const formatStatistics = useCallback((remainingCount: number, totalCount: number) => {
    const remainingText = `${remainingCount.toLocaleString()} ${terminology.remaining}`;
    const totalText = `${totalCount.toLocaleString()} ${t.queries.toLowerCase()}`;
    
    if (isRTL) {
      // RTL format: "10000 لم يتم نسخها / 0 تم نسخها"
      return (
        <span className="stats-display" dir="rtl">
          <span className="stats-numbers">
            {remainingText} / {totalText}
          </span>
        </span>
      );
    } else {
      // LTR format: "0 copied / 10000 queries"
      const exploredCount = totalCount - remainingCount;
      const exploredText = `${exploredCount.toLocaleString()} ${terminology.explored}`;
      return (
        <span className="stats-display">
          {exploredText} / {totalText}
        </span>
      );
    }
  }, [terminology, t.queries, isRTL]);
  
  // Debounced search term for performance
  const debouncedSearchTerm = useDebounce(searchTerm, 200);

  // Search engines with translated names
  const searchEngines: SearchEngine[] = [
    { name: t.searchEngines.google, value: 'google', url: 'https://www.google.com/search?q=' },
    { name: t.searchEngines.bing, value: 'bing', url: 'https://www.bing.com/search?q=' },
    { name: t.searchEngines.duckduckgo, value: 'duckduckgo', url: 'https://duckduckgo.com/?q=' },
    { name: t.searchEngines.yahoo, value: 'yahoo', url: 'https://search.yahoo.com/search?p=' },
  ];

  // Load settings from localStorage
  useEffect(() => {
    const savedBehaviorMode = localStorage.getItem('behavior-mode') as 'new-tab' | 'same-tab' | 'copy' || 'new-tab';
    const savedDarkMode = localStorage.getItem('dark-mode');
    // Default to dark mode if no preference saved
    const isDarkMode = savedDarkMode === null ? true : savedDarkMode === 'true';
    
    setBehaviorMode(savedBehaviorMode);
    setCopyMode(savedBehaviorMode === 'copy');
    setSameTab(savedBehaviorMode === 'same-tab');
    setDarkMode(isDarkMode);
    
    // Apply dark mode to document
    document.documentElement.setAttribute('data-bs-theme', isDarkMode ? 'dark' : 'light');
  }, []);

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('behavior-mode', behaviorMode);
    setCopyMode(behaviorMode === 'copy');
    setSameTab(behaviorMode === 'same-tab');
  }, [behaviorMode]);

  useEffect(() => {
    localStorage.setItem('dark-mode', darkMode.toString());
    document.documentElement.setAttribute('data-bs-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  // Get the actual suggestions to display
  const currentSuggestionsList = showTrending ? trendingSuggestions : suggestions;
  const remainingCount = currentSuggestionsList.filter(s => !s.opened).length;
  const totalCount = currentSuggestionsList.length;

  return (
    <div>
      {/* Search Input Section */}
      <div className="position-relative mb-4">
        <div className="position-relative">
          <input
            type="text"
            className="form-control search-input"
            placeholder={t.searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            dir={isRTL ? 'rtl' : 'ltr'}
          />
          <i className="bi bi-search input-group-icon start"></i>
          <button
            type="button"
            className={`btn-icon ${isSpinning ? 'spin' : ''}`}
            onClick={() => {
              setIsSpinning(true);
              setTimeout(() => setIsSpinning(false), 1000);
              // Generate trending topics
            }}
            title={t.generateSuggestions}
          >
            <i className="bi bi-shuffle"></i>
          </button>
        </div>
      </div>

      {/* Statistics Display - RTL Aware */}
      {totalCount > 0 && (
        <div className={`mb-3 stats-text ${isRTL ? 'text-end' : 'text-start'}`}>
          {formatStatistics(remainingCount, totalCount)}
        </div>
      )}

      {/* Show All Button */}
      {totalCount > 3 && (
        <div className="text-center mb-4">
          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={() => setShowModal(true)}
          >
            {t.showAll} ({totalCount.toLocaleString()})
          </button>
        </div>
      )}

      {/* Modal */}
      <LazyModal
        showModal={showModal}
        onClose={() => setShowModal(false)}
        suggestions={currentSuggestionsList}
        searchTerm={searchTerm}
        showTrending={showTrending}
        copyMode={copyMode}
        sameTab={sameTab}
        onItemClick={() => {}}
        searchEngines={searchEngines}
        selectedEngine={selectedEngine}
      />
    </div>
  );
}
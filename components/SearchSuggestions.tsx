import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useLanguage, getContextualTerminology } from './LanguageContext';
import { Suggestion, SearchEngine } from './types';
import { 
  generateInitialSuggestions,
  generateInitialSuggestionsAsync,
  generateAdditionalSuggestions, 
  generateTrendingTopics,
  generateTrendingTopicsAsync
} from './utils/suggestionGenerators';
import { SuggestionItem } from './SuggestionItem';
import { LazyModal } from './LazyModal';
import { useDebounce } from './hooks/useDebounce';
import { toast } from 'sonner';

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
  const [behaviorMode, setBehaviorMode] = useState<'new-tab' | 'same-tab' | 'floating-tab' | 'copy'>('new-tab');
  const [darkMode, setDarkMode] = useState<boolean>(true);
  
  // Auto Mode Feature States - Updated default duration to 7-11
  const [autoRunEnabled, setAutoRunEnabled] = useState<boolean>(false);
  const [autoRunDuration, setAutoRunDuration] = useState<number>(9); // Default 9 seconds (will be randomized)
  const [autoRunMinDuration, setAutoRunMinDuration] = useState<number>(7);
  const [autoRunMaxDuration, setAutoRunMaxDuration] = useState<number>(11); // Changed from 9 to 11
  const [autoRunTimer, setAutoRunTimer] = useState<NodeJS.Timeout | null>(null);
  const [autoRunTimeLeft, setAutoRunTimeLeft] = useState<number>(0);
  const [autoRunCountdown, setAutoRunCountdown] = useState<NodeJS.Timeout | null>(null);
  const [isAutoRunning, setIsAutoRunning] = useState<boolean>(false);
  
  const [floatingTab, setFloatingTab] = useState<{ 
    isOpen: boolean; 
    url: string; 
    title: string; 
    hasError: boolean;
  }>({ 
    isOpen: false, 
    url: '', 
    title: '',
    hasError: false
  });
  
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
    { name: t.searchEngines.bingedgear, value: 'bingedgear', url: 'https://www.bing.com/search?q=' },
  ];

  // Get URL for selected search engine with proper parameters
  const getSearchUrl = useCallback((query: string): string => {
    const engine = searchEngines.find(e => e.value === selectedEngine);
    if (!engine) return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    
    const encodedQuery = encodeURIComponent(query);
    
    // Special handling for Q-Bing with required parameters
    if (selectedEngine === 'bingedgear') {
      return `https://www.bing.com/search?q=${encodedQuery}&form=QBRE`;
    }
    
    // Use the standard URL format for all engines
    return `${engine.url}${encodedQuery}`;
  }, [selectedEngine]);

  // Check if search engine supports iframe display
  const supportsIframe = useCallback((engine: string): boolean => {
    // Only Bing and Q-Bing typically support iframe embedding
    return ['bing', 'bingedgear'].includes(engine);
  }, []);



  // Auto Mode Helper Functions
  const clearAutoRunTimers = useCallback(() => {
    if (autoRunTimer) {
      clearTimeout(autoRunTimer);
      setAutoRunTimer(null);
    }
    if (autoRunCountdown) {
      clearInterval(autoRunCountdown);
      setAutoRunCountdown(null);
    }
    setAutoRunTimeLeft(0);
    setIsAutoRunning(false);
  }, [autoRunTimer, autoRunCountdown]);

  const getRandomDuration = useCallback(() => {
    return Math.floor(Math.random() * (autoRunMaxDuration - autoRunMinDuration + 1)) + autoRunMinDuration;
  }, [autoRunMinDuration, autoRunMaxDuration]);

  // Sort suggestions: opened items first (by most recently opened), then unopened
  const sortedSuggestions = useMemo(() => {
    return [...suggestions].sort((a, b) => {
      if (a.opened && !b.opened) return -1;
      if (!a.opened && b.opened) return 1;
      if (a.opened && b.opened) {
        return (b.openedAt || 0) - (a.openedAt || 0);
      }
      return 0;
    });
  }, [suggestions]);

  // Optimized grouped suggestions with memoization
  const allSuggestionsForModal = useMemo(() => {
    return showTrending ? trendingSuggestions : sortedSuggestions;
  }, [showTrending, trendingSuggestions, sortedSuggestions]);

  // Get preview suggestions: only show unclicked suggestions, replace clicked ones with new ones
  const previewSuggestions = useMemo(() => {
    if (showTrending) {
      // For trending topics, show unopened ones first, then opened ones
      const unopened = trendingSuggestions.filter(s => !s.opened);
      return unopened.slice(0, 3);
    }
    
    const unopened = sortedSuggestions.filter(s => !s.opened);
    
    // Always show up to 3 unclicked suggestions
    return unopened.slice(0, 3);
  }, [sortedSuggestions, showTrending, trendingSuggestions]);

  // Auto mode now picks from ALL unopened suggestions using current state
  const getRandomFromAllUnopenedWithState = useCallback((currentOpenedItems: Set<string>) => {
    // Get ALL suggestions first, then filter using current openedItems Set
    const allSuggestions = showTrending ? trendingSuggestions : suggestions;
    const allUnopenedSuggestions = allSuggestions.filter(s => !currentOpenedItems.has(s.id));
    
    if (allUnopenedSuggestions.length === 0) {
      return null;
    }
    
    // Pick random from ALL unopened suggestions
    const randomIndex = Math.floor(Math.random() * allUnopenedSuggestions.length);
    const selected = allUnopenedSuggestions[randomIndex];
    return selected;
  }, [suggestions, trendingSuggestions, showTrending]);

  const startAutoRunTimer = useCallback((duration: number) => {
    clearAutoRunTimers();
    
    setIsAutoRunning(true);
    setAutoRunTimeLeft(duration);
    
    // Countdown timer for UI
    const countdownInterval = setInterval(() => {
      setAutoRunTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    setAutoRunCountdown(countdownInterval);
    
    // Main timer for auto close
    const mainTimer = setTimeout(() => {
      // Close floating tab
      setFloatingTab({ isOpen: false, url: '', title: '', hasError: false });
      
      // Clear timers
      clearAutoRunTimers();
      
      // Auto open next suggestion after a brief delay to allow state to settle
      setTimeout(() => {
        if (autoRunEnabled && behaviorMode === 'floating-tab') {
          // Use current state directly to make decisions
          setOpenedItems(currentOpenedItems => {
            // Use current openedItems state to check and get next suggestion
            const nextSuggestion = getRandomFromAllUnopenedWithState(currentOpenedItems);
            
            if (nextSuggestion) {
              // Use setTimeout to break out of setState
              setTimeout(() => handleSuggestionClick(nextSuggestion), 0);
            } else {
              // No more suggestions, properly stop auto mode
              setIsAutoRunning(false);
              
              // Show completion message
              const completionMessages = {
                'en': 'Auto Mode completed - all suggestions explored!',
                'id': 'Mode Otomatis selesai - semua saran telah dijelajahi!',
                'ar': 'اكتمل الوضع التلقائي - تم استكشاف جميع الاقتراحات!',
                'zh': '自动模式完成 - 所有建议都已探索！',
                'ja': '自動モード完了 - すべての提案が探索されました！',
                'ru': 'Автоматический режим завершен - все предложения изучены!',
                'es': '¡Modo Automático completado - todas las sugerencias exploradas!',
                'fr': 'Mode Automatique terminé - toutes les suggestions explorées !',
                'de': 'Automatischer Modus abgeschlossen - alle Vorschläge erkundet!',
                'pt': 'Modo Automático concluído - todas as sugestões exploradas!',
                'hi': 'ऑटो मोड पूर्ण - सभी सुझाव खोजे गए!',
                'ko': '자동 모드 완료 - 모든 제안이 탐색되었습니다!',
                'he': 'מצב אוטומטי הושלם - כל ההצעות נחקרו!'
              };
              
              toast.success(completionMessages[language] || completionMessages['en'], {
                duration: 4000,
              });
            }
            
            return currentOpenedItems; // Return unchanged
          });
        }
      }, 1000); // Increased delay to allow all state updates to settle
    }, duration * 1000);
    
    setAutoRunTimer(mainTimer);
  }, [autoRunEnabled, behaviorMode, clearAutoRunTimers, getRandomFromAllUnopenedWithState, language, showTrending, suggestions, trendingSuggestions]);

  // Load settings from localStorage - Updated default max duration to 11
  useEffect(() => {
    const savedBehaviorMode = localStorage.getItem('behavior-mode') as 'new-tab' | 'same-tab' | 'floating-tab' | 'copy' || 'new-tab';
    const savedDarkMode = localStorage.getItem('dark-mode');
    const savedQueryCount = localStorage.getItem('query-count');
    const savedSearchEngine = localStorage.getItem('search-engine');
    const savedLanguage = localStorage.getItem('language');
    const savedAutoRunEnabled = localStorage.getItem('auto-run-enabled');
    const savedAutoRunMinDuration = localStorage.getItem('auto-run-min-duration');
    const savedAutoRunMaxDuration = localStorage.getItem('auto-run-max-duration');
    
    // Default to dark mode if no preference saved
    const isDarkMode = savedDarkMode === null ? true : savedDarkMode === 'true';
    
    setBehaviorMode(savedBehaviorMode);
    setCopyMode(savedBehaviorMode === 'copy');
    setSameTab(savedBehaviorMode === 'same-tab');
    setDarkMode(isDarkMode);
    
    // Load auto mode settings - Updated default max duration
    setAutoRunEnabled(savedAutoRunEnabled === 'true');
    setAutoRunMinDuration(savedAutoRunMinDuration ? parseInt(savedAutoRunMinDuration, 10) : 7);
    setAutoRunMaxDuration(savedAutoRunMaxDuration ? parseInt(savedAutoRunMaxDuration, 10) : 11); // Changed from 9 to 11
    
    // Search term always starts empty for fresh experience on every refresh
    // User wants clean slate each time they visit the app
    // Remove any previously saved search term to ensure clean start
    localStorage.removeItem('search-term');
    
    // Load and validate query count
    if (savedQueryCount) {
      const parsedCount = parseInt(savedQueryCount, 10);
      if (!isNaN(parsedCount) && [10, 50, 100, 200, 500, 1000].includes(parsedCount)) {
        setQueryCount(parsedCount);
        setPreviousQueryCount(parsedCount);
      }
    }
    
    // Load and validate search engine
    if (savedSearchEngine) {
      const validEngines = ['google', 'bing', 'duckduckgo', 'yahoo', 'bingedgear'];
      if (validEngines.includes(savedSearchEngine)) {
        setSelectedEngine(savedSearchEngine);
      }
    }
    
    // Load and validate language
    if (savedLanguage) {
      const validLanguages = ['en', 'id', 'ar', 'zh', 'ja', 'ru', 'es', 'fr', 'de', 'pt', 'hi', 'ko'];
      if (validLanguages.includes(savedLanguage)) {
        setLanguage(savedLanguage);
      }
    }
    
    // Apply dark mode to document
    document.documentElement.setAttribute('data-bs-theme', isDarkMode ? 'dark' : 'light');
  }, [setLanguage]);

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

  // Save auto mode settings
  useEffect(() => {
    localStorage.setItem('auto-run-enabled', autoRunEnabled.toString());
  }, [autoRunEnabled]);

  useEffect(() => {
    localStorage.setItem('auto-run-min-duration', autoRunMinDuration.toString());
  }, [autoRunMinDuration]);

  useEffect(() => {
    localStorage.setItem('auto-run-max-duration', autoRunMaxDuration.toString());
  }, [autoRunMaxDuration]);

  // Save query count to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('query-count', queryCount.toString());
  }, [queryCount]);

  // Save search engine to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('search-engine', selectedEngine);
  }, [selectedEngine]);

  // Save language to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  // Search term is not persisted - fresh start on every refresh as requested by user

  // Clear auto mode timers when floating tab is manually closed or behavior mode changes
  useEffect(() => {
    if (!floatingTab.isOpen || behaviorMode !== 'floating-tab') {
      clearAutoRunTimers();
    }
  }, [floatingTab.isOpen, behaviorMode, clearAutoRunTimers]);

  // Reset opened items when debounced search term changes - optimized for responsiveness
  // This ensures fresh start for user input (no persistence, clean slate on refresh)
  useEffect(() => {
    if (debouncedSearchTerm !== previousSearchTerm) {
      // Always reset opened items for fresh suggestion results
      setOpenedItems(new Set());
      
      // Clear auto mode when search term changes
      clearAutoRunTimers();
      
      // If user starts typing, hide trending suggestions
      if (debouncedSearchTerm.trim()) {
        setShowTrending(false);
        setTrendingSuggestions([]);
      }
      
      // Generate initial suggestions for new search term
      if (debouncedSearchTerm.trim()) {
        // Always show immediate quick suggestions first for responsiveness
        const quickCount = Math.min(3, queryCount); // Show 3 quick suggestions immediately
        const quickSuggestions = generateInitialSuggestions(
          debouncedSearchTerm, 
          quickCount,
          language
        );
        setSuggestions(quickSuggestions);
        
        // For larger counts, generate in background without blocking
        if (queryCount > quickCount) {
          const remainingCount = queryCount - quickCount;
          
          // Use requestIdleCallback for better performance
          const generateRemaining = () => {
            if (queryCount > 200) {
              // Use async generation for large counts
              setIsGeneratingLarge(true);
              
              generateInitialSuggestionsAsync(debouncedSearchTerm, remainingCount, language)
                .then(additionalSuggestions => {
                  // Only update if user hasn't changed search term while generating  
                  if (debouncedSearchTerm.trim() && debouncedSearchTerm === previousSearchTerm) {
                    setSuggestions(prevSuggestions => {
                      // Ensure we don't exceed the desired count
                      const combined = [...prevSuggestions, ...additionalSuggestions];
                      return combined.slice(0, queryCount);
                    });
                  }
                  setIsGeneratingLarge(false);
                })
                .catch(error => {
                  console.error('Error generating additional suggestions:', error);
                  setIsGeneratingLarge(false);
                });
            } else {
              // For smaller counts, generate immediately but yield to browser
              const additionalSuggestions = generateInitialSuggestions(debouncedSearchTerm, remainingCount, language);
              setSuggestions(prevSuggestions => {
                const combined = [...prevSuggestions, ...additionalSuggestions];
                return combined.slice(0, queryCount);
              });
            }
          };

          if (window.requestIdleCallback) {
            window.requestIdleCallback(generateRemaining);
          } else {
            setTimeout(generateRemaining, 16); // Next frame
          }
        }
      } else {
        setSuggestions([]);
        setIsGeneratingLarge(false);
      }
      
      setPreviousSearchTerm(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, queryCount, previousSearchTerm, language, clearAutoRunTimers]);

  // Handle query count changes for existing suggestions - optimized for responsiveness
  useEffect(() => {
    const currentCount = queryCount;
    const previousCount = previousQueryCount;
    
    // Only handle query count changes if search term hasn't changed and we're not loading random
    if (currentCount !== previousCount && debouncedSearchTerm === previousSearchTerm && !isLoadingRandom) {
      if (debouncedSearchTerm.trim()) {
        setSuggestions(prevSuggestions => {
          if (currentCount > previousCount) {
            // Add more suggestions - use async for large additions
            const additionalCount = currentCount - previousCount;
            
            if (additionalCount > 50) {
              // Generate in background for large additions
              const generateLarge = () => {
                if (debouncedSearchTerm === previousSearchTerm) {
                  const additionalSuggestions = generateAdditionalSuggestions(debouncedSearchTerm, prevSuggestions, additionalCount, language);
                  setSuggestions(currentSuggestions => {
                    const combined = [...currentSuggestions, ...additionalSuggestions];
                    return combined.slice(0, currentCount);
                  });
                }
              };

              if (window.requestIdleCallback) {
                window.requestIdleCallback(generateLarge);
              } else {
                setTimeout(generateLarge, 16);
              }
              return prevSuggestions; // Return unchanged for now
            } else {
              // Generate immediately for small additions
              const additionalSuggestions = generateAdditionalSuggestions(debouncedSearchTerm, prevSuggestions, additionalCount, language);
              const combined = [...prevSuggestions, ...additionalSuggestions];
              return combined.slice(0, currentCount);
            }
          } else {
            // Remove suggestions from the end - immediate operation
            return prevSuggestions.slice(0, currentCount);
          }
        });
      }
      
      // Handle trending suggestions count changes
      if (showTrending && !debouncedSearchTerm.trim()) {
        setTrendingSuggestions(prevTrending => {
          if (currentCount > previousCount) {
            // Add more trending suggestions
            const additionalCount = currentCount - previousCount;
            
            if (additionalCount > 50) {
              // Generate in background for large additions
              const generateTrendingLarge = () => {
                const additionalTrending = generateTrendingTopics(additionalCount, language, selectedEngine);
                setTrendingSuggestions(currentTrending => {
                  const combined = [...currentTrending, ...additionalTrending];
                  return combined.slice(0, currentCount);
                });
              };

              if (window.requestIdleCallback) {
                window.requestIdleCallback(generateTrendingLarge);
              } else {
                setTimeout(generateTrendingLarge, 16);
              }
              return prevTrending; // Return unchanged for now
            } else {
              // Generate immediately for small additions
              const additionalTrending = generateTrendingTopics(additionalCount, language, selectedEngine);
              const combined = [...prevTrending, ...additionalTrending];
              return combined.slice(0, currentCount);
            }
          } else {
            // Remove trending suggestions from the end - immediate operation
            return prevTrending.slice(0, currentCount);
          }
        });
      }
    }
    
    setPreviousQueryCount(currentCount);
  }, [queryCount, previousQueryCount, debouncedSearchTerm, previousSearchTerm, showTrending, language, selectedEngine, isLoadingRandom]);

  // Regenerate suggestions when language changes
  useEffect(() => {
    if (debouncedSearchTerm.trim()) {
      const newSuggestions = generateInitialSuggestions(debouncedSearchTerm, queryCount, language);
      setSuggestions(newSuggestions);
      setOpenedItems(new Set());
    }
    
    if (showTrending) {
      const newTrendingSuggestions = generateTrendingTopics(queryCount, language, selectedEngine);
      setTrendingSuggestions(newTrendingSuggestions);
      setOpenedItems(new Set());
    }
  }, [language, debouncedSearchTerm, queryCount, showTrending, selectedEngine]);

  // Enhanced CSV Download functionality with dynamic format based on mode and filter
  const downloadCSV = useCallback((filteredSuggestions: Suggestion[], filterType: string) => {
    try {
      // Get current date and time for filename and header
      const now = new Date();
      const dateStr = now.toLocaleDateString('en-CA'); // YYYY-MM-DD format
      const dateTimeStr = now.toLocaleString('en-US', { 
        year: 'numeric',
        month: 'numeric', 
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }).replace(',', ''); // Full datetime format like "7/30/2025 12:58:17 AM" (without comma)
      
      // Enhanced language code mapping with proper filename support
      const getLanguageCode = (lang: string) => {
        const langMap: { [key: string]: string } = {
          'en': 'en', 'id': 'id', 'ar': 'ar', 'zh': 'zh', 'ja': 'ja', 'ru': 'ru',
          'es': 'es', 'fr': 'fr', 'de': 'de', 'pt': 'pt', 'hi': 'hi', 'ko': 'ko', 'he': 'he'
        };
        return langMap[lang] || 'en';
      };
      
      // Safe filename generation - ASCII safe for all systems
      const langCode = getLanguageCode(language);
      const safeAppNames: { [key: string]: string } = {
        'en': 'search-suggestion-generator',
        'id': 'generator-saran-pencarian', 
        'ar': 'search-suggestion-generator-ar',
        'zh': 'search-suggestion-generator-zh',
        'ja': 'search-suggestion-generator-ja',
        'ru': 'search-suggestion-generator-ru',
        'es': 'generador-sugerencias-busqueda',
        'fr': 'generateur-suggestions-recherche',
        'de': 'suchvorschlag-generator',
        'pt': 'gerador-sugestoes-pesquisa',
        'hi': 'search-suggestion-generator-hi',
        'ko': 'search-suggestion-generator-ko',
        'he': 'search-suggestion-generator-he'
      };
      
      const safeFilterNames: { [key: string]: { [key: string]: string } } = {
        'all': {
          'en': 'all', 'id': 'semua', 'ar': 'all', 'zh': 'all', 'ja': 'all', 'ru': 'all',
          'es': 'todos', 'fr': 'tous', 'de': 'alle', 'pt': 'todos', 
          'hi': 'all', 'ko': 'all', 'he': 'all'
        },
        'explored': {
          'en': 'opened', 'id': 'sudah-dibuka', 'ar': 'opened', 'zh': 'opened', 'ja': 'opened', 'ru': 'opened',
          'es': 'abiertos', 'fr': 'ouverts', 'de': 'geoeffnet', 'pt': 'abertos',
          'hi': 'opened', 'ko': 'opened', 'he': 'opened'
        },
        'remaining': {
          'en': 'unopened', 'id': 'belum-dibuka', 'ar': 'unopened', 'zh': 'unopened', 'ja': 'unopened', 'ru': 'unopened',
          'es': 'no-abiertos', 'fr': 'non-ouverts', 'de': 'nicht-geoeffnet', 'pt': 'nao-abertos',
          'hi': 'unopened', 'ko': 'unopened', 'he': 'unopened'
        }
      };
      
      const safeAppName = safeAppNames[langCode] || safeAppNames['en'];
      const safeFilterName = safeFilterNames[filterType]?.[langCode] || safeFilterNames[filterType]?.['en'] || filterType;
      const filename = `${safeAppName}-${safeFilterName}-${dateStr}.csv`;
      
      // Get localized filter status text
      const getFilterStatusText = () => {
        const filterTexts = {
          'all': {
            'en': 'All', 'id': 'Semua', 'ar': 'الكل', 'zh': '全部', 'ja': 'すべて', 'ru': 'Все',
            'es': 'Todos', 'fr': 'Tous', 'de': 'Alle', 'pt': 'Todos', 'hi': 'सभी', 'ko': '모든', 'he': 'הכל'
          },
          'explored': (() => {
            // Check if we have mixed actions (both copied and opened suggestions)
            const hasCopiedSuggestions = filteredSuggestions.some(s => s.opened && s.actionType === 'copy');
            const hasOpenedSuggestions = filteredSuggestions.some(s => s.opened && s.actionType !== 'copy');
            const isMixedMode = hasCopiedSuggestions && hasOpenedSuggestions;
            
            if (isMixedMode) {
              return {
                'en': 'Opened/Copied', 'id': 'Dibuka/Disalin', 'ar': 'تم الفتح/النسخ', 'zh': '已打开/复制', 'ja': '開いた/コピー済み', 'ru': 'Открыto/Скопировано',
                'es': 'Abierto/Copiado', 'fr': 'Ouvert/Copié', 'de': 'Geöffnet/Kopiert', 'pt': 'Aberto/Copiado', 'hi': 'खोला गया/कॉपी किया गया', 'ko': '열림/복사됨', 'he': 'נפתח/הועתק'
              };
            } else if (copyMode || behaviorMode === 'copy') {
              return {
                'en': 'Copied', 'id': 'Sudah Disalin', 'ar': 'تم النسخ', 'zh': '已复制', 'ja': 'コピー済み', 'ru': 'Скопировано',
                'es': 'Copiado', 'fr': 'Copié', 'de': 'Kopiert', 'pt': 'Copiado', 'hi': 'कॉपी किया गया', 'ko': '복사됨', 'he': 'הועתק'
              };
            } else {
              return {
                'en': 'Opened', 'id': 'Sudah Dibuka', 'ar': 'تم الفتح', 'zh': '已打开', 'ja': '開いた', 'ru': 'Открыто',
                'es': 'Abierto', 'fr': 'Ouvert', 'de': 'Geöffnet', 'pt': 'Aberto', 'hi': 'खोला गया', 'ko': '열림', 'he': 'נפתח'
              };
            }
          })(),
          'remaining': copyMode ? {
            'en': 'Not Copied', 'id': 'Belum Disalin', 'ar': 'لم يتم النسخ', 'zh': '未复制', 'ja': '未コピー', 'ru': 'Не скопировано',
            'es': 'No copiado', 'fr': 'Non copié', 'de': 'Nicht kopiert', 'pt': 'Não copiado', 'hi': 'कॉपी नहीं किया गया', 'ko': '복사되지 않음', 'he': 'לא הועתק'
          } : {
            'en': 'Not Opened', 'id': 'Belum Dibuka', 'ar': 'لم يتم الفتح', 'zh': '未打开', 'ja': '未開', 'ru': 'Не открыto',
            'es': 'No abierto', 'fr': 'Non ouvert', 'de': 'Nicht geöffnet', 'pt': 'Não aberto', 'hi': 'नहीं खोला गया', 'ko': '열지 않음', 'he': 'לא נפתח'
          }
        };
        
        return filterTexts[filterType]?.[language] || filterTexts[filterType]?.['en'] || filterType;
      };
      
      // Dynamic CSV headers based on filter and mode
      const getDynamicHeaders = () => {
        // Base header - always present
        const baseHeaders = [
          language === 'en' ? 'No' :
          language === 'id' ? 'No' :
          language === 'ar' ? 'رقم' :
          language === 'zh' ? '编号' :
          language === 'ja' ? '番号' :
          language === 'ru' ? 'Номер' :
          language === 'es' ? 'No' :
          language === 'fr' ? 'No' :
          language === 'de' ? 'Nr' :
          language === 'pt' ? 'No' :
          language === 'hi' ? 'सं' :
          language === 'ko' ? '번호' :
          language === 'he' ? 'מס' :
          'No',
          
          language === 'en' ? 'Search Suggestion' :
          language === 'id' ? 'Saran Pencarian' :
          language === 'ar' ? 'اقتراح البحث' :
          language === 'zh' ? '搜索建议' :
          language === 'ja' ? '検索提案' :
          language === 'ru' ? 'Поисковое предложение' :
          language === 'es' ? 'Sugerencia de búsqueda' :
          language === 'fr' ? 'Suggestion de recherche' :
          language === 'de' ? 'Suchvorschlag' :
          language === 'pt' ? 'Sugestão de pesquisa' :
          language === 'hi' ? 'खोज सुझाव' :
          language === 'ko' ? '검색 제안' :
          language === 'he' ? 'הצעת חיפוש' :
          'Search Suggestion'
        ];
        
        // For "all" filter, include status and time columns
        if (filterType === 'all') {
          baseHeaders.push(
            language === 'en' ? 'Status' :
            language === 'id' ? 'Status' :
            language === 'ar' ? 'الحالة' :
            language === 'zh' ? '状态' :
            language === 'ja' ? 'ステータス' :
            language === 'ru' ? 'Статус' :
            language === 'es' ? 'Estado' :
            language === 'fr' ? 'Statut' :
            language === 'de' ? 'Status' :
            language === 'pt' ? 'Status' :
            language === 'hi' ? 'स्थिति' :
            language === 'ko' ? '상태' :
            language === 'he' ? 'מצב' :
            'Status',
            
            (() => {
              // Check for mixed mode for time column header
              const hasCopiedSuggestions = filteredSuggestions.some(s => s.opened && s.actionType === 'copy');
              const hasOpenedSuggestions = filteredSuggestions.some(s => s.opened && s.actionType !== 'copy');
              const isMixedMode = hasCopiedSuggestions && hasOpenedSuggestions;
              
              if (isMixedMode) {
                return language === 'en' ? 'Time Accessed/Copied' :
                       language === 'id' ? 'Waktu Diakses/Disalin' :
                       language === 'ar' ? 'وقت الوصول/النسخ' :
                       language === 'zh' ? '访问时间/复制时间' :
                       language === 'ja' ? 'アクセス時間/コピー時間' :
                       language === 'ru' ? 'Время доступа/копирования' :
                       language === 'es' ? 'Tiempo de acceso/copiado' :
                       language === 'fr' ? 'Heure d\'accès/copie' :
                       language === 'de' ? 'Zugriffszeit/Kopierzeit' :
                       language === 'pt' ? 'Tempo de acesso/copiado' :
                       language === 'hi' ? 'पहुंच का समय/कॉपी का समय' :
                       language === 'ko' ? '접근 시간/복사 시간' :
                       language === 'he' ? 'זמן גישה/העתקה' :
                       'Time Accessed/Copied';
              } else if (copyMode || behaviorMode === 'copy') {
                return language === 'en' ? 'Time Copied' :
                       language === 'id' ? 'Waktu Disalin' :
                       language === 'ar' ? 'وقت النسخ' :
                       language === 'zh' ? '复制时间' :
                       language === 'ja' ? 'コピー時間' :
                       language === 'ru' ? 'Время копирования' :
                       language === 'es' ? 'Tiempo copiado' :
                       language === 'fr' ? 'Heure de copie' :
                       language === 'de' ? 'Kopierzeit' :
                       language === 'pt' ? 'Tempo copiado' :
                       language === 'hi' ? 'कॉपी का समय' :
                       language === 'ko' ? '복사 시간' :
                       language === 'he' ? 'זמן העתקה' :
                       'Time Copied';
              } else {
                return language === 'en' ? 'Time Accessed' :
                       language === 'id' ? 'Waktu Diakses' :
                       language === 'ar' ? 'وقت الوصول' :
                       language === 'zh' ? '访问时间' :
                       language === 'ja' ? 'アクセス時間' :
                       language === 'ru' ? 'Время доступа' :
                       language === 'es' ? 'Tiempo de acceso' :
                       language === 'fr' ? 'Heure d\'accès' :
                       language === 'de' ? 'Zugriffszeit' :
                       language === 'pt' ? 'Tempo de acesso' :
                       language === 'hi' ? 'पहुंच का समय' :
                       language === 'ko' ? '접근 시간' :
                       language === 'he' ? 'זמן גישה' :
                       'Time Accessed';
              }
            })()
          );
        }
        // For "explored" filter (opened/copied), add time column
        else if (filterType === 'explored') {
          baseHeaders.push(
            copyMode ? (
              language === 'en' ? 'Time Copied' :
              language === 'id' ? 'Waktu Disalin' :
              language === 'ar' ? 'وقت النسخ' :
              language === 'zh' ? '复制时间' :
              language === 'ja' ? 'コピー时间' :
              language === 'ru' ? 'Время копирования' :
              language === 'es' ? 'Tiempo copiado' :
              language === 'fr' ? 'Heure de copie' :
              language === 'de' ? 'Kopierzeit' :
              language === 'pt' ? 'Tempo copiado' :
              language === 'hi' ? 'कॉपी का समय' :
              language === 'ko' ? '복사 시간' :
              language === 'he' ? 'זמן העתקה' :
              'Time Copied'
            ) : (
              language === 'en' ? 'Time Accessed' :
              language === 'id' ? 'Waktu Diakses' :
              language === 'ar' ? 'وقت الوصول' :
              language === 'zh' ? '访问时间' :
              language === 'ja' ? 'アクセス時間' :
              language === 'ru' ? 'Время доступа' :
              language === 'es' ? 'Tiempo de acceso' :
              language === 'fr' ? 'Heure d\'accès' :
              language === 'de' ? 'Zugriffszeit' :
              language === 'pt' ? 'Tempo de acesso' :
              language === 'hi' ? 'पहुंच का समय' :
              language === 'ko' ? '접근 시간' :
              language === 'he' ? 'זמן גישה' :
              'Time Accessed'
            )
          );
        }
        // For "remaining" filter (unopened/not copied), only basic columns
        
        return baseHeaders;
      };
      
      // Enhanced metadata header with new format
      const getEnhancedMetadata = () => {
        const totalQueriesText = {
          'en': 'Total queries', 'id': 'Total kueri', 'ar': 'إجمالي الاستعلامات',
          'zh': '总查询数', 'ja': '総クエリ数', 'ru': 'Всего запросов', 'es': 'Total de consultas',
          'fr': 'Total des requêtes', 'de': 'Gesamte Abfragen', 'pt': 'Total de consultas',
          'hi': 'कुल क्वेरी', 'ko': '총 쿼리', 'he': 'סך כל השאילתות'
        }[language] || 'Total queries';
        
        const statusText = {
          'en': 'Status', 'id': 'Status', 'ar': 'الحالة', 'zh': '状态', 'ja': 'ステータス', 'ru': 'Статус',
          'es': 'Estado', 'fr': 'Statut', 'de': 'Status', 'pt': 'Status', 'hi': 'स्थिति', 'ko': '상태', 'he': 'מצב'
        }[language] || 'Status';
        
        const generatedText = {
          'en': 'Generated on', 'id': 'Dihasilkan pada', 'ar': 'تم إنشاؤها في', 
          'zh': '生成于', 'ja': '生成日', 'ru': 'Создано', 'es': 'Generado el',
          'fr': 'Généré le', 'de': 'Erstellt am', 'pt': 'Gerado em', 
          'hi': 'पर बनाया गया', 'ko': '생성 날짜', 'he': 'נוצר ב'
        }[language] || 'Generated on';
        
        return [
          `# ${t.appTitle}`,
          `# ${totalQueriesText}: ${filteredSuggestions.length}`,
          `# ${statusText}: ${getFilterStatusText()}`,
          `# ${generatedText}: ${dateTimeStr}`,
          `# aemsyafii.github.io/Search-Suggestion-Generator`,
          '' // Empty line
        ];
      };
      
      // Enhanced status text with proper localization based on actual action taken
      const getStatusText = (suggestion: Suggestion) => {
        const statusTexts = {
          'copied': {
            'en': 'Copied', 'id': 'Sudah Disalin', 'ar': 'تم النسخ', 'zh': '已复制', 'ja': 'コピー済み',
            'ru': 'Скопировано', 'es': 'Copiado', 'fr': 'Copié', 'de': 'Kopiert', 'pt': 'Copiado',
            'hi': 'कॉपी किया गया', 'ko': '복사됨', 'he': 'הועתק'
          },
          'notCopied': {
            'en': 'Not Copied', 'id': 'Belum Disalin', 'ar': 'لم يتم النسخ', 'zh': '未复制', 'ja': '未コピー',
            'ru': 'Не скопировано', 'es': 'No copiado', 'fr': 'Non copié', 'de': 'Nicht kopiert', 'pt': 'Não copiado',
            'hi': 'कॉपी नहीं किया गया', 'ko': '복사되지 않음', 'he': 'לא הועתק'
          },
          'opened': {
            'en': 'Opened', 'id': 'Sudah Dibuka', 'ar': 'تم الفتح', 'zh': '已打开', 'ja': '開いた',
            'ru': 'Открыto', 'es': 'Abierto', 'fr': 'Ouvert', 'de': 'Geöffnet', 'pt': 'Aberto',
            'hi': 'खोला गया', 'ko': '열림', 'he': 'נפתח'
          },
          'notOpened': {
            'en': 'Not Opened', 'id': 'Belum Dibuka', 'ar': 'لم يتم الفتح', 'zh': '未打开', 'ja': '未開',
            'ru': 'Не открыто', 'es': 'No abierto', 'fr': 'Non ouvert', 'de': 'Nicht geöffnet', 'pt': 'Não aberto',
            'hi': 'नहीं खोला गया', 'ko': '열지 않음', 'he': 'לא נפתח'
          }
        };
        
        // Use the actual action type stored with the suggestion, or fall back to current mode
        if (suggestion.opened) {
          if (suggestion.actionType === 'copy') {
            return statusTexts.copied[language] || statusTexts.copied['en'];
          } else {
            return statusTexts.opened[language] || statusTexts.opened['en'];
          }
        } else {
          // For unopened items, use current behavior mode
          if (copyMode || behaviorMode === 'copy') {
            return statusTexts.notCopied[language] || statusTexts.notCopied['en'];
          } else {
            return statusTexts.notOpened[language] || statusTexts.notOpened['en'];
          }
        }
      };
      
      // Smart timestamp formatting - today vs different day
      const formatTimestamp = (timestamp: number | undefined) => {
        if (!timestamp) return '-';
        
        const accessDate = new Date(timestamp);
        const today = new Date();
        const isToday = accessDate.toDateString() === today.toDateString();
        
        if (isToday) {
          // Today: only show time like "12:58:17 AM"
          return accessDate.toLocaleString('en-US', { 
            hour: 'numeric',
            minute: '2-digit', 
            second: '2-digit',
            hour12: true
          });
        } else {
          // Different day: show date [time] like "7/29/2025 [11:30:45 PM]"
          const dateStr = accessDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric'
          });
          const timeStr = accessDate.toLocaleString('en-US', { 
            hour: 'numeric',
            minute: '2-digit', 
            second: '2-digit',
            hour12: true
          });
          return `${dateStr} [${timeStr}]`;
        }
      };
      
      // Enhanced CSV field escaping with Unicode support
      const escapeCsvField = (field: string | number) => {
        if (typeof field === 'number') return field.toString();
        if (typeof field !== 'string') return '""';
        
        // Normalize Unicode characters for better compatibility
        const normalized = field.normalize('NFC');
        
        // Escape quotes by doubling them
        const escaped = normalized.replace(/"/g, '""');
        
        // Quote if contains special characters
        if (escaped.includes(',') || escaped.includes('"') || escaped.includes('\n') || escaped.includes('\r') || escaped.includes(';')) {
          return `"${escaped}"`;
        }
        
        return escaped;
      };
      
      // Generate CSV content with dynamic structure
      const headers = getDynamicHeaders();
      const metadata = getEnhancedMetadata();
      
      // Generate rows based on filter type and dynamic structure
      const csvRows = filteredSuggestions.map((suggestion, index) => {
        const row = [
          index + 1, // Always include row number
          escapeCsvField(suggestion.text) // Always include suggestion text
        ];
        
        // Add status column for "all" filter
        if (filterType === 'all') {
          row.push(escapeCsvField(getStatusText(suggestion)));
        }
        
        // Add timestamp column for "all" and "explored" filters
        if (filterType === 'all' || filterType === 'explored') {
          row.push(escapeCsvField(formatTimestamp(suggestion.openedAt)));
        }
        
        return row.join(',');
      });
      
      // Combine all content
      const csvContent = [
        ...metadata,
        headers.join(','),
        ...csvRows
      ].join('\n');
      
      // Create blob with UTF-8 BOM for maximum compatibility
      const BOM = '\uFEFF'; // Byte Order Mark for UTF-8
      const fullContent = BOM + csvContent;
      
      const blob = new Blob([fullContent], { 
        type: 'text/csv;charset=utf-8;' 
      });
      
      // Enhanced download mechanism
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.href = url;
      link.download = filename;
      link.style.visibility = 'hidden';
      link.setAttribute('type', 'text/csv;charset=utf-8;');
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Cleanup with delay for better browser compatibility
      setTimeout(() => URL.revokeObjectURL(url), 2000);
      
      // Multilingual success message
      const successMessages = {
        'en': 'CSV downloaded successfully!', 'id': 'CSV berhasil diunduh!', 'ar': 'تم تنزيل CSV بنجاح!',
        'zh': 'CSV下载成功！', 'ja': 'CSVのダウンロードが完了しました！', 'ru': 'CSV успешно загружен!',
        'es': '¡CSV descargado con éxito!', 'fr': 'CSV téléchargé avec succès!', 'de': 'CSV erfolgreich heruntergeladen!',
        'pt': 'CSV baixado com sucesso!', 'hi': 'CSV सफलतापूर्वक डाउनलोड हुआ!', 'ko': 'CSV 다운로드 완료!',
        'he': 'CSV הורד בהצלחה!'
      };
      
      const itemsExportedMessages = {
        'en': 'items exported', 'id': 'item diekspor', 'ar': 'عنصر تم تصديرها', 'zh': '项目已导出',
        'ja': 'アイテムをエクスポートしました', 'ru': 'элементов экспортировано', 'es': 'elementos exportados',
        'fr': 'éléments exportés', 'de': 'Elemente exportiert', 'pt': 'itens exportados',
        'hi': 'आइटम निर्यात किए गए', 'ko': '항목이 내보내짐', 'he': 'פריטים יוצאו'
      };
      
      toast.success(successMessages[language] || successMessages['en'], {
        description: `${filteredSuggestions.length} ${itemsExportedMessages[language] || itemsExportedMessages['en']}`,
        duration: 3000,
      });
      
    } catch (error) {
      console.error('CSV download failed:', error);
      
      // Multilingual error message
      const errorMessages = {
        'en': 'Failed to download CSV', 'id': 'Gagal mengunduh CSV', 'ar': 'فشل في تنزيل CSV',
        'zh': 'CSV下载失败', 'ja': 'CSVのダウンロードに失敗しました', 'ru': 'Не удалось загрузить CSV',
        'es': 'Error al descargar CSV', 'fr': 'Échec du téléchargement CSV', 'de': 'CSV-Download fehlgeschlagen',
        'pt': 'Falha ao baixar CSV', 'hi': 'CSV डाउनलोड विफल', 'ko': 'CSV 다운로드 실패', 'he': 'הורדת CSV נכשלה'
      };
      
      const tryAgainMessages = {
        'en': 'Please try again', 'id': 'Silakan coba lagi', 'ar': 'يرجى المحاولة مرة أخرى',
        'zh': '请重试', 'ja': 'もう一度お試しください', 'ru': 'Пожалуйста, попробуйте еще раз',
        'es': 'Por favor, inténtalo de nuevo', 'fr': 'Veuillez réessayer', 'de': 'Bitte versuchen Sie es erneut',
        'pt': 'Por favor, tente novamente', 'hi': 'कृपया पुनः प्रयास करें', 'ko': '다시 시도해 주세요', 'he': 'אנא נסה שוב'
      };
      
      toast.error(errorMessages[language] || errorMessages['en'], {
        description: tryAgainMessages[language] || tryAgainMessages['en'],
        duration: 4000,
      });
    }
  }, [t.appTitle, language, copyMode, behaviorMode]);

  // Enhanced copy text to clipboard with multiple robust fallback methods
  const copyToClipboard = async (text: string): Promise<boolean> => {
    // Method 1: Modern Clipboard API (if available and permitted)
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch (error) {
      console.warn('Clipboard API failed:', error);
    }

    // Method 2: Enhanced textarea with user interaction simulation
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      
      // Enhanced positioning and styling
      textArea.style.position = 'fixed';
      textArea.style.top = '50%';
      textArea.style.left = '50%';
      textArea.style.transform = 'translate(-50%, -50%)';
      textArea.style.width = '300px';
      textArea.style.height = '100px';
      textArea.style.padding = '10px';
      textArea.style.border = '2px solid #0d6efd';
      textArea.style.borderRadius = '8px';
      textArea.style.fontSize = '14px';
      textArea.style.fontFamily = 'monospace';
      textArea.style.backgroundColor = 'var(--app-bg)';
      textArea.style.color = 'var(--app-text)';
      textArea.style.zIndex = '10000';
      textArea.style.boxShadow = '0 8px 32px rgba(0,0,0,0.3)';
      textArea.style.outline = 'none';
      textArea.style.resize = 'none';
      textArea.setAttribute('readonly', '');
      
      document.body.appendChild(textArea);
      
      // Enhanced selection with focus
      textArea.focus();
      textArea.select();
      textArea.setSelectionRange(0, text.length);
      
      // Try execCommand
      const success = document.execCommand('copy');
      
      if (success) {
        document.body.removeChild(textArea);
        return true;
      }
      
      // If execCommand fails, keep the textarea visible for manual copy
      // Add instruction text
      const instruction = document.createElement('div');
      instruction.style.position = 'fixed';
      instruction.style.top = 'calc(50% + 80px)';
      instruction.style.left = '50%';
      instruction.style.transform = 'translateX(-50%)';
      instruction.style.background = 'var(--app-bg)';
      instruction.style.color = 'var(--app-text)';
      instruction.style.padding = '8px 16px';
      instruction.style.borderRadius = '6px';
      instruction.style.border = '1px solid var(--app-border)';
      instruction.style.fontSize = '12px';
      instruction.style.zIndex = '10001';
      instruction.style.boxShadow = '0 4px 16px rgba(0,0,0,0.2)';
      instruction.textContent = 'Press Ctrl+C (Cmd+C on Mac) to copy, then click outside';
      
      document.body.appendChild(instruction);
      
      // Auto-remove after 10 seconds or on click outside
      const cleanup = () => {
        if (document.body.contains(textArea)) {
          document.body.removeChild(textArea);
        }
        if (document.body.contains(instruction)) {
          document.body.removeChild(instruction);
        }
        document.removeEventListener('click', outsideClickHandler);
      };
      
      const outsideClickHandler = (e: MouseEvent) => {
        if (!textArea.contains(e.target as Node) && !instruction.contains(e.target as Node)) {
          cleanup();
        }
      };
      
      setTimeout(cleanup, 10000);
      document.addEventListener('click', outsideClickHandler);
      
      return true; // Consider it successful since we've provided a way to copy
      
    } catch (error) {
      console.warn('Enhanced textarea fallback failed:', error);
    }

    // Method 3: Visible span selection method
    try {
      const span = document.createElement('div');
      span.textContent = text;
      span.style.position = 'fixed';
      span.style.top = '50%';
      span.style.left = '50%';
      span.style.transform = 'translate(-50%, -50%)';
      span.style.padding = '20px';
      span.style.background = 'var(--app-bg)';
      span.style.color = 'var(--app-text)';
      span.style.border = '2px solid #0d6efd';
      span.style.borderRadius = '8px';
      span.style.fontSize = '16px';
      span.style.fontFamily = 'monospace';
      span.style.zIndex = '10000';
      span.style.boxShadow = '0 8px 32px rgba(0,0,0,0.3)';
      span.style.userSelect = 'text';
      span.style.cursor = 'text';
      span.style.whiteSpace = 'pre-wrap';
      span.style.wordBreak = 'break-all';
      span.style.maxWidth = '80vw';
      span.style.maxHeight = '60vh';
      span.style.overflow = 'auto';
      
      document.body.appendChild(span);
      
      const range = document.createRange();
      range.selectNodeContents(span);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
      
      // Try execCommand one more time
      const success = document.execCommand('copy');
      
      if (!success) {
        // Add instruction for manual copy
        const instruction = document.createElement('div');
        instruction.style.position = 'fixed';
        instruction.style.bottom = '20px';
        instruction.style.left = '50%';
        instruction.style.transform = 'translateX(-50%)';
        instruction.style.background = '#0d6efd';
        instruction.style.color = 'white';
        instruction.style.padding = '12px 24px';
        instruction.style.borderRadius = '8px';
        instruction.style.fontSize = '14px';
        instruction.style.zIndex = '10001';
        instruction.style.boxShadow = '0 4px 16px rgba(0,0,0,0.3)';
        instruction.innerHTML = 'Text is selected above. Press <strong>Ctrl+C</strong> (Cmd+C on Mac) to copy, then click outside to close.';
        
        document.body.appendChild(instruction);
        
        const cleanup = () => {
          if (document.body.contains(span)) {
            document.body.removeChild(span);
          }
          if (document.body.contains(instruction)) {
            document.body.removeChild(instruction);
          }
          document.removeEventListener('click', outsideClickHandler);
        };
        
        const outsideClickHandler = (e: MouseEvent) => {
          if (!span.contains(e.target as Node) && !instruction.contains(e.target as Node)) {
            cleanup();
          }
        };
        
        setTimeout(cleanup, 15000);
        document.addEventListener('click', outsideClickHandler);
      } else {
        document.body.removeChild(span);
      }
      
      return true; // Consider it successful since we've provided a way to copy
      
    } catch (error) {
      console.warn('Visible span selection fallback failed:', error);
    }

    return false;
  };

  const handleSuggestionClick = useCallback(async (suggestion: Suggestion) => {
    // Check if already opened to prevent duplicate processing
    if (openedItems.has(suggestion.id)) {
      return;
    }
    
    // Mark as opened FIRST to update statistics immediately
    setOpenedItems(prev => new Set([...prev, suggestion.id]));
    
    // Update the suggestion in the appropriate state with action type
    const actionType = copyMode || behaviorMode === 'copy' ? 'copy' : 'search';
    
    // Update suggestion state immediately for statistics
    if (showTrending) {
      setTrendingSuggestions(prev => {
        const updated = prev.map(s => 
          s.id === suggestion.id 
            ? { ...s, opened: true, openedAt: Date.now(), actionType }
            : s
        );
        const stillUnopenedCount = updated.filter(s => !s.opened).length;
        console.log('Auto run: Updated trending suggestions. Still unopened:', stillUnopenedCount);
        return updated;
      });
    } else {
      setSuggestions(prev => {
        const updated = prev.map(s => 
          s.id === suggestion.id 
            ? { ...s, opened: true, openedAt: Date.now(), actionType }
            : s
        );
        const stillUnopenedCount = updated.filter(s => !s.opened).length;
        console.log('Auto run: Updated suggestions. Still unopened:', stillUnopenedCount);
        return updated;
      });
    }
    
    if (copyMode) {
      // Copy mode: copy text to clipboard
      try {
        const success = await copyToClipboard(suggestion.text);
        if (success) {
          // Show simple success message for both automatic and manual copy methods
          toast.success(t.copySuccessMessage, {
            description: `"${suggestion.text}"`,
            duration: 3000,
          });
        } else {
          // All methods failed, show error with fallback
          toast.error(t.copyFailedMessage, {
            description: language === 'en' ? "Browser restrictions prevent automatic copying" :
              language === 'id' ? "Pembatasan browser mencegah penyalinan otomatis" :
              language === 'ar' ? "قيود المتصفح تمنع النسخ التلقائي" :
              language === 'zh' ? "浏览器限制阻止自动复制" :
              language === 'ja' ? "ブラウザの制限により自動コピーができません" :
              language === 'ru' ? "Ограничения браузера препятствуют автоматическому копированию" :
              language === 'es' ? "Las restricciones del navegador impiden la copia automática" :
              language === 'fr' ? "Les restrictions du navigateur empêchent la copie automatique" :
              language === 'de' ? "Browser-Einschränkungen verhindern automatisches Kopieren" :
              language === 'pt' ? "Restrições do navegador impedem cópia automática" :
              language === 'hi' ? "ब्राउज़र प्रतिबंध स्वचालित कॉपी को रोकते हैं" :
              language === 'ko' ? "브라우저 제한으로 인해 자동 복사가 방지됩니다" :
              "Browser restrictions prevent automatic copying",
            duration: 6000,
            action: {
              label: "Show Text",
              onClick: () => {
                // Create a modal-like display for manual copying
                const modal = document.createElement('div');
                modal.style.position = 'fixed';
                modal.style.top = '0';
                modal.style.left = '0';
                modal.style.width = '100vw';
                modal.style.height = '100vh';
                modal.style.backgroundColor = 'rgba(0,0,0,0.8)';
                modal.style.zIndex = '20000';
                modal.style.display = 'flex';
                modal.style.alignItems = 'center';
                modal.style.justifyContent = 'center';
                modal.style.backdropFilter = 'blur(4px)';
                
                const content = document.createElement('div');
                content.style.background = 'var(--app-bg)';
                content.style.color = 'var(--app-text)';
                content.style.padding = '2rem';
                content.style.borderRadius = '12px';
                content.style.maxWidth = '90vw';
                content.style.maxHeight = '80vh';
                content.style.overflow = 'auto';
                content.style.boxShadow = '0 20px 60px rgba(0,0,0,0.4)';
                content.style.border = '1px solid var(--app-border)';
                
                const title = document.createElement('h3');
                title.textContent = 'Copy Text Manually';
                title.style.marginBottom = '1rem';
                title.style.fontSize = '1.25rem';
                title.style.fontWeight = '600';
                
                const instruction = document.createElement('p');
                instruction.innerHTML = 'Select the text below and press <strong>Ctrl+C</strong> (or <strong>Cmd+C</strong> on Mac) to copy:';
                instruction.style.marginBottom = '1rem';
                instruction.style.color = 'var(--app-muted)';
                
                const textBox = document.createElement('div');
                textBox.textContent = suggestion.text;
                textBox.style.background = 'var(--app-accent)';
                textBox.style.border = '2px solid #0d6efd';
                textBox.style.borderRadius = '8px';
                textBox.style.padding = '1rem';
                textBox.style.fontFamily = 'monospace';
                textBox.style.fontSize = '1rem';
                textBox.style.userSelect = 'text';
                textBox.style.cursor = 'text';
                textBox.style.whiteSpace = 'pre-wrap';
                textBox.style.wordBreak = 'break-word';
                textBox.style.marginBottom = '1rem';
                
                const closeBtn = document.createElement('button');
                closeBtn.textContent = 'Close';
                closeBtn.style.background = '#6c757d';
                closeBtn.style.color = 'white';
                closeBtn.style.border = 'none';
                closeBtn.style.borderRadius = '6px';
                closeBtn.style.padding = '8px 16px';
                closeBtn.style.cursor = 'pointer';
                closeBtn.style.fontSize = '14px';
                
                content.appendChild(title);
                content.appendChild(instruction);
                content.appendChild(textBox);
                content.appendChild(closeBtn);
                modal.appendChild(content);
                document.body.appendChild(modal);
                
                // Auto-select text
                const range = document.createRange();
                range.selectNodeContents(textBox);
                const selection = window.getSelection();
                selection?.removeAllRanges();
                selection?.addRange(range);
                
                const cleanup = () => {
                  if (document.body.contains(modal)) {
                    document.body.removeChild(modal);
                  }
                };
                
                closeBtn.onclick = cleanup;
                modal.onclick = (e) => {
                  if (e.target === modal) cleanup();
                };
                
                // Close with Escape key
                const handleEscape = (e: KeyboardEvent) => {
                  if (e.key === 'Escape') {
                    cleanup();
                    document.removeEventListener('keydown', handleEscape);
                  }
                };
                document.addEventListener('keydown', handleEscape);
              }
            }
          });
        }
      } catch (error) {
        console.error('Copy operation failed:', error);
        toast.error(t.copyFailedMessage, {
          description: language === 'en' ? "Unable to copy text due to browser restrictions" :
            language === 'id' ? "Tidak dapat menyalin teks karena pembatasan browser" :
            language === 'ar' ? "غير قادر على نسخ النص بسبب قيود المتصفح" :
            language === 'zh' ? "由于浏览器限制无法复制文本" :
            language === 'ja' ? "ブラウザの制限によりテキストをコピーできません" :
            language === 'ru' ? "Невозможно скопировать текст из-за ограничений браузера" :
            language === 'es' ? "No se puede copiar el texto debido a restricciones del navegador" :
            language === 'fr' ? "Impossible de copier le texte en raison des restrictions du navigateur" :
            language === 'de' ? "Text kann aufgrund von Browser-Einschränkungen nicht kopiert werden" :
            language === 'pt' ? "Não é possível copiar texto devido a restrições do navegador" :
            language === 'hi' ? "ब्राउज़र प्रतिबंधों के कारण टेक्स्ट कॉपी करने में असमर्थ" :
            language === 'ko' ? "브라우저 제한으로 인해 텍스트를 복사할 수 없습니다" :
            "Unable to copy text due to browser restrictions",
          duration: 5000,
        });
      }
    } else {
      // Search mode: handle different tab behaviors
      const searchUrl = getSearchUrl(suggestion.text);
      
      if (behaviorMode === 'floating-tab') {
        // Try floating tab mode first, with error handling
        setFloatingTab({
          isOpen: true,
          url: searchUrl,
          title: suggestion.text,
          hasError: !supportsIframe(selectedEngine) // Pre-set error for known unsupported engines
        });
        
        // Start auto run timer if enabled
        if (autoRunEnabled) {
          const duration = getRandomDuration();
          startAutoRunTimer(duration);
        }
      } else if (behaviorMode === 'same-tab') {
        // Same tab mode: navigate in current tab
        window.location.href = searchUrl;
      } else {
        // New tab mode: open in new tab (default and 'new-tab')
        window.open(searchUrl, '_blank');
      }
    }
  }, [copyMode, behaviorMode, showTrending, selectedEngine, language, t, getSearchUrl, supportsIframe, autoRunEnabled, getRandomDuration, startAutoRunTimer]);

  const handleRandomTopic = async () => {
    // Always show spin animation for better UX
    setIsSpinning(true);
    setIsLoadingRandom(true);
    setIsGeneratingLarge(false);
    
    // Clear any auto run timers when generating new random topics
    clearAutoRunTimers();
    
    // Clear any existing search term and suggestions
    setSearchTerm('');
    setSuggestions([]);
    setOpenedItems(new Set());
    
    try {
      // Minimum spin duration for good UX (even for small queries)
      const minSpinDuration = 800; 
      const startTime = Date.now();
      
      if (queryCount <= 500) {
        // For smaller counts, generate all at once
        const allTrending = generateTrendingTopics(queryCount, language, selectedEngine);
        setTrendingSuggestions(allTrending.slice(0, queryCount));
        setShowTrending(true);
      } else {
        // For large counts, use async generation
        setIsGeneratingLarge(true);
        const allTrending = await generateTrendingTopicsAsync(queryCount, language, selectedEngine);
        setTrendingSuggestions(allTrending.slice(0, queryCount)); // Ensure exact count
        setShowTrending(true);
        setIsGeneratingLarge(false);
      }
      
      // Ensure minimum spin duration
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minSpinDuration - elapsedTime);
      
      if (remainingTime > 0) {
        await new Promise(resolve => setTimeout(resolve, remainingTime));
      }
      
    } catch (error) {
      console.error('Error generating trending topics:', error);
      // Fallback - generate basic trending topics
      const fallbackCount = Math.min(queryCount, 50);
      const fallbackTrending = generateTrendingTopics(fallbackCount, language, selectedEngine);
      setTrendingSuggestions(fallbackTrending.slice(0, fallbackCount));
      setShowTrending(true);
      setIsGeneratingLarge(false);
    } finally {
      setIsLoadingRandom(false);
      setIsSpinning(false);
    }
  };

  const selectedEngineData = searchEngines.find(engine => engine.value === selectedEngine);

  // Calculate accurate statistics
  const currentSuggestionsList = showTrending ? trendingSuggestions : suggestions;
  const totalGenerated = currentSuggestionsList.length;
  const totalExplored = openedItems.size;
  const totalRemaining = totalGenerated - totalExplored;

  // Function to render text with icon replacement
  const renderTextWithIcon = (text: string) => {
    const parts = text.split('{icon}');
    if (parts.length === 1) {
      return text;
    }
    
    return (
      <>
        {parts[0]}
        <i className="bi bi-shuffle mx-1" style={{ fontSize: 'inherit' }}></i>
        {parts[1]}
      </>
    );
  };

  return (
    <div className="w-100">
      {/* Search Input */}
      <div className="position-relative mb-4">
        <i className="bi bi-search input-group-icon start"></i>
        <input
          type="text"
          className="form-control search-input"
          placeholder={t.searchPlaceholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          className="btn btn-icon input-group-icon end"
          onClick={handleRandomTopic}
          disabled={isLoadingRandom}
          title={t.generateSuggestions}
        >
          <i className={`bi bi-shuffle ${isSpinning ? 'spin' : ''}`}></i>
        </button>
      </div>

      {/* Settings */}
      <div className="settings-panel mb-4">
        <div className="d-flex align-items-center gap-3 flex-wrap">
          <button
            className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-2 flex-shrink-0"
            onClick={() => setShowSettings(true)}
          >
            <i className="bi bi-gear"></i>
            <span className="d-none d-sm-inline">{t.settings}</span>
          </button>
          
          <div className="d-flex align-items-center gap-3 small text-muted flex-wrap">
            <span className="text-nowrap">{queryCount} {t.queries.toLowerCase()}</span>
            <span className="text-nowrap">{selectedEngineData?.name}</span>
            <span className="text-nowrap">{t.languages[language as keyof typeof t.languages]}</span>
            {behaviorMode === 'copy' && <span className="text-nowrap badge bg-info">{(
                        language === 'en' ? 'Copy to Clipboard' :
                        language === 'id' ? 'Salin ke Clipboard' :
                        language === 'ar' ? 'نسخ إلى الحافظة' :
                        language === 'zh' ? '复制到剪贴板' :
                        language === 'ja' ? 'クリップボードにコピー' :
                        language === 'ru' ? 'Скопировать в буфер' :
                        language === 'es' ? 'Copiar al Portapapeles' :
                        language === 'fr' ? 'Copier dans le Presse-papiers' :
                        language === 'de' ? 'In Zwischenablage kopieren' :
                        language === 'pt' ? 'Copiar para Área de Transferência' :
                        language === 'hi' ? 'क्लिपबोर्ड में कॉपी करें' :
                        language === 'ko' ? '클립보드에 복사' :
                        'Copy to Clipboard'
                      )}</span>}
            {behaviorMode === 'same-tab' && <span className="text-nowrap badge bg-secondary">{t.sameTab}</span>}
            {behaviorMode === 'floating-tab' && (
              <>
                <span className="text-nowrap badge bg-primary">{t.floatingTab}</span>
                {autoRunEnabled && (
                  <span className="text-nowrap badge bg-success">
                    {language === 'en' ? 'Auto Mode' :
                     language === 'id' ? 'Mode Otomatis' :
                     language === 'ar' ? 'الوضع التلقائي' :
                     language === 'zh' ? '自动模式' :
                     language === 'ja' ? '自動モード' :
                     language === 'ru' ? 'Авто режим' :
                     language === 'es' ? 'Modo Automático' :
                     language === 'fr' ? 'Mode Auto' :
                     language === 'de' ? 'Auto-Modus' :
                     language === 'pt' ? 'Modo Automático' :
                     language === 'hi' ? 'ऑटो मोड' :
                     language === 'ko' ? '자동 모드' :
                     'Auto Mode'}
                  </span>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Auto Run Status (when active) */}
      {isAutoRunning && (
        <div className="mb-3">
          <div className="d-flex align-items-center justify-content-between p-3 bg-primary text-white rounded">
            <div className="d-flex align-items-center gap-2">
              <i className="bi bi-play-circle-fill"></i>
              <span className="fw-medium">
                {language === 'en' ? 'Auto Run Active' :
                 language === 'id' ? 'Auto Run Aktif' :
                 language === 'ar' ? 'التشغيل التلقائي نشط' :
                 language === 'zh' ? '自动运行激活' :
                 language === 'ja' ? '自動実行アクティブ' :
                 language === 'ru' ? 'Автозапуск активен' :
                 language === 'es' ? 'Auto Run Activo' :
                 language === 'fr' ? 'Exécution automatique active' :
                 language === 'de' ? 'Automatischer Lauf aktiv' :
                 language === 'pt' ? 'Auto Run Ativo' :
                 language === 'hi' ? 'ऑटो रन सक्रिय' :
                 language === 'ko' ? '자동 실행 활성화' :
                 'Auto Run Active'}
              </span>
            </div>
            <div className="d-flex align-items-center gap-3">
              <span className="small auto-run-timer">
                {language === 'en' ? `Closing in ${autoRunTimeLeft}s` :
                 language === 'id' ? `Menutup dalam ${autoRunTimeLeft}d` :
                 language === 'ar' ? `إغلاق في ${autoRunTimeLeft}ث` :
                 language === 'zh' ? `${autoRunTimeLeft}秒后关闭` :
                 language === 'ja' ? `${autoRunTimeLeft}秒で閉じる` :
                 language === 'ru' ? `Закрытие через ${autoRunTimeLeft}с` :
                 language === 'es' ? `Cerrando en ${autoRunTimeLeft}s` :
                 language === 'fr' ? `Fermeture dans ${autoRunTimeLeft}s` :
                 language === 'de' ? `Schließen in ${autoRunTimeLeft}s` :
                 language === 'pt' ? `Fechando em ${autoRunTimeLeft}s` :
                 language === 'hi' ? `${autoRunTimeLeft}से में बंद` :
                 language === 'ko' ? `${autoRunTimeLeft}초 후 닫기` :
                 `Closing in ${autoRunTimeLeft}s`}
              </span>
              <button
                className="btn btn-sm btn-outline-light"
                onClick={clearAutoRunTimers}
                title={language === 'en' ? 'Stop Auto Run' :
                       language === 'id' ? 'Hentikan Auto Run' :
                       'Stop Auto Run'}
              >
                <i className="bi bi-stop-fill"></i>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search Suggestions */}
      {(previewSuggestions.length > 0 || showTrending) && (
        <div className="mb-4">
          <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
            <h3 className="mb-0 h4 h3-sm">
              {t.searchSuggestions}
            </h3>
            {totalGenerated > 3 && (
              <button
                className="btn btn-outline-primary btn-sm text-nowrap"
                onClick={() => setShowModal(true)}
              >
                {t.showAll} ({totalGenerated})
              </button>
            )}
          </div>

          <div className="mb-3">
            <div className="stats-text mb-2">
              {behaviorMode === 'copy'
                ? `${terminology.clickAction} • ${t.clickedReplaced}`
                : `${terminology.clickAction} ${selectedEngineData?.name} • ${t.clickedReplaced}`
              }
            </div>
            {previewSuggestions.map((suggestion) => (
              <SuggestionItem 
                key={suggestion.id} 
                suggestion={suggestion} 
                onClick={handleSuggestionClick}
                copyMode={copyMode}
                behaviorMode={behaviorMode}
              />
            ))}
            {previewSuggestions.length === 0 && totalExplored > 0 && (
              <div className="text-center text-muted py-4">
                {t.allExplored}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Statistics - New format: "0 dari 100 kueri sudah dibuka" */}
      {totalGenerated > 0 && (
        <div className="stats-text text-center mb-4">
          {language === 'id' ? (
            <div>
              {totalExplored} dari {totalGenerated} kueri {terminology.explored}
              {totalRemaining > 0 && (
                <div>{totalRemaining} {terminology.remaining}</div>
              )}
            </div>
          ) : (
            <div>
              {totalExplored} {terminology.explored} / {totalGenerated} {t.queries.toLowerCase()}
              {totalRemaining > 0 && (
                <div>{totalRemaining} {terminology.remaining}</div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Empty state */}
      {debouncedSearchTerm && suggestions.length === 0 && !isGeneratingLarge && (
        <div className="text-center text-muted py-4">
          {t.noSuggestions} "{debouncedSearchTerm}"
        </div>
      )}

      {/* Instructions */}
      {!searchTerm && !showTrending && (
        <div className="text-center text-muted py-4">
          <p>{t.startTyping}</p>
          <p className="small">{t.configureSettings}</p>
          <p className="small">{renderTextWithIcon(t.clickShuffle)}</p>
        </div>
      )}

      {/* Settings Modal - Improved Auto Run Position */}
      {showSettings && (
        <div 
          className="modal show d-block" 
          tabIndex={-1} 
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowSettings(false);
            }
          }}
        >
          <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '600px' }}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{t.settings}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowSettings(false)}
                  aria-label="Close"
                ></button>
              </div>
              
              <div className="modal-body">
                <div className="row g-4">
                  {/* Generation Settings Card */}
                  <div className="col-12">
                    <div className="settings-card">
                      <div className="settings-section-header">
                        <h6 className="settings-section-title">
                          <i className="bi bi-gear me-2"></i>
                          {language === 'en' ? 'Generation Settings' :
                           language === 'id' ? 'Pengaturan Generasi' :
                           language === 'ar' ? 'إعدادات التوليد' :
                           language === 'zh' ? '生成设置' :
                           language === 'ja' ? '生成設定' :
                           language === 'ru' ? 'Настройки генерации' :
                           language === 'es' ? 'Configuración de Generación' :
                           language === 'fr' ? 'Paramètres de Génération' :
                           language === 'de' ? 'Generierungseinstellungen' :
                           language === 'pt' ? 'Configurações de Geração' :
                           language === 'hi' ? 'जनरेशन सेटिंग्स' :
                           language === 'ko' ? '생성 설정' :
                           'Generation Settings'}
                        </h6>
                      </div>
                      <div className="row g-3">
                        <div className="col-12 col-md-6">
                          <label htmlFor="query-count" className="form-label">
                            {t.queries}
                          </label>
                          <input
                            id="query-count"
                            type="number"
                            min="10"
                            max="10000"
                            value={queryCount}
                            onChange={(e) => setQueryCount(parseInt(e.target.value) || 100)}
                            className="form-control"
                          />
                        </div>
                        
                        <div className="col-12 col-md-6">
                          <label htmlFor="search-engine" className="form-label">
                            {t.engine}
                          </label>
                          <select
                            id="search-engine"
                            className="form-select"
                            value={selectedEngine}
                            onChange={(e) => setSelectedEngine(e.target.value)}
                          >
                            {searchEngines.map((engine) => (
                              <option key={engine.value} value={engine.value}>
                                {engine.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        
                        <div className="col-12">
                          <label htmlFor="language-select" className="form-label">
                            {t.language}
                          </label>
                          <select
                            id="language-select"
                            className="form-select"
                            value={language}
                            onChange={(e) => setLanguage(e.target.value as any)}
                          >
                            {Object.entries(t.languages).map(([code, name]) => (
                              <option key={code} value={code}>
                                {name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Behavior Options Card */}
                  <div className="col-12">
                    <div className="settings-card">
                      <div className="settings-section-header">
                        <h6 className="settings-section-title">
                          <i className="bi bi-mouse me-2"></i>
                          {t.behaviorOptions}
                        </h6>
                      </div>
                      
                      <div className="behavior-option">
                        <div className="form-check">
                          <input
                            id="new-tab-mode"
                            type="radio"
                            name="behavior-mode"
                            className="form-check-input"
                            checked={behaviorMode === 'new-tab'}
                            onChange={() => setBehaviorMode('new-tab')}
                          />
                          <label htmlFor="new-tab-mode" className="form-check-label">
                            <strong>{t.newTab}</strong>
                          </label>
                        </div>
                      </div>
                      
                      <div className="behavior-option">
                        <div className="form-check">
                          <input
                            id="same-tab-mode"
                            type="radio"
                            name="behavior-mode"
                            className="form-check-input"
                            checked={behaviorMode === 'same-tab'}
                            onChange={() => setBehaviorMode('same-tab')}
                          />
                          <label htmlFor="same-tab-mode" className="form-check-label">
                            <strong>{t.sameTab}</strong>
                          </label>
                        </div>
                      </div>
                      
                      <div className="behavior-option">
                        <div className="form-check">
                          <input
                            id="floating-tab-mode"
                            type="radio"
                            name="behavior-mode"
                            className="form-check-input"
                            checked={behaviorMode === 'floating-tab'}
                            onChange={() => setBehaviorMode('floating-tab')}
                          />
                          <label htmlFor="floating-tab-mode" className="form-check-label">
                            <strong>{t.floatingTab}</strong>
                          </label>
                        </div>
                        
                        {/* Auto Mode Settings - Better visual hierarchy under Floating Tab */}
                        {behaviorMode === 'floating-tab' && (
                          <div className="auto-mode-section mt-3">
                            <div className="form-check mb-3">
                              <input
                                id="auto-run-enabled"
                                type="checkbox"
                                className="form-check-input"
                                checked={autoRunEnabled}
                                onChange={(e) => setAutoRunEnabled(e.target.checked)}
                              />
                              <label htmlFor="auto-run-enabled" className="form-check-label">
                                <strong>
                                  {language === 'en' ? 'Enable Auto Mode' :
                                   language === 'id' ? 'Aktifkan Mode Otomatis' :
                                   language === 'ar' ? 'تمكين الوضع التلقائي' :
                                   language === 'zh' ? '启用自动模式' :
                                   language === 'ja' ? '自動モードを有効にする' :
                                   language === 'ru' ? 'Включить автоматический режим' :
                                   language === 'es' ? 'Habilitar Modo Automático' :
                                   language === 'fr' ? 'Activer le Mode Automatique' :
                                   language === 'de' ? 'Automatischen Modus aktivieren' :
                                   language === 'pt' ? 'Ativar Modo Automático' :
                                   language === 'hi' ? 'ऑटो मोड सक्षम करें' :
                                   language === 'ko' ? '자동 모드 활성화' :
                                   'Enable Auto Mode'}
                                </strong>
                              </label>
                            </div>
                            
                            {autoRunEnabled && (
                              <div className="auto-mode-controls">
                                <div className="row g-3">
                                  <div className="col-6">
                                    <label htmlFor="auto-run-min-duration" className="form-label">
                                      <i className="bi bi-speedometer2 me-1"></i>
                                      {language === 'en' ? 'Min Duration (seconds)' :
                                       language === 'id' ? 'Durasi Min (detik)' :
                                       language === 'ar' ? 'الحد الأدنى للمدة (ثواني)' :
                                       language === 'zh' ? '最小持续时间（秒）' :
                                       language === 'ja' ? '最小持続時間（秒）' :
                                       language === 'ru' ? 'Мин. длительность (сек)' :
                                       language === 'es' ? 'Duración Mín (segundos)' :
                                       language === 'fr' ? 'Durée Min (secondes)' :
                                       language === 'de' ? 'Min. Dauer (Sekunden)' :
                                       language === 'pt' ? 'Duração Mín (segundos)' :
                                       language === 'hi' ? 'न्यूनतम अवधि (सेकंड)' :
                                       language === 'ko' ? '최소 지속 시간 (초)' :
                                       'Min Duration (seconds)'}
                                    </label>
                                    <input
                                      id="auto-run-min-duration"
                                      type="number"
                                      min="3"
                                      max="30"
                                      value={autoRunMinDuration}
                                      onChange={(e) => setAutoRunMinDuration(Math.max(3, parseInt(e.target.value) || 7))}
                                      className="form-control"
                                    />
                                  </div>
                                  <div className="col-6">
                                    <label htmlFor="auto-run-max-duration" className="form-label">
                                      <i className="bi bi-speedometer me-1"></i>
                                      {language === 'en' ? 'Max Duration (seconds)' :
                                       language === 'id' ? 'Durasi Maks (detik)' :
                                       language === 'ar' ? 'الحد الأقصى للمدة (ثواني)' :
                                       language === 'zh' ? '最大持续时间（秒）' :
                                       language === 'ja' ? '最大持續時間（秒）' :
                                       language === 'ru' ? 'Макс. длительность (сек)' :
                                       language === 'es' ? 'Duración Máx (segundos)' :
                                       language === 'fr' ? 'Durée Max (secondes)' :
                                       language === 'de' ? 'Max. Dauer (Sekunden)' :
                                       language === 'pt' ? 'Duração Máx (segundos)' :
                                       language === 'hi' ? 'अधिकतम अवधि (सेकंड)' :
                                       language === 'ko' ? '최대 지속 시간 (초)' :
                                       'Max Duration (seconds)'}
                                    </label>
                                    <input
                                      id="auto-run-max-duration"
                                      type="number"
                                      min={autoRunMinDuration}
                                      max="60"
                                      value={autoRunMaxDuration}
                                      onChange={(e) => setAutoRunMaxDuration(Math.max(autoRunMinDuration, parseInt(e.target.value) || 11))}
                                      className="form-control"
                                    />
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <div className="behavior-option">
                        <div className="form-check">
                          <input
                            id="copy-mode"
                            type="radio"
                            name="behavior-mode"
                            className="form-check-input"
                            checked={behaviorMode === 'copy'}
                            onChange={() => setBehaviorMode('copy')}
                          />
                          <label htmlFor="copy-mode" className="form-check-label">
                            <strong>
                        {language === 'en' ? 'Copy to Clipboard' :
                         language === 'id' ? 'Salin ke Clipboard' :
                         language === 'ar' ? 'نسخ إلى الحافظة' :
                         language === 'zh' ? '复制到剪贴板' :
                         language === 'ja' ? 'クリップボードにコピー' :
                         language === 'ru' ? 'Скопировать в буфер' :
                         language === 'es' ? 'Copiar al Portapapeles' :
                         language === 'fr' ? 'Copier dans le Presse-papiers' :
                         language === 'de' ? 'In Zwischenablage kopieren' :
                         language === 'pt' ? 'Copiar para Área de Transferência' :
                         language === 'hi' ? 'क्लिपबोर्ड में कॉपी करें' :
                         language === 'ko' ? '클립보드에 복사' :
                         'Copy to Clipboard'}
                      </strong>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Optimized Lazy Modal */}
      <LazyModal
        showModal={showModal}
        onClose={() => setShowModal(false)}
        suggestions={allSuggestionsForModal}
        searchTerm={debouncedSearchTerm}
        showTrending={showTrending}
        copyMode={copyMode}
        behaviorMode={behaviorMode}
        onItemClick={handleSuggestionClick}
        searchEngines={searchEngines}
        selectedEngine={selectedEngine}
        downloadCSV={downloadCSV}
      />

      {/* Floating Tab Popup */}
      {floatingTab.isOpen && (
        <div 
          className="floating-tab-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              clearAutoRunTimers();
              setFloatingTab({ isOpen: false, url: '', title: '', hasError: false });
            }
          }}
        >
          <div className="floating-tab-window">
            {/* Header */}
            <div className="floating-tab-header">
              <div className="floating-tab-controls">
                <div 
                  className="floating-tab-control close" 
                  onClick={() => {
                    clearAutoRunTimers();
                    setFloatingTab({ isOpen: false, url: '', title: '', hasError: false });
                  }}
                  title={t.close || 'Close'}
                ></div>
                <div className="floating-tab-control minimize"></div>
                <div className="floating-tab-control maximize"></div>
              </div>
              <div className="floating-tab-title">
                {floatingTab.title}
              </div>
              <div className="d-flex align-items-center gap-2">
                {/* Auto Run Status (when active) */}
                {isAutoRunning && (
                  <div className="d-flex align-items-center gap-2 floating-tab-timer">
                    <div 
                      className="spinner-border spinner-border-sm" 
                      role="status" 
                      style={{ width: '16px', height: '16px' }}
                    >
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <span className="small fw-medium">{autoRunTimeLeft}s</span>
                  </div>
                )}
                
                <button
                  className="floating-tab-close-btn"
                  onClick={() => {
                    clearAutoRunTimers();
                    setFloatingTab({ isOpen: false, url: '', title: '', hasError: false });
                  }}
                  title={t.close || 'Close'}
                >
                  <i className="bi bi-x"></i>
                </button>
              </div>
            </div>
            
            {/* Content */}
            <div className="floating-tab-content">
              {floatingTab.hasError ? (
                /* Error State */
                <div className="d-flex flex-column align-items-center justify-content-center h-100 p-4 text-center">
                  <i className="bi bi-exclamation-triangle text-warning mb-3" style={{ fontSize: '3rem' }}></i>
                  <h4 className="mb-3">{t.floatingTabError}</h4>
                  <p className="text-muted mb-4 max-width-md">{t.floatingTabErrorDescription}</p>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      window.open(floatingTab.url, '_blank');
                      clearAutoRunTimers();
                      setFloatingTab({ isOpen: false, url: '', title: '', hasError: false });
                    }}
                  >
                    <i className="bi bi-box-arrow-up-right me-2"></i>
                    {t.openInNewTab}
                  </button>
                </div>
              ) : (
                /* Iframe Content */
                <iframe
                  src={floatingTab.url}
                  className="floating-tab-iframe"
                  title={floatingTab.title}
                  sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
                  onError={() => {
                    setFloatingTab(prev => ({ ...prev, hasError: true }));
                  }}
                  onLoad={(e) => {
                    // Check if iframe content loaded properly
                    try {
                      const iframe = e.target as HTMLIFrameElement;
                      // If we can't access contentDocument, it might be blocked by X-Frame-Options
                      if (!iframe.contentDocument && !iframe.contentWindow) {
                        setFloatingTab(prev => ({ ...prev, hasError: true }));
                      }
                    } catch (error) {
                      // Cross-origin access denied - likely blocked by X-Frame-Options
                      console.warn('Iframe blocked by X-Frame-Options:', error);
                      setFloatingTab(prev => ({ ...prev, hasError: true }));
                    }
                  }}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Dark Mode Toggle - Bottom Right */}
      <div 
        className="position-fixed" 
        style={{ 
          bottom: '2rem', 
          right: '2rem', 
          zIndex: 1000 
        }}
      >
        <button
          className="btn btn-outline-secondary rounded-circle p-3"
          onClick={() => setDarkMode(!darkMode)}
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          style={{
            width: '3.5rem',
            height: '3.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <i className={`bi ${darkMode ? 'bi-sun' : 'bi-moon'}`} style={{ fontSize: '1.25rem' }}></i>
        </button>
      </div>
    </div>
  );
}
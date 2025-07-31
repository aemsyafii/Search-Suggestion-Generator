import { Suggestion } from '../types';
import { Language } from '../LanguageContext';
import { suggestionPatterns } from '../data/suggestionPatterns';
import { trendingTopics } from '../data/trendingTopics';

// Generate unique ID for suggestions
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Shuffle array utility - using function declaration to avoid JSX parsing issues
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Generate initial suggestions based on search term - optimized for responsiveness
export const generateInitialSuggestions = (
  searchTerm: string,
  count: number,
  language: Language
): Suggestion[] => {
  // Always use sync version but with optimizations for small counts
  return generateInitialSuggestionsSync(searchTerm, count, language);
};

// Synchronous version for smaller counts
const generateInitialSuggestionsSync = (
  searchTerm: string,
  count: number,
  language: Language
): Suggestion[] => {
  const patterns = suggestionPatterns[language] || suggestionPatterns.en;
  const suggestions: Suggestion[] = [];
  const existingTexts = new Set<string>();
  
  // Enhanced variation generation for large counts
  const variationWords = [
    'guide', 'tutorial', 'tips', 'tricks', 'review', 'comparison', 'analysis',
    'examples', 'solutions', 'methods', 'techniques', 'strategies', 'tools',
    'resources', 'benefits', 'features', 'advantages', 'best practices',
    'step by step', 'complete guide', 'ultimate guide', 'beginner guide',
    'advanced guide', 'professional', 'premium', 'free', 'online', 'latest',
    'new', 'updated', 'modern', 'easy', 'simple', 'quick', 'fast',
    'effective', 'efficient', 'powerful', 'comprehensive', 'detailed'
  ];
  
  // Dynamic years - always current and previous year
  const currentYear = new Date().getFullYear();
  const previousYear = currentYear - 1;
  
  const timeModifiers = [
    currentYear.toString(), previousYear.toString(), 'today', 'now', 'current', 'latest', 'recent',
    'this year', 'updated'
  ];
  
  const qualityModifiers = [
    'best', 'top', 'great', 'excellent', 'amazing', 'outstanding',
    'perfect', 'ideal', 'optimal', 'recommended', 'popular', 'trending'
  ];
  
  // Create suggestions using patterns
  const shuffledPatterns = shuffleArray(patterns);
  const term = searchTerm.trim();
  
  // Generate base suggestions from patterns
  for (let i = 0; i < count && suggestions.length < count; i++) {
    const pattern = shuffledPatterns[i % shuffledPatterns.length];
    let suggestionText = pattern.replace('{term}', term);
    
    // Add variations for uniqueness
    if (i >= shuffledPatterns.length) {
      const cycleIndex = Math.floor((i - shuffledPatterns.length) / shuffledPatterns.length);
      
      if (cycleIndex === 0) {
        // First cycle: add time modifiers
        const timeModifier = timeModifiers[i % timeModifiers.length];
        suggestionText = `${suggestionText} ${timeModifier}`;
      } else if (cycleIndex === 1) {
        // Second cycle: add quality modifiers
        const qualityModifier = qualityModifiers[i % qualityModifiers.length];
        suggestionText = `${qualityModifier} ${suggestionText}`;
      } else if (cycleIndex === 2) {
        // Third cycle: add variation words
        const variation = variationWords[i % variationWords.length];
        suggestionText = `${suggestionText} ${variation}`;
      } else {
        // Further cycles: combine modifiers
        const timeModifier = timeModifiers[i % timeModifiers.length];
        const variation = variationWords[(i + 1) % variationWords.length];
        suggestionText = `${suggestionText} ${variation} ${timeModifier}`;
      }
    }
    
    // Ensure uniqueness
    if (!existingTexts.has(suggestionText)) {
      suggestions.push({
        id: generateId(),
        text: suggestionText,
        opened: false
      });
      existingTexts.add(suggestionText);
    }
  }
  
  // Fill remaining with creative combinations
  let attempts = 0;
  const maxAttempts = count * 3; // Reduced to prevent over-generation
  
  while (suggestions.length < count && attempts < maxAttempts) {
    attempts++;
    
    const pattern = shuffledPatterns[Math.floor(Math.random() * shuffledPatterns.length)];
    const baseSuggestion = pattern.replace('{term}', term);
    
    // Create unique combinations
    const components = [];
    
    // Randomly add quality modifier
    if (Math.random() < 0.4) {
      components.push(qualityModifiers[Math.floor(Math.random() * qualityModifiers.length)]);
    }
    
    components.push(baseSuggestion);
    
    // Randomly add variation word
    if (Math.random() < 0.6) {
      components.push(variationWords[Math.floor(Math.random() * variationWords.length)]);
    }
    
    // Randomly add time modifier
    if (Math.random() < 0.3) {
      components.push(timeModifiers[Math.floor(Math.random() * timeModifiers.length)]);
    }
    
    const suggestionText = components.join(' ');
    
    if (!existingTexts.has(suggestionText)) {
      suggestions.push({
        id: generateId(),
        text: suggestionText,
        opened: false
      });
      existingTexts.add(suggestionText);
    }
  }
  
  // Final fallback with numbers for any remaining slots
  let fallbackAttempts = 0;
  const maxFallbackAttempts = (count - suggestions.length) * 2; // Limit fallback attempts
  
  while (suggestions.length < count && fallbackAttempts < maxFallbackAttempts) {
    fallbackAttempts++;
    const pattern = shuffledPatterns[Math.floor(Math.random() * shuffledPatterns.length)];
    const baseSuggestion = pattern.replace('{term}', term);
    const randomNumber = Math.floor(Math.random() * 100000) + 1;
    const numberedSuggestion = `${baseSuggestion} ${randomNumber}`;
    
    if (!existingTexts.has(numberedSuggestion)) {
      suggestions.push({
        id: generateId(),
        text: numberedSuggestion,
        opened: false
      });
      existingTexts.add(numberedSuggestion);
    }
  }
  
  return suggestions.slice(0, count);
};

// Async version for very large counts - simplified without progress tracking
export const generateInitialSuggestionsAsync = async (
  searchTerm: string,
  count: number,
  language: Language
): Promise<Suggestion[]> => {
  // Generate a large pool first to avoid duplication issues
  const totalSuggestions = generateInitialSuggestionsSync(searchTerm, count, language);
  
  // For very large datasets, process in chunks to avoid blocking
  if (count > 1000) {
    const CHUNK_SIZE = 500;
    const result: Suggestion[] = [];
    
    for (let i = 0; i < totalSuggestions.length; i += CHUNK_SIZE) {
      const chunk = totalSuggestions.slice(i, i + CHUNK_SIZE);
      result.push(...chunk);
      
      // Yield to browser periodically
      if (i + CHUNK_SIZE < totalSuggestions.length) {
        await new Promise(resolve => {
          if (window.requestIdleCallback) {
            window.requestIdleCallback(resolve as any, { timeout: 50 });
          } else {
            setTimeout(resolve, 10);
          }
        });
      }
    }
    
    return result.slice(0, count);
  }
  
  return totalSuggestions.slice(0, count);
};

// Generate additional suggestions when count is increased
export const generateAdditionalSuggestions = (
  searchTerm: string,
  existingSuggestions: Suggestion[],
  additionalCount: number,
  language: Language
): Suggestion[] => {
  const patterns = suggestionPatterns[language] || suggestionPatterns.en;
  const existingTexts = new Set(existingSuggestions.map(s => s.text));
  const additionalSuggestions: Suggestion[] = [];
  
  // Enhanced variation generation
  const variationWords = [
    'guide', 'tutorial', 'tips', 'tricks', 'review', 'comparison', 'analysis',
    'examples', 'solutions', 'methods', 'techniques', 'strategies', 'tools',
    'resources', 'benefits', 'features', 'advantages', 'best practices',
    'step by step', 'complete guide', 'ultimate guide', 'beginner guide',
    'advanced guide', 'professional', 'premium', 'free', 'online', 'latest',
    'new', 'updated', 'modern', 'easy', 'simple', 'quick', 'fast',
    'effective', 'efficient', 'powerful', 'comprehensive', 'detailed',
    'comprehensive', 'in-depth', 'ultimate', 'essential', 'complete',
    'practical', 'actionable', 'proven', 'tested', 'reliable'
  ];
  
  const prefixWords = [
    'best', 'top', 'great', 'excellent', 'amazing', 'outstanding',
    'perfect', 'ideal', 'optimal', 'recommended', 'popular', 'trending',
    'ultimate', 'complete', 'comprehensive', 'detailed', 'advanced',
    'professional', 'expert', 'premium', 'quality', 'superior'
  ];
  
  // Dynamic years for additional suggestions
  const currentYear = new Date().getFullYear();
  const previousYear = currentYear - 1;
  
  const suffixWords = [
    currentYear.toString(), previousYear.toString(), 'today', 'now', 'guide', 'tutorial', 'tips',
    'review', 'analysis', 'examples', 'solutions', 'methods',
    'techniques', 'strategies', 'tools', 'resources', 'benefits',
    'secrets', 'hacks', 'mastery', 'explained', 'simplified'
  ];
  
  const shuffledPatterns = shuffleArray(patterns);
  const term = searchTerm.trim();
  let attempts = 0;
  const maxAttempts = additionalCount * 10; // Prevent infinite loop
  
  while (additionalSuggestions.length < additionalCount && attempts < maxAttempts) {
    attempts++;
    
    const pattern = shuffledPatterns[Math.floor(Math.random() * shuffledPatterns.length)];
    let suggestionText = pattern.replace('{term}', term);
    
    // Create variations using different combination strategies
    const strategy = attempts % 6;
    
    switch (strategy) {
      case 0:
        // Add prefix
        const prefix = prefixWords[Math.floor(Math.random() * prefixWords.length)];
        suggestionText = `${prefix} ${suggestionText}`;
        break;
      case 1:
        // Add suffix
        const suffix = suffixWords[Math.floor(Math.random() * suffixWords.length)];
        suggestionText = `${suggestionText} ${suffix}`;
        break;
      case 2:
        // Add variation word
        const variation = variationWords[Math.floor(Math.random() * variationWords.length)];
        suggestionText = `${suggestionText} ${variation}`;
        break;
      case 3:
        // Combine prefix and suffix
        const prefix2 = prefixWords[Math.floor(Math.random() * prefixWords.length)];
        const suffix2 = suffixWords[Math.floor(Math.random() * suffixWords.length)];
        suggestionText = `${prefix2} ${suggestionText} ${suffix2}`;
        break;
      case 4:
        // Combine variation and suffix
        const variation2 = variationWords[Math.floor(Math.random() * variationWords.length)];
        const suffix3 = suffixWords[Math.floor(Math.random() * suffixWords.length)];
        suggestionText = `${suggestionText} ${variation2} ${suffix3}`;
        break;
      case 5:
        // All three
        const prefix3 = prefixWords[Math.floor(Math.random() * prefixWords.length)];
        const variation3 = variationWords[Math.floor(Math.random() * variationWords.length)];
        const suffix4 = suffixWords[Math.floor(Math.random() * suffixWords.length)];
        suggestionText = `${prefix3} ${suggestionText} ${variation3} ${suffix4}`;
        break;
    }
    
    // Check if this suggestion is unique
    if (!existingTexts.has(suggestionText)) {
      additionalSuggestions.push({
        id: generateId(),
        text: suggestionText,
        opened: false
      });
      existingTexts.add(suggestionText);
    }
  }
  
  // Final fallback with numbered variations
  let finalAttempts = 0;
  const maxFinalAttempts = (additionalCount - additionalSuggestions.length) * 2;
  
  while (additionalSuggestions.length < additionalCount && finalAttempts < maxFinalAttempts) {
    finalAttempts++;
    const basePattern = shuffledPatterns[Math.floor(Math.random() * shuffledPatterns.length)];
    const baseSuggestion = basePattern.replace('{term}', term);
    const randomNumber = Math.floor(Math.random() * 100000) + 1;
    const numberedSuggestion = `${baseSuggestion} ${randomNumber}`;
    
    if (!existingTexts.has(numberedSuggestion)) {
      additionalSuggestions.push({
        id: generateId(),
        text: numberedSuggestion,
        opened: false
      });
      existingTexts.add(numberedSuggestion);
    }
  }
  
  return additionalSuggestions.slice(0, additionalCount);
};

// Generate trending topics with async support for large counts
export const generateTrendingTopics = (
  count: number,
  language: Language,
  searchEngine: string
): Suggestion[] => {
  // For large counts, use sync version but with better optimization
  return generateTrendingTopicsSync(count, language, searchEngine);
};

// Sync version optimized for large counts
const generateTrendingTopicsSync = (
  count: number,
  language: Language,
  searchEngine: string
): Suggestion[] => {
  const topics = trendingTopics[language] || trendingTopics.en;
  const shuffledTopics = shuffleArray(topics);
  const suggestions: Suggestion[] = [];
  const existingTexts = new Set<string>();
  
  // Enhanced variation generation for large counts
  const variationPrefixes = [
    '', 'latest', 'new', 'best', 'top', 'free', 'online', 'guide',
    'tutorial', 'tips', 'review', 'comparison', 'analysis', 'update',
    'advanced', 'beginner', 'complete', 'professional', 'premium',
    'trending', 'popular', 'recommended', 'ultimate', 'essential'
  ];
  
  // Dynamic years for trending topics
  const currentYear = new Date().getFullYear();
  const previousYear = currentYear - 1;
  
  const variationSuffixes = [
    '', currentYear.toString(), previousYear.toString(), 'guide', 'tips', 'tutorial', 'review',
    'comparison', 'analysis', 'examples', 'solutions', 'methods',
    'techniques', 'strategies', 'tools', 'resources', 'benefits'
  ];
  
  // First, add original topics
  for (let i = 0; i < Math.min(count, shuffledTopics.length); i++) {
    const topic = shuffledTopics[i];
    if (!existingTexts.has(topic)) {
      suggestions.push({
        id: generateId(),
        text: topic,
        opened: false
      });
      existingTexts.add(topic);
    }
  }
  
  // Generate variations for larger counts
  let attempts = 0;
  const maxAttempts = count * 3; // Reduced to prevent over-generation
  
  while (suggestions.length < count && attempts < maxAttempts) {
    attempts++;
    
    const baseTopic = shuffledTopics[Math.floor(Math.random() * shuffledTopics.length)];
    const prefix = variationPrefixes[Math.floor(Math.random() * variationPrefixes.length)];
    const suffix = variationSuffixes[Math.floor(Math.random() * variationSuffixes.length)];
    
    // Create variation
    let variation = baseTopic;
    if (prefix) {
      variation = `${prefix} ${variation}`;
    }
    if (suffix) {
      variation = `${variation} ${suffix}`;
    }
    
    // Add unique variations
    if (!existingTexts.has(variation)) {
      suggestions.push({
        id: generateId(),
        text: variation,
        opened: false
      });
      existingTexts.add(variation);
    }
  }
  
  // Fill remaining with numbered variations if still needed
  let numberedAttempts = 0;
  const maxNumberedAttempts = (count - suggestions.length) * 2; // Limit numbered attempts
  
  while (suggestions.length < count && numberedAttempts < maxNumberedAttempts) {
    numberedAttempts++;
    const baseTopic = shuffledTopics[Math.floor(Math.random() * shuffledTopics.length)];
    const randomNum = Math.floor(Math.random() * 10000) + 1;
    const numberedVariation = `${baseTopic} ${randomNum}`;
    
    if (!existingTexts.has(numberedVariation)) {
      suggestions.push({
        id: generateId(),
        text: numberedVariation,
        opened: false
      });
      existingTexts.add(numberedVariation);
    }
  }
  
  return suggestions.slice(0, count);
};

// Async version for very large trending topic counts - simplified without progress tracking
export const generateTrendingTopicsAsync = async (
  count: number,
  language: Language,
  searchEngine: string
): Promise<Suggestion[]> => {
  // Generate all suggestions at once to avoid duplication
  const allSuggestions = generateTrendingTopicsSync(count, language, searchEngine);
  
  // For very large datasets, process in chunks to avoid blocking
  if (count > 1000) {
    const CHUNK_SIZE = 500;
    const result: Suggestion[] = [];
    
    for (let i = 0; i < allSuggestions.length; i += CHUNK_SIZE) {
      const chunk = allSuggestions.slice(i, i + CHUNK_SIZE);
      result.push(...chunk);
      
      // Yield to browser periodically
      if (i + CHUNK_SIZE < allSuggestions.length) {
        await new Promise(resolve => {
          if (window.requestIdleCallback) {
            window.requestIdleCallback(resolve as any, { timeout: 50 });
          } else {
            setTimeout(resolve, 10);
          }
        });
      }
    }
    
    return result.slice(0, count);
  }
  
  return allSuggestions.slice(0, count);
};
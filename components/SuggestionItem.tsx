import React from 'react';
import { Suggestion } from './types';

interface SuggestionItemProps {
  suggestion: Suggestion;
  onClick: (suggestion: Suggestion) => void;
  isSimpleModal?: boolean;
  copyMode?: boolean;
  behaviorMode?: 'new-tab' | 'same-tab' | 'floating-tab' | 'copy';
}

export const SuggestionItem: React.FC<SuggestionItemProps> = React.memo(({ 
  suggestion, 
  onClick, 
  isSimpleModal = false,
  copyMode = false,
  behaviorMode = 'new-tab'
}) => {
  const getActionIcon = () => {
    if (copyMode || behaviorMode === 'copy') {
      return <i className="bi bi-clipboard copy-icon" aria-hidden="true"></i>;
    }
    if (behaviorMode === 'same-tab') {
      return <i className="bi bi-arrow-right external-link-icon" aria-hidden="true"></i>;
    }
    if (behaviorMode === 'floating-tab') {
      return <i className="bi bi-window external-link-icon" aria-hidden="true"></i>;
    }
    return <i className="bi bi-box-arrow-up-right external-link-icon" aria-hidden="true"></i>;
  };

  const getAriaLabel = () => {
    if (copyMode || behaviorMode === 'copy') {
      return `Copy "${suggestion.text}"`;
    }
    if (behaviorMode === 'same-tab') {
      return `Search for "${suggestion.text}" in same tab`;
    }
    if (behaviorMode === 'floating-tab') {
      return `Search for "${suggestion.text}" in floating tab`;
    }
    return `Search for "${suggestion.text}" in new tab`;
  };

  return (
    <div
      onClick={() => onClick(suggestion)}
      className={`suggestion-item ${suggestion.opened ? 'opened' : ''} ${isSimpleModal ? 'simple-modal-item' : ''}`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(suggestion);
        }
      }}
      aria-label={getAriaLabel()}
    >
      {suggestion.opened && (
        <i className="bi bi-check-circle-fill text-success flex-shrink-0" aria-hidden="true"></i>
      )}
      <span className="flex-grow-1">
        {suggestion.text}
      </span>
      {getActionIcon()}
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison for optimization
  return (
    prevProps.suggestion.id === nextProps.suggestion.id &&
    prevProps.suggestion.text === nextProps.suggestion.text &&
    prevProps.suggestion.opened === nextProps.suggestion.opened &&
    prevProps.copyMode === nextProps.copyMode &&
    prevProps.behaviorMode === nextProps.behaviorMode &&
    prevProps.isSimpleModal === nextProps.isSimpleModal
  );
});

SuggestionItem.displayName = 'SuggestionItem';
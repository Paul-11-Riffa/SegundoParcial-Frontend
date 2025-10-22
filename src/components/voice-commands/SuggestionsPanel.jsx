/**
 * 💡 Panel de Sugerencias
 * Muestra sugerencias cuando el comando es ambiguo
 */

import React from 'react';
import { FaLightbulb, FaArrowRight } from 'react-icons/fa';
import { formatConfidence } from '../../utils/commandUtils';
import styles from '../../styles/VoiceCommandsPage.module.css';

const SuggestionsPanel = ({ suggestions, onSuggestionClick }) => {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div className={styles.suggestionsPanel}>
      <div className={styles.suggestionsHeader}>
        <FaLightbulb className={styles.suggestionIcon} />
        <h3>¿Quisiste decir...?</h3>
        <p>Haz clic en la opción que mejor describa lo que necesitas:</p>
      </div>

      <div className={styles.suggestionsList}>
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            className={styles.suggestionCard}
            onClick={() => onSuggestionClick(suggestion)}
          >
            <div className={styles.suggestionContent}>
              <div className={styles.suggestionTitle}>
                <span className={styles.suggestionEmoji}>📊</span>
                <span>{suggestion.name}</span>
              </div>
              {suggestion.description && (
                <p className={styles.suggestionDescription}>
                  {suggestion.description}
                </p>
              )}
              <div className={styles.suggestionFooter}>
                <span className={styles.suggestionType}>
                  Tipo: {suggestion.type}
                </span>
                <span className={styles.suggestionConfidence}>
                  {formatConfidence(suggestion.confidence)} coincidencia
                </span>
              </div>
            </div>
            <FaArrowRight className={styles.suggestionArrow} />
          </button>
        ))}
      </div>
    </div>
  );
};

export default SuggestionsPanel;

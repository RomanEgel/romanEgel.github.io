import { css } from '@emotion/react'

export interface ThemeColors {
  bg_color: string;
  text_color: string;
  button_color: string;
  button_text_color: string;
  hint_color: string;
  link_color: string;
  secondary_bg_color: string;
  subtitle_text_color: string;
  accent_text_color: string;
  destructive_text_color: string;
  header_bg_color: string;
  section_bg_color: string;
  section_header_text_color: string;
}

export const createAppStyles = (colors: ThemeColors) => css`
  .app-body {
    background-color: ${colors.bg_color};
    color: ${colors.text_color};
  }
  .app-header {
    background-color: ${colors.header_bg_color};
    color: ${colors.text_color};
  }
  .app-button {
    background-color: ${colors.button_color};
    color: ${colors.button_text_color};
    &:hover {
      opacity: 0.9;
    }
  }
  .app-input {
    background-color: ${colors.secondary_bg_color};
    color: ${colors.text_color};
    &::placeholder {
      color: ${colors.hint_color};
    }
  }
  .app-link {
    color: ${colors.link_color};
    &:hover {
      text-decoration: underline;
    }
  }
  .app-card {
    background-color: ${colors.secondary_bg_color};
    border: 1px solid ${colors.hint_color}33; // 33 for 20% opacity
  }
  .app-hint {
    color: ${colors.hint_color};
  }
  .app-subtitle {
    color: ${colors.subtitle_text_color};
  }
  .app-text {
    color: ${colors.text_color};
  }
  .app-accent {
    color: ${colors.accent_text_color};
  }
  .app-destructive {
    color: ${colors.destructive_text_color};
  }
  .app-section {
    background-color: ${colors.section_bg_color};
  }
  .app-section-header {
    color: ${colors.section_header_text_color};
  }
  
  // Dropdown styles
  .app-dropdown {
    background-color: ${colors.secondary_bg_color};
    border: 1px solid ${colors.hint_color}33;
  }
  .app-dropdown-item {
    color: ${colors.text_color};
    &:hover {
      background-color: ${colors.button_color}33;
    }
    &.active {
      background-color: ${colors.button_color};
      color: ${colors.button_text_color};
    }
  }
  
  // Navigation styles
  .app-nav-item {
    color: ${colors.text_color};
    &.active {
      color: ${colors.link_color};
    }
  }
  
  // Search input styles
  .app-search-icon {
    color: ${colors.hint_color};
  }
  
  // Image container styles
  .app-image-container {
    background-color: ${colors.secondary_bg_color};
  }
  
  // Date styles
  .app-publication-date {
    color: ${colors.subtitle_text_color};
    font-size: 0.9em;
  }
    
  .app-event-date {
    color: ${colors.accent_text_color};
    font-weight: bold;
  }
  
  // Price styles
  .app-price {
    color: ${colors.accent_text_color};
  }
  
  // Author styles
  .app-author-text {
    color: ${colors.subtitle_text_color};
    font-size: 0.95em;
  }
  .app-author {
    color: ${colors.link_color};
    font-size: 0.95em;
  }
`
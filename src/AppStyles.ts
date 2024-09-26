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
  .app-filter-row {
    background-color: ${colors.secondary_bg_color};
    flex-shrink: 0;
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
  
  .app-container {
    background-color: ${colors.bg_color};
    max-width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: relative; // Add this to create a positioning context
  }

  main {
    flex-grow: 1;
    overflow-y: auto;
    padding-bottom: 60px; // Add padding to account for the fixed nav bar
  }

  nav.app-header {
    height: 60px; // Set a fixed height for the nav bar
  }

  @media (min-width: 768px) {
    .app-body {
      background-color: ${colors.secondary_bg_color};
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
      height: 100vh;
    }

    .app-container {
      max-width: 430px;
      max-height: 932px;
      width: 100%;
      height: calc(100vh - 40px);
      position: relative;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
      border-radius: 20px;
      overflow: hidden; // Ensure content doesn't overflow the rounded corners
    }

    nav.app-header {
      position: absolute; // Change to absolute positioning within the container
      bottom: 0;
      left: 0;
      right: 0;
    }
  }
`
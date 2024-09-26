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
    padding-bottom: env(safe-area-inset-bottom);
  }
  .app-header {
    position: fixed;
    top: env(safe-area-inset-top);
    left: env(safe-area-inset-left);
    right: env(safe-area-inset-right);
    z-index: 20;
    background-color: ${colors.header_bg_color};
    color: ${colors.text_color};
    padding: 0.5rem;
    height: 40px;
  }
  .app-filter-row {
    position: fixed;
    top: calc(env(safe-area-inset-top) + 40px);
    left: env(safe-area-inset-left);
    right: env(safe-area-inset-right);
    z-index: 10;
    background-color: ${colors.bg_color};
    padding: 0.5rem 1rem;
    height: 60px;
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
    position: relative;
  }

  .app-main-content {
    flex-grow: 1;
    overflow-y: auto;
    padding-top: 100px; // Height of header (40px) + filter row (60px)
  }

  .app-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: ${colors.bg_color};
    height: 60px;
    z-index: 20;
  }

  // Remove any padding from the container inside main content
  .app-main-content > .container {
    padding-top: 0;
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

    .app-header,
    .app-filter-row,
    .app-nav {
      position: absolute;
      left: 0;
      right: 0;
    }

    .app-header {
      top: 0;
    }

    .app-filter-row {
      top: 40px; // Adjust based on your header height
    }

    .app-nav {
      bottom: 0;
    }

    .app-main-content {
      margin-top: 100px; // Adjusted for header and filter row
      margin-bottom: 60px; // Adjust based on nav height
      height: calc(100% - 160px); // Adjusted for all fixed elements
      padding-top: 0; // Remove top padding for larger screens
      overflow-y: auto;
    }
  }
`
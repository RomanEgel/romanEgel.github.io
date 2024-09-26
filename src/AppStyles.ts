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
  section_separator_color: string;
}

// Add this utility function
const isLightColor = (color: string): boolean => {
  // Remove the hash if it's there
  const hex = color.replace('#', '');
  
  // Convert to RGB
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Calculate relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Return true if the color is light, false if it's dark
  return luminance > 0.5;
}

// Update the createCSSVariables function
const createCSSVariables = (colors: ThemeColors) => `
  :root {
    --bg-color: ${colors.bg_color};
    --text-color: ${colors.text_color};
    --button-color: ${colors.button_color};
    --button-text-color: ${colors.button_text_color};
    --hint-color: ${colors.hint_color};
    --link-color: ${colors.link_color};
    --secondary-bg-color: ${colors.secondary_bg_color};
    --subtitle-text-color: ${colors.subtitle_text_color};
    --accent-text-color: ${colors.accent_text_color};
    --destructive-text-color: ${colors.destructive_text_color};
    --header-bg-color: ${colors.header_bg_color};
    --header-text-color: ${isLightColor(colors.header_bg_color) ? '#000000' : '#ffffff'};
    --section-bg-color: ${colors.section_bg_color};
    --section-header-text-color: ${colors.section_header_text_color};
    --section-separator-color: ${colors.section_separator_color};
  }
`

const baseStyles = css`
  .app-body {
    background-color: var(--secondary-bg-color);
    color: var(--text-color);
    padding-bottom: env(safe-area-inset-bottom);
  }
  .app-container {
    background-color: var(--secondary-bg-color);
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
    padding-top: 110px; // Height of header (40px) + filter row (60px)
  }
  .app-main-content > .container {
    padding-top: 0;
  }
`

const layoutStyles = css`
  .app-header {
    position: fixed;
    top: env(safe-area-inset-top);
    left: env(safe-area-inset-left);
    right: env(safe-area-inset-right);
    z-index: 20;
    background-color: var(--header-bg-color);
    color: var(--header-text-color);
    padding: 0.5rem;
    height: 40px;
  }
  .app-filter-row {
    position: fixed;
    top: calc(env(safe-area-inset-top) + 40px);
    left: env(safe-area-inset-left);
    right: env(safe-area-inset-right);
    z-index: 10;
    background-color: var(--header-bg-color);
    padding: 0.5rem 1rem;
    height: 60px;
  }
  .app-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: var(--bg-color);
    height: 60px;
    z-index: 20;
  }
`

const componentStyles = css`
  .app-button {
    background-color: var(--button-color);
    color: var(--button-text-color);
    opacity: 0.9;
    &:hover {
      opacity: 0.8;
    }
  }
  .app-input {
    background-color: var(--bg-color);
    color: var(--text-color);
    &::placeholder {
      color: var(--hint-color);
    }
  }
  .app-link {
    color: var(--link-color);
    &:hover {
      text-decoration: underline;
    }
  }
  .app-card {
    background-color: var(--section-bg-color);
    border: 1px solid var(--section-separator-color);
  }
  .app-dropdown {
    background-color: var(--secondary-bg-color);
    border: 1px solid var(--hint-color)33;
  }
  .app-dropdown-item {
    color: var(--text-color);
    &:hover {
      background-color: var(--button-color)33;
    }
    &.active {
      background-color: var(--button-color);
      color: var(--button-text-color);
    }
  }
  .app-nav-item {
    color: var(--text-color);
    &.active {
      color: var(--link-color);
    }
    border: 1px solid var(--secondary-bg-color);
  }
  .app-search-icon {
    color: var(--hint-color);
  }
  .app-image-container {
    background-color: var(--secondary-bg-color);
  }
`
const responsiveStyles = css`
  @media (min-width: 768px) {
    .app-body {
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
      overflow: hidden;
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
      top: 40px;
    }

    .app-nav {
      bottom: 0;
    }

    .app-main-content {
      margin-top: 110px;
      margin-bottom: 60px;
      height: calc(100% - 160px);
      padding-top: 0;
      overflow-y: auto;
    }
  }
`

const textStyles = css`
  .app-hint {
    color: var(--hint-color);
  }
  .app-subtitle {
    color: var(--subtitle-text-color);
  }
  .app-text {
    color: var(--text-color);
  }
  .app-button-text {
    color: var(--button-text-color);
  }
  .app-accent {
    color: var(--accent-text-color);
  }
  .app-destructive {
    color: var(--destructive-text-color);
  }
  .app-section-header {
    color: var(--section-header-text-color);
  }
  .app-publication-date {
    color: var(--subtitle-text-color);
    font-size: 0.9em;
  }
  .app-event-date {
    color: var(--accent-text-color);
    font-weight: bold;
  }
  .app-price {
    color: var(--accent-text-color);
  }
  .app-author-text {
    color: var(--subtitle-text-color);
    font-size: 0.95em;
  }
  .app-author {
    color: var(--link-color);
    font-size: 0.95em;
  }
`

export const createAppStyles = (colors: ThemeColors) => css`
  ${createCSSVariables(colors)}
  ${baseStyles}
  ${layoutStyles}
  ${componentStyles}
  ${textStyles}
  ${responsiveStyles}
`

// Create a new file for responsive styles: AppResponsiveStyles.ts
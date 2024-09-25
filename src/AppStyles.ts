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
}

export const createAppStyles = (colors: ThemeColors) => css`
  .app-body {
    background-color: ${colors.bg_color};
    color: ${colors.text_color};
  }
  .app-header {
    background-color: ${colors.secondary_bg_color};
  }
  .app-button {
    background-color: ${colors.button_color};
    color: ${colors.button_text_color};
  }
  .app-input {
    background-color: ${colors.secondary_bg_color};
    color: ${colors.text_color};
  }
  .app-link {
    color: ${colors.link_color};
  }
  .app-card {
    background-color: ${colors.secondary_bg_color};
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
`
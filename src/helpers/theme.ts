export enum ThemeMode {
  Light = 'light-theme',
  Dark = 'dark-theme',
}

export class Theme {
  private static STORAGE_KEY = 'user-theme'

  static getTheme(): ThemeMode {
    return localStorage.getItem(this.STORAGE_KEY) as ThemeMode
  }

  static getMediaPreference(): ThemeMode {
    const media = '(prefers-color-scheme: dark)'
    const hasDarkPreference = window.matchMedia(media).matches
    return hasDarkPreference ? ThemeMode.Dark : ThemeMode.Light
  }

  static setTheme(theme: ThemeMode) {
    localStorage.setItem(this.STORAGE_KEY, theme)
    document.documentElement.className = theme
  }
}

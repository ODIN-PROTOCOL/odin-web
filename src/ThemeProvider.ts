
export interface Settings {
  language: string,
  theme: string  
}

export const SettingsStateSymbol = Symbol('User settings state provider');
export const SettingsUpdateSymbol = Symbol('User settings update provider');
export interface Language {
  code: string;
  name: string;
  default?: boolean;
}

export interface LanguageResponse {
  data: Language[];
}

export interface UserLanguage {
  language_code: string;
  language_name: string;
}

export interface UpdateLanguageInput {
  language_code: string;
}

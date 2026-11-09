export interface PersonalInfo {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  /** "YYYY-MM" */
  start: string;
  /** "YYYY-MM", empty when `current` is true */
  end: string;
  current: boolean;
  /** One achievement per line */
  bullets: string;
}

export interface Education {
  id: string;
  degree: string;
  school: string;
  start: string;
  end: string;
}

export type Template = 'classic' | 'modern';

export interface ResumeSettings {
  accent: string;
  template: Template;
}

export interface Resume {
  personal: PersonalInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  /** Comma-separated list */
  skills: string;
  settings: ResumeSettings;
}

/** Keys of Resume that hold a list of items with an `id`. */
export type ListKey = 'experience' | 'education';

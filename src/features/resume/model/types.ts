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
  /** "YYYY-MM" or empty */
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
  /** "YYYY" or empty */
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
  skills: string[];
  settings: ResumeSettings;
}

export type MoveDirection = -1 | 1;

/** Every change to the resume goes through one of these actions. */
export type ResumeAction =
  | { type: 'personal/set'; field: keyof PersonalInfo; value: string }
  | { type: 'summary/set'; value: string }
  | { type: 'experience/add' }
  | { type: 'experience/update'; id: string; patch: Partial<Omit<Experience, 'id'>> }
  | { type: 'experience/remove'; id: string }
  | { type: 'experience/move'; id: string; direction: MoveDirection }
  | { type: 'education/add' }
  | { type: 'education/update'; id: string; patch: Partial<Omit<Education, 'id'>> }
  | { type: 'education/remove'; id: string }
  | { type: 'skills/set'; skills: string[] }
  | { type: 'settings/set'; patch: Partial<ResumeSettings> }
  | { type: 'resume/replace'; resume: Resume };

import { sampleResume } from './defaults';
import type { Resume } from './types';

export const STORAGE_KEY = 'resumeforge:v2';

const isObject = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null;

/**
 * Validates data read from localStorage. Older saves stored skills as a
 * comma-separated string; those are converted to an array.
 */
export function parseStoredResume(raw: unknown): Resume | null {
  if (!isObject(raw) || !isObject(raw.personal) || !Array.isArray(raw.experience)) return null;
  const skills = Array.isArray(raw.skills)
    ? raw.skills.filter((s): s is string => typeof s === 'string')
    : typeof raw.skills === 'string'
      ? raw.skills.split(',').map((s) => s.trim()).filter(Boolean)
      : [];
  return {
    ...sampleResume,
    ...(raw as Partial<Resume>),
    skills,
    settings: { ...sampleResume.settings, ...(isObject(raw.settings) ? (raw.settings as Partial<Resume['settings']>) : {}) },
  };
}

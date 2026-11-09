import { createEducation, createExperience } from './defaults';
import type { Resume, ResumeAction } from './types';

/** Swaps an item with its neighbour; returns the same array when the move is not possible. */
function moveItem<T extends { id: string }>(list: T[], id: string, direction: -1 | 1): T[] {
  const index = list.findIndex((item) => item.id === id);
  const target = index + direction;
  if (index === -1 || target < 0 || target >= list.length) return list;
  const next = [...list];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

/**
 * Pure reducer for the whole resume.
 * Only the item that changed gets a new object, so memoized list items
 * that did not change keep the same reference and skip re-rendering.
 */
export function resumeReducer(state: Resume, action: ResumeAction): Resume {
  switch (action.type) {
    case 'personal/set':
      return { ...state, personal: { ...state.personal, [action.field]: action.value } };

    case 'summary/set':
      return { ...state, summary: action.value };

    case 'experience/add':
      return { ...state, experience: [...state.experience, createExperience()] };

    case 'experience/update':
      return {
        ...state,
        experience: state.experience.map((job) => {
          if (job.id !== action.id) return job;
          const next = { ...job, ...action.patch };
          // A current job has no end date.
          return next.current ? { ...next, end: '' } : next;
        }),
      };

    case 'experience/remove':
      return { ...state, experience: state.experience.filter((job) => job.id !== action.id) };

    case 'experience/move':
      return { ...state, experience: moveItem(state.experience, action.id, action.direction) };

    case 'education/add':
      return { ...state, education: [...state.education, createEducation()] };

    case 'education/update':
      return {
        ...state,
        education: state.education.map((edu) => (edu.id === action.id ? { ...edu, ...action.patch } : edu)),
      };

    case 'education/remove':
      return { ...state, education: state.education.filter((edu) => edu.id !== action.id) };

    case 'skills/set': {
      // Trim, drop empties and remove duplicates (case-insensitive), keeping the first spelling.
      const seen = new Set<string>();
      const skills = action.skills
        .map((s) => s.trim())
        .filter((s) => {
          const key = s.toLowerCase();
          if (!s || seen.has(key)) return false;
          seen.add(key);
          return true;
        });
      return { ...state, skills };
    }

    case 'settings/set':
      return { ...state, settings: { ...state.settings, ...action.patch } };

    case 'resume/replace':
      return action.resume;
  }
}

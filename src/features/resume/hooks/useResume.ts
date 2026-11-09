import { useContext, useMemo } from 'react';
import { ResumeDispatchContext, ResumeStateContext } from '../context/ResumeContext';
import { blankResume, sampleResume } from '../model/defaults';
import type { Education, Experience, MoveDirection, PersonalInfo, Resume, ResumeSettings } from '../model/types';

/** Current resume data. Re-renders the caller whenever the resume changes. */
export function useResumeState(): Resume {
  const state = useContext(ResumeStateContext);
  if (!state) throw new Error('useResumeState must be used inside <ResumeProvider>');
  return state;
}

/**
 * Named, stable action creators. Components that only call these
 * never re-render because of resume changes.
 */
export function useResumeActions() {
  const dispatch = useContext(ResumeDispatchContext);
  if (!dispatch) throw new Error('useResumeActions must be used inside <ResumeProvider>');

  return useMemo(
    () => ({
      setPersonal: (field: keyof PersonalInfo, value: string) => dispatch({ type: 'personal/set', field, value }),
      setSummary: (value: string) => dispatch({ type: 'summary/set', value }),
      addExperience: () => dispatch({ type: 'experience/add' }),
      updateExperience: (id: string, patch: Partial<Omit<Experience, 'id'>>) => dispatch({ type: 'experience/update', id, patch }),
      removeExperience: (id: string) => dispatch({ type: 'experience/remove', id }),
      moveExperience: (id: string, direction: MoveDirection) => dispatch({ type: 'experience/move', id, direction }),
      addEducation: () => dispatch({ type: 'education/add' }),
      updateEducation: (id: string, patch: Partial<Omit<Education, 'id'>>) => dispatch({ type: 'education/update', id, patch }),
      removeEducation: (id: string) => dispatch({ type: 'education/remove', id }),
      setSkills: (skills: string[]) => dispatch({ type: 'skills/set', skills }),
      setSettings: (patch: Partial<ResumeSettings>) => dispatch({ type: 'settings/set', patch }),
      loadExample: () => dispatch({ type: 'resume/replace', resume: sampleResume }),
      clear: () => dispatch({ type: 'resume/replace', resume: blankResume }),
    }),
    [dispatch]
  );
}

export type ResumeActions = ReturnType<typeof useResumeActions>;

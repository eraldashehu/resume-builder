import { createContext } from 'react';
import type { Dispatch, ReactNode } from 'react';
import { usePersistentReducer } from '../../../shared/hooks/usePersistentReducer';
import { sampleResume } from '../model/defaults';
import { resumeReducer } from '../model/resumeReducer';
import { STORAGE_KEY, parseStoredResume } from '../model/storage';
import type { Resume, ResumeAction } from '../model/types';

/*
 * State and dispatch live in two separate contexts.
 * `dispatch` never changes, so components that only send updates
 * (buttons, inputs) are not re-rendered when the resume changes.
 */
export const ResumeStateContext = createContext<Resume | null>(null);
export const ResumeDispatchContext = createContext<Dispatch<ResumeAction> | null>(null);

interface ResumeProviderProps {
  children: ReactNode;
  /** Starting data when nothing is saved yet (handy for tests). */
  initialResume?: Resume;
}

export function ResumeProvider({ children, initialResume = sampleResume }: ResumeProviderProps) {
  const [resume, dispatch] = usePersistentReducer(resumeReducer, initialResume, {
    key: STORAGE_KEY,
    parse: parseStoredResume,
  });

  // `dispatch` from useReducer keeps the same identity for the component's lifetime,
  // so the dispatch context value never changes.
  return (
    <ResumeDispatchContext.Provider value={dispatch}>
      <ResumeStateContext.Provider value={resume}>{children}</ResumeStateContext.Provider>
    </ResumeDispatchContext.Provider>
  );
}

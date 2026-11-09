import { useMemo } from 'react';
import { totalYears } from '../lib/format';
import type { Experience } from '../model/types';

/** Total years of experience, recalculated only when the jobs change. */
export function useYearsOfExperience(experience: Experience[]): number {
  return useMemo(() => totalYears(experience), [experience]);
}

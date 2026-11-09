import type { Experience } from '../types';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const;

/** "2022-03" -> "Mar 2022", "2020" -> "2020". */
export function formatMonth(value: string): string {
  if (!value) return '';
  const [year, month] = value.split('-');
  if (!month) return year;
  return `${MONTHS[Number(month) - 1] ?? ''} ${year}`.trim();
}

export function formatRange(start: string, end: string, current: boolean): string {
  const from = formatMonth(start);
  const to = current ? 'Present' : formatMonth(end);
  if (from && to) return `${from} – ${to}`;
  return from || to;
}

/** Rough total years of experience, used by the suggested summary. */
export function totalYears(experience: Experience[]): number {
  const now = new Date();
  let months = 0;
  for (const job of experience) {
    if (!job.start) continue;
    const [sy, sm = '1'] = job.start.split('-');
    const start = new Date(Number(sy), Number(sm) - 1);
    let end = now;
    if (!job.current && job.end) {
      const [ey, em = '12'] = job.end.split('-');
      end = new Date(Number(ey), Number(em) - 1);
    }
    months += Math.max(0, (end.getFullYear() - start.getFullYear()) * 12 + end.getMonth() - start.getMonth());
  }
  return Math.floor(months / 12);
}

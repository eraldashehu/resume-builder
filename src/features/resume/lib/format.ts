import dayjs from 'dayjs';
import type { Experience } from '../model/types';

/** "2022-03" -> "Mar 2022", "2020" -> "2020". */
export function formatMonth(value: string): string {
  if (!value) return '';
  return value.length === 4 ? value : dayjs(`${value}-01`).format('MMM YYYY');
}

export function formatRange(start: string, end: string, current: boolean): string {
  const from = formatMonth(start);
  const to = current ? 'Present' : formatMonth(end);
  if (from && to) return `${from} – ${to}`;
  return from || to;
}

/** Splits multi-line text into trimmed, non-empty lines. */
export const toLines = (text: string): string[] =>
  text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

/** Total whole years across all jobs; overlapping jobs are counted once per month. */
export function totalYears(experience: Experience[], today = dayjs()): number {
  const months = new Set<string>();
  for (const job of experience) {
    if (!job.start) continue;
    let cursor = dayjs(`${job.start}-01`);
    const end = job.current || !job.end ? today : dayjs(`${job.end}-01`);
    while (cursor.isBefore(end, 'month')) {
      months.add(cursor.format('YYYY-MM'));
      cursor = cursor.add(1, 'month');
    }
  }
  return Math.floor(months.size / 12);
}

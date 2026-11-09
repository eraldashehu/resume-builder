interface SummaryInput {
  title: string;
  skills: string;
  years: number;
}

/**
 * Builds a starting summary from the job title, years of experience and top skills.
 * The user then edits it into their own words.
 */
export function suggestSummary({ title, skills, years }: SummaryInput): string {
  const topSkills = skills
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 3);
  const role = title || 'Professional';
  const exp = years > 0 ? `${years}+ years of experience` : 'hands-on experience';
  const skillText = topSkills.length ? ` with ${topSkills.join(', ')}` : '';
  return `${role} with ${exp}${skillText}. Focused on building reliable, user-friendly products, communicating clearly with teammates and delivering work on time.`;
}

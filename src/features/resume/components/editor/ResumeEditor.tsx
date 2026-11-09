import { Flex } from 'antd';
import { useResumeState } from '../../hooks/useResume';
import { PersonalInfoCard } from './PersonalInfoCard';
import { SummaryCard } from './SummaryCard';
import { ExperienceCard } from './ExperienceCard';
import { EducationCard } from './EducationCard';
import { SkillsCard } from './SkillsCard';

/**
 * Reads the resume once and passes each card only the slice it needs.
 * Because every card is memoized, typing in one field re-renders only that card.
 */
export function ResumeEditor() {
  const { personal, summary, experience, education, skills } = useResumeState();

  return (
    <Flex vertical gap={16}>
      <PersonalInfoCard personal={personal} />
      <SummaryCard summary={summary} title={personal.title} skills={skills} experience={experience} />
      <ExperienceCard experience={experience} />
      <EducationCard education={education} />
      <SkillsCard skills={skills} />
    </Flex>
  );
}

import { memo, useMemo } from 'react';
import { Card, Select } from 'antd';
import { useResumeActions } from '../../hooks/useResume';

const SUGGESTED_SKILLS = [
  'React', 'TypeScript', 'JavaScript', 'HTML5', 'CSS', 'Sass', 'Ant Design', 'Redux Toolkit',
  'React Query', 'Next.js', 'Vite', 'Jest', 'React Testing Library', 'REST APIs', 'GraphQL',
  'Git', 'Accessibility', 'Responsive design', 'Agile', 'Figma',
];

interface SkillsCardProps {
  skills: string[];
}

export const SkillsCard = memo(function SkillsCard({ skills }: SkillsCardProps) {
  const { setSkills } = useResumeActions();

  // Suggestions that are not already selected; recomputed only when skills change.
  const options = useMemo(() => {
    const chosen = new Set(skills.map((s) => s.toLowerCase()));
    return SUGGESTED_SKILLS.filter((s) => !chosen.has(s.toLowerCase())).map((s) => ({ value: s, label: s }));
  }, [skills]);

  return (
    <Card title="Skills" size="small">
      <Select
        mode="tags"
        aria-label="Skills"
        value={skills}
        onChange={setSkills}
        options={options}
        tokenSeparators={[',']}
        placeholder="Type a skill and press Enter, or pick a suggestion"
        style={{ width: '100%' }}
      />
    </Card>
  );
});

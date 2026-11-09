import { memo, useEffect, useRef } from 'react';
import { Button, Card, Empty } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { ExperienceItem } from './ExperienceItem';
import { useResumeActions } from '../../hooks/useResume';
import type { Experience } from '../../model/types';

interface ExperienceCardProps {
  experience: Experience[];
}

export const ExperienceCard = memo(function ExperienceCard({ experience }: ExperienceCardProps) {
  const actions = useResumeActions();
  const listRef = useRef<HTMLDivElement>(null);
  const previousCount = useRef(experience.length);

  // When a job is added, scroll it into view and focus its first field.
  // useRef keeps the previous count between renders without causing a re-render.
  useEffect(() => {
    if (experience.length > previousCount.current) {
      const newItem = listRef.current?.lastElementChild;
      newItem?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      newItem?.querySelector('input')?.focus({ preventScroll: true });
    }
    previousCount.current = experience.length;
  }, [experience.length]);

  return (
    <Card
      title="Experience"
      size="small"
      extra={
        <Button size="small" type="primary" ghost icon={<PlusOutlined />} onClick={actions.addExperience}>
          Add job
        </Button>
      }
    >
      {experience.length === 0 ? (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No jobs yet. Add your most recent role first." />
      ) : (
        <div ref={listRef} className="editor-list">
          {experience.map((job, i) => (
            <ExperienceItem key={job.id} job={job} index={i} total={experience.length} actions={actions} />
          ))}
        </div>
      )}
    </Card>
  );
});

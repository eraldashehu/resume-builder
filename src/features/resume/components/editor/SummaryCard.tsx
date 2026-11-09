import { memo, useCallback } from 'react';
import { App, Button, Card, Input, Tooltip } from 'antd';
import { BulbOutlined } from '@ant-design/icons';
import { useResumeActions } from '../../hooks/useResume';
import { useYearsOfExperience } from '../../hooks/useYearsOfExperience';
import { suggestSummary } from '../../lib/summary';
import type { Experience } from '../../model/types';

interface SummaryCardProps {
  summary: string;
  title: string;
  skills: string[];
  experience: Experience[];
}

const MAX_LENGTH = 600;

export const SummaryCard = memo(function SummaryCard({ summary, title, skills, experience }: SummaryCardProps) {
  const { setSummary } = useResumeActions();
  const { message } = App.useApp();
  const years = useYearsOfExperience(experience);

  const handleSuggest = useCallback(() => {
    setSummary(suggestSummary({ title, skills, years }));
    message.success('Summary added. Edit it to make it yours.');
  }, [setSummary, title, skills, years, message]);

  return (
    <Card
      title="Summary"
      size="small"
      extra={
        <Tooltip title="Builds a starting point from your job title, years of experience and skills">
          <Button size="small" icon={<BulbOutlined />} onClick={handleSuggest}>
            Suggest a summary
          </Button>
        </Tooltip>
      }
    >
      <Input.TextArea
        id="summary"
        aria-label="Professional summary"
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
        placeholder="Two or three sentences about what you do best."
        autoSize={{ minRows: 3, maxRows: 8 }}
        maxLength={MAX_LENGTH}
        showCount
      />
    </Card>
  );
});

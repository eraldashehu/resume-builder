import { memo } from 'react';
import { Button, Checkbox, Col, DatePicker, Flex, Form, Input, Popconfirm, Row, Tooltip, Typography } from 'antd';
import { ArrowDownOutlined, ArrowUpOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import type { ResumeActions } from '../../hooks/useResume';
import type { Experience } from '../../model/types';

interface ExperienceItemProps {
  job: Experience;
  index: number;
  total: number;
  actions: Pick<ResumeActions, 'updateExperience' | 'removeExperience' | 'moveExperience'>;
}

const toMonth = (value: string): Dayjs | null => (value ? dayjs(`${value}-01`) : null);
const fromMonth = (value: Dayjs | null): string => (value ? value.format('YYYY-MM') : '');

/**
 * One job in the list. Memoized, and `actions` is a stable object,
 * so editing one job does not re-render the others.
 */
export const ExperienceItem = memo(function ExperienceItem({ job, index, total, actions }: ExperienceItemProps) {
  const { updateExperience, removeExperience, moveExperience } = actions;
  const update = (patch: Partial<Omit<Experience, 'id'>>) => updateExperience(job.id, patch);
  const start = toMonth(job.start);

  return (
    <div className="editor-item">
      <Flex align="center" gap={4} style={{ marginBottom: 8 }}>
        <Typography.Text strong style={{ flex: 1 }} ellipsis>
          {job.role || `Job ${index + 1}`}
          {job.company && <Typography.Text type="secondary"> · {job.company}</Typography.Text>}
        </Typography.Text>
        <Tooltip title="Move up">
          <Button size="small" type="text" icon={<ArrowUpOutlined />} disabled={index === 0} onClick={() => moveExperience(job.id, -1)} aria-label="Move up" />
        </Tooltip>
        <Tooltip title="Move down">
          <Button size="small" type="text" icon={<ArrowDownOutlined />} disabled={index === total - 1} onClick={() => moveExperience(job.id, 1)} aria-label="Move down" />
        </Tooltip>
        <Popconfirm title="Remove this job?" okText="Remove" okButtonProps={{ danger: true }} onConfirm={() => removeExperience(job.id)}>
          <Button size="small" type="text" danger icon={<DeleteOutlined />} aria-label="Remove job" />
        </Popconfirm>
      </Flex>

      <Form layout="vertical" component="div">
        <Row gutter={12}>
          <Col xs={24} sm={12}>
            <Form.Item label="Role" htmlFor={`role-${job.id}`} style={{ marginBottom: 12 }}>
              <Input id={`role-${job.id}`} value={job.role} placeholder="Frontend Developer" onChange={(e) => update({ role: e.target.value })} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item label="Company" htmlFor={`company-${job.id}`} style={{ marginBottom: 12 }}>
              <Input id={`company-${job.id}`} value={job.company} placeholder="Company name" onChange={(e) => update({ company: e.target.value })} />
            </Form.Item>
          </Col>
          <Col xs={12}>
            <Form.Item label="Start" style={{ marginBottom: 12 }}>
              <DatePicker
                picker="month"
                format="MMM YYYY"
                value={start}
                onChange={(value) => update({ start: fromMonth(value) })}
                disabledDate={(d) => d.isAfter(dayjs(), 'month')}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col xs={12}>
            <Form.Item label="End" style={{ marginBottom: 12 }}>
              <DatePicker
                picker="month"
                format="MMM YYYY"
                value={job.current ? null : toMonth(job.end)}
                placeholder={job.current ? 'Present' : 'Select month'}
                disabled={job.current}
                onChange={(value) => update({ end: fromMonth(value) })}
                disabledDate={(d) => (start ? d.isBefore(start, 'month') : false) || d.isAfter(dayjs(), 'month')}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Checkbox checked={job.current} onChange={(e) => update({ current: e.target.checked })} style={{ marginBottom: 12 }}>
          I currently work here
        </Checkbox>
        <Form.Item
          label="Achievements"
          htmlFor={`bullets-${job.id}`}
          extra="One achievement per line. Start with a verb and add a number when you can."
          style={{ marginBottom: 0 }}
        >
          <Input.TextArea
            id={`bullets-${job.id}`}
            value={job.bullets}
            onChange={(e) => update({ bullets: e.target.value })}
            autoSize={{ minRows: 2, maxRows: 8 }}
          />
        </Form.Item>
      </Form>
    </div>
  );
});

import { memo } from 'react';
import { Button, Card, Col, DatePicker, Empty, Flex, Form, Input, Popconfirm, Row, Typography } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { useResumeActions } from '../../hooks/useResume';
import type { Education } from '../../model/types';

const toYear = (value: string): Dayjs | null => (value ? dayjs(`${value}-01-01`) : null);
const fromYear = (value: Dayjs | null): string => (value ? value.format('YYYY') : '');

interface EducationCardProps {
  education: Education[];
}

export const EducationCard = memo(function EducationCard({ education }: EducationCardProps) {
  const { addEducation, updateEducation, removeEducation } = useResumeActions();

  return (
    <Card
      title="Education"
      size="small"
      extra={
        <Button size="small" type="primary" ghost icon={<PlusOutlined />} onClick={addEducation}>
          Add school
        </Button>
      }
    >
      {education.length === 0 && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No education added." />}
      <div className="editor-list">
        {education.map((edu) => (
          <div className="editor-item" key={edu.id}>
            <Flex align="center" style={{ marginBottom: 8 }}>
              <Typography.Text strong style={{ flex: 1 }} ellipsis>
                {edu.school || 'New school'}
              </Typography.Text>
              <Popconfirm title="Remove this school?" okText="Remove" okButtonProps={{ danger: true }} onConfirm={() => removeEducation(edu.id)}>
                <Button size="small" type="text" danger icon={<DeleteOutlined />} aria-label="Remove school" />
              </Popconfirm>
            </Flex>
            <Form layout="vertical" component="div">
              <Row gutter={12}>
                <Col xs={24} sm={12}>
                  <Form.Item label="Degree" htmlFor={`degree-${edu.id}`} style={{ marginBottom: 12 }}>
                    <Input id={`degree-${edu.id}`} value={edu.degree} onChange={(e) => updateEducation(edu.id, { degree: e.target.value })} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item label="School" htmlFor={`school-${edu.id}`} style={{ marginBottom: 12 }}>
                    <Input id={`school-${edu.id}`} value={edu.school} onChange={(e) => updateEducation(edu.id, { school: e.target.value })} />
                  </Form.Item>
                </Col>
                <Col xs={12}>
                  <Form.Item label="Start year" style={{ marginBottom: 0 }}>
                    <DatePicker picker="year" value={toYear(edu.start)} onChange={(v) => updateEducation(edu.id, { start: fromYear(v) })} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col xs={12}>
                  <Form.Item label="End year" style={{ marginBottom: 0 }}>
                    <DatePicker
                      picker="year"
                      value={toYear(edu.end)}
                      onChange={(v) => updateEducation(edu.id, { end: fromYear(v) })}
                      disabledDate={(d) => (edu.start ? d.isBefore(toYear(edu.start), 'year') : false)}
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </div>
        ))}
      </div>
    </Card>
  );
});

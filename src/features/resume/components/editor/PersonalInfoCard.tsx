import { memo } from 'react';
import { Card, Col, Form, Input, Row } from 'antd';
import { GlobalOutlined, MailOutlined, PhoneOutlined, EnvironmentOutlined, UserOutlined } from '@ant-design/icons';
import type { ReactNode } from 'react';
import { useResumeActions } from '../../hooks/useResume';
import type { PersonalInfo } from '../../model/types';

interface FieldConfig {
  field: keyof PersonalInfo;
  label: string;
  placeholder: string;
  icon: ReactNode;
  type?: 'email' | 'tel';
}

const FIELDS: FieldConfig[] = [
  { field: 'name', label: 'Full name', placeholder: 'Jane Doe', icon: <UserOutlined /> },
  { field: 'title', label: 'Job title', placeholder: 'Frontend Developer', icon: <UserOutlined /> },
  { field: 'email', label: 'Email', placeholder: 'jane@example.com', icon: <MailOutlined />, type: 'email' },
  { field: 'phone', label: 'Phone', placeholder: '+355 69 000 0000', icon: <PhoneOutlined />, type: 'tel' },
  { field: 'location', label: 'Location', placeholder: 'Tirana, Albania', icon: <EnvironmentOutlined /> },
  { field: 'website', label: 'Website / LinkedIn', placeholder: 'janedoe.dev', icon: <GlobalOutlined /> },
];

interface PersonalInfoCardProps {
  personal: PersonalInfo;
}

/** Memoized: only re-renders when personal details change. */
export const PersonalInfoCard = memo(function PersonalInfoCard({ personal }: PersonalInfoCardProps) {
  const { setPersonal } = useResumeActions();

  return (
    <Card title="Personal info" size="small">
      <Form layout="vertical" component="div">
        <Row gutter={12}>
          {FIELDS.map(({ field, label, placeholder, icon, type }) => (
            <Col xs={24} sm={12} key={field}>
              <Form.Item label={label} htmlFor={`personal-${field}`} style={{ marginBottom: 12 }}>
                <Input
                  id={`personal-${field}`}
                  type={type}
                  prefix={icon}
                  placeholder={placeholder}
                  value={personal[field]}
                  onChange={(e) => setPersonal(field, e.target.value)}
                  allowClear
                />
              </Form.Item>
            </Col>
          ))}
        </Row>
      </Form>
    </Card>
  );
});

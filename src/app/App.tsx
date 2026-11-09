import { useState } from 'react';
import { Col, Grid, Layout, Row, Segmented } from 'antd';
import { EditOutlined, EyeOutlined } from '@ant-design/icons';
import { PreviewPanel, ResumeEditor, Toolbar, useResumeState } from '../features/resume';

type MobileView = 'edit' | 'preview';

export default function App() {
  const { settings } = useResumeState();
  const screens = Grid.useBreakpoint();
  const [mobileView, setMobileView] = useState<MobileView>('edit');
  const isDesktop = Boolean(screens.lg);

  return (
    <Layout className="app-layout">
      <Layout.Header className="app-header">
        <Toolbar settings={settings} />
      </Layout.Header>

      <Layout.Content className="app-content">
        {!isDesktop && (
          <Segmented<MobileView>
            block
            className="mobile-switch"
            value={mobileView}
            onChange={setMobileView}
            options={[
              { label: 'Edit', value: 'edit', icon: <EditOutlined /> },
              { label: 'Preview', value: 'preview', icon: <EyeOutlined /> },
            ]}
          />
        )}
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={11} className="editor-col" hidden={!isDesktop && mobileView !== 'edit'}>
            <ResumeEditor />
          </Col>
          <Col xs={24} lg={13} className="preview-col" hidden={!isDesktop && mobileView !== 'preview'}>
            <PreviewPanel />
          </Col>
        </Row>
      </Layout.Content>
    </Layout>
  );
}

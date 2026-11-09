import { memo } from 'react';
import { App, Button, ColorPicker, Flex, Popconfirm, Segmented, Space, Tooltip, Typography } from 'antd';
import { ClearOutlined, FilePdfOutlined, ReloadOutlined } from '@ant-design/icons';
import { useResumeActions } from '../hooks/useResume';
import { ACCENT_PRESETS } from '../model/defaults';
import type { ResumeSettings, Template } from '../model/types';

const TEMPLATE_OPTIONS: { label: string; value: Template }[] = [
  { label: 'Classic', value: 'classic' },
  { label: 'Modern', value: 'modern' },
];

interface ToolbarProps {
  settings: ResumeSettings;
}

export const Toolbar = memo(function Toolbar({ settings }: ToolbarProps) {
  const { setSettings, loadExample, clear } = useResumeActions();
  const { message } = App.useApp();

  return (
    <Flex align="center" justify="space-between" wrap gap={12} className="toolbar">
      <Flex align="center" gap={12}>
        <div className="logo" aria-hidden="true">CV</div>
        <div>
          <Typography.Title level={5} style={{ margin: 0 }}>
            CVCraft
          </Typography.Title>
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            Free · Private · No sign-up
          </Typography.Text>
        </div>
      </Flex>

      <Space wrap size={8}>
        <Tooltip title="Accent color">
          <ColorPicker
            value={settings.accent}
            disabledAlpha
            presets={[{ label: 'Suggested', colors: [...ACCENT_PRESETS] }]}
            onChangeComplete={(color) => setSettings({ accent: color.toHexString() })}
          />
        </Tooltip>
        <Segmented<Template>
          options={TEMPLATE_OPTIONS}
          value={settings.template}
          onChange={(template) => setSettings({ template })}
        />
        <Button icon={<ReloadOutlined />} onClick={loadExample}>
          Load example
        </Button>
        <Popconfirm
          title="Start with a blank resume?"
          description="This clears everything you entered."
          okText="Clear"
          okButtonProps={{ danger: true }}
          onConfirm={() => {
            clear();
            message.info('Resume cleared');
          }}
        >
          <Button icon={<ClearOutlined />}>Start blank</Button>
        </Popconfirm>
        <Button type="primary" icon={<FilePdfOutlined />} onClick={() => window.print()}>
          Download PDF
        </Button>
      </Space>
    </Flex>
  );
});

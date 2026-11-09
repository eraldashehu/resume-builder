import { useDeferredValue } from 'react';
import { Typography } from 'antd';
import { useResumeState } from '../../hooks/useResume';
import { ResumePreview } from './ResumePreview';

/**
 * useDeferredValue lets React render the editor first and update the preview
 * a moment later, so typing stays smooth even on slower devices.
 */
export function PreviewPanel() {
  const resume = useResumeState();
  const deferredResume = useDeferredValue(resume);

  return (
    <div className="preview-panel">
      <ResumePreview resume={deferredResume} stale={deferredResume !== resume} />
      <Typography.Paragraph type="secondary" className="print-tip">
        Tip: in the print window choose “Save as PDF” and turn off headers and footers.
      </Typography.Paragraph>
    </div>
  );
}

import { App as AntApp, ConfigProvider } from 'antd';
import enGB from 'antd/locale/en_GB';
import type { ReactNode } from 'react';
import { ResumeProvider } from '../features/resume';

/** Everything the app needs around it, in one place. */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ConfigProvider locale={enGB}>
      {/* AntApp gives components access to message/notification via App.useApp() */}
      <AntApp>
        <ResumeProvider>{children}</ResumeProvider>
      </AntApp>
    </ConfigProvider>
  );
}

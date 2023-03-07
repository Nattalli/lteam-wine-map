import { ConfigProvider } from 'antd';
import React from 'react';

export default function AntdConfigProvider({ children }: React.PropsWithChildren) {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#C92F49',
          borderRadius: 30,
          colorBgLayout: '#FFFFFF',
          colorLink: '#000000',
        },
      }}
    >
      {children}
    </ConfigProvider>
  )
}

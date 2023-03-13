import React from 'react';
import { ConfigProvider } from 'antd';

export default function AntdConfigProvider({ children }: React.PropsWithChildren) {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#C92F49',
          borderRadius: 30,
          colorBgLayout: '#FFFFFF',
          colorLink: '#000000',
          colorLinkHover: '#C92F49',
          colorLinkActive: '#D65465'
        },
      }}
    >
      {children}
    </ConfigProvider>
  )
}

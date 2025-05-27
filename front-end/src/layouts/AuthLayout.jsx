import React from 'react';
import { Layout } from 'antd';

const { Content } = Layout;

function AuthLayout({ children }) {
  return (
    <Layout>
      <Content 
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '24px'
        }}
      >
        <div 
          style={{
            position: 'absolute',
            top: '40px',
            left: '50%',
            transform: 'translateX(-50%)',
            color: 'white',
            fontSize: '24px',
            fontWeight: 'bold',
            letterSpacing: '1px'
          }}
        >
          Quản Lý Du Lịch
        </div>
        {children}
      </Content>
    </Layout>
  );
}

export default AuthLayout;
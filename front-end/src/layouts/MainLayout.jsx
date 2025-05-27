import React from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import MainHeader from '../components/layout/MainHeader';
import MainFooter from '../components/layout/MainFooter';

const { Content } = Layout;

function MainLayout() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <MainHeader />
      <Content style={{ 
        backgroundColor: '#f5f5f5',
        padding: '24px 0',
        display: 'flex',
        justifyContent: 'center'
      }}>
        <div style={{
          width: '100%',
          padding: '0 24px'
        }}>
          <Outlet />
        </div>
      </Content>
      <MainFooter />
    </Layout>
  );
}

export default MainLayout;
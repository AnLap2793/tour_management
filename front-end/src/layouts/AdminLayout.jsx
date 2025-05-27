import React, { useEffect, useState } from 'react';
import { Layout, Menu, Dropdown, Avatar, Space, theme } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';
import { 
  DashboardOutlined, 
  UserOutlined, 
  ShopOutlined, 
  BookOutlined,
  AppstoreOutlined,
  EnvironmentOutlined,
  StarOutlined,
  LogoutOutlined,
  SettingOutlined,
  KeyOutlined
} from '@ant-design/icons';
import { userService } from '../services/userService';

const { Header, Sider, Content } = Layout;

const siderStyle = {
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
  zIndex: 10,
  width: '280px !important',
  minWidth: '280px !important',
  maxWidth: '280px !important',
  flex: '0 0 280px !important'
};

const headerStyle = {
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
  zIndex: 9,
  height: '72px',
  lineHeight: '72px'
};

const menuItemStyle = {
  borderRadius: '6px',
  margin: '8px 12px',
  height: '48px !important',
  lineHeight: '48px !important',
  fontSize: '16px'
};

function AdminLayout() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const { token } = theme.useToken();
  const user = userService.getUserData();

  useEffect(() => {
    if (!userService.isAuthenticated() || !userService.isAdmin()) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    userService.logout();
    navigate('/admin/login');
  };

  const userMenu = [
    {
      key: 'profile',
      icon: <SettingOutlined />,
      label: 'Cập nhật thông tin',
      onClick: () => navigate('/admin/profile')
    },
    {
      key: 'password',
      icon: <KeyOutlined />,
      label: 'Đổi mật khẩu',
      onClick: () => navigate('/admin/change-password')
    },
    {
      type: 'divider'
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
      onClick: handleLogout
    }
  ];

  const menuItems = [
    { 
      key: '', 
      icon: <DashboardOutlined />, 
      label: 'Tổng quan' 
    },
    { 
      key: 'users', 
      icon: <UserOutlined />, 
      label: 'Quản lý người dùng' 
    },
    { 
      key: 'categories', 
      icon: <AppstoreOutlined />, 
      label: 'Quản lý danh mục' 
    },
    { 
      key: 'locations', 
      icon: <EnvironmentOutlined />, 
      label: 'Quản lý địa điểm' 
    },
    { 
      key: 'departure-locations', 
      icon: <EnvironmentOutlined />, 
      label: 'Quản lý điểm khởi hành' 
    },
    { 
      key: 'tours', 
      icon: <ShopOutlined />, 
      label: 'Quản lý tour' 
    },
    { 
      key: 'bookings', 
      icon: <BookOutlined />, 
      label: 'Quản lý đặt tour' 
    },
    { 
      key: 'reviews', 
      icon: <StarOutlined />, 
      label: 'Quản lý đánh giá' 
    }
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        collapsible 
        collapsed={collapsed} 
        onCollapse={setCollapsed}
        width={280}
        style={{
          ...siderStyle,
          background: token.colorBgContainer
        }}
      >
        <div 
          style={{ 
            height: 72, 
            display: 'flex', 
            alignItems: 'center',
            justifyContent: 'center',
            color: token.colorPrimary,
            fontSize: collapsed ? 28 : 24,
            fontWeight: 'bold',
            borderBottom: `1px solid ${token.colorBorderSecondary}`
          }}
        >
          {collapsed ? 'QTV' : 'QUẢN TRỊ VIÊN'}
        </div>
        <Menu
          mode="inline"
          defaultSelectedKeys={['']}
          style={{ 
            borderRight: 0,
            marginTop: 12,
            padding: '4px'
          }}
          items={menuItems.map(item => ({
            ...item,
            style: {
              ...menuItemStyle,
              '&:hover': {
                backgroundColor: `${token.colorPrimary}15`
              },
              '&.ant-menu-item-selected': {
                backgroundColor: token.colorPrimary,
                color: token.colorWhite,
                '&:hover': {
                  backgroundColor: token.colorPrimaryHover
                }
              }
            }
          }))}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <Layout>
        <Header 
          style={{ 
            ...headerStyle,
            padding: '0 24px', 
            background: token.colorBgContainer,
            borderBottom: `1px solid ${token.colorBorderSecondary}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end'
          }}
        >
          <Dropdown menu={{ items: userMenu }} placement="bottomRight">
            <Space 
              style={{ 
                cursor: 'pointer',
                padding: '6px 12px',
                borderRadius: 6,
                transition: 'all 0.3s',
                '&:hover': {
                  backgroundColor: `${token.colorBgTextHover}`
                }
              }}
            >
              <Avatar 
                size={40}
                icon={<UserOutlined />} 
                style={{ 
                  backgroundColor: token.colorPrimary,
                  cursor: 'pointer'
                }} 
              />
              <span style={{ 
                color: token.colorText,
                marginLeft: 12,
                fontSize: 16,
                fontWeight: 500
              }}>
                {user?.name}
              </span>
            </Space>
          </Dropdown>
        </Header>
        <Content style={{ margin: '24px 16px' }}>
          <div 
            style={{ 
              padding: 24, 
              background: token.colorBgContainer,
              borderRadius: token.borderRadius,
              minHeight: '100%',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)'
            }}
          >
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

export default AdminLayout;
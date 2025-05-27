import React from 'react';
import { Layout, Menu, Button, Space, Avatar, Dropdown, theme } from 'antd';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { UserOutlined, LogoutOutlined, SettingOutlined, BookOutlined } from '@ant-design/icons';
import { userService } from '../../services/userService';

const { Header } = Layout;
const { useToken } = theme;

function MainHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useToken();
  const user = userService.getUserData();

  const handleLogout = () => {
    userService.logout();
    navigate('/login');
  };

  const handleMenuClick = ({ key }) => {
    if (key === '/contact') {
      // If already on home page, scroll to footer
      if (location.pathname === '/') {
        const footer = document.querySelector('footer');
        if (footer) {
          footer.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        // If not on home page, navigate home then scroll to footer
        navigate('/', { state: { scrollToFooter: true } });
      }
    } else {
      navigate(key);
    }
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <SettingOutlined />,
      label: 'Thông tin cá nhân',
      onClick: () => navigate('/profile')
    },
    {
      key: 'bookings',
      icon: <BookOutlined />,
      label: 'Đặt tour của tôi',
      onClick: () => navigate('/profile/bookings')
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
      key: '/',
      label: 'Trang chủ'
    },
    {
      key: '/tours',
      label: 'Tour du lịch'
    },
    {
      key: '/contact',
      label: 'Liên hệ'
    }
  ];

  return (
    <Header style={{ 
      display: 'flex', 
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#fff',
      padding: '0 50px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      height: '72px',
      lineHeight: '72px'
    }}>
      <Link to="/" style={{ 
        fontSize: '24px', 
        fontWeight: 'bold',
        color: token.colorPrimary,
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <img 
          src="/assets/images/logo.png" 
          alt="Logo" 
          style={{ height: '40px' }}
        />
        <span>Du Lịch Việt Nam</span>
      </Link>
      
      <Menu 
        mode="horizontal" 
        selectedKeys={[location.pathname]}
        style={{ 
          flex: 1, 
          justifyContent: 'center',
          border: 'none',
          backgroundColor: 'transparent',
          fontSize: '16px'
        }}
        items={menuItems}
        onClick={handleMenuClick}
      />

      <div>
        {user ? (
          <Dropdown 
            menu={{ items: userMenuItems }} 
            placement="bottomRight"
            trigger={['click']}
          >
            <Space 
              style={{ 
                cursor: 'pointer',
                padding: '4px 12px',
                borderRadius: token.borderRadius,
                transition: 'all 0.3s',
                '&:hover': {
                  backgroundColor: token.colorBgTextHover
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
                marginLeft: 8,
                fontSize: 16,
                fontWeight: 500
              }}>
                {user.name}
              </span>
            </Space>
          </Dropdown>
        ) : (
          <Space size="middle">
            <Button 
              type="text"
              size="large"
              onClick={() => navigate('/login')}
              style={{
                fontSize: '16px',
                height: '40px',
                padding: '4px 20px'
              }}
            >
              Đăng nhập
            </Button>
            <Button 
              type="primary"
              size="large"
              onClick={() => navigate('/register')}
              style={{
                fontSize: '16px',
                height: '40px',
                padding: '4px 20px',
                borderRadius: token.borderRadius
              }}
            >
              Đăng ký
            </Button>
          </Space>
        )}
      </div>
    </Header>
  );
}

export default MainHeader;
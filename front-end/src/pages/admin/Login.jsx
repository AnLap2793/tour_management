import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { userService } from '../../services/userService';
import AuthLayout from '../../layouts/AuthLayout';

const { Title, Text } = Typography;

function AdminLogin() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const response = await authService.login(values);
      const { token, user } = response.data;

      if (user.role !== 'admin') {
        message.error('Từ chối truy cập. Yêu cầu quyền quản trị viên.');
        return;
      }

      userService.setAuthToken(token);
      userService.setUserData(user);
      message.success('Đăng nhập thành công');
      navigate('/admin');
    } catch (error) {
      message.error(error.response?.data?.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Card 
        style={{ 
          width: 400,
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
        }}
        bodyStyle={{
          padding: '32px'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
            Chào Mừng Trở Lại
          </Title>
          <Text type="secondary">
            Đăng nhập vào tài khoản quản trị
          </Text>
        </div>
        
        <Form
          name="admin_login"
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' }
            ]}
          >
            <Input 
              prefix={<UserOutlined style={{ color: '#bfbfbf' }} />} 
              placeholder="Email"
              style={{ borderRadius: '6px' }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
              placeholder="Mật khẩu"
              style={{ borderRadius: '6px' }}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              block
              style={{
                height: '40px',
                borderRadius: '6px',
                fontWeight: '500'
              }}
            >
              Đăng Nhập
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Text style={{ marginTop: 16, color: 'white', opacity: 0.8 }}>
        © {new Date().getFullYear()} Du Lịch. Đã đăng ký bản quyền.
      </Text>
    </AuthLayout>
  );
}

export default AdminLogin;
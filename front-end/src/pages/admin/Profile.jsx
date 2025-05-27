import React, { useEffect } from 'react';
import { Card, Form, Input, Button, message, Typography } from 'antd';
import { userService } from '../../services/userService';

const { Title } = Typography;

function Profile() {
  const [form] = Form.useForm();
  const user = userService.getUserData();

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        name: user.name,
        email: user.email,
        phone: user.phone
      });
    }
  }, [form, user]);

  const onFinish = async (values) => {
    try {
      await userService.updateProfile(values);
      message.success('Cập nhật thông tin thành công');
      
      // Update local user data
      const updatedUser = {
        ...user,
        ...values
      };
      userService.setUserData(updatedUser);
    } catch (error) {
      message.error('Không thể cập nhật thông tin');
    }
  };

  return (
    <div>
      <Title level={3} style={{ marginBottom: 24 }}>Cập nhật thông tin</Title>

      <Card bordered={false}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          <Form.Item
            name="name"
            label="Họ tên"
            rules={[
              { required: true, message: 'Vui lòng nhập họ tên!' },
              { min: 2, message: 'Họ tên phải có ít nhất 2 ký tự!' }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
          >
            <Input disabled />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[
              { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ!' }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Cập nhật thông tin
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

export default Profile;

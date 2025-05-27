import React from 'react';
import { Card, Form, Input, Button, message, Typography } from 'antd';
import { userService } from '../../services/userService';

const { Title } = Typography;

function ChangePassword() {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      if (values.newPassword !== values.confirmPassword) {
        message.error('Mật khẩu xác nhận không khớp');
        return;
      }

      await userService.changePassword(values);
      message.success('Đổi mật khẩu thành công');
      form.resetFields();
    } catch (error) {
      message.error('Không thể đổi mật khẩu');
    }
  };

  return (
    <div>
      <Title level={3} style={{ marginBottom: 24 }}>Đổi mật khẩu</Title>

      <Card bordered={false}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          <Form.Item
            name="currentPassword"
            label="Mật khẩu hiện tại"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu hiện tại!' }
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="newPassword"
            label="Mật khẩu mới"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
              { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' },
              {
                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                message: 'Mật khẩu phải chứa chữ hoa, chữ thường và số!'
              }
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Xác nhận mật khẩu mới"
            rules={[
              { required: true, message: 'Vui lòng xác nhận mật khẩu mới!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Đổi mật khẩu
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

export default ChangePassword;

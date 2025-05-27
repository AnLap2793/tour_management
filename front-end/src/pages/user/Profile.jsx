import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Layout, Menu, Card, Form, Input, Button, message, Table, Tag, Space } from 'antd';
import { UserOutlined, BookOutlined, LockOutlined } from '@ant-design/icons';
import { userService } from '../../services/userService';
import { bookingService } from '../../services/bookingService';
import { formatPrice, formatDate } from '../../utils/format';

const { Content, Sider } = Layout;

function ProfileInfo() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userData = userService.getUserData();
    if (userData) {
      form.setFieldsValue({
        name: userData.name,
        email: userData.email,
        phone: userData.phone
      });
    }
  }, [form]);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      await userService.updateProfile(values);
      message.success('Cập nhật thông tin thành công');
    } catch (error) {
      message.error('Không thể cập nhật thông tin');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Thông tin cá nhân">
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item
          name="name"
          label="Họ tên"
          rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Vui lòng nhập email!' },
            { type: 'email', message: 'Email không hợp lệ!' }
          ]}
        >
          <Input disabled />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Số điện thoại"
          rules={[
            { required: true, message: 'Vui lòng nhập số điện thoại!' },
            { pattern: /^[0-9]+$/, message: 'Số điện thoại không hợp lệ!' }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Cập nhật thông tin
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}

function ChangePassword() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      await userService.updateProfile({ password: values.newPassword });
      message.success('Đổi mật khẩu thành công');
      form.resetFields();
    } catch (error) {
      message.error('Không thể đổi mật khẩu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Đổi mật khẩu">
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item
          name="currentPassword"
          label="Mật khẩu hiện tại"
          rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại!' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="newPassword"
          label="Mật khẩu mới"
          rules={[
            { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
            { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label="Xác nhận mật khẩu mới"
          dependencies={['newPassword']}
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
          <Button type="primary" htmlType="submit" loading={loading}>
            Đổi mật khẩu
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  const fetchBookings = async (page = 1) => {
    try {
      setLoading(true);
      const response = await bookingService.getMyBookings({
        page,
        limit: pagination.pageSize
      });
      setBookings(response.data);
      setPagination({
        ...pagination,
        current: page,
        total: response.pagination.totalItems
      });
    } catch (error) {
      message.error('Không thể tải danh sách đặt tour');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (bookingId) => {
    try {
      await bookingService.cancelBooking(bookingId);
      message.success('Hủy đặt tour thành công');
      fetchBookings(pagination.current);
    } catch (error) {
      message.error('Không thể hủy đặt tour');
    }
  };

  const columns = [
    {
      title: 'Tour',
      dataIndex: ['tour', 'name'],
      key: 'tourName',
      render: (text, record) => (
        <Link to={`/tours/${record.tourId}`}>{text}</Link>
      )
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'bookingDate',
      key: 'bookingDate',
      render: date => formatDate(date)
    },
    {
      title: 'Số lượng',
      children: [
        {
          title: 'Người lớn',
          dataIndex: 'numberOfAdults',
          key: 'numberOfAdults',
          width: 100,
        },
        {
          title: 'Trẻ em',
          dataIndex: 'numberOfChildren',
          key: 'numberOfChildren',
          width: 100,
        },
        {
          title: 'Em bé',
          dataIndex: 'numberOfInfants',
          key: 'numberOfInfants',
          width: 100,
        }
      ]
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: price => formatPrice(price)
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: status => {
        let color = 'blue';
        let text = 'Chờ xác nhận';
        
        if (status === 'confirmed') {
          color = 'green';
          text = 'Đã xác nhận';
        } else if (status === 'cancelled') {
          color = 'red';
          text = 'Đã hủy';
        }
        
        return <Tag color={color}>{text}</Tag>;
      }
    },
    {
      title: 'Thanh toán',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      render: status => {
        let color = 'orange';
        let text = 'Chờ thanh toán';
        
        if (status === 'paid') {
          color = 'green';
          text = 'Đã thanh toán';
        } else if (status === 'failed') {
          color = 'red';
          text = 'Thanh toán thất bại';
        }
        
        return <Tag color={color}>{text}</Tag>;
      }
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => (
        <Space>
          {record.status === 'pending' && (
            <Button 
              danger 
              onClick={() => handleCancel(record.id)}
            >
              Hủy đặt tour
            </Button>
          )}
        </Space>
      )
    }
  ];

  return (
    <Card title="Đặt tour của tôi">
      <Table
        columns={columns}
        dataSource={bookings}
        rowKey="id"
        loading={loading}
        pagination={pagination}
        onChange={({ current }) => fetchBookings(current)}
      />
    </Card>
  );
}

function Profile() {
  const navigate = useNavigate();
  const [selectedKey, setSelectedKey] = useState('info');

  useEffect(() => {
    if (!userService.isAuthenticated()) {
      navigate('/login');
    }
  }, [navigate]);

  const menuItems = [
    {
      key: 'info',
      icon: <UserOutlined />,
      label: <Link to="/profile">Thông tin cá nhân</Link>
    },
    {
      key: 'bookings',
      icon: <BookOutlined />,
      label: <Link to="/profile/bookings">Đặt tour của tôi</Link>
    },
    {
      key: 'password',
      icon: <LockOutlined />,
      label: <Link to="/profile/password">Đổi mật khẩu</Link>
    }
  ];

  return (
    <Layout>
      <Sider width={250} theme="light" style={{ padding: '24px 0' }}>
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          onSelect={({ key }) => setSelectedKey(key)}
        />
      </Sider>
      <Content style={{ padding: '0 24px', minHeight: 280 }}>
        <Routes>
          <Route index element={<ProfileInfo />} />
          <Route path="bookings" element={<MyBookings />} />
          <Route path="password" element={<ChangePassword />} />
        </Routes>
      </Content>
    </Layout>
  );
}

export default Profile;
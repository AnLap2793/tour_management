import React, { useEffect } from 'react';
import { Table, Button, Space, Modal, Form, Input, Select, Row, Col, Card, Typography, theme } from 'antd';
import { EditOutlined, DeleteOutlined, UserAddOutlined, SearchOutlined } from '@ant-design/icons';
import useUsers from '../../hooks/useUsers';

const { Option } = Select;
const { Title } = Typography;

function Users() {
  const {
    users,
    loading,
    modalVisible,
    editingUser,
    pagination,
    handleTableChange,
    handleSearch,
    resetSearch,
    showModal,
    handleModalCancel,
    createUser,
    updateUser,
    deleteUser,
    fetchUsers
  } = useUsers();

  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();
  const { token } = theme.useToken();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    if (editingUser) {
      form.setFieldsValue({
        name: editingUser.name,
        email: editingUser.email,
        role: editingUser.role,
        status: editingUser.status
      });
    } else {
      form.resetFields();
    }
  }, [editingUser, form]);

  const handleModalOk = () => {
    form.submit();
  };

  const onFinish = async (values) => {
    const success = editingUser
      ? await updateUser(editingUser.id, values)
      : await createUser(values);
    
    if (success) {
      handleModalCancel();
    }
  };

  const handleDelete = async (id) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa người dùng này?',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        await deleteUser(id);
      }
    });
  };

  const columns = [
    {
      title: 'Họ tên',
      dataIndex: 'name',
      key: 'name',
      sorter: true,
      render: (text) => <span style={{ fontWeight: 500 }}>{text}</span>
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: true
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      sorter: true,
      align: 'center',
      render: (role) => (
        <span style={{
          color: role === 'admin' ? token.colorSuccess : token.colorPrimary,
          fontWeight: 500
        }}>
          {role === 'admin' ? 'Quản trị viên' : 'Người dùng'}
        </span>
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      sorter: true,
      align: 'center',
      render: (status) => (
        <span style={{
          color: status === 'active' ? token.colorSuccess : token.colorError,
          fontWeight: 500
        }}>
          {status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
        </span>
      )
    },
    {
      title: 'Thao tác',
      key: 'actions',
      align: 'center',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            ghost
            icon={<EditOutlined />}
            onClick={() => showModal(record)}
            style={{ borderRadius: token.borderRadius }}
          >
            Sửa
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
            style={{ borderRadius: token.borderRadius }}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={3} style={{ marginBottom: 24 }}>Quản lý người dùng</Title>
        
        <Card bordered={false}>
          <Form
            form={searchForm}
            onFinish={handleSearch}
            layout="vertical"
          >
            <Row gutter={16}>
              <Col span={6}>
                <Form.Item name="name" label="Họ tên">
                  <Input 
                    placeholder="Tìm kiếm theo họ tên"
                    style={{ borderRadius: token.borderRadius }}
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="email" label="Email">
                  <Input 
                    placeholder="Tìm kiếm theo email"
                    style={{ borderRadius: token.borderRadius }}
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="role" label="Vai trò">
                  <Select 
                    allowClear 
                    placeholder="Chọn vai trò"
                    style={{ borderRadius: token.borderRadius }}
                  >
                    <Option value="user">Người dùng</Option>
                    <Option value="admin">Quản trị viên</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="status" label="Trạng thái">
                  <Select 
                    allowClear 
                    placeholder="Chọn trạng thái"
                    style={{ borderRadius: token.borderRadius }}
                  >
                    <Option value="active">Hoạt động</Option>
                    <Option value="inactive">Không hoạt động</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24} style={{ textAlign: 'right' }}>
                <Space>
                  <Button 
                    onClick={resetSearch}
                    style={{ borderRadius: token.borderRadius }}
                  >
                    Đặt lại
                  </Button>
                  <Button 
                    type="primary" 
                    icon={<SearchOutlined />} 
                    htmlType="submit"
                    style={{ borderRadius: token.borderRadius }}
                  >
                    Tìm kiếm
                  </Button>
                </Space>
              </Col>
            </Row>
          </Form>
        </Card>
      </div>

      <Card
        bordered={false}
        title={
          <Button
            type="primary"
            icon={<UserAddOutlined />}
            onClick={() => showModal()}
            style={{ borderRadius: token.borderRadius }}
          >
            Thêm người dùng
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Tổng cộng ${total} người dùng`
          }}
          onChange={handleTableChange}
          style={{ marginTop: 16 }}
        />
      </Card>

      <Modal
        title={editingUser ? 'Sửa người dùng' : 'Thêm người dùng'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText={editingUser ? 'Cập nhật' : 'Thêm'}
        cancelText="Hủy"
        width={600}
        maskClosable={false}
        style={{ top: 20 }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            status: 'active',
            role: 'user'
          }}
        >
          <Form.Item
            name="name"
            label="Họ tên"
            rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
          >
            <Input style={{ borderRadius: token.borderRadius }} />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' }
            ]}
          >
            <Input style={{ borderRadius: token.borderRadius }} />
          </Form.Item>

          {!editingUser && (
            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu!' },
                { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
              ]}
            >
              <Input.Password style={{ borderRadius: token.borderRadius }} />
            </Form.Item>
          )}

          <Form.Item
            name="role"
            label="Vai trò"
            rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
          >
            <Select style={{ borderRadius: token.borderRadius }}>
              <Option value="user">Người dùng</Option>
              <Option value="admin">Quản trị viên</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
          >
            <Select style={{ borderRadius: token.borderRadius }}>
              <Option value="active">Hoạt động</Option>
              <Option value="inactive">Không hoạt động</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Users;
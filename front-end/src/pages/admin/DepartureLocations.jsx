import React, { useEffect } from 'react';
import { Table, Button, Space, Modal, Form, Input, Select, Row, Col, Card, Typography, theme } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import useDepartureLocations from '../../hooks/useDepartureLocations';
import LocationPicker from '../../components/map/LocationPicker';

const { Option } = Select;
const { TextArea } = Input;
const { Title } = Typography;

function DepartureLocations() {
  const {
    locations,
    loading,
    modalVisible,
    editingLocation,
    pagination,
    handleTableChange,
    handleSearch,
    resetSearch,
    showModal,
    handleModalCancel,
    createLocation,
    updateLocation,
    deleteLocation,
    fetchLocations
  } = useDepartureLocations();

  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();
  const { token } = theme.useToken();

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  useEffect(() => {
    if (editingLocation) {
      form.setFieldsValue({
        name: editingLocation.name,
        address: editingLocation.address,
        city: editingLocation.city,
        province: editingLocation.province,
        coordinates: {
          lat: editingLocation.latitude,
          lng: editingLocation.longitude
        },
        meetingPoint: editingLocation.meetingPoint,
        status: editingLocation.status
      });
    } else {
      form.resetFields();
    }
  }, [editingLocation, form]);

  const handleModalOk = () => {
    form.submit();
  };

  const onFinish = async (values) => {
    const locationData = {
      ...values,
      latitude: values.coordinates.lat,
      longitude: values.coordinates.lng
    };
    delete locationData.coordinates;

    const success = editingLocation
      ? await updateLocation(editingLocation.id, locationData)
      : await createLocation(locationData);
    
    if (success) {
      handleModalCancel();
    }
  };

  const columns = [
    {
      title: 'Tên địa điểm',
      dataIndex: 'name',
      key: 'name',
      sorter: true,
    },
    {
      title: 'Thành phố',
      dataIndex: 'city',
      key: 'city',
      sorter: true,
    },
    {
      title: 'Tỉnh/Thành phố',
      dataIndex: 'province',
      key: 'province',
      sorter: true,
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
      ellipsis: true,
    },
    {
      title: 'Số tour',
      dataIndex: 'tourCount',
      key: 'tourCount',
      sorter: true,
      align: 'center',
      render: (count) => (
        <span style={{ color: token.colorPrimary, fontWeight: 500 }}>
          {count}
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
            onClick={() => deleteLocation(record.id)}
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
        <Title level={3} style={{ marginBottom: 24 }}>Quản lý điểm khởi hành</Title>
        
        <Card bordered={false}>
          <Form
            form={searchForm}
            onFinish={handleSearch}
            layout="vertical"
          >
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item name="name" label="Tên địa điểm">
                  <Input 
                    placeholder="Tìm kiếm theo tên địa điểm"
                    style={{ borderRadius: token.borderRadius }}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="city" label="Thành phố">
                  <Input 
                    placeholder="Tìm kiếm theo thành phố"
                    style={{ borderRadius: token.borderRadius }}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
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
            icon={<PlusOutlined />}
            onClick={() => showModal()}
            style={{ borderRadius: token.borderRadius }}
          >
            Thêm điểm khởi hành
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={locations}
          rowKey="id"
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Tổng cộng ${total} điểm khởi hành`
          }}
          onChange={handleTableChange}
          style={{ marginTop: 16 }}
        />
      </Card>

      <Modal
        title={editingLocation ? 'Sửa điểm khởi hành' : 'Thêm điểm khởi hành'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText={editingLocation ? 'Cập nhật' : 'Thêm'}
        cancelText="Hủy"
        width={800}
        maskClosable={false}
        style={{ top: 20 }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            status: 'active'
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Tên địa điểm"
                rules={[{ required: true, message: 'Vui lòng nhập tên địa điểm!' }]}
              >
                <Input style={{ borderRadius: token.borderRadius }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="city"
                label="Thành phố"
                rules={[{ required: true, message: 'Vui lòng nhập thành phố!' }]}
              >
                <Input style={{ borderRadius: token.borderRadius }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="province"
                label="Tỉnh/Thành phố"
                rules={[{ required: true, message: 'Vui lòng nhập tỉnh/thành phố!' }]}
              >
                <Input style={{ borderRadius: token.borderRadius }} />
              </Form.Item>
            </Col>
            <Col span={12}>
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
            </Col>
          </Row>

          <Form.Item
            name="address"
            label="Địa chỉ"
            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
          >
            <Input style={{ borderRadius: token.borderRadius }} />
          </Form.Item>

          <Form.Item
            name="meetingPoint"
            label="Hướng dẫn điểm tập trung"
          >
            <TextArea 
              rows={4} 
              style={{ borderRadius: token.borderRadius }}
            />
          </Form.Item>

          <Form.Item
            name="coordinates"
            label="Chọn vị trí trên bản đồ"
            rules={[{ required: true, message: 'Vui lòng chọn vị trí trên bản đồ!' }]}
          >
            <LocationPicker />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default DepartureLocations;

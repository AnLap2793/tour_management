import React, { useEffect } from 'react';
import { Table, Button, Space, Modal, Form, Input, Select, Row, Col, Card, Typography, theme, Image, Upload } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import useLocations from '../../hooks/useLocations';
import LocationPicker from '../../components/map/LocationPicker';

const { Option } = Select;
const { TextArea } = Input;
const { Title } = Typography;

function Locations() {
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
  } = useLocations();

  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();
  const { token } = theme.useToken();

  const imagePlaceholder = "https://placehold.co/400x400?text=No+Image";

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  useEffect(() => {
    if (editingLocation) {
      form.setFieldsValue({
        name: editingLocation.name,
        description: editingLocation.description,
        country: editingLocation.country,
        region: editingLocation.region,
        coordinates: {
          lat: editingLocation.latitude,
          lng: editingLocation.longitude
        },
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
    const formData = new FormData();
    Object.keys(values).forEach(key => {
      if (key === 'image' && values.image?.length > 0) {
        formData.append('image', values.image[0].originFileObj);
      } else if (key === 'coordinates') {
        formData.append('latitude', values.coordinates.lat);
        formData.append('longitude', values.coordinates.lng);
      } else if (values[key] !== undefined) {
        formData.append(key, values[key]);
      }
    });

    const success = editingLocation
      ? await updateLocation(editingLocation.id, formData)
      : await createLocation(formData);
    
    if (success) {
      handleModalCancel();
    }
  };

  const handleDelete = async (id) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa địa điểm này?',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        await deleteLocation(id);
      }
    });
  };

  const columns = [
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      key: 'image',
      width: 120,
      render: (image) => (
        image ? (
          <Image
            src={image}
            alt="Location"
            style={{ 
              width: 80,
              height: 80,
              objectFit: 'cover',
              borderRadius: token.borderRadius
            }}
            fallback={imagePlaceholder}
          />
        ) : null
      )
    },
    {
      title: 'Tên địa điểm',
      dataIndex: 'name',
      key: 'name',
      sorter: true,
      render: (text) => <span style={{ fontWeight: 500 }}>{text}</span>
    },
    {
      title: 'Quốc gia',
      dataIndex: 'country',
      key: 'country',
      sorter: true
    },
    {
      title: 'Khu vực',
      dataIndex: 'region',
      key: 'region',
      sorter: true
    },
    {
      title: 'Số tour',
      dataIndex: 'tourCount',
      key: 'tourCount',
      sorter: true,
      align: 'center',
      render: (count) => (
        <span style={{ 
          color: token.colorPrimary,
          fontWeight: 500 
        }}>
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
        <Title level={3} style={{ marginBottom: 24 }}>Quản lý địa điểm</Title>
        
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
                <Form.Item name="country" label="Quốc gia">
                  <Input 
                    placeholder="Tìm kiếm theo quốc gia"
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
            Thêm địa điểm
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
            showTotal: (total) => `Tổng cộng ${total} địa điểm`
          }}
          onChange={handleTableChange}
          style={{ marginTop: 16 }}
        />
      </Card>

      <Modal
        title={editingLocation ? 'Sửa địa điểm' : 'Thêm địa điểm'}
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
          {editingLocation && editingLocation.image && (
            <Form.Item label="Hình ảnh hiện tại">
              <Image
                src={editingLocation.image}
                alt="Current location"
                style={{ 
                  maxWidth: '100%',
                  height: 200,
                  objectFit: 'cover',
                  borderRadius: token.borderRadius
                }}
                fallback={imagePlaceholder}
              />
            </Form.Item>
          )}

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
                name="country"
                label="Quốc gia"
                rules={[{ required: true, message: 'Vui lòng nhập quốc gia!' }]}
              >
                <Input style={{ borderRadius: token.borderRadius }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="region"
                label="Khu vực"
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
            name="description"
            label="Mô tả"
          >
            <TextArea 
              rows={4} 
              style={{ borderRadius: token.borderRadius }}
            />
          </Form.Item>

          <Form.Item
            name="image"
            label="Hình ảnh"
            valuePropName="fileList"
            getValueFromEvent={e => e?.fileList}
          >
            <Upload
              maxCount={1}
              beforeUpload={() => false}
              accept="image/*"
              listType="picture-card"
            >
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Tải lên</div>
              </div>
            </Upload>
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

export default Locations;
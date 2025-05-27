import React, { useEffect } from 'react';
import { Table, Button, Space, Modal, Form, Input, Select, Row, Col, Card, Rate, DatePicker, Typography, theme } from 'antd';
import { EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import useReviews from '../../hooks/useReviews';
import { tourService } from '../../services/tourService';
import { formatDate } from '../../utils/format';

const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;
const { Title } = Typography;

function Reviews() {
  const {
    reviews,
    loading,
    modalVisible,
    editingReview,
    pagination,
    handleTableChange,
    handleSearch,
    resetSearch,
    showModal,
    handleModalCancel,
    updateReview,
    deleteReview,
    fetchReviews,
    tours,
    loadingTours
  } = useReviews();

  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();
  const { token } = theme.useToken();

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  useEffect(() => {
    if (editingReview) {
      form.setFieldsValue({
        rating: editingReview.rating,
        comment: editingReview.comment,
        status: editingReview.status
      });
    } else {
      form.resetFields();
    }
  }, [editingReview, form]);

  const handleModalOk = () => {
    form.submit();
  };

  const onFinish = async (values) => {
    const success = await updateReview(editingReview.id, values);
    if (success) {
      handleModalCancel();
    }
  };

  const handleDelete = async (id) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa đánh giá này?',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        await deleteReview(id);
      }
    });
  };

  const columns = [
    {
      title: 'Tour',
      dataIndex: ['Tour', 'name'],
      key: 'tourId',
      sorter: true,
      render: (text) => <span style={{ fontWeight: 500 }}>{text}</span>
    },
    {
      title: 'Người dùng',
      dataIndex: ['User', 'name'],
      key: 'userId',
      sorter: true
    },
    {
      title: 'Đánh giá',
      dataIndex: 'rating',
      key: 'rating',
      sorter: true,
      align: 'center',
      render: (rating) => <Rate disabled defaultValue={rating} />
    },
    {
      title: 'Nhận xét',
      dataIndex: 'comment',
      key: 'comment',
      ellipsis: true,
      width: 300
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: true,
      render: (date) => formatDate(date)
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
        <Title level={3} style={{ marginBottom: 24 }}>Quản lý đánh giá</Title>
        
        <Card bordered={false}>
          <Form
            form={searchForm}
            onFinish={handleSearch}
            layout="vertical"
          >
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item name="tourId" label="Tour">
                  <Select
                    allowClear
                    placeholder="Chọn tour"
                    loading={loadingTours}
                    style={{ borderRadius: token.borderRadius }}
                  >
                    {tours.map(tour => (
                      <Option key={tour.id} value={tour.id}>{tour.name}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="rating" label="Đánh giá">
                  <Select 
                    allowClear 
                    placeholder="Chọn đánh giá"
                    style={{ borderRadius: token.borderRadius }}
                  >
                    <Option value={1}>1 sao</Option>
                    <Option value={2}>2 sao</Option>
                    <Option value={3}>3 sao</Option>
                    <Option value={4}>4 sao</Option>
                    <Option value={5}>5 sao</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="dateRange" label="Thời gian">
                  <RangePicker 
                    style={{ width: '100%', borderRadius: token.borderRadius }} 
                  />
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

      <Card bordered={false}>
        <Table
          columns={columns}
          dataSource={reviews}
          rowKey="id"
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Tổng cộng ${total} đánh giá`
          }}
          onChange={handleTableChange}
          scroll={{ x: 1200 }}
        />
      </Card>

      <Modal
        title="Sửa đánh giá"
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Cập nhật"
        cancelText="Hủy"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          <Form.Item
            name="rating"
            label="Đánh giá"
            rules={[{ required: true, message: 'Vui lòng chọn đánh giá!' }]}
          >
            <Rate style={{ fontSize: 32 }} />
          </Form.Item>

          <Form.Item
            name="comment"
            label="Nhận xét"
          >
            <TextArea 
              rows={4} 
              style={{ borderRadius: token.borderRadius }}
            />
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

export default Reviews;

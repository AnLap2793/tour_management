import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Modal, Form, Input, Select, Row, Col, Card, DatePicker, InputNumber, Typography, theme } from 'antd';
import { EditOutlined, CloseOutlined, SearchOutlined } from '@ant-design/icons';
import useBookings from '../../hooks/useBookings';
import { tourService } from '../../services/tourService';
import { userService } from '../../services/userService';
import { formatPrice, formatDate } from '../../utils/format';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Title } = Typography;

function Bookings() {
  const {
    bookings,
    loading,
    modalVisible,
    editingBooking,
    pagination,
    handleTableChange,
    handleSearch,
    resetSearch,
    showModal,
    handleModalCancel,
    updateBooking,
    cancelBooking
  } = useBookings();

  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();
  const [tours, setTours] = useState([]);
  const [users, setUsers] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const { token } = theme.useToken();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingData(true);
        const [toursRes, usersRes] = await Promise.all([
          tourService.getAllTours({ limit: 100 }),
          userService.getAllUsers({ limit: 100 })
        ]);
        setTours(toursRes.data);
        setUsers(usersRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoadingData(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (editingBooking) {
      form.setFieldsValue({
        status: editingBooking.status,
        paymentStatus: editingBooking.paymentStatus,
        specialRequests: editingBooking.specialRequests
      });
    } else {
      form.resetFields();
    }
  }, [editingBooking, form]);

  const handleModalOk = () => {
    form.submit();
  };

  const onFinish = async (values) => {
    const success = await updateBooking(editingBooking.id, values);
    if (success) {
      handleModalCancel();
    }
  };

  const handleResetSearch = () => {
    searchForm.resetFields();
    resetSearch();
  };

  const columns = [
    {
      title: 'Tour',
      dataIndex: ['Tour', 'name'],
      key: 'tourId',
      sorter: true,
    },
    {
      title: 'Khách hàng',
      dataIndex: ['User', 'name'],
      key: 'userId',
      sorter: true,
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'bookingDate',
      key: 'bookingDate',
      sorter: true,
      render: (date) => formatDate(date)
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
        },
      ],
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      sorter: true,
      render: (price) => formatPrice(price)
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      sorter: true,
      render: (status) => {
        const statusMap = {
          pending: 'Chờ xác nhận',
          confirmed: 'Đã xác nhận',
          cancelled: 'Đã hủy'
        };
        return statusMap[status] || status;
      }
    },
    {
      title: 'Thanh toán',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      sorter: true,
      render: (status) => {
        const statusMap = {
          pending: 'Chờ thanh toán',
          paid: 'Đã thanh toán',
          failed: 'Thanh toán thất bại'
        };
        return statusMap[status] || status;
      }
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => showModal(record)}
          >
            Sửa
          </Button>
          {record.status !== 'cancelled' && (
            <Button
              danger
              icon={<CloseOutlined />}
              onClick={() => cancelBooking(record.id)}
            >
              Hủy
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={3} style={{ marginBottom: 24 }}>Quản lý đặt tour</Title>
        
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
                    loading={loadingData}
                    style={{ borderRadius: token.borderRadius }}
                  >
                    {tours.map(tour => (
                      <Option key={tour.id} value={tour.id}>{tour.name}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="userId" label="Khách hàng">
                  <Select
                    allowClear
                    placeholder="Chọn khách hàng"
                    loading={loadingData}
                    style={{ borderRadius: token.borderRadius }}
                  >
                    {users.map(user => (
                      <Option key={user.id} value={user.id}>{user.name}</Option>
                    ))}
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
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item name="status" label="Trạng thái">
                  <Select 
                    allowClear 
                    placeholder="Chọn trạng thái"
                    style={{ borderRadius: token.borderRadius }}
                  >
                    <Option value="pending">Chờ xác nhận</Option>
                    <Option value="confirmed">Đã xác nhận</Option>
                    <Option value="cancelled">Đã hủy</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="paymentStatus" label="Trạng thái thanh toán">
                  <Select 
                    allowClear 
                    placeholder="Chọn trạng thái thanh toán"
                    style={{ borderRadius: token.borderRadius }}
                  >
                    <Option value="pending">Chờ thanh toán</Option>
                    <Option value="paid">Đã thanh toán</Option>
                    <Option value="failed">Thanh toán thất bại</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Khoảng giá">
                  <Space.Compact style={{ width: '100%' }}>
                    <Form.Item name="minPrice" noStyle>
                      <InputNumber
                        style={{ width: '45%', borderRadius: token.borderRadius }}
                        placeholder="Từ"
                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                      />
                    </Form.Item>
                    <Input
                      style={{ 
                        width: '10%', 
                        textAlign: 'center', 
                        pointerEvents: 'none',
                        borderLeft: 0,
                        borderRight: 0
                      }}
                      placeholder="~"
                      disabled
                    />
                    <Form.Item name="maxPrice" noStyle>
                      <InputNumber
                        style={{ width: '45%', borderRadius: token.borderRadius }}
                        placeholder="Đến"
                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                      />
                    </Form.Item>
                  </Space.Compact>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24} style={{ textAlign: 'right' }}>
                <Space>
                  <Button 
                    onClick={handleResetSearch}
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
          dataSource={bookings}
          rowKey="id"
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Tổng cộng ${total} đặt tour`
          }}
          onChange={handleTableChange}
          scroll={{ x: 1500 }}
        />
      </Card>

      <Modal
        title="Cập nhật đặt tour"
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
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
          >
            <Select style={{ borderRadius: token.borderRadius }}>
              <Option value="pending">Chờ xác nhận</Option>
              <Option value="confirmed">Đã xác nhận</Option>
              <Option value="cancelled">Đã hủy</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="paymentStatus"
            label="Trạng thái thanh toán"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái thanh toán!' }]}
          >
            <Select style={{ borderRadius: token.borderRadius }}>
              <Option value="pending">Chờ thanh toán</Option>
              <Option value="paid">Đã thanh toán</Option>
              <Option value="failed">Thanh toán thất bại</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="specialRequests"
            label="Yêu cầu đặc biệt"
          >
            <Input.TextArea 
              rows={4} 
              style={{ borderRadius: token.borderRadius }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Bookings;
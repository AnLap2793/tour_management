import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, Row, Col, Typography, Tag, Rate, Carousel, 
  Descriptions, Divider, Table, Button, message, Space,
  List, Avatar, Form, Input
} from 'antd';
import { Comment } from '@ant-design/compatible';


import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { 
  ClockCircleOutlined, UserOutlined, EnvironmentOutlined,
  StarOutlined, LikeOutlined, MessageOutlined
} from '@ant-design/icons';
import { tourService } from '../../services/tourService';
import { tourScheduleService } from '../../services/tourScheduleService';
import { reviewService } from '../../services/reviewService';
import { userService, bookingService } from '../../services';
import { formatPrice, formatDate } from '../../utils/format';
import 'leaflet/dist/leaflet.css';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

function TourDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [tour, setTour] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [relatedTours, setRelatedTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [canReview, setCanReview] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);
  const user = userService.getUserData();

  useEffect(() => {
    const fetchTourData = async () => {
      try {
        setLoading(true);
        const [tourData, schedulesData, reviewsData] = await Promise.all([
          tourService.getTourById(id),
          tourScheduleService.getAvailableSchedules({ tourId: id }),
          reviewService.getTourReviews(id)
        ]);
        
        setTour(tourData.data);
        setSchedules(schedulesData.data);
        setReviews(reviewsData.data);

        // Fetch related tours based on category
        const relatedData = await tourService.getAllTours({ 
          categoryId: tourData.data.categoryId,
          limit: 4,
          exclude: id
        });
        setRelatedTours(relatedData.data);

        // Check if user can review (has booked and completed the tour)
        if (user) {
          const bookings = await bookingService.getMyBookings({
            tourId: id,
            status: 'completed'
          });
          setCanReview(bookings.data.length > 0);
        }
      } catch (error) {
        message.error('Không thể tải thông tin tour');
      } finally {
        setLoading(false);
      }
    };
    fetchTourData();
  }, [id]);

  const handleBooking = () => {
    if (!user) {
      message.warning('Vui lòng đăng nhập để đặt tour');
      navigate('/login');
      return;
    }

    if (!selectedSchedule) {
      message.warning('Vui lòng chọn lịch trình');
      return;
    }

    navigate(`/checkout/${id}`, { 
      state: { 
        scheduleId: selectedSchedule,
        tour,
        schedule: schedules.find(s => s.id === selectedSchedule)
      }
    });
  };

  const handleSubmitReview = async (values) => {
    try {
      setSubmittingReview(true);
      await reviewService.createReview({
        tourId: id,
        ...values
      });
      message.success('Đánh giá thành công');
      form.resetFields();
      
      // Refresh reviews
      const reviewsData = await reviewService.getTourReviews(id);
      setReviews(reviewsData.data);
    } catch (error) {
      message.error('Không thể gửi đánh giá');
    } finally {
      setSubmittingReview(false);
    }
  };

  const scheduleColumns = [
    {
      title: 'Ngày khởi hành',
      dataIndex: 'departureDate',
      key: 'departureDate',
      render: date => formatDate(date)
    },
    {
      title: 'Ngày kết thúc',
      dataIndex: 'returnDate',
      key: 'returnDate',
      render: date => formatDate(date)
    },
    {
      title: 'Số chỗ còn',
      dataIndex: 'availableSeats',
      key: 'availableSeats',
      align: 'center',
      render: (seats) => (
        <Tag color={seats > 0 ? 'success' : 'error'}>
          {seats}
        </Tag>
      )
    },
    {
      title: 'Giá người lớn',
      dataIndex: 'adultPrice',
      key: 'adultPrice',
      align: 'right',
      render: price => formatPrice(price)
    },
    {
      title: 'Giá trẻ em',
      dataIndex: 'childPrice',
      key: 'childPrice',
      align: 'right',
      render: price => formatPrice(price)
    },
    {
      title: 'Giá em bé',
      dataIndex: 'infantPrice',
      key: 'infantPrice',
      align: 'right',
      render: price => formatPrice(price)
    },
    {
      title: 'Thao tác',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <Button 
          type={selectedSchedule === record.id ? 'primary' : 'default'}
          onClick={() => setSelectedSchedule(record.id)}
          disabled={record.availableSeats === 0}
        >
          {record.availableSeats === 0 ? 'Hết chỗ' : 'Chọn'}
        </Button>
      )
    }
  ];

  const renderTourCard = (tour) => (
    <Card
      hoverable
      cover={
        <img 
          alt={tour.name} 
          src={tour.image} 
          style={{ height: 200, objectFit: 'cover' }}
        />
      }
      onClick={() => navigate(`/tours/${tour.id}`)}
    >
      <Card.Meta
        title={tour.name}
        description={
          <Space direction="vertical">
            <Space>
              <ClockCircleOutlined />
              <Text>{tour.duration} ngày</Text>
            </Space>
            <Text strong style={{ color: '#f50' }}>
              {formatPrice(tour.basePrice)}
            </Text>
          </Space>
        }
      />
    </Card>
  );

  if (loading || !tour) {
    return <Card loading={true} />;
  }

  return (
    <div style={{ margin: '0 auto', padding: '24px' }}>
      <Card>
        <Row gutter={24}>
          <Col span={12}>
            <Carousel autoplay>
              {tour.images.map((image, index) => (
                <div key={index}>
                  <img 
                    src={image} 
                    alt={`Tour ${index + 1}`} 
                    style={{ 
                      width: '100%', 
                      height: '500px', 
                      objectFit: 'cover',
                      borderRadius: '8px'
                    }} 
                  />
                </div>
              ))}
            </Carousel>
          </Col>
          <Col span={12}>
            <Title level={3}>{tour.name}</Title>
            <Space wrap style={{ marginBottom: 16 }}>
              <Tag color="blue">{tour.Category?.name}</Tag>
              <Tag color="green">{tour.Location?.name}</Tag>
              <Tag color="orange">{tour.DepartureLocation?.name}</Tag>
              <Tag color="purple">{tour.duration} ngày</Tag>
            </Space>
            <Rate disabled defaultValue={tour.averageRating || 0} allowHalf />
            <Text style={{ marginLeft: 8 }}>({tour.totalReviews || 0} đánh giá)</Text>
            <Divider />
            <Space direction="vertical" size={16}>
              <div>
                <Text type="secondary">Giá từ</Text>
                <br />
                <Text strong style={{ fontSize: 24, color: '#f50' }}>
                  {formatPrice(tour.basePrice)}
                </Text>
              </div>
              <Space split={<Divider type="vertical" />}>
                <Space>
                  <ClockCircleOutlined />
                  <Text>{tour.duration} ngày</Text>
                </Space>
                <Space>
                  <UserOutlined />
                  <Text>{tour.maxGroupSize} người</Text>
                </Space>
              </Space>
              <Space>
                <EnvironmentOutlined />
                <Text>Khởi hành từ: {tour.DepartureLocation?.name}</Text>
              </Space>
            </Space>
          </Col>
        </Row>
      </Card>

      <Card title="Mô tả tour" style={{ marginTop: 24 }}>
        <div dangerouslySetInnerHTML={{ __html: tour.description }} />
      </Card>

      <Card title="Lịch trình chi tiết" style={{ marginTop: 24 }}>
        <div dangerouslySetInnerHTML={{ __html: tour.itinerary }} />
      </Card>

      <Card title="Vị trí" style={{ marginTop: 24 }}>
        <div style={{ height: 400 }}>
          <MapContainer
            center={[tour.Location.latitude, tour.Location.longitude]}
            zoom={13}
            style={{ height: '100%', width: '100%', borderRadius: '8px' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={[tour.Location.latitude, tour.Location.longitude]}>
              <Popup>{tour.Location.name}</Popup>
            </Marker>
          </MapContainer>
        </div>
      </Card>

      <Card title="Lịch khởi hành" style={{ marginTop: 24 }}>
        <Table
          columns={scheduleColumns}
          dataSource={schedules}
          rowKey="id"
          pagination={false}
          scroll={{ x: 1200 }}
        />
        <div style={{ marginTop: 16, textAlign: 'right' }}>
          <Button 
            type="primary" 
            size="large"
            onClick={handleBooking}
            disabled={!selectedSchedule}
          >
            Đặt tour
          </Button>
        </div>
      </Card>

      <Card title="Đánh giá" style={{ marginTop: 24 }}>
        {canReview && (
          <div style={{ marginBottom: 24 }}>
            <Form form={form} onFinish={handleSubmitReview}>
              <Form.Item
                name="rating"
                rules={[{ required: true, message: 'Vui lòng chọn số sao!' }]}
              >
                <Rate />
              </Form.Item>
              <Form.Item
                name="comment"
                rules={[{ required: true, message: 'Vui lòng nhập nhận xét!' }]}
              >
                <TextArea rows={4} placeholder="Nhập nhận xét của bạn..." />
              </Form.Item>
              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={submittingReview}
                >
                  Gửi đánh giá
                </Button>
              </Form.Item>
            </Form>
          </div>
        )}

        <List
          itemLayout="horizontal"
          dataSource={reviews}
          renderItem={review => (
            <Comment
              author={review.User.name}
              avatar={<Avatar icon={<UserOutlined />} />}
              content={
                <div>
                  <Rate disabled defaultValue={review.rating} />
                  <p>{review.comment}</p>
                </div>
              }
              datetime={formatDate(review.createdAt)}
            />
          )}
          locale={{ emptyText: 'Chưa có đánh giá nào' }}
        />
      </Card>

      <Card title="Tour tương tự" style={{ marginTop: 24 }}>
        <Row gutter={24}>
          {relatedTours.map(tour => (
            <Col key={tour.id} span={6}>
              {renderTourCard(tour)}
            </Col>
          ))}
        </Row>
      </Card>
    </div>
  );
}

export default TourDetail;
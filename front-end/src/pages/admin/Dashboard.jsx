import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Table, List, Select, Empty } from 'antd';
import { Line } from '@ant-design/plots';
import { 
  UserOutlined, 
  ShopOutlined, 
  BookOutlined, 
  DollarOutlined,
  StarOutlined
} from '@ant-design/icons';
import { dashboardService } from '../../services/dashboardService';
import { formatPrice, formatDate } from '../../utils/format';

const { Option } = Select;

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTours: 0,
    totalBookings: 0,
    totalRevenue: 0,
    recentBookings: [],
    popularTours: [],
    bookingStats: {}
  });
  const [revenueStats, setRevenueStats] = useState([]);
  const [tourStats, setTourStats] = useState([]);
  const [revenuePeriod, setRevenuePeriod] = useState('monthly');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    fetchRevenueStats();
  }, [revenuePeriod]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, tourStatsRes] = await Promise.all([
        dashboardService.getStatistics(),
        dashboardService.getTourStats()
      ]);
      
      // Ensure data exists and has the expected structure
      setStats({
        totalUsers: statsRes?.data?.totalUsers || 0,
        totalTours: statsRes?.data?.totalTours || 0,
        totalBookings: statsRes?.data?.totalBookings || 0,
        totalRevenue: statsRes?.data?.totalRevenue || 0,
        recentBookings: statsRes?.data?.recentBookings || [],
        popularTours: statsRes?.data?.popularTours || [],
        bookingStats: statsRes?.data?.bookingStats || {}
      });
      
      setTourStats(tourStatsRes?.data || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRevenueStats = async () => {
    try {
      const response = await dashboardService.getRevenueStats(revenuePeriod);
      setRevenueStats(response?.data || []);
    } catch (error) {
      console.error('Error fetching revenue stats:', error);
    }
  };

  const revenueConfig = {
    data: revenueStats,
    xField: 'period',
    yField: 'revenue',
    seriesField: 'type',
    smooth: true,
    animation: {
      appear: {
        animation: 'path-in',
        duration: 1000
      }
    },
    yAxis: {
      label: {
        formatter: (value) => formatPrice(value)
      }
    }
  };

  const tourColumns = [
    {
      title: 'Tour',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Tổng đặt tour',
      dataIndex: 'totalBookings',
      key: 'totalBookings',
      sorter: (a, b) => a.totalBookings - b.totalBookings
    },
    {
      title: 'Doanh thu',
      dataIndex: 'totalRevenue',
      key: 'totalRevenue',
      render: (value) => formatPrice(value),
      sorter: (a, b) => a.totalRevenue - b.totalRevenue
    },
    {
      title: 'Đánh giá',
      dataIndex: 'averageRating',
      key: 'averageRating',
      render: (value) => (
        <span>
          {value.toFixed(1)} <StarOutlined style={{ color: '#fadb14' }} />
        </span>
      ),
      sorter: (a, b) => a.averageRating - b.averageRating
    }
  ];

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card loading={loading}>
            <Statistic
              title="Tổng người dùng"
              value={stats.totalUsers}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card loading={loading}>
            <Statistic
              title="Tổng tour"
              value={stats.totalTours}
              prefix={<ShopOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card loading={loading}>
            <Statistic
              title="Tổng đặt tour"
              value={stats.totalBookings}
              prefix={<BookOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card loading={loading}>
            <Statistic
              title="Tổng doanh thu"
              value={formatPrice(stats.totalRevenue)}
              prefix={<DollarOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={16}>
          <Card 
            title="Biểu đồ doanh thu" 
            loading={loading}
            extra={
              <Select
                value={revenuePeriod}
                onChange={setRevenuePeriod}
                style={{ width: 120 }}
              >
                <Option value="daily">Theo ngày</Option>
                <Option value="weekly">Theo tuần</Option>
                <Option value="monthly">Theo tháng</Option>
              </Select>
            }
          >
            {revenueStats.length > 0 ? (
              <Line {...revenueConfig} />
            ) : (
              <Empty description="Không có dữ liệu" />
            )}
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Đặt tour gần đây" loading={loading}>
            <List
              dataSource={stats.recentBookings}
              locale={{ emptyText: 'Không có dữ liệu' }}
              renderItem={(booking) => (
                <List.Item>
                  <List.Item.Meta
                    title={booking.tour?.name}
                    description={`${booking.user?.name} - ${formatDate(booking.createdAt)}`}
                  />
                  <div>{formatPrice(booking.totalPrice)}</div>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      <Card 
        title="Thống kê tour" 
        style={{ marginTop: 16 }}
        loading={loading}
      >
        <Table
          columns={tourColumns}
          dataSource={tourStats}
          rowKey="id"
          pagination={false}
          locale={{ emptyText: 'Không có dữ liệu' }}
        />
      </Card>
    </div>
  );
}

export default Dashboard;
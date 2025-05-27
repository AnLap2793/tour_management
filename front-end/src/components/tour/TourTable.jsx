import React from 'react';
import { Table, Button, Space, Image, Tag, Rate } from 'antd';
import { EditOutlined, DeleteOutlined, CalendarOutlined, PictureOutlined } from '@ant-design/icons';
import { formatPrice } from '../../utils/format';

function TourTable({ tours, loading, pagination, onTableChange, onShowSchedules, onShowImages, onEdit, onDelete }) {
  const imagePlaceholder = "https://placehold.co/400x400?text=No+Image";

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
            alt="Tour"
            style={{ 
              width: 80,
              height: 80,
              objectFit: 'cover',
              borderRadius: 4
            }}
            fallback={imagePlaceholder}
          />
        ) : null
      )
    },
    {
      title: 'Tên tour',
      dataIndex: 'name',
      key: 'name',
      sorter: true,
      render: (text) => <span style={{ fontWeight: 500 }}>{text}</span>
    },
    {
      title: 'Danh mục',
      dataIndex: ['Category', 'name'],
      key: 'categoryId',
      sorter: true,
      render: (text) => <Tag color="blue">{text}</Tag>
    },
    {
      title: 'Địa điểm',
      dataIndex: ['Location', 'name'],
      key: 'locationId',
      sorter: true,
      render: (text) => <Tag color="green">{text}</Tag>
    },
    {
      title: 'Điểm khởi hành',
      dataIndex: ['DepartureLocation', 'name'],
      key: 'departureLocationId',
      sorter: true,
      render: (text) => <Tag color="orange">{text}</Tag>
    },
    {
      title: 'Giá cơ bản',
      dataIndex: 'basePrice',
      key: 'basePrice',
      sorter: true,
      align: 'right',
      render: (price) => (
        <span style={{ color: '#f50', fontWeight: 500 }}>
          {formatPrice(price)}
        </span>
      )
    },
    {
      title: 'Thời gian',
      dataIndex: 'duration',
      key: 'duration',
      sorter: true,
      align: 'center',
      render: (duration) => (
        <Tag color="purple">{duration} ngày</Tag>
      )
    },
    {
      title: 'Đánh giá',
      key: 'rating',
      align: 'center',
      render: (_, record) => (
        <Space direction="vertical" size={0} style={{ textAlign: 'center' }}>
          <Rate disabled defaultValue={record.averageRating} allowHalf />
          <span style={{ fontSize: 12, color: '#8c8c8c' }}>
            ({record.totalReviews} đánh giá)
          </span>
        </Space>
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      sorter: true,
      align: 'center',
      render: (status) => (
        <Tag color={status === 'active' ? 'success' : 'error'}>
          {status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
        </Tag>
      )
    },
    {
      title: 'Thao tác',
      key: 'actions',
      fixed: 'right',
      width: 280,
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            ghost
            icon={<CalendarOutlined />}
            onClick={() => onShowSchedules(record.id)}
          >
            Lịch trình
          </Button>
          <Button
            type="primary"
            ghost
            icon={<PictureOutlined />}
            onClick={() => onShowImages(record.id)}
          >
            Hình ảnh
          </Button>
          <Button
            type="primary"
            ghost
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
          >
            Sửa
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => onDelete(record.id)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={tours}
      rowKey="id"
      loading={loading}
      pagination={pagination}
      onChange={onTableChange}
      scroll={{ x: 1500 }}
    />
  );
}

export default TourTable;

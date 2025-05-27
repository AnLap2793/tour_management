
import React from 'react';
import { Table, Button, Space, Tag, Modal } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { formatPrice } from '../../utils/format';

function TourScheduleTable({ schedules, loading, onEdit, onDelete }) {
  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa lịch trình này?',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: () => onDelete(id)
    });
  };

  const columns = [
    {
      title: 'Ngày khởi hành',
      dataIndex: 'departureDate',
      key: 'departureDate',
      render: (date) => new Date(date).toLocaleDateString('vi-VN'),
      width: 150,
      fixed: 'left'
    },
    {
      title: 'Ngày kết thúc',
      dataIndex: 'returnDate',
      key: 'returnDate',
      render: (date) => new Date(date).toLocaleDateString('vi-VN'),
      width: 150
    },
    {
      title: 'Số chỗ',
      children: [
        {
          title: 'Tối đa',
          dataIndex: 'maxSeats',
          key: 'maxSeats',
          width: 100,
          align: 'center'
        },
        {
          title: 'Còn lại',
          dataIndex: 'availableSeats',
          key: 'availableSeats',
          width: 100,
          align: 'center',
          render: (seats, record) => {
            let color = 'success';
            if (seats === 0 || record.status === 'full') {
              color = 'error';
            } else if (seats <= record.maxSeats * 0.2) {
              color = 'warning';
            }
            return <Tag color={color}>{seats}</Tag>;
          }
        }
      ]
    },
    {
      title: 'Giá',
      children: [
        {
          title: 'Cơ bản',
          dataIndex: 'basePrice',
          key: 'basePrice',
          align: 'right',
          width: 150,
          render: (price) => formatPrice(price)
        },
        {
          title: 'Người lớn',
          dataIndex: 'adultPrice',
          key: 'adultPrice',
          align: 'right',
          width: 150,
          render: (price) => formatPrice(price)
        },
        {
          title: 'Trẻ em',
          dataIndex: 'childPrice',
          key: 'childPrice',
          align: 'right',
          width: 150,
          render: (price) => formatPrice(price)
        },
        {
          title: 'Em bé',
          dataIndex: 'infantPrice',
          key: 'infantPrice',
          align: 'right',
          width: 150,
          render: (price) => formatPrice(price)
        }
      ]
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      width: 120,
      fixed: 'right',
      render: (status) => {
        const statusConfig = {
          available: { color: 'success', text: 'Còn chỗ' },
          full: { color: 'error', text: 'Hết chỗ' },
          cancelled: { color: 'default', text: 'Đã hủy' }
        };
        const config = statusConfig[status] || { color: 'default', text: status };
        return <Tag color={config.color}>{config.text}</Tag>;
      },
      filters: [
        { text: 'Còn chỗ', value: 'available' },
        { text: 'Hết chỗ', value: 'full' },
        { text: 'Đã hủy', value: 'cancelled' }
      ],
      onFilter: (value, record) => record.status === value
    },
    {
      title: 'Thao tác',
      key: 'actions',
      align: 'center',
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            ghost
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
            disabled={record.status === 'cancelled'}
          >
            Sửa
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
            disabled={record.status === 'cancelled'}
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
      dataSource={schedules}
      rowKey="id"
      loading={loading}
      pagination={false}
      scroll={{ x: 1500 }}
      bordered
      size="middle"
      rowClassName={(record) => {
        if (record.status === 'cancelled') return 'table-row-disabled';
        if (record.status === 'full') return 'table-row-full';
        return '';
      }}
    />
  );
}

export default TourScheduleTable;

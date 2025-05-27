
import React, { useEffect } from 'react';
import { Form, Select, InputNumber, DatePicker, Row, Col } from 'antd';
import dayjs from 'dayjs';

const { Option } = Select;
const { RangePicker } = DatePicker;

function TourScheduleForm({ form, onFinish, editingSchedule }) {
  useEffect(() => {
    if (editingSchedule) {
      console.log(editingSchedule);
      form.setFieldsValue({
        dateRange: [
          dayjs(editingSchedule.departureDate),
          dayjs(editingSchedule.returnDate)
        ],
        maxSeats: editingSchedule.maxSeats,
        availableSeats: editingSchedule.availableSeats,
        basePrice: editingSchedule.basePrice,
        adultPrice: editingSchedule.adultPrice,
        childPrice: editingSchedule.childPrice,
        infantPrice: editingSchedule.infantPrice,
        status: editingSchedule.status
      });
    } else {
      form.resetFields();
    }
  }, [editingSchedule, form]);

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={{
        status: 'available',
        maxSeats: 20,
        availableSeats: 20
      }}
    >
      <Form.Item
        name="dateRange"
        label="Thời gian"
        rules={[{ required: true, message: 'Vui lòng chọn thời gian!' }]}
      >
        <RangePicker 
          style={{ width: '100%' }}
          format="DD/MM/YYYY"
          disabledDate={(current) => {
            return current && current.isBefore(dayjs(), 'day');
          }}
        />
      </Form.Item>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="maxSeats"
            label="Số chỗ tối đa"
            rules={[{ required: true, message: 'Vui lòng nhập số chỗ tối đa!' }]}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="availableSeats"
            label="Số chỗ còn lại"
            rules={[{ required: true, message: 'Vui lòng nhập số chỗ còn lại!' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="basePrice"
            label="Giá cơ bản"
            rules={[{ required: true, message: 'Vui lòng nhập giá cơ bản!' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
              min={0}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="adultPrice"
            label="Giá người lớn"
            rules={[{ required: true, message: 'Vui lòng nhập giá người lớn!' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
              min={0}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="childPrice"
            label="Giá trẻ em"
            rules={[{ required: true, message: 'Vui lòng nhập giá trẻ em!' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
              min={0}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="infantPrice"
            label="Giá em bé"
            rules={[{ required: true, message: 'Vui lòng nhập giá em bé!' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
              min={0}
            />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        name="status"
        label="Trạng thái"
        rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
      >
        <Select>
          <Option value="available">Còn chỗ</Option>
          <Option value="full">Hết chỗ</Option>
          <Option value="cancelled">Đã hủy</Option>
        </Select>
      </Form.Item>
    </Form>
  );
}

export default TourScheduleForm;

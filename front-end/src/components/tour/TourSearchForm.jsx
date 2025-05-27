import React from 'react';
import { Form, Input, Select, Button, Row, Col, Card, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const { Option } = Select;

function TourSearchForm({ form, categories, onSearch, onReset }) {
  return (
    <Card style={{ marginBottom: 16 }}>
      <Form
        form={form}
        onFinish={onSearch}
        layout="vertical"
      >
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="name" label="Tên tour">
              <Input placeholder="Tìm kiếm theo tên tour" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="categoryId" label="Danh mục">
              <Select allowClear placeholder="Chọn danh mục">
                {categories.map(category => (
                  <Option key={category.id} value={category.id}>{category.name}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="status" label="Trạng thái">
              <Select allowClear placeholder="Chọn trạng thái">
                <Option value="active">Hoạt động</Option>
                <Option value="inactive">Không hoạt động</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24} style={{ textAlign: 'right' }}>
            <Space>
              <Button onClick={onReset}>
                Đặt lại
              </Button>
              <Button type="primary" icon={<SearchOutlined />} htmlType="submit">
                Tìm kiếm
              </Button>
            </Space>
          </Col>
        </Row>
      </Form>
    </Card>
  );
}

export default TourSearchForm;
import React from 'react';
import { Form, Input, Select, InputNumber, Upload, Row, Col } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const { Option } = Select;
const { TextArea } = Input;

function TourForm({ form, categories, locations, departureLocations, onFinish }) {
  const normFile = (e) => {
    if (e?.file) {
      return e.file;
    }
    return null;
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['link'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'align',
    'link'
  ];

  return (
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
            label="Tên tour"
            rules={[{ required: true, message: 'Vui lòng nhập tên tour!' }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="categoryId"
            label="Danh mục"
            rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
          >
            <Select placeholder="Chọn danh mục">
              {categories.map(category => (
                <Option key={category.id} value={category.id}>{category.name}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="locationId"
            label="Địa điểm"
            rules={[{ required: true, message: 'Vui lòng chọn địa điểm!' }]}
          >
            <Select placeholder="Chọn địa điểm">
              {locations.map(location => (
                <Option key={location.id} value={location.id}>{location.name}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="departureLocationId"
            label="Điểm khởi hành"
            rules={[{ required: true, message: 'Vui lòng chọn điểm khởi hành!' }]}
          >
            <Select placeholder="Chọn điểm khởi hành">
              {departureLocations.map(location => (
                <Option key={location.id} value={location.id}>{location.name}</Option>
              ))}
            </Select>
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
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="duration"
            label="Thời gian (ngày)"
            rules={[{ required: true, message: 'Vui lòng nhập thời gian!' }]}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        name="description"
        label="Mô tả"
      >
        <TextArea rows={4} />
      </Form.Item>

      <Form.Item
        name="itinerary"
        label="Lịch trình"
        rules={[{ required: true, message: 'Vui lòng nhập lịch trình!' }]}
      >
        <ReactQuill 
          theme="snow"
          modules={modules}
          formats={formats}
          style={{ 
            height: '300px',
            marginBottom: '50px'
          }}
        />
      </Form.Item>

      <Form.Item
        name="image"
        label="Hình ảnh"
        valuePropName="file"
        getValueFromEvent={normFile}
        rules={[{ required: true, message: 'Vui lòng chọn hình ảnh!' }]}
      >
        <Upload
          accept="image/*"
          beforeUpload={() => false}
          maxCount={1}
          listType="picture-card"
          showUploadList={{
            showPreviewIcon: true,
            showRemoveIcon: true,
            showDownloadIcon: false
          }}
        >
          <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Tải lên</div>
          </div>
        </Upload>
      </Form.Item>

      <Form.Item
        name="status"
        label="Trạng thái"
        rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
      >
        <Select>
          <Option value="active">Hoạt động</Option>
          <Option value="inactive">Không hoạt động</Option>
        </Select>
      </Form.Item>
    </Form>
  );
}

export default TourForm;
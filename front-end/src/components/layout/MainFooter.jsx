import React from 'react';
import { Layout, Row, Col, Typography, Space } from 'antd';
import { PhoneOutlined, MailOutlined, EnvironmentOutlined } from '@ant-design/icons';

const { Footer } = Layout;
const { Title, Text, Link } = Typography;

function MainFooter() {
  return (
    <Footer style={{ 
      backgroundColor: '#001529',
      color: '#fff',
      padding: '48px 24px 24px'
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <Row gutter={[48, 32]}>
          <Col xs={24} sm={12} md={8}>
            <Title level={4} style={{ color: '#fff', marginBottom: 24 }}>
              Du Lịch Việt Nam
            </Title>
            <Space direction="vertical" size={16}>
              <Text style={{ color: '#fff' }}>
                Chúng tôi cung cấp các tour du lịch chất lượng cao với giá cả hợp lý, 
                đảm bảo mang đến cho quý khách những trải nghiệm tuyệt vời nhất.
              </Text>
              <Space>
                <PhoneOutlined />
                <Text style={{ color: '#fff' }}>1900 1234</Text>
              </Space>
              <Space>
                <MailOutlined />
                <Text style={{ color: '#fff' }}>contact@dulichvietnam.com</Text>
              </Space>
              <Space>
                <EnvironmentOutlined />
                <Text style={{ color: '#fff' }}>
                  123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh
                </Text>
              </Space>
            </Space>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Title level={4} style={{ color: '#fff', marginBottom: 24 }}>
              Thông tin
            </Title>
            <Space direction="vertical" size={12}>
              <Link href="/about" style={{ color: '#fff' }}>Về chúng tôi</Link>
              <Link href="/terms" style={{ color: '#fff' }}>Điều khoản sử dụng</Link>
              <Link href="/privacy" style={{ color: '#fff' }}>Chính sách bảo mật</Link>
              <Link href="/faq" style={{ color: '#fff' }}>Câu hỏi thường gặp</Link>
              <Link href="/contact" style={{ color: '#fff' }}>Liên hệ</Link>
            </Space>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Title level={4} style={{ color: '#fff', marginBottom: 24 }}>
              Theo dõi chúng tôi
            </Title>
            <Space direction="vertical" size={12}>
              <Link href="https://facebook.com" target="_blank" style={{ color: '#fff' }}>Facebook</Link>
              <Link href="https://instagram.com" target="_blank" style={{ color: '#fff' }}>Instagram</Link>
              <Link href="https://youtube.com" target="_blank" style={{ color: '#fff' }}>YouTube</Link>
              <Link href="https://tiktok.com" target="_blank" style={{ color: '#fff' }}>TikTok</Link>
            </Space>
          </Col>
        </Row>

        <div style={{ 
          marginTop: 48,
          padding: '24px 0',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          textAlign: 'center'
        }}>
          <Text style={{ color: '#fff' }}>
            © {new Date().getFullYear()} Du Lịch Việt Nam. Tất cả quyền được bảo lưu.
          </Text>
        </div>
      </div>
    </Footer>
  );
}

export default MainFooter;

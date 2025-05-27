import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Card,
  Row,
  Col,
  Input,
  Select,
  Button,
  List,
  Tag,
  Rate,
  Typography,
  Space,
  Statistic,
  Divider,
} from "antd";
import {
  SearchOutlined,
  ClockCircleOutlined,
  UserOutlined,
  SafetyCertificateOutlined,
  CustomerServiceOutlined,
  DollarCircleOutlined,
  CarOutlined,
  TeamOutlined,
  GlobalOutlined,
  PhoneOutlined,
  RightOutlined,
  UserSwitchOutlined,
  LikeOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { tourService } from "../../services/tourService";
import { categoryService } from "../../services/categoryService";
import { locationService } from "../../services/locationService";
import { formatPrice } from "../../utils/format";

const { Option } = Select;
const { Title, Text, Paragraph } = Typography;

function Home() {
  const location = useLocation();
  const navigate = useNavigate();
  const [tours, setTours] = useState({});
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    name: "",
    categoryId: undefined,
    locationId: undefined,
    minPrice: undefined,
    maxPrice: undefined,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [categoriesRes, locationsRes] = await Promise.all([
          categoryService.getAllCategories({ limit: 100 }),
          locationService.getAllLocations({ limit: 100 }),
        ]);

        setCategories(categoriesRes.data);
        setLocations(locationsRes.data);

        // Fetch tours for each category
        const tourPromises = categoriesRes.data.map((category) =>
          tourService.getAllTours({ categoryId: category.id, limit: 4 })
        );
        const tourResponses = await Promise.all(tourPromises);

        // Combine all tours and filter out categories with no tours
        const allTours = tourResponses.reduce((acc, response, index) => {
          if (response.data.length > 0) {
            acc[categoriesRes.data[index].id] = response.data;
          }
          return acc;
        }, {});

        setTours(allTours);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    // Check if we need to scroll to footer
    if (location.state?.scrollToFooter) {
      const footer = document.querySelector('footer');
      if (footer) {
        setTimeout(() => {
          footer.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location.state]);

  const handleSearch = () => {
    const params = new URLSearchParams();
  
    if (filters.name) params.set("name", filters.name);
    if (filters.categoryId) params.set("categoryId", filters.categoryId);
    if (filters.locationId) params.set("locationId", filters.locationId);
  
    navigate(`/tours?${params.toString()}`);
  };

  const features = [
    {
      icon: (
        <SafetyCertificateOutlined style={{ fontSize: 36, color: "#1890ff" }} />
      ),
      title: "An Toàn & Tin Cậy",
      description:
        "Cam kết đảm bảo an toàn và chất lượng dịch vụ cho mọi chuyến đi",
    },
    {
      icon: (
        <CustomerServiceOutlined style={{ fontSize: 36, color: "#52c41a" }} />
      ),
      title: "Hỗ Trợ 24/7",
      description: "Đội ngũ tư vấn viên luôn sẵn sàng hỗ trợ bạn mọi lúc",
    },
    {
      icon: <DollarCircleOutlined style={{ fontSize: 36, color: "#faad14" }} />,
      title: "Giá Tốt Nhất",
      description: "Cam kết mang đến mức giá tốt nhất cho khách hàng",
    },
  ];

  const services = [
    {
      icon: <CarOutlined style={{ fontSize: 32, color: "#1890ff" }} />,
      title: "Phương Tiện Hiện Đại",
      description: "Xe đời mới, máy bay, tàu thủy đạt tiêu chuẩn an toàn cao",
    },
    {
      icon: <TeamOutlined style={{ fontSize: 32, color: "#52c41a" }} />,
      title: "HDV Chuyên Nghiệp",
      description:
        "Đội ngũ hướng dẫn viên nhiều kinh nghiệm, thân thiện và nhiệt tình",
    },
    {
      icon: <GlobalOutlined style={{ fontSize: 32, color: "#faad14" }} />,
      title: "Điểm Đến Đa Dạng",
      description: "Hàng trăm tour du lịch hấp dẫn trong nước và quốc tế",
    },
  ];

  const renderTourCard = (tour) => (
    <Link to={`/tours/${tour.id}`}>
      <Card
        hoverable
        cover={
          <div style={{ position: "relative", height: 300 }}>
            <img
              alt={tour.name}
              src={tour.image}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "8px 8px 0 0",
              }}
            />
            {tour.featured && (
              <Tag
                color="#f50"
                style={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  padding: "4px 8px",
                  fontSize: "14px",
                }}
              >
                Nổi bật
              </Tag>
            )}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                padding: "20px",
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
                borderRadius: "0 0 8px 8px",
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontSize: 18,
                  fontWeight: "bold",
                  display: "block",
                }}
              >
                {tour.name}
              </Text>
              <Space style={{ marginTop: 8 }}>
                <Tag color="blue">{tour.Category?.name}</Tag>
                <Tag color="green">{tour.Location?.name}</Tag>
              </Space>
            </div>
          </div>
        }
        bodyStyle={{ padding: 16 }}
      >
        <Space direction="vertical" size={12} style={{ width: "100%" }}>
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

          <div>
            <Rate disabled defaultValue={tour.averageRating || 0} allowHalf />
            <Text style={{ marginLeft: 8 }}>
              ({tour.totalReviews || 0} đánh giá)
            </Text>
          </div>

          <div>
            <Text type="secondary">Giá từ</Text>
            <br />
            <Text style={{ fontSize: 20, color: "#f50", fontWeight: "bold" }}>
              {formatPrice(tour.basePrice)}
            </Text>
          </div>
        </Space>
      </Card>
    </Link>
  );

  return (
    <div style={{ margin: "0 auto", padding: "24px" }}>
      {/* Hero Section */}
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <Title style={{ fontSize: 48, marginBottom: 16 }}>
          Khám Phá Việt Nam Cùng Chúng Tôi
        </Title>
        <Paragraph
          style={{
            fontSize: 18,
            color: "#666",
            maxWidth: 800,
            margin: "0 auto",
          }}
        >
          Trải nghiệm những chuyến đi tuyệt vời với dịch vụ chất lượng cao và
          giá cả hợp lý. Hãy để chúng tôi đồng hành cùng bạn trong mọi hành
          trình khám phá.
        </Paragraph>
      </div>

      {/* Search Box */}
      <Card
        style={{ marginBottom: 48, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
      >
        <Title level={3} style={{ marginBottom: 24, textAlign: "center" }}>
          Tìm Tour Du Lịch
        </Title>
        <Row gutter={16} align="middle">
          <Col flex={1}>
            <Input
              size="large"
              placeholder="Nhập tên tour, địa điểm..."
              prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
              value={filters.name}
              onChange={(e) => setFilters({ ...filters, name: e.target.value })}
            />
          </Col>
          <Col flex={1}>
            <Select
              size="large"
              style={{ width: "100%" }}
              placeholder="Chọn danh mục"
              allowClear
              value={filters.categoryId}
              onChange={(value) =>
                setFilters({ ...filters, categoryId: value })
              }
            >
              {categories.map((category) => (
                <Option key={category.id} value={category.id}>
                  {category.name}
                </Option>
              ))}
            </Select>
          </Col>
          <Col flex={1}>
            <Select
              size="large"
              style={{ width: "100%" }}
              placeholder="Chọn địa điểm"
              allowClear
              value={filters.locationId}
              onChange={(value) =>
                setFilters({ ...filters, locationId: value })
              }
            >
              {locations.map((location) => (
                <Option key={location.id} value={location.id}>
                  {location.name}
                </Option>
              ))}
            </Select>
          </Col>
          <Col>
            <Button
              type="primary"
              size="large"
              icon={<SearchOutlined />}
              onClick={handleSearch}
            >
              Tìm Kiếm
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Tours by Category */}
      {categories.map((category) => {
        const categoryTours = tours[category.id];
        if (!categoryTours || categoryTours.length === 0) return null;

        return (
          <div key={category.id} style={{ marginBottom: 48 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 24,
              }}
            >
              <div>
                <Title level={2} style={{ marginBottom: 8 }}>
                  {category.name}
                </Title>
                <Text type="secondary">{category.description}</Text>
              </div>
              <Link to={`/tours?categoryId=${category.id}`}>
                <Button type="primary" size="large">
                  Xem tất cả <RightOutlined />
                </Button>
              </Link>
            </div>

            <Row gutter={[24, 24]}>
              {categoryTours.map((tour) => (
                <Col key={tour.id} xs={24} sm={12} md={12} lg={6}>
                  {renderTourCard(tour)}
                </Col>
              ))}
            </Row>
          </div>
        );
      })}

      {/* Features */}
      <div style={{ marginBottom: 48 }}>
        <Title level={2} style={{ textAlign: "center", marginBottom: 32 }}>
          Tại Sao Chọn Chúng Tôi?
        </Title>
        <Row gutter={24}>
          {features.map((feature, index) => (
            <Col key={index} span={8}>
              <Card
                style={{
                  textAlign: "center",
                  height: "100%",
                  borderRadius: 8,
                }}
                hoverable
              >
                <div>{feature.icon}</div>
                <Title level={4} style={{ marginTop: 16 }}>
                  {feature.title}
                </Title>
                <Text type="secondary">{feature.description}</Text>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Services */}
      <div style={{ marginBottom: 48 }}>
        <Title level={2} style={{ textAlign: "center", marginBottom: 32 }}>
          Dịch Vụ Của Chúng Tôi
        </Title>
        <Row gutter={[24, 24]}>
          {services.map((service, index) => (
            <Col key={index} span={8}>
              <Card
                style={{
                  height: "100%",
                  borderRadius: 8,
                }}
                hoverable
              >
                <div style={{ textAlign: "center", marginBottom: 16 }}>
                  {service.icon}
                </div>
                <Title
                  level={4}
                  style={{ textAlign: "center", marginBottom: 8 }}
                >
                  {service.title}
                </Title>
                <Text
                  type="secondary"
                  style={{ textAlign: "center", display: "block" }}
                >
                  {service.description}
                </Text>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
      {/* Statistics */}
      <Row gutter={24} style={{ marginBottom: 48 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Khách Hàng"
              value={15000}
              suffix="+"
              prefix={<UserSwitchOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tour Du Lịch"
              value={200}
              suffix="+"
              prefix={<GlobalOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Điểm Đến"
              value={50}
              suffix="+"
              prefix={<EnvironmentOutlined />}
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Đánh Giá Tốt"
              value={98}
              suffix="%"
              prefix={<LikeOutlined />}
              valueStyle={{ color: "#f5222d" }}
            />
          </Card>
        </Col>
      </Row>
      {/* Contact CTA */}
      <Card
        style={{
          textAlign: "center",
          background: "linear-gradient(135deg, #1890ff 0%, #096dd9 100%)",
          border: "none",
          borderRadius: 8,
          padding: "48px 24px",
          marginBottom: 48,
        }}
      >
        <Title level={2} style={{ color: "#fff", marginBottom: 16 }}>
          Bạn Cần Tư Vấn?
        </Title>
        <Paragraph style={{ fontSize: 16, color: "#fff", marginBottom: 24 }}>
          Đội ngũ tư vấn viên của chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7
        </Paragraph>
        <Button
          type="primary"
          size="large"
          icon={<PhoneOutlined />}
          style={{
            background: "#fff",
            borderColor: "#fff",
            color: "#1890ff",
          }}
        >
          Liên Hệ Ngay
        </Button>
      </Card>
    </div>
  );
}

export default Home;

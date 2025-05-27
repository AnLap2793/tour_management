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
  Layout,
  Slider,
  Empty,
  Divider,
} from "antd";
import {
  SearchOutlined,
  ClockCircleOutlined,
  UserOutlined,
  FilterOutlined,
  SortAscendingOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { tourService } from "../../services/tourService";
import { categoryService } from "../../services/categoryService";
import { locationService } from "../../services/locationService";
import { departureLocationService } from "../../services/departureLocationService";
import { formatPrice } from "../../utils/format";

const { Option } = Select;
const { Title, Text } = Typography;
const { Content } = Layout;

function Tours() {
  const location = useLocation();
  const [tours, setTours] = useState([]);
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [departureLocations, setDepartureLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 12,
    total: 0,
  });
  const [filters, setFilters] = useState({
    name: "",
    categoryId: undefined,
    locationId: undefined,
    departureLocationId: undefined,
    priceRange: undefined,
    duration: undefined,
    sortBy: undefined,
    sortOrder: undefined,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [categoriesRes, locationsRes, departureLocationsRes] =
          await Promise.all([
            categoryService.getAllCategories({ limit: 100 }),
            locationService.getAllLocations({ limit: 100 }),
            departureLocationService.getAllDepartureLocations({ limit: 100 }),
          ]);
        setCategories(categoriesRes.data);
        setLocations(locationsRes.data);
        setDepartureLocations(departureLocationsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    setFilters((prev) => ({
      ...prev,
      name: queryParams.get("name") || "",
      categoryId: queryParams.get("categoryId") || undefined,
      locationId: queryParams.get("locationId") || undefined,
    }));
  }, [location.search]);

  useEffect(() => {
    handleSearch();
  }, [
    filters.categoryId,
    filters.locationId,
    filters.departureLocationId,
    filters.priceRange,
    filters.duration,
    filters.sortBy,
  ]);

  const handleSearch = async () => {
    try {
      setLoading(true);
      const { priceRange, ...otherFilters } = filters;
      const response = await tourService.getAllTours({
        ...otherFilters,
        minPrice: priceRange ? priceRange[0] : undefined,
        maxPrice: priceRange ? priceRange[1] : undefined,
        page: pagination.current,
        limit: pagination.pageSize,
      });
      
      setTours(response.data);
      setPagination((prev) => ({
        ...prev,
        total: response.pagination.totalItems,
      }));
    } catch (error) {
      console.error("Error searching tours:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFilters({
      name: "",
      categoryId: undefined,
      locationId: undefined,
      departureLocationId: undefined,
      priceRange: undefined,
      duration: undefined,
      sortBy: undefined,
      sortOrder: undefined,
    });
  };

  const handlePageChange = (page) => {
    setPagination((prev) => ({
      ...prev,
      current: page,
    }));
    handleSearch();
  };

  const renderTourCard = (tour) => (
    <Link to={`/tours/${tour.id}`}>
      <Card
        hoverable
        cover={
          <div style={{ position: "relative", height: 250 }}>
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
    <div style={{ padding: "24px" }}>
      <Row gutter={24}>
        <Col span={6}>
          <Card
            title={
              <Space>
                <FilterOutlined />
                <span>Bộ lọc</span>
              </Space>
            }
            style={{
              marginBottom: 16,
              position: "sticky",
              top: 24,
            }}
          >
            <div style={{ marginBottom: 16 }}>
              <Text strong>Tìm kiếm</Text>
              <Input
                placeholder="Nhập tên tour..."
                value={filters.name}
                onChange={(e) =>
                  setFilters({ ...filters, name: e.target.value })
                }
                onPressEnter={handleSearch}
                style={{ marginTop: 8 }}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <Text strong>Danh mục</Text>
              <Select
                style={{ width: "100%", marginTop: 8 }}
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
            </div>

            <div style={{ marginBottom: 16 }}>
              <Text strong>Địa điểm</Text>
              <Select
                style={{ width: "100%", marginTop: 8 }}
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
            </div>

            <div style={{ marginBottom: 16 }}>
              <Text strong>Điểm khởi hành</Text>
              <Select
                style={{ width: "100%", marginTop: 8 }}
                placeholder="Chọn điểm khởi hành"
                allowClear
                value={filters.departureLocationId}
                onChange={(value) =>
                  setFilters({ ...filters, departureLocationId: value })
                }
              >
                {departureLocations.map((location) => (
                  <Option key={location.id} value={location.id}>
                    {location.name}
                  </Option>
                ))}
              </Select>
            </div>

            <div style={{ marginBottom: 16 }}>
              <Text strong>Khoảng giá</Text>
              <Slider
                range
                min={0}
                max={10000000}
                step={500000}
                value={filters.priceRange}
                onChange={(value) =>
                  setFilters({ ...filters, priceRange: value })
                }
                tipFormatter={(value) => formatPrice(value)}
                style={{ marginTop: 8 }}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <Text strong>Thời gian</Text>
              <Select
                style={{ width: "100%", marginTop: 8 }}
                placeholder="Chọn thời gian"
                allowClear
                value={filters.duration}
                onChange={(value) =>
                  setFilters({ ...filters, duration: value })
                }
              >
                <Option value={1}>1 ngày</Option>
                <Option value={2}>2 ngày</Option>
                <Option value={3}>3 ngày</Option>
                <Option value={4}>4 ngày</Option>
                <Option value={5}>5 ngày</Option>
                <Option value={7}>7 ngày</Option>
                <Option value={10}>10 ngày</Option>
              </Select>
            </div>

            <div style={{ marginBottom: 16 }}>
              <Text strong>
                <Space>
                  <SortAscendingOutlined />
                  <span>Sắp xếp theo</span>
                </Space>
              </Text>
              <Select
                style={{ width: "100%", marginTop: 8 }}
                placeholder="Chọn tiêu chí"
                allowClear
                value={filters.sortBy}
                onChange={(value) => {
                  const [field, order] = value
                    ? value.split("-")
                    : [undefined, undefined];
                  setFilters({
                    ...filters,
                    sortBy: field,
                    sortOrder: order,
                  });
                }}
              >
                <Option value="basePrice-ASC">Giá tăng dần</Option>
                <Option value="basePrice-DESC">Giá giảm dần</Option>
                <Option value="duration-ASC">Thời gian tăng dần</Option>
                <Option value="duration-DESC">Thời gian giảm dần</Option>
                <Option value="createdAt-DESC">Mới nhất</Option>
              </Select>
            </div>

            <Button type="primary" block onClick={handleReset}>
              Đặt lại bộ lọc
            </Button>
          </Card>
        </Col>

        <Col span={18}>
          <List
            grid={{
              gutter: 24,
              xs: 1,
              sm: 2,
              md: 2,
              lg: 3,
              xl: 3,
              xxl: 4,
            }}
            dataSource={tours}
            loading={loading}
            renderItem={(tour) => (
              <List.Item style={{ marginBottom: 24 }}>
                {renderTourCard(tour)}
              </List.Item>
            )}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              onChange: handlePageChange,
              showSizeChanger: false,
              style: { textAlign: "center", marginTop: 24 },
            }}
            locale={{
              emptyText: <Empty description="Không tìm thấy tour nào" />,
            }}
          />
        </Col>
      </Row>
    </div>
  );
}

export default Tours;

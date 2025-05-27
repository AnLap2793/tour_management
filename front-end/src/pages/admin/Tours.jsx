import React, { useEffect, useState } from "react";
import {
  Card,
  Button,
  Space,
  Modal,
  Form,
  Row,
  Col,
  Typography,
  theme,
  Layout,
} from "antd";
import { PlusOutlined, PictureOutlined } from "@ant-design/icons";
import useTours from "../../hooks/useTours";
import useTourSchedules from "../../hooks/useTourSchedules";
import { categoryService } from "../../services/categoryService";
import { locationService } from "../../services/locationService";
import { departureLocationService } from "../../services/departureLocationService";

import TourSearchForm from "../../components/tour/TourSearchForm";
import TourForm from "../../components/tour/TourForm";
import TourTable from "../../components/tour/TourTable";
import TourScheduleForm from "../../components/tour/TourScheduleForm";
import TourScheduleTable from "../../components/tour/TourScheduleTable";
import TourImageModal from "../../components/tour/TourImageModal";

const { Title } = Typography;

function Tours() {
  const {
    tours,
    loading,
    modalVisible,
    editingTour,
    pagination,
    handleTableChange,
    handleSearch,
    resetSearch,
    showModal,
    handleModalCancel,
    createTour,
    updateTour,
    deleteTour,
    fetchTours,
  } = useTours();

  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();
  const [scheduleForm] = Form.useForm();
  const { token } = theme.useToken();

  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [departureLocations, setDepartureLocations] = useState([]);
  const [selectedTourId, setSelectedTourId] = useState(null);
  const [scheduleDrawerVisible, setScheduleDrawerVisible] = useState(false);
  const [imageModalVisible, setImageModalVisible] = useState(false);

  const {
    schedules,
    loading: schedulesLoading,
    modalVisible: scheduleModalVisible,
    editingSchedule,
    showModal: showScheduleModal,
    handleModalCancel: handleScheduleModalCancel,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    fetchSchedules,
  } = useTourSchedules(selectedTourId);

  useEffect(() => {
    fetchTours();
  }, [fetchTours]);

  useEffect(() => {
    const fetchData = async () => {
      try {
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
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (editingTour) {
      form.setFieldsValue({
        ...editingTour,
        itinerary: editingTour.itinerary,
      });
    } else {
      form.resetFields();
    }
  }, [editingTour, form]);

  const handleModalOk = () => {
    form.submit();
  };

  const handleScheduleModalOk = () => {
    scheduleForm.submit();
  };

  const onFinish = async (values) => {
    const formData = new FormData();
    Object.keys(values).forEach((key) => {
      if (key === "image" && values.image?.length > 0) {
        formData.append("image", values.image[0].originFileObj);
      } else if (values[key] !== undefined) {
        formData.append(key, values[key]);
      }
    });

    const success = editingTour
      ? await updateTour(editingTour.id, formData)
      : await createTour(formData);

    if (success) {
      handleModalCancel();
    }
  };

  const onScheduleFinish = async (values) => {
    const scheduleData = {
      ...values,
      tourId: selectedTourId,
    };

    const success = editingSchedule
      ? await updateSchedule(editingSchedule.id, scheduleData)
      : await createSchedule(scheduleData);

    if (success) {
      handleScheduleModalCancel();
      fetchSchedules();
    }
  };

  const handleDelete = async (id) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa tour này?",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        await deleteTour(id);
      },
    });
  };

  const showSchedules = (tourId) => {
    setSelectedTourId(tourId);
    setScheduleDrawerVisible(true);
  };

  const showImages = (tourId) => {
    setSelectedTourId(tourId);
    setImageModalVisible(true);
  };

  const handleScheduleDelete = async (id) => {
    const success = await deleteSchedule(id);
    if (success) {
      fetchSchedules();
    }
  };

  const handleScheduleDrawerClose = () => {
    setScheduleDrawerVisible(false);
    setSelectedTourId(null);
  };

  const handleImageModalClose = () => {
    setImageModalVisible(false);
    setSelectedTourId(null);
  };

  const renderActions = (record) => (
    <Space>
      <Button
        type="primary"
        ghost
        icon={<PictureOutlined />}
        onClick={() => showImages(record.id)}
      >
        Hình ảnh
      </Button>
      {/* Other action buttons */}
    </Space>
  );

  return (
    <div>
      <Title level={3} style={{ marginBottom: 24 }}>
        Quản lý tour
      </Title>

      <Card bordered={false}>
        <TourSearchForm
          form={searchForm}
          categories={categories}
          locations={locations}
          departureLocations={departureLocations}
          onSearch={handleSearch}
          onReset={resetSearch}
        />
      </Card>

      <Card
        bordered={false}
        title={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => showModal()}
            style={{ borderRadius: token.borderRadius }}
          >
            Thêm tour
          </Button>
        }
      >
        <TourTable
          tours={tours}
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Tổng cộng ${total} tour`,
            style: { marginBottom: 0 },
          }}
          onTableChange={handleTableChange}
          onShowSchedules={showSchedules}
          onShowImages={showImages}
          onEdit={showModal}
          onDelete={handleDelete}
          renderActions={renderActions}
        />
      </Card>

      <Modal
        title={editingTour ? "Sửa tour" : "Thêm tour"}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText={editingTour ? "Cập nhật" : "Thêm"}
        cancelText="Hủy"
        width={800}
        maskClosable={false}
        style={{ top: 20 }}
      >
        <TourForm
          form={form}
          categories={categories}
          locations={locations}
          departureLocations={departureLocations}
          onFinish={onFinish}
        />
      </Modal>

      <Modal
        title="Quản lý lịch trình"
        open={scheduleDrawerVisible}
        onCancel={handleScheduleDrawerClose}
        footer={null}
        width={1200}
      >
        <Space direction="vertical" style={{ width: "100%" }}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => showScheduleModal()}
            style={{ borderRadius: token.borderRadius }}
          >
            Thêm lịch trình
          </Button>

          <TourScheduleTable
            schedules={schedules}
            loading={schedulesLoading}
            onEdit={showScheduleModal}
            onDelete={handleScheduleDelete}
          />
        </Space>
      </Modal>

      <Modal
        title={editingSchedule ? "Sửa lịch trình" : "Thêm lịch trình"}
        open={scheduleModalVisible}
        onOk={handleScheduleModalOk}
        onCancel={handleScheduleModalCancel}
        okText={editingSchedule ? "Cập nhật" : "Thêm"}
        cancelText="Hủy"
        width={600}
        maskClosable={false}
      >
        <TourScheduleForm
          form={scheduleForm}
          onFinish={onScheduleFinish}
          editingSchedule={editingSchedule}
        />
      </Modal>

      <TourImageModal
        visible={imageModalVisible}
        tourId={selectedTourId}
        onCancel={handleImageModalClose}
      />
    </div>
  );
}

export default Tours;

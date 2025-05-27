
import { useState, useCallback, useEffect } from 'react';
import { message } from 'antd';
import { tourScheduleService } from '../services/tourScheduleService';
import dayjs from 'dayjs';

const useTourSchedules = (tourId) => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);

  const fetchSchedules = useCallback(async () => {
    if (!tourId) {
      setSchedules([]);
      return;
    }
    
    try {
      setLoading(true);
      const response = await tourScheduleService.getAllSchedules({ tourId });
      setSchedules(response.data);
    } catch (error) {
      message.error('Không thể tải danh sách lịch trình');
    } finally {
      setLoading(false);
    }
  }, [tourId]);

  useEffect(() => {
    if (tourId) {
      fetchSchedules();
    } else {
      setSchedules([]);
    }
  }, [tourId, fetchSchedules]);

  const showModal = useCallback(async (schedule = null) => {
    if (!tourId) return;

    try {
      if (schedule) {
        setLoading(true);
        // Fetch full schedule data when editing
        const response = await tourScheduleService.getScheduleById(schedule.id);
        const scheduleData = response.data;

        setEditingSchedule({
          ...scheduleData,
          dateRange: [
            dayjs(scheduleData.departureDate),
            dayjs(scheduleData.returnDate)
          ]
        });
      } else {
        setEditingSchedule(null);
      }
      setModalVisible(true);
    } catch (error) {
      message.error('Không thể tải thông tin lịch trình');
    } finally {
      setLoading(false);
    }
  }, [tourId]);

  const handleModalCancel = useCallback(() => {
    setModalVisible(false);
    setEditingSchedule(null);
  }, []);

  const createSchedule = useCallback(async (values) => {
    if (!tourId) return false;

    try {
      const scheduleData = {
        ...values,
        tourId,
        departureDate: values.dateRange[0].format('YYYY-MM-DD'),
        returnDate: values.dateRange[1].format('YYYY-MM-DD')
      };
      delete scheduleData.dateRange;

      await tourScheduleService.createSchedule(scheduleData);
      message.success('Thêm lịch trình thành công');
      await fetchSchedules();
      handleModalCancel();
      return true;
    } catch (error) {
      message.error(error.message || 'Không thể thêm lịch trình');
      return false;
    }
  }, [tourId, fetchSchedules, handleModalCancel]);

  const updateSchedule = useCallback(async (id, values) => {
    if (!tourId) return false;

    try {
      const scheduleData = {
        ...values,
        tourId,
        departureDate: values.dateRange[0].format('YYYY-MM-DD'),
        returnDate: values.dateRange[1].format('YYYY-MM-DD')
      };
      delete scheduleData.dateRange;

      await tourScheduleService.updateSchedule(id, scheduleData);
      message.success('Cập nhật lịch trình thành công');
      await fetchSchedules();
      handleModalCancel();
      return true;
    } catch (error) {
      message.error(error.message || 'Không thể cập nhật lịch trình');
      return false;
    }
  }, [tourId, fetchSchedules, handleModalCancel]);

  const deleteSchedule = useCallback(async (id) => {
    if (!tourId) return false;

    try {
      await tourScheduleService.deleteSchedule(id);
      message.success('Xóa lịch trình thành công');
      await fetchSchedules();
      return true;
    } catch (error) {
      message.error('Không thể xóa lịch trình');
      return false;
    }
  }, [tourId, fetchSchedules]);

  useEffect(() => {
    return () => {
      setSchedules([]);
      setModalVisible(false);
      setEditingSchedule(null);
      setLoading(false);
    };
  }, [tourId]);

  return {
    schedules,
    loading,
    modalVisible,
    editingSchedule,
    fetchSchedules,
    showModal,
    handleModalCancel,
    createSchedule,
    updateSchedule,
    deleteSchedule
  };
};

export default useTourSchedules;

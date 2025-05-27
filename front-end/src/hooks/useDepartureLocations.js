import { useState, useCallback } from 'react';
import { message } from 'antd';
import { departureLocationService } from '../services/departureLocationService';

const useDepartureLocations = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [filters, setFilters] = useState({
    name: '',
    city: '',
    province: '',
    status: undefined
  });

  const fetchLocations = useCallback(async (page = 1, pageSize = 10, searchFilters = filters) => {
    try {
      setLoading(true);
      const response = await departureLocationService.getAllDepartureLocations({
        page,
        limit: pageSize,
        ...searchFilters
      });
      
      setLocations(response.data);
      setPagination({
        current: page,
        pageSize,
        total: response.pagination.totalItems
      });
    } catch (error) {
      message.error('Không thể tải danh sách điểm khởi hành');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const handleTableChange = useCallback((pagination, filters, sorter) => {
    fetchLocations(
      pagination.current, 
      pagination.pageSize,
      {
        ...filters,
        sortBy: sorter.field,
        sortOrder: sorter.order === 'descend' ? 'DESC' : 'ASC'
      }
    );
  }, [fetchLocations]);

  const handleSearch = useCallback((values) => {
    const newFilters = {
      ...filters,
      ...values
    };
    setFilters(newFilters);
    fetchLocations(1, pagination.pageSize, newFilters);
  }, [filters, pagination.pageSize, fetchLocations]);

  const resetSearch = useCallback(() => {
    setFilters({
      name: '',
      city: '',
      province: '',
      status: undefined
    });
    fetchLocations(1, pagination.pageSize, {});
  }, [pagination.pageSize, fetchLocations]);

  const showModal = useCallback((location = null) => {
    setEditingLocation(location);
    setModalVisible(true);
  }, []);

  const handleModalCancel = useCallback(() => {
    setModalVisible(false);
    setEditingLocation(null);
  }, []);

  const createLocation = useCallback(async (values) => {
    try {
      await departureLocationService.createDepartureLocation(values);
      message.success('Thêm điểm khởi hành thành công');
      fetchLocations(pagination.current, pagination.pageSize, filters);
      return true;
    } catch (error) {
      message.error(error.message || 'Không thể thêm điểm khởi hành');
      return false;
    }
  }, [pagination.current, pagination.pageSize, filters, fetchLocations]);

  const updateLocation = useCallback(async (id, values) => {
    try {
      await departureLocationService.updateDepartureLocation(id, values);
      message.success('Cập nhật điểm khởi hành thành công');
      fetchLocations(pagination.current, pagination.pageSize, filters);
      return true;
    } catch (error) {
      message.error(error.message || 'Không thể cập nhật điểm khởi hành');
      return false;
    }
  }, [pagination.current, pagination.pageSize, filters, fetchLocations]);

  const deleteLocation = useCallback(async (id) => {
    try {
      Modal.confirm({
        title: 'Xác nhận xóa',
        content: 'Bạn có chắc chắn muốn xóa điểm khởi hành này?',
        okText: 'Xóa',
        okType: 'danger',
        cancelText: 'Hủy',
        onOk: async () => {
          await departureLocationService.deleteDepartureLocation(id);
          message.success('Xóa điểm khởi hành thành công');
          fetchLocations(pagination.current, pagination.pageSize, filters);
        }
      });
    } catch (error) {
      message.error('Không thể xóa điểm khởi hành');
    }
  }, [pagination.current, pagination.pageSize, filters, fetchLocations]);

  return {
    locations,
    loading,
    modalVisible,
    editingLocation,
    pagination,
    filters,
    fetchLocations,
    handleTableChange,
    handleSearch,
    resetSearch,
    showModal,
    handleModalCancel,
    createLocation,
    updateLocation,
    deleteLocation
  };
};

export default useDepartureLocations;

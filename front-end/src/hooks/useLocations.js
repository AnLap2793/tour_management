import { useState, useCallback } from 'react';
import { message } from 'antd';
import { locationService } from '../services/locationService';

const useLocations = () => {
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
    country: '',
    region: '',
    status: undefined
  });

  const fetchLocations = useCallback(async (page = 1, pageSize = 10, searchFilters = filters) => {
    try {
      setLoading(true);
      const response = await locationService.getAllLocations({
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
      message.error('Không thể tải danh sách địa điểm');
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
      country: '',
      region: '',
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
      await locationService.createLocation(values);
      message.success('Thêm địa điểm thành công');
      fetchLocations(pagination.current, pagination.pageSize, filters);
      return true;
    } catch (error) {
      message.error(error.message || 'Không thể thêm địa điểm');
      return false;
    }
  }, [pagination.current, pagination.pageSize, filters, fetchLocations]);

  const updateLocation = useCallback(async (id, values) => {
    try {
      await locationService.updateLocation(id, values);
      message.success('Cập nhật địa điểm thành công');
      fetchLocations(pagination.current, pagination.pageSize, filters);
      return true;
    } catch (error) {
      message.error(error.message || 'Không thể cập nhật địa điểm');
      return false;
    }
  }, [pagination.current, pagination.pageSize, filters, fetchLocations]);

  const deleteLocation = useCallback(async (locationId) => {
    try {
      await locationService.deleteLocation(locationId);
      message.success('Xóa địa điểm thành công');
      
      // Check if we're on the last page and it's empty after deletion
      const isLastPage = pagination.current === Math.ceil(pagination.total / pagination.pageSize);
      const isLastItem = locations.length === 1;
      
      // If we're on the last page and it's the last item, go to previous page
      const newPage = (isLastPage && isLastItem && pagination.current > 1) 
        ? pagination.current - 1 
        : pagination.current;
      
      await fetchLocations(newPage, pagination.pageSize, filters);
      return true;
    } catch (error) {
      message.error('Không thể xóa địa điểm');
      return false;
    }
  }, [locations, pagination, filters, fetchLocations]);

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

export default useLocations;
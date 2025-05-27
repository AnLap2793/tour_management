import { useState, useCallback } from 'react';
import { message } from 'antd';
import { tourService } from '../services/tourService';

const useTours = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTour, setEditingTour] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [filters, setFilters] = useState({
    name: '',
    categoryId: undefined,
    locationId: undefined,
    departureLocationId: undefined,
    status: undefined
  });

  const fetchTours = useCallback(async (page = 1, pageSize = 10, searchFilters = filters) => {
    try {
      setLoading(true);
      const response = await tourService.getAllTours({
        page,
        limit: pageSize,
        ...searchFilters
      });
      
      setTours(response.data);
      setPagination({
        current: page,
        pageSize,
        total: response.pagination.totalItems
      });
    } catch (error) {
      message.error('Không thể tải danh sách tour');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const handleTableChange = useCallback((pagination, filters, sorter) => {
    fetchTours(
      pagination.current, 
      pagination.pageSize,
      {
        ...filters,
        sortBy: sorter.field,
        sortOrder: sorter.order === 'descend' ? 'DESC' : 'ASC'
      }
    );
  }, [fetchTours]);

  const handleSearch = useCallback((values) => {
    const newFilters = {
      ...filters,
      ...values
    };
    setFilters(newFilters);
    fetchTours(1, pagination.pageSize, newFilters);
  }, [filters, pagination.pageSize, fetchTours]);

  const resetSearch = useCallback(() => {
    setFilters({
      name: '',
      categoryId: undefined,
      locationId: undefined,
      departureLocationId: undefined,
      status: undefined
    });
    fetchTours(1, pagination.pageSize, {});
  }, [pagination.pageSize, fetchTours]);

  const showModal = useCallback((tour = null) => {
    setEditingTour(tour);
    setModalVisible(true);
  }, []);

  const handleModalCancel = useCallback(() => {
    setModalVisible(false);
    setEditingTour(null);
  }, []);

  const createTour = useCallback(async (values) => {
    try {
      await tourService.createTour(values);
      message.success('Thêm tour thành công');
      fetchTours(pagination.current, pagination.pageSize, filters);
      return true;
    } catch (error) {
      message.error(error.message || 'Không thể thêm tour');
      return false;
    }
  }, [pagination.current, pagination.pageSize, filters, fetchTours]);

  const updateTour = useCallback(async (id, values) => {
    try {
      await tourService.updateTour(id, values);
      message.success('Cập nhật tour thành công');
      fetchTours(pagination.current, pagination.pageSize, filters);
      return true;
    } catch (error) {
      message.error(error.message || 'Không thể cập nhật tour');
      return false;
    }
  }, [pagination.current, pagination.pageSize, filters, fetchTours]);

  const deleteTour = useCallback(async (tourId) => {
    try {
      await tourService.deleteTour(tourId);
      message.success('Xóa tour thành công');
      
      // Check if we're on the last page and it's empty after deletion
      const isLastPage = pagination.current === Math.ceil(pagination.total / pagination.pageSize);
      const isLastItem = tours.length === 1;
      
      // If we're on the last page and it's the last item, go to previous page
      const newPage = (isLastPage && isLastItem && pagination.current > 1) 
        ? pagination.current - 1 
        : pagination.current;
      
      await fetchTours(newPage, pagination.pageSize, filters);
      return true;
    } catch (error) {
      message.error('Không thể xóa tour');
      return false;
    }
  }, [tours, pagination, filters, fetchTours]);

  return {
    tours,
    loading,
    modalVisible,
    editingTour,
    pagination,
    filters,
    fetchTours,
    handleTableChange,
    handleSearch,
    resetSearch,
    showModal,
    handleModalCancel,
    createTour,
    updateTour,
    deleteTour
  };
};

export default useTours;
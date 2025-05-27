import { useState, useCallback, useEffect } from 'react';
import { message } from 'antd';
import { bookingService } from '../services/bookingService';
import dayjs from 'dayjs';

const useBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [filters, setFilters] = useState({
    userId: undefined,
    tourId: undefined,
    status: undefined,
    paymentStatus: undefined,
    startDate: null,
    endDate: null,
    minPrice: undefined,
    maxPrice: undefined
  });

  const fetchBookings = useCallback(async (page = 1, pageSize = 10, searchFilters = filters) => {
    try {
      setLoading(true);
      const response = await bookingService.getAllBookings({
        page,
        limit: pageSize,
        ...searchFilters
      });
      
      setBookings(response.data);
      setPagination({
        current: page,
        pageSize,
        total: response.pagination.totalItems
      });
    } catch (error) {
      message.error('Không thể tải danh sách đặt tour');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleTableChange = useCallback((pagination, filters, sorter) => {
    fetchBookings(
      pagination.current, 
      pagination.pageSize,
      {
        ...filters,
        sortBy: sorter.field,
        sortOrder: sorter.order === 'descend' ? 'DESC' : 'ASC'
      }
    );
  }, [fetchBookings]);

  const handleSearch = useCallback((values) => {
    const newFilters = {
      ...filters,
      ...values,
      startDate: values.dateRange?.[0]?.format('YYYY-MM-DD'),
      endDate: values.dateRange?.[1]?.format('YYYY-MM-DD')
    };
    delete newFilters.dateRange;
    setFilters(newFilters);
    fetchBookings(1, pagination.pageSize, newFilters);
  }, [filters, pagination.pageSize, fetchBookings]);

  const resetSearch = useCallback(() => {
    setFilters({
      userId: undefined,
      tourId: undefined,
      status: undefined,
      paymentStatus: undefined,
      startDate: null,
      endDate: null,
      minPrice: undefined,
      maxPrice: undefined
    });
    fetchBookings(1, pagination.pageSize, {});
  }, [pagination.pageSize, fetchBookings]);

  const showModal = useCallback((booking = null) => {
    setEditingBooking(booking);
    setModalVisible(true);
  }, []);

  const handleModalCancel = useCallback(() => {
    setModalVisible(false);
    setEditingBooking(null);
  }, []);

  const updateBooking = useCallback(async (id, values) => {
    try {
      await bookingService.updateBooking(id, values);
      message.success('Cập nhật đặt tour thành công');
      
      // Check if we're on the last page and it's empty after update
      const isLastPage = pagination.current === Math.ceil(pagination.total / pagination.pageSize);
      const isLastItem = bookings.length === 1;
      
      // If we're on the last page and it's the last item, go to previous page
      const newPage = (isLastPage && isLastItem && pagination.current > 1) 
        ? pagination.current - 1 
        : pagination.current;
      
      await fetchBookings(newPage, pagination.pageSize, filters);
      return true;
    } catch (error) {
      message.error(error.message || 'Không thể cập nhật đặt tour');
      return false;
    }
  }, [bookings, pagination, filters, fetchBookings]);

  const cancelBooking = useCallback(async (bookingId) => {
    try {
      await bookingService.cancelBooking(bookingId);
      message.success('Hủy đặt tour thành công');
      
      // Check if we're on the last page and it's empty after cancellation
      const isLastPage = pagination.current === Math.ceil(pagination.total / pagination.pageSize);
      const isLastItem = bookings.length === 1;
      
      // If we're on the last page and it's the last item, go to previous page
      const newPage = (isLastPage && isLastItem && pagination.current > 1) 
        ? pagination.current - 1 
        : pagination.current;
      
      await fetchBookings(newPage, pagination.pageSize, filters);
      return true;
    } catch (error) {
      message.error('Không thể hủy đặt tour');
      return false;
    }
  }, [bookings, pagination, filters, fetchBookings]);

  return {
    bookings,
    loading,
    modalVisible,
    editingBooking,
    pagination,
    filters,
    fetchBookings,
    handleTableChange,
    handleSearch,
    resetSearch,
    showModal,
    handleModalCancel,
    updateBooking,
    cancelBooking
  };
};

export default useBookings;
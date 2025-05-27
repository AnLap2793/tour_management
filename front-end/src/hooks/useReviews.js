import { useState, useCallback, useEffect } from 'react';
import { message } from 'antd';
import { reviewService } from '../services/reviewService';
import { tourService } from '../services/tourService';
import dayjs from 'dayjs';

const useReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [filters, setFilters] = useState({
    tourId: undefined,
    rating: undefined,
    startDate: null,
    endDate: null
  });
  const [tours, setTours] = useState([]);
  const [loadingTours, setLoadingTours] = useState(false);

  const fetchTours = useCallback(async () => {
    try {
      setLoadingTours(true);
      const response = await tourService.getAllTours({ limit: 100 });
      setTours(response.data);
    } catch (error) {
      console.error('Error fetching tours:', error);
    } finally {
      setLoadingTours(false);
    }
  }, []);

  useEffect(() => {
    fetchTours();
  }, [fetchTours]);

  const fetchReviews = useCallback(async (page = 1, limit = 10, searchFilters = filters) => {
    try {
      setLoading(true);
      const response = await reviewService.getAllReviews({
        page,
        limit,
        ...searchFilters
      });
      
      setReviews(response.data);
      setPagination({
        current: page,
        pageSize: limit,
        total: response.pagination.totalItems
      });
    } catch (error) {
      message.error('Không thể tải danh sách đánh giá');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const handleTableChange = useCallback((pagination, filters, sorter) => {
    fetchReviews(
      pagination.current, 
      pagination.pageSize,
      {
        ...filters,
        sortBy: sorter.field,
        sortOrder: sorter.order === 'descend' ? 'DESC' : 'ASC'
      }
    );
  }, [fetchReviews]);

  const handleSearch = useCallback((values) => {
    const newFilters = {
      ...filters,
      ...values,
      startDate: values.dateRange?.[0]?.format('YYYY-MM-DD'),
      endDate: values.dateRange?.[1]?.format('YYYY-MM-DD')
    };
    delete newFilters.dateRange;
    setFilters(newFilters);
    fetchReviews(1, pagination.pageSize, newFilters);
  }, [filters, pagination.pageSize, fetchReviews]);

  const resetSearch = useCallback(() => {
    setFilters({
      tourId: undefined,
      rating: undefined,
      startDate: null,
      endDate: null
    });
    fetchReviews(1, pagination.pageSize, {});
  }, [pagination.pageSize, fetchReviews]);

  const showModal = useCallback((review = null) => {
    setEditingReview(review);
    setModalVisible(true);
  }, []);

  const handleModalCancel = useCallback(() => {
    setModalVisible(false);
    setEditingReview(null);
  }, []);

  const updateReview = useCallback(async (id, values) => {
    try {
      await reviewService.updateReview(id, values);
      message.success('Cập nhật đánh giá thành công');
      
      // Check if we're on the last page and it's empty after update
      const isLastPage = pagination.current === Math.ceil(pagination.total / pagination.pageSize);
      const isLastItem = reviews.length === 1;
      
      // If we're on the last page and it's the last item, go to previous page
      const newPage = (isLastPage && isLastItem && pagination.current > 1) 
        ? pagination.current - 1 
        : pagination.current;
      
      await fetchReviews(newPage, pagination.pageSize, filters);
      return true;
    } catch (error) {
      message.error(error.message || 'Không thể cập nhật đánh giá');
      return false;
    }
  }, [reviews, pagination, filters, fetchReviews]);

  const deleteReview = useCallback(async (id) => {
    try {
      await reviewService.deleteReview(id);
      message.success('Xóa đánh giá thành công');
      
      // Check if we're on the last page and it's empty after deletion
      const isLastPage = pagination.current === Math.ceil(pagination.total / pagination.pageSize);
      const isLastItem = reviews.length === 1;
      
      // If we're on the last page and it's the last item, go to previous page
      const newPage = (isLastPage && isLastItem && pagination.current > 1) 
        ? pagination.current - 1 
        : pagination.current;
      
      await fetchReviews(newPage, pagination.pageSize, filters);
      return true;
    } catch (error) {
      message.error('Không thể xóa đánh giá');
      return false;
    }
  }, [reviews, pagination, filters, fetchReviews]);

  return {
    reviews,
    loading,
    modalVisible,
    editingReview,
    pagination,
    filters,
    tours,
    loadingTours,
    fetchReviews,
    handleTableChange,
    handleSearch,
    resetSearch,
    showModal,
    handleModalCancel,
    updateReview,
    deleteReview
  };
};

export default useReviews;

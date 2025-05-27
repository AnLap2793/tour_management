import { useState, useCallback } from 'react';
import { message } from 'antd';
import { categoryService } from '../services/categoryService';

const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [filters, setFilters] = useState({
    name: '',
    status: undefined,
    sortBy: undefined,
    sortOrder: 'ASC'
  });

  const fetchCategories = useCallback(async (page = 1, pageSize = 10, searchFilters = filters) => {
    try {
      setLoading(true);
      const response = await categoryService.getAllCategories({
        page,
        limit: pageSize,
        ...searchFilters
      });
      
      setCategories(response.data);
      setPagination({
        current: page,
        pageSize,
        total: response.pagination.totalItems
      });
    } catch (error) {
      message.error('Không thể tải danh sách danh mục');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const handleTableChange = useCallback((pagination, _, sorter) => {
    const newFilters = {
      ...filters,
      sortBy: sorter.field,
      sortOrder: sorter.order === 'descend' ? 'DESC' : 'ASC'
    };
    fetchCategories(pagination.current, pagination.pageSize, newFilters);
  }, [filters, fetchCategories]);

  const handleSearch = useCallback((values) => {
    const newFilters = {
      ...filters,
      ...values
    };
    setFilters(newFilters);
    fetchCategories(1, pagination.pageSize, newFilters);
  }, [filters, pagination.pageSize, fetchCategories]);

  const resetSearch = useCallback(() => {
    const defaultFilters = {
      name: '',
      status: undefined,
      sortBy: undefined,
      sortOrder: 'ASC'
    };
    setFilters(defaultFilters);
    fetchCategories(1, pagination.pageSize, defaultFilters);
  }, [pagination.pageSize, fetchCategories]);

  const showModal = useCallback((category = null) => {
    setEditingCategory(category);
    setModalVisible(true);
  }, []);

  const handleModalCancel = useCallback(() => {
    setModalVisible(false);
    setEditingCategory(null);
  }, []);

  const createCategory = useCallback(async (values) => {
    try {
      await categoryService.createCategory(values);
      message.success('Thêm danh mục thành công');
      fetchCategories(pagination.current, pagination.pageSize, filters);
      return true;
    } catch (error) {
      message.error(error.message || 'Không thể thêm danh mục');
      return false;
    }
  }, [pagination.current, pagination.pageSize, filters, fetchCategories]);

  const updateCategory = useCallback(async (id, values) => {
    try {
      await categoryService.updateCategory(id, values);
      message.success('Cập nhật danh mục thành công');
      fetchCategories(pagination.current, pagination.pageSize, filters);
      return true;
    } catch (error) {
      message.error(error.message || 'Không thể cập nhật danh mục');
      return false;
    }
  }, [pagination.current, pagination.pageSize, filters, fetchCategories]);

  const deleteCategory = useCallback(async (categoryId) => {
    try {
      await categoryService.deleteCategory(categoryId);
      message.success('Xóa danh mục thành công');
      
      // Check if we're on the last page and it's empty after deletion
      const isLastPage = pagination.current === Math.ceil(pagination.total / pagination.pageSize);
      const isLastItem = categories.length === 1;
      
      // If we're on the last page and it's the last item, go to previous page
      const newPage = (isLastPage && isLastItem && pagination.current > 1) 
        ? pagination.current - 1 
        : pagination.current;
      
      await fetchCategories(newPage, pagination.pageSize, filters);
      return true;
    } catch (error) {
      message.error('Không thể xóa danh mục');
      return false;
    }
  }, [categories, pagination, filters, fetchCategories]);

  return {
    categories,
    loading,
    modalVisible,
    editingCategory,
    pagination,
    filters,
    fetchCategories,
    handleTableChange,
    handleSearch,
    resetSearch,
    showModal,
    handleModalCancel,
    createCategory,
    updateCategory,
    deleteCategory
  };
};

export default useCategories;
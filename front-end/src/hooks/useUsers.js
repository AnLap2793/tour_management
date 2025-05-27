import { useState, useCallback } from 'react';
import { message } from 'antd';
import { userService } from '../services/userService';

const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [filters, setFilters] = useState({
    name: '',
    email: '',
    role: undefined,
    status: undefined
  });

  const fetchUsers = useCallback(async (page = 1, pageSize = 10, searchFilters = filters) => {
    try {
      setLoading(true);
      const response = await userService.getAllUsers({
        page,
        limit: pageSize,
        ...searchFilters,
      });
      
      setUsers(response.data);
      setPagination({
        current: page,
        pageSize,
        total: response.pagination.totalItems
      });
    } catch (error) {
      message.error('Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const handleTableChange = useCallback((pagination, filters, sorter) => {
    fetchUsers(
      pagination.current, 
      pagination.pageSize,
      {
        ...filters,
        sortBy: sorter.field,
        sortOrder: sorter.order === 'descend' ? 'DESC' : 'ASC'
      }
    );
  }, [fetchUsers]);

  const handleSearch = useCallback((values) => {
    const newFilters = {
      ...filters,
      ...values
    };
    setFilters(newFilters);
    fetchUsers(1, pagination.pageSize, newFilters);
  }, [filters, pagination.pageSize, fetchUsers]);

  const resetSearch = useCallback(() => {
    setFilters({
      name: '',
      email: '',
      role: undefined,
      status: undefined
    });
    fetchUsers(1, pagination.pageSize, {});
  }, [pagination.pageSize, fetchUsers]);

  const showModal = useCallback((user = null) => {
    setEditingUser(user);
    setModalVisible(true);
  }, []);

  const handleModalCancel = useCallback(() => {
    setModalVisible(false);
    setEditingUser(null);
  }, []);

  const createUser = useCallback(async (values) => {
    try {
      await userService.createUser(values);
      message.success('Thêm người dùng thành công');
      fetchUsers(pagination.current, pagination.pageSize, filters);
      return true;
    } catch (error) {
      message.error(error.message || 'Không thể thêm người dùng');
      return false;
    }
  }, [pagination.current, pagination.pageSize, filters, fetchUsers]);

  const updateUser = useCallback(async (id, values) => {
    try {
      await userService.updateUser(id, values);
      message.success('Cập nhật người dùng thành công');
      fetchUsers(pagination.current, pagination.pageSize, filters);
      return true;
    } catch (error) {
      message.error(error.message || 'Không thể cập nhật người dùng');
      return false;
    }
  }, [pagination.current, pagination.pageSize, filters, fetchUsers]);

  const deleteUser = useCallback(async (userId) => {
    try {
      await userService.deleteUser(userId);
      message.success('Xóa người dùng thành công');
      fetchUsers(pagination.current, pagination.pageSize, filters);
      return true;
    } catch (error) {
      message.error('Không thể xóa người dùng');
      return false;
    }
  }, [pagination.current, pagination.pageSize, filters, fetchUsers]);

  return {
    users,
    loading,
    modalVisible,
    editingUser,
    pagination,
    filters,
    fetchUsers,
    handleTableChange,
    handleSearch,
    resetSearch,
    showModal,
    handleModalCancel,
    createUser,
    updateUser,
    deleteUser
  };
};

export default useUsers;
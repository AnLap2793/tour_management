import React, { useState, useEffect } from 'react';
import { Modal, Upload, Button, List, Image, Space, message } from 'antd';
import { PlusOutlined, DeleteOutlined, DragOutlined } from '@ant-design/icons';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { tourImageService } from '../../services/tourImageService';

function TourImageModal({ visible, tourId, onCancel }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (visible && tourId) {
      fetchImages();
    }
  }, [visible, tourId]);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const response = await tourImageService.getTourImages(tourId);
      setImages(response.data);
    } catch (error) {
      message.error('Không thể tải danh sách hình ảnh');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async ({ file, onSuccess, onError }) => {
    try {
      setUploading(true);
      await tourImageService.addTourImages(tourId, [file]);
      onSuccess();
      fetchImages();
    } catch (error) {
      onError();
      message.error('Không thể tải lên hình ảnh');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (imageId) => {
    try {
      await tourImageService.deleteImage(tourId, imageId);
      message.success('Xóa hình ảnh thành công');
      fetchImages();
    } catch (error) {
      message.error('Không thể xóa hình ảnh');
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const items = Array.from(images);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setImages(items);

    try {
      await tourImageService.updateImageOrder(tourId, 
        items.map((item, index) => ({
          id: item.id,
          sortOrder: index
        }))
      );
    } catch (error) {
      message.error('Không thể cập nhật thứ tự hình ảnh');
      fetchImages();
    }
  };

  return (
    <Modal
      title="Quản lý hình ảnh tour"
      open={visible}
      onCancel={onCancel}
      width={800}
      footer={null}
    >
      <Upload
        customRequest={handleUpload}
        showUploadList={false}
        accept="image/*"
        multiple={true}
      >
        <Button 
          icon={<PlusOutlined />} 
          loading={uploading}
          style={{ marginBottom: 16 }}
        >
          Thêm hình ảnh
        </Button>
      </Upload>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="images">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              <List
                loading={loading}
                dataSource={images}
                renderItem={(image, index) => (
                  <Draggable 
                    key={image.id} 
                    draggableId={image.id.toString()} 
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        style={{
                          marginBottom: 16,
                          ...provided.draggableProps.style
                        }}
                      >
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          padding: 8,
                          border: '1px solid #d9d9d9',
                          borderRadius: 8
                        }}>
                          <div {...provided.dragHandleProps}>
                            <DragOutlined style={{ marginRight: 16, cursor: 'grab' }} />
                          </div>
                          <Image
                            src={image.image}
                            alt="Tour"
                            style={{ 
                              width: 100,
                              height: 100,
                              objectFit: 'cover',
                              borderRadius: 4
                            }}
                          />
                          <Space style={{ marginLeft: 16 }}>
                            <Button
                              type="text"
                              danger
                              icon={<DeleteOutlined />}
                              onClick={() => handleDelete(image.id)}
                            >
                              Xóa
                            </Button>
                          </Space>
                        </div>
                      </div>
                    )}
                  </Draggable>
                )}
              />
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </Modal>
  );
}

export default TourImageModal;
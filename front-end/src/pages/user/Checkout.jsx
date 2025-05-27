import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Card, Form, Input, InputNumber, Button, Row, Col,
    Typography, Descriptions, Divider, message, Radio, Space, /* QRCode removed */ Modal, Image // Added Image from antd
} from 'antd';
import { WalletOutlined, QrcodeOutlined } from '@ant-design/icons';
// Removed vietnam-qr-pay import
// import { QRPay, BanksObject } from 'vietnam-qr-pay';
import { bookingService } from '../../services/bookingService';
import { userService } from '../../services/userService';
import { formatPrice } from '../../utils/format';

const { Title, Text, Paragraph } = Typography;

// --- Static VietQR Configuration ---
// You still need this info to display to the user
const VIETQR_BANK_NAME = 'VietinBank'; // Or lookup manually
const VIETQR_BANK_BIN = '970415';      // Example: VietinBank BIN
const VIETQR_ACCOUNT_NO = '105874794391'; // Your Account Number
const VIETQR_ACCOUNT_NAME = 'NGUYEN TAN HUY'; // Your Account Name

// --- Path to your static QR image ---
const STATIC_QR_IMAGE_PATH = '/assets/images/vietqr.png'; 


function Checkout() {
    const location = useLocation();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('vnpay');
    const [showQRModal, setShowQRModal] = useState(false);
    const [totalPrice, setTotalPrice] = useState(0);
    // qrCodeValue state is no longer needed for dynamic content
    // const [qrCodeValue, setQrCodeValue] = useState('');
    const [qrDescription, setQrDescription] = useState('');

    const { tour, schedule } = location.state || {};
    const user = userService.getUserData();

    const calculateTotal = useCallback((values) => {
        if (!schedule) return 0;
        const adults = values?.numberOfAdults || 0;
        const children = values?.numberOfChildren || 0;
        const infants = values?.numberOfInfants || 0;
        return (
            adults * schedule.adultPrice +
            children * schedule.childPrice +
            infants * schedule.infantPrice
        );
    }, [schedule]);

    useEffect(() => {
        const initialValues = {
            numberOfAdults: 1, numberOfChildren: 0, numberOfInfants: 0, paymentMethod: 'vnpay'
        };
        const currentValues = form.getFieldsValue();

        if (currentValues.numberOfAdults === undefined && currentValues.numberOfChildren === undefined && currentValues.numberOfInfants === undefined) {
             const valuesToSet = { ...initialValues };
             if (user) {
                 valuesToSet.contactName = user.name;
                 valuesToSet.contactEmail = user.email;
                 valuesToSet.contactPhone = user.phone;
             }
             form.setFieldsValue(valuesToSet);
             setTotalPrice(calculateTotal(valuesToSet));
        } else {
             setTotalPrice(calculateTotal(currentValues));
        }
    }, [form, user, calculateTotal, schedule]);


    useEffect(() => {
        if (!tour || !schedule) {
            message.warning('Thông tin tour hoặc lịch trình không hợp lệ. Đang chuyển hướng...');
            navigate('/tours');
        }
    }, [tour, schedule, navigate]);

    const handlePaymentMethodChange = (e) => {
        setPaymentMethod(e.target.value);
        form.setFieldsValue({ paymentMethod: e.target.value });
    };

    const handleValuesChange = (changedValues, allValues) => {
        if (
            changedValues.numberOfAdults !== undefined ||
            changedValues.numberOfChildren !== undefined ||
            changedValues.numberOfInfants !== undefined
        ) {
            setTotalPrice(calculateTotal(allValues));
        }
        if (changedValues.paymentMethod !== undefined) {
            setPaymentMethod(changedValues.paymentMethod);
        }
    };

    const onFinish = async (values) => {
        try {
            setLoading(true);
            const finalTotalPrice = calculateTotal(values);
            const bookingData = {
                ...values,
                tourId: tour.id,
                scheduleId: schedule.id,
                totalPrice: finalTotalPrice,
                paymentMethod: paymentMethod
            };

            if (paymentMethod === 'vnpay') {
                // First create a booking
                const bookingResponse = await bookingService.createBooking({
                    ...bookingData,
                    status: 'pending',
                    paymentStatus: 'pending'
                });
                
                if (!bookingResponse?.data?.id) {
                    throw new Error('Không thể tạo đơn đặt tour.');
                }
console.log('Booking created:', bookingResponse.data);
                // Then create VNPAY URL using the booking ID
                const response = await bookingService.createPaymentUrl({
                    data: bookingResponse.data,
                });

                if (response?.data?.paymentUrl) {
                    window.location.href = response.data.paymentUrl;
                    return;
                } else {
                    throw new Error('Không nhận được URL thanh toán VNPAY.');
                }
            } else if (paymentMethod === 'qr') {
                // Generate description just for display and saving
                const desc = `TT ${values.contactName || 'Khach'} Tour ${tour.id} ${values.contactPhone || ''}`
                             .trim()
                             .replace(/\s+/g, ' ')
                             .substring(0, 50);

                // No dynamic QR generation needed
                // const qrPay = QRPay.initVietQR({...});
                // const qrContent = qrPay.build();
                // if (!qrContent || !qrPay.isValid) {...}

                // Just set the details needed for the modal and show it
                setTotalPrice(finalTotalPrice);
                setQrDescription(desc);
                // setQrCodeValue(qrContent); // Removed
                setShowQRModal(true);
                setLoading(false);
            } else {
                await bookingService.createBooking(bookingData);
                message.success('Đặt tour thành công (Phương thức khác - Giả lập)');
                setLoading(false);
                navigate('/profile/bookings');
            }
        } catch (error) {
            console.error("Booking/QR Prep Error:", error);
            const errorMsg = error?.response?.data?.message || error?.message || 'Đặt tour thất bại. Vui lòng thử lại';
            message.error(errorMsg);
            setLoading(false);
        }
    };

    const handleQRModalClose = () => {
        setShowQRModal(false);
    };

    const handleConfirmQRPayment = async () => {
        handleQRModalClose();
        setLoading(true);

        const values = form.getFieldsValue();
        const qrBookingData = {
            ...values,
            tourId: tour.id,
            scheduleId: schedule.id,
            totalPrice: totalPrice,
            paymentMethod: 'qr',
            status: 'Pending Confirmation',
            notes: `Chờ xác nhận thanh toán QR. Nội dung CK: ${qrDescription}`
        };

        try {
            await bookingService.createBooking(qrBookingData);
            message.success('Đã ghi nhận yêu cầu đặt tour qua QR. Vui lòng chờ xác nhận thanh toán từ quản trị viên.');
            navigate('/profile/bookings');
        } catch (err) {
            console.error("QR Booking Error:", err);
            message.error(err?.response?.data?.message || 'Lỗi khi tạo đặt tour sau quét QR.');
        } finally {
            setLoading(false);
        }
    };

    const paymentMethods = [
        {
            value: 'vnpay',
            label: (<Space> <WalletOutlined /> <span>Thanh toán qua VNPAY</span> <img src="/assets/images/vnpay-logo.png" alt="VNPAY" height={20} style={{ marginLeft: 8 }} /> </Space>),
            description: 'Thanh toán an toàn với cổng thanh toán VNPAY'
        },
        {
            value: 'qr',
            label: (<Space> <QrcodeOutlined /> <span>Quét mã QR Ngân Hàng (VietQR)</span> </Space>),
            description: 'Quét mã QR để thanh toán qua ứng dụng ngân hàng của bạn'
        }
    ];

    if (!tour || !schedule) {
        return <div style={{ padding: 24 }}><Text>Đang tải thông tin hoặc chuyển hướng...</Text></div>;
    }

    const isQrConfigValid = VIETQR_BANK_BIN && VIETQR_ACCOUNT_NO;

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
            <Row gutter={24}>
                <Col xs={24} lg={16}>
                    <Card title="Thông tin đặt tour">
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={onFinish}
                            onValuesChange={handleValuesChange}
                            initialValues={{
                                numberOfAdults: 1,
                                numberOfChildren: 0,
                                numberOfInfants: 0,
                                paymentMethod: 'vnpay',
                                contactName: user?.name,
                                contactEmail: user?.email,
                                contactPhone: user?.phone,
                             }}
                        >
                            <Title level={4}>Thông tin liên hệ</Title>
                            <Row gutter={16}>
                                <Col xs={24} sm={12}>
                                    <Form.Item name="contactName" label="Họ tên" rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}>
                                        <Input disabled={!!user?.name} placeholder="Nhập họ tên người liên hệ" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <Form.Item name="contactPhone" label="Số điện thoại" rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }, { pattern: /^(0|\+84)[0-9]{9}$/, message: 'Số điện thoại không hợp lệ!' }]}>
                                        <Input disabled={!!user?.phone} placeholder="Nhập số điện thoại" />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Form.Item name="contactEmail" label="Email" rules={[{ required: true, message: 'Vui lòng nhập email!' }, { type: 'email', message: 'Email không hợp lệ!' }]}>
                                <Input disabled={!!user?.email} placeholder="Nhập địa chỉ email" />
                            </Form.Item>

                            <Divider />

                            <Title level={4}>Số lượng khách</Title>
                            <Row gutter={16}>
                                <Col xs={24} sm={8}>
                                    <Form.Item name="numberOfAdults" label={`Người lớn (${formatPrice(schedule.adultPrice)})`} rules={[{ required: true, type: 'number', min: 1, message: 'Ít nhất 1 người lớn!' }]} initialValue={1}>
                                        <InputNumber min={1} style={{ width: '100%' }} placeholder="Số lượng" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={8}>
                                    <Form.Item name="numberOfChildren" label={`Trẻ em 2-11t (${formatPrice(schedule.childPrice)})`} rules={[{ required: true, type: 'number', min: 0, message: 'Số lượng không hợp lệ!' }]} initialValue={0}>
                                        <InputNumber min={0} style={{ width: '100%' }} placeholder="Số lượng" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={8}>
                                    <Form.Item name="numberOfInfants" label={`Em bé < 2t (${formatPrice(schedule.infantPrice)})`} rules={[{ required: true, type: 'number', min: 0, message: 'Số lượng không hợp lệ!' }]} initialValue={0}>
                                        <InputNumber min={0} style={{ width: '100%' }} placeholder="Số lượng" />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Divider />

                            <Title level={4}>Phương thức thanh toán</Title>
                            <Form.Item name="paymentMethod" rules={[{ required: true, message: 'Vui lòng chọn phương thức thanh toán!' }]} initialValue={'vnpay'}>
                                <Radio.Group onChange={handlePaymentMethodChange} value={paymentMethod}>
                                    <Space direction="vertical" style={{ width: '100%' }}>
                                        {paymentMethods.map(method => (
                                            <Radio key={method.value} value={method.value} style={{ width: '100%' }} disabled={method.value === 'qr' && !isQrConfigValid}>
                                                <Card hoverable size="small" style={{ width: '100%', marginTop: 8, display: 'block', opacity: (method.value === 'qr' && !isQrConfigValid) ? 0.5 : 1 }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <Space direction="vertical" align="start">
                                                            {method.label}
                                                            <Text type="secondary" style={{ fontSize: '12px' }}>{method.description}</Text>
                                                            {method.value === 'qr' && !isQrConfigValid && <Text type="danger" style={{fontSize: '11px'}}>Chưa cấu hình</Text>}
                                                        </Space>
                                                    </div>
                                                </Card>
                                            </Radio>
                                        ))}
                                    </Space>
                                </Radio.Group>
                            </Form.Item>

                            <Form.Item name="specialRequests" label="Yêu cầu đặc biệt (Nếu có)">
                                <Input.TextArea rows={3} placeholder="Ví dụ: Phòng gần thang máy, ăn chay..." />
                            </Form.Item>

                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={loading}
                                    size="large"
                                    block
                                    disabled={loading || (paymentMethod === 'qr' && !isQrConfigValid)}
                                >
                                    {paymentMethod === 'vnpay' ? 'Tiến hành thanh toán VNPAY' :
                                        paymentMethod === 'qr' ? 'Xác nhận & Hiện thông tin QR' : // Changed button text
                                            'Xác nhận đặt tour'
                                    }
                                </Button>
                                {paymentMethod === 'qr' && !isQrConfigValid && (
                                    <Text type="danger" style={{ display: 'block', textAlign: 'center', marginTop: 8 }}>
                                        Chức năng thanh toán QR chưa được cấu hình hoặc thông tin ngân hàng không hợp lệ.
                                    </Text>
                                )}
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>

                <Col xs={24} lg={8}>
                    <Card title="Thông tin tour & chi phí" style={{ position: 'sticky', top: 24 }}>
                        <img src={tour.image || '/placeholder-image.png'} alt={tour.name} style={{ width: '100%', height: 'auto', objectFit: 'cover', marginBottom: 16, borderRadius: '8px' }} />
                        <Title level={5} style={{ marginBottom: 16 }}>{tour.name}</Title>
                        <Descriptions column={1} bordered size="small">
                            <Descriptions.Item label="Ngày đi">{new Date(schedule.departureDate).toLocaleDateString('vi-VN')}</Descriptions.Item>
                            <Descriptions.Item label="Ngày về">{new Date(schedule.returnDate).toLocaleDateString('vi-VN')}</Descriptions.Item>
                            <Descriptions.Item label="Khởi hành">{tour.DepartureLocation?.name || 'N/A'}</Descriptions.Item>
                            <Descriptions.Item label="Thời gian">{tour.duration} ngày</Descriptions.Item>
                            <Descriptions.Item label="Còn lại">{schedule.availableSeats} chỗ</Descriptions.Item>
                        </Descriptions>
                        <Divider />
                        <Title level={5}>Chi tiết giá</Title>
                         <Descriptions column={1} size="small">
                               {(form.getFieldValue('numberOfAdults') > 0) &&
                                 <Descriptions.Item label={`${form.getFieldValue('numberOfAdults')} x Người lớn`}>
                                   {formatPrice(form.getFieldValue('numberOfAdults') * schedule.adultPrice)}
                                 </Descriptions.Item>
                               }
                               {(form.getFieldValue('numberOfChildren') > 0) &&
                                 <Descriptions.Item label={`${form.getFieldValue('numberOfChildren')} x Trẻ em`}>
                                   {formatPrice(form.getFieldValue('numberOfChildren') * schedule.childPrice)}
                                 </Descriptions.Item>
                               }
                               {(form.getFieldValue('numberOfInfants') > 0) &&
                                 <Descriptions.Item label={`${form.getFieldValue('numberOfInfants')} x Em bé`}>
                                   {formatPrice(form.getFieldValue('numberOfInfants') * schedule.infantPrice)}
                                 </Descriptions.Item>
                               }
                            </Descriptions>
                        <Divider />
                        <div style={{ textAlign: 'right' }}>
                            <Text style={{ fontSize: 16 }}>Tổng cộng:</Text><br />
                            <Text strong style={{ fontSize: 28, color: '#f5222d' }}>{formatPrice(totalPrice)}</Text>
                        </div>
                        <Paragraph type="secondary" style={{ fontSize: 12, textAlign: 'right', marginTop: 8 }}>Giá đã bao gồm thuế và phí dịch vụ.</Paragraph>
                    </Card>
                </Col>
            </Row>

            <Modal
                title="Thông tin thanh toán QR" // Changed title
                open={showQRModal}
                onCancel={handleQRModalClose}
                footer={[
                    <Button key="back" onClick={handleQRModalClose}> Đóng </Button>, // Changed button text
                    <Button key="submit" type="primary" loading={loading} onClick={handleConfirmQRPayment}>
                        Tôi đã thanh toán
                    </Button>,
                ]}
                centered
                width={380}
            >
                <div style={{ textAlign: 'center', padding: '10px 0' }}>
                    <Paragraph> Quét mã QR bên dưới bằng ứng dụng Ngân hàng của bạn.</Paragraph>
                    {/* Display the static QR image */}
                    <Image
                        width={220}
                        src={STATIC_QR_IMAGE_PATH} // Use the path to your image
                        alt="VietQR Code"
                        style={{ margin: '16px 0' }}
                        // Add fallback if needed
                        // preview={false} // Optional: disable preview
                    />

                    <Paragraph type="secondary" style={{ fontSize: '12px', marginTop: '-10px', marginBottom: '16px' }}>
                        (Mã này chỉ chứa thông tin ngân hàng. Vui lòng nhập đúng số tiền và nội dung chuyển khoản bên dưới)
                    </Paragraph>

                    <Descriptions column={1} size="small" bordered style={{ textAlign: 'left', marginTop: 10 }}>
                        <Descriptions.Item label="Ngân hàng">{VIETQR_BANK_NAME} ({VIETQR_BANK_BIN})</Descriptions.Item>
                        <Descriptions.Item label="Số tài khoản">{VIETQR_ACCOUNT_NO}</Descriptions.Item>
                        {VIETQR_ACCOUNT_NAME && <Descriptions.Item label="Tên tài khoản">{VIETQR_ACCOUNT_NAME}</Descriptions.Item>}
                        <Descriptions.Item label="Số tiền cần chuyển"><Text strong style={{ color: '#f5222d' }}>{formatPrice(totalPrice)}</Text></Descriptions.Item>
                        <Descriptions.Item label="Nội dung CK (copy)"><Text copyable={{ text: qrDescription }}>{qrDescription || 'N/A'}</Text></Descriptions.Item>
                    </Descriptions>
                    <Paragraph type="warning" style={{ marginTop: 16, fontSize: '12px' }}>
                        Quan trọng: Vui lòng <Text strong>nhập chính xác số tiền</Text> và <Text strong>sao chép đúng nội dung chuyển khoản</Text> vào ứng dụng ngân hàng của bạn để chúng tôi dễ dàng xác nhận. Nhấn "Tôi đã thanh toán" <Text strong>sau khi</Text> hoàn tất chuyển khoản.
                    </Paragraph>
                </div>
            </Modal>
        </div>
    );
}

export default Checkout;
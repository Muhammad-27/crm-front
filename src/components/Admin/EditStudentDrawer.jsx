import { useEffect } from 'react';
import { Drawer, Form, Input, InputNumber, Button, message } from 'antd';
import axios from 'axios';

const API_URL = "https://crm-project-0yio.onrender.com";

const EditStudentDrawer = ({ open, onClose, studentData, fetchStudents }) => {
  const [form] = Form.useForm();

  // Oyna ochilganda o'quvchining eski ma'lumotlarini formaga avtomat joylaymiz
  useEffect(() => {
    if (studentData && open) {
      form.setFieldsValue({
        name: studentData.name,
        phone: studentData.phone,
        fee: studentData.fee
      });
    }
  }, [studentData, form, open]);

  const onFinish = async (values) => {
    try {
      await axios.put(`${API_URL}/edit-student/${studentData.id}`, values);
      message.success("O'quvchi ma'lumotlari yangilandi! ✏️");
      fetchStudents(); // Ro'yxatni yangilaymiz
      onClose(); // Oynani yopamiz
    } catch (error) {
      message.error("Tahrirlashda xatolik yuz berdi!");
    }
  };

  return (
    <Drawer
      title={<div style={{ textAlign: 'center', fontSize: '18px', fontWeight: 'bold' }}>✏️ O'quvchini Tahrirlash</div>}
      placement="bottom"
      height="65%"
      onClose={onClose}
      open={open}
      style={{ borderRadius: '20px 20px 0 0' }}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="name"
          label="O'quvchining ism-sharifi"
          rules={[{ required: true, message: 'Ismni kiriting!' }]}
        >
          <Input size="large" style={{ borderRadius: '10px' }} />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Telefon raqami"
          rules={[{ required: true, message: 'Raqamni kiriting!' }]}
        >
          <Input size="large" style={{ borderRadius: '10px' }} />
        </Form.Item>

        <Form.Item
          name="fee"
          label="To'lov summasi"
          rules={[{ required: true, message: 'Summani kiriting!' }]}
        >
          <InputNumber
            size="large"
            style={{ width: '100%', borderRadius: '10px' }}
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
            parser={(value) => value.replace(/\s?so'm|\s?/g, '')}
          />
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          block
          size="large"
          style={{ height: '50px', borderRadius: '12px', fontSize: '16px', fontWeight: 'bold', marginTop: '10px' }}
        >
          Saqlash
        </Button>
      </Form>
    </Drawer>
  );
};

export default EditStudentDrawer;
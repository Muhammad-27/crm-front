import { useEffect } from 'react';
import { Drawer, Form, Input, Button, message } from 'antd';
import axios from 'axios';

const API_URL = "https://crm-project-0yio.onrender.com";

const EditTeacherDrawer = ({ open, onClose, teacherData, fetchTeachers }) => {
  const [form] = Form.useForm();

  // Oyna ochilganda ustozning eski ma'lumotlarini formaga avtomat joylaymiz
  useEffect(() => {
    if (teacherData && open) {
      form.setFieldsValue({
        name: teacherData.name,
        phone: teacherData.phone,
        telegram_id: teacherData.telegram_id
      });
    }
  }, [teacherData, form, open]);

  const onFinish = async (values) => {
    try {
      await axios.put(`${API_URL}/edit-teacher/${teacherData.id}`, values);
      message.success("Ustoz ma'lumotlari yangilandi! ✏️");
      fetchTeachers(); // Ro'yxatni yangilaymiz
      onClose(); // Oynani yopamiz
    } catch (error) {
      message.error("Tahrirlashda xatolik yuz berdi!");
    }
  };

  return (
    <Drawer
      title={<div style={{ textAlign: 'center', fontSize: '18px', fontWeight: 'bold' }}>✏️ Ustozni Tahrirlash</div>}
      placement="bottom"
      height="65%"
      onClose={onClose}
      open={open}
      style={{ borderRadius: '20px 20px 0 0' }}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="name"
          label="Ustozning ism-sharifi"
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
          name="telegram_id"
          label="Telegram ID raqami"
        >
          <Input size="large" style={{ borderRadius: '10px' }} placeholder="Masalan: 123456789" />
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

export default EditTeacherDrawer;
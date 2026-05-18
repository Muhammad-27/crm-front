import { Drawer, Form, Input, Button, message } from 'antd';
import axios from 'axios';

const API_URL = "https://crm-project-0yio.onrender.com";

const AddTeacherDrawer = ({ open, onClose, fetchTeachers }) => {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      await axios.post(`${API_URL}/add-teacher`, values);
      message.success("Yangi o'qituvchi qo'shildi! 🎉");
      form.resetFields();
      fetchTeachers(); // Ro'yxatni yangilaymiz
      onClose(); // Oynani yopamiz
    } catch (error) {
      message.error("Xatolik yuz berdi!");
    }
  };

  return (
    <Drawer 
      title={<div style={{ textAlign: 'center', fontSize: '18px', fontWeight: 'bold' }}>🧑‍🏫 Yangi O'qituvchi</div>}
      placement="bottom" 
      height="65%" 
      onClose={onClose} 
      open={open} 
      style={{ borderRadius: '20px 20px 0 0' }}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item 
          name="name" 
          label="Ism-sharifi" 
          rules={[{ required: true, message: 'Ismni kiriting!' }]}
        >
          <Input size="large" placeholder="Masalan: Alisher Navoiy" style={{ borderRadius: '10px' }} />
        </Form.Item>
        
        <Form.Item 
          name="phone" 
          label="Telefon raqami" 
          rules={[{ required: true, message: 'Raqamni kiriting!' }]}
        >
          <Input size="large" placeholder="998901234567" style={{ borderRadius: '10px' }} />
        </Form.Item>

        <Form.Item 
          name="telegram_id" 
          label="Telegram ID (Ixtiyoriy)"
        >
          <Input size="large" placeholder="Masalan: 123456789" style={{ borderRadius: '10px' }} />
        </Form.Item>

        <Button 
          type="primary" 
          htmlType="submit" 
          block 
          size="large" 
          style={{ height: '50px', borderRadius: '12px', fontSize: '16px', fontWeight: 'bold' }}
        >
          Saqlash
        </Button>
      </Form>
    </Drawer>
  );
};

export default AddTeacherDrawer;
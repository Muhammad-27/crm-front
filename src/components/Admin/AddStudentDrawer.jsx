import { Drawer, Form, Input, InputNumber, Button, message } from 'antd';
import axios from 'axios';

const API_URL = "https://crm-project-0yio.onrender.com";

const AddStudentDrawer = ({ open, onClose, groupId, fetchStudents }) => {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      // Backend o'quvchini guruhga qo'shishi uchun group_id yuboramiz
      await axios.post(`${API_URL}/add-student`, {
        group_id: groupId,
        name: values.name,
        phone: values.phone,
        fee: values.fee
      });
      message.success("O'quvchi muvaffaqiyatli qo'shildi! 🎉");
      form.resetFields();
      fetchStudents(); // O'quvchilar ro'yxatini yangilash
      onClose(); // Oynani yopish
    } catch (error) {
      message.error("O'quvchi qo'shishda xatolik yuz berdi!");
    }
  };

  return (
    <Drawer
      title={<div style={{ textAlign: 'center', fontSize: '18px', fontWeight: 'bold' }}>🧑‍🎓 Yangi O'quvchi</div>}
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
          <Input size="large" placeholder="Masalan: Jasur Murodov" style={{ borderRadius: '10px' }} />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Telefon raqami"
          rules={[{ required: true, message: 'Raqamni kiriting!' }]}
        >
          <Input size="large" placeholder="998901234567" style={{ borderRadius: '10px' }} />
        </Form.Item>

        <Form.Item
          name="fee"
          label="To'lov summasi (Shu o'quvchi uchun)"
          rules={[{ required: true, message: 'Summani kiriting!' }]}
        >
          <InputNumber
            size="large"
            placeholder="Masalan: 400000"
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
          Qo'shish
        </Button>
      </Form>
    </Drawer>
  );
};

export default AddStudentDrawer;
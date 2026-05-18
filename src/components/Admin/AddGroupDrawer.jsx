import { Drawer, Form, Input, InputNumber, Button, message } from 'antd';
import axios from 'axios';

const API_URL = "https://crm-project-0yio.onrender.com";

const AddGroupDrawer = ({ open, onClose, teacherId, fetchGroups }) => {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      // Backend guruh ochishda teacher_id (int) ni talab qiladi
      await axios.post(`${API_URL}/add-group`, {
        teacher_id: teacherId,
        name: values.name,
        price: values.price
      });
      message.success("Yangi guruh muvaffaqiyatli qo'shildi! 🎉");
      form.resetFields();
      fetchGroups(); // Guruhlar ro'yxatini yangilash
      onClose(); // Oynani yopish
    } catch (error) {
      message.error("Guruh qo'shishda xatolik yuz berdi!");
    }
  };

  return (
    <Drawer
      title={<div style={{ textAlign: 'center', fontSize: '18px', fontWeight: 'bold' }}>📚 Yangi Guruh</div>}
      placement="bottom"
      height="55%"
      onClose={onClose}
      open={open}
      style={{ borderRadius: '20px 20px 0 0' }}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="name"
          label="Guruh nomi"
          rules={[{ required: true, message: 'Guruh nomini kiriting!' }]}
        >
          <Input size="large" placeholder="Masalan: SMM va Target" style={{ borderRadius: '10px' }} />
        </Form.Item>

        <Form.Item
          name="price"
          label="Kurs narxi (Oylik summasi)"
          rules={[{ required: true, message: 'Kurs narxini kiriting!' }]}
        >
          <InputNumber
            size="large"
            placeholder="400000"
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
          Guruhni yaratish
        </Button>
      </Form>
    </Drawer>
  );
};

export default AddGroupDrawer;
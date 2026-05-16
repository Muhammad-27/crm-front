import { Drawer, Form, Input, Button } from 'antd';

const StudentDrawer = ({ open, onClose, form, onFinish, editingId }) => {
  return (
    <Drawer
      title={editingId ? "Ma'lumotni tahrirlash" : "Yangi o'quvchi qo'shish"}
      placement="right"
      width={window.innerWidth > 400 ? 400 : "100%"}
      onClose={onClose}
      open={open}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item name="name" label="Ism-sharifi" rules={[{ required: true, message: "Iltimos, ismni kiriting!" }]}>
          <Input placeholder="Masalan: Ali Valiyev" />
        </Form.Item>
        <Form.Item name="phone" label="Telefon raqami" rules={[{ required: true, message: "Iltimos, raqamni kiriting!" }]}>
          <Input placeholder="+998 90 123 45 67" />
        </Form.Item>
        <Form.Item name="fee" label="Oylik to'lov summasi (so'm)" rules={[{ required: true, message: "Iltimos, summani kiriting!" }]}>
          <Input type="number" placeholder="Masalan: 300000" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>Saqlash</Button>
        </Form.Item>
      </Form>
    </Drawer>
    
  );
};

export default StudentDrawer;
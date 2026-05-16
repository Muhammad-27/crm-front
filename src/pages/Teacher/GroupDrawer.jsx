import { Drawer, Form, Input, Button } from 'antd';

const GroupDrawer = ({ open, onClose, form, onFinish }) => {
  return (
    <Drawer
      title="Yangi guruh yaratish"
      placement="right"
      width={window.innerWidth > 400 ? 400 : "100%"}
      onClose={onClose}
      open={open}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item 
          name="name" 
          label="Guruh nomi" 
          rules={[{ required: true, message: "Iltimos, guruh nomini kiriting!" }]}
        >
          <Input placeholder="Masalan: Ingliz tili - Beginner (14:00)" size="large" />
        </Form.Item>
        
        <Form.Item 
          name="price" 
          label="Guruh uchun oylik to'lov (so'm)" 
        >
          <Input type="number" placeholder="Masalan: 300000" size="large" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block size="large" style={{ borderRadius: '10px' }}>
            Guruhni saqlash
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default GroupDrawer;
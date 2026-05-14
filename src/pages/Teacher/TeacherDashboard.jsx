import { List, Avatar, Skeleton, Input, Button, Tag, Card, Row, Col, Statistic, Drawer, Form, message, Popconfirm } from 'antd';
import { useState, useEffect } from 'react';
import axios from 'axios';

const TeacherDashboard = () => {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  
  // Tahrirlanayotgan o'quvchi ID sini saqlash uchun
  const [editingId, setEditingId] = useState(null);

  const TEACHER_ID = "7964049050"; 
  const API_URL = "https://crm-8yhf.onrender.com";

  // Pullarni chiroyli qilib (masalan: 300 000 so'm) ko'rsatuvchi funksiya
  const formatMoney = (amount) => {
    return new Intl.NumberFormat('ru-RU').format(amount) + " so'm";
  };

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/get-students/${TEACHER_ID}`);
      setStudents(response.data);
    } catch (error) {
      message.error("Ma'lumotlarni yuklashda xatolik yuz berdi!");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Yangi qo'shish uchun drawerni ochish
  const showDrawerForAdd = () => {
    setEditingId(null);
    form.resetFields();
    setOpen(true);
  };

  // Tahrirlash uchun drawerni ochish va ichiga ma'lumotlarni joylash
  const showDrawerForEdit = (student) => {
    setEditingId(student.id);
    form.setFieldsValue({
      name: student.name,
      phone: student.phone,
      fee: student.fee
    });
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  // Saqlash tugmasi (Qo'shish yoki Tahrirlash)
  const onFinish = async (values) => {
    try {
      if (editingId) {
        // Tahrirlash (PUT)
        await axios.put(`${API_URL}/edit-student/${editingId}`, {
          name: values.name,
          phone: values.phone,
          fee: Number(values.fee)
        });
        message.success("Ma'lumot muvaffaqiyatli yangilandi!");
      } else {
        // Yangi qo'shish (POST)
        await axios.post(`${API_URL}/add-student`, {
          teacher_id: TEACHER_ID,
          name: values.name,
          phone: values.phone,
          fee: Number(values.fee)
        });
        message.success("O'quvchi muvaffaqiyatli qo'shildi!");
      }
      form.resetFields(); 
      setOpen(false); 
      fetchStudents(); 
    } catch (error) {
      message.error("Saqlashda xatolik yuz berdi!");
    }
  };

  // To'lov qabul qilish
  const handlePayment = async (studentId) => {
    try {
      await axios.put(`${API_URL}/pay/${studentId}`);
      message.success("To'lov muvaffaqiyatli qabul qilindi!");
      fetchStudents();
    } catch (error) {
      message.error("To'lovni amalga oshirishda xatolik!");
    }
  };

  // O'quvchini o'chirish
  const handleDelete = async (studentId) => {
    try {
      await axios.delete(`${API_URL}/delete-student/${studentId}`);
      message.success("O'quvchi o'chirildi!");
      fetchStudents();
    } catch (error) {
      message.error("O'chirishda xatolik!");
    }
  };

  // Qidiruv va Filtr
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchText.toLowerCase())
  );

  // Umumiy hisob-kitoblar (Jami tushum)
  const totalExpectedRevenue = students.reduce((sum, s) => sum + s.fee, 0);

  return (
    <div style={{ padding: '16px' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0 }}>Asosiy Panel</h2>
        <Button type="primary" onClick={showDrawerForAdd}>
          + Qo'shish
        </Button>
      </div>

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

      <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
        <Col xs={24} sm={8}>
          <Card size="small">
            <Statistic title="Jami o'quvchilar" value={students.length} />
          </Card>
        </Col>
        <Col xs={12} sm={8}>
          <Card size="small">
            <Statistic title="To'laganlar" value={students.filter(s => s.isPaid).length} valueStyle={{ color: '#3f8600' }} />
          </Card>
        </Col>
        <Col xs={12} sm={8}>
          <Card size="small">
            {/* Jami pulni ko'rsatadigan yangi qism */}
            <Statistic title="Jami kutilayotgan tushum" value={formatMoney(totalExpectedRevenue)} valueStyle={{ fontSize: '16px', fontWeight: 'bold' }} />
          </Card>
        </Col>
      </Row>

      <Input.Search 
        placeholder="Ism bo'yicha qidirish..." 
        style={{ width: '100%', marginBottom: '20px' }} 
        onChange={(e) => setSearchText(e.target.value)} 
      />

      <h3 style={{ marginTop: '10px' }}>O'quvchilar ro'yxati</h3>
      <List
        className="demo-loadmore-list"
        itemLayout="horizontal"
        dataSource={filteredStudents}
        loading={loading}
        renderItem={(item) => (
          <List.Item
            actions={[
              <a key="payment" style={{ fontSize: '12px', color: '#52c41a' }} onClick={() => handlePayment(item.id)}>💳 To'lov</a>,
              <a key="edit" style={{ fontSize: '12px' }} onClick={() => showDrawerForEdit(item)}>✏️ Tahrir</a>,
              <Popconfirm
                title="Rostdan ham o'chirasizmi?"
                onConfirm={() => handleDelete(item.id)}
                okText="Ha"
                cancelText="Yo'q"
              >
                <a key="delete" style={{ fontSize: '12px', color: 'red' }}>🗑️ O'chirish</a>
              </Popconfirm>
            ]}
          >
           <Skeleton avatar title={false} loading={false} active>
              <List.Item.Meta
                avatar={<Avatar src={item.avatar} />}
                title={
                  <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                    {/* Asosiy matn rangi Telegram rejimiga moslashadi */}
                    <span style={{ fontWeight: 'bold', color: 'var(--tg-theme-text-color, #000)' }}>{item.name}</span>
                    {item.isPaid ? (
                      <Tag color="green" style={{ margin: 0 }}>To'lagan</Tag>
                    ) : (
                      <Tag color="red" style={{ margin: 0 }}>Qarzi bor</Tag>
                    )}
                    {/* Qo'shimcha matn rangi (kulrangroq) */}
                    <span style={{ fontSize: '12px', color: 'var(--tg-theme-hint-color, gray)' }}>({formatMoney(item.fee)})</span>
                  </div>
                }
                description={<span style={{ fontSize: '12px', color: 'var(--tg-theme-hint-color, gray)' }}>{item.phone}</span>}
              />
            </Skeleton>
          </List.Item>
        )}
      />
    </div>
  );
};

export default TeacherDashboard;
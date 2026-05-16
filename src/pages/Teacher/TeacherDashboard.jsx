import { Input, Row, Col, Form, message, Modal, Card } from 'antd';
import { HomeOutlined, PlusOutlined, AppstoreOutlined } from '@ant-design/icons';
import { useState } from 'react';

// Yangi Guruh komponentlari
import GroupDrawer from '../Teacher/GroupDrawer.jsx';
import GroupList from '../Teacher/GroupList.jsx';

const TeacherDashboard = () => {
  const [openGroupDrawer, setOpenGroupDrawer] = useState(false);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  
  const [isLockedModalVisible, setIsLockedModalVisible] = useState(false);

  // VAQTINCHALIK (DUMMY) GURUHLAR BAZASI (Backend ulanmaguncha)
  const [groups, setGroups] = useState([
    { id: 1, name: "IELTS Intensive (14:00)", studentCount: 12, expectedRevenue: 3600000 },
    { id: 2, name: "General English (16:00)", studentCount: 8, expectedRevenue: 2400000 },
  ]);

  const formatMoney = (amount) => {
    return new Intl.NumberFormat('ru-RU').format(amount) + " so'm";
  };

  // Yangi guruh qo'shish funksiyasi (Hozircha faqat UI da qo'shiladi)
  const onFinishGroup = (values) => {
    const newGroup = {
      id: Date.now(),
      name: values.name,
      studentCount: 0,
      expectedRevenue: 0
    };
    setGroups([...groups, newGroup]);
    form.resetFields();
    setOpenGroupDrawer(false);
    message.success("Yangi guruh yaratildi!");
  };

  // Guruh ichiga kirish tugmasi bosilganda
  const handleOpenGroup = (groupId, groupName) => {
    message.info(`Siz ${groupName} guruhiga kirdingiz! (Keyingi qadamda shu sahifani yasiymiz)`);
  };

  const filteredGroups = groups.filter(g => g.name.toLowerCase().includes(searchText.toLowerCase()));
  const totalExpectedRevenue = groups.reduce((sum, g) => sum + g.expectedRevenue, 0);
  const totalStudents = groups.reduce((sum, g) => sum + g.studentCount, 0);

  return (
    <div style={{ backgroundColor: '#f5f7fa', minHeight: '100vh', paddingBottom: '60px' }}>
      
      {/* 1. HEADER */}
      <div style={{ padding: '20px 20px 10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', borderBottom: '1px solid #eee' }}>
        <h2 style={{ margin: 0, fontWeight: 900, color: '#1677ff' }}>EduTrack</h2>
        <span style={{ color: 'gray', fontWeight: 500 }}>Guruhlar</span>
      </div>

      <div style={{ padding: '20px' }}>
        {/* 2. SEARCH BAR */}
        <Input.Search 
          placeholder="Guruh izlash..." 
          size="large"
          style={{ width: '100%', marginBottom: '20px' }} 
          onChange={(e) => setSearchText(e.target.value)} 
        />

        {/* 3. ASOSIY STATISTIKA */}
        <Card style={{ marginBottom: '16px', borderRadius: '20px', background: 'linear-gradient(135deg, #1677ff 0%, #722ed1 100%)', color: 'white', border: 'none', boxShadow: '0 10px 20px rgba(22,119,255,0.2)' }}>
          <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '5px' }}>Jami kutilayotgan tushum</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{formatMoney(totalExpectedRevenue)}</div>
        </Card>

        {/* 4. IKKITA KICHIK QUTI (Guruhlar va Jami o'quvchilar) */}
        <Row gutter={16} style={{ marginBottom: '24px' }}>
          <Col span={12}>
            <Card style={{ borderRadius: '20px', textAlign: 'center', border: '1px solid #91caff', backgroundColor: '#e6f4ff' }} bodyStyle={{ padding: '16px' }}>
              <div style={{ fontSize: '12px', color: '#1677ff', fontWeight: 'bold' }}>Faol Guruhlar</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#0958d9' }}>{groups.length}</div>
            </Card>
          </Col>
          <Col span={12}>
            <Card style={{ borderRadius: '20px', textAlign: 'center', border: '1px solid #b7eb8f', backgroundColor: '#f6ffed' }} bodyStyle={{ padding: '16px' }}>
              <div style={{ fontSize: '12px', color: '#52c41a', fontWeight: 'bold' }}>Jami O'quvchilar</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#389e0d' }}>{totalStudents}</div>
            </Card>
          </Col>
        </Row>

        {/* 5. GURUHLAR RO'YXATI */}
        <h3 style={{ marginBottom: '16px', fontWeight: 'bold' }}>Sizning guruhlaringiz</h3>
        <GroupList groups={filteredGroups} onOpenGroup={handleOpenGroup} />
      </div>

      {/* GURUH QO'SHISH DRAWERI */}
      <GroupDrawer open={openGroupDrawer} onClose={() => setOpenGroupDrawer(false)} form={form} onFinish={onFinishGroup} />

      {/* 6. BOTTOM NAVIGATION */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: 'white', display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '10px 20px', paddingBottom: '25px', boxShadow: '0 -4px 20px rgba(0,0,0,0.08)', borderRadius: '30px 30px 0 0', zIndex: 1000 }}>
        <div style={{ textAlign: 'center', color: '#1677ff', cursor: 'pointer' }}>
          <HomeOutlined style={{ fontSize: '22px' }} />
          <div style={{ fontSize: '11px', fontWeight: 'bold', marginTop: '4px' }}>Guruhlar</div>
        </div>
        
        {/* O'rtadagi katta Qo'shish tugmasi ENDI GURUH QO'SHADI */}
        <div onClick={() => setOpenGroupDrawer(true)} style={{ width: '60px', height: '60px', backgroundColor: '#1677ff', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', marginTop: '-35px', boxShadow: '0 8px 20px rgba(22,119,255,0.4)', cursor: 'pointer', border: '4px solid white' }}>
          <PlusOutlined style={{ fontSize: '24px', fontWeight: 'bold' }} />
        </div>

        <div onClick={() => setIsLockedModalVisible(true)} style={{ textAlign: 'center', color: 'gray', cursor: 'pointer' }}>
          <AppstoreOutlined style={{ fontSize: '22px' }} />
          <div style={{ fontSize: '11px', fontWeight: 'bold', marginTop: '4px' }}>Menyu</div>
        </div>
      </div>

      <Modal title={<span>🚀 Katta yangilanishlar kutilyapti!</span>} open={isLockedModalVisible} onCancel={() => setIsLockedModalVisible(false)} footer={null}>
        <p>Yangi menyuda tez kunda: <b>Hisobotlar, SMS Xabarnoma va Davomat</b> tizimlari qo'shiladi!</p>
      </Modal>

    </div>
  );
};

export default TeacherDashboard;
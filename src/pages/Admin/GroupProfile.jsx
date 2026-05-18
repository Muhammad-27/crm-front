import { useState, useEffect } from 'react';
import { Button, Typography, Spin, message } from 'antd';
import { ArrowLeftOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';

// Eski o'quvchilar ro'yxati komponentingizni chaqiramiz (Manzilni o'zingizga moslang!)
import StudentList from '../Teacher/StudentList'; 
import AddStudentDrawer from '../../components/Admin/AddStudentDrawer';

const { Title, Text } = Typography;
const API_URL = "https://crm-project-0yio.onrender.com";

const GroupProfile = ({ groupId, groupName, onBack }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openAddDrawer, setOpenAddDrawer] = useState(false);

  // Shu guruhga tegishli o'quvchilarni tortib kelamiz
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/get-students/${groupId}`);
      setStudents(response.data);
    } catch (error) {
      message.error("O'quvchilarni yuklashda xatolik!");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStudents();
  }, [groupId]);

  // Hozircha bo'sh funksiyalar (Keyingi qadamda ularni ulaymiz)
  const handlePayment = (id) => message.info("To'lov qilish teeez orada ishlaydi! 💸");
  const showDrawerForEdit = (item) => message.info("Tahrirlash oynasi ochiladi ✏️");
  const handleDelete = (id) => message.info("O'chirish ishlaydi 🗑️");
  const formatMoney = (amount) => amount ? amount.toLocaleString('ru-RU') + " so'm" : "0 so'm";

  return (
    <div style={{ padding: '20px', paddingBottom: '80px', backgroundColor: '#f5f7fa', minHeight: '100vh' }}>
      
      {/* Orqaga qaytish va Sarlavha */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', gap: '15px' }}>
        <Button type="text" icon={<ArrowLeftOutlined style={{ fontSize: '20px' }} />} onClick={onBack} />
        <div>
          <Title level={4} style={{ margin: 0, color: '#262626' }}>{groupName}</Title>
          <Text type="secondary">Guruh o'quvchilari</Text>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', marginTop: '50px' }}><Spin size="large" /></div>
      ) : (
        <StudentList 
          filteredStudents={students} 
          loading={loading} 
          handlePayment={handlePayment} 
          showDrawerForEdit={showDrawerForEdit} 
          handleDelete={handleDelete} 
          formatMoney={formatMoney} 
        />
      )}

      {/* O'quvchi qo'shish tugmasi */}
     {/* O'quvchi qo'shish tugmasi */}
      <Button 
        type="primary" 
        shape="circle" 
        icon={<PlusOutlined />} 
        size="large"
        onClick={() => setOpenAddDrawer(true)} // ENDI OYNA OCHILADI
        // ... (qolgan style yozuvlari o'zgarishsiz qoladi)
        style={{
          position: 'fixed',
          bottom: '30px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '60px',
          height: '60px',
          fontSize: '24px',
          boxShadow: '0 4px 15px rgba(22, 119, 255, 0.4)',
          zIndex: 1000
        }}
      />
      {/* O'quvchi qo'shish oynasi */}
      <AddStudentDrawer 
        open={openAddDrawer} 
        onClose={() => setOpenAddDrawer(false)} 
        groupId={groupId} 
        fetchStudents={fetchStudents} 
      />
    </div>
    
    
  );
};

export default GroupProfile;
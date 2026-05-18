import { useState, useEffect } from 'react';
import { Spin, Button, Typography, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import axios from 'axios';

// Baya yozgan komponentlarimizni chaqiramiz
import TeacherList from '../../components/Admin/TeacherList';
// MANA SHU QATOR TO'G'IRLANDI 👇
import AddTeacherDrawer from '../../components/Admin/AddTeacherDrawer'; 
import TeacherProfile from './TeacherProfile';

const { Title } = Typography;
const API_URL = "https://crm-project-0yio.onrender.com";

const AdminDashboard = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openAddDrawer, setOpenAddDrawer] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null); // { id: 1, name: "Ali" }

  // Bazadan o'qituvchilarni tortib kelish
  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/get-teachers`);
      setTeachers(res.data);
    } catch (error) {
      message.error("O'qituvchilarni yuklashda xatolik!");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

 const handleOpenTeacher = (teacherId, teacherName) => {
    setSelectedTeacher({ id: teacherId, name: teacherName });
  };

 // Agar ustoz tanlangan bo'lsa, uning sahifasini ochamiz
  if (selectedTeacher) {
    return (
      <TeacherProfile 
        teacherId={selectedTeacher.id} 
        teacherName={selectedTeacher.name} 
        onBack={() => setSelectedTeacher(null)} 
      />
    );
  }

  // Aks holda, Asosiy oynani (O'qituvchilar ro'yxatini) ko'rsatamiz
  return (
    <div style={{ padding: '20px', paddingBottom: '80px', backgroundColor: '#f5f7fa', minHeight: '100vh' }}>
      <Title level={3} style={{ textAlign: 'center', marginBottom: '20px', color: '#262626' }}>
        🏢 O'quv Markazi
      </Title>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ margin: 0, fontWeight: 'bold', fontSize: '18px', color: '#262626' }}>Ustozlar ro'yxati</h3>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', marginTop: '50px' }}><Spin size="large" /></div>
      ) : (
        <TeacherList teachers={teachers} onOpenTeacher={handleOpenTeacher} />
      )}

      <AddTeacherDrawer open={openAddDrawer} onClose={() => setOpenAddDrawer(false)} fetchTeachers={fetchTeachers} />

      <Button 
        type="primary" shape="circle" icon={<PlusOutlined />} size="large"
        onClick={() => setOpenAddDrawer(true)}
        style={{ position: 'fixed', bottom: '30px', left: '50%', transform: 'translateX(-50%)', width: '60px', height: '60px', fontSize: '24px', boxShadow: '0 4px 15px rgba(22, 119, 255, 0.4)', zIndex: 1000 }}
      />
    </div>
    
  );
};

export default AdminDashboard;
import { useState, useEffect } from 'react';
import { Button, Typography, Spin, message, List, Avatar, Tag } from 'antd';
import { ArrowLeftOutlined, UserOutlined } from '@ant-design/icons';
import axios from 'axios';

// Davomat oynalarimiz
import AttendanceDrawer from '../Teacher/AttendanceDrawer'; // 🟢 DAVOMAT OYNASI
import AttendanceHistoryDrawer from '../Teacher/AttendanceHistoryDrawer';

const { Title, Text } = Typography;
const API_URL = "https://crm-project-0yio.onrender.com";

const TeacherGroupProfile = ({ groupId, groupName, onBack }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Davomat pultlari
  const [openAttendance, setOpenAttendance] = useState(false);
  const [openHistory, setOpenHistory] = useState(false);

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

  return (
    <div style={{ padding: '20px', paddingBottom: '80px', backgroundColor: '#f5f7fa', minHeight: '100vh' }}>
      
      {/* Sarlavha va Orqaga qaytish */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <Button type="text" icon={<ArrowLeftOutlined style={{ fontSize: '20px' }} />} onClick={onBack} />
          <div>
            <Title level={4} style={{ margin: 0, color: '#262626' }}>{groupName}</Title>
            <Text type="secondary">Guruh o'quvchilari</Text>
          </div>
        </div>
        
        {/* Davomat va Tarix tugmalari */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button type="default" style={{ borderRadius: '8px' }} onClick={() => setOpenHistory(true)}>
            🕒 Tarix
          </Button>
          <Button type="primary" style={{ borderRadius: '8px', backgroundColor: '#52c41a' }} onClick={() => setOpenAttendance(true)}>
            📅 Davomat
          </Button>
        </div>
      </div>

      {/* O'quvchilar ro'yxati (Faqat ko'rish uchun, Tahrirlash/O'chirish tugmalarisiz) */}
      {loading ? (
        <div style={{ textAlign: 'center', marginTop: '50px' }}><Spin size="large" /></div>
      ) : (
        <List
          dataSource={students}
          locale={{ emptyText: "Bu guruhda hali o'quvchilar yo'q" }}
          renderItem={(item) => (
            <div style={{ 
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
              backgroundColor: '#ffffff', padding: '16px', marginBottom: '10px', 
              borderRadius: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' 
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <Avatar style={{ backgroundColor: '#1677ff' }} icon={<UserOutlined />} />
                <div>
                  <Text style={{ fontSize: '16px', fontWeight: 'bold', display: 'block' }}>{item.name}</Text>
                  <Text style={{ color: '#8c8c8c', fontSize: '13px' }}>{item.phone}</Text>
                </div>
              </div>
              
              {/* To'lov holatini ko'rsatish (Lekin o'zgartira olmaydi) */}
              {item.isPaid ? (
                <Tag color="green" style={{ borderRadius: '10px' }}>To'lagan</Tag>
              ) : (
                <Tag color="red" style={{ borderRadius: '10px' }}>Qarzi bor</Tag>
              )}
            </div>
          )}
        />
      )}

      {/* Oynalar */}
      <AttendanceDrawer 
        open={openAttendance} 
        onClose={() => setOpenAttendance(false)} 
        groupId={groupId} 
        students={students} 
      />

      <AttendanceHistoryDrawer 
        open={openHistory} 
        onClose={() => setOpenHistory(false)} 
        groupId={groupId} 
        students={students} 
      />
    </div>
  );
};

export default TeacherGroupProfile;
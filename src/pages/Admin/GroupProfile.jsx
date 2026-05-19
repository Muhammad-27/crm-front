import { useState, useEffect } from 'react';
import { Button, Typography, Spin, message } from 'antd';
import { ArrowLeftOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';

import StudentList from '../Teacher/StudentList'; 
import AddStudentDrawer from '../../components/Admin/AddStudentDrawer';
import EditStudentDrawer from '../../components/Admin/EditStudentDrawer';
import AttendanceDrawer from '../Teacher/AttendanceDrawer'; // Faqat bitta toza import!

const { Title, Text } = Typography;
const API_URL = "https://crm-project-0yio.onrender.com";

const GroupProfile = ({ groupId, groupName, onBack }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openAddDrawer, setOpenAddDrawer] = useState(false);
  
  const [openEditDrawer, setOpenEditDrawer] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  
  const [openAttendance, setOpenAttendance] = useState(false);

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

  const handleDelete = async (studentId) => {
    try {
      await axios.delete(`${API_URL}/delete-student/${studentId}`);
      message.success("O'quvchi muvaffaqiyatli o'chirildi! 🗑️");
      fetchStudents(); 
    } catch (error) {
      message.error("O'chirishda xatolik yuz berdi!");
    }
  };

  const handlePayment = async (studentId) => {
    try {
      await axios.put(`${API_URL}/pay-student/${studentId}`);
      message.success("To'lov holati o'zgardi! 💸");
      fetchStudents(); 
    } catch (error) {
      message.error("To'lovni amalga oshirishda xatolik!");
    }
  };

  const showDrawerForEdit = (student) => {
    setEditingStudent(student);
    setOpenEditDrawer(true);
  };

  const formatMoney = (amount) => amount ? amount.toLocaleString('ru-RU') + " so'm" : "0 so'm";

  return (
    <div style={{ padding: '20px', paddingBottom: '80px', backgroundColor: '#f5f7fa', minHeight: '100vh' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <Button type="text" icon={<ArrowLeftOutlined style={{ fontSize: '20px' }} />} onClick={onBack} />
          <div>
            <Title level={4} style={{ margin: 0, color: '#262626' }}>{groupName}</Title>
            <Text type="secondary">Guruh o'quvchilari</Text>
          </div>
        </div>
        
        <Button 
          type="primary" 
          size="middle" 
          style={{ borderRadius: '8px', backgroundColor: '#52c41a' }} 
          onClick={() => setOpenAttendance(true)}
        >
          📅 Davomat
        </Button>
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

      <Button 
        type="primary" 
        shape="circle" 
        icon={<PlusOutlined />} 
        size="large"
        onClick={() => setOpenAddDrawer(true)} 
        style={{ position: 'fixed', bottom: '30px', left: '50%', transform: 'translateX(-50%)', width: '60px', height: '60px', fontSize: '24px', boxShadow: '0 4px 15px rgba(22, 119, 255, 0.4)', zIndex: 1000 }}
      />
      
      <AddStudentDrawer 
        open={openAddDrawer} 
        onClose={() => setOpenAddDrawer(false)} 
        groupId={groupId} 
        fetchStudents={fetchStudents} 
      />

      <EditStudentDrawer 
        open={openEditDrawer} 
        onClose={() => setOpenEditDrawer(false)} 
        studentData={editingStudent} 
        fetchStudents={fetchStudents} 
      />

      <AttendanceDrawer 
        open={openAttendance} 
        onClose={() => setOpenAttendance(false)} 
        groupId={groupId} 
        students={students} 
      />
    </div>
  );
};

export default GroupProfile;
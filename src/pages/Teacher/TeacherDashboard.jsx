import { Input, Row, Col, Form, message, Modal, Card, Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import axios from 'axios';

// Yordamchi Komponentlar
import AttendanceDrawer from '../Teacher/AttendanceDrawer.jsx';
import GroupDrawer from '../Teacher/GroupDrawer.jsx';
import GroupList from '../Teacher/GroupList.jsx';
import StudentDrawer from '../Teacher/StudentDrawer.jsx';
import StudentList from '../Teacher/StudentList.jsx';
import TeacherBottomNav from '../Teacher/TeacherBottomNav.jsx';
import AttendanceHistoryDrawer from '../Teacher/AttendanceHistoryDrawer.jsx';
import GroupProfile from './GroupProfile';

const TeacherDashboard = () => {
  // --- UMUMIY STATE ---
  const TEACHER_ID = "7964049050"; 
  const API_URL = "https://crm-project-0yio.onrender.com"; // Haqiqiy Render manzilingiz
  const [searchText, setSearchText] = useState("");
  const [isLockedModalVisible, setIsLockedModalVisible] = useState(false);

  // --- GURUHLAR UCHUN STATE ---
  const [groups, setGroups] = useState([]);
  const [openGroupDrawer, setOpenGroupDrawer] = useState(false);
  const [groupForm] = Form.useForm();

  // --- O'QUVCHILAR (GURUH ICHI) UCHUN STATE ---
  const [currentGroupId, setCurrentGroupId] = useState(null);
  const [currentGroupName, setCurrentGroupName] = useState("");
  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [openStudentDrawer, setOpenStudentDrawer] = useState(false);
  const [studentForm] = Form.useForm();
  const [editingStudentId, setEditingStudentId] = useState(null);
  const [openAttendanceDrawer, setOpenAttendanceDrawer] = useState(false);
  const [initialPresentIds, setInitialPresentIds] = useState([]);
  const [openHistoryDrawer, setOpenHistoryDrawer] = useState(false);


  const formatMoney = (amount) => {
    return new Intl.NumberFormat('ru-RU').format(amount) + " so'm";
  };

  // ==============================
  // 1. GURUHLAR MANTIQI
  // ==============================
  const fetchGroups = async () => {
    try {
      const response = await axios.get(`${API_URL}/get-groups/${TEACHER_ID}`);
      setGroups(response.data);
    } catch (error) {
      message.error("Guruhlarni yuklashda xatolik!");
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const onFinishGroup = async (values) => {
    try {
      await axios.post(`${API_URL}/add-group`, {
        teacher_id: TEACHER_ID,
        name: values.name,
        price: Number(values.price || 0)
      });
      message.success("Yangi guruh yaratildi!");
      groupForm.resetFields();
      setOpenGroupDrawer(false);
      fetchGroups(); 
    } catch (error) {
      message.error("Xatolik yuz berdi!");
    }
  };

  // ==============================
  // 2. O'QUVCHILAR MANTIQI (Guruhga kirganda)
  // ==============================
  const handleOpenGroup = (groupId, groupName) => {
    setCurrentGroupId(groupId); // Guruh ichiga kirdik!
    setCurrentGroupName(groupName);
    fetchStudents(groupId);
    setSearchText(""); 
  };

  const handleBackToGroups = () => {
    setCurrentGroupId(null); // Orqaga qaytdik!
    setCurrentGroupName("");
    setSearchText("");
    fetchGroups(); // Qaytganimizda guruhlar statistikasi yangilanishi uchun
  };

  const fetchStudents = async (groupId) => {
    setLoadingStudents(true);
    try {
      const response = await axios.get(`${API_URL}/get-students/${groupId}`);
      setStudents(response.data);
    } catch (error) {
      message.error("O'quvchilarni yuklashda xatolik!");
    }
    setLoadingStudents(false);
  };

  const showAddStudentDrawer = () => {
    setEditingStudentId(null);
    studentForm.resetFields();
    setOpenStudentDrawer(true);
  };

  const showEditStudentDrawer = (student) => {
    setEditingStudentId(student.id);
    studentForm.setFieldsValue({ name: student.name, phone: student.phone, fee: student.fee });
    setOpenStudentDrawer(true);
  };

  const onFinishStudent = async (values) => {
    try {
      if (editingStudentId) {
        await axios.put(`${API_URL}/edit-student/${editingStudentId}`, { ...values, fee: Number(values.fee) });
        message.success("Yangilandi!");
      } else {
        await axios.post(`${API_URL}/add-student`, { 
          teacher_id: TEACHER_ID, 
          group_id: currentGroupId, 
          ...values, 
          fee: Number(values.fee) 
        });
        message.success("O'quvchi qo'shildi!");
      }
      studentForm.resetFields(); 
      setOpenStudentDrawer(false); 
      fetchStudents(currentGroupId); 
    } catch (error) {
      message.error("Xatolik yuz berdi!");
    }
  };

  const handlePayment = async (studentId) => {
    try {
      await axios.put(`${API_URL}/pay/${studentId}`);
      message.success("To'lov qabul qilindi!"); 
      fetchStudents(currentGroupId);
    } catch (error) { message.error("Xatolik!"); }
  };

  const handleDeleteStudent = async (studentId) => {
    try {
      await axios.delete(`${API_URL}/delete-student/${studentId}`);
      message.success("O'chirildi!"); 
      fetchStudents(currentGroupId);
    } catch (error) { message.error("Xatolik!"); }
  };

const handleDeleteGroup = async (groupId) => {
    try {
      await axios.delete(`${API_URL}/delete-group/${groupId}`);
      message.success("Guruh va uning o'quvchilari o'chirildi!"); 
      fetchGroups(); // Ro'yxatni yangilaymiz
    } catch (error) { message.error("Xatolik yuz berdi!"); }
  };

 const handleSaveAttendance = async (presentIds) => {
    try {
      // Bugungi sanani 'YYYY-MM-DD' formatida olamiz (masalan: "2026-05-17")
      const today = new Date().toISOString().split('T')[0];

      // API ga ma'lumotni jo'natamiz
      await axios.post(`${API_URL}/save-attendance`, {
        group_id: currentGroupId,
        date: today,
        present_ids: presentIds
      });

      message.success(`${presentIds.length} ta o'quvchi davomati bazaga saqlandi! ✅`);
      setOpenAttendanceDrawer(false);
    } catch (error) {
      message.error("Davomatni saqlashda xatolik yuz berdi!");
    }
  };

  const handleOpenAttendance = async () => {
    try {
      const today = new Date().toISOString().split('T')[0]; // Bugungi sana
      
      // Bazadan bugungi davomatni so'raymiz
      const response = await axios.get(`${API_URL}/get-attendance/${currentGroupId}?date=${today}`);
      
      // Kelgan javobni (masalan [1, 2]) xotiraga yozamiz
      setInitialPresentIds(response.data); 
    } catch (error) {
      // Agar topolmasa, xotirani bo'shatamiz
      setInitialPresentIds([]); 
    }
    
    // Xotira tayyor bo'lgach, oynani ochamiz!
    setOpenAttendanceDrawer(true);
  };

  // ==============================
  // QIDIRUV VA HISOB-KITOB
  // ==============================
  const filteredGroups = groups.filter(g => g.name.toLowerCase().includes(searchText.toLowerCase()));
  const filteredStudents = students.filter(s => s.name.toLowerCase().includes(searchText.toLowerCase()));

  const totalExpectedRevenue = groups.reduce((sum, g) => sum + g.expectedRevenue, 0);
  const totalStudentsCount = groups.reduce((sum, g) => sum + g.studentCount, 0);

  const groupExpectedRevenue = students.reduce((sum, s) => sum + s.fee, 0);
  const paidCount = students.filter(s => s.isPaid).length;

  return (
    <div style={{ backgroundColor: '#f5f7fa', minHeight: '100vh', paddingBottom: '80px' }}>
      
      {/* 1. HEADER (Dinamik) */}
      <div style={{ padding: '20px 20px 10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', borderBottom: '1px solid #eee' }}>
        {currentGroupId === null ? (
          <>
            <h2 style={{ margin: 0, fontWeight: 900, color: '#1677ff' }}>EduTrack</h2>
            <span style={{ color: 'gray', fontWeight: 500 }}>Guruhlar</span>
          </>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <Button type="text" icon={<ArrowLeftOutlined />} onClick={handleBackToGroups} style={{ padding: 0, fontSize: '20px', color: '#1677ff' }} />
            <h3 style={{ margin: 0, fontWeight: 'bold' }}>{currentGroupName}</h3>
          </div>
        )}
      </div>

      <div style={{ padding: '20px' }}>
        <Input.Search 
          placeholder={currentGroupId === null ? "Guruh izlash..." : "O'quvchi izlash..."} 
          size="large"
          style={{ width: '100%', marginBottom: '20px' }} 
          onChange={(e) => setSearchText(e.target.value)} 
          value={searchText}
        />

        {/* EKRAN 1: GURUHLAR RO'YXATI */}
        {currentGroupId === null ? (
          <>
            <Card style={{ marginBottom: '16px', borderRadius: '20px', background: 'linear-gradient(135deg, #1677ff 0%, #722ed1 100%)', color: 'white', border: 'none', boxShadow: '0 10px 20px rgba(22,119,255,0.2)' }}>
              <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '5px' }}>Jami kutilayotgan tushum</div>
              <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{formatMoney(totalExpectedRevenue)}</div>
            </Card>

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
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#389e0d' }}>{totalStudentsCount}</div>
                </Card>
              </Col>
            </Row>

            <h3 style={{ marginBottom: '16px', fontWeight: 'bold' }}>Sizning guruhlaringiz</h3>
            {groups.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'gray', padding: '20px' }}>Hali guruhlar yo'q. Pastdagi + tugmasini bosib birinchi guruhingizni yarating!</div>
            ) : (
              <GroupList groups={filteredGroups} onOpenGroup={handleOpenGroup} onDeleteGroup={handleDeleteGroup} />
            )}
          </>
        ) : (
        /* EKRAN 2: O'QUVCHILAR RO'YXATI */
          <>
            <Card style={{ marginBottom: '16px', borderRadius: '20px', background: 'linear-gradient(135deg, #52c41a 0%, #13c2c2 100%)', color: 'white', border: 'none', boxShadow: '0 10px 20px rgba(82,196,26,0.2)' }}>
              <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '5px' }}>Guruh kutilayotgan tushumi</div>
              <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{formatMoney(groupExpectedRevenue)}</div>
            </Card>

            <Row gutter={16} style={{ marginBottom: '24px' }}>
              <Col span={12}>
                <Card style={{ borderRadius: '20px', textAlign: 'center', border: '1px solid #b7eb8f', backgroundColor: '#f6ffed' }} bodyStyle={{ padding: '16px' }}>
                  <div style={{ fontSize: '12px', color: '#52c41a', fontWeight: 'bold' }}>To'laganlar</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#389e0d' }}>{paidCount}</div>
                </Card>
              </Col>
              <Col span={12}>
                <Card style={{ borderRadius: '20px', textAlign: 'center', border: '1px solid #ffa39e', backgroundColor: '#fff1f0' }} bodyStyle={{ padding: '16px' }}>
                  <div style={{ fontSize: '12px', color: '#f5222d', fontWeight: 'bold' }}>Qarzdorlar</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#cf1322' }}>{students.length - paidCount}</div>
                </Card>
              </Col>
            </Row>

{/* O'quvchilar Sarlavhasi va Davomat tugmalari */}
<div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
  
  {/* Sarlavha shriftini biroz kichraytiramiz va joy ajratamiz */}
  <h3 style={{ margin: 0, fontWeight: 'bold', fontSize: '18px', minWidth: '150px' }}>O'quvchilar ro'yxati</h3>
  
  <div style={{ display: 'flex', gap: '8px' }}>
    <Button 
      onClick={() => setOpenHistoryDrawer(true)}
      style={{ borderRadius: '10px', fontWeight: 'bold', border: '1px solid #1677ff', color: '#1677ff' }}
    >
      🗓️ Tarix
    </Button>
    
    {/* Joy tejash uchun "Olish" so'zini olib tashladik, shusiz ham ma'nosi tushunarli */}
    <Button 
      type="primary" 
      onClick={handleOpenAttendance}
      style={{ backgroundColor: '#52c41a', borderRadius: '10px', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(82,196,26,0.3)' }}
    >
      ✅ Davomat
    </Button>
  </div>
</div>
       

            {students.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'gray', padding: '20px' }}>Bu guruhda hali o'quvchilar yo'q. Pastdagi + tugmasi orqali qo'shing.</div>
            ) : (
              <StudentList 
                filteredStudents={filteredStudents} loading={loadingStudents} handlePayment={handlePayment} 
                showDrawerForEdit={showEditStudentDrawer} handleDelete={handleDeleteStudent} formatMoney={formatMoney}
              />
            )}
          </>
        )}
      </div>

      {/* DRAWERLAR */}
      <GroupDrawer open={openGroupDrawer} onClose={() => setOpenGroupDrawer(false)} form={groupForm} onFinish={onFinishGroup} />
      <StudentDrawer open={openStudentDrawer} onClose={() => setOpenStudentDrawer(false)} form={studentForm} onFinish={onFinishStudent} editingId={editingStudentId} />
      {/* Eskisi: <AttendanceDrawer open={openAttendanceDrawer} ... /> */}
<AttendanceDrawer 
  open={openAttendanceDrawer} 
  onClose={() => setOpenAttendanceDrawer(false)} 
  students={students} 
  onSave={handleSaveAttendance}
  initialPresentIds={initialPresentIds} 
/>

      {/* TEPADAGI XATO SHU YERDA EDI. Bottom Nav qo'shildi! */}
      <TeacherBottomNav 
        currentGroupId={currentGroupId}
        onBackToGroups={handleBackToGroups}
        onAddClick={() => currentGroupId === null ? setOpenGroupDrawer(true) : showAddStudentDrawer()}
        onMenuClick={() => setIsLockedModalVisible(true)}
      />
{/* YANGI: Tarix Oynasi */}
      <AttendanceHistoryDrawer 
        open={openHistoryDrawer} 
        onClose={() => setOpenHistoryDrawer(false)} 
        groupId={currentGroupId} 
        students={students} 
      />

      <Modal title={<span>🚀 Katta yangilanishlar kutilyapti!</span>} open={isLockedModalVisible} onCancel={() => setIsLockedModalVisible(false)} footer={null}>
        <p>Yangi menyuda tez kunda: <b>Hisobotlar, SMS Xabarnoma </b> tizimlari qo'shiladi!</p>
      </Modal>

    </div>
  );
};

export default TeacherDashboard;
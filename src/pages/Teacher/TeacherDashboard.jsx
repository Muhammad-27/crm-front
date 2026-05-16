import { Input, Row, Col, Form, message, Modal, Card, Button } from 'antd';
import { HomeOutlined, PlusOutlined, AppstoreOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import axios from 'axios';

// Yordamchi Komponentlar
import GroupDrawer from '../Teacher/GroupDrawer.jsx';
import GroupList from '../Teacher/GroupList.jsx';
import StudentDrawer from '../Teacher/StudentDrawer.jsx';
import StudentList from '../Teacher/StudentList.jsx';

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
          group_id: currentGroupId, // Aynan qaysi guruhdaligini yuboramiz
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

        {/* =========================================================
            EKRAN 1: GURUHLAR RO'YXATI (Agar guruhga kirmagan bo'lsa)
            ========================================================= */}
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
              <GroupList groups={filteredGroups} onOpenGroup={handleOpenGroup} />
            )}
          </>
        ) : (
        /* =========================================================
           EKRAN 2: O'QUVCHILAR RO'YXATI (Agar guruh ichiga kirgan bo'lsa)
           ========================================================= */
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

            <h3 style={{ marginBottom: '16px', fontWeight: 'bold' }}>O'quvchilar ro'yxati</h3>
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

      {/* Ikkita har xil oynalar (Drawerlar) */}
      <GroupDrawer open={openGroupDrawer} onClose={() => setOpenGroupDrawer(false)} form={groupForm} onFinish={onFinishGroup} />
      <StudentDrawer open={openStudentDrawer} onClose={() => setOpenStudentDrawer(false)} form={studentForm} onFinish={onFinishStudent} editingId={editingStudentId} />

      {/* BOTTOM NAVIGATION (Juda aqlli menyu) */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: 'white', display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '10px 20px', paddingBottom: '25px', boxShadow: '0 -4px 20px rgba(0,0,0,0.08)', borderRadius: '30px 30px 0 0', zIndex: 1000 }}>
        
        <div onClick={handleBackToGroups} style={{ textAlign: 'center', color: currentGroupId === null ? '#1677ff' : 'gray', cursor: 'pointer' }}>
          <HomeOutlined style={{ fontSize: '22px' }} />
          <div style={{ fontSize: '11px', fontWeight: 'bold', marginTop: '4px' }}>Guruhlar</div>
        </div>
        
        {/* + TUGMASI: Qaysi ekranda bo'lsa, rangi va vazifasi o'zgaradi */}
        <div 
          onClick={() => currentGroupId === null ? setOpenGroupDrawer(true) : showAddStudentDrawer()} 
          style={{ width: '60px', height: '60px', backgroundColor: currentGroupId === null ? '#1677ff' : '#52c41a', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', marginTop: '-35px', boxShadow: currentGroupId === null ? '0 8px 20px rgba(22,119,255,0.4)' : '0 8px 20px rgba(82,196,26,0.4)', cursor: 'pointer', border: '4px solid white', transition: '0.3s' }}
        >
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
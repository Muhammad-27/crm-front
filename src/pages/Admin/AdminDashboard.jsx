import { useState, useEffect } from 'react';
import { Spin, Button, Typography, message, Row, Col, Card, Statistic } from 'antd';
import { PlusOutlined, ArrowUpOutlined, TeamOutlined, UserOutlined, DollarOutlined } from '@ant-design/icons';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

import TeacherList from '../../components/Admin/TeacherList';
import AddTeacherDrawer from '../../components/Admin/AddTeacherDrawer'; 
import EditTeacherDrawer from '../../components/Admin/EditTeacherDrawer';
import TeacherProfile from './TeacherProfile';

const { Title } = Typography;
const API_URL = "https://crm-project-0yio.onrender.com";

const AdminDashboard = () => {
  const [teachers, setTeachers] = useState([]);
  const [stats, setStats] = useState({ total_teachers: 0, total_students: 0, expected_revenue: 0, collected_revenue: 0 });
  const [loading, setLoading] = useState(false);
  
  const [openAddDrawer, setOpenAddDrawer] = useState(false);
  const [openEditDrawer, setOpenEditDrawer] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Ham ustozlarni, ham statistikanini birdaniga tortib kelamiz
      const [teachersRes, statsRes] = await Promise.all([
        axios.get(`${API_URL}/get-teachers`),
        axios.get(`${API_URL}/get-stats`)
      ]);
      setTeachers(teachersRes.data);
      setStats(statsRes.data);
    } catch (error) {
      message.error("Ma'lumotlarni yuklashda xatolik!");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteTeacher = async (teacherId) => {
    try {
      await axios.delete(`${API_URL}/delete-teacher/${teacherId}`);
      message.success("Ustoz o'chirildi! 🗑️");
      fetchData(); 
    } catch (error) {
      message.error("Xatolik yuz berdi!");
    }
  };

  // Grafik uchun ma'lumotlar (Oxirgi oylar + Haqiqiy bazadagi joriy oy)
  const chartData = [
    { name: 'Yanvar', tushum: 2000000 },
    { name: 'Fevral', tushum: 3500000 },
    { name: 'Mart', tushum: 4000000 },
    { name: 'Aprel', tushum: 6500000 },
    { name: 'May', tushum: stats.expected_revenue }, // Hozirgi oy bazadan keladi
  ];

  if (selectedTeacher) {
    return <TeacherProfile teacherId={selectedTeacher.id} teacherName={selectedTeacher.name} onBack={() => setSelectedTeacher(null)} />;
  }

  return (
    <div style={{ padding: '20px', paddingBottom: '80px', backgroundColor: '#f5f7fa', minHeight: '100vh' }}>
      <Title level={3} style={{ marginBottom: '20px', color: '#262626' }}>
        📊 Boshqaruv Paneli
      </Title>

      {/* 🟢 TEPADAGI KATTA STATISTIKA KARTALARI */}
      <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
        <Col span={12}>
          <Card bordered={false} style={{ borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <Statistic title="Jami Ustozlar" value={stats.total_teachers} prefix={<UserOutlined style={{ color: '#1677ff' }} />} />
          </Card>
        </Col>
        <Col span={12}>
          <Card bordered={false} style={{ borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <Statistic title="Jami O'quvchilar" value={stats.total_students} prefix={<TeamOutlined style={{ color: '#52c41a' }} />} />
          </Card>
        </Col>
        <Col span={24}>
          <Card bordered={false} style={{ borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', backgroundColor: '#1677ff' }}>
            <Statistic 
              title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>Kutilayotgan Tushum</span>} 
              value={stats.expected_revenue} 
              prefix={<DollarOutlined />} 
              suffix="so'm" 
              valueStyle={{ color: '#fff', fontWeight: 'bold' }} 
            />
          </Card>
        </Col>
      </Row>

      {/* 📈 GRAFIK QISMI */}
      <Card bordered={false} style={{ borderRadius: '16px', marginBottom: '25px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
          <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Oylik o'sish ko'rsatkichi</span>
          <span style={{ color: '#52c41a', fontWeight: 'bold' }}><ArrowUpOutlined /> +25%</span>
        </div>
        <div style={{ width: '100%', height: 200 }}>
          <ResponsiveContainer>
            <AreaChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTushum" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1677ff" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#1677ff" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
              <Tooltip formatter={(value) => value.toLocaleString('ru-RU') + " so'm"} />
              <Area type="monotone" dataKey="tushum" stroke="#1677ff" fillOpacity={1} fill="url(#colorTushum)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* 👨‍🏫 USTOZLAR RO'YXATI */}
      <h3 style={{ margin: 0, fontWeight: 'bold', fontSize: '18px', color: '#262626', marginBottom: '15px' }}>Ustozlar ro'yxati</h3>
      {loading ? (
        <div style={{ textAlign: 'center', marginTop: '30px' }}><Spin size="large" /></div>
      ) : (
        <TeacherList 
          teachers={teachers} 
          onOpenTeacher={(id, name) => setSelectedTeacher({ id, name })} 
          onEditTeacher={(teacher) => { setEditingTeacher(teacher); setOpenEditDrawer(true); }}       
          onDeleteTeacher={handleDeleteTeacher} 
        />
      )}

      {/* DRAWERLAR VA QO'SHISH TUGMASI */}
      <AddTeacherDrawer open={openAddDrawer} onClose={() => setOpenAddDrawer(false)} fetchTeachers={fetchData} />
      <EditTeacherDrawer open={openEditDrawer} onClose={() => setOpenEditDrawer(false)} teacherData={editingTeacher} fetchTeachers={fetchData} />

      <Button 
        type="primary" shape="circle" icon={<PlusOutlined />} size="large"
        onClick={() => setOpenAddDrawer(true)}
        style={{ position: 'fixed', bottom: '30px', left: '50%', transform: 'translateX(-50%)', width: '60px', height: '60px', fontSize: '24px', boxShadow: '0 4px 15px rgba(22, 119, 255, 0.4)', zIndex: 1000 }}
      />
    </div>
  );
};

export default AdminDashboard;
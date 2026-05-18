import { useState, useEffect } from 'react';
import { Button, Typography, Spin, message } from 'antd';
import { ArrowLeftOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import GroupList from '../Teacher/GroupList'; 
import AddGroupDrawer from '../../components/Admin/AddGroupDrawer'; 
import GroupProfile from './GroupProfile';

const { Title, Text } = Typography;
const API_URL = "https://crm-project-0yio.onrender.com";

const TeacherProfile = ({ teacherId, teacherName, onBack }) => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openAddDrawer, setOpenAddDrawer] = useState(false); 
  
  // YANGI: Tanlangan guruhni ushlab turish uchun
  const [selectedGroup, setSelectedGroup] = useState(null); 

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/get-groups/${teacherId}`);
      setGroups(response.data);
    } catch (error) {
      message.error("Guruhlarni yuklashda xatolik!");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchGroups();
  }, [teacherId]);

  const handleDeleteGroup = async (groupId) => {
    try {
      await axios.delete(`${API_URL}/delete-group/${groupId}`);
      message.success("Guruh o'chirildi!"); 
      fetchGroups(); 
    } catch (error) { message.error("Xatolik yuz berdi!"); }
  };

  // YANGI: Guruh ustiga bosganda ishlaydi
  const handleOpenGroup = (groupId, groupName) => {
    setSelectedGroup({ id: groupId, name: groupName });
  };

  // YANGI: Agar guruh tanlangan bo'lsa, Guruh Profilini ochib beradi
  if (selectedGroup) {
    return (
      <GroupProfile 
        groupId={selectedGroup.id} 
        groupName={selectedGroup.name} 
        onBack={() => setSelectedGroup(null)} 
      />
    );
  }

  // Aks holda oddiy Guruhlar ro'yxatini ko'rsatadi
  return (
    <div style={{ padding: '20px', paddingBottom: '80px', backgroundColor: '#f5f7fa', minHeight: '100vh' }}>
      
      {/* Orqaga qaytish va Sarlavha */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', gap: '15px' }}>
        <Button type="text" icon={<ArrowLeftOutlined style={{ fontSize: '20px' }} />} onClick={onBack} />
        <div>
          <Title level={4} style={{ margin: 0, color: '#262626' }}>{teacherName}</Title>
          <Text type="secondary">Ustozning guruhlari</Text>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', marginTop: '50px' }}><Spin size="large" /></div>
      ) : (
        <GroupList 
          groups={groups} 
          onOpenGroup={handleOpenGroup} 
          onDeleteGroup={handleDeleteGroup} 
        />
      )}

      {/* Guruh qo'shish oynasi */}
      <AddGroupDrawer 
        open={openAddDrawer} 
        onClose={() => setOpenAddDrawer(false)} 
        teacherId={teacherId} 
        fetchGroups={fetchGroups} 
      />

      {/* Dumaloq ko'k guruh qo'shish tugmasi */}
      <Button 
        type="primary" 
        shape="circle" 
        icon={<PlusOutlined />} 
        size="large"
        onClick={() => setOpenAddDrawer(true)} 
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
    </div>
  );
};

export default TeacherProfile;
import { useState, useEffect } from 'react';
import { Typography, List, Card, Spin, message, Button } from 'antd';
import { LogoutOutlined, RightOutlined } from '@ant-design/icons';
import axios from 'axios';
import TeacherGroupProfile from './TeacherGroupProfile'; // 👈 IMPORT TO'G'RI QILINGAN

const { Title, Text } = Typography;
const API_URL = "https://crm-project-0yio.onrender.com";

const TeacherDashboard = ({ teacherId, onLogout }) => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);

  useEffect(() => {
    if (teacherId) {
      fetchGroups();
    }
  }, [teacherId]);

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

  // 🟢 MANA SHU QISM O'ZGARDI: Endi vaqtinchalik yozuv o'rniga, haqiqiy O'quvchilar ro'yxati ochiladi!
  if (selectedGroup) {
    return (
      <TeacherGroupProfile 
        groupId={selectedGroup.id} 
        groupName={selectedGroup.name} 
        onBack={() => setSelectedGroup(null)} 
      />
    );
  }

  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f7fa', minHeight: '100vh' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <Title level={3} style={{ margin: 0, color: '#262626' }}>👨‍🏫 Mening Guruhlarim</Title>
        <Button type="text" danger icon={<LogoutOutlined />} onClick={onLogout}>Chiqish</Button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', marginTop: '50px' }}><Spin size="large" /></div>
      ) : (
        <List
          grid={{ gutter: 16, column: 1 }}
          dataSource={groups}
          locale={{ emptyText: "Sizda hozircha guruhlar yo'q 🤷‍♂️" }}
          renderItem={(group) => (
            <List.Item>
              <Card 
                hoverable 
                onClick={() => setSelectedGroup(group)}
                style={{ borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                bodyStyle={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <div>
                  <Text style={{ fontSize: '18px', fontWeight: 'bold' }}>{group.name}</Text>
                  <br />
                  <Text type="secondary">{group.studentCount || 0} ta o'quvchi</Text>
                </div>
                <RightOutlined style={{ color: '#1890ff', fontSize: '18px' }} />
              </Card>
            </List.Item>
          )}
        />
      )}
    </div>
  );
};

export default TeacherDashboard;
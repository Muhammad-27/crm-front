import { Drawer, List, Avatar, Checkbox, Button, Typography, message } from 'antd';
import { useState, useEffect } from 'react';

const { Text } = Typography;

const AttendanceDrawer = ({ open, onClose, students, onSave, initialPresentIds = [] }) => {
  const [presentStudentIds, setPresentStudentIds] = useState([]);

  useEffect(() => {
    if (open) {
      setPresentStudentIds(initialPresentIds);
    }
  }, [open, initialPresentIds]);

  const toggleStudent = (id) => {
    if (presentStudentIds.includes(id)) {
      setPresentStudentIds(presentStudentIds.filter(studentId => studentId !== id)); 
    } else {
      setPresentStudentIds([...presentStudentIds, id]); 
    }
  };

  const handleSave = () => {
    if (presentStudentIds.length === 0) {
      message.warning("Hozircha hech kimni 'Keldi' qilib belgilamadingiz!");
    }
    onSave(presentStudentIds);
  };

  return (
    <Drawer
      title={<div style={{ textAlign: 'center', fontSize: '18px', fontWeight: 'bold' }}>📅 Bugungi Davomat</div>}
      placement="bottom"
      height="85%" 
      onClose={onClose}
      open={open}
      bodyStyle={{ padding: '10px 20px', paddingBottom: '80px' }} 
      style={{ borderRadius: '20px 20px 0 0' }} 
    >
      <div style={{ marginBottom: '15px', color: 'gray', textAlign: 'center' }}>
        Darsga kelgan o'quvchilarni belgilang
      </div>

      <List
        dataSource={students}
        renderItem={(item) => {
          const isPresent = presentStudentIds.includes(item.id);
          return (
            <div 
              onClick={() => toggleStudent(item.id)}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                padding: '12px 16px', 
                marginBottom: '10px',
                borderRadius: '16px',
                // MANA SHU YER O'ZGARDI: Kelmaganlar uchun Oddiy Oq fon va kulrang chiziq
                backgroundColor: isPresent ? '#f6ffed' : '#ffffff', 
                border: isPresent ? '1px solid #b7eb8f' : '1px solid #f0f0f0',
                cursor: 'pointer',
                transition: '0.3s'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Avatar src={item.avatar} style={{ backgroundColor: '#1677ff' }}>
                  {item.name.charAt(0).toUpperCase()}
                </Avatar>
                <Text style={{ fontWeight: 'bold', fontSize: '16px' }}>{item.name}</Text>
              </div>
              
              <Checkbox checked={isPresent} />
            </div>
          );
        }}
      />

      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px 20px', backgroundColor: 'white', borderTop: '1px solid #f0f0f0' }}>
        <Button 
          type="primary" 
          block 
          size="large" 
          onClick={handleSave}
          style={{ height: '50px', borderRadius: '12px', fontSize: '16px', fontWeight: 'bold' }}
        >
          {presentStudentIds.length} ta o'quvchini saqlash
        </Button>
      </div>
    </Drawer>
  );
};

export default AttendanceDrawer;
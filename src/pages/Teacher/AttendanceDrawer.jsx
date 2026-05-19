import { Drawer, List, Avatar, Checkbox, Button, Typography, message } from 'antd';
import { useState, useEffect } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';

const { Text } = Typography;
const API_URL = "https://crm-project-0yio.onrender.com";

const AttendanceDrawer = ({ open, onClose, students, groupId }) => {
  // Sana avtomat bugungi kunni oladi, lekin ekranda input bo'lib chiqmaydi
  const [selectedDate] = useState(dayjs()); 
  const [presentStudentIds, setPresentStudentIds] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAttendance = async () => {
      if (open && groupId) {
        try {
          const dateStr = selectedDate.format('YYYY-MM-DD');
          const response = await axios.get(`${API_URL}/get-attendance/${groupId}?date=${dateStr}`);
          setPresentStudentIds(response.data); 
        } catch (error) {
          setPresentStudentIds([]); 
        }
      }
    };
    fetchAttendance();
  }, [open, selectedDate, groupId]);

  const toggleStudent = (id) => {
    if (presentStudentIds.includes(id)) {
      setPresentStudentIds(presentStudentIds.filter(studentId => studentId !== id)); 
    } else {
      setPresentStudentIds([...presentStudentIds, id]); 
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await axios.post(`${API_URL}/save-attendance`, {
        group_id: groupId,
        date: selectedDate.format('YYYY-MM-DD'), // Bugungi sana backend'ga jim-jit ketadi
        present_ids: presentStudentIds
      });
      message.success("Davomat muvaffaqiyatli saqlandi! ✅");
      onClose();
    } catch (error) {
      message.error("Davomatni saqlashda xatolik yuz berdi!");
    }
    setLoading(false);
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
      {/* Sana tanlash qismi olib tashlandi, faqat informatsion matn qoldi */}
      <div style={{ marginBottom: '15px', color: 'gray', textAlign: 'center' }}>
        {selectedDate.format('DD.MM.YYYY')} kungi darsga kelganlarni belgilang
      </div>

      <List
        dataSource={students}
        renderItem={(item) => {
          const isPresent = presentStudentIds.includes(item.id);
          return (
            <div 
              onClick={() => toggleStudent(item.id)}
              style={{ 
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 16px', marginBottom: '10px', borderRadius: '16px',
                backgroundColor: isPresent ? '#f6ffed' : '#ffffff', 
                border: isPresent ? '1px solid #b7eb8f' : '1px solid #f0f0f0',
                cursor: 'pointer', transition: '0.3s'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Avatar style={{ backgroundColor: '#1677ff' }}>
                  {item.name ? item.name.charAt(0).toUpperCase() : "U"}
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
          loading={loading}
          style={{ height: '50px', borderRadius: '12px', fontSize: '16px', fontWeight: 'bold' }}
        >
          {presentStudentIds.length} ta o'quvchini saqlash
        </Button>
      </div>
    </Drawer>
  );
};

export default AttendanceDrawer;
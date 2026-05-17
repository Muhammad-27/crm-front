import { Drawer, List, Typography, Modal, Tag, Spin } from 'antd';
import { useState, useEffect } from 'react';
import axios from 'axios';

const { Text } = Typography;
const API_URL = "https://crm-project-0yio.onrender.com";

const AttendanceHistoryDrawer = ({ open, onClose, groupId, students }) => {
  const [dates, setDates] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // "Chek" (Modal) uchun statelar
  const [isReceiptVisible, setIsReceiptVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [presentIds, setPresentIds] = useState([]);
  const [loadingReceipt, setLoadingReceipt] = useState(false);

  // Oyna ochilganda sanalarni bazadan tortib kelamiz
  useEffect(() => {
    if (open && groupId) {
      fetchDates();
    }
  }, [open, groupId]);

  const fetchDates = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/group-attendance-dates/${groupId}`);
      setDates(res.data);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  // Sana bosilganda Chekni ochish
  const openReceipt = async (date) => {
    setSelectedDate(date);
    setIsReceiptVisible(true);
    setLoadingReceipt(true);
    try {
      // Kecha yozgan API mizdan aynan shu kun uchun kimlar kelganini so'raymiz
      const res = await axios.get(`${API_URL}/get-attendance/${groupId}?date=${date}`);
      setPresentIds(res.data);
    } catch (error) {
      console.error(error);
    }
    setLoadingReceipt(false);
  };

  return (
    <Drawer 
      title={<div style={{ textAlign: 'center', fontSize: '18px', fontWeight: 'bold' }}>🗓️ Davomat Tarixi</div>}
      placement="bottom" 
      height="75%" 
      onClose={onClose} 
      open={open} 
      style={{ borderRadius: '20px 20px 0 0' }}
    >
      {loading ? <div style={{textAlign: 'center', padding: '20px'}}><Spin size="large"/></div> : (
        <List
          dataSource={dates}
          renderItem={(date) => (
            <div 
              onClick={() => openReceipt(date)} 
              style={{ display: 'flex', justifyContent: 'space-between', cursor: 'pointer', backgroundColor: '#f5f7fa', marginBottom: '10px', borderRadius: '15px', padding: '16px', border: '1px solid #e2e8f0' }}
            >
              <Text style={{ fontWeight: 'bold', fontSize: '16px' }}>📅 {date}</Text>
              <Text style={{ color: '#1677ff', fontWeight: 'bold' }}>Ko'rish 👁️</Text>
            </div>
          )}
          locale={{ emptyText: "Hali davomat olinmagan" }}
        />
      )}

      {/* FAQAT O'QISH UCHUN "CHEK" OYNASI */}
      <Modal 
        title={<div style={{ textAlign: 'center', fontSize: '20px' }}>🧾 {selectedDate}</div>} 
        open={isReceiptVisible} 
        onCancel={() => setIsReceiptVisible(false)} 
        footer={null} // Saqlash tugmasi yo'q (O'zgartirib bo'lmaydi)
        bodyStyle={{ maxHeight: '60vh', overflowY: 'auto' }}
      >
        <div style={{ marginBottom: '15px', textAlign: 'center', color: 'gray' }}>Ushbu sanadagi davomat hisoboti</div>
        {loadingReceipt ? <div style={{textAlign: 'center'}}><Spin /></div> : (
          <List
            dataSource={students}
            renderItem={(student) => {
              const isPresent = presentIds.includes(student.id);
              return (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px dashed #f0f0f0' }}>
                  <Text style={{ fontSize: '16px', fontWeight: 500 }}>{student.name}</Text>
                  {/* Agar kelsa Yashil 🟢, Kelmasa Qizil 🔴 */}
                  {isPresent ? <Tag color="green" style={{ margin: 0, padding: '4px 10px', borderRadius: '10px' }}>Keldi</Tag> : <Tag color="red" style={{ margin: 0, padding: '4px 10px', borderRadius: '10px' }}>Kelmadi</Tag>}
                </div>
              );
            }}
          />
        )}
      </Modal>
    </Drawer>
  );
};

export default AttendanceHistoryDrawer;
import { useState, useEffect } from 'react';
import { Spin, Result, Button, Input, Typography } from 'antd';
import axios from 'axios';

// Dasturimizning 2 ta asosiy paneli
import AdminDashboard from './pages/Admin/AdminDashboard';
import TeacherDashboard from './pages/Teacher/TeacherDashboard'; // Buni hali yasaymiz, hozircha izohda turadi

const { Title, Text } = Typography;
const API_URL = "https://crm-project-0yio.onrender.com";

// 👑 ADMINLAR RO'YXATI (O'zingizning Telegram ID raqamingizni shu yerga yozasiz!)
const ADMIN_TG_IDS = ["7964049050", "987654321"]; 

function App() {
  const [role, setRole] = useState(null); // 'admin', 'teacher', 'guest'
  const [teacherId, setTeacherId] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Kompyuterda test qilish uchun state
  const [devTgId, setDevTgId] = useState("");

  const checkUser = async (tgId) => {
    setLoading(true);
    try {
      // 1. Admin ekanligini tekshiramiz
      if (ADMIN_TG_IDS.includes(tgId.toString())) {
        setRole('admin');
      } 
      // 2. Agar admin bo'lmasa, Ustozlar bazasidan qidiramiz
      else {
        const res = await axios.get(`${API_URL}/get-teachers`);
        
        // Bazadagi ustozlarning telegram_id si bilan solishtiramiz
        const teacher = res.data.find(t => t.telegram_id === tgId.toString());

        if (teacher) {
          setRole('teacher');
          setTeacherId(teacher.id); // Ustozning bazadagi tartib raqamini saqlab qo'yamiz
        } else {
          // 3. Ikkalasida ham yo'q bo'lsa -> Begona!
          setRole('guest');
        }
      }
    } catch (error) {
      console.error("Foydalanuvchini tekshirishda xato:", error);
      setRole('guest');
    }
    setLoading(false);
  };

  useEffect(() => {
    // Dastur ishga tushganda Telegram orqali kirganini tekshiradi
    const tg = window.Telegram?.WebApp;
    
    if (tg && tg.initDataUnsafe?.user) {
      // Haqiqiy Telegramdan kirdi!
      checkUser(tg.initDataUnsafe.user.id);
    } else {
      // Kompyuterda (brauzerda) kirdi, test oynasini ko'rsatamiz
      setLoading(false);
    }
  }, []);

  // Yuklanmoqda...
  if (loading) {
    return <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><Spin size="large" /></div>;
  }

  // ==========================================
  // 🛠️ KOMPYUTER UCHUN TEST OYNASI
  // ==========================================
  if (role === null) {
    return (
      <div style={{ padding: '50px', textAlign: 'center', backgroundColor: '#f5f7fa', height: '100vh' }}>
        <Title level={3}>🛠️ Dasturchilar uchun Test Oynasi</Title>
        <Text type="secondary">Siz hozir kompyuter (brauzer) dasiz. Kim bo'lib kirmoqchisiz?</Text>
        
        <div style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
          <Input 
            size="large"
            placeholder="Telegram ID raqamini kiriting..." 
            value={devTgId} 
            onChange={e => setDevTgId(e.target.value)} 
            style={{ width: '300px', borderRadius: '10px' }} 
          />
          <Button type="primary" size="large" onClick={() => checkUser(devTgId)} style={{ width: '300px', borderRadius: '10px' }}>
            Tizimga kirish 🚀
          </Button>
        </div>
      </div>
    );
  }

  // ==========================================
  // 🚪 ESHIK OG'ASI (Yo'naltirish)
  // ==========================================
  if (role === 'admin') {
    return <AdminDashboard />;
  }
  
 if (role === 'teacher') {
    return <TeacherDashboard teacherId={teacherId} onLogout={() => setRole(null)} />;
  }

  // Begonalar uchun (Guest)
  return (
    <Result
      status="403"
      title="Kirish taqiqlangan 🛑"
      subTitle="Kechirasiz, siz ushbu tizimdan foydalanish huquqiga ega emassiz. Ruxsat olish uchun Adminga murojaat qiling."
    />
  );
}

export default App;
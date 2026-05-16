import { HomeOutlined, PlusOutlined, AppstoreOutlined } from '@ant-design/icons';

const TeacherBottomNav = ({ currentGroupId, onBackToGroups, onAddClick, onMenuClick }) => {
  return (
    <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: 'white', display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '10px 20px', paddingBottom: '25px', boxShadow: '0 -4px 20px rgba(0,0,0,0.08)', borderRadius: '30px 30px 0 0', zIndex: 1000 }}>
      
      {/* 1. ASOSIY/GURUHLAR TUGMASI */}
      <div onClick={onBackToGroups} style={{ textAlign: 'center', color: currentGroupId === null ? '#1677ff' : 'gray', cursor: 'pointer' }}>
        <HomeOutlined style={{ fontSize: '22px' }} />
        <div style={{ fontSize: '11px', fontWeight: 'bold', marginTop: '4px' }}>Guruhlar</div>
      </div>
      
      {/* 2. O'RTADAGI "+" TUGMASI */}
      <div 
        onClick={onAddClick} 
        style={{ width: '60px', height: '60px', backgroundColor: currentGroupId === null ? '#1677ff' : '#52c41a', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', marginTop: '-35px', boxShadow: currentGroupId === null ? '0 8px 20px rgba(22,119,255,0.4)' : '0 8px 20px rgba(82,196,26,0.4)', cursor: 'pointer', border: '4px solid white', transition: '0.3s' }}
      >
        <PlusOutlined style={{ fontSize: '24px', fontWeight: 'bold' }} />
      </div>

      {/* 3. MENYU TUGMASI */}
      <div onClick={onMenuClick} style={{ textAlign: 'center', color: 'gray', cursor: 'pointer' }}>
        <AppstoreOutlined style={{ fontSize: '22px' }} />
        <div style={{ fontSize: '11px', fontWeight: 'bold', marginTop: '4px' }}>Menyu</div>
      </div>
      
    </div>
  );
};

export default TeacherBottomNav;
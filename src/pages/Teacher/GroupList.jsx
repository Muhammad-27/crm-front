import { List, Avatar, Typography, Popconfirm, Button } from 'antd';
import { UsergroupAddOutlined, RightOutlined, DeleteOutlined } from '@ant-design/icons';

const { Text } = Typography;

const GroupList = ({ groups, onOpenGroup, onDeleteGroup }) => {
  return (
    <List
      dataSource={groups}
      renderItem={(item) => (
        <div 
          style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            backgroundColor: '#fff', 
            padding: '16px', 
            marginBottom: '12px', 
            borderRadius: '20px', 
            boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
            cursor: 'pointer'
          }}
        >
          {/* Guruh ichiga kirish uchun (chap tomon bosilganda) */}
          <div 
            onClick={() => onOpenGroup(item.id, item.name)} 
            style={{ display: 'flex', alignItems: 'center', gap: '15px', flex: 1 }}
          >
            <Avatar size={48} icon={<UsergroupAddOutlined />} style={{ backgroundColor: '#e6f4ff', color: '#1677ff' }} />
            <div>
              <Text style={{ fontSize: '16px', fontWeight: 'bold', display: 'block' }}>{item.name}</Text>
              <Text style={{ color: 'gray', fontSize: '12px' }}>
                <UsergroupAddOutlined /> {item.studentCount} ta o'quvchi
              </Text>
            </div>
          </div>

          {/* O'ng tomondagi tugmalar: Karzinka va Strelka */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Popconfirm 
              title="Guruhni o'chiramizmi?" 
              description="Ichidagi barcha o'quvchilar va davomatlar o'chib ketadi!"
              onConfirm={(e) => { e.stopPropagation(); onDeleteGroup(item.id); }} 
              onCancel={(e) => e.stopPropagation()}
              okText="Ha, o'chirish" 
              cancelText="Yo'q"
            >
              <Button type="text" danger icon={<DeleteOutlined style={{ fontSize: '18px' }}/>} onClick={(e) => e.stopPropagation()} />
            </Popconfirm>
            <RightOutlined style={{ color: '#bfbfbf' }} />
          </div>
        </div>
      )}
    />
  );
};

export default GroupList;
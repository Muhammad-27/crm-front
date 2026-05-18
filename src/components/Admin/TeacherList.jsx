import { List, Avatar, Typography } from 'antd';
import { UserOutlined, RightOutlined } from '@ant-design/icons';

const { Text } = Typography;

const TeacherList = ({ teachers, onOpenTeacher }) => {
  return (
    <List
      dataSource={teachers}
      renderItem={(item) => (
        <div 
          onClick={() => onOpenTeacher(item.id, item.name)} 
          style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            backgroundColor: '#ffffff', 
            padding: '16px', 
            marginBottom: '12px', 
            borderRadius: '20px', 
            boxShadow: '0 4px 15px rgba(0,0,0,0.03)', 
            cursor: 'pointer' 
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <Avatar size={48} icon={<UserOutlined />} style={{ backgroundColor: '#e6f4ff', color: '#1677ff' }} />
            <div>
              <Text style={{ fontSize: '16px', fontWeight: 'bold', display: 'block', color: '#262626' }}>
                {item.name}
              </Text>
              <Text style={{ color: '#8c8c8c', fontSize: '13px' }}>
                {item.phone} • {item.groupCount} ta guruh
              </Text>
            </div>
          </div>
          <RightOutlined style={{ color: '#bfbfbf' }} />
        </div>
      )}
      locale={{ emptyText: "Hali o'qituvchilar yo'q" }}
    />
  );
};

export default TeacherList;
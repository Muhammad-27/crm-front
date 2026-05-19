import { List, Avatar, Typography, Button } from 'antd';
import { UserOutlined, EditOutlined, DeleteOutlined, RightOutlined } from '@ant-design/icons';

const { Text } = Typography;

const TeacherList = ({ teachers, onOpenTeacher, onEditTeacher, onDeleteTeacher }) => {
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
            cursor: 'pointer',
            transition: '0.3s'
          }}
        >
          {/* Chap tomon: Avatar va Ma'lumotlar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <Avatar size={48} icon={<UserOutlined />} style={{ backgroundColor: '#e6f4ff', color: '#1677ff' }} />
            <div>
              <Text style={{ fontSize: '16px', fontWeight: 'bold', display: 'block', color: '#262626' }}>
                {item.name}
              </Text>
              <Text style={{ color: '#8c8c8c', fontSize: '13px' }}>
                {item.phone} • {item.groupCount || 0} ta guruh
              </Text>
            </div>
          </div>

          {/* O'ng tomon: Amallar (Tugmalar) paneli */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            {/* Tahrirlash tugmasi */}
            <Button
              type="text"
              icon={<EditOutlined style={{ color: '#1677ff', fontSize: '16px' }} />}
              onClick={(e) => {
                e.stopPropagation(); // Butun qator bosilib ketishini to'xtatamiz!
                onEditTeacher(item);
              }}
            />
            
            {/* O'chirish tugmasi */}
            <Button
              type="text"
              danger
              icon={<DeleteOutlined style={{ fontSize: '16px' }} />}
              onClick={(e) => {
                e.stopPropagation(); // Butun qator bosilib ketishini to'xtatamiz!
                onDeleteTeacher(item.id);
              }}
            />

            <RightOutlined style={{ color: '#bfbfbf', marginLeft: '5px' }} />
          </div>

        </div>
      )}
      locale={{ emptyText: "Hali o'qituvchilar yo'q" }}
    />
  );
};

export default TeacherList;
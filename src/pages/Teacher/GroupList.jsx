import { Card, Avatar } from 'antd';
import { TeamOutlined, RightOutlined } from '@ant-design/icons';

const GroupList = ({ groups, onOpenGroup }) => {
  return (
    <div style={{ paddingBottom: '80px' }}>
      {groups.map((group) => (
        <Card 
          key={group.id}
          onClick={() => onOpenGroup(group.id, group.name)}
          style={{ 
            marginBottom: '12px', 
            borderRadius: '20px', 
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            border: 'none',
            cursor: 'pointer'
          }}
          bodyStyle={{ padding: '16px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ width: '50px', height: '50px', borderRadius: '15px', backgroundColor: '#e6f4ff', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#1677ff' }}>
                <TeamOutlined style={{ fontSize: '24px' }} />
              </div>
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#000' }}>
                  {group.name}
                </div>
                <div style={{ fontSize: '13px', color: 'gray', marginTop: '4px' }}>
                  👥 {group.studentCount} ta o'quvchi
                </div>
              </div>
            </div>
            <div>
              <RightOutlined style={{ color: '#bfbfbf' }} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default GroupList;
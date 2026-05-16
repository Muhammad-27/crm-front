import { Avatar, Skeleton, Tag, Popconfirm, Card, Button } from 'antd';
import { CreditCardOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const StudentList = ({ filteredStudents, loading, handlePayment, showDrawerForEdit, handleDelete, formatMoney }) => {
  return (
    <div style={{ paddingBottom: '80px' }}> {/* Pastki menyu yopib qo'ymasligi uchun joy tashlaymiz */}
      {loading ? (
        <Skeleton active />
      ) : (
        filteredStudents.map((item) => (
          <Card 
            key={item.id}
            style={{ 
              marginBottom: '12px', 
              borderRadius: '20px', // Dumaloq qirralar chizmangizdagidek
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              border: 'none'
            }}
            bodyStyle={{ padding: '16px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Avatar src={item.avatar} size={48} />
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '16px', color: 'var(--tg-theme-text-color, #000)' }}>
                    {item.name}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--tg-theme-hint-color, gray)' }}>
                    {item.phone}
                  </div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 'bold', color: '#1677ff' }}>{formatMoney(item.fee)}</div>
                {item.isPaid ? (
                  <Tag color="green" style={{ margin: 0, borderRadius: '10px' }}>To'lagan</Tag>
                ) : (
                  <Tag color="red" style={{ margin: 0, borderRadius: '10px' }}>Qarzi bor</Tag>
                )}
              </div>
            </div>

            {/* Harakatlar tugmalari */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #f0f0f0' }}>
              <Button size="small" type="dashed" icon={<CreditCardOutlined />} onClick={() => handlePayment(item.id)} style={{ color: '#52c41a', borderColor: '#52c41a' }}>To'lov</Button>
              <Button size="small" type="text" icon={<EditOutlined />} onClick={() => showDrawerForEdit(item)} />
              <Popconfirm title="O'chirasizmi?" onConfirm={() => handleDelete(item.id)} okText="Ha" cancelText="Yo'q">
                <Button size="small" type="text" danger icon={<DeleteOutlined />} />
              </Popconfirm>
            </div>
          </Card>
        ))
      )}
    </div>
  );
};

export default StudentList;
import React, {useState, useRef} from 'react';
import {
    Space, Table, Select, Modal, Upload, Button, Steps, Skeleton,
    message, Empty, Drawer, Form, DatePicker, Popconfirm, Input
} from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import FormModal from '../../componenta/Modal/FormModal';
import './UslubiyNashrlar.scss'
import UslubiyNashrlarModal from '../../componenta/UslubiyNashrlarModal/UslubiyNashrlarModal';
import axios from 'axios';
import { ApiName } from "../../api/APIname";
import { useEffect } from 'react';
const UslubiyNashrlar = () => {
    const fulInfo = JSON.parse(localStorage.getItem("myInfo"));
    const formRef = useRef(null);
    const [form] = Form.useForm();
    const [DateListe, setDateListe] = useState(['', '']);
    const [open, setOpen] = useState(false)
    const [editingData, setEditingData] = useState(null);
    const [dataList, setDataList] = useState([]);
    const onChangeDate = (value, dateString) => {
        setDateListe(dateString)
    };
    const columns = [
        {
            title: '№',
            width: 50,
            render: (item, record, index) => (<>{index + 1}</>)
        },
        {
            title: 'Uslubiy nashr nomi',
            dataIndex: 'scientificName',
            width: 350,
        },
        {
            title: 'Mualliflar',
            dataIndex: 'authorCount',
            width: 200,
        },
        {
            title: 'Nashr yili',
            dataIndex: 'issueYear',
            width: 150
        },
        {
            title: 'Uslubiy nashr turi',
            render: (item, record, index) => (<>{item?.classifierOptionsDTO?.name}</>),
            dataIndex: 'address',
            width: 150
        },
        {
            title: 'Xodim',
            dataIndex: 'address',
            width: 150
        },
        {
            title: 'Uslubiy nashr tili',
            width: 100,
            render: (item, record, index) => (<>{item?.language}</>)
        },
        {
            title: 'Tekshirish',
            dataIndex: 'address',
            width: 100
        },
        {
            title: "So'rov Faol",
            dataIndex: 'address',
            width: 150
        },
        {
            title: 'Harakatlar',
            width: 100,
            render: (text, record) => (
              <Space size="middle">
                <Button type="primary" ghost className='d-flex justify-content-center align-items-center w-10px' style={{"minWidth":'120px'}} onClick={() => onEdit(record)}><EditOutlined /></Button>
                <Button className='d-flex justify-content-center align-items-center w-10px' style={{"minWidth":'120px'}} onClick={() => handleDelete(record.id)} type="primary" danger ghost>
                <DeleteOutlined />
                </Button>
              </Space>
            ),
          },
        
    ];

    const handleDelete = (id) => {
        axios.put(`${ApiName}/api/publication/update_status`, {
          id,
          publicationStatus: 'DELETED'
        }, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${fulInfo?.accessToken}`
          }
        })
        .then(response => {
            console.log(response);
          if (response.data.message === "Success") {
            message.success('Maqola muvaffaqiyatli o`chirildi');
            getIlmiyNashir(); 
          }
        })
        .catch(error => {
          message.error('Maqolani o`chirishda xatolik');
        });
    };
    const onEdit = (record) => {
        setEditingData(record);
        setOpen(true); // Modalni ochish uchun setOpen(true) funksiyasini chaqiramiz
    };
    function getIlmiyNashir() {
        axios.get(`${ApiName}/api/publication/current-user`, {
            headers: {
                Authorization: `Bearer ${fulInfo?.accessToken}`
            },
            params:{
                type: 'STYLE_PUBLICATIONS'
            }
        }).then((response) => {
            console.log('Fetched data:', response?.data?.data?.content);
            const fetchedData = response?.data?.data?.content.map(item => ({ ...item, key: item.id }));
            setDataList(fetchedData);
        }).catch((error) => {
            console.log('API error:', error);
            message.error('Failed to fetch data');
        });
    }    
    useEffect(() => {
        getIlmiyNashir();
    }, []);
    const handleFinish = (values) => {
        if (editingData) {
            const updatedValues = { ...values, id: editingData.id };
            axios.put(`${ApiName}/api/publication/update`, updatedValues, {
                headers: {
                    Authorization: `Bearer ${fulInfo?.accessToken}`,
                    'Content-Type': 'application/json'
                }
            }).then((response) => {
                const updatedItem = response.data;
                setDataList(dataList.map(item => item.id === updatedItem.id ? updatedItem : item));
                message.success('Maqola muvaffaqiyatli yangilandi');
                setOpen(false);
                setEditingData(null);
            }).catch((error) => {
                message.error('Maqolani yangilashda xatolik');
            });
        } else {
            axios.post(`${ApiName}/api/publication`, values, {
                headers: {
                    Authorization: `Bearer ${fulInfo?.accessToken}`,
                    'Content-Type': 'application/json'
                }
            }).then((response) => {
                setDataList([...dataList, { ...response.data, key: response.data.id }]);
                message.success('Maqola muvaffaqiyatli qo\'shildi');
                setOpen(false);
            }).catch((error) => {
                message.error('Maqolani qo\'shishda xatolik');
            });
        }
    };
    const handleCancel = () => {
        setOpen(false);
        setEditingData(null);
    };
  return (
    <>
    <div className='p-4'>
    <Modal
        title="Uslubiy nashrlar punkti"
        centered
        open={open}
        onCancel={handleCancel}
        width={1600}
        style={{right:"-80px"}}
      >
        <UslubiyNashrlarModal publicationType="STYLE_PUBLICATIONS" getIlmiyNashir={getIlmiyNashir} editingData={editingData} handleFinish={handleFinish} handleCancel={handleCancel}/>
      </Modal>
            
            <div className=' d-flex  align-items-center justify-content-between'>
                <Form form={form} layout="vertical" ref={formRef} colon={false}
                    //   onFinish={onChange}
                      className=' d-flex align-items-center gap-4'
                >
                    <Form.Item label="Mudatini belgilang"
                               name="MurojatYuklash"
                               >
                        <DatePicker.RangePicker
                            // placeholder={["Bosh sana", 'Tugash sana']}
                            name="MurojatYuklash" format="YYYY-MM-DD" onChange={onChangeDate}/>
                    </Form.Item>
                    <Form.Item label="Ilmiy nashr nomi" name="MurojatYuklash">
                        <Input style={{width: '500px'}} placeholder="Nom bo'yicha qidirish"/>
                    </Form.Item>
                    <Form.Item>
                        <button className="btn btn-success mt-4" type="submit">
                            <span className="button__text">Ma'lumotni izlash</span>
                        </button>
                    </Form.Item>

                </Form>

                <button type="button" className="button1"
                    onClick={() => {
                        setOpen(true)
                    }}
                >
                    <span className="button__text">Uslubiy nashr</span>
                    <span className="button__icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" viewBox="0 0 24 24" strokeWidth="2"
                             strokeLinejoin="round" strokeLinecap="round" stroke="currentColor" height="24"
                             fill="none" className="svg">
                            <line y2="19" y1="5" x2="12" x1="12"/>
                            <line y2="12" y1="12" x2="19" x1="5"/>
                        </svg>
                    </span>
                </button>

            </div>
            <Table
                columns={columns}
                dataSource={dataList}
                pagination={{
                    pageSize: 50,
                }}
                scroll={{
                    y: 660,
                }}
            />
        </div>
    </>
  )
}

export default UslubiyNashrlar
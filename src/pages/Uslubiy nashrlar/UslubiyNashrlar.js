import React, {useState, useRef} from 'react';
import {
    Space, Table, Select, Modal, Upload, Button, Steps, Skeleton,
    message, Empty, Drawer, Form, DatePicker, Popconfirm, Input,Switch
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
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 2,
            total: 10
        },
    });

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
            width: 150,
            render: (text, record) => (
                <Switch
                    checked={record.publicationStatus === "ACTIVE"}
                    onChange={() => toggleActiveStatus(record)}
                />
            )
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

    const onChange = (e) => {

        axios.get(`${ApiName}/api/publication/current-user`, {
            headers: {
                Authorization: `Bearer ${fulInfo?.accessToken}`
            },
            params:{
                size: tableParams.pagination.pageSize,
                page: tableParams.pagination.current,
                type: 'SCIENTIFIC_PUBLICATIONS',
                publicationName:e.srcInput,
                fromlocalDate:DateListe[0],
                tolocalDate:DateListe[1]
            }
        }).then((res)=>{
            console.log(res.data.data)
            setTableParams({
                ...tableParams,
                pagination: {
                    pageSize: res.data.data.size,
                    total: res.data.data.totalElements
                }
            })
            const fetchedData = res?.data?.data?.content.map(item => ({ ...item, key: item.id }));
            setDataList(fetchedData);
        }).catch((error)=>{
            console.log(error)})

    };

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
    function getIlmiyNashir(page, pageSize) {
        axios.get(`${ApiName}/api/publication/current-user`, {
            headers: {
                Authorization: `Bearer ${fulInfo?.accessToken}`
            },
            params:{
                type: 'STYLE_PUBLICATIONS',
                size: pageSize,
                page: page - 1
            }
        }).then((response) => {
            setTableParams({
                ...tableParams,
                pagination: {
                    pageSize: response.data.data.size,
                    total: response.data.data.totalElements
                }
            })
            console.log('Fetched data:', response?.data?.data?.content);
            const fetchedData = response?.data?.data?.content.map(item => ({ ...item, key: item.id }));
            setDataList(fetchedData);
        }).catch((error) => {
            console.log('API error:', error);
            message.error('Failed to fetch data');
        });
    }    
    useEffect(() => {
        getIlmiyNashir(tableParams.pagination.current, tableParams.pagination.total);
    }, []);
    
    const toggleActiveStatus = (record) => {
        const newStatus = record.publicationStatus === "ACTIVE" ? "NOT_ACTIVE" : "ACTIVE";        
        const requestData = { id: record.id, publicationStatus: newStatus };

        console.log('Request data:', requestData);

        axios.put(`${ApiName}/api/publication/update_status`, requestData, {
            headers: {
                Authorization: `Bearer ${fulInfo?.accessToken}`,
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            console.log('API response:', response.data);

            const updatedItem = response.data;
            setDataList(dataList.map(item => item.id === record.id ? { ...item, publicationStatus: updatedItem.publicationStatus } : item));
            message.success('Publication status updated successfully');
            getIlmiyNashir(1, tableParams.pagination.total);
        }).catch((error) => {
            console.log('API error:', error.response ? error.response.data : error.message);
            message.error('Failed to update publication status');
        });
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
        footer={null} 
      >
        <UslubiyNashrlarModal publicationType="STYLE_PUBLICATIONS" getIlmiyNashir={getIlmiyNashir} editingData={editingData}  handleCancel={handleCancel}/>
      </Modal>
            
            <div className=' d-flex  align-items-center justify-content-between'>
                <Form form={form} layout="vertical" ref={formRef} colon={false}
                      onFinish={onChange}
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
              scroll={{ y:550 }}
              pagination={
                {
                  total: tableParams.pagination.total,
                  pageSize: tableParams.pagination.pageSize,
                  onChange: (page, pageSize) => 
                  {
                     getIlmiyNashir(page, pageSize);
                  }
                }
             }
            />
        </div>
    </>
  )
}

export default UslubiyNashrlar
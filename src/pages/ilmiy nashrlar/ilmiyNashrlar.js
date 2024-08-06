import React, { useState, useRef, useEffect } from 'react';
import { Space, Table, Modal, Button, Form, DatePicker, Input, Switch, message } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import "./ilmiyNashrlar.scss";
import FormModal from '../../componenta/Modal/FormModal';
import axios from "axios";
import { ApiName } from "../../api/APIname";

function IlmiyNashrlar(props) {
    const fulInfo = JSON.parse(localStorage.getItem("myInfo"));
    const formRef = useRef(null);
    const [form] = Form.useForm();
    const [DateListe, setDateListe] = useState(['', '']);
    const [open, setOpen] = useState(false);
    const [dataList, setDataList] = useState([]);
    const [editingData, setEditingData] = useState(null);
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 2,
            total: 10
        },
    });

    const onChangeDate = (value, dateString) => {
        setDateListe(dateString);
    };

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

    const toggleActiveStatus = (record) => {
        const newStatus = record.publicationStatus === "ACTIVE" ? "NOT_ACTIVE" : "ACTIVE";
        const requestData = { id: record.id, publicationStatus: newStatus };

        axios.put(`${ApiName}/api/publication/update_status`, requestData, {
            headers: {
                Authorization: `Bearer ${fulInfo?.accessToken}`,
                'Content-Type': 'application/json'
            }
        }).then((response) => {

            const updatedItem = response.data;
            setDataList(dataList.map(item => item.id === record.id ? { ...item, publicationStatus: updatedItem.publicationStatus } : item));
            message.success('Publication status updated successfully');
            getIlmiyNashir(1, tableParams.pagination.total);
        }).catch((error) => {
            console.log('API error:', error.response ? error.response.data : error.message);
            message.error('Failed to update publication status');
        });
    };

    const columns = [
        {
            title: '№',
            width: 50,
            render: (item, record, index) => (<>{index + 1}</>)
        },
        {
            title: 'Ilmiy nashr turi',
            render: (item, record, index) => (<>{item?.scientificPublicationType?.name}</>),
            width: 150
        },
        {
            title: 'Ilmiy nashr tili',
            width: 100,
            render: (item, record, index) => (<>{item?.language}</>)
        },
        {
            title: 'Nashrning bibliografik matni',
            dataIndex: 'scientificName',
            width: 250,
        },
        {
            title: 'Mualliflar soni',
            dataIndex: 'authorCount',
            width: 80,
        },
        {
            title: 'Mualliflar',
            dataIndex: 'address',
            width: 150
        },
        {
            title: 'Nashr yili',
            dataIndex: 'issueYear',
            width: 150
        },
        {
            title: 'url',
            render: (item, record, index) => (<a href={item?.doiOrUrl} target={"_blank"}>file</a>),
            width: 50
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
                <Button type="primary" ghost className='d-flex justify-content-center align-items-center ' style={{"minWidth":'30px'}} onClick={() => onEdit(record)}><EditOutlined /></Button>
                <Button className='d-flex justify-content-center align-items-center' style={{"minWidth":'30px'}} onClick={() => handleDelete(record.id)} type="primary" danger ghost>
                <DeleteOutlined />
                </Button>
              </Space>
            ),
          },
    ];

    useEffect(() => {
        getIlmiyNashir(tableParams.pagination.current, tableParams.pagination.total);
    }, []);

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
              getIlmiyNashir(tableParams.pagination.current, tableParams.pagination.total);
          }
        })
        .catch(error => {
          message.error('Maqolani o`chirishda xatolik');
        });
    };

    function getIlmiyNashir(page, pageSize) {
        axios.get(`${ApiName}/api/publication/current-user`, {
            headers: {
                Authorization: `Bearer ${fulInfo?.accessToken}`
            },
            params:{
                type: 'SCIENTIFIC_PUBLICATIONS',
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

    const onEdit = (record) => {
        setEditingData(record);
        setOpen(true); // Modalni ochish uchun setOpen(true) funksiyasini chaqiramiz
    };

    const handleCancel = () => {
        setOpen(false);
        setEditingData(null);
    };


    return (
        <div className='p-4'>
            <Modal
                title={editingData ? "Maqola tahrirlash" : "Maqola kiritish punkti"}
                centered
                open={open}
                onCancel={handleCancel}
                width={1600}
                style={{ right: "-80px" }}
                footer={null} // Modal footerni o'chiring
            >
                <FormModal publicationType="SCIENTIFIC_PUBLICATIONS" editingData={editingData} handleCancel={handleCancel} />
            </Modal>

            <div className='d-flex align-items-center justify-content-between'>
                <Form form={form} layout="vertical" ref={formRef} colon={false}
                      onFinish={onChange}
                      className='d-flex align-items-center gap-4'
                >
                    <Form.Item label="Mudatini belgilang" name="srcDate">
                        <DatePicker.RangePicker name="srcDate" format="YYYY-MM-DD" onChange={onChangeDate} />
                    </Form.Item>
                    <Form.Item label="Ilmiy nashr nomi" name="srcInput">
                        <Input name='srcInput' style={{ width: '500px' }} placeholder="Ilmiy nashr nomi bo'yicha qidirish" />
                    </Form.Item>
                    <Form.Item>
                        <button className="btn btn-success mt-4" type="submit">
                            <span className="button__text">Ma'lumotni izlash</span>
                        </button>
                    </Form.Item>
                </Form>

                <button type="button" className="btn btn-success" onClick={() => setOpen(true)}>
                    <span className="button__text">Ma'lumot qo'shish</span>
                </button>
            </div>

            <div className="mt-4">
                <Table
                    columns={columns}
                    dataSource={dataList}
                    scroll={{ y:550 }}
                    pagination={
                        {
                            total: tableParams.pagination.total,
                            pageSize: tableParams.pagination.pageSize,
                            onChange: (page, pageSize) => {

                                getIlmiyNashir(page, pageSize);
                            }
                        }
                    }
                />
            </div>
        </div>
    );
}

export default IlmiyNashrlar;





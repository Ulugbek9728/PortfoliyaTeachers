import React, {useState, useRef, useEffect} from 'react';
import {Table, Select, Modal, Form, message, Space, Popconfirm} from 'antd';
import { SearchOutlined} from '@ant-design/icons';

import IlmiySaloxiyatModal from '../../componenta/IlmiySaloxiyatModal/IlmiySaloxiyatModal';
import axios from "axios";
import {ApiName} from "../../api/APIname";

const IlmiySaloxiyati = () => {
    const formRef = useRef(null);
    const fulInfo = JSON.parse(localStorage.getItem("myInfo"));
    const [form] = Form.useForm();
    const [open, setOpen] = useState(false)
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 0,
            pageSize: 10,
            total: 10
        },
    });
    const [srcItem, setSrcItem] = useState({});
    const [dataList, setDataList] = useState([]);
    const [editingData, setEditingData] = useState(null);

    const columns = [
        {
            title: '№',
            width: 50,
            render: (item, record, index) => (<>{index + 1}</>)
        },
        {
            title: 'Ilmiy raxbarlik turi ',
            dataIndex: 'scientificLeadershipType',
            width: 300,
        },
        {
            title: 'Shogirdning ilmiy darajasi',
            render: (item, record, index) => (<>{item?.studentAcademicDegree?.name}</>),
            width: 300,
        },
        {
            title: 'Shogirt F.I.SH',
            render: (item, record, index) => (<>{item?.studentId?.fullName} ({item?.studentId?.workplace} {item?.studentId?.position})</>),
            width: 200,
        },
        {
            title: 'Ximoya qilgan yili',
            dataIndex: 'yearOfProtection',
            width: 150
        },
        {
            title: 'Dissertatsiya mavzusi',
            dataIndex: 'dissertationTopic',
            width: 150
        },
        {
            title: 'url',
            render: (item, record, index) => (
                <a href={item.media?.url} target={"_blank"}>file</a>),
            width: 50
        },
        {
            title: 'Tekshirish',
            dataIndex: 'address',
            width: 100
        },
        {
            title: 'Harakatlar',
            width: 100,
            render: (text, record) => (
                <Space size="middle">
                    <button type="primary" className='editBtn'
                            style={{"minWidth": '30px'}}
                            onClick={() => onEdit(record)}
                    >
                        <svg height="1em" viewBox="0 0 512 512">
                            <path
                                d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"
                            ></path>
                        </svg>
                    </button>
                    <Popconfirm title="Ilmiy nashirni o'chirish"
                                description="Ilmiy nashirni o'chirishni tasdiqlaysizmi?"
                                onConfirm={(e) => handleDelete(record.id)}
                                okText="Ha" cancelText="Yo'q"
                    >
                        <button className="delet"
                        >
                            <svg
                                className="bin-top"
                                viewBox="0 0 39 7"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <line y1="5" x2="39" y2="5" stroke="white" strokeWidth="4"></line>
                                <line
                                    x1="12"
                                    y1="1.5"
                                    x2="26.0357"
                                    y2="1.5"
                                    stroke="white"
                                    strokeWidth="3"
                                ></line>
                            </svg>
                            <svg
                                className="bin-bottom"
                                viewBox="0 0 33 39"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <mask id="path-1-inside-1_8_19" fill="white">
                                    <path
                                        d="M0 0H33V35C33 37.2091 31.2091 39 29 39H4C1.79086 39 0 37.2091 0 35V0Z"
                                    ></path>
                                </mask>
                                <path
                                    d="M0 0H33H0ZM37 35C37 39.4183 33.4183 43 29 43H4C-0.418278 43 -4 39.4183 -4 35H4H29H37ZM4 43C-0.418278 43 -4 39.4183 -4 35V0H4V35V43ZM37 0V35C37 39.4183 33.4183 43 29 43V35V0H37Z"
                                    fill="white"
                                    mask="url(#path-1-inside-1_8_19)"
                                ></path>
                                <path d="M12 6L12 29" stroke="white" strokeWidth="4"></path>
                                <path d="M21 6V29" stroke="white" strokeWidth="4"></path>
                            </svg>
                        </button>
                    </Popconfirm>

                </Space>
            ),
        },
    ];

    useEffect(() => {
        getIlmiySaloxiyat();
    }, []);

    function getIlmiySaloxiyat() {
        console.log();
        axios.get(`${ApiName}/api/employee-student`, {
            headers: {
                Authorization: `Bearer ${fulInfo?.accessToken}`
            },
            params: {
                size: tableParams.pagination.pageSize,
                page: tableParams.pagination.current > 0 ? tableParams.pagination.current - 1 : 0,
                // type: 'SCIENTIFIC_PUBLICATIONS',
                scientificLeadershipType: srcItem?.srcType,
                // scientificPublicationType: srcItem?.srcType,
                // fromlocalDate: DateListe[0],
                // tolocalDate: DateListe[1]
            }
        }).then((response) => {
            setTableParams({
                ...tableParams,
                pagination: {
                    pageSize: response.data.data.size,
                    total: response.data.data.totalElements
                }
            })
            console.log(response.data.data.content)
            const fetchedData = response?.data?.data?.content.map(item => ({...item, key: item.id}));
            setDataList(fetchedData);
        }).catch((error) => {
            console.log('API error:', error);
            message.error('Failed to fetch data');
        });
    }

    const handleDelete = (id) => {
        axios.delete(`${ApiName}/api/employee-student/${id}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${fulInfo?.accessToken}`
            }
        })
            .then(response => {
                console.log(response);
                if (response.data.message === "Success") {
                    message.success('Ma`lumot o`chirildi');
                    getIlmiySaloxiyat();
                }
            })
            .catch(error => {
                message.error('Ma`lumot o`chirishda xatolik');
            });
    };
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
                title={editingData ? "Ilmiy raxbarlik tahrirlash" : "Ilmiy raxbarlik ostidagi shogird qoshish punkti"}
                centered
                open={open}
                onCancel={handleCancel}
                width={1000}
                style={{right: "-80px"}}
            >
                <IlmiySaloxiyatModal editingData={editingData} handleCancel={handleCancel}
                                     getIlmiySaloxiyat={getIlmiySaloxiyat}/>
            </Modal>
            <div className=' d-flex  align-items-center justify-content-between'>
                <Form form={form} ref={formRef} colon={false}
                      layout="vertical"
                      onFinish={() => getIlmiySaloxiyat()}
                      className=' col-3 d-flex align-items-center gap-4'>

                    <Form.Item layout="vertical" label="Ilmiy raxbarlik turi" name="scientificLeadershipType"
                               labelCol={{span: 24}}
                               wrapperCol={{span: 24}} className='col-12'>
                        <Select name='scientificLeadershipType' onChange={(e) => {
                            setSrcItem({
                                ...srcItem,
                                srcType: e
                            })
                        }}>
                            <Select.Option value='Ilmiy raxbarligingiz ostida ximoya qilgan fan nomzodi shogird'>
                                Ilmiy raxbarligingiz ostida ximoya qilgan fan nomzodi shogird
                            </Select.Option>
                            <Select.Option value='Ilmiy raxbarligingiz ostida ximoya qilgan falsafa doktori shogird'>
                                Ilmiy raxbarligingiz ostida ximoya qilgan falsafa doktori shogird
                            </Select.Option>
                            <Select.Option value='Ilmiy raxbarligingiz ostida ximoya qilgan fan doktori shogird'>
                                Ilmiy raxbarligingiz ostida ximoya qilgan fan doktori shogird</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label='  '>
                        <button className="btn btn-success" type="submit">
                            <span className="button__text"><SearchOutlined /></span>
                        </button>
                    </Form.Item>
                </Form>

                <button type="button" className="button1"
                        onClick={() => {
                            setOpen(true)
                        }}
                >
                    <span className="button__text">Ilmiy nashr yaratish</span>
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
    )
}

export default IlmiySaloxiyati
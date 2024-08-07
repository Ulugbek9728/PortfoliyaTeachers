import React, {useState, useRef, useEffect} from 'react';
import {
    Space, Table, Select, Modal, Upload, Button, Steps, Skeleton,
    message, Empty, Drawer, Form, DatePicker, Popconfirm, Input
} from 'antd';
import "./InteliktualMulk.scss"
import FormModal from '../../componenta/Modal/FormModal';
import IntMulkModal from '../../componenta/Int.Mulk.Modal/IntMulkModal';
import axios from "axios";
import {ApiName} from "../../api/APIname";
const InteliktualMulk = () => {
    const fulInfo = JSON.parse(localStorage.getItem("myInfo"));

    const formRef = useRef(null);
    const [form] = Form.useForm();
    const [DateListe, setDateListe] = useState(['', '']);
    const [open, setOpen] = useState(false)
    const [Scientificpublication, setScientificpublication] = useState([]);
    const [dataList, setDataList] = useState([]);
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 0,
            pageSize: 5,
            total: 10
        },
    });

    const [srcItem, setSrcItem] = useState({});

    const onChangeDate = (value, dateString) => {
        setDateListe(dateString)
    };
    useEffect(() => {
        ClassifairGet()
        getIntelektualMulk()
    }, []);
    function ClassifairGet() {
        axios.get(`${ApiName}/api/classifier`, {
            params: {
                key: 'h_patient_type'
            },
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${fulInfo?.accessToken}`
            }
        })
            .then(response => {
                console.log(response.data)
                setScientificpublication(response.data);
            })
            .catch(error => {
                console.log(error, 'error');
            });
    }
    const handleCancel = () => {
        setOpen(false);
        // setEditingData(null);
    };
    const columns = [
        {
            title: '№',
            width: 50,
            render: (item, record, index) => (<>{index + 1}</>)
        },
        {
            title: 'Int.mulk turi',
            render: (item, record, index) => (<>{item?.intellectualPropertyPublicationType?.name}</>),
            width: 150
        },
        {
            title: 'Int.mulk nomi',
            dataIndex: 'scientificName',
            width: 350,
        },
        {
            title: 'Mualliflar',
            render: (item) => (<ol>
                <li>{fulInfo.secondName + ' ' + fulInfo.firstName + ' ' + fulInfo.thirdName}</li>
                {JSON.parse(item?.authors).map((itemm) => (
                    <li key={itemm.id}>
                        {itemm.name + ' (' + itemm?.workplace + ' ' + itemm.position + ')'}
                    </li>
                ))}
            </ol>),
            width: 350
        },
        {
            title: 'Int.mulk raqami',
            dataIndex: 'intellectualPropertyNumber',
            width: 150
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
    ];

    function getIntelektualMulk() {
        axios.get(`${ApiName}/api/publication/current-user`, {
            headers: {
                Authorization: `Bearer ${fulInfo?.accessToken}`
            },
            params: {
                size: tableParams.pagination.pageSize,
                page: tableParams.pagination.current>0 ? tableParams.pagination.current-1 : 0,
                type: 'INTELLECTUAL_PROPERTY',
                publicationName: srcItem?.srcInput,
                scientificPublicationType: srcItem?.srcType,
                fromlocalDate: DateListe[0],
                tolocalDate: DateListe[1]
            }
        }).then((response) => {
            console.log(response.data.data.content)
            setTableParams({
                ...tableParams,
                pagination: {
                    pageSize: response.data.data.size,
                    total: response.data.data.totalElements
                }
            })
            const fetchedData = response?.data?.data?.content.map(item => ({...item, key: item.id}));
            setDataList(fetchedData);
        }).catch((error) => {
            console.log('API error:', error);
            message.error('Failed to fetch data');
        });
    }

  return (
    <div className='p-4'>
    <Modal
        title="Intelektual mulk punkti"
        centered
        open={open}
        onCancel={() => setOpen(false)}
        width={1600}
        style={{right:"-80px"}}
      >
        <IntMulkModal publicationType="INTELLECTUAL_PROPERTY" handleCancel={handleCancel}/>
      </Modal>
            
            <div className=' d-flex  align-items-center justify-content-between'>
                <Form form={form} layout="vertical" ref={formRef} colon={false}

                      className='d-flex align-items-center gap-4'
                >
                    <Form.Item label="Mudatini belgilang" name="srcDate">
                        <DatePicker.RangePicker size="large" name="srcDate" format="YYYY-MM-DD"
                                                onChange={onChangeDate}/>
                    </Form.Item>

                    <Form.Item label="Intelektual mulk turi" name="srcType">
                        <Select name="srcType" style={{width: 300,}}  placeholder='Intelektual mulk turi'
                                options={Scientificpublication[0]?.options?.map(item => ({
                                    label: item.name,
                                    value: item.code
                                }))}
                                onChange={(value, option) => setSrcItem({...srcItem, srcType: option.value})}
                        />
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
                    <span className="button__text">Intelektual mulk</span>
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
                pagination={
                    {
                        total: tableParams.pagination.total,
                        pageSize: tableParams.pagination.pageSize,
                        onChange: (page, pageSize) => {
                            setTableParams({
                                ...tableParams,
                                pagination: {
                                    pageSize: pageSize,
                                    total: page
                                }
                            })

                            getIntelektualMulk();
                        }
                    }
                }
                scroll={{
                    y: 660,
                }}
            />
        </div>
  )
}

export default InteliktualMulk
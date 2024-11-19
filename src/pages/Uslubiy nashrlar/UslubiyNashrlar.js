import React, {useState, useRef} from 'react';

import {
    Space, Table, Select, Modal,
    message, Form, DatePicker, Popconfirm, Input,Switch, notification
} from 'antd';
import {SearchOutlined } from '@ant-design/icons';
import './UslubiyNashrlar.scss'
import UslubiyNashrlarModal from '../../componenta/UslubiyNashrlarModal/UslubiyNashrlarModal';
import { useEffect } from 'react';
import {useNavigate} from "react-router-dom";
import { ClassifairGet, DeletIlmiyNashr, getUslubiyNashrPublikatsiya } from '../../api/general';
import { useMutation, useQuery } from 'react-query';
const UslubiyNashrlar = () => {
    const navigate = useNavigate();
    const fulInfo = JSON.parse(localStorage.getItem("myInfo"));
    const formRef = useRef(null);
    const [form] = Form.useForm();
    const [DateListe, setDateListe] = useState(['', '']);
    const [open, setOpen] = useState(false)
    const [editingData, setEditingData] = useState(null);
    const [dataList, setDataList] = useState([]);
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 0,
            pageSize: 10,
            total: 10
        },
    });
    const [srcItem, setSrcItem] = useState({});
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
            title: 'Uslubiy nashir turi',
            render: (item, record, index) => (<>{item.stylePublicationType.name}</>),
            width: 200,
        },
        {
            title: 'Nashrning bibliografik matni',
            dataIndex: 'scientificName',
            width: 200,
        },
        {
            title: 'Mualliflar',
            render: (item) => (<ol>
                {JSON.parse(item.authors)?.map((itemm) => (
                    <li key={itemm.id}>
                        {itemm.name + ' (' + itemm?.workplace + ' ' + itemm.position + ')'}
                    </li>
                ))}
            </ol>),
            width: 350
        },
        {
            title: 'Mualliflar soni',
            dataIndex: 'authorCount',
            width: 80,
        },
        {
            title: 'Nashr yili',
            dataIndex: 'issueYear',
            width: 150
        },
        {
            title: 'Uslubiy nashr turi',
            render: (item, record, index) => (<>{item?.stylePublicationType?.name}</>),
            width: 150
        },
        {
            title: 'Uslubiy nashr tili',
            width: 100,
            render: (item, record, index) => (<>{item?.language}</>)
        },
        {
            title: 'url',
            render: (item, record, index) => (
                <a href={item.doiOrUrl===''? item.mediaIds[0].attachResDTO.url: item.doiOrUrl} target={"_blank"}>file</a>),
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
                    <Popconfirm title="Int.mulkni o'chirish"
                        description="Int.mulkni o'chirishni tasdiqlaysizmi?"
                        onConfirm={(e) => deletedUslubiyNashr.mutate(record.id)}
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

    const deletedUslubiyNashr = useMutation({
        mutationFn:(id)=>DeletIlmiyNashr({
        id,
        publicationStatus: 'DELETED'
      }),
      onSuccess:()=>{
          publication_List.refetch()
          notification.success({
              message: "Ma'lumot o'chirildi"
          })
      },
      onError:()=>{
          notification.error({
              message: "Ma'lumot o'chirishda xato"
          })
      }
      })

    const onEdit = (record) => {
        setEditingData(record);
        setOpen(true); // Modalni ochish uchun setOpen(true) funksiyasini chaqiramiz
    };
    useEffect(() => {
            publication_List.refetch()
    }, [srcItem]);

    const publication_List = useQuery({
        queryKey: ['publicationList_Uslubiy'],
        queryFn: () => getUslubiyNashrPublikatsiya({
            type: 'STYLE_PUBLICATIONS',
            size: tableParams.pagination.pageSize,
            page: tableParams.pagination.current>0 ? tableParams.pagination.current-1 : 0,
            publicationName: srcItem?.srcInput,
            stylePublicationType: srcItem?.srcType,
            fromlocalDate: DateListe[0],
            tolocalDate: DateListe[1]
        }).then(res => {
            const fetchedData = res?.data?.data?.content.map(item => ({...item, key: item.id}));
            setDataList(fetchedData);
            setTableParams({
                ...tableParams,
                pagination: {
                    pageSize: res?.data?.data?.size,
                    total: res?.data?.data?.totalElements
                }
            })

        }).catch((error) => {
            if (error?.response?.data?.message === "Token yaroqsiz!") {
                localStorage.removeItem("myInfo");
                navigate('/')
            }
            console.log('API error:', error);
            message.error('Failed to fetch data');
        })
    })

    const handleCancel = () => {
        setOpen(false);
        setEditingData(null);
    };
    
    const stylePublicationType = useQuery({
        queryKey: ['h_methodical_publication_type'],
        queryFn:() => ClassifairGet('h_methodical_publication_type').then(res=>res.data[0])
    })
  return (
    <>
    <div className='p-4'>
    <Modal
        title="Uslubiy nashrlar punkti"
        centered
        open={open}
        onCancel={handleCancel}
        width={1300}
        style={{right:"-80px"}}
        footer={null} 
      >
        <UslubiyNashrlarModal publicationType="STYLE_PUBLICATIONS" getIlmiyNashir={() => publication_List.refetch()} editingData={editingData}  handleCancel={handleCancel}/>

      </Modal>
            
            <div className=' d-flex  align-items-center justify-content-between'>
                <Form form={form} layout="vertical" ref={formRef} colon={false}
                      onFinish={() => publication_List.refetch()}
                      className=' d-flex align-items-center gap-4'
                >
                    <Form.Item label="Mudatini belgilang"
                               name="srcDate"
                               >
                        <DatePicker.RangePicker
                            // placeholder={["Bosh sana", 'Tugash sana']}
                            name="srcDate" format="YYYY-MM-DD" onChange={onChangeDate}/>
                    </Form.Item>
                    <Form.Item label="Uslubiy nashr nomi" name="srcInput">
                        <Input name='srcInput' size="large" style={{width: '400px'}}
                               placeholder="Uslubiy nashr nomi bo'yicha qidirish"
                               onChange={(e) => {
                                   setSrcItem({...srcItem, srcInput: e.target.value})
                               }}/>
                    </Form.Item>
                    <Form.Item label="Uslubiy nashr turi" name="srcType">
                        <Select name="srcType" labelInValue style={{width: 300,}}
                                options={stylePublicationType?.data?.options?.map(item => ({
                                    label: item.name,
                                    value: item.code
                                }))}
                                onChange={(value, option) => setSrcItem({...srcItem, srcType: option.value})}
                        />
                    </Form.Item>
                    <Form.Item>
                        <button className="btn btn-success mt-4" type="submit">
                            <span className="button__text"><SearchOutlined /></span>
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
                    setTableParams({
                        ...tableParams,
                        pagination: {
                            pageSize: pageSize,
                            total: page
                        }
                    })
                  }
                }
             }
            />
        </div>
    </>
  )
}

export default UslubiyNashrlar
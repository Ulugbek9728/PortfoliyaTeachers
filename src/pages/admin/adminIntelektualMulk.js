import React, {useEffect, useRef, useState} from 'react';
import {DatePicker, Form, notification, Popconfirm, Select, Space, Switch, Table, Tooltip} from "antd";
import {SearchOutlined} from "@ant-design/icons";
import {ClassifairGet, getFaculty, getIlmiyNashir, getProfile, ToglActiveStatus,ToglActiveStatusKPIand1030} from "../../api/general";
import {CheckOutlined, CloseOutlined, MenuFoldOutlined,} from "@ant-design/icons";
import {useSearchParams} from 'react-router-dom';
import {useMutation, useQuery} from "react-query";
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';


dayjs.extend(customParseFormat);
function AdminIntelektualMulk(props) {
    const [searchParams, setSearchParams] = useSearchParams();
    const [isDisabled, setIsDisabled] = useState(true); 
    const formRef = useRef(null);
    const [form] = Form.useForm();
    const [srcItem, setSrcItem] = useState({
        dataSrc: [searchParams.get('from') || null, searchParams.get('to') || null],
        faculty: searchParams.get('faculty') || null,
        department: searchParams.get('department') || null,
        employeeId: searchParams.get('employeeId') || null,
        srcType: searchParams.get('srcType') || null,
    });

    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 0,
            pageSize: 10,
            total: 10
        },
    });

    const Scientificpublication = useQuery({
        queryKey: ['Intelektual_mulk_turi'],
        queryFn: () => ClassifairGet('h_patient_type').then(res => res.data[0])
    })
    const {data} = useQuery({
        queryKey: ["FacultyList"],
        queryFn: () => getFaculty(11, '').then(res => res.data)
    })
    const kafedraList = useQuery({
        queryKey: ["Kafedra"],
        queryFn: () => getFaculty(12, srcItem?.faculty).then(res =>
            res?.data
        )
    })
    const teacher_List = useQuery({
        queryKey: ['teacherList'],
        queryFn: () => getProfile(
            {
                facultyId:srcItem?.faculty,
                departmentId:srcItem?.department,
                query:srcItem?.query
            }).then(res => res.data?.data?.content)
    })
    const publication_List = useQuery({
        queryKey: ['publicationList'],
        queryFn: () => getIlmiyNashir({
            fromlocalDate: srcItem?.dataSrc[0],
            tolocalDate: srcItem?.dataSrc[1],
            type: "INTELLECTUAL_PROPERTY",
            employeeId: srcItem?.employeeId,
            scientificPublicationType: srcItem?.srcType,
            facultyId: srcItem?.faculty,
            departmentId: srcItem?.department,
            status: srcItem?.status,
            kpi: srcItem?.kpi,
            rule1030: srcItem?.rule1030,
        }).then(res => res?.data?.data?.content)
    })
    const KPIand1030 = useMutation({
        mutationFn: (e) => {
            let newStatus1030
            let newStatusKPI
            if (e?.key === "1030") {
                newStatus1030 = !e?.record?.rule1030;
                newStatusKPI = e?.record?.kpi
            } else {
                newStatusKPI = !e?.record?.kpi;
                newStatus1030 = e?.record?.rule1030;
            }
            ToglActiveStatusKPIand1030({
                publicationId: e?.record?.id,
                kpi: newStatusKPI,
                rule1030: newStatus1030
            }).then((res)=>{
                notification.success({
                    message: "Status o'zgardi"
                })
                publication_List.refetch()
            })
        },
    })

    const Status = useMutation({
        mutationFn: (e) => {
            console.log(e)
            let newStatus = e?.publicationStatus === "ACTIVE" || e?.publicationStatus==="REJECTED" ? "ACCEPTED" : "REJECTED";

            ToglActiveStatus({
                id: e?.id,
                publicationStatus: newStatus
            }).then((res)=>{
                publication_List.refetch()
                notification.success({
                    message: "Status o'zgardi"
                })

            }).catch((error)=>notification.error({message:"Status error"}))
        },

    })
    const onChangeDate = (value, dateString) => {
        if (value === null) {
            setSrcItem({
                ...srcItem,
                dataSrc: dateString
            })
            searchParams.delete('from');
            searchParams.delete('to');
            setSearchParams(searchParams, {replace: true});
        } else {
            setSrcItem({
                ...srcItem,
                dataSrc: dateString
            })
            setSearchParams((prevParams) => {
                prevParams.set("from", dateString[0]);
                return prevParams;
            }, {replace: true});
            setSearchParams((prevParams) => {
                prevParams.set("to", dateString[1]);
                return prevParams;
            }, {replace: true});
        }
    };

    useEffect(() => {
        if (srcItem?.faculty) {
            kafedraList.refetch();
        }
        teacher_List.refetch()
        publication_List.refetch()
    }, [srcItem]);

    const onSearch = (value) => {
        setSrcItem({
            ...srcItem,
            query: value
        })
    };

    const columns = [
        {
            title: '№',
            width: 50,
            render: (item, record, index) => (<>{index + 1}</>)
        },
        {
            title: 'Int.mulk turi',
            render: (item) => (<>{item?.intellectualPropertyPublicationType?.name}</>),
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
                {JSON.parse(item?.authors).map((itemm) => (
                    <li key={itemm?.id}>
                        {itemm?.name + ' (' + itemm?.workplace + ' ' + itemm?.position + ')'}
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
            title: "O'quv yili",
            dataIndex: 'issueYear',
            width: 100
        },
        {
            title: 'url',
            render: (item, record, index) => (
                <a href={item.doiOrUrl  ? item.doiOrUrl : item.mediaIds[0].attachResDTO.url }
                   target={"_blank"}>file</a>),
            width: 50
        },
        {
            title: "Status",
            width: 80,
            render: (text, record) => (
                <Switch
                    checkedChildren={<CheckOutlined/>}
                    unCheckedChildren={<CloseOutlined/>}
                    checked={record.publicationStatus === "ACCEPTED"}
                    onChange={() => Status.mutate(record)}
                />
            )

        },
        {
            title: "1030",
            width: 80,
            render: (text, record) => (
                <Switch
                    checkedChildren={<CheckOutlined/>}
                    unCheckedChildren={<CloseOutlined/>}
                    checked={record?.rule1030}
                    onChange={() => KPIand1030.mutate({record, key: "1030"})}
                />
            )
        },
        {
            title: "KPI",
            width: 80,
            render: (text, record) => (
                <Tooltip title={isDisabled ? 'Bu funksiya mavjud emas' : ''}>
                <Switch
                    checkedChildren={<CheckOutlined/>}
                    unCheckedChildren={<CloseOutlined/>}
                    checked={record?.kpi}
                    disabled= {isDisabled}
                    onChange={() => KPIand1030.mutate({record, key: "KPI"})}
                />
                </Tooltip>
            )
        },
        {
            title: 'Tekshirish',
            dataIndex: 'address',
            width: 100
        },

        // {
        //     title: "So'rov Faol",
        //     width: 150,
        //     render: (text, record) => (
        //         <Switch
        //             checked={record?.publicationStatus === "ACTIVE"}
        //             onChange={() => toggleActiveStatus(record)}
        //         />
        //     )
        // },
        // {
        //     title: 'Harakatlar',
        //     width: 150,
        //     render: (text, record) => (
        //         <Space size="middle">
        //             <button type="primary" className='editBtn'
        //                     style={{"minWidth": '30px'}}
        //                     onClick={() => onEdit(record)}
        //             >
        //                 <svg height="1em" viewBox="0 0 512 512">
        //                     <path
        //                         d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"
        //                     ></path>
        //                 </svg>
        //             </button>
        //             <Popconfirm title="Int.mulkni o'chirish"
        //                         description="Int.mulkni o'chirishni tasdiqlaysizmi?"
        //                         onConfirm={(e) => handleDelete(record.id)}
        //                         okText="Ha" cancelText="Yo'q"
        //             >
        //                 <button className="delet"
        //                 >
        //                     <svg
        //                         className="bin-top"
        //                         viewBox="0 0 39 7"
        //                         fill="none"
        //                         xmlns="http://www.w3.org/2000/svg"
        //                     >
        //                         <line y1="5" x2="39" y2="5" stroke="white" strokeWidth="4"></line>
        //                         <line
        //                             x1="12"
        //                             y1="1.5"
        //                             x2="26.0357"
        //                             y2="1.5"
        //                             stroke="white"
        //                             strokeWidth="3"
        //                         ></line>
        //                     </svg>
        //                     <svg
        //                         className="bin-bottom"
        //                         viewBox="0 0 33 39"
        //                         fill="none"
        //                         xmlns="http://www.w3.org/2000/svg"
        //                     >
        //                         <mask id="path-1-inside-1_8_19" fill="white">
        //                             <path
        //                                 d="M0 0H33V35C33 37.2091 31.2091 39 29 39H4C1.79086 39 0 37.2091 0 35V0Z"
        //                             ></path>
        //                         </mask>
        //                         <path
        //                             d="M0 0H33H0ZM37 35C37 39.4183 33.4183 43 29 43H4C-0.418278 43 -4 39.4183 -4 35H4H29H37ZM4 43C-0.418278 43 -4 39.4183 -4 35V0H4V35V43ZM37 0V35C37 39.4183 33.4183 43 29 43V35V0H37Z"
        //                             fill="white"
        //                             mask="url(#path-1-inside-1_8_19)"
        //                         ></path>
        //                         <path d="M12 6L12 29" stroke="white" strokeWidth="4"></path>
        //                         <path d="M21 6V29" stroke="white" strokeWidth="4"></path>
        //                     </svg>
        //                 </button>
        //             </Popconfirm>
        //
        //         </Space>
        //     ),
        // },
    ];

    function onChangeField(fieldKey, value) {
        if (value === undefined) {
            searchParams.delete(fieldKey);
            setSearchParams(searchParams, {replace: true});
            setSrcItem({...srcItem, [fieldKey]: null});
        } else {
            setSrcItem({...srcItem, [fieldKey]: value});
            setSearchParams((prevParams) => {
                prevParams.set(fieldKey, value);
                return prevParams;
            }, {replace: true});
        }
    }

    return (
        <div>
            <Form form={form}
                  layout="vertical"
                  ref={formRef}
                  colon={false}
                  className='d-flex align-items-center gap-4'
                  fields={[
                      {
                          name: "srcDate",
                          value: srcItem.dataSrc[0] && srcItem.dataSrc[1] ? [dayjs(srcItem.dataSrc[0], 'YYYY-MM-DD'), dayjs(srcItem.dataSrc[1], 'YYYY-MM-DD')] : null
                      },
                      {
                          name: "facultyId",
                          value: srcItem?.faculty
                      },
                      {
                          name: "kafedraId",
                          value: srcItem?.department
                      },
                      {
                          name: "srcPerson",
                          value: srcItem?.employeeId
                      },
                      {
                          name: "srcType",
                          value: srcItem?.srcType
                      },
                  ]}
            >
                <Form.Item label="Mudatini belgilang" name="srcDate">
                    <DatePicker.RangePicker
                        allowClear size="large" style={{width: 250,}} name="srcDate"
                        format="YYYY-MM-DD"
                        onChange={onChangeDate}/>
                </Form.Item>
                <Form.Item name="facultyId"
                           rules={[{required: true, message: 'Fakultetni tanlang'}]}
                           label="Fakultetni tanlang"
                >
                    <Select style={{width: 250,}}
                            name="facultyId"
                            allowClear
                            placeholder='Facultet'
                            onChange={(value) => {
                                onChangeField('faculty', value);
                            }}
                            options={data?.map((item, index) => (
                                {value: item.id, label: item.name, key: item.id}
                            ))}
                    />

                </Form.Item>
                <Form.Item
                    name="kafedraId"
                    rules={[
                        {
                            required: true,
                            message: 'Kafedrani tanlang'
                        }
                    ]}
                    label="Kafedrani tanlang"
                >
                    <Select style={{width: 250,}}
                            name={"kafedraId"}
                            allowClear
                            onChange={(value) => {
                                onChangeField('department', value);
                            }}
                            placeholder='Kafedrani'
                            options={kafedraList?.data?.map((item, index) => (
                                {value: item.id, label: item.name, key: item.id}
                            ))}
                    />

                </Form.Item>

                <Form.Item label="O'qituvchini tanlang" name="srcPerson">
                    <Select style={{width: 250,}}
                            showSearch
                            allowClear
                            name='srcPerson'
                            placeholder="O'qituvchi"
                            onChange={(value) => {
                                onChangeField('employeeId', value);
                            }}
                            onSearch={onSearch}
                            options={teacher_List?.data?.map((item, index) => (
                                {value: item.id, label: item.fullName, key: item.id}
                            ))}
                    />
                </Form.Item>

                <Form.Item label="Intelektual mulk turi" name="srcType">
                    <Select name="srcType" labelInValue style={{width: 250,}} placeholder='Intelektual mulk turi'
                            options={Scientificpublication?.data?.options.map(item => ({
                                label: item.name,
                                value: item.code
                            }))}
                            onChange={(value) => {
                                onChangeField('srcType', value?.value);
                            }}
                    />
                </Form.Item>
            </Form>

            <div className="mt-4">
                <Table
                    rowKey="id"
                    columns={columns}
                    dataSource={publication_List?.data}
                    loading={publication_List?.isLoading}
                    scroll={{y: 550}}
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
                            }
                        }
                    }
                />
            </div>
        </div>
    );
}

export default AdminIntelektualMulk;
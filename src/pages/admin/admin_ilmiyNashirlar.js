import React, {useEffect, useRef, useState} from 'react';
import {DatePicker, Form, Select, Table, Drawer, Switch, Space, Tag, Input, notification, Tooltip} from "antd";
import {MenuFoldOutlined, CheckOutlined, CloseOutlined, EditOutlined} from "@ant-design/icons";
import {
    ClassifairGet,
    getFaculty,
    getIlmiyNashir,
    getProfile,
    ToglActiveStatus,
    ToglActiveStatusKPIand1030,
    Comment,
    getComment
} from "../../api/general";
import {useSearchParams} from 'react-router-dom';
import {useMutation, useQuery} from "react-query";
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

const {TextArea} = Input;
dayjs.extend(customParseFormat);

function AdminIlmiyNashirlar(props) {
    const [searchParams, setSearchParams] = useSearchParams();
    const formRef = useRef(null);
    const [form] = Form.useForm();
    const [form2] = Form.useForm();
    const [form3] = Form.useForm();
    const [srcItem, setSrcItem] = useState({
        dataSrc: [searchParams.get('from') || null, searchParams.get('to') || null],
        faculty: searchParams.get('faculty') || null,
        department: searchParams.get('department') || null,
        employeeId: searchParams.get('employeeId') || null,
        srcType: searchParams.get('srcType') || null,
        publicationDatabase: searchParams.get('publicationDatabase') || null,
        scientificField: searchParams.get('scientificField') || null,
        status: searchParams.get('status') || null,
        kpi: searchParams.get('kpi') || null,
        rule1030: searchParams.get('rule1030') || null,
    });
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 0,
            pageSize: 10,
            total: 10
        },
    });
    const [open, setOpen] = useState(false);
    const [open1, setOpen1] = useState(false);
    const [messages, seMessages] = useState(null);
    const [publicationID, setPublicationID] = useState(null);
    const [isDisabled, setIsDisabled] = useState(true);
    const Scientificpublication = useQuery({
        queryKey: ['Ilmiy_nashr_turi'],
        queryFn: () => ClassifairGet('h_scientific_publication_type').then(res => res.data[0])
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
        queryFn: () => getProfile({
            facultyId: srcItem?.faculty,
            departmentId: srcItem?.department,
            query: srcItem?.query
        }).then(res => res.data?.data?.content)
    })
    const publication_List = useQuery({
        queryKey: ['publicationList'],
        queryFn: () => getIlmiyNashir({
            fromlocalDate: srcItem?.dataSrc[0],
            tolocalDate: srcItem?.dataSrc[1],
            type: "SCIENTIFIC_PUBLICATIONS",
            employeeId: srcItem?.employeeId,
            scientificPublicationType: srcItem?.srcType,
            facultyId: srcItem?.faculty,
            departmentId: srcItem?.department,
            status: srcItem?.status,
            kpi: srcItem?.kpi,
            rule1030: srcItem?.rule1030,
            publicationDatabase: srcItem?.publicationDatabase,
            scientificField: srcItem?.scientificField
        }).then(res => res?.data?.data?.content)
    })
    const Xalqaro = useQuery({
        queryKey: ['h_publication_database'],
        queryFn: () => ClassifairGet('h_publication_database').then(res => res.data[0])
    })
    const IlmFan = useQuery({
        queryKey: ['h_science_branch'],
        queryFn: () => ClassifairGet('h_science_branch').then(
            res => res.data[0]?.options?.filter(item => item?.code?.endsWith('00.00')))
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
            }).then((res) => {
                notification.success({
                    message: "Status o'zgardi"
                })
                publication_List.refetch()
            })
        },
    })
    const Status = useMutation({
        mutationFn: (e) => {
            let newStatus = e?.publicationStatus === "ACTIVE" || e?.publicationStatus === "REJECTED" ? "ACCEPTED" : "REJECTED";

            ToglActiveStatus({
                id: e?.id,
                publicationStatus: newStatus
            }).then((res) => {
                publication_List.refetch()
                notification.success({
                    message: "Status o'zgardi"
                })

            }).catch((error) => notification.error({message: "Status error"}))
        },

    })
    const CommentPost = useMutation({
        mutationFn: (e) => {
            Comment({
                content: e.izox,
                publicationId: publicationID
            }).then((res) => {
                publication_List.refetch()
                form3.resetFields()
                setOpen1(false)
                notification.success({
                    message: "Izox yuborildi"
                })
            }).catch((error) => notification.error({message: "Izox error"}))
        },

    })
    const CommentAll = useMutation({
        mutationFn: (e) => {
            getComment(e).then((res) => {
                setMessages(res?.data.data.reverse())
            }).catch((error) => console.log(error))
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
            width: 150,
        },
        {
            title: "Ilm-fan sohasi",
            render: (item, record, index) => (<>{item?.scientificField?.name}</>),
            width: 150,
        },
        {
            title: "Xalqaro ilmiy bazalar",
            render: (item, record, index) => (<>{item?.publicationDatabase?.name}</>),
            width: 150,
        },
        {
            title: 'Mualliflar soni',
            dataIndex: 'authorCount',
            width: 80,
        },
        {
            title: 'Mualliflar',
            render: (item) => (<ol>
                {JSON.parse(item.authors).map((itemm) => (
                    <li key={itemm.id}>
                        {itemm.name + ' (' + itemm?.workplace + ' ' + itemm.position + ')'}
                    </li>
                ))}
            </ol>),
            width: 300
        },
        {
            title: 'Nashr yili',
            dataIndex: 'issueYear',
            width: 150
        },
        {
            title: 'url',
            render: (item, record, index) => (
                <a href={item.doiOrUrl ? item.doiOrUrl : item.mediaIds[0].attachResDTO.url}
                   target={"_blank"}>file</a>),
            width: 80
        },
        {
            title: 'Ilmiy yoki ilmiy texnik kengash qarori',
            dataIndex: 'decisionScientificCouncil',
            width: 150
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
                    disabled={isDisabled}
                    checkedChildren={<CheckOutlined/>}
                    unCheckedChildren={<CloseOutlined/>}
                    checked={record?.kpi}
                    onChange={() => KPIand1030.mutate({record, key: "KPI"})}
                />
            </Tooltip>
            )
        },
        {
            title: 'Izox',
            width: 100,
            render: (text, record) => (
                <button type="primary" className='btn btn-primary'
                        style={{"minWidth": '30px'}}
                        onClick={() => {
                            setOpen1(true)
                            setPublicationID(record?.id)
                            CommentAll.mutate(record?.id)
                        }}
                >
                    <MessageOutlined />
                </button>
            ),
        },
    ];

    function onChangeField(fieldKey, value) {
        if (value === undefined || value === false) {
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

    function onChangeFieldClear(fieldKey) {
        searchParams.delete(fieldKey);
        setSearchParams(searchParams, {replace: true});
        setSrcItem({...srcItem, [fieldKey]: null});
    }

    return (
        <div>
            <Form form={form}
                  layout="vertical"
                  ref={formRef}
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
                          name: "Status",
                          value: srcItem?.status
                      },
                      {
                          name: "1030",
                          value: srcItem?.rule1030
                      },
                      {
                          name: "kpi",
                          value: srcItem?.kpi
                      }
                  ]}
            >
                <Form.Item label="Mudatini belgilang" name="srcDate">
                    <DatePicker.RangePicker
                        allowClear size="large" style={{width: 250,}} name="srcDate"
                        format="YYYY-MM-DD"
                        onChange={onChangeDate}/>
                </Form.Item>
                <Form.Item name="facultyId"
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
                <Form.Item label="Status" name="Status">
                    <Select style={{width: 250,}}
                            name="Status"
                            allowClear
                            placeholder='Stasus'
                            onChange={(value) => {
                                onChangeField('status', value);
                            }}
                            options={[
                                {
                                    label: "Yangi",
                                    value: 'ACTIVE'
                                },
                                {
                                    label: "Qabul qilingan",
                                    value: 'ACCEPTED'
                                },
                                {
                                    label: "Qabul qilinmagan",
                                    value: 'REJECTED'
                                }
                            ]}
                    />
                </Form.Item>
                <div className="d-flex justify-content-between align-items-center">
                    <Form.Item
                        label="1030"
                        name="1030"
                    >
                        <Switch
                            name='1030'
                            checkedChildren={<CheckOutlined/>}
                            unCheckedChildren={<CloseOutlined/>}
                            checked={srcItem?.rule1030}
                            onChange={() => {
                                onChangeField('rule1030', !srcItem?.rule1030);
                            }}
                        />

                    </Form.Item>
                    <Form.Item
                        label="KPI"
                        name="kpi"
                    >
                     <Tooltip title={isDisabled ? 'Bu funksiya mavjud emas' : ''}>
                        <Switch
                            name='kpi'
                            checkedChildren={<CheckOutlined/>}
                            unCheckedChildren={<CloseOutlined/>}
                            checked={srcItem?.kpi}
                            disabled={isDisabled}
                            onChange={() => {
                                onChangeField('kpi', !srcItem?.kpi);
                            }}
                        />
                     </Tooltip>
                    </Form.Item>
                </div>
                <Form.Item label=' '>
                    <button className='btn btn-primary' onClick={() => setOpen(true)}>
                        <MenuFoldOutlined/>
                    </button>
                </Form.Item>
            </Form>

            <Form className='d-flex align-items-center gap-4'
                  layout="vertical"
                  ref={formRef}
                  colon={false}>
                {
                    srcItem?.srcType ? <Form.Item label='Ilmiy nashr turi'>
                        <Tag bordered={false} name='122' color="processing" closable
                             onClose={(e) => onChangeFieldClear("srcType")}
                        >
                            {
                                Scientificpublication?.data?.options?.filter((item) => item?.code === srcItem?.srcType)[0].name
                            }
                        </Tag>
                    </Form.Item> : ''
                }
                {
                    srcItem?.publicationDatabase ? <Form.Item label='Xalqaro ilmiy baza'>
                        <Tag bordered={false} color="processing" closable
                             onClose={(e) => onChangeFieldClear("publicationDatabase")}
                        >
                            {
                                Xalqaro?.data?.options?.filter((item) => item?.code === srcItem?.publicationDatabase)[0].name
                            }
                        </Tag>
                    </Form.Item> : ''
                }
                {
                    srcItem?.scientificField ? <Form.Item label='Ilm-fan sohasi'>
                        <Tag bordered={false} color="processing" closable
                             onClose={(e) => onChangeFieldClear("scientificField")}
                        >
                            {
                                IlmFan?.data?.filter((item) => item?.code === srcItem?.scientificField)[0].name
                            }
                        </Tag>
                    </Form.Item> : ''
                }

            </Form>

            <Drawer title="Filter" onClose={() => setOpen(false)} open={open}>
                <Form form={form2}
                      layout="vertical"
                      ref={formRef}
                      fields={[
                          {
                              name: "srcType",
                              value: srcItem?.srcType
                          },
                          {
                              name: "publicationDatabase",
                              value: srcItem?.publicationDatabase
                          },
                          {
                              name: "scientificField",
                              value: srcItem.scientificField
                          }
                      ]}
                >
                    <Form.Item
                        label="Ilmiy nashr turi"
                        name="srcType">
                        <Select value={srcItem?.srcType} name="srcType" allowClear
                                placeholder='Ilmiy nashr turi'
                                options={Scientificpublication?.data?.options.map(item => ({
                                    label: item?.name,
                                    value: item?.code
                                }))}
                                onChange={(value) => {
                                    onChangeField('srcType', value);
                                }}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Xalqaro ilmiy bazalar"
                        name="publicationDatabase"
                    >
                        <Select name="publicationDatabase" allowClear
                                placeholder='Xalqaro ilmiy bazalar'
                                options={Xalqaro?.data?.options?.map(item => ({
                                    label: item.name,
                                    value: item.code
                                }))}
                                onChange={(value) =>
                                    onChangeField('publicationDatabase', value)}>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Ilm-fan sohasi"
                        name="scientificField"
                    >
                        <Select name="scientificField" allowClear
                                placeholder='Ilm-fan sohasi'
                                options={IlmFan?.data?.map(item => ({label: item.name, value: item.code}))}
                                onChange={(value) => onChangeField("scientificField", value)}>
                        </Select>
                    </Form.Item>

                </Form>
            </Drawer>
            <Drawer title="Izoxlar" onClose={() => setOpen1(false)} open={open1}>
                <div className="comentariya">
                    {
                        messages?.map((item) =>{
                            return  <div className="d-flex">
                                <span>{item?.createdDate.slice(0,10)}</span>
                                <p>
                                    {item?.content}
                                </p>
                            </div>
                        }
                        )
                    }
                </div>
                <Form
                    form={form3}
                    layout="vertical"
                    ref={formRef} className="d-flex align-items-center justify-content-between mt-3"
                    onFinish={(e) => CommentPost.mutate(e)}
                >
                    <Form.Item name='izox'>
                        <TextArea placeholder="Rad etishga izox yozing" allowClear
                                  style={{height: 100, width: 250, resize: 'none',}}/>
                    </Form.Item>
                    <Form.Item>
                        <button className="btn btn-success">
                            <CheckOutlined/>
                        </button>
                    </Form.Item>

                </Form>
            </Drawer>

            <div className="mt-4">
                <Table
                    rowKey="id"
                    columns={columns}
                    dataSource={publication_List?.data}
                    // scroll={{y: 550}}
                    loading={publication_List.isLoading}

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

export default AdminIlmiyNashirlar;
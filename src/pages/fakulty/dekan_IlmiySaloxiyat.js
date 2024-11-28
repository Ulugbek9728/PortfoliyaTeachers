import React, {useEffect, useRef, useState} from 'react';
import {DatePicker, Drawer, Form, Input, notification, Select, Switch, Table, Tag, Tooltip} from "antd";
import {
    Comment, EmployeeStatus, EmployeeStatusKPIand1030, getComment,
    getFaculty, getIlmiySaloxiyat, getProfile,
} from "../../api/general";
import {useSearchParams} from 'react-router-dom';
import {useMutation, useQuery} from "react-query";
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {CheckOutlined, CloseOutlined, MenuFoldOutlined, MessageOutlined} from "@ant-design/icons";

dayjs.extend(customParseFormat);
const {TextArea} = Input;


function DekanIlmiySaloxiyat(props) {
    const fulInfo = JSON.parse(localStorage.getItem("myInfo"));
    const fakultyInfo = fulInfo.roleInfos.filter((item) => item?.faculty?.id != null)

    const [searchParams, setSearchParams] = useSearchParams();
    const formRef = useRef(null);
    const [form] = Form.useForm();
    const [form1] = Form.useForm();
    const [form2] = Form.useForm();
    const [open, setOpen] = useState(false);
    const [open1, setOpen1] = useState(false);
    const [messages, setMessages] = useState(null);

    const [isDisabled, setIsDisabled] = useState(true);
    const [srcItem, setSrcItem] = useState({
        dataSrc: [searchParams.get('from') || null, searchParams.get('to') || null],
        facultyId: fakultyInfo[0]?.faculty?.id,
        department: searchParams.get('department') || null,
        profileId: searchParams.get('profileId') || null,
        srcType: searchParams.get('srcType') || null,
        status: searchParams.get('status') || null,
        kpi: searchParams.get('kpi') || null,
        rule1030: searchParams.get('rule1030') || null,
    });
    const [publicationID, setPublicationID] = useState(null);
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 0,
            pageSize: 10,
            total: 10
        },
    });

    const kafedraList = useQuery({
        queryKey: ["Kafedra"],
        queryFn: () => getFaculty(12, srcItem?.facultyId).then(res =>
            res?.data
        )
    })
    const teacher_List = useQuery({
        queryKey: ['teacherList'],
        queryFn: () => getProfile(
            {
                facultyId: srcItem?.facultyId,
                departmentId: srcItem?.department,
                query: srcItem?.query
            }).then(res => res.data?.data?.content)
    })

    const publication_List = useQuery({
        queryKey: ['scientificPublication'],
        queryFn: () => getIlmiySaloxiyat({
            fromlocalDate: srcItem?.dataSrc[0],
            tolocalDate: srcItem?.dataSrc[1],
            profileId: srcItem?.profileId,
            type: "SCIENTIFIC_POTENTIAL",
            scientificLeadershipType: srcItem?.srcType,
            facultyId: srcItem?.facultyId,
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
            EmployeeStatusKPIand1030({
                employeeStudentId: e?.record?.id,
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
            let newStatus = e?.status === "ACTIVE" || e?.status === "REJECTED" ? "ACCEPTED" : "REJECTED";

            EmployeeStatus({
                id: e?.id,
                status: newStatus
            }).then((res)=>{
                publication_List.refetch()
                notification.success({
                    message: "Status o'zgardi"
                })

            }).catch((error)=>notification.error({message:"Status error"}))
        },

    })

    const CommentAll = useMutation({
        mutationFn: (e) => {
            getComment(e).then((res) => {
                setMessages(res?.data.data.reverse())
            }).catch((error) => console.log(error))
        },
    })

    const CommentPost = useMutation({
        mutationFn: (e) => {
            Comment({
                content: e.izox,
                publicationId: publicationID
            }).then((res) => {
                publication_List.refetch()
                form1.resetFields()
                setOpen(false)
                notification.success({
                    message: "Izox yuborildi"
                })
            }).catch((error) => notification.error({message: "Izox error"}))
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
        kafedraList.refetch();
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
            render: (item, record, index) => (<>{item?.student?.fullName} ({item?.student?.workplace} {item?.student?.position})</>),
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
            title: "Status",
            width: 80,
            render: (text, record) => (
                <Switch
                    checkedChildren={<CheckOutlined/>}
                    unCheckedChildren={<CloseOutlined/>}
                    checked={record.status === "ACCEPTED"}
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
                        disabled={isDisabled}
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
                            setOpen(true)
                            setPublicationID(record?.id)
                            CommentAll.mutate(record?.id)
                        }}
                >
                    <MessageOutlined/>
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
                  colon={false}
                  className='d-flex align-items-center gap-4'
                  fields={[
                      {
                          name: "srcDate",
                          value: srcItem.dataSrc[0] && srcItem.dataSrc[1] ? [dayjs(srcItem.dataSrc[0], 'YYYY-MM-DD'), dayjs(srcItem.dataSrc[1], 'YYYY-MM-DD')] : null
                      },
                      {
                          name: "kafedraId",
                          value: srcItem?.department
                      },
                      {
                          name: "srcPerson",
                          value: srcItem?.profileId
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
                      },
                  ]}
            >
                <Form.Item label="Mudatini belgilang" name="srcDate">
                    <DatePicker.RangePicker
                        allowClear size="large" style={{width: 250,}} name="srcDate"
                        format="YYYY-MM-DD"
                        onChange={onChangeDate}/>
                </Form.Item>
                <Form.Item
                    name="kafedraId"
                    rules={[
                        {
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
                                onChangeField('profileId', value);
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
                    <button className='btn btn-primary' onClick={() => setOpen1(true)}>
                        <MenuFoldOutlined/>
                    </button>
                </Form.Item>

            </Form>
            <Form className='d-flex align-items-center gap-4'
                  layout="vertical"
                  ref={formRef}
                  colon={false}>
                {
                    srcItem?.srcType ? <Form.Item label='Uslubiy nashir turi'>
                        <Tag bordered={false} name='122' color="processing" closable
                             onClose={(e) => onChangeFieldClear("srcType")}
                        >
                            {
                                srcItem?.srcType
                            }
                        </Tag>
                    </Form.Item> : ''
                }

            </Form>
            <Drawer title="Filter" onClose={() => setOpen1(false)} open={open1}>
                <Form form={form2}
                      layout="vertical"
                      ref={formRef}
                      fields={[
                          {
                              name: "srcType",
                              value: srcItem?.srcType
                          },
                      ]}
                >
                    <Form.Item label="Ilmiy raxbarlik turi" name="srcType">
                        <Select name="srcType" allowClear labelInValue style={{width: 300,}}
                                placeholder='Ilmiy raxbarlik turi'
                                options={[
                                    {
                                        label: 'Fan nomzodi',
                                        value: 'Fan nomzodi'
                                    },
                                    {
                                        label: 'Falsafa doktori',
                                        value: 'Falsafa doktori'
                                    },
                                    {
                                        label: 'Fan doktori',
                                        value: 'Fan doktori'
                                    }
                                ]}
                                onChange={(value) => {
                                    onChangeField('srcType', value?.value);
                                }}
                        />
                    </Form.Item>
                </Form>
            </Drawer>

            <Drawer title="Izoxlar" onClose={() => setOpen(false)} open={open}>
                <div className="comentariya">
                    {
                        messages?.map((item) => {
                                return <div className="d-flex">
                                    <span>{item?.createdDate.slice(0, 10)}</span>
                                    <p>
                                        {item?.content}
                                    </p>
                                </div>
                            }
                        )
                    }
                </div>
                <Form
                    form={form1}
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
                    loading={publication_List.isLoading}
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

export default DekanIlmiySaloxiyat;
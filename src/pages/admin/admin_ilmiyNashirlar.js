import React, {useEffect, useRef, useState} from 'react';
import {DatePicker, Form, Select, Table, Drawer, Switch, Space, Tag, Input } from "antd";
import {MenuFoldOutlined, CheckOutlined, CloseOutlined} from "@ant-design/icons";
import {ClassifairGet, getFaculty, getIlmiyNashir, getProfile} from "../../api/general";
import {useSearchParams} from 'react-router-dom';
import {useQuery} from "react-query";
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

const { TextArea } = Input;
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
        srcDatabase: searchParams.get('srcDatabase') || null,
        scientificField: searchParams.get('scientificField') || null,
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
                <a href={item.doiOrUrl === '' ? item.mediaIds[0].attachResDTO.url : item.doiOrUrl}
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
                    // checked={record.publicationStatus === "ACTIVE"}
                    // onChange={() => toggleActiveStatus(record)}
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
                    // checked={record.publicationStatus === "ACTIVE"}
                    // onChange={() => toggleActiveStatus(record)}
                />
            )
        },
        {
            title: "KPI",
            width: 80,
            render: (text, record) => (
                <Switch
                    checkedChildren={<CheckOutlined/>}
                    unCheckedChildren={<CloseOutlined/>}
                    // checked={record.publicationStatus === "ACTIVE"}
                    // onChange={() => toggleActiveStatus(record)}
                />
            )
        },
        {
            title: 'Rad etish',
            width: 100,
            render: (text, record) => (

                    <button type="primary" className='btn btn-danger'
                            style={{"minWidth": '30px'}}
                            onClick={()=>setOpen1(true)}
                    >
                        <CloseOutlined />
                    </button>
            ),
        },
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
                <Form.Item label="Status" name="srcPerson">
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
                <div className="d-flex justify-content-between align-items-center">
                    <Form.Item
                        label="1030"
                        name="1030"
                    >
                        <Switch name='1030'
                                checkedChildren={<CheckOutlined/>}
                                unCheckedChildren={<CloseOutlined/>}/>

                    </Form.Item>
                    <Form.Item
                        label="KPI"
                        name="kpi"
                    >
                        <Switch name='kpi'
                                checkedChildren={<CheckOutlined/>}
                                unCheckedChildren={<CloseOutlined/>}/>

                    </Form.Item>
                </div>
                <Form.Item label=' '>
                    <button className='btn btn-primary' onClick={()=>setOpen(true)}>
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
                    srcItem?.srcDatabase ? <Form.Item label='Xalqaro ilmiy baza'>
                        <Tag bordered={false} color="processing" closable
                             onClose={(e) => onChangeFieldClear("srcDatabase")}
                        >
                            {
                                Xalqaro?.data?.options?.filter((item) => item?.code === srcItem?.srcDatabase)[0].name
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

            <Drawer title="Filter" onClose={()=>setOpen(false)} open={open}>
                <Form form={form2}
                      layout="vertical"
                      ref={formRef}
                      fields={[
                          {
                              name: "srcType",
                              value: srcItem?.srcType
                          },
                          {
                              name: "srcDatabase",
                              value: srcItem?.srcDatabase
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
                        name="srcDatabase"
                    >
                        <Select name="srcDatabase" allowClear
                                placeholder='Xalqaro ilmiy bazalar'
                                options={Xalqaro?.data?.options?.map(item => ({
                                    label: item.name,
                                    value: item.code
                                }))}
                                onChange={(value) =>
                                    onChangeField('srcDatabase', value)}>
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
            <Drawer title="Rad etish" onClose={()=>setOpen1(false)} open={open1}>
                <div className="">
                    <p>123</p>
                    <p>456</p>
                    <p>789</p>
                </div>
              <Form
                  form={form3}
                  layout="vertical"
                  ref={formRef} className="d-flex align-items-center justify-content-between"
                  onFinish={(e)=>console.log(e)}
              >
                  <Form.Item name='izox'>
                      <TextArea placeholder="Rad etishga izox yozing" allowClear style={{height: 100, width:250, resize: 'none',}}/>
                  </Form.Item>
                  <Form.Item>
                      <button className="btn btn-success">
                          <CheckOutlined />
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
import React, {useEffect, useRef, useState} from 'react';
import {DatePicker, Form, Popconfirm, Select, Space, Switch, Table} from "antd";
import {SearchOutlined} from "@ant-design/icons";
import {ClassifairGet, getFaculty, getIlmiyNashir, getProfile} from "../../api/general";
import {useSearchParams} from 'react-router-dom';
import {useQuery} from "react-query";
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';


dayjs.extend(customParseFormat);

const Dekan_IntelectualMulk = () => {
    const [searchParams, setSearchParams] = useSearchParams();
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
        }).then(res => res?.data?.data?.content)
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
            title: 'Tekshirish',
            dataIndex: 'address',
            width: 100
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


export default Dekan_IntelectualMulk
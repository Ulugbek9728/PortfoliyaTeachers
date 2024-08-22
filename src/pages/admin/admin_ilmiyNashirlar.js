import React, {useEffect, useRef, useState} from 'react';
import {DatePicker, Form, Select} from "antd";
import {SearchOutlined} from "@ant-design/icons";
import {ClassifairGet, getFaculty, getIlmiyNashir, getProfile} from "../../api/general";
import {createSearchParams, useNavigate} from 'react-router-dom';
import {useQuery} from "react-query";

function AdminIlmiyNashirlar(props) {
    const navigate = useNavigate();

    const formRef = useRef(null);
    const [form] = Form.useForm();
    const [srcItem, setSrcItem] = useState({
        dataSrc:['','']
    });

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
        queryFn: () => getProfile(null, srcItem?.faculty, srcItem?.department, srcItem?.query).then(res => res.data?.data?.content)
    })

    const publication_List = useQuery({
        queryKey: ['publicationList'],
        queryFn: () => getIlmiyNashir(
            '',
            srcItem?.dataSrc[0],
            srcItem?.dataSrc[1],
            "SCIENTIFIC_PUBLICATIONS",
            srcItem?.employeeId,
            srcItem?.srcType,

            // srcItem?.faculty,
            // srcItem?.department,
        ).then(res => res.data)
    })
    // console.log(publication_List.data)

    const onChangeDate = (value, dateString) => {
        setSrcItem({
            ...srcItem,
            dataSrc: dateString
        })
    };

    useEffect(() => {
        if (srcItem?.faculty) {
            kafedraList.refetch();
        }
        teacher_List.refetch()
        publication_List.refetch()
    }, [srcItem]);

    function handleClick2() {
        navigate({
            pathname: "",
            search: createSearchParams({
                faculty: srcItem.faculty,
                department: srcItem.department,
                srcType: srcItem.srcType,
                fromDate: srcItem.dataSrc[0],
                toDate: srcItem.dataSrc[1],
            }).toString()
        })
    }

    const onSearch = (value) => {
        setSrcItem({
            ...srcItem,
            query: value
        })
    };


    return (
        <div>
            <Form form={form} layout="vertical" ref={formRef} colon={false}
                // onFinish={() => getIlmiyNashir()}
                  className='d-flex align-items-center gap-4'
            >
                <Form.Item label="Mudatini belgilang" name="srcDate">
                    <DatePicker.RangePicker size="large" style={{width: 250,}} name="srcDate" format="YYYY-MM-DD"
                                            onChange={onChangeDate}/>
                </Form.Item>
                <Form.Item name="facultyId"
                           rules={[{required: true, message: 'Fakultetni tanlang'}]}
                           label="Fakultetni tanlang"
                >
                    <Select style={{width: 250,}}
                            name="facultyId"
                            placeholder='Facultet'
                            onChange={(value, option) => {
                                setSrcItem({...srcItem, faculty: option.value})
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
                            onChange={(value, option) => {
                                setSrcItem({...srcItem, department: option.value})
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
                            name='srcPerson'
                            placeholder="O'qituvchi"
                            optionFilterProp="label"
                            onChange={(value, option) => {
                                setSrcItem({...srcItem, employeeId: option.value})
                            }}
                            onSearch={onSearch}

                            options={teacher_List?.data?.map((item, index) => (
                                {value: item.id, label: item.fullName, key: item.id}
                            ))}
                    />
                </Form.Item>

                <Form.Item label="Ilmiy nashr turi" name="srcType">
                    <Select name="srcType" labelInValue style={{width: 250,}} placeholder='Ilmiy nashr turi'
                            options={Scientificpublication?.data?.options.map(item => ({
                                label: item.name,
                                value: item.code
                            }))}
                            onChange={(value, option) => setSrcItem({...srcItem, srcType: option.value})}
                    />
                </Form.Item>
                <Form.Item label=' '>
                    <button className="btn btn-success " type="submit">
                        <span className="button__text"><SearchOutlined/></span>
                    </button>
                </Form.Item>
            </Form>

            <button type="button" onClick={handleClick2}>
                Go home
            </button>
        </div>
    );
}

export default AdminIlmiyNashirlar;
import React, {useEffect, useRef, useState} from 'react';
import {Table, Modal, Select, Form, Button, notification, Space, Popconfirm} from 'antd';
import {useQuery, useMutation} from "react-query"
import {addDekanInfo, getFaculty, getProfile, getFacultyDekan, deleteDekanInfo} from "../../api/general";


function AddFakulty(props) {

    const [form] = Form.useForm();
    const formRef = useRef(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [dekanAdd, setDekanAdd] = useState(null);

    const {data} = useQuery({
        queryKey: ["FacultyList"],
        queryFn: () => getFaculty().then(res => res.data)
    })

    const dekan_List = useQuery({
        queryKey: ['dekanlist'],
        queryFn: () => getProfile('25').then(res => res.data?.data?.content)
    })

    const addFakulty = useMutation({
        mutationFn: (id) => addDekanInfo(id.userID, dekanAdd),
        onSuccess: () => {
            FacultyDekan.refetch()
            notification.success({
                message: "fakultet qo'shildi"
            })
            form.resetFields();
            setIsModalOpen(false)
        },
        onError: () => {
            notification.error({
                message: "fakultet eror",
                duration: 1,
                placement: 'top'
            })
        }
    })

    const deletFakulty = useMutation({
        mutationFn:(id)=>deleteDekanInfo(id),
        onSuccess:()=>{
            FacultyDekan.refetch()
            notification.success({
                message: "fakultet o'chirildi"
            })
        }
    })

    const FacultyDekan = useQuery({
        queryKey: ['Fakultydekanlist'],
        queryFn: () => getFacultyDekan().then(res => res.data?.data)
    })

    const columns = [
        {
            title: '№',
            width: 50,
            render: (item, record, index) => (<>{index + 1}</>)
        },
        {
            title: 'F.I.Sh',
            dataIndex: 'fullName',
            key: 'fullName',
        },
        {
            title: 'Fakultet',
            render: (item, record, index) => (<>{item.faculty.name}</>)
        },
        {
            title: 'Harakatlar',
            render: (text, record) => (
                <Space size="middle">
                    <Popconfirm title="Ilmiy nashirni o'chirish"
                                description="Ilmiy nashirni o'chirishni tasdiqlaysizmi?"
                                onConfirm={(e) => deletFakulty.mutate(record.id)}
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


    return (
        <div>
            <button type="button" className=" button1" onClick={() => setIsModalOpen(true)}>
                    <span className="button__text">
                        Dekan qo'shish
                    </span>
                <span className="button__icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" viewBox="0 0 24 24" strokeWidth="2"
                             strokeLinejoin="round" strokeLinecap="round" stroke="currentColor" height="24"
                             fill="none" className="svg">
                            <line y2="19" y1="5" x2="12" x1="12"/>
                            <line y2="12" y1="12" x2="19" x1="5"/>
                        </svg>
                    </span>
            </button>
            <Modal title="Fakultet dekanini qo'shish" open={isModalOpen} onCancel={() => setIsModalOpen(false)}>
                <Form form={form} ref={formRef} onFinish={(e) =>addFakulty.mutate(e)} layout="vertical"
                      fields={[
                          // {
                          //     name: 'facultyId',
                          //     value: creatDecan?.facultyId
                          // },
                      ]}
                >
                    <Form.Item name="facultyId"
                               rules={[{required: true, message: 'Fakultetni tanlang'}]}
                               label="Fakultetni tanlang"
                    >
                        <Select
                            name="facultyId"
                            onChange={(e, option) => {
                                setDekanAdd({
                                    ...dekanAdd,
                                    id: e,
                                    name: option.label,
                                })
                            }}
                            placeholder='Facultet'
                            options={data?.map((item, index) => (
                                {value: item.id, label: item.name, key: item.id}
                            ))}
                        />

                    </Form.Item>
                    <Form.Item name="userID"
                               rules={[{
                                   required: true,
                                   message: 'Dekani tanlang'
                               }]}
                               label="Dekani tanlang">

                        <Select name="userID" placeholder='Dekan F.I.Sh'
                                options={dekan_List.data?.map((item, index) => (
                                    {value: item.id, label: item.fullName, key: item.id}
                                ))}
                        />

                    </Form.Item>

                    <div className="d-flex justify-content-end">
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Qo'shish
                            </Button>
                        </Form.Item>
                    </div>
                </Form>
            </Modal>

            <Table
                rowKey="id"
                columns={columns}
                dataSource={FacultyDekan.data}
                loading={FacultyDekan.isLoading}
            />
        </div>
    );
}

export default AddFakulty;
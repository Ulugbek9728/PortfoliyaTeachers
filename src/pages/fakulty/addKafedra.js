import React, {useEffect, useRef, useState} from 'react';
import {Table, Modal, Select, Form, Button, notification, Space, Popconfirm} from 'antd';
import {useQuery, useMutation} from "react-query"
import {
    addDepartmentInfo, deleteDepartment, getdepartmentAdmin, getFaculty, getProfile
} from '../../api/general';

const AddKafedra = () => {
    const fulInfo = JSON.parse(localStorage.getItem("myInfo"));
    const fakultyInfo = fulInfo.roleInfos.filter((item) => item?.faculty?.id != null)
    const [form] = Form.useForm();
    const formRef = useRef(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [kafedraAdd, setKafedraAdd] = useState(null);
    const {data: KafedraList} = useQuery({
        queryKey: ["kafedraList"],
        queryFn: () => getFaculty(12, fakultyInfo[0]?.faculty?.id).then(res =>
            res?.data
        )
    })

    const allKafedraMudir_List = useQuery({
        queryKey: ['Alldekanlist'],
        queryFn: () => getProfile({
            staffPosition: 16,
            departmentId: kafedraAdd?.id
        }).then(res => res?.data?.data?.content)
    })

    useEffect(() => {
        allKafedraMudir_List.refetch()
    }, [kafedraAdd?.id]);

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
            title: 'Kafedra',
            render: (item, record, index) => (<>{item?.department?.name}</>)
        },
        {
            title: 'Harakatlar',
            render: (text, record) => (
                <Space size="middle">
                    <Popconfirm title="Fakultetni o'chirish"
                                description="Fakultetni o'chirishni tasdiqlaysizmi?"
                                onConfirm={(e) => deletDekan.mutate(record.id)}
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
    const addKafedra = useMutation({
        mutationFn: (id) => addDepartmentInfo(id.userID, kafedraAdd),
        onSuccess: () => {
            KafedraMudirList.refetch()
            notification.success({
                message: "Kafedra mudiri qo'shildi"
            })
            form.resetFields();
            setIsModalOpen(false)
        },
        onError: () => {
            notification.error({
                message: "kafedra eror",
                duration: 1,
                placement: 'top'
            })
        }
    })

    const deletDekan = useMutation({
        mutationFn: (id) => deleteDepartment(id),
        onSuccess: () => {
            KafedraMudirList.refetch()
            notification.success({
                message: "fakultet o'chirildi"
            })
        }
    })
    const KafedraMudirList = useQuery({
        queryKey: ['KafedraMudirList'],
        queryFn: () => getdepartmentAdmin(
            {
                facultyId: fakultyInfo[0]?.faculty?.id,
                departmentId: "",
                structureTypeId: ""
            }
        ).then(res => res.data?.data)
    })

    return (
        <div>
            <button type="button" className=" button1" onClick={() => setIsModalOpen(true)}>
            <span className="button__text">
                Kafedra mudirini qo'shish
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
            <Modal title="Kafedra qo'shish" open={isModalOpen} onCancel={() => setIsModalOpen(false)}>
                <Form form={form} ref={formRef} onFinish={(e) => addKafedra.mutate(e)} layout="vertical">
                    <Form.Item name="kafedraId"
                               rules={[{required: true, message: 'Kafedrani tanlang'}]}
                               label="Kafedrani tanlang"
                    >
                        <Select
                            name="kafedraId"
                            onChange={(e, option) => {
                                setKafedraAdd({
                                    ...kafedraAdd,
                                    id: e,
                                    name: option.label,
                                    structureType: option?.item?.structureType
                                })

                            }}
                            placeholder='Kafedra'
                            options={KafedraList?.map((item, index) => (
                                {
                                    value: item.id,
                                    label: item.name,
                                    key: item.id,
                                    item: item
                                }
                            ))}
                        />

                    </Form.Item>
                    <Form.Item name="userID"
                               rules={[{
                                   required: true,
                                   message: 'Dekani tanlang'
                               }]}
                               label="Kafedra mudirini tanlang">

                        <Select name="userID" placeholder=' Kafedra mudirini F.I.Sh'
                                options={allKafedraMudir_List.data?.map((item, index) => (
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
                dataSource={KafedraMudirList.data}
                loading={KafedraMudirList.isLoading}
            />
        </div>
    )
}
export default AddKafedra
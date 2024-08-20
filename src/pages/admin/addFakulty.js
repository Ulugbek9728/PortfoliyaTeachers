import React, {useEffect, useRef, useState} from 'react';
import {Table, Modal, Select, Form, Button} from 'antd';
import {useQuery} from "react-query"
import {getFaculty} from "../../api/general";


function AddFakulty(props) {

    const [form] = Form.useForm();
    const formRef = useRef(null);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const {data} = useQuery({
        queryKey: ["FacultyList"],
        queryFn: () => getFaculty().then(res=>res.data)
    })

    const columns = [
        {
            title: '№',
            width: 50,
            render: (item, record, index) => (<>{index + 1}</>)
        },
        {
            title: 'F.I.Sh',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Fakultet',
            dataIndex: 'age',
            key: 'age',
        },
        {
            title: 'Harakatlar',
            dataIndex: 'address',
            key: 'address',
        },

    ];

    function handleOk() {

    }


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
            <Modal title="Fakultet dekanini qo'shish" open={isModalOpen} onCancel={handleCancel}>
                <Form
                    form={form} ref={formRef}
                    onFinish={handleOk}
                    layout="vertical"
                    fields={[
                        // {
                        //     name: 'facultyId',
                        //     value: creatDecan?.facultyId
                        // },
                    ]}
                >
                    <Form.Item
                        name="facultyId"
                        rules={[
                            {
                                required: true,
                                message: 'Fakultetni tanlang'
                            }
                        ]}
                        label="Fakultetni tanlang"
                    >
                        <Select
                            name="facultyId"
                            // onChange={}
                            placeholder='Facultet'
                            options={data?.map((item, index) => (
                                {value: item.id, label: item.name, key:item.id}
                            ))}
                        />

                    </Form.Item>
                    <Form.Item
                        name="userID"
                        rules={[
                            {
                                required: true,
                                message: 'Dekani tanlang'
                            }
                        ]}
                        label="Dekani tanlang"
                    >
                        <Select
                            name="userID"
                            // onChange={}
                            placeholder='Dekan F.I.Sh'
                            options={data?.map((item, index) => (
                                {value: item.id, label: item.name, key:item.id}
                            ))}
                        />

                    </Form.Item>

                    <div className="d-flex justify-content-end">
                        <Form.Item>

                            <Button
                                type="primary"
                                htmlType="submit"
                            >
                                Qo'shish
                            </Button>
                        </Form.Item>
                    </div>
                </Form>
            </Modal>

            <Table columns={columns}
                   // dataSource={data}
            />
        </div>
    );
}

export default AddFakulty;
import React, {useEffect, useRef, useState} from 'react';
import {Table, Modal, Select, Form, Button, notification, Space, Popconfirm} from 'antd';
import {useQuery, useMutation} from "react-query"
import { addDekanInfo, deleteDekanInfo, getFaculty, getFacultyDekan, getProfile } from '../../api/general';

const AddKafedra = () => {
    const [form] = Form.useForm();
    const formRef = useRef(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [kafedraAdd, setKafedraAdd] = useState(null);
    const{ data: KafedraList} = useQuery({
        queryKey: ["kafedraList"],
        queryFn: () => getFaculty(12,'').then(res =>
            res?.data
        )
    })

    const dekan_List = useQuery({
        queryKey: ['dekanlist'],
        queryFn: () => getProfile({
            staffPosition: 16,
        }).then(res => res?.data?.data?.content)
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
            title: 'Kafedra',
            render: (item, record, index) => (<>{item?.kafedra?.name}</>)
        },
        {
            title: 'Harakatlar',
            render: (text, record) => (
                <Space size="middle">
                    <Popconfirm title="Fakultetni o'chirish"
                                description="Fakultetni o'chirishni tasdiqlaysizmi?"
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

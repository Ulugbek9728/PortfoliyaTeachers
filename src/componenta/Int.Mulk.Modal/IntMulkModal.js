import React, {useEffect, useRef, useState} from 'react'
import {Button, DatePicker, Divider, Form, Input, InputNumber, message, Select, Upload,} from 'antd';
import './IntModal.scss'
import {ApiName} from "../../api/APIname";
import {PlusOutlined} from "@ant-design/icons";
import axios from "axios";


const IntMulkModal = (props) => {
    const fulInfo = JSON.parse(localStorage.getItem("myInfo"));

    const formRef = useRef(null);
    const [form] = Form.useForm();
    const [form2] = Form.useForm();
    const [url, seturl] = useState(true)
    const [selected, setSelected] = useState('')
    const [fileList, setFileList] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [Scientificpublication, setScientificpublication] = useState([]);

    const [data, setData] = useState({
        publicationType: props?.publicationType,
    });
    const [data2, setData2] = useState({
        citizenship: "",
        fullName: "",
        workplace: "",
        position: "",
        degreeAndTitle: ""
    })


    const uploadProps = {
        name: 'file',
        action: `${ApiName}/api/v1/attach/upload`,
        headers: {
            Authorization: `Bearer ${fulInfo?.accessToken}`,
        },
        fileList: fileList,
        onChange: (info) => handleFileChange(info),
        showUploadList: false,
    };
    const handleFileChange = (info) => {
        let newFileList = [...info.fileList];
        setFileList(newFileList);
        if (info.file.status === 'done') {
            message.success(`${info.file.name} fayl muvaffaqiyatli yuklandi`);
            setData(prevState => ({
                ...prevState,
                mediaIds: [info.file.response.id],
            }));
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} fayl yuklashda xato.`);
        }
    };
    const handleSearch = async () => {
        try {
            const response = await axios.get(`${ApiName}/api/author/search`, {
                params: {query: ''},
                headers: {
                    Authorization: `Bearer ${fulInfo?.accessToken}`,
                },
            });
            if (response.data.isSuccess && !response.data.error) {
                setSearchResults(response.data.data);
            } else {
                console.error('Error in response:', response.data.message);
                setSearchResults([]);
            }
        } catch (error) {
            console.error('Error fetching search results:', error);
            setSearchResults([]);
        }

    };

    const handleInputChange = (event) => {
        const {name, value} = event.target;
        setData(prevState => ({
            ...prevState,
            [name]: value
        }));

        setData2(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
    function ClassifairGet() {
        axios.get(`${ApiName}/api/classifier`, {
            params: {
                key: 'h_patient_type'
            },
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${fulInfo?.accessToken}`
            }
        })
            .then(response => {
                console.log(response.data)
                setScientificpublication(response.data);
            })
            .catch(error => {
                console.log(error, 'error');
            });
    }
    const onFinish = (values) => {
        const requestPayload2 = {
            ...data2
        };
        console.log(data2);
        axios.post(`${ApiName}/api/author/create`, requestPayload2, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${fulInfo?.accessToken}`,
            },
        }).then(response => {
            console.log(data2);
            message.success(`Muallif muvaffaqiyatli qo'shildi`);
        }).catch(error => {
            console.log(error);
            message.error(`Muallif 'qo'shishda xatolik`);
        });
    };
    const handleSubmit = (event) => {
        axios.post(`${ApiName}/api/publication/create`, {
            ...data,
            issueYear: event.data.format('YYYY-MM-DD'),
            authorIds:event?.authorIds,
            scientificName:event?.nashrBiblMatni,
            intellectualPropertyNumber: event?.raqami

        }, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${fulInfo?.accessToken}`,
            },
        }).then(res=>{
            console.log(res)
            message.success(`Intelektual mulk ${props.editingData ? 'yangilandi' : "qo'shildi"}`);
            form.resetFields();

            if (props.handleCancel) {
                props.handleCancel();
            }
        }).catch(error=>console.log(error))
        console.log(data)
        console.log(event)
    }


    useEffect(() => {
        return () => {
            handleSearch()
            ClassifairGet()
        }
    }, [])
    return (
        <div>
            <Form className='row' form={form} layout="vertical" ref={formRef} onFinish={handleSubmit}
                  colon={false}>

                <Form.Item
                    layout="vertical"
                    label="Intelektual mulk turi"
                    name="mulkTuri"
                    labelCol={{span: 24}}
                    wrapperCol={{span: 24}}
                    className='col-6'>
                    <Select placeholder='Intelektual mulk turi'
                            options={Scientificpublication[0]?.options?.map(item => ({label: item.name, value: item.code}))}
                            name="scientificPublicationType"
                            onChange={(value, option) => {
                                setData({...data,
                                    intellectualPropertyPublicationType: {
                                    name: option.label,
                                    code: option.value,
                                    }
                                })
                            }


                                // handleSelectChange(value, {name: "scientificPublicationType"})
                    }
                    />
                </Form.Item>
                <Form.Item
                    layout="vertical"
                    label="Nashrning bibliografik matni"
                    name="nashrBiblMatni"
                    labelCol={{span: 24}}
                    wrapperCol={{span: 24}}
                    className='col-6'>
                    <Input name='nashrBiblMatni' className='py-2' placeholder='text'/>
                </Form.Item>
                <Form.Item
                    layout="vertical"
                    label="Intelektual mulk raqami"
                    name="raqami"
                    labelCol={{span: 24}}
                    wrapperCol={{span: 24}}
                    className='col-6'>
                    <Input name='raqami' className='py-2' placeholder='text'/>
                </Form.Item>

                <Form.Item
                    layout="vertical"
                    label="Mualliflar"
                    name="authorIds"
                    labelCol={{span: 24}}
                    wrapperCol={{span: 24}}
                    rules={[{required: true, message: 'Iltimos mualliflarni tanlang'}]}
                    className='col-6'
                >
                    <Select
                        mode="multiple"
                        allowClear
                        name='authorIds'
                        placeholder="Mualliflarni qidirish"
                        filterOption={(input, option) => (option?.label?.toLowerCase() ?? '').startsWith(input.toLowerCase())}
                        filterSort={(optionA, optionB) =>
                            (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
                        options={searchResults.map(author => ({
                            value: author.id,
                            label: author.fullName + ' (' + author.workplace + ' ' + author.position + ') '
                        }))}
                        dropdownRender={(menu) => (
                            <>
                                {menu}
                                <Divider
                                    style={{
                                        margin: '8px 0',
                                    }}
                                />
                                <Form
                                    name="wrap"
                                    form={form2}
                                >
                                    <div className="d-flex gap-2">
                                        <Form.Item
                                            name="username"
                                            rules={[
                                                {
                                                    required: true,
                                                },
                                            ]}
                                        >
                                            <Input
                                                placeholder="Hammuallif F.I.Sh"
                                                value={data2.fullName}
                                                name={'fullName'}
                                                onChange={handleInputChange}
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            name="fuqaroligi"
                                            rules={[
                                                {
                                                    required: true,
                                                },
                                            ]}
                                        >
                                            <Input
                                                placeholder="Hammuallif fuqaroligi"
                                                value={data2.citizenship}
                                                onChange={handleInputChange}
                                                name={'citizenship'}
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            name="ish joyi"
                                            rules={[
                                                {
                                                    required: true,
                                                },
                                            ]}
                                        >
                                            <Input
                                                placeholder="Hammuallif ish joyi"
                                                value={data2.workplace}
                                                onChange={handleInputChange}
                                                name={'workplace'}
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            name="lavozimi"
                                            rules={[
                                                {
                                                    required: true,
                                                },
                                            ]}
                                        >
                                            <Input
                                                placeholder="Hammuallif lavozimi"
                                                value={data2.position}
                                                onChange={handleInputChange}
                                                name={'position'}
                                            />
                                        </Form.Item>
                                    </div>
                                    <div className="d-flex gap-2">
                                        <Form.Item
                                            name="ilmiy daraja va unvoni"
                                            rules={[
                                                {
                                                    required: true,
                                                },
                                            ]}
                                        >
                                            <Input
                                                placeholder="Hammuallif ilmiy daraja va unvoni"
                                                onChange={handleInputChange}
                                                value={data2.degreeAndTitle}
                                                name={'degreeAndTitle'}
                                            />
                                        </Form.Item>
                                        <Form.Item>
                                            <Button type="primary" icon={<PlusOutlined/>} onClick={onFinish}
                                                    htmlType="submit">
                                                Qo'shish
                                            </Button>
                                        </Form.Item>
                                    </div>
                                </Form>
                            </>
                        )}
                    />
                </Form.Item>

                <Form.Item
                    layout="vertical"
                    label="O'quv yili"
                    name="data"
                    labelCol={{span: 24}}
                    wrapperCol={{span: 24}}
                    className='col-6'>
                    <DatePicker name='data' className='py-2'/>
                </Form.Item>
                <Form.Item
                    layout="vertical"
                    label="Fayl yuklash"
                    name="file"
                    labelCol={{span: 24}}
                    wrapperCol={{span: 24}}
                    className='col-6'
                >
                    <Upload  {...uploadProps}>
                        <Button>PDF</Button>
                    </Upload>
                </Form.Item>
                <Form.Item className='col-12 d-flex justify-content-end'>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}

export default IntMulkModal
import React, {useEffect, useRef} from 'react'
import {Button, DatePicker, Form, Input, Select, Upload, Divider, message,} from 'antd';
import {PlusOutlined, UploadOutlined} from "@ant-design/icons";

import {ApiName} from "../../api/APIname";
import {useState} from 'react';
import axios from "axios";
import dayjs from "dayjs";
import { useMutation, useQuery } from 'react-query';
import { addAuthor, ClassifairGet, SaloxiyatCreate, SaloxiyatUpdate } from '../../api/general';


const IlmiySaloxiyatModal = (props) => {
    const [fulInfo] = useState(JSON.parse(localStorage.getItem("myInfo")));
    const [form] = Form.useForm();
    const [form2] = Form.useForm();
    const formRef = useRef(null);
    const [data, setData] = useState({});
    const [data2, setData2] = useState({
        citizenship: "",
        fullName: "",
        workplace: "",
        position: "",
        degreeAndTitle: ""
    })
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        console.log(props.editingData)
        handleSearch()
        if (props.editingData) {
            const editingValues = {
                ...props.editingData,
                yearOfProtection: dayjs(props.editingData.yearOfProtection),
                studentId: props.editingData?.studentId?.id,
                media: props.editingData.media,
                // studentAcademicDegree: props.editingData.studentAcademicDegree?.code,
            };
            setData(editingValues);
            form.setFieldsValue(editingValues);

        } else if (props.handleCancel) {
            setData({})
            form.resetFields();
        }
    }, [props.editingData, form, props.handleCancel]);

    const IlmFan = useQuery({
        queryKey: ['h_science_branch'],
        queryFn:()=>ClassifairGet('h_science_branch').then(
            res=> res.data[0]?.options?.filter(item=>item?.code?.endsWith('00.00'))
        )
    })

    const handleSearch = async () => {
        try {
            const response = await axios.get(`${ApiName}/api/author/search`, {
                params: {query: ''},
                headers: {
                    Authorization: `Bearer ${fulInfo?.accessToken}`,
                },
            });
            if (response.data.isSuccess && !response.data.error) {
                setSearchResults(response.data.data || []);
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
    const useAddAuthor = useMutation({
        mutationFn:(data2) => addAuthor(data2),
        onSuccess: () => {
           form2.resetFields();
           handleSearch();
           message.success('Muallif muvaffaqiyatli qo`shildi');
       },
       onError: (error) => {
           console.error(error);
           message.error('Muallifni qo`shishda xatolik yuz berdi');
       },
       })

    const uploadProps = {
        name: 'file',
        action: `${ApiName}/api/v1/attach/upload`,
        headers: {
            Authorization: `Bearer ${fulInfo?.accessToken}`,
        },
        fileList: props?.editingData?.media ?
            [
                {
                    uid: props.editingData?.media?.id,
                    id: props.editingData?.media?.id,
                    name: props.editingData?.media?.fileName,
                    status: 'done',
                    url: props.editingData?.media?.url
                }
            ]
            : undefined,

        onChange: (info) => {
            if (info.file.status === 'done') {
                message.success(`${info.file.name} fayl muvaffaqiyatli yuklandi`);
                setData(prevState => ({
                    ...prevState,
                    mediaId: info.file.response.id,
                }));
            } else if (info.file.status === 'removed') {
                if (props.editingData) {
                    const result = data.mediaIds.filter((idAll) => idAll !== info?.file?.id);
                    setData(prevState => ({
                        ...prevState,
                        mediaIds: [result],
                    }));
                    axios.delete(`${ApiName}/api/v1/attach/${info?.file?.id}`, {
                        headers: {"Authorization": `Bearer ${fulInfo?.accessToken}`}
                    }).then((res) => {
                        message.success("File o'chirildi")
                    }).catch((error) => {
                        message.error(`${info.file.name} file delete failed.`);
                    })
                } else {
                    const result = data.mediaIds.filter((idAll) => idAll !== info?.file?.response?.id);
                    setData(prevState => ({
                        ...prevState,
                        mediaIds: [result],
                    }));
                    axios.delete(`${ApiName}/api/v1/attach/${info?.file?.response?.id}`, {
                        headers: {"Authorization": `Bearer ${fulInfo?.accessToken}`}
                    }).then((res) => {
                        message.success("File o'chirildi")
                    }).catch((error) => {
                        message.error(`${info.file.name} file delete failed.`);
                    })
                }
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} fayl yuklashda xato.`);
            }
        }

    };

    const addIlmiyNashrInfo = useMutation({
        mutationFn: (data) => {
            const request = props.editingData
                ? SaloxiyatUpdate({
                    yearOfProtection: data.yearOfProtection.format('YYYY-MM-DD'),
                    mediaId:data.mediaId,
                    scientificLeadershipType:data.scientificLeadershipType,
                    studentAcademicDegree:data.studentAcademicDegree,
                    studentId:data.studentId,
                    dissertationTopic:data.dissertationTopic,
                },data?.id)
                : SaloxiyatCreate({
                    ...data,
                    yearOfProtection: data.yearOfProtection.format('YYYY-MM-DD')
                });
            return request;
        },
        onSuccess: (response) => {
            message.success(`Ilmiy saloxiyat ${props.editingData ? 'yangilandi' : "qo'shildi"}`);
            form.resetFields();
            props.getIlmiySaloxiyat123()
            if (props.onSuccess) {
                props.onSuccess();
            }
            if (props.handleCancel) {
                props.handleCancel();
            }
        },
        onError: (error) => {
            console.error(error);
            message.error(`Ilmiy saloxiyat ${props.editingData ? 'yangilashda' : 'qo\'shishda'} xatolik`);
        },
    });

    return (
        <>
            <Form className='row'
                  form={form} ref={formRef}
                  initialValues={data}
                  onFinish={(e) => addIlmiyNashrInfo.mutate(data)}
                  fields={[
                      {
                          name: "yearOfProtection",
                          value: data?.yearOfProtection
                      },
                      {
                          name: "scientificLeadershipType",
                          value: data?.scientificLeadershipType
                      },
                      {
                          name: "dissertationTopic",
                          value: data?.dissertationTopic
                      },
                      {
                          name: "studentId",
                          value: data?.studentId
                      },
                      {
                          name: "studentAcademicDegree",
                          value: data.studentAcademicDegree?.code
                      }

                  ]}
            >
                <Form.Item layout="vertical" label="Shogirt F.I.SH" name="studentId"
                           labelCol={{span: 24}} wrapperCol={{span: 24}} className='col-6'
                           rules={[{required: true, message: 'Iltimos Shogirt F.I.SH kiriting'}]}
                >
                    <Select name='studentId'
                            size='large' allowClear showSearch placeholder="Shogirt F.I.SH"
                            onChange={(e) => {
                                setData({...data, studentId: e})
                            }}
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
                                    <Form onFinish={()=> useAddAuthor.mutate(data2)}
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
                                                <Button type="primary" icon={<PlusOutlined/>}
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
                <Form.Item layout="vertical" label="Ximoya qilgan yili" name="yearOfProtection" labelCol={{span: 24}}
                           wrapperCol={{span: 24}} className='col-6'>
                    <DatePicker className='py-2'
                                format="DD-MM-YYYY"
                                name="yearOfProtection"
                                onChange={(date) => {
                                    setData({...data, yearOfProtection: date})
                                }}/>
                </Form.Item>
                <Form.Item layout="vertical" label="Ilmiy raxbarlik turi" name="scientificLeadershipType"
                           labelCol={{span: 24}}
                           wrapperCol={{span: 24}} className='col-6'>
                    <Select name='scientificLeadershipType' onChange={(e) => {
                        setData({
                            ...data,
                            scientificLeadershipType: e
                        })
                    }}>
                        <Select.Option value='Fan nomzodi'>
                            Fan nomzodi
                        </Select.Option>
                        <Select.Option value='Falsafa doktori'>
                            Falsafa doktori
                        </Select.Option>
                        <Select.Option value='Fan doktori'>
                            Fan doktori
                        </Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item layout="vertical"
                           label="Dissertatsiya mavzusi"
                           name="dissertationTopic"
                           labelCol={{span: 24}}
                           wrapperCol={{span: 24}}
                           rules={[{required: true, message: 'Iltimos dissertatsiya mavzusi kiriting'}]}
                           className='col-6'>
                    <Input name='dissertationTopic' placeholder='Dissertatsiya mavzusi' className='py-2'
                           onChange={(e) => {
                               setData({...data, dissertationTopic: e.target.value})
                           }}/>
                </Form.Item>

                <Form.Item label="Shogirdning ilm-fan sohasi" name="studentAcademicDegree" className='col-6'
                           layout="vertical"
                           labelCol={{span: 24}} wrapperCol={{span: 24}}>
                    <Select name="studentAcademicDegree" placeholder='Ilm-fan sohasi'
                            onChange={(value, option) => setData({
                                ...data,
                                studentAcademicDegree: {
                                    name: option.label,
                                    code: option.value
                                }
                            })}

                            options={IlmFan?.data?.map(item => ({label: item.name, value: item.code}))}
                    >
                    </Select>
                </Form.Item>
                <Form.Item
                    layout="vertical"
                    label="Fayl yuklash"
                    name="file"
                    labelCol={{span: 24}}
                    wrapperCol={{span: 24}}
                    className='col-6'
                >
                    <Upload accept="application/pdf,application/vnd.ms-excel" name='file' {...uploadProps}>
                        <Button icon={<UploadOutlined/>}>PDF</Button>
                    </Upload>
                </Form.Item>

                <Form.Item className='col-12 d-flex justify-content-end'>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </>
    )
}

export default IlmiySaloxiyatModal
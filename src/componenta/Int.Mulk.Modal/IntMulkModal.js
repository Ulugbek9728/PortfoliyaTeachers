import React, {useEffect, useRef, useState} from 'react'
import {Button, DatePicker, Divider, Form, Input, message, Select, Upload,} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import {ApiName} from "../../api/APIname";
import {PlusOutlined} from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";
import './IntModal.scss'
import { useMutation, useQuery } from 'react-query';
import { addAuthor, ClassifairGet, IntelektualCreate, IntelektualUpdate } from '../../api/general';

const IntMulkModal = (props) => {
    const fulInfo = JSON.parse(localStorage.getItem("myInfo"));

    const formRef = useRef(null);
    const [form] = Form.useForm();
    const [form2] = Form.useForm();
    const [searchResults, setSearchResults] = useState([]);
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

    useEffect(() => {
        handleSearch()
        if (props.editingData) {
            const editingValues = {
                ...props.editingData,
                issueYear: dayjs(props.editingData.issueYear),
                authorIds: props.editingData?.authors ? JSON.parse(props.editingData.authors).map(item => item.id) : [],
                mediaIds:props.editingData.mediaIds?.map((item)=>item.attachResDTO.id),
                scientificName: props.editingData.scientificName,
                intellectualPropertyNumber: props.editingData.intellectualPropertyNumber,
            };
            setData(editingValues);
            form.setFieldsValue(editingValues);
        } else if (props.handleCancel) {
            setData({
                issueYear: '',
                publicationType: props?.publicationType,
                scientificName: '',
                mediaIds: [],
                authorIds: []
            })
            form.resetFields();
        }
    }, [props.editingData, form, props.handleCancel]);

    const uploadProps = {
        name: 'file',
        action: `${ApiName}/api/v1/attach/upload`,
        headers: {
            Authorization: `Bearer ${fulInfo?.accessToken}`,
        },
        fileList: props.editingData?.mediaIds?.map((item)=> {
            const attachResDTO = item.attachResDTO;
            return { uid: attachResDTO.id,id:attachResDTO.id, name: attachResDTO.fileName, status: 'done', url: attachResDTO.url }
        }),
        onChange(info) {
            console.log(info)
            if (info.file.status === 'done') {
                message.success(`${info.file.name} fayl muvaffaqiyatli yuklandi`);
                setData(prevState => ({
                    ...prevState,
                    mediaIds: [info.file.response.id],
                }));
            }

            else if (info.file.status === 'removed') {
                if (props.editingData){
                    console.log(data.mediaIds)
                    const result = data.mediaIds.filter((idAll) => idAll !== info?.file?.id);
                    console.log(result)
                    setData(prevState => ({
                        ...prevState,
                        mediaIds: result,
                    }));
                    axios.delete(`${ApiName}/api/v1/attach/${info?.file?.id}`, {
                        headers: {"Authorization": `Bearer ${fulInfo?.accessToken}`}
                    }).then((res) => {
                        message.success("File o'chirildi")

                    }).catch((error) => {
                        message.error(`${info.file.name} file delete failed.`);
                    })
                }
                else {
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

            }

            else if (info.file.status === 'error') {
                message.error(`${info.file.name} fayl yuklashda xato.`);
            }
        },
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

    const Scientificpublication = useQuery({
        queryKey: ['h_patient_type'],
        queryFn: () => ClassifairGet('h_patient_type').then(res => res?.data[0]),
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


    const addIlmiyNashrInfo = useMutation({
        mutationFn: (data) => {   
            console.log(data);
            const request = props.editingData 
                ? IntelektualUpdate({
                    ...data,
                    issueYear:data?.issueYear.format('YYYY-MM-DD'),
                })
                : IntelektualCreate({
                    ...data,
                    issueYear: data?.issueYear.format('YYYY-MM-DD'),
                });
            return request;
        },
        onSuccess: (response) => {
            message.success(`Intelektual mulk ${props.editingData ? 'yangilandi' : "qo'shildi"}`);
            form.resetFields();
            props.getIntelektualMulk()
            if (props.handleCancel) {
                props.handleCancel();
            }
        },
        onError: (error) => {
            console.error(error);
            message.error(`Ilmiy nashr ${props.editingData ? 'yangilashda' : "qo'shishda"} xatolik yuz berdi`);
        },
    });

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
    const handleChange = (value) => {
        setData(prevState => ({
            ...prevState,
            authorIds: value,
            authorCount: value.length
        }));
    };

    return (
        <div>
            <Form className='row' form={form} layout="vertical" ref={formRef} onFinish={() => addIlmiyNashrInfo.mutate(data)}
                  colon={false}
                  fields={[
                      {
                          name: "intellectualPropertyPublicationType",
                          value: data?.intellectualPropertyPublicationType?.code
                      },
                      {
                          name: "issueYear",
                          value: data.issueYear
                      },
                      {
                          name: "authorIds",
                          value: data.authorIds
                      },
                      {
                          name: "scientificName",
                          value: data?.scientificName
                      },
                      {
                          name: "intellectualPropertyNumber",
                          value: data?.intellectualPropertyNumber
                      },
                  ]}
            >
                <Form.Item
                    layout="vertical"
                    label="Intelektual mulk turi"
                    name="intellectualPropertyPublicationType"
                    labelCol={{span: 24}}
                    wrapperCol={{span: 24}}
                    className='col-6'>
                    <Select placeholder='Intelektual mulk turi'
                            options={Scientificpublication?.data?.options?.map(item => ({
                                label: item.name,
                                value: item.code
                            }))}
                            name="intellectualPropertyPublicationType"
                            onChange={(value, option) => {
                                setData({
                                    ...data,
                                    intellectualPropertyPublicationType: {
                                        name: option.label,
                                        code: option.value,
                                    }
                                })
                            }

                            }
                    />
                </Form.Item>
                <Form.Item
                    layout="vertical"
                    label="Nashrning bibliografik matni"
                    name="scientificName"
                    labelCol={{span: 24}}
                    wrapperCol={{span: 24}}
                    className='col-6'>
                    <Input name='scientificName' className='py-2' placeholder='text'
                           onChange={(e) => [
                               setData({
                                   ...data,
                                   scientificName: e.target.value
                               })
                           ]}/>
                </Form.Item>
                <Form.Item
                    layout="vertical"
                    label="Intelektual mulk raqami"
                    name="intellectualPropertyNumber"
                    labelCol={{span: 24}}
                    wrapperCol={{span: 24}}
                    className='col-6'>
                    <Input name='intellectualPropertyNumber' className='py-2' placeholder='text'
                           onChange={(e) => [
                               setData({
                                   ...data,
                                   intellectualPropertyNumber: e.target.value
                               })
                           ]}/>
                </Form.Item>
                <Form.Item
                    layout="vertical"
                    label="Mualliflar"
                    name="authorIds"
                    labelCol={{span: 24}}
                    wrapperCol={{span: 24}}
                    className='col-6'
                >
                    <Select
                        mode="multiple"
                        allowClear
                        name='authorIds'
                        placeholder="Mualliflarni qidirish"
                        onChange={handleChange}

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
                                            <Button type="primary" icon={<PlusOutlined/>} 
                                                    htmlType="submit"  onClick={(e) => useAddAuthor.mutate(data2)}>
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
                    name="issueYear"
                    labelCol={{span: 24}}
                    wrapperCol={{span: 24}}
                    className='col-6'>
                    <DatePicker name='data' className='py-2'
                                onChange={(date) => {
                                    setData({...data, issueYear: date})
                                }}/>
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
                        <Button icon={<UploadOutlined />}>PDF</Button>
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
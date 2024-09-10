import React, {useEffect, useState, useRef} from 'react';
import {Button, Form, Input, Select, Upload, message, DatePicker, Divider} from 'antd';
import {PlusOutlined,UploadOutlined} from '@ant-design/icons';
import axios from 'axios';
import {ApiName} from '../../api/APIname';
import dayjs from 'dayjs';
import {ClassifairGet} from "../../api/general";


import customParseFormat from 'dayjs/plugin/customParseFormat';
import {useQuery} from "react-query";
dayjs.extend(customParseFormat);

const FormModal = (props) => {
    const fulInfo = JSON.parse(localStorage.getItem("myInfo"));
    const [searchResults, setSearchResults] = useState([]);
    const [monografiya, setMonografiya] = useState(false);
    const [url, setUrl] = useState(true);
    const [form] = Form.useForm();
    const [form2] = Form.useForm();
    const formRef = useRef(null);
    const [defaultPDFList, setDefaultPDFList] = useState(
        props.editingData?.mediaIds?.filter(item => item.attachResDTO.section === 'defaultPDF').map(item => ({
            uid: item.attachResDTO.id,
            id: item.attachResDTO.id,
            name: item.attachResDTO.fileName,
            status: 'done',
            url: item.attachResDTO.url,
        })) || []
    );
    
    const [monografiyaPdfList, setMonografiyaPdfList] = useState(
        props.editingData?.mediaIds?.filter(item => item.attachResDTO.section === 'monografiyaPdf').map(item => ({
            uid: item.attachResDTO.id,
            id: item.attachResDTO.id,
            name: item.attachResDTO.fileName,
            status: 'done',
            url: item.attachResDTO.url,
        })) || []
    );
    
    const [data2, setData2] = useState({
        citizenship: "",
        fullName: "",
        workplace: "",
        position: "",
        degreeAndTitle: ""
    })
    const [data, setData] = useState({
        authorCount: 0,
        issueYear: '',
        publicationType: props?.publicationType,
        language: "",
        scientificName: "",
        scientificField: "",
        doiOrUrl: "",
        publicationDatabase: "",
        decisionScientificCouncil: "",
        fileType: "",
        mediaIds: [],
        authorIds: []
    });

    useEffect(() => {
        handleSearch()
        if (props.editingData) {
            const editingValues = {
                ...props.editingData,
                issueYear: dayjs(props.editingData.issueYear),
                authorIds: props.editingData?.authors ? JSON.parse(props.editingData.authors).map(item=>item.id) : [],
                mediaIds:props.editingData.mediaIds?.map((item)=>item.attachResDTO.id),
                scientificField: props.editingData.scientificField,
                publicationType: props.editingData.publicationType,
                scientificPublicationType: props.editingData.scientificPublicationType,
                fileType: props.editingData.doiOrUrl ? 'Url' : "Upload",
            };
            setData(editingValues);
            form.setFieldsValue(editingValues);
            setUrl(editingValues.fileType === 'Url');
        }
        else if (props.handleCancel){
            setData({
                authorCount: 0,
                issueYear: '',
                publicationType: props?.publicationType,
                language: '',
                scientificName: '',
                scientificField: '',
                doiOrUrl: '',
                publicationDatabase: '',
                decisionScientificCouncil: '',
                fileType: '',
                mediaIds: [],
                authorIds: []
            })
            form.resetFields();

        }
    }, [props.editingData, form, props.handleCancel]);


    const Xalqaro = useQuery({
        queryKey: ['h_publication_database'],
        queryFn:()=>ClassifairGet('h_publication_database').then(res=>res.data[0])
    })
    const IlmFan = useQuery({
        queryKey: ['h_science_branch'],
        queryFn:()=>ClassifairGet('h_science_branch').then(
            res=> res.data[0]?.options?.filter(item=>item?.code?.endsWith('00.00'))
        )
    })
    const Scientificpublication = useQuery({
        queryKey: ['h_scientific_publication_type'],
        queryFn:()=>ClassifairGet('h_scientific_publication_type').then(res=>res.data[0])
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
    const handleChange = (value) => {
        setData(prevState => ({
            ...prevState,
            authorIds: value,
            authorCount: value.length
        }));
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

    const handleSelectChange = (value, option) => {
        const {name} = option;
        setData(prevState => ({
            ...prevState,
            [name]: name === 'scientificPublicationType' ? Scientificpublication?.data?.options?.filter(item => item.code === value)[0] :
             name === 'scientificField' ? IlmFan?.data?.filter(item => item.code === value)[0] :
             name === 'publicationDatabase' ? Xalqaro?.data?.options?.filter(item => item.code === value)[0] : value,
        }));
        if (name === "scientificPublicationType") {
            setMonografiya(Scientificpublication?.data?.options?.filter(item => item.code === value)[0]?.name === 'Monografiya');
        }

        if (name === "fileType") {
            setUrl(value === 'Url');
        }
    };

    const uploadProps = (section) => ({
        name: 'file',
        action: `${ApiName}/api/v1/attach/upload`,
        headers: {
            Authorization: `Bearer ${fulInfo?.accessToken}`,
        },
        fileList: section === 'defaultPDF' ? defaultPDFList : monografiyaPdfList, 
        beforeUpload: (file) => {
            const isSizeValid = file.size / 1024 / 1024 < 1; 
            if (!isSizeValid) {
                message.error(`${file.name} fayl hajmi 1 MB dan oshmasin.`);
                return Upload.LIST_IGNORE; 
            }
            return true; 
        },
        onChange: (info) => {
            if (section === 'defaultPDF') {
                setDefaultPDFList(info.fileList);
            } else {
                setMonografiyaPdfList(info.fileList); 
            }
    
            if (info.file.status === 'done') {
                message.success(`${info.file.name} fayl muvaffaqiyatli yuklandi`);
                setData(prevState => ({
                    ...prevState,
                    mediaIds: [...prevState.mediaIds, info.file.response.id],
                }));
            } else if (info.file.status === 'removed') {
                const updatedMediaIds = data.mediaIds.filter(id => id !== info.file.response.id);
                setData(prevState => ({
                    ...prevState,
                    mediaIds: updatedMediaIds, 
                }));
                axios.delete(`${ApiName}/api/v1/attach/${info.file.response.id}`, {
                    headers: {"Authorization": `Bearer ${fulInfo?.accessToken}`}
                }).then(() => {
                    message.success("File o'chirildi");
                }).catch(() => {
                    message.error(`${info.file.name} file delete failed.`);
                });
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} fayl yuklashda xato.`);
            }
        }
    });
    
    
    const onFinish = () => {
        axios.post(`${ApiName}/api/author/create`, data2, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${fulInfo?.accessToken}`,
            },
        }).then(response => {
            form2.resetFields();
            handleSearch()
            message.success(`Muallif muvaffaqiyatli qo'shildi`);
        }).catch(error => {
            console.log(error);
            message.error(`Muallif 'qo'shishda xatolik`);
        });
    };

    const handleSubmit = (values) => {
        const request = props.editingData
            ? axios.put(`${ApiName}/api/publication/update`, {
                ...data,
                issueYear: data.issueYear.format('YYYY-MM-DD')
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${fulInfo?.accessToken}`,
                },
            })
            : axios.post(`${ApiName}/api/publication/create`, {
                ...data,
                issueYear: data.issueYear.format('YYYY-MM-DD')
            },
             {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${fulInfo?.accessToken}`,
                },
            })
        request.then(response => {
            message.success(`Ilmiy nashir ${props.editingData ? 'yangilandi' : "qo'shildi"}`);
            form.resetFields();
            props.getIlmiyNashir()
            setData({
                authorCount: 0,
                issueYear: '',
                publicationType: props?.publicationType,
                language: '',
                scientificName: '',
                scientificField: '',
                doiOrUrl: '',
                publicationDatabase: '',
                decisionScientificCouncil: '',
                fileType: '',
                mediaIds: [],
                authorIds: []
            })
            if (props.onSuccess) {
                props.onSuccess();
            }
            if (props.handleCancel) {
                props.handleCancel();
              }

        }).catch(error => {
            console.log(error);
            message.error(`Ilmiy nashir ${props.editingData ? 'yangilashda' : 'qo\'shishda'} xatolik`);
        });
    };
    return (
        <div>
            <Form form={form} ref={formRef} initialValues={data}
                className='row' onFinish={handleSubmit}
                fields={[
                    {
                        name: "scientificPublicationType",
                        value: data?.scientificPublicationType?.code
                    },
                    {
                        name: "decisionScientificCouncil",
                        value: data?.decisionScientificCouncil
                    },
                    {
                        name: "language",
                        value: data?.language
                    },
                    {
                        name: "scientificName",
                        value: data?.scientificName
                    },
                    {
                        name: "fileType",
                        value: data.fileType
                    },
                    {
                        name: "doiOrUrl",
                        value: data?.doiOrUrl
                    },
                    {
                        name: "scientificField",
                        value: data?.scientificField?.code
                    },
                    {
                        name: "publicationDatabase",
                        value: data?.publicationDatabase?.code
                    },
                    {
                        name: "authorIds",
                        value: data.authorIds
                    },
                    {
                        name: "issueYear",
                        value: data.issueYear
                    },
                ]}
            >
                <Form.Item layout="vertical" className='col-6'
                    label="Ilmiy nashr turi"
                    name="scientificPublicationType"
                    labelCol={{span: 24}} wrapperCol={{span: 24}}
                    rules={[{required: true, message: 'Iltimos ilmiy nashr turini tanlang'}]}
                >
                    <Select placeholder='Ilmiy nashr turi'
                        options={Scientificpublication?.data?.options.map(item => ({label: item.name, value: item.code}))}
                        name="scientificPublicationType"
                        onChange={(value, option) => handleSelectChange(value, {name: "scientificPublicationType"})}
                    />
                </Form.Item>

                {monografiya && (
                 <>
                    <Form.Item layout="vertical" className='col-6'
                        label="Ilmiy yoki ilmiy texnik kengash qarori"
                        name="decisionScientificCouncil" labelCol={{span: 24}} wrapperCol={{span: 24}}
                        rules={[{required: true, message: 'Iltimos monografiya ma`lumotlarini kiriting'}]}
                    >
                        <Input
                            name="decisionScientificCouncil"
                            onChange={handleInputChange}
                            placeholder='Ilmiy yoki ilmiy texnik kengash qarori'
                            className='py-2'
                        />
                    </Form.Item>
                    <Form.Item
                        layout="vertical"
                        label="Fayl yukla"
                        labelCol={{span: 24}}
                        wrapperCol={{span: 24}}
                        className='col-6'
                        name='monografiya.file'
                    >
                        <Upload   accept="application/pdf,application/vnd.ms-excel"  {...uploadProps('monografiyaPdf')}
                         
                        >
                        <Button icon={<UploadOutlined />}>PDF</Button>
                        </Upload>
                    </Form.Item>
                 </>
                )}

                <Form.Item layout="vertical"
                    label="
                    Nashrning bibliografik matni"
                    name="scientificName" labelCol={{span: 24}} wrapperCol={{span: 24}}
                    rules={[{required: true, message: 'Iltimos nashrning bibliografik matnini kiriting'}]}
                    className='col-6'
                >
                    <Input
                        name="scientificName"
                        onChange={handleInputChange}
                        placeholder='Nashrning bibliografik matni'
                        className='py-2'
                    />
                </Form.Item>

                <Form.Item layout="vertical"
                    label="Ilm-fan sohasi"
                    name="scientificField" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} className='col-6'
                >
                    <Select name="scientificField" placeholder='Ilm-fan sohasi'
                            options={IlmFan?.data?.map(item => ({label: item.name, value: item.code}))}
                            onChange={(value, option) => handleSelectChange(value, { name: "scientificField" })}>
                    </Select>
                </Form.Item>
                <Form.Item layout="vertical" label="Hammualliflar" name="authorIds"
                    labelCol={{span: 24}} wrapperCol={{span: 24}}
                    // rules={[{message: 'Iltimos mualliflarni tanlang'}]}
                    className='col-6'
                >
                    <Select size='large'
                            mode="multiple"
                            allowClear
                            placeholder="Hammualliflarni qidirish"
                            onChange={handleChange}
                            filterOption={(input, option) => (option?.label?.toLowerCase() ?? '').startsWith(input.toLowerCase())}
                            filterSort={(optionA, optionB) =>
                                (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
                            options={searchResults.map(author => ({value: author.id, label: author.fullName +' (' + author.workplace + ' '+ author.position + ') '}))}
                            dropdownRender={(menu) => (
                                <>
                                    {menu}
                                    <Divider
                                        style={{
                                            margin: '8px 0',
                                        }}
                                    />
                                    <Form onFinish={onFinish}
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


                <Form.Item
                    layout="vertical"
                    label="Fayl yuklash turini tanlang"
                    name="fileType"
                    labelCol={{span: 24}}
                    wrapperCol={{span: 24}}
                    rules={[{required: true, message: 'Iltimos fayl turini tanlang'}]}
                    className='col-6'
                >
                    <Select
                        name="fileType"
                        onChange={(value, option) => handleSelectChange(value, {name: "fileType"})}
                    >
                        <Select.Option value="Url">Url</Select.Option>
                        <Select.Option value="Upload">PDF yuklash</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    layout="vertical"
                    label="Xalqaro ilmiy bazalar"
                    name="publicationDatabase"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    className='col-6'
                >
                    <Select name="scientificField"
                            options={Xalqaro?.data?.options?.map(item => ({
                                label: item.name,
                                value: item.code}))}
                            onChange={(value) =>
                                handleSelectChange(value, { name: "publicationDatabase" })
                    }>
                    </Select>
                </Form.Item>


                {url ? (
                    <Form.Item
                        layout="vertical" label="URL manzil" name="doiOrUrl" labelCol={{span: 24}} wrapperCol={{span: 24}}
                        className='col-6'
                        rules={[{
                            message: '"url" kiriting',
                            type: "url",
                        }]}
                    >
                        <Input
                            name="doiOrUrl"
                            onChange={handleInputChange}
                            placeholder='URL manzil'
                            className='py-2'
                        />
                    </Form.Item>
                ) : (
                    <Form.Item
                        layout="vertical"
                        label="Fayl yuklash"
                        name="defaultfile"
                        labelCol={{span: 24}}
                        wrapperCol={{span: 24}}
                        className='col-6'
                    >
                        <Upload accept="application/pdf,application/vnd.ms-excel"  {...uploadProps('defaultPDF')}
                        >
                        <Button icon={<UploadOutlined />}>PDF</Button>
                        </Upload>
                    </Form.Item>
                )}
                <Form.Item
                    layout="vertical"
                    label="Nashr yili"
                    name="issueYear"
                    labelCol={{span: 24}}
                    wrapperCol={{span: 24}}
                    rules={[{required: true, message: 'Iltimos nashir yilini tanlang'}]}
                    className='col-3'
                >
                    <DatePicker
                        format="YYYY-MM-DD"
                        name="issueYear"
                        onChange={(date) => {
                            setData({...data, issueYear: date})
                        }}
                        className='py-2'
                    />
                </Form.Item>
                <Form.Item layout="vertical" label="Til"
                           name="language" labelCol={{span: 24}} wrapperCol={{span: 24}}
                           rules={[{required: true, message: 'Iltimos tilni tanlang'}]}
                           className='col-3'
                >
                    <Select placeholder='Til'
                            name="language"
                            onChange={(value, option) => handleSelectChange(value, {name: "language"})}
                    >
                        <Select.Option value="uz">uz</Select.Option>
                        <Select.Option value="ru">ru</Select.Option>
                        <Select.Option value="en">en</Select.Option>
                    </Select>
                </Form.Item>


                <Form.Item className='col-12 d-flex justify-content-end'>
                    <Button type="primary" htmlType="submit">Yuborish</Button>
                </Form.Item>
            </Form>
        </div>

    );
};

export default FormModal;




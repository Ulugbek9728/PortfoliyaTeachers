import React, {useEffect, useRef, useState} from "react";
import {Button, DatePicker, Form, Input, Upload, Select, message, Divider,} from "antd";
import {PlusOutlined, UploadOutlined} from "@ant-design/icons";
import axios from "axios";
import {ApiName} from "../../api/APIname";
import "./UslubiyNashrlarModal.scss";
import dayjs from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useMutation, useQuery } from "react-query";
import {addAuthor, ClassifairGet, search, UslubiyNashrCreate, UslubiyNashrUpdate} from "../../api/general";
dayjs.extend(customParseFormat);

const UslubiyNashrlarModal = (props) => {
    const fulInfo = JSON.parse(localStorage.getItem("myInfo"));
    const [form] = Form.useForm();
    const formRef = useRef(null);
    const [data, setData] = useState({
        authorCount: 0,
        issueYear: '',
        publicationType: props?.publicationType,
        language: "",
        scientificName: "",
        doiOrUrl: "",
        decisionScientificCouncil: "",
        fileType: "Url",
        mediaIds: [],
        authorIds: [],
        stylePublisher: "",
        styleCertificateNumber: "",
        styleCertificateDate: ""
    });
    const [data2, setData2] = useState({
        citizenship: "",
        fullName: "",
        workplace: "",
        position: "",
        degreeAndTitle: "",
    });
    const [form2] = Form.useForm();
    

    const stylePublicationType = useQuery({
        queryKey: ['h_methodical_publication_type'],
        queryFn:() => ClassifairGet('h_methodical_publication_type').then(res=>res.data[0])
    })

    useEffect((value) => {
        if (props.editingData) {
            const editingValues = {
                ...props.editingData,
                mediaIds: props.editingData.mediaIds?.map((item) => item.attachResDTO.id),
                styleCertificateDate: dayjs(props.editingData.styleCertificateDate),
                issueYear: dayjs(props.editingData.issueYear),
                authorIds: props.editingData?.authors ? JSON.parse(props.editingData.authors).map(item => item.id) : [],
                publicationType: props.editingData.publicationType,
                stylePublicationType: props.editingData.stylePublicationType,
                // fileType: props.editingData.fileType || 'Url',
                fileType: props.editingData.doiOrUrl ? 'Url' : "Upload",
            };
            setData(editingValues);
            form.setFieldsValue(editingValues);
        } else if (props.handleCancel) {
            setData({
                authorCount: 0,
                issueYear: '',
                publicationType: props?.publicationType,
                language: '',
                scientificName: '',
                doiOrUrl: '',
                decisionScientificCouncil: '',
                fileType: 'Url',
                mediaIds: [],
                authorIds: []
            })
        }
    }, [props.editingData, form, stylePublicationType?.data]);

    const Mualiflar = useQuery({
        queryKey: [''],
        queryFn:() => search({query: ''}).then(res=>res.data)
    })

    const handleChange = (value) => {
        setData((prevState) => ({
            ...prevState,
            authorIds: value,
            authorCount: value.length,
        }));
    };

    const handleInputChange = (event) => {
        const {name, value} = event.target;
        setData((prevState) => ({
            ...prevState,
            [name]: value,
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
            [name]: name === 'stylePublicationType' ? stylePublicationType?.data.options?.filter(item => item.code === value)[0] : value
        }));
    };

    const uploadProps = {
        name: 'file',
        action: `${ApiName}/api/v1/attach/upload`,
        headers: {
            Authorization: `Bearer ${fulInfo?.accessToken}`,
        },
        fileList: props.editingData?.mediaIds?.map((item) => {
            const attachResDTO = item.attachResDTO;
            return {
                uid: attachResDTO.id,
                id: attachResDTO.id,
                name: attachResDTO.fileName,
                status: 'done',
                url: attachResDTO.url
            }
        }),
        onChange(info) {
            console.log(info)
            if (info.file.status === 'done') {
                message.success(`${info.file.name} fayl muvaffaqiyatli yuklandi`);
                setData(prevState => ({
                    ...prevState,
                    mediaIds: [info.file.response.id],
                }));
            } else if (info.file.status === 'removed') {
                if (props.editingData) {
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
        },
    };

const addUslubiyNashrInfo = useMutation({
   mutationFn: (data) => {
    const request = props.editingData 
    ? UslubiyNashrUpdate({
        ...data,
        issueYear: data.issueYear.format('YYYY-MM-DD'),
        styleCertificateDate: data.styleCertificateDate.format('YYYY-MM-DD')
    })
    : UslubiyNashrCreate({
        ...data,
        issueYear: data.issueYear.format('YYYY-MM-DD'),
        styleCertificateDate: data.styleCertificateDate.format('YYYY-MM-DD')
    });
    return request;
   },
   onSuccess: (response) => {
    message.success(`Maqola muvaffaqiyatli ${props.editingData ? 'yangilandi' : 'qo`shildi'}`);
    form.resetFields();
    setData({
        authorCount: 0,
        issueYear: '',
        publicationType: props?.publicationType,
        language: '',
        scientificName: '',
        doiOrUrl: '',
        decisionScientificCouncil: '',
        fileType: 'Url',
        stylePublisher: "",
        styleCertificateNumber: "",
        styleCertificateDate: "",
        mediaIds: [],
        authorIds: []
    })
    props.getIlmiyNashir()
    // Forma maydonlarini tozalash uchun resetFields chaqirish
    if (props.onSuccess) {
        props.onSuccess();
    }
    // Modalni yopish
    if (props.handleCancel) {
        props.handleCancel();
    }
},
onError: (error) => {
    console.log(error);
    message.error(`Maqolani ${props.editingData ? 'yangilashda' : 'qo`shishda'} xatolik`);
},
})

const useAddAuthor = useMutation({
    mutationFn:(data2) => addAuthor(data2),
    onSuccess: () => {
       form2.resetFields();
       message.success('Muallif muvaffaqiyatli qo`shildi');
   },
   onError: (error) => {
       console.error(error);
       message.error('Muallifni qo`shishda xatolik yuz berdi');
   },
   })
   
    return (
        <div>
            <Form
                className="row"
                form={form}
                ref={formRef}
                initialValues={data}
                onFinish={(e) => addUslubiyNashrInfo.mutate(data)}
                fields={[
                    {
                        name: "stylePublicationType",
                        value: data?.stylePublicationType?.code
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
                        value: data?.fileType
                    },
                    {
                        name: "doiOrUrl",
                        value: data?.doiOrUrl
                    },
                    {
                        name: "authorIds",
                        value: data.authorIds
                    },
                    {
                        name: "issueYear",
                        value: data.issueYear
                    },
                    {
                        name: "styleCertificateDate",
                        value: data?.styleCertificateDate
                    },
                    {
                        name: "styleCertificateNumber",
                        value: data?.styleCertificateNumber
                    },
                    {
                        name: "stylePublisher",
                        value: data?.stylePublisher
                    },
                ]}
            >
                <Form.Item
                    layout="vertical"
                    label="Uslubiy nashr turi"
                    name="stylePublicationType"
                    labelCol={{span: 24}}
                    wrapperCol={{span: 24}}
                    className="col-6"
                >
                    <Select
                        options={stylePublicationType?.data?.options?.map((item) => ({
                            label: item.name,
                            value: item.code,
                        }))}
                        name="stylePublicationType"
                        onChange={(value, option) =>
                            handleSelectChange(value, {name: "stylePublicationType"})
                        }
                    />
                </Form.Item>

                <Form.Item
                    layout="vertical"
                    label="Nashrning bibliografik matni"
                    name="scientificName"
                    labelCol={{span: 24}}
                    wrapperCol={{span: 24}}
                    className="col-6"
                >
                    <Input
                        name="scientificName"
                        onChange={handleInputChange}
                        placeholder="Nashrning bibliografik matni"
                        className="py-2"
                    />
                </Form.Item>

                <Form.Item
                    layout="vertical"
                    label="fayl joylash turi"
                    name="fileType"
                    labelCol={{span: 24}}
                    wrapperCol={{span: 24}}
                    className="col-6"
                >
                    <Select
                        name="fileType"
                        onChange={(value, option) =>(setData({...data,fileType:value}))}
                    >
                        <Select.Option value={"Url"}>Url</Select.Option>
                        <Select.Option value={"Upload"}>Upload</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    layout="vertical"
                    label="Mualliflar"
                    name="authorIds"
                    labelCol={{span: 24}}
                    wrapperCol={{span: 24}}
                    className="col-6"
                >
                    <Select
                        mode="multiple"
                        allowClear
                        placeholder="Mualliflarni qidirish"
                        onChange={handleChange}
                        filterOption={(input, option) => (option?.label?.toLowerCase() ?? '').startsWith(input.toLowerCase())}
                        filterSort={(optionA, optionB) =>
                            (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
                        options={Mualiflar?.data?.data.map(author => ({
                            value: author.id,
                            label: author.fullName + ' (' + author.workplace + ' ' + author.position + ') '
                        }))}
                        dropdownRender={(menu) => (
                            <>
                                {menu}
                                <Divider
                                    style={{
                                        margin: "8px 0",
                                    }}
                                />
                                <Form onFinish={(e) => useAddAuthor.mutate(data2)}
                                   name="wrap" 
                                   form={form2}>
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
                                                name={"fullName"}
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
                                                name={"citizenship"}
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
                                                name={"workplace"}
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
                                                name={"position"}
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
                                                name={"degreeAndTitle"}
                                            />
                                        </Form.Item>
                                        <Form.Item>
                                            <Button
                                                type="primary"
                                                icon={<PlusOutlined/>}
                                                htmlType="submit"
                                            >
                                                Qo'shish
                                            </Button>
                                        </Form.Item>
                                    </div>
                                </Form>
                            </>
                        )}
                    />
                </Form.Item>

                {data?.fileType === "Url" ? (
                    <Form.Item
                        layout="vertical"
                        label="URL"
                        name="doiOrUrl"
                        labelCol={{span: 24}}
                        wrapperCol={{span: 24}}
                        className="col-6"
                        rules={[{
                            message: '"url" kiriting',
                            type: "url",
                        }]}
                    >
                        <Input
                            name="doiOrUrl"
                            onChange={handleInputChange}
                            placeholder="URL manzil"
                            className="py-2"
                        />
                    </Form.Item>
                ) : (
                    <Form.Item
                        labelCol={{span: 24}}
                        wrapperCol={{span: 24}}
                        className="col-6"
                        name="file"
                        // valuePropName="fileList"
                    >
                        <Upload accept="application/pdf,application/vnd.ms-excel" name='file' {...uploadProps}>
                            <Button icon={<UploadOutlined/>}>PDF</Button>
                        </Upload>
                    </Form.Item>
                )}

                <Form.Item
                    layout="vertical"
                    label="Nashriyot"
                    labelCol={{span: 24}}
                    wrapperCol={{span: 24}}
                    className="col-6"
                    name='stylePublisher'
                >
                    <Input name="stylePublisher"
                           onChange={handleInputChange}
                           placeholder="Nashriyot"
                           className="py-2"/>
                </Form.Item>
                <Form.Item

                    layout="vertical"
                    label="Nashr yili"
                    name="issueYear"
                    labelCol={{span: 24}}
                    wrapperCol={{span: 24}}
                    rules={[
                        {required: true, message: "Iltimos chiqarilgan yilni tanlang"},
                    ]}
                    className="col-3"
                >
                    <DatePicker
                        format="DD-MM-YYYY"
                        name="issueYear"
                        onChange={(date) => {
                            setData({...data, issueYear: date})
                        }}
                        className='py-2'
                    />
                </Form.Item>
                <Form.Item
                    layout="vertical"
                    label="Til"
                    name="language"
                    labelCol={{span: 24}}
                    wrapperCol={{span: 24}}
                    className="col-3"
                >
                    <Select
                        name="language"
                        onChange={(value, option) =>
                            handleSelectChange(value, {name: "language"})
                        }
                    >
                        <Select.Option value="uz">uz</Select.Option>
                        <Select.Option value="ru">ru</Select.Option>
                        <Select.Option value="en">en</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    layout="vertical"
                    label="Guvohnoma Raqami"
                    name="styleCertificateNumber"
                    labelCol={{span: 24}}
                    wrapperCol={{span: 24}}
                    className="col-3"
                >
                    <Input
                        name="styleCertificateNumber"
                        onChange={handleInputChange}
                        placeholder="Guvohnoma raqami"
                        className="py-2"
                    />
                </Form.Item>
                <Form.Item
                    layout="vertical"
                    label="Guvonoma sanasi"
                    name="styleCertificateDate"
                    labelCol={{span: 24}}
                    wrapperCol={{span: 24}}
                    className="col-3"
                >
                    <DatePicker
                        className="py-2"
                        format="DD-MM-YYYY"
                        name="styleCertificateDate"
                        onChange={(date) => {
                            setData({...data, styleCertificateDate: date})
                        }}
                    />
                </Form.Item>

                <Form.Item className="col-12 d-flex justify-content-end">
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default UslubiyNashrlarModal;
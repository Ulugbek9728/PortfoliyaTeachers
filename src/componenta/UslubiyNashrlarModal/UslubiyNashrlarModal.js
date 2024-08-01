import React, {useEffect, useRef, useState} from 'react'
import {Button, DatePicker, Form, Input, InputNumber, Select, message,Divider ,} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import axios from 'axios'
import { ApiName } from '../../api/APIname';
import './UslubiyNashrlarModal.scss'
import IntURL from '../IntURL/IntURL';
import moment from "moment/moment";

const UslubiyNashrlarModal = (props) => {
    const fulInfo = JSON.parse(localStorage.getItem("myInfo"));
    const inputRef = useRef(null);
    const [searchResults, setSearchResults] = useState([]);
    const [Scientificpublication, setScientificpublication] = useState([]);
    const [form] = Form.useForm();
    const [selected, setSelected] = useState('')
    const [url, seturl] = useState(true)
    const [selectfile, setselectfile] = useState()
    const [data, setData] = useState({
        authorCount: 0,
        issueYear: moment(),
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
    const [name, setName] = useState('');
    const [items, setItems] = useState(['jack', 'lucy']);
    useEffect(() => {
        ClassifairGet();
    },[])
    function ClassifairGet() {
        axios.get(`${ApiName}/api/classifier`, {
          params: {
            key: 'h_methodical_publication_type'
          },
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${fulInfo?.accessToken}`
          }
        })
        .then(response => {
          setScientificpublication(response.data);
        })
        .catch(error => {
          console.log(error, 'error');
        });
      }
      const handleInputChange = (event) => {
        const { name, value } = event.target;
        setData(prevState => ({
          ...prevState,
          [name]: value
        }));
      };

    const handlechangefile = (event) => {
        if (event.target.files.length > 0) {
            setselectfile(event.target.files[0])
            console.log(event.target.files[0]);
        }
    }
    const handleSubmit = () => {

    }
const handleSelectChange = (value, option) =>{
    const { name } = option;
    console.log(Scientificpublication);
    setData(prevState => ({
      ...prevState,
      [name]: name === 'scientificPublicationType' ? Scientificpublication[0]?.options?.filter(item => item.code === value)[0] : value
    }));
    if (name === "fileType") {
        seturl(value === 'Url');
      }
}
    const onNameChange = (event) => {
        setName(event.target.value);
    };
    const addItem = (e) => {
        e.preventDefault();
        // setItems([...items, name || `New item ${index++}`]);
        setName('');
        setTimeout(() => {
            inputRef.current?.focus();
        }, 0);
    };

    const options = [];
    for (let i = 10; i < 36; i++) {
        options.push({
            label: i.toString(36) + i,
            value: i.toString(36) + i,
        });
    }
    const onFinish = () => {
        message.success('Submit success!');
    };

    return (
        <div>
            <Form className='row'>
                {/* <Form.Item layout="vertical" label="Xodim" name="name"
                           labelCol={{span: 24}} wrapperCol={{span: 24}} className='col-6'>
                    <Input placeholder='Name' className='py-2'/>
                </Form.Item> */}
                <Form.Item layout="vertical" label="Uslubiy nashr turi" name="IlmiyNashr"
                           labelCol={{span: 24}} wrapperCol={{span: 24}} className='col-3'>
                    <Select 
                    value={data.scientificPublicationType} 
                    options={Scientificpublication[0]?.options?.map(item => ({ label: item.name, value: item.code }))}
                    name="scientificPublicationType"
                    onChange={(value, option) => handleSelectChange(value, { name: "scientificPublicationType" })}/>
                </Form.Item>
                <Form.Item layout="vertical" label="Til" name="Til"
                           labelCol={{span: 24}} wrapperCol={{span: 24}} className='col-3'>
                    <Select
                      value={data.language}
                      name="language"
                      onChange={(value, option) => handleSelectChange(value, { name: "language" })}
                    >
                        <Select.Option value="uz">uz</Select.Option>
                        <Select.Option value="rus">rus</Select.Option>
                        <Select.Option value="en">en</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item layout="vertical" label="Nashrning bibliografik matni" name="nashr"
                           labelCol={{span: 24}} wrapperCol={{span: 24}} className='col-6'>
                    <Input value={data.scientificName} name="scientificName" onChange={handleInputChange} placeholder='Nashrning bibliografik matni' className='py-2'/>
                </Form.Item>

                <Form.Item layout="vertical" label="fayl joylash turi" name="IlmFan"
                           labelCol={{span: 24}} wrapperCol={{span: 24}} className='col-6'>
                    <Select
                     value={data.fileType}
                     name="fileType"
                     onChange={(value, option) => handleSelectChange(value, { name: "fileType" })}
                    >
                        <Select.Option value={"Url"}>Url</Select.Option>
                        <Select.Option value={"Upload"}>Upload</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item 
                  layout="vertical" 
                  label="Mualliflar" 
                  name="Mualliflar"
                  labelCol={{span: 24}} 
                  wrapperCol={{span: 24}} className='col-6'>
                  <Select 
                    size="large"  
                    placeholder="Mualilfar" 
                    mode="multiple" 
                    allowClear
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

                                    form={form}

                                    onFinish={onFinish}

                                    colon={false}
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
                                            <Input placeholder="Hammuallif F.I.Sh" />
                                        </Form.Item>
                                        <Form.Item
                                            name="fuqaroligi"
                                            rules={[
                                                {
                                                    required: true,
                                                },
                                            ]}
                                        >
                                            <Input placeholder="Hammuallif fuqaroligi" />
                                        </Form.Item>
                                        <Form.Item
                                            name="ish joyi"
                                            rules={[
                                                {
                                                    required: true,
                                                },
                                            ]}
                                        >
                                            <Input placeholder="Hammuallif ish joyi" />
                                        </Form.Item>
                                        <Form.Item
                                            name="lavozimi"
                                            rules={[
                                                {
                                                    required: true,
                                                },
                                            ]}
                                        >
                                            <Input placeholder="Hammuallif lavozimi" />
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
                                            <Input placeholder="Hammuallif ilmiy daraja va unvoni" />
                                        </Form.Item>

                                        <Form.Item>
                                            <Button type="primary" icon={<PlusOutlined />} htmlType="submit">
                                                Qo'shish
                                            </Button>
                                        </Form.Item>
                                    </div>


                                </Form>
                            </>
                    )}
                    options={options}
                    />
                </Form.Item>

                {url === true ? <Form.Item layout="vertical" label="URL" name="URL"
                        labelCol={{span: 24}} wrapperCol={{span: 24}} className='col-6'
                        rules={[
                            {message: "请输入有效的网址"},

                            {
                                type: 'url',
                            }
                            // {
                            //   pattern: new RegExp(/(https):\/\/([\w.]+\/?)\S*/),
                            //   message: "notogri manzil"
                            // }
                        ]}>
                        <IntURL/>
                    </Form.Item>
                    :
                    <Form.Item labelCol={{span: 24}}
                               wrapperCol={{span: 24}} className='col-6' valuePropName="fileList"
                               onChange={handlechangefile}>
                    </Form.Item>
                }

                <Form.Item layout="vertical" label="Nashriyot"
                    labelCol={{span: 24}} wrapperCol={{span: 24}} className='col-6'>
                    <Input className='py-2'/>
                </Form.Item>
                <Form.Item layout="vertical" label="Nashr yili" name="data"
                    labelCol={{span: 24}} wrapperCol={{span: 24}} className='col-6'>
                    <DatePicker className='py-2'/>
                </Form.Item>
                <Form.Item layout="vertical" label="Guvohnoma Raqami" name="IlmiyBazalar"
                    labelCol={{span: 24}} wrapperCol={{span: 24}} className='col-3'>
                    <InputNumber className='py-1'/>
                </Form.Item>
                <Form.Item layout="vertical" label="Guvonoma sanasi" name="data"
                    labelCol={{span: 24}} wrapperCol={{span: 24}} className='col-3'>
                    <DatePicker className='py-2'/>
                </Form.Item>


                <Form.Item className='col-12 d-flex justify-content-end'>
                    <Button onClick={handleSubmit} type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}

export default UslubiyNashrlarModal
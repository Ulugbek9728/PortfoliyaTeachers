import React, { useEffect, useState, useRef } from 'react';
import { Button, Form, Input, Select, Upload, message, DatePicker, Divider } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import { ApiName } from '../../api/APIname';
import moment from 'moment';

const FormModal = (props) => {
  const [Scientificpublication, setScientificpublication] = useState([]);
  const fulInfo = JSON.parse(localStorage.getItem("myInfo"));
  const [data2, setData2] = useState({
      citizenship: "",
      fullName: "",
      workplace: "",
      position: "",
      degreeAndTitle: ""
  })
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
  const inputRef = useRef(null);
  const [searchResults, setSearchResults] = useState([]);
  const [monografiya, setMonografiya] = useState(false);
  const [url, setUrl] = useState(true);
  const [fileList, setFileList] = useState([]);
  const [form] = Form.useForm();
  const [form2] = Form.useForm();
  const [name, setName] = useState('');
  const [items, setItems] = useState(['jack', 'lucy']);

  useEffect((value) => {
    ClassifairGet();
    if (props.editingData) {
      const editingValues = {
        ...props.editingData,
        issueYear: moment(props.editingData.issueYear),
        scientificField: props.editingData.scientificField,
        publicationType: props.editingData.publicationType,
        scientificPublicationType: props.editingData.scientificPublicationType?.code,
        fileType: props.editingData.fileType || 'Url'
      };
      setData(editingValues);
      form.setFieldsValue(editingValues);
      // setMonografiya(Scientificpublication[0]?.options?.filter(item => item.code === value)[0]?.name === 'Monografiya');
      // setUrl(props.editingData.fileType === 'Url');
    }
  }, [props.editingData, form]);
  
  useEffect(()=>{
  return ()=>{
    handleSearch('')
  } 
},[])

  function ClassifairGet() {
    axios.get(`${ApiName}/api/classifier`, {
      params: {
        key: 'h_scientific_publication_type'
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

  const handleSearch = async (value) => {
    console.log(value);
   
      try {
        const response = await axios.get(`${ApiName}/api/author/search`, {
          params: { query: value },
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
    const { name, value } = event.target;
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
    const { name } = option;
    setData(prevState => ({
      ...prevState,
      [name]: name === 'scientificPublicationType' ? Scientificpublication[0]?.options?.filter(item => item.code === value)[0] : value
    }));

    if (name === "scientificPublicationType") {
      setMonografiya(Scientificpublication[0]?.options?.filter(item => item.code === value)[0]?.name === 'Monografiya');
    }

    if (name === "fileType") {
      setUrl(value === 'Url');
    }
  };

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
      handleSearch('')
      message.success(`Maqola muvaffaqiyatli 'qo'shildi'}`);
    }).catch(error => {
      console.log(error);
      message.error(`Maqolani 'qo'shishda'} xatolik`);
    });
};

  const handleSubmit = (values) => {
      const requestPayload = {
        ...data,
        issueYear: data.issueYear.format('YYYY-MM-DD')
      };
    const request = props.editingData
      ? axios.put(`${ApiName}/api/publication/update`, requestPayload, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${fulInfo?.accessToken}`,
          },
        })
      : axios.post(`${ApiName}/api/publication/create`, requestPayload, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${fulInfo?.accessToken}`,
          },
        })
    request.then(response => {
      message.success(`Maqola muvaffaqiyatli ${props.editingData ? 'yangilandi' : 'qo\'shildi'}`);
      setData({
        authorCount: 0,
        issueYear: moment(),
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
      // Forma maydonlarini tozalash uchun resetFields chaqirish
      form.resetFields();
      if (props.onSuccess) {
        props.onSuccess();
      }
      // Modalni yopish
      if (props.handleCancel) {
        props.handleCancel();
      }
    }).catch(error => {
      console.log(error);
      message.error(`Maqolani ${props.editingData ? 'yangilashda' : 'qo\'shishda'} xatolik`);
    });
  };


  return (
<div>
  <Form
    form={form}
    initialValues={data}
    className='row'
    onFinish={handleSubmit}
  >
    <Form.Item
      layout="vertical"
      label="Ilmiy nashr turi"
      name="scientificPublicationType"
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
      rules={[{ required: true, message: 'Iltimos ilmiy nashr turini tanlang' }]}
      className='col-6'
    >
      <Select
        value={data.scientificPublicationType?.name}
        options={Scientificpublication[0]?.options?.map(item => ({ label: item.name, value: item.code }))}
        name="scientificPublicationType"
        onChange={(value, option) => handleSelectChange(value, { name: "scientificPublicationType" })}
      />
    </Form.Item>

    {monografiya && (
      <Form.Item
        layout="vertical"
        label="Ilmiy yoki ilmiy texnik kengash qarori"
        name="decisionScientificCouncil"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        rules={[{ required: true, message: 'Iltimos monografiya ma`lumotlarini kiriting' }]}
        className='col-6'
      >
        <Input 
          value={data.decisionScientificCouncil} 
          name="decisionScientificCouncil" 
          onChange={handleInputChange} 
          placeholder='Ilmiy yoki ilmiy texnik kengash qarori' 
          className='py-2' 
        />
      </Form.Item>
    )}

    <Form.Item
      layout="vertical"
      label="Til"
      name="language"
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
      rules={[{ required: true, message: 'Iltimos tilni tanlang' }]}
      className='col-6'
    >
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

    <Form.Item
      layout="vertical"
      label="Nashrning bibliografik matni"
      name="scientificName"
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
      rules={[{ required: true, message: 'Iltimos nashrning bibliografik matnini kiriting' }]}
      className='col-12'
    >
      <Input 
        value={data.scientificName} 
        name="scientificName" 
        onChange={handleInputChange} 
        placeholder='Nashrning bibliografik matni' 
        className='py-2' 
      />
    </Form.Item>

    <Form.Item
      layout="vertical"
      label="Fayl yuklash turini tanlang"
      name="fileType"
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
      rules={[{ required: true, message: 'Iltimos fayl turini tanlang' }]}
      className='col-6'
    >
      <Select
        value={data.fileType}
        name="fileType"
        onChange={(value, option) => handleSelectChange(value, { name: "fileType" })}
      >
        <Select.Option value="Url">Url</Select.Option>
        <Select.Option value="Upload">Upload</Select.Option>
      </Select>
    </Form.Item>

    {url ? (
      <Form.Item
        layout="vertical"
        label="URL manzil"
        name="doiOrUrl"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        rules={[{ required: true, message: 'Iltimos URL manzil kiriting' }]}
        className='col-6'
      >
        <Input 
          value={data.doiOrUrl} 
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
        name="file"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        className='col-6'
      >
        <Upload {...uploadProps}>
          <Button>Fayl yuklash</Button>
        </Upload>
      </Form.Item>
    )}

    <Form.Item
      layout="vertical"
      label="Ilmiy yo'nalish"
      name="scientificField"
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
      rules={[{ required: true, message: 'Iltimos ilmiy yo\'nalishni kiriting' }]}
      className='col-6'
    >
      <Input 
        value={data.scientificField} 
        name="scientificField" 
        onChange={handleInputChange} 
        placeholder='Ilmiy yo`nalish' 
        className='py-2' 
      />
    </Form.Item>

    <Form.Item
      layout="vertical"
      label="Mualliflar"
      name="authorIds"
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
      rules={[{ required: true, message: 'Iltimos mualliflarni tanlang' }]}
      className='col-6'
    >
      <Select
        mode="multiple"
        allowClear
        value={data.authorIds}
        placeholder="Mualliflarni qidirish"
        onSearch={handleSearch}
        onChange={handleChange}
        options={searchResults.map(author => ({ value: author.id, label: author.fullName }))}
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
                  <Button type="primary" icon={<PlusOutlined />} onClick={onFinish} htmlType="submit">
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
      label="Nashr yili	"
      name="issueYear"
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
      rules={[{ required: true, message: 'Iltimos chiqarilgan yilni tanlang' }]}
      className='col-6'
    >
      <DatePicker 
        value={data.issueYear ? moment(data.issueYear) : null} 
        name="issueYear" 
        onChange={(date) => setData(prevState => ({ ...prevState, issueYear: date ? date.format('YYYY-MM-DD') : null }))} 
        className='py-2' 
      />
    </Form.Item>

    <Form.Item className='col-12 d-flex justify-content-end'>
      <Button type="primary" htmlType="submit">Yuborish</Button>
    </Form.Item>
  </Form>
</div>

  );
};

export default FormModal;




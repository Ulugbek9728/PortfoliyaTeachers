import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Select, Upload, message, DatePicker } from 'antd';
import axios from 'axios';
import { ApiName } from '../../api/APIname';
import moment from 'moment';

const FormModal = (props) => {
  const [Scientificpublication, setScientificpublication] = useState([]);
  const fulInfo = JSON.parse(localStorage.getItem("myInfo"));
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

  const [searchResults, setSearchResults] = useState([]);
  const [monografiya, setMonografiya] = useState(false);
  const [url, setUrl] = useState(true);
  const [fileList, setFileList] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    ClassifairGet();
    if (props.editingData) {
      const editingValues = {
        ...props.editingData,
        issueYear: moment(props.editingData.issueYear),
        // publicationType: props.editingData.publicationType,
        classifierOptionsDTO: props.editingData.scientificPublicationType?.name,
        fileType: props.editingData.fileType || 'Url'
      };
      setData(editingValues);
      form.setFieldsValue(editingValues);
      setMonografiya(props.editingData.scientificPublicationType?.name === 'Monografiya');
      setUrl(props.editingData.fileType === 'Url');
    }
  }, [props.editingData, form]);

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
    if (value) {
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
    } else {
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
        });

    request.then(response => {
      message.success(`Maqola muvaffaqiyatli ${props.editingData ? 'yangilandi' : 'qo\'shildi'}`);
      if (props.onSuccess) {
        props.onSuccess();
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
          name="publicationType"
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
            <Input value={data.decisionScientificCouncil} name="decisionScientificCouncil" onChange={handleInputChange} placeholder='Ilmiy yoki ilmiy texnik kengash qarori' className='py-2' />
          </Form.Item>
        )}

        <Form.Item
          layout="vertical"
          label="Til"
          name="language"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
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
          <Input value={data.scientificName} name="scientificName" onChange={handleInputChange} placeholder='Nashrning bibliografik matni' className='py-2' />
        </Form.Item>

        <Form.Item
          layout="vertical"
          label="Fayl joylash"
          name="fileType"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
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
            <Input value={data.doiOrUrl} name="doiOrUrl" onChange={handleInputChange} placeholder='URL manzil' className='py-2' />
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
          <Input value={data.scientificField} name="scientificField" onChange={handleInputChange} placeholder='Ilmiy yo`nalish' className='py-2' />
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
          />
        </Form.Item>

        <Form.Item
          layout="vertical"
          label="Chiqarilgan yil"
          name="issueYear"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          rules={[{ required: true, message: 'Iltimos chiqarilgan yilni tanlang' }]}
          className='col-6'
        >
          <DatePicker value={data.issueYear} name="issueYear" onChange={(date) => setData(prevState => ({ ...prevState, issueYear: date }))} picker="year" className='py-2' />
        </Form.Item>

        <Form.Item className='col-12 d-flex justify-content-end'>
          <Button type="primary" htmlType="submit" className='me-2'>
            Saqlash
          </Button>
          <Button htmlType="button" onClick={props.onCancel}>
            Bekor qilish
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default FormModal;




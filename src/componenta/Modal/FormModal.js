import React, { useEffect, useState } from 'react';
import { Button, Form, Input, InputNumber, Select, Upload, message, Space, DatePicker } from 'antd';
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
  const [selectedItems, setSelectedItems] = useState([]);
  const [monografiya, setMonografiya] = useState(false);
  const [url, setUrl] = useState(true);
  const [error, setError] = useState('');
  const [isSucses, setIsSucses] = useState(false);
  const { RangePicker } = DatePicker;

  useEffect(() => {
    ClassifairGet();
    if (props.editingData) {
      setData({
        ...props.editingData,
        issueYear: moment(props.editingData.issueYear),
        publicationType: props.editingData.publicationType,
        scientificPublicationType: props.editingData.scientificPublicationType,
        fileType: props.editingData.fileType || 'Url'
      });
      setMonografiya(props.editingData.scientificPublicationType?.name === 'Monografiya');
      setUrl(props.editingData.fileType === 'Url');
    }
  }, [props.editingData]);

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
        });
        if (response.data.isSuccess && !response.data.error) {
          setSearchResults(response.data.data.results || []);
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
    setData((prevState) => ({
      ...prevState,
      authorIds: value
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

  const propsss = () => ({
    name: 'file',
    action: `${ApiName}/api/v1/attach/upload`,
    headers: {
      Authorization: `Bearer ${fulInfo?.accessToken}`,
    },
    showUploadList: false,
    onChange: (info) => handleFileChange(info),
  });

  const handleFileChange = (info) => {
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
    
    if (props.editingData) {
      axios.put(`${ApiName}/api/publication/update`, requestPayload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${fulInfo?.accessToken}`,
        },
      })
      .then(response => {
        message.success('Maqola muvaffaqiyatli yangilandi');
        // props.onSuccess();
      })
      .catch(error => {
        console.log(error);
        message.error('Maqolani yangilashda xatolik');
      });
    } else {
      axios.post(`${ApiName}/api/publication/create`, requestPayload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${fulInfo?.accessToken}`,
        },
      })
      .then(response => {
        message.success('Maqola muvaffaqiyatli qo\'shildi');
        // props.onSuccess();
      })
      .catch(error => {
        console.log(error);
        message.error('Maqolani qo\'shishda xatolik');
      });
    }
  };

  return (
    <div>
      <Form className='row' onFinish={handleSubmit}>
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
            value={data.scientificPublicationType?.code}
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
            label="URL"
            name="doiOrUrl"
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            rules={[
              { type: 'url', message: "Iltimos, amal qiladigan URL kiriting" },
              { required: true, message: 'Iltimos URL kiriting' }
            ]}
            className='col-6'
          >
            <Input
              value={data.doiOrUrl}
              name="doiOrUrl"
              onChange={handleInputChange}
              placeholder='URL'
              className='py-2'
            />
          </Form.Item>
        ) : (
          <Form.Item
            layout="vertical"
            label="Fayl"
            name="file"
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            className='col-6'
          >
            <Upload {...propsss()}>
              <Button>Yuklash</Button>
            </Upload>
          </Form.Item>
        )}

        <Form.Item
          layout="vertical"
          label="Ilm-fan sohasi"
          name="scientificField"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          className='col-6'
        >
          <Select
            value={data.scientificField}
            name="scientificField"
            onChange={(value, option) => handleSelectChange(value, { name: "scientificField" })}
          >
            <Select.Option value="Aniq fanlar">Aniq fanlar</Select.Option>
            <Select.Option value="Amaliy fanlar">Amaliy fanlar</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          layout="vertical"
          label="Mualliflar soni"
          name="authorCount"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          rules={[{ required: true, message: 'Iltimos mualliflar sonini kiriting' }]}
          className='col-6'
        >
          <InputNumber
            value={data.authorCount}
            name="authorCount"
            onChange={(value) => setData(prevState => ({ ...prevState, authorCount: value }))}
            placeholder='Mualliflar soni'
            className='py-2 w-100'
          />
        </Form.Item>

        <Space className="col-6" direction="vertical">
          <Select
            mode="multiple"
            allowClear
            style={{ width: '100%' }}
            placeholder="Mualliflarni tanlang"
            onSearch={handleSearch}
            onChange={handleChange}
            options={searchResults.map((result) => ({ value: result.id, label: result.name }))}
            filterOption={false}
            showSearch
          />
        </Space>

        <Form.Item
          layout="vertical"
          label="Xalqaro ilmiy bazalar"
          name="publicationDatabase"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          className='col-6'
        >
          <Input
            value={data.publicationDatabase}
            name="publicationDatabase"
            onChange={handleInputChange}
            placeholder='Xalqaro ilmiy bazalar'
            className='py-2'
          />
        </Form.Item>

        <Form.Item
          layout="vertical"
          label="Nashr sanasi"
          name="issueYear"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          rules={[{ required: true, message: 'Iltimos nashr sanasini kiriting' }]}
          className='col-6'
        >
          <DatePicker
            value={data.issueYear}
            name="issueYear"
            onChange={(date) => setData(prevState => ({ ...prevState, issueYear: date }))}
            className='w-100'
          />
        </Form.Item>

        <Form.Item className='col-12'>
          <Button type="primary" htmlType="submit" className='w-100'>
            {props.editingData ? 'Yangilash' : 'Yuborish'}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default FormModal;



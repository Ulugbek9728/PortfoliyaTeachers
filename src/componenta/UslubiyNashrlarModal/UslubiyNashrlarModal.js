import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Upload,
  Select,
  message,
  Divider,
} from "antd";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import { ApiName } from "../../api/APIname";
import "./UslubiyNashrlarModal.scss";
import moment from "moment";
import dayjs from "dayjs";

const UslubiyNashrlarModal = (props) => {
  const fulInfo = JSON.parse(localStorage.getItem("myInfo"));
  const inputRef = useRef(null);
  const [searchResults, setSearchResults] = useState([]);
  const [stylePublicationType, setStylePublicationType] = useState([]);
  const [form] = Form.useForm();
  const [url, seturl] = useState(true);
  const formRef = useRef(null);
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
  useEffect((value) => {
    ClassifairGet();
    if (props.editingData) {
      const editingValues = {
        ...props.editingData,
        mediaIds:props.editingData.mediaIds?.map((item)=>item.attachResDTO.id),
        styleCertificateDate: dayjs(props.editingData.styleCertificateDate),
        issueYear: dayjs(props.editingData.issueYear),
        authorIds: props.editingData?.authors ? JSON.parse(props.editingData.authors).map(item=>item.id) : [],
        scientificField: props.editingData.scientificField,
        publicationType: props.editingData.publicationType,
        stylePublicationType: props.editingData.stylePublicationType,
        fileType: props.editingData.fileType || 'Url'
      };
      setData(editingValues);
      form.setFieldsValue(editingValues);
      // setMonografiya(Scientificpublication[0]?.options?.filter(item => item.code === value)[0]?.name === 'Monografiya');
      // setUrl(props.editingData.fileType === 'Url');
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
  }
  }, [props.editingData, form]);
  useEffect(() => {
    return () => {
      handleSearch();
    };
  }, []);
  const handleSearch = async () => {

    try {
      const response = await axios.get(`${ApiName}/api/author/search`, {
        params: { query: '' },
        headers: {
          Authorization: `Bearer ${fulInfo?.accessToken}`,
        },
      });
      if (response.data.isSuccess && !response.data.error) {
        setSearchResults(response.data.data || []);
      } else {
        console.error("Error in response:", response.data.message);
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
      setSearchResults([]);
    }
  };

  const handleChange = (value) => {
    setData((prevState) => ({
      ...prevState,
      authorIds: value,
      authorCount: value.length+1,
    }));
  };


  function ClassifairGet() {
    axios
      .get(`${ApiName}/api/classifier`, {
        params: {
          key: "h_methodical_publication_type",
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${fulInfo?.accessToken}`,
        },
      })
      .then((response) => {
        setStylePublicationType(response.data);
      })
      .catch((error) => {
        console.log(error, "error");
      });
  }
  const handleInputChange = (event) => {
    const { name, value } = event.target;
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
    const { name } = option;
    setData(prevState => ({
      ...prevState,
      [name]: name === 'stylePublicationType' ? stylePublicationType[0]?.options?.filter(item => item.code === value)[0] : value
  }));
    if (name === "fileType") {
      seturl(value === "Url");
    }
  };

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

  const handleSubmit = (values) => {
  const request = props.editingData
    ? axios.put(`${ApiName}/api/publication/update`,{
      ...data,
      issueYear: data.issueYear.format('YYYY-MM-DD'),
      styleCertificateDate: data.styleCertificateDate.format('YYYY-MM-DD')
    }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${fulInfo?.accessToken}`,
        },
      })
    : axios.post(`${ApiName}/api/publication/create`, 
    {
      ...data,
      issueYear: data.issueYear.format('YYYY-MM-DD'),
      styleCertificateDate: data.styleCertificateDate.format('YYYY-MM-DD')
  },
    {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${fulInfo?.accessToken}`,
        },
      })
  request.then(response => {
    message.success(`Maqola muvaffaqiyatli ${props.editingData ? 'yangilandi' : 'qo\'shildi'}`);
    form.resetFields();
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
  }).catch(error => {
    console.log(error);
    message.error(`Maqolani ${props.editingData ? 'yangilashda' : 'qo\'shishda'} xatolik`);
  });
};
  const onFinish = (values) => {
    const requestPayload2 = {
      ...data2,
    };
    console.log(data2);
    axios
      .post(`${ApiName}/api/author/create`, requestPayload2, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${fulInfo?.accessToken}`,
        },
      })
      .then((response) => {
        console.log(data2);
        handleSearch("");
        message.success(`Maqola muvaffaqiyatli 'qo'shildi'}`);
      })
      .catch((error) => {
        console.log(error);
        message.error(`Maqolani 'qo'shishda'} xatolik`);
      });
  };

  return (
    <div>
      <Form 
      className="row" 
      form={form} 
      ref={formRef}
      initialValues={data} 
      onFinish={handleSubmit}
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
          name: "scientificField",
          value: data?.scientificField
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
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          className="col-3"
        >
          <Select
            options={stylePublicationType[0]?.options?.map((item) => ({
              label: item.name,
              value: item.code,
            }))}
            name="stylePublicationType"
            onChange={(value, option) =>
              handleSelectChange(value, { name: "stylePublicationType" })
            }
          />
        </Form.Item>
        <Form.Item
          layout="vertical"
          label="Til"
          name="language"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          className="col-3"
        >
          <Select
            name="language"
            onChange={(value, option) =>
              handleSelectChange(value, { name: "language" })
            }
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
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          className="col-6"
        >
          <Select
            name="fileType"
            onChange={(value, option) =>
              handleSelectChange(value, { name: "fileType" })
            }
          >
            <Select.Option value={"Url"}>Url</Select.Option>
            <Select.Option value={"Upload"}>Upload</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          layout="vertical"
          label="Mualliflar"
          name="authorIds"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
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
                 options={searchResults.map(author => ({value: author.id, label: author.fullName +' (' + author.workplace + ' '+ author.position + ') '}))}
            dropdownRender={(menu) => (
              <>
                {menu}
                <Divider
                  style={{
                    margin: "8px 0",
                  }}
                />
                <Form name="wrap" form={form2}>
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
                        icon={<PlusOutlined />}
                        onClick={onFinish}
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

        {url === true ? (
          <Form.Item
            layout="vertical"
            label="URL"
            name="doiOrUrl"
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            className="col-6"
            rules={[{ required: true, message: "Iltimos URL manzil kiriting" }]}
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
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            className="col-6"
            name="file"
            // valuePropName="fileList"
          >
           <Upload name='file' {...uploadProps}>
             <Button icon={<UploadOutlined />}>PDF</Button>                    </Upload>
          </Form.Item>
        )}

        <Form.Item
          layout="vertical"
          label="Nashriyot"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          className="col-6"
          name='stylePublisher'
        >
          <Input name="stylePublisher"
            onChange={handleInputChange}
            placeholder="Nashriyot"
            className="py-2" />
        </Form.Item>
        <Form.Item
          layout="vertical"
          label="Nashr yili"
          name="issueYear"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          rules={[
            { required: true, message: "Iltimos chiqarilgan yilni tanlang" },
          ]}
          className="col-6"
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
        <Form.Item
          layout="vertical"
          label="Guvohnoma Raqami"
          name="styleCertificateNumber"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
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
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          className="col-3"
        >
          <DatePicker 
          className="py-2"
          format="YYYY-MM-DD"
          name="styleCertificateDate"
          onChange={(date) => {
              setData({...data, styleCertificateDate: date})
          }}
          />
        </Form.Item>

        <Form.Item className="col-12 d-flex justify-content-end">
          <Button  type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default UslubiyNashrlarModal;

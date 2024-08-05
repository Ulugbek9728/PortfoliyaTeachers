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
import { PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import { ApiName } from "../../api/APIname";
import "./UslubiyNashrlarModal.scss";
import IntURL from "../IntURL/IntURL";
import moment from "moment";

const UslubiyNashrlarModal = (props) => {
  const fulInfo = JSON.parse(localStorage.getItem("myInfo"));
  const inputRef = useRef(null);
  const [searchResults, setSearchResults] = useState([]);
  const [Scientificpublication, setScientificpublication] = useState([]);
  const [form] = Form.useForm();
  const [selected, setSelected] = useState("");
  const [fileList, setFileList] = useState([]);
  const [url, seturl] = useState(true);
  const [selectfile, setselectfile] = useState();
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
    authorIds: [],
  });
  const [data2, setData2] = useState({
    citizenship: "",
    fullName: "",
    workplace: "",
    position: "",
    degreeAndTitle: "",
  });
  const [form2] = Form.useForm();
  const [name, setName] = useState("");
  const [items, setItems] = useState(["jack", "lucy"]);

  useEffect(() => {
    return () => {
      handleSearch("");
    };
  }, []);
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
      authorCount: value.length,
    }));
  };

  useEffect(() => {
    ClassifairGet();
  }, []);
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
        setScientificpublication(response.data);
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
  };

  const handleFileChange = (info) => {
    let newFileList = [...info.fileList];
    setFileList(newFileList);
    if (info.file.status === "done") {
      message.success(`${info.file.name} fayl muvaffaqiyatli yuklandi`);
      setData((prevState) => ({
        ...prevState,
        mediaIds: [info.file.response.id],
      }));
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} fayl yuklashda xato.`);
    }
  };

  const handleSelectChange = (value, option) => {
    const { name } = option;
    console.log(Scientificpublication);
    setData((prevState) => ({
      ...prevState,
      [name]:
        name === "scientificPublicationType"
          ? Scientificpublication[0]?.options?.filter(
              (item) => item.code === value
            )[0]
          : value,
    }));
    if (name === "fileType") {
      seturl(value === "Url");
    }
  };
//   const onNameChange = (event) => {
//     setName(event.target.value);
//   };
//   const addItem = (e) => {
//     e.preventDefault();
//     // setItems([...items, name || `New item ${index++}`]);
//     setName("");
//     setTimeout(() => {
//       inputRef.current?.focus();
//     }, 0);
//   };
  const uploadProps = {
    name: "file",
    action: `${ApiName}/api/v1/attach/upload`,
    headers: {
      Authorization: `Bearer ${fulInfo?.accessToken}`,
    },
    fileList: fileList,
    onChange: (info) => handleFileChange(info),
    showUploadList: false,
  };
  const options = [];
  for (let i = 10; i < 36; i++) {
    options.push({
      label: i.toString(36) + i,
      value: i.toString(36) + i,
    });
  }  
  const handleSubmit = () => {
    const requestPayload = {
        ...data,
        issueYear: data.issueYear.format('YYYY-MM-DD')
      };
    axios.post(`${ApiName}/api/publication/create`, requestPayload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${fulInfo?.accessToken}`,
        },
      }).then(res =>{
        console.log(res);
    message.success('maqola muvafaqiyatli yuklandi')
    }).catch(error =>{
        console.log(error);
    message.error('xato')
    })
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
      <Form className="row" form={form} initialValues={data} onFinish={handleSubmit}>
        <Form.Item
          layout="vertical"
          label="Uslubiy nashr turi"
          name="IlmiyNashr"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          className="col-3"
        >
          <Select
            value={data.scientificPublicationType}
            options={Scientificpublication[0]?.options?.map((item) => ({
              label: item.name,
              value: item.code,
            }))}
            name="scientificPublicationType"
            onChange={(value, option) =>
              handleSelectChange(value, { name: "scientificPublicationType" })
            }
          />
        </Form.Item>
        <Form.Item
          layout="vertical"
          label="Til"
          name="Til"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          className="col-3"
        >
          <Select
            value={data.language}
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
          name="nashr"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          className="col-6"
        >
          <Input
            value={data.scientificName}
            name="scientificName"
            onChange={handleInputChange}
            placeholder="Nashrning bibliografik matni"
            className="py-2"
          />
        </Form.Item>

        <Form.Item
          layout="vertical"
          label="fayl joylash turi"
          name="IlmFan"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          className="col-6"
        >
          <Select
            value={data.fileType}
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
          name="Mualliflar"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          className="col-6"
        >
          <Select
            size="large"
            placeholder="Mualilfar"
            mode="multiple"
            allowClear
            value={data.authorIds}
            onSearch={handleSearch}
            onChange={handleChange}
            options={searchResults.map((author) => ({
              value: author.id,
              label: author.fullName,
            }))}
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
            // options={options}
          />
        </Form.Item>

        {url === true ? (
          <Form.Item
            layout="vertical"
            label="URL"
            name="URL"
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            className="col-6"
            rules={[{ required: true, message: "Iltimos URL manzil kiriting" }]}
          >
            <Input
              value={data.doiOrUrl}
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
            valuePropName="fileList"
            onChange={handleFileChange}
          >
            <Upload {...uploadProps}>
              <Button>Fayl yuklash</Button>
            </Upload>
          </Form.Item>
        )}

        <Form.Item
          layout="vertical"
          label="Nashriyot"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          className="col-6"
        >
          <Input className="py-2" />
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
            value={data.issueYear ? moment(data.issueYear) : null}
            name="issueYear"
            onChange={(date) =>
              setData((prevState) => ({
                ...prevState,
                issueYear: date ? date.format("YYYY-MM-DD") : null,
              }))
            }
            className="py-2"
          />
        </Form.Item>
        {/* <Form.Item
          layout="vertical"
          label="Guvohnoma Raqami"
          name="IlmiyBazalar"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          className="col-3"
        >
          <InputNumber className="py-1" />
        </Form.Item>
        <Form.Item
          layout="vertical"
          label="Guvonoma sanasi"
          name="data"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          className="col-3"
        >
          <DatePicker className="py-2" />
        </Form.Item> */}

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

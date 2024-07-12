import React, { useState } from 'react';
import './teacherRating.css';
import { EditOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, DatePicker, Form, Input, Select, Upload, Radio, message } from 'antd';
import { ApiName } from "../../api/APIname";
import axios from 'axios';

const TeacherRating = () => {
  const [fulInfo] = useState(JSON.parse(localStorage.getItem("myInfo")));
  const [data, setData] = useState({
    profileId: "",
    specialist: {
      name: "",
      date: "",
      number: '',
      attachId: ""
    },
    scientificTitle: {
      name: "",
      date: "",
      number: '',
      attachId: ""
    },
    profileRating: {
      scopusURL: "",
      wosURL: "",
      googleScholarURL: ""
    },
    scientificDegree: {
      name: "",
      date: "",
      number: '',
      attachId: ""
    }
  });
  const [edite, setEdite] = useState(false);
  const [radio, setRadio] = useState('');
  const [radio2, setRadio2] = useState('');
  const handleDateChange = (value, name) => {
    setData((prevData) => {
      const keys = name.split('.');
      if (keys.length === 1) {
        return {
          ...prevData,
          [name]: value,
        };
      } else {
        let newState = { ...prevData };
        let current = newState;
        for (let i = 0; i < keys.length - 1; i++) {
          current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;
        return newState;
      }
    });
  };
  const handleFileChange = (info, section) => {
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
      setData((prevState) => ({
        ...prevState,
        [section]: {
          ...prevState[section],
          attachId: info.file.response.id,
        },
      }));
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    } else if (info.file.status === 'removed') {
      message.success(`${info.file.name} file removed successfully`);
      setData((prevState) => ({
        ...prevState,
        [section]: {
          ...prevState[section],
          attachId: '',
        },
      }));
    }
  };

  const propsss = (section) => ({
    name: 'file',
    action: `${ApiName}/api/v1/attach/upload`,
    headers: {
      Authorization: `Bearer ${fulInfo?.accessToken}`,
    },
    onChange: (info) => handleFileChange(info, section),
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    const [section, field] = name.split('.');

    if (field) {
      setData(prevState => ({
        ...prevState,
        [section]: {
          ...prevState[section],
          [field]: value
        }
      }));
    } else {
      setData(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  const handleSelectChange = (value, option) => {
    const { name } = option;
    if (!name) return; // Add this line to handle undefined name

    const [section, field] = name.split('.');

    if (field) {
      setData(prevState => ({
        ...prevState,
        [section]: {
          ...prevState[section],
          [field]: value
        }
      }));
    } else {
      setData(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  const handleSubmit = () => {
    console.log(data);
    // axios.put(`${ApiName}/api/employee/update`, data, {
    //   headers: {
    //     'Content-Type': 'application/json',
    //     Authorization: `Bearer ${fulInfo?.accessToken}`,
    //   },
    // })
    //   .then(response => {
    //     console.log('Success:', response.data);
    //     message.success('Form submitted successfully');
    //   })
    //   .catch(error => {
    //     console.error('Error:', error);
    //     message.error('Error submitting form');
    //   });
  };

  const handlechangeradio = (e) => {
    if (e.target.value === 'ha') {
      setRadio(true);
    } else if (e.target.value === 'ha1') {
      setRadio2(true);
    } else if (e.target.value === 'yoq1') {
      setRadio2(false);
    } else {
      setRadio(false);
    }
  };

  return (
    <>
      <div className='TeacherRating'>
        <div className='TeacherRating_header'>
          <div className='TeacherRating_img'>
            {<img src={fulInfo?.imageUrl} alt='' />}
          </div>
          <div className='TeacherRating_text'>
            <h3 className='TeacherRating_text_name'>{fulInfo?.fullName}</h3>
            <div className='TeacherRating_text_description'>
              <div className='d-flex'>
                <b className='mx-3'>Ish joy:</b>
                <p>{fulInfo?.parentDepartment?.name} <br /> {fulInfo?.department?.name}</p>
              </div>
              <div className='d-flex'>
                <b className='mx-3'>Lavozim: </b>
                <p> {fulInfo?.staffPosition?.name}</p>
              </div>
              <div className='d-flex'>
                <b className='mx-3'>Shtat birligi:</b>
                <p> {fulInfo?.employmentForm?.name} {fulInfo?.employmentStaff?.name}</p>
              </div>
            </div>
          </div>
          <button className='btn btn-warning' style={{ height: 50 }} onClick={() => setEdite(!edite)}>
            <EditOutlined />
          </button>
        </div>
        <div className='teacher_rating_bottom'>
          <div className='text-center br_right'>
            <span className='fw-bolder text-4xl '>132</span>
            <p className='text-lg text-center'>Citations</p>
          </div>
          <div className='text-center br_right'>
            <span className='fw-bolder text-4xl '>132</span>
            <p className='text-lg text-center'>Citations</p>
          </div>
          <div className='text-center br_right'>
            <span className='fw-bolder text-4xl '>132</span>
            <p className='text-lg text-center'>Citations</p>
          </div>
          <div className='text-center'>
            <span className='fw-bolder text-4xl '>132</span>
            <p className='text-lg text-center'>Citations</p>
          </div>
        </div>
      </div>
      {edite && (
        <div className="TeacherRating">
          <Form onFinish={handleSubmit} labelAlign="left" layout="vertical" colon={false} style={{ maxWidth: '100%' }}>
            <div className="d-flex gap-5">
              <div style={{ width: '33%' }}>
                <Form.Item label="Mutaxassislik" name="Mutaxassislik">
                  <Input value={data.specialist.name} name="specialist.name" onChange={handleInputChange} placeholder="Mutaxasislik nomi" />
                  <DatePicker  value={data.specialist.date} name='specialist.date' onChange={(date) => handleDateChange(date, 'specialist.date')} className='my-2' placeholder="Diplom sanasi" />
                  <Input value={data.specialist.number} name='specialist.number' onChange={handleInputChange} placeholder="Diplom raqami" />
                </Form.Item>
                <Form.Item name='file'>
                  <Upload {...propsss('specialist')}>
                    <Button icon={<UploadOutlined />}>Diplom (pdf)</Button>
                  </Upload>
                </Form.Item>
                <hr />
                <Form.Item label="Ilmiy unvon" name="scientificTitle">
                  <Select
                    name="scientificTitle.name"
                    value={data.scientificDegree.name || undefined}
                    onChange={(value, option) => handleSelectChange(value, { name: "scientificTitle.name" })}
                    placeholder="Ilmiy unvon nomi"
                    options={[
                      { value: 'Stajer-tadqiqotchi', label: 'Dotsent' },
                      { value: 'Tayanch doktorant (PhD)', label: 'Professor' }
                    ]}
                  />
                   <DatePicker   value={data.scientificTitle.date} name='scientificTitle.date' onChange={(date) => handleDateChange(date, 'scientificTitle.date')} className='my-2' placeholder="Diplom sanasi" />
                  {/* <Input value={data.scientificTitle.date} name='scientificTitle.date' onChange={handleInputChange} className='my-2' placeholder="Diplom sanasi" /> */}
                  <Input value={data.scientificTitle.number} name='scientificTitle.number' onChange={handleInputChange} placeholder="Diplom raqami" />
                </Form.Item>
                <Form.Item name='file'>
                  <Upload {...propsss('scientificTitle')}>
                    <Button icon={<UploadOutlined />}>Diplom (pdf)</Button>
                  </Upload>
                </Form.Item>
                <hr />
              </div>
              <div style={{ width: '33%' }}>
                <Form.Item label="Reyting">
                  <Input value={data.profileRating.scopusURL} onChange={handleInputChange} name="profileRating.scopusURL" className='my-2' placeholder="Scopus maʼlumotlar bazasidagi sahifasiga (profiliga) havola" />
                  <Input value={data.profileRating.wosURL} onChange={handleInputChange} name='profileRating.wosURL' className='my-2' placeholder="WoS maʼlumotlar bazasidagi sahifasiga (profiliga) havola" />
                  <Input value={data.profileRating.googleScholarURL} onChange={handleInputChange} name='profileRating.googleScholarURL' placeholder="GoogleScholar maʼlumotlar bazasidagi sahifasiga (profiliga) havola" />
                </Form.Item>
                <hr/>
                <Form.Item label="Davlat mukofoti bilan tag`dirlanganligi" name="scientificDegree">
                      <DatePicker  name='scientificDegree.date'className='my-2' placeholder="Olgan sanasi" />
                      <Input placeholder="Diplom raqami" />
                    </Form.Item>
              </div>
              <div style={{ width: '33%' }}>
                <Form.Item style={{ marginTop: "27px" }} label="Ilmiy daraja bormi?">
                  <Radio.Group onChange={handlechangeradio}>
                    <Radio value={'ha'}>Ha</Radio>
                    <Radio value={'yoq'}>Yo'q</Radio>
                  </Radio.Group>
                </Form.Item>
                <hr />
                {radio && (
                  <>
                    <Form.Item label="Ilmiy daraja" name="scientificDegree">
                      <Select
                        name='scientificDegree.name'
                        placeholder="Ilmiy daraja nomi"
                        value={data.scientificDegree.name ||undefined}
                        onChange={(value, option) => handleSelectChange(value, { name: "scientificDegree.name" })}
                        options={[
                          { value: 'Falsafa doktori (PhD)', label: 'Falsafa doktori (PhD)' },
                          { value: 'Fan doktori, (DSc)', label: 'Fan doktori, (DSc)' }
                        ]}
                      />
                      <DatePicker  value={data.scientificDegree.date} name='scientificDegree.date' onChange={(date) => handleDateChange(date, 'scientificDegree.date')} className='my-2' placeholder="Diplom sanasi" />
                      <Input onChange={handleInputChange} value={data.scientificDegree.number} name='scientificDegree.number' placeholder="Diplom raqami" />
                    </Form.Item>
                    <hr />
                    <Form.Item name='file'>
                      <Upload {...propsss('scientificDegree')}>
                        <Button icon={<UploadOutlined />}>Diplom (pdf)</Button>
                      </Upload>
                    </Form.Item>
                    <Form.Item style={{ marginTop: "27px" }} label="Dunyoning nufuzli TOP-1000 taligiga kiruvchi OTMlarida (PhD) yoki (DSc) darajasini olganligi">
                      <Radio.Group onChange={handlechangeradio}>
                        <Radio value={'ha1'}>Ha</Radio>
                        <Radio value={'yoq1'}>Yo'q</Radio>
                      </Radio.Group>
                    </Form.Item>
                    {radio2 && (
                      <Form.Item  name="top100">
                        <Input placeholder="Shaxri, davlati" />
                        <Input className='my-2' placeholder="Universituti" />
                      </Form.Item>
                    )}
                  </>
                )}
              </div>
            </div>
            <Form.Item label=" ">
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </div>
      )}
    </>
  );
};

export default TeacherRating;
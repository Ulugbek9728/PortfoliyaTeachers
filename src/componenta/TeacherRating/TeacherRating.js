import React, { useEffect, useState } from 'react';
import './teacherRating.css';
import { EditOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, DatePicker, Form, Input, Select, Upload, Radio, message, InputNumber } from 'antd';
import { ApiName } from "../../api/APIname";
import axios from 'axios';
import moment from 'moment';

const TeacherRating = () => {

  const fulInfo = JSON.parse(localStorage.getItem("myInfo"));
  const [getFullInfo, setGetFullInfo] = useState(null);
  const [data, setData] = useState({
    profileId: fulInfo?.id,
    specialist: {
      name: "",
      date: "",
      number: null,
      attachId: ""
    },
    scientificTitle: {
      name: "",
      date: "",
      number: null,
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
      number: null,
      attachId: ""
    },
    isTop1000: false,
    profileTop1000: {
      country: "",
      university: ""
    },  profileStateAwardDTO: {
      nameStateAward: "",
      date: "",
      attachId: ""
    }
  
  });
  const [edite, setEdite] = useState(false);
  const [radio, setRadio] = useState(false);
  const [radio2, setRadio2] = useState(data.isTop1000);

  useEffect(() => {
    if (edite) {
      setData({
        profileId: fulInfo?.id,
        specialist: {
          name: getFullInfo?.specialist?.name || "",
          date: getFullInfo?.specialist?.date || "",
          number: getFullInfo?.specialist?.number || null,

        },
        scientificTitle: {
          name: getFullInfo?.scientificTitle?.name || "",
          date: getFullInfo?.scientificTitle?.date || "",
          number: getFullInfo?.scientificTitle?.number || null,
          
        },
        profileRating: {
          scopusURL: getFullInfo?.profileRating?.scopusURL || "",
          wosURL: getFullInfo?.profileRating?.wosURL || "",
          googleScholarURL: getFullInfo?.profileRating?.googleScholarURL || ""
        },
        scientificDegree: {
          name: getFullInfo?.scientificDegree?.name || "",
          date: getFullInfo?.scientificDegree?.date || "",
          number: getFullInfo?.scientificDegree?.number || null, 
        },
        isTop1000: getFullInfo?.isTop1000 || false,
        profileTop1000: {
          country: getFullInfo?.profileTop1000?.country || "",
          university: getFullInfo?.profileTop1000?.university || ""
        },
        profileStateAwardDTO: {
          nameStateAward: getFullInfo?.profileStateAwardDTO?.nameStateAward || "",
          date: getFullInfo?.profileStateAwardDTO?.date || "",
        }
      });
      setRadio(getFullInfo?.scientificDegree?.name ? true : false);
      setRadio2(getFullInfo?.isTop1000 || false);
    }
  }, [edite, getFullInfo]);
  useEffect(() => {  
    fetchCurrentUser();
  }, []);
  const fetchCurrentUser = async () => {
    try {
      const response = await axios.get(`${ApiName}/api/profile/current`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${fulInfo?.accessToken}`,
        },
      });

      if (response.data.isSuccess === true) {
        setGetFullInfo(response.data.data);
      }
    } catch (error) {
      console.log('Xatolik yuz berdi:', error);
    }
  };



  const handleDateChange = (date, name) => {
    const formattedDate = date ? date.format('YYYY-MM-DD') : null;
    setData((prevData) => {
      const keys = name.split('.');
      if (keys.length === 1) {
        return {
          ...prevData,
          [name]: formattedDate,
        };
      } else {
        let newState = { ...prevData };
        let current = newState;
        for (let i = 0; i < keys.length - 1; i++) {
          current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = formattedDate;
        return newState;
      }
    });
  };

  const handleFileChange = (info, section) =>   {
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
    axios.put(`${ApiName}/api/profile/update`, data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${fulInfo?.accessToken}`,
      },
    })
      .then(response => {
        message.success('Form submitted successfully');
        setEdite(false);
        fetchCurrentUser();
      })
      .catch(error => {
        console.error('Error:', error);
        message.error('Error submitting form');
      });
  };

  const handleRadioChange = (e) => {
    const { value } = e.target;
    setRadio(value === 'ha');
  };

  const handleRadioChange2 = (e) => {
    const { value } = e.target;
    const isTop1000 = value === 'ha1';
    setRadio2(isTop1000);
    setData(prevState => ({
      ...prevState,
      isTop1000
    }));
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
            <div className='TeacherRating_text_description row '>
            <div className='col-4'>
              <div >
                <b >Ish joy:</b>
                <p>{fulInfo?.parentDepartment?.name} <br /> {fulInfo?.department?.name}</p>
              </div>
              <div>
                <b >Lavozim: </b>
                <p> {fulInfo?.staffPosition?.name}</p>
              </div>
              <div>
                <b >Shtat birligi:</b>
                <p> {fulInfo?.employmentForm?.name} {fulInfo?.employmentStaff?.name}</p>
              </div>
              <hr/>
            </div>
              <div  className='col-4'>
              <div className=''>
                <b >Mutaxasislik nomi</b>
                <p> {getFullInfo?.specialist?.name}</p>
              </div>
              <div className=''>
                <b >Diplom sanasi</b>
                <p> {getFullInfo?.specialist?.date}</p>
              </div>
              <div className=''>
                <b>Diplom soni</b>
                <p> {getFullInfo?.specialist?.number}</p>
              </div>
              <hr/>
            </div>
            <div  className='col-4'>
              <div className=''>
                <b>Ilmiy unvon nomi</b>
                <p> {getFullInfo?.scientificTitle?.name}</p>
              </div>
              <div className=''>
                <b >Diplom sanasi</b>
                <p> {getFullInfo?.scientificTitle?.date}</p>
              </div>
              <div className=''>
                <b>Diplom raqami</b>
                <p> {getFullInfo?.scientificTitle?.number}</p>
              </div>
              <hr/>
            </div>
            <div  className='col-4'>
              <div className=''>
                <b >Scopus linki</b>
                <p> {getFullInfo?.profileRating?.scopusURL}</p>
              </div>
              <div className=''>
                <b>Wos linki</b>
                <p> {getFullInfo?.profileRating?.wosURL}</p>
              </div>
              <div className=''>
                <b >Google scholar linki</b>
                <p> {getFullInfo?.profileRating?.googleScholarURL}</p>
              </div>
              <hr/>
            </div>
            <div  className='col-4'>
              <div>
                <b >Davlat mukofoti nomi</b>
                <p> {getFullInfo?.profileStateAwardDTO?.nameStateAward}</p>
              </div>
              <div>
                <b>Davlat mukofotini olgan sanasi</b>
                <p> {getFullInfo?.profileStateAwardDTO?.date}</p>
              </div>
              <hr/>
            </div>
            <div  className='col-4'>
              <div className=''>
                <b >Ilmiy daraja nomi</b>
                <p> {getFullInfo?.scientificDegree?.name}</p>
              </div>
              <div className=''>
                <b >Diplom sanasi</b>
                <p> {getFullInfo?.scientificDegree?.date}</p>
              </div>
              <div className=''>
                <b>Diplom raqami</b>
                <p> {getFullInfo?.scientificDegree?.number}</p>
              </div>
              <hr/>
            </div>
            <div  className='col-4'>
              <div className=''>
                <b >Davlati</b>
                <p> {getFullInfo?.profileTop1000?.country}</p>
              </div>
              <div className=''>
                <b>Universituti</b>
                <p> {getFullInfo?.profileTop1000?.university}</p>
              </div>
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
                  <DatePicker
                    value={data.specialist.date ? moment(data.specialist.date) : null}
                    name='specialist.date'
                    onChange={(date) => handleDateChange(date, 'specialist.date')}
                    className='my-2'
                    placeholder="Diplom sanasi"
                  />
                  <InputNumber value={data.specialist.number} name='specialist.number' onChange={(value) => handleInputChange({ target: { name: 'specialist.number', value } })} placeholder="Diplom raqami" style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item name='file'>
                  <Upload {...propsss('specialist')}>
                    <Button icon={<UploadOutlined />}>Diplom (pdf)</Button>
                  </Upload>
                </Form.Item>
                <hr />
                <Form.Item label="Ilmiy unvon" name="ilmiyUnvon">
                  <Select
                    name='scientificTitle.name'
                    placeholder="Ilmiy unvon nomi"
                    value={data.scientificTitle.name || undefined}
                    onChange={(value, option) => handleSelectChange(value, { name: "scientificTitle.name" })}
                    options={[
                      { value: 'katta ilmiy xodim', label: 'Katta ilmiy xodim' },
                      { value: 'kichik ilmiy xodim', label: 'Kichik ilmiy xodim' },
                      { value: 'tayanch doktorant (PhD)', label: 'Tayanch doktorant (PhD)' },
                      { value: 'tayanch dotsent', label: 'Tayanch dotsent' }
                    ]}
                  />
                  <DatePicker
                    value={data.scientificTitle.date ? moment(data.scientificTitle.date) : null}
                    name='scientificTitle.date'
                    onChange={(date) => handleDateChange(date, 'scientificTitle.date')}
                    className='my-2'
                    placeholder="Diplom sanasi"
                  />
                  <InputNumber value={data.scientificTitle.number} name='scientificTitle.number' onChange={(value) => handleInputChange({ target: { name: 'scientificTitle.number', value } })} placeholder="Diplom raqami" style={{ width: '100%' }} />
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
                <Input value={data.profileStateAwardDTO.nameStateAward} name="profileStateAwardDTO.nameStateAward" onChange={handleInputChange} placeholder="Davlat mukofoti nomi" />
                  <DatePicker
                    value={data.profileStateAwardDTO.date ? moment(data.profileStateAwardDTO.date) : null}
                    name='profileStateAwardDTO.date'
                    onChange={(date) => handleDateChange(date, 'profileStateAwardDTO.date')}
                    className='my-2'
                    placeholder="Olgan sanasi"
                  />

                </Form.Item>
                <Form.Item name='file'>
                 <Upload {...propsss('profileStateAwardDTO')}>
                   <Button icon={<UploadOutlined />}>Diplom (pdf)</Button>
                 </Upload>
                </Form.Item>
              </div>
              <div style={{ width: '33%' }}>
                <Form.Item style={{ marginTop: "27px" }} label="Ilmiy daraja bormi?">
                  <Radio.Group onChange={handleRadioChange}>
                    <Radio value='ha'>Ha</Radio>
                    <Radio value='yoq'>Yo'q</Radio>
                  </Radio.Group>
                </Form.Item>
                <hr />
                {radio && (
                  <>
                    <Form.Item label="Ilmiy daraja" name="scientificDegree">
                      <Select
                        name='scientificDegree.name'
                        placeholder="Ilmiy daraja nomi"
                        value={data.scientificDegree.name || undefined}
                        onChange={(value, option) => handleSelectChange(value, { name: "scientificDegree.name" })}
                        options={[
                          { value: 'Falsafa doktori (PhD)', label: 'Falsafa doktori (PhD)' },
                          { value: 'Fan doktori, (DSc)', label: 'Fan doktori, (DSc)' }
                        ]}
                      />
                      <DatePicker
                        value={data.scientificDegree.date ? moment(data.scientificDegree.date) : null}
                        name='scientificDegree.date'
                        onChange={(date) => handleDateChange(date, 'scientificDegree.date')}
                        className='my-2'
                        placeholder="Diplom sanasi"
                      />
                      <InputNumber value={data.scientificDegree.number} name='scientificDegree.number' onChange={(value) => handleInputChange({ target: { name: 'scientificDegree.number', value } })} placeholder="Diplom raqami" style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item style={{ marginTop: "27px" }} label="Dunyoning nufuzli TOP-1000 taligiga kiruvchi OTMlarida (PhD) yoki (DSc) darajasini olganligi">
                      <Radio.Group onChange={handleRadioChange2} value={radio2 ? 'ha1' : 'yoq1'}>
                        <Radio value='ha1'>Ha</Radio>
                        <Radio value='yoq1'>Yo'q</Radio>
                      </Radio.Group>
                    </Form.Item>
                    {radio2 && (
                      <Form.Item name="top100">
                        <Input value={data.profileTop1000.country} name="profileTop1000.country" onChange={handleInputChange} placeholder="Shaxri, davlati" />
                        <Input className='my-2' value={data.profileTop1000.university} name="profileTop1000.university" onChange={handleInputChange} placeholder="Universituti" />
                        <Upload {...propsss('scientificDegree')}>
                         <Button icon={<UploadOutlined />}>Diplom (pdf)</Button>
                        </Upload>
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
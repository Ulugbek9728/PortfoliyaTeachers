import React, {useEffect, useState} from 'react';
import './teacherRating.css';
import {EditOutlined, UploadOutlined, CloseSquareOutlined} from '@ant-design/icons';
import {Button, DatePicker, Form, Input, Select, Upload, Radio, message, InputNumber, Modal} from 'antd';
import {ApiName} from "../../api/APIname";
import axios from 'axios';
import {useNavigate} from "react-router-dom";
import dayjs from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useQuery } from 'react-query';
import {ClassifairGet} from "../../api/general";
dayjs.extend(customParseFormat);

const defaultDatabaseProfiles = [
    {
        urlOrOrcid: '',
        profileType: {
            name: "Scopus",
            code: "11"
        },
        counts: {
            citedByCount: "",
            citationCount: "",
            hindex: ""
        }
    }, {
        urlOrOrcid: '',
        profileType: {
            name: "Google scholar",
            code: "13"
        },
        counts: {
            citedByCount: "",
            citationCount: "",
            hindex: ""
        }
    }, {
        urlOrOrcid: '',
        profileType: {
            name: "Boshqa",
            code: "10"
        },
        counts: {
            citedByCount: "",
            citationCount: "",
            hindex: ""
        }
    }
];

const TeacherRating = () => {
    const navigate = useNavigate();
    const fulInfo = JSON.parse(localStorage.getItem("myInfo"));
    const [getFullInfo, setGetFullInfo] = useState(null);
    const [data, setData] = useState({
        profileId: fulInfo?.id,
        specialist: {
            name: "",
            date: "",
            number: null,
            attach: ""
        },
        scientificTitle: {
            name: "",
            date: "",
            number: null,
            attach: ""
        },
        scientificDegree: {
            name: "",
            date: "",
            number: null,
            attach: ""
        },
        isTop1000: false,
        databaseProfiles: defaultDatabaseProfiles,
        profileTop1000: {
            country: "",
            university: ""
        },
        profileStateAwardDTO: {
            nameStateAward: "",
            date: "",
        }

    });
    const [edite, setEdite] = useState(false);
    const [radio, setRadio] = useState(false);
    const [radio2, setRadio2] = useState(data.isTop1000);

    useEffect(() => {

        if (edite) {
            setData({
                profileId: fulInfo?.id,
                specialist: getFullInfo?.specialist,
                scientificTitle: getFullInfo?.scientificTitle,
                scientificDegree: getFullInfo?.scientificDegree,
                isTop1000: getFullInfo?.isTop1000,
                profileTop1000: getFullInfo?.profileTop1000,
                profileStateAwardDTO: getFullInfo?.profileStateAwardDTO,
                databaseProfiles: data.databaseProfiles
            });
            setRadio(!!getFullInfo?.scientificDegree?.name);
            setRadio2(getFullInfo?.isTop1000 || false);
        }
    }, [edite, getFullInfo]);
    console.log(getFullInfo)

    useEffect(() => {
        return()=>{
            fetchCurrentUser();
            getprofilLink()
        }

    }, []);

    const scientificTitle = useQuery({
        queryKey: ['Ilmiy_unvon_nomi'],
      queryFn:()=>ClassifairGet('h_academic_rank').then(res=>res.data[0])
    })
    const scientificDegree = useQuery({
      queryKey: ['Ilmiy_daraja_nomi'],
      queryFn:()=>ClassifairGet('h_academic_degree').then(res=>res.data[0])
    })

    const fetchCurrentUser = async () => {
        try {
            const response = await axios.get(`${ApiName}/api/profile/current`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${fulInfo?.accessToken}`,
                },
            });

            if (response.data.isSuccess === true) {
                setGetFullInfo({
                    ...getFullInfo,
                    firstName: response.data?.data.firstName,
                    fullName: response.data?.data.fullName,
                    secondName: response.data?.data.secondName,
                    shortName: response.data?.data.shortName,
                    thirdName: response.data?.data.thirdName,
                    imageUrl: response.data?.data.imageUrl,
                    isTop1000: response.data?.data.isTop1000,
                    profileId: response.data?.data.profileId,
                    profileStateAwardDTO: {
                        attach: JSON.parse(response.data.data.profileStateAwardDTO.attach),
                        date: response.data?.data.profileStateAwardDTO.date,
                        nameStateAward: response.data?.data.profileStateAwardDTO.nameStateAward
                    },
                    profileTop1000: {
                        country: response.data?.data.profileTop1000.country,
                        university: response.data?.data.profileTop1000.university,
                    },
                    roles: response.data?.data.roles,
                    scientificDegree: {
                        attach: JSON.parse(response.data?.data.scientificDegree.attach),
                        date: response.data?.data.scientificDegree.date,
                        name: response.data?.data.scientificDegree.name,
                        number: response.data?.data.scientificDegree.number,
                    },
                    scientificTitle: {
                        attach: JSON.parse(response.data?.data.scientificTitle.attach),
                        date: response.data?.data.scientificTitle.date,
                        name: response.data?.data.scientificTitle.name,
                        number: response.data?.data.scientificTitle.number,
                    },
                    specialist: {
                        attach: JSON.parse(response.data?.data.specialist.attach),
                        date: response.data?.data.specialist.date,
                        name: response.data?.data.specialist.name,
                        number: response.data?.data.specialist.number,
                    }

                });

            }
        } catch (error) {
            if (error.response?.data?.message==="Token yaroqsiz!"){
                localStorage.removeItem("myInfo");

                navigate('/')
            }
            console.log('Xatolik yuz berdi:', error);
        }
    };

    function getprofilLink() {
        axios.get(`${ApiName}/api/author-profile/current`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${fulInfo?.accessToken}`,
            }
        }).then(res => {

            const resDatabaseType = res.data.data;
            setData({
                ...data,
                databaseProfiles: defaultDatabaseProfiles.map(item => {
                    let resData = resDatabaseType?.filter(d => d.profileType.code === item.profileType.code);
                    if (resData?.length === 0) return item;
                    return {
                        ...item,
                        counts: {
                            hindex: resData[0]?.databaseProfile?.hindex,
                            citationCount: resData[0]?.databaseProfile?.citationCount,
                            citedByCount: resData[0]?.databaseProfile?.citedByCount,

                        },
                        website: resData[0]?.databaseProfile?.website,
                        urlOrOrcid: resData[0].urlOrOrcid
                    }
                })
            })
        }).catch(error => {
            console.log(error)
        })
    }

    const handleFileChange = (info, section) => {
        if (info.file.status === 'done') {
            console.log(info)
            message.success(`${info.file.name} file uploaded successfully`);
            setData((prevState) => ({
                ...prevState,
                [section]: {
                    ...prevState[section],
                    attach: info.file.response,

                },
            }));
        } else if (info.file.status === 'removed') {
            if (edite) {
                const result = data[section]?.attach?.id;
                console.log(result)
                setData(prevState => ({
                    ...prevState,
                    [section]: {
                        ...prevState[section],
                        attach: null
                    }
                }));
                axios.delete(`${ApiName}/api/v1/attach/${info?.file?.id}`, {
                    headers: {"Authorization": `Bearer ${fulInfo?.accessToken}`}
                }).then((res) => {
                    message.success("File o'chirildi")

                }).catch((error) => {
                    message.error(`${info.file.name} file delete failed.`);
                })
            } else {
                const result = data.attachId.filter((idAll) => idAll !== info?.file?.response?.id);
                setData(prevState => ({
                    ...prevState,
                    attachId: [result],
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
            message.error(`${info.file.name} file upload failed.`);
        }

    }

    const propsss = (section) => ({
        name: 'file',
        action: `${ApiName}/api/v1/attach/upload`,
        headers: {
            Authorization: `Bearer ${fulInfo?.accessToken}`,
        },
        onChange: (info) => handleFileChange(info, section),
    });

    const propsFileList = (itemData) => ({
        fileList: itemData?.attach ?
            [{
                uid: itemData?.attach.id,
                id: itemData?.attach.id,
                name: itemData?.attach.fileName,
                status: 'done',
                url: itemData?.attach.url
            }] : undefined
    })

    const handleInputChange = (event) => {
        const {name, value} = event.target;
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
        const {name} = option;
        const [section,] = name.split('.');
        let valuetest = JSON.parse(value)
        setData(prevState => ({
            ...prevState,
            [section]: {
                ...prevState[section],
                name: valuetest?.name,
                code:valuetest?.code
            }
        }));
    };

    const handleSubmit = () => {
        axios.put(`${ApiName}/api/profile/update`,
            {
                ...data,
                specialist: {
                    ...data.specialist,
                    attach: JSON.stringify(data.specialist.attach)
                },
                scientificTitle: {
                    ...data.scientificTitle,
                    attach: JSON.stringify(data.scientificTitle?.attach)
                },
                scientificDegree: {
                    ...data.scientificDegree,
                    attach: JSON.stringify(data.scientificDegree?.attach)
                },
                profileStateAwardDTO: {
                    ...data.profileStateAwardDTO,
                    attach: JSON.stringify(data.profileStateAwardDTO?.attach)
                },
                profileTop1000: {
                    ...data.profileTop1000,
                },
            },
            {
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
        const {value} = e.target;
        setRadio(value === 'ha');

    };

    const handleRadioChange2 = (e) => {
        const {value} = e.target;
        const isTop1000 = value === 'ha1';
        setRadio2(isTop1000);
        setData(prevState => ({
            ...prevState,
            isTop1000
        }));
    };

    function profilLinke(key, value, id) {
        const date123 = {
            urlOrOrcid: value,
            profileType: {
                name: key,
                code: id
            }
        }
        if (key === 'Scopus') {
            let databaseProfiles = data.databaseProfiles;

            if (data.databaseProfiles?.filter(item => item.profileType.name === 'Scopus')) {
                databaseProfiles[0] = date123
            } else {
                databaseProfiles.push(date123)
            }
            setData({...data, databaseProfiles: databaseProfiles})
        }
        if (key === 'Google scholar') {
            let databaseProfiles = data.databaseProfiles;

            if (data.databaseProfiles?.filter(item => item.profileType.name === 'Google scholar')) {
                databaseProfiles[1] = date123
            } else {
                databaseProfiles.push(date123)
            }
            setData({...data, databaseProfiles: databaseProfiles})
        }
    }

    function webOfCounts(key, value) {
        let databaseProfiles = data.databaseProfiles;
        if (databaseProfiles?.length > 2) {
            const date123 = {
                urlOrOrcid: data?.databaseProfiles[2]?.urlOrOrcid,
                profileType: {
                    name: "Boshqa",
                    code: '10'
                },
                counts: data?.databaseProfiles[2]?.counts
            }
            if (key === 'url') {
                date123.urlOrOrcid = value
            }
            if (key === 'hindex') {
                date123.counts.hindex = value;
            }
            if (key === 'citedByCount') {
                date123.counts.citedByCount = value;
            }
            if (key === 'citationCount') {
                date123.counts.citationCount = value;
            }
            databaseProfiles[2] = date123
            setData({...data, databaseProfiles: databaseProfiles})
            console.log(data)
        }
    }


    return (
        <>

            {edite ?
                <div className="TeacherRating"
                >
                    <div className="d-flex justify-content-end">
                        <button className='btn btn-danger' style={{height: 50}} onClick={() => {
                            setEdite(false)
                        }}><CloseSquareOutlined/></button>
                    </div>
                    <Form onFinish={handleSubmit} 
                          labelAlign="left" 
                          layout="vertical" 
                          colon={false}
                          initialValues={data}
                          fields={[
                              {
                                  name: "specialist.name",
                                  value: data.specialist?.name
                              },
                              {
                                  name: "specialist.date",
                                  value: data.specialist?.date ? dayjs(data.specialist.date) : null
                              },
                              {
                                  name: "specialist.number",
                                  value: data.specialist?.number
                              },
                              {
                                  name: "scientificTitle.name",
                                  value: data.scientificTitle?.name || undefined
                              },
                              {
                                  name: "scientificTitle.date",
                                  value: data.scientificTitle?.date ? dayjs(data.scientificTitle.date) : null
                              },
                              {
                                  name: "scientificTitle.number",
                                  value: data.scientificTitle?.number
                              },
                              {
                                  name: "ScopusOrcidId",
                                  value: data?.databaseProfiles[0]?.urlOrOrcid
                              },
                              {
                                  name: "GoogleOrcidId",
                                  value: data?.databaseProfiles[1]?.urlOrOrcid
                              },
                              {
                                  name: "WEB.OF.SCIENCE.Link",
                                  value: data?.databaseProfiles[2]?.urlOrOrcid
                              },
                              {
                                  name: "WEB.OF.SCIENCE.index",
                                  value: data?.databaseProfiles[2]?.counts?.hindex
                              },
                              {
                                  name: "WEB.OF.SCIENCE.ilmiy.ishlar",
                                  value: data?.databaseProfiles[2]?.counts?.citationCount
                              },
                              {
                                  name: "WEB.OF.SCIENCE.iqtiboslar",
                                  value: data?.databaseProfiles[2]?.counts?.citedByCount
                              },
                              {
                                  name: "profileStateAwardDTO.nameStateAward",
                                  value: data?.profileStateAwardDTO?.nameStateAward
                              },
                              {
                                  name: "profileStateAwardDTO.date",
                                  value: data?.profileStateAwardDTO?.date ? dayjs(data.profileStateAwardDTO.date) : null
                              },
                              {
                                  name: "Ilmiy_daraja",
                                  value: radio ? 'ha' : "yoq"
                              },
                              {
                                  name: "scientificDegree.name",
                                  value: data.scientificDegree?.name || undefined
                              },
                              {
                                  name: "scientificDegree.date",
                                  value: data.scientificDegree?.date ? dayjs(data.scientificDegree.date) : null
                              },
                              {
                                  name: "scientificDegree.number",
                                  value: data.scientificDegree?.number
                              },
                              {
                                  name: "Ilmiy_darajaTop",
                                  value: radio2 ? 'ha1' : 'yoq1'
                              },
                              {
                                  name: "profileTop1000.country",
                                  value: data.profileTop1000?.country
                              },
                              {
                                  name: "profileTop1000.university",
                                  value: data.profileTop1000?.university
                              },
                          ]}
                          style={{maxWidth: '100%'}}>
                        <div className="d-flex gap-5 labelForm">
                            <div style={{width: '33%'}}>
                                <Form.Item label={<p className='labelForm'>Mutaxassislik nomi</p>}
                                           name="specialist.name">
                                    <Input name="specialist.name"
                                           onChange={handleInputChange} placeholder="Mutaxasislik nomi"/>
                                </Form.Item>
                                <div className="d-flex gap-2">
                                    <Form.Item label={<p className='labelForm'>Diplom sanasi</p>}
                                               name='specialist.date'>
                                        <DatePicker
                                            format="YYYY-MM-DD"
                                            name='specialist.date'
                                            onChange={(date) => {
                                               setData({...data, specialist: {...data.specialist,date: date} })
                                            }}
                                            placeholder="Diplom sanasi"
                                        />
                                    </Form.Item>
                                    <Form.Item label={<p className='labelForm'>Diplom raqami</p>}
                                               name='specialist.number'>
                                        <InputNumber name='specialist.number'
                                                     onChange={(value) => handleInputChange({
                                                         target: {name: 'specialist.number', value}
                                                     })} placeholder="Diplom raqami" style={{width: '100%'}}/>
                                    </Form.Item>
                                </div>

                                <Form.Item name='specialist'>
                                    <Upload {...propsss('specialist')}
                                            {...propsFileList(data.specialist)}
                                    >
                                        <Button icon={<UploadOutlined/>}>Diplom (pdf)</Button>
                                    </Upload>
                                </Form.Item>
                                <hr/>
                                <Form.Item label={<p className='labelForm'>Ilmiy unvon nomi</p>}
                                           name='scientificTitle.name'>
                                    <Select
                                        name='scientificTitle.name'
                                        placeholder="Ilmiy unvon nomi"
                                        onChange={(value, option) => handleSelectChange(value, {name: "scientificTitle.name"})}
                                        options={scientificTitle?.data?.options.map(item => ({label:item.name, value:JSON.stringify(item)}))}
                                    />
                                </Form.Item>
                                <div className="d-flex gap-2">
                                    <Form.Item label={<p className='labelForm'>Diplom sanasi</p>}
                                               name='scientificTitle.date'>
                                        <DatePicker
                                            format="YYYY-MM-DD"
                                            name='scientificTitle.date'
                                            onChange={(date) => {
                                                setData({...data, scientificTitle: {...data.scientificTitle,date: date} })
                                             }}
                                            placeholder="Diplom sanasi"
                                        />
                                    </Form.Item>
                                    <Form.Item label={<p className='labelForm'>Diplom raqami</p>}
                                               name='scientificTitle.number'>
                                        <InputNumber name='scientificTitle.number'
                                                     onChange={(value) => handleInputChange({
                                                         target: {
                                                             name: 'scientificTitle.number',
                                                             value
                                                         }
                                                     })} placeholder="Diplom raqami" style={{width: '100%'}}/>
                                    </Form.Item>
                                </div>

                                <Form.Item name='scientificTitle'>
                                    <Upload {...propsss('scientificTitle',)}
                                            {...propsFileList(data.scientificTitle)}
                                    >
                                        <Button icon={<UploadOutlined/>}>Diplom (pdf)</Button>
                                    </Upload>
                                </Form.Item>
                                <hr/>
                            </div>
                            <div style={{width: '33%'}}>
                                <Form.Item label={<p className='labelForm'>Scopus (Profil link)</p>} name='ScopusOrcidId'>
                                    <Input placeholder="ORCID ID" name='ScopusOrcidId'
                                           onChange={(e) => profilLinke("Scopus", e.target.value, '11')}/>
                                </Form.Item>
                                <Form.Item label={<p className='labelForm'>Google scholar (Profil link)</p>}
                                           name='GoogleOrcidId'>
                                    <Input placeholder="ORCID ID" name='GoogleOrcidId'
                                           onChange={(e) => profilLinke("Google scholar", e.target.value, '13')}/>
                                </Form.Item>
                                <hr/>
                                <p>WEB OF SCIENCE</p>
                                <div className="d-flex">
                                    <Form.Item label={<p className='labelForm'> (Profil linki)</p>}
                                               name='WEB.OF.SCIENCE.Link'
                                               className='col-6'
                                               rules={[
                                                {
                                                  required: true,
                                                },
                                                {
                                                  type: 'url',
                                                  warningOnly: true,
                                                },
                                                {
                                                  type: 'string',
                                                  min: 6,
                                                },
                                              ]}
                                               >
                                        <Input placeholder="Profil linki" name='WEB.OF.SCIENCE.Link'
                                               onChange={(e) => webOfCounts('url', e.target.value)}/>
                                    </Form.Item>
                                    <Form.Item label={<p className='labelForm'>(h-indeks)</p>}
                                               name='WEB.OF.SCIENCE.index'
                                               className='col-6'>
                                        <Input placeholder="h-indeks" name='WEB.OF.SCIENCE.index'
                                               onChange={(e) => webOfCounts('hindex', e.target.value)}/>
                                    </Form.Item>
                                </div>
                                <div className="d-flex">
                                    <Form.Item label={<p className='labelForm'>(Ilmiy ishlar soni)</p>}
                                               name='WEB.OF.SCIENCE.ilmiy.ishlar' className='col-6'>
                                        <Input placeholder="Ilmiy ishlar soni" name='WEB.OF.SCIENCE.ilmiy.ishlar'
                                               onChange={(e) => webOfCounts('citationCount', e.target.value)}/>
                                    </Form.Item>
                                    <Form.Item label={<p className='labelForm'>(Iqtiboslar soni)</p>}
                                               name='WEB.OF.SCIENCE.iqtiboslar'
                                               className='col-6'>
                                        <Input placeholder="Iqtiboslar soni" name='WEB.OF.SCIENCE.iqtiboslar'
                                               onChange={(e) => webOfCounts('citedByCount', e.target.value)}/>
                                    </Form.Item>
                                </div>
                                <hr/>
                                <Form.Item label={<p className='labelForm'>Davlat mukofoti nomi</p>}
                                           name="profileStateAwardDTO.nameStateAward">
                                    <Input name="profileStateAwardDTO.nameStateAward" onChange={handleInputChange}
                                           placeholder="Davlat mukofoti nomi"/>
                                </Form.Item>

                                <Form.Item label={<p className='labelForm'>Olgan sanasi</p>}
                                           name='profileStateAwardDTO.date'>
                                    <DatePicker
                                        format="YYYY-MM-DD"
                                        name='profileStateAwardDTO.date'
                                        onChange={(date) => {
                                            setData({...data, profileStateAwardDTO: {...data.profileStateAwardDTO, date: date} })
                                         }}
                                        placeholder="Olgan sanasi"
                                    />
                                </Form.Item>
                                <Form.Item name='profileStateAwardDTO'>
                                    <Upload {...propsss('profileStateAwardDTO')}
                                            {...propsFileList(data.profileStateAwardDTO)}
                                    >
                                        <Button icon={<UploadOutlined/>}>Diplom (pdf)</Button>
                                    </Upload>
                                </Form.Item>
                            </div>

                            <div style={{width: '33%'}}>
                                <Form.Item name="Ilmiy_daraja" style={{marginTop: "27px"}}
                                           label={<p className='labelForm'>Ilmiy daraja bormi?</p>}>
                                    <Radio.Group name="Ilmiy_daraja" onChange={handleRadioChange}>
                                        <Radio value='ha'>Ha</Radio>
                                        <Radio value='yoq'>Yo'q</Radio>
                                    </Radio.Group>
                                </Form.Item>
                                <hr/>
                                {radio && (
                                    <>
                                        <Form.Item label={<p className='labelForm'>Ilmiy daraja nomi</p>}
                                                   name='scientificDegree.name'>
                                            <Select
                                                name='scientificDegree.name'
                                                placeholder="Ilmiy daraja nomi"
                                                onChange={(value, option) => handleSelectChange(value, {name: "scientificDegree.name"})}
                                                options={scientificDegree?.data?.options.map(item => ({label: item.name, value:JSON.stringify(item)}))}
                                            />
                                        </Form.Item>
                                        <div className="d-flex align-items-center">
                                            <Form.Item label={<p className='labelForm'>Diplom sanasi</p>}
                                                       name='scientificDegree.date'>
                                                <DatePicker placeholder="Diplom sanasi"
                                                            format="YYYY-MM-DD"
                                                            name='scientificDegree.date'
                                                            onChange={(date) => {
                                                                setData({...data, scientificDegree: {...data.scientificDegree,date: date} })
                                                             }}

                                                />
                                            </Form.Item>
                                            <Form.Item label={<p className='labelForm'>Diplom raqami</p>}
                                                       name='scientificDegree.number'>
                                                <InputNumber placeholder="Diplom raqami" style={{width: '100%'}}
                                                             name='scientificDegree.number'
                                                             onChange={(value) => handleInputChange({
                                                                 target: {
                                                                     name: 'scientificDegree.number',
                                                                     value
                                                                 }
                                                             })}/>
                                            </Form.Item>
                                        </div>

                                        <Form.Item name="Ilmiy_darajaTop" style={{marginTop: "20px"}}
                                                   label={<p className='labelForm'>
                                                       Dunyoning nufuzli TOP-1000 taligiga kiruvchi OTMlarida (PhD) yoki
                                                       (DSc) darajasini olganligi</p>}>
                                            <Radio.Group name="Ilmiy_darajaTop" onChange={handleRadioChange2}>
                                                <Radio value='ha1'>Ha</Radio>
                                                <Radio value='yoq1'>Yo'q</Radio>
                                            </Radio.Group>
                                        </Form.Item>
                                        {radio2 && (
                                            <div>
                                                <Form.Item label={<p className='labelForm'>Shaxri, davlati</p>}
                                                           name='profileTop1000.country'>
                                                    <Input name="profileTop1000.country"
                                                           onChange={handleInputChange} placeholder="Shaxri, davlati"/>
                                                </Form.Item>
                                                <Form.Item label={<p className='labelForm'>Universiteti</p>}
                                                           name="profileTop1000.university">
                                                    <Input className='my-2'
                                                           name="profileTop1000.university" onChange={handleInputChange}
                                                           placeholder="Universiteti"/>
                                                </Form.Item>


                                            </div>

                                        )}
                                                <Form.Item name='scientificDegree'>
                                                    <Upload {...propsss('scientificDegree')}
                                                            {...propsFileList(data.scientificDegree)}
                                                    >
                                                        <Button icon={<UploadOutlined/>}>Diplom (pdf)</Button>
                                                    </Upload>
                                                </Form.Item>
                                    </>
                                )}
                            </div>
                        </div>
                        <Form.Item label=" " className='h-50' name='123'>
                            <Button className='h-50' type="primary" htmlType="submit">
                                Ma'lumotlarni saqlash
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
                :
                <div className='TeacherRating mb-5'
                >
                    <div className='TeacherRating_header'>
                        <div className='TeacherRating_img'>
                            {<img src={fulInfo?.imageUrl} alt=''/>}
                        </div>
                        <div className='TeacherRating_text'>
                            <h3 className='TeacherRating_text_name'>{fulInfo?.fullName}</h3>
                            <div className='TeacherRating_text_description row'>
                                <div className='col-4 card p-4'>
                                    <div>
                                        <b>Ish joy:</b>
                                        <p>{fulInfo?.parentDepartment?.name} <br/> {fulInfo?.department?.name}</p>
                                    </div>
                                    <div>
                                        <b>Lavozim: </b>
                                        <p> {fulInfo?.staffPosition?.name}</p>
                                    </div>
                                    <div>
                                        <b>Shtat birligi:</b>
                                        <p> {fulInfo?.employmentForm?.name} {fulInfo?.employmentStaff?.name}</p>
                                    </div>
                                </div>
                                <div className='col-4 card p-4'>
                                    <div className=''>
                                        <b>Mutaxasislik nomi</b>
                                        <p> {getFullInfo?.specialist?.name}</p>
                                    </div>
                                    <div className=''>
                                        <b>Diplom sanasi</b>
                                        <p> {getFullInfo?.specialist?.date}</p>
                                    </div>
                                    <div>
                                        <b>Diplom raqami</b>
                                        <p> {getFullInfo?.specialist?.number}</p>
                                    </div>
                                    <div>
                                        <b>Diplom</b> <br/>
                                        {
                                            getFullInfo?.specialist?.attach != null ?
                                                <a href={getFullInfo?.specialist?.attach?.url}
                                                   target={"_blank"}>{getFullInfo?.specialist?.attach?.fileName}</a>
                                                :
                                                ''
                                        }

                                    </div>
                                </div>
                                <div className='col-4 card p-4'>
                                    <div className=''>
                                        <b>Ilmiy unvon nomi</b>
                                        <p> {getFullInfo?.scientificTitle?.name}</p>
                                    </div>
                                    <div className=''>
                                        <b>Diplom sanasi</b>
                                        <p> {getFullInfo?.scientificTitle?.date}</p>
                                    </div>
                                    <div className=''>
                                        <b>Diplom raqami</b>
                                        <p> {getFullInfo?.scientificTitle?.number}</p>
                                    </div>
                                    <div>
                                        <b>Diplom</b> <br/>
                                        {
                                            getFullInfo?.scientificTitle?.attach != null ?
                                                <a href={getFullInfo?.scientificTitle?.attach?.url}
                                                   target={"_blank"}>{getFullInfo?.scientificTitle?.attach?.fileName}</a>
                                                :
                                                ''
                                        }


                                    </div>
                                </div>
                                <div className='col-4 card p-4'>
                                    <div className=''>
                                        <b>Ilmiy daraja nomi</b>
                                        <p> {getFullInfo?.scientificDegree?.name}</p>
                                    </div>
                                    <div className=''>
                                        <b>Davlati</b>
                                        <p> {getFullInfo?.profileTop1000?.country}</p>
                                    </div>
                                    <div className=''>
                                        <b>Universituti</b>
                                        <p> {getFullInfo?.profileTop1000?.university}</p>
                                    </div>
                                    <div className=''>
                                        <b>Diplom sanasi</b>
                                        <p> {getFullInfo?.scientificDegree?.date}</p>
                                    </div>
                                    <div className=''>
                                        <b>Diplom raqami</b>
                                        <p> {getFullInfo?.scientificDegree?.number}</p>
                                    </div>
                                    <div>
                                        <b>Diplom</b> <br/>
                                        {
                                            getFullInfo?.scientificDegree?.attach != null ?
                                                <a href={getFullInfo?.scientificDegree?.attach?.url}
                                                   target={"_blank"}>{getFullInfo?.scientificDegree?.attach?.fileName}</a>
                                                :
                                                ''
                                        }

                                    </div>
                                </div>
                                <div className='col-4 card p-4'>
                                    <div>
                                        <b>Davlat mukofoti nomi</b>
                                        <p> {getFullInfo?.profileStateAwardDTO?.nameStateAward}</p>
                                    </div>
                                    <div>
                                        <b>Davlat mukofotini olgan sanasi</b>
                                        <p> {getFullInfo?.profileStateAwardDTO?.date}</p>
                                    </div>
                                    <div>
                                        <b>Diplom</b> <br/>
                                        {
                                            getFullInfo?.profileStateAwardDTO?.attach != null ?
                                                <a href={getFullInfo?.profileStateAwardDTO?.attach?.url}
                                                   target={"_blank"}>{getFullInfo?.profileStateAwardDTO?.attach?.fileName}</a>
                                                :
                                                ''
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button className='btn btn-warning' style={{height: 50}} onClick={() => setEdite(!edite)}>
                            <EditOutlined/>
                        </button>
                    </div>
                    <div className='teacher_rating_bottom mt-4'>
                        <div className='align-items-center justify-content-center br_right w-100 d-flex gap-3'>
                            <a href={data?.databaseProfiles[0]?.website} target={"_blank"}>
                                <img src='../img/Scopus.png' width={90} alt=""/>
                            </a>
                            <div className="">
                                <b className='m-0 text-lg'>h-index</b>
                                <p className=' m-0'>{data?.databaseProfiles[0]?.counts?.hindex}</p>
                                <hr/>
                                <b className='m-0 text-lg'>Ilmiy ishlar</b>
                                <p className=' m-0'>{data?.databaseProfiles[0]?.counts?.citationCount}</p>
                                <hr/>
                                <b className='m-0 text-lg'>Iqtiboslar soni</b>
                                <p className=' m-0'>{data?.databaseProfiles[0]?.counts?.citedByCount}</p>
                            </div>

                        </div>
                        <div className='align-items-center justify-content-center br_right w-100 d-flex gap-3'>
                            <a href={data?.databaseProfiles[2]?.website} target={"_blank"}>
                                <img src='../img/wos.png' width={90} alt=""/>
                            </a>
                            <div className="">
                                <b className='m-0 text-lg'>h-index</b>
                                <p className=' m-0'>{data?.databaseProfiles[2]?.counts?.hindex}</p>
                                <hr/>
                                <b className='m-0 text-lg'>Ilmiy ishlar</b>
                                <p className=' m-0'>{data?.databaseProfiles[2]?.counts?.citationCount}</p>
                                <hr/>
                                <b className='m-0 text-lg'>Iqtiboslar soni</b>
                                <p className=' m-0'>{data?.databaseProfiles[2]?.counts?.citedByCount}</p>
                            </div>
                        </div>
                        <div className='align-items-center justify-content-center w-100 d-flex gap-3'>
                            <a href={data?.databaseProfiles[1]?.website} target={"_blank"}>
                                <img src='../img/googleScholar.png' width={90} alt=""/>
                            </a>
                            <div className="">
                                <b className='m-0 text-lg'>h-index</b>
                                <p className=' m-0'>{data?.databaseProfiles[1]?.counts?.hindex}</p>
                                <hr/>
                                <b className='m-0 text-lg'>Ilmiy ishlar</b>
                                <p className=' m-0'>{data?.databaseProfiles[1]?.counts?.citationCount}</p>
                                <hr/>
                                <b className='m-0 text-lg'>Iqtiboslar soni</b>
                                <p className=' m-0'>{data?.databaseProfiles[1]?.counts?.citedByCount}</p>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    );
};

export default TeacherRating;
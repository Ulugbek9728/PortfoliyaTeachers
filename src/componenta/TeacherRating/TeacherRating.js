import React, {useEffect, useState} from 'react';
import './teacherRating.css';
import {EditOutlined, UploadOutlined, CloseSquareOutlined} from '@ant-design/icons';
import {Button, DatePicker, Form, Input, Select, Upload, Radio, message, InputNumber, Modal } from 'antd';
import {ApiName} from "../../api/APIname";
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
        scientificDegree: {
            name: "",
            date: "",
            number: null,
            attachId: ""
        },
        isTop1000: false,
        databaseProfiles:[],
        profileTop1000: {
            country: "",
            university: ""
        },
        profileStateAwardDTO: {
            nameStateAward: "",
            date: "",
            attachId: ""
        }

    });
    const [webOfScines, setWebOfScines]= useState({
        urlOrOrcid:'',
        profileType:{
            name:"Boshqa",
            code:'10'
        },
        counts:{
            citedByCount:'',
            citationCount:'',
            hindex:''
        }
    })

    const [edite, setEdite] = useState(false);
    const [radio, setRadio] = useState(false);
    const [radio2, setRadio2] = useState(data.isTop1000);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (edite) {
            setData({
                profileId: fulInfo?.id,
                specialist: {
                    name: getFullInfo?.specialist?.name || "",
                    date: getFullInfo?.specialist?.date || "",
                    number: getFullInfo?.specialist?.number || null,
                    attachResDTO: getFullInfo?.attachResDTO?.map((item) => item.attachResDTO.id),

                },
                scientificTitle: {
                    name: getFullInfo?.scientificTitle?.name || "",
                    date: getFullInfo?.scientificTitle?.date || "",
                    number: getFullInfo?.scientificTitle?.number || null,

                },
                scientificDegree: {
                    name: getFullInfo?.scientificDegree?.name || "",
                    date: getFullInfo?.scientificDegree?.date || "",
                    number: getFullInfo?.scientificDegree?.number || null,
                },
                isTop1000: getFullInfo?.isTop1000 || false,
                profileTop1000: {
                    country: getFullInfo?.profileTop1000?.country || "",
                    university: getFullInfo?.profileTop1000?.university || "",
                    attachResDTO: getFullInfo?.attachResDTO?.map((item) => item.attachResDTO.id),
                },
                profileStateAwardDTO: {
                    nameStateAward: getFullInfo?.profileStateAwardDTO?.nameStateAward || "",
                    date: getFullInfo?.profileStateAwardDTO?.date || "",
                    attachResDTO: getFullInfo?.attachResDTO?.map((item) => item.attachResDTO.id),
                },
                databaseProfiles:[]
            });
            setRadio(!!getFullInfo?.scientificDegree?.name);
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
                let newState = {...prevData};
                let current = newState;
                for (let i = 0; i < keys.length - 1; i++) {
                    current = current[keys[i]];
                }
                current[keys[keys.length - 1]] = formattedDate;
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
        } else if (info.file.status === 'removed') {
            if (edite) {
                console.log(data.attachId)
                const result = data.attachId.filter((idAll) => idAll !== info?.file?.id);
                console.log(result)
                setData(prevState => ({
                    ...prevState,
                    attachId: result,
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
        ;
    }

    const propsss = (section) => ({
        name: 'file',
        action: `${ApiName}/api/v1/attach/upload`,
        headers: {
            Authorization: `Bearer ${fulInfo?.accessToken}`,
        },
        fileList: edite?.attachResDTO?.map((item) => {
            const attachResDTO = item.attachResDTO;
            return {
                uid: attachResDTO.id,
                id: attachResDTO.id,
                name: attachResDTO.fileName,
                status: 'done',
                url: attachResDTO.url
            }
        }),
        onChange: (info) => handleFileChange(info, section),
    });

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

    function profilLinke(key,value,id) {
        const date123 ={
            urlOrOrcid: value,
            profileType:{
                name:key,
                code:id
            }
        }
        if (key==='Scopus'){
            let databaseProfiles = data.databaseProfiles;

            if (data.databaseProfiles?.filter(item=>item.profileType.key === 'Scopus')) {
                databaseProfiles[0] = date123
            }else {
                databaseProfiles.push(date123)
            }
            setData({...data, databaseProfiles: databaseProfiles})
        }
        if (key==='Google scholar'){
            let databaseProfiles = data.databaseProfiles;

            if (data.databaseProfiles?.filter(item=>item.profileType.key === 'Google scholar')) {
                databaseProfiles[1] = date123
            }else {
                databaseProfiles.push(date123)
            }
            setData({...data, databaseProfiles: databaseProfiles})
        }
    }


    function webOfCounts(key, value) {
        let databaseProfiles = data.databaseProfiles;

        if (key==='hindex'){
            webOfScines.counts.hindex=value
        }
        if (key==='citationCount'){
            webOfScines.counts.citationCount=value
        }
        if (key==='citedByCount'){
            webOfScines.counts.citedByCount=value
        }
        if (key==='url'){
            webOfScines.urlOrOrcid=value

        }
        databaseProfiles[2] = webOfScines
        setData({...data, databaseProfiles: databaseProfiles})


    }


    return (
        <>

            {edite ?
                <div className="TeacherRating"
                    >
                    <div className="d-flex justify-content-end">
                        <button className='btn btn-danger' style={{height: 50}} onClick={()=> {
                            setEdite(false)
                        }} ><CloseSquareOutlined /></button>
                    </div>
                    <Form onFinish={handleSubmit} labelAlign="left" layout="vertical" colon={false}
                          style={{maxWidth: '100%'}}>
                        <div className="d-flex gap-5">
                            <div style={{width: '33%'}}>
                                <Form.Item label="Mutaxassislik">
                                    <Input value={data.specialist.name} name="specialist.name"
                                           onChange={handleInputChange} placeholder="Mutaxasislik nomi"/>
                                    <DatePicker
                                        value={data.specialist.date ? moment(data.specialist.date) : null}
                                        name='specialist.date'
                                        onChange={(date) => handleDateChange(date, 'specialist.date')}
                                        className='my-2'
                                        placeholder="Diplom sanasi"
                                    />
                                    <InputNumber value={data.specialist.number} name='specialist.number'
                                                 onChange={(value) => handleInputChange({
                                                     target: {
                                                         name: 'specialist.number',
                                                         value
                                                     }
                                                 })} placeholder="Diplom raqami" style={{width: '100%'}}/>
                                </Form.Item>
                                <Form.Item name='file'>
                                    <Upload {...propsss('specialist')}>
                                        <Button icon={<UploadOutlined/>}>Diplom (pdf)</Button>
                                    </Upload>
                                </Form.Item>
                                <hr/>
                                <Form.Item label="Ilmiy unvon" >
                                    <Select
                                        name='scientificTitle.name'
                                        placeholder="Ilmiy unvon nomi"
                                        value={data.scientificTitle.name || undefined}
                                        onChange={(value, option) => handleSelectChange(value, {name: "scientificTitle.name"})}
                                        options={[
                                            {value: 'katta ilmiy xodim', label: 'Katta ilmiy xodim'},
                                            {value: 'kichik ilmiy xodim', label: 'Kichik ilmiy xodim'},
                                            {value: 'tayanch doktorant (PhD)', label: 'Tayanch doktorant (PhD)'},
                                            {value: 'tayanch dotsent', label: 'Tayanch dotsent'}
                                        ]}
                                    />
                                    <DatePicker
                                        value={data.scientificTitle.date ? moment(data.scientificTitle.date) : null}
                                        name='scientificTitle.date'
                                        onChange={(date) => handleDateChange(date, 'scientificTitle.date')}
                                        className='my-2'
                                        placeholder="Diplom sanasi"
                                    />
                                    <InputNumber value={data.scientificTitle.number} name='scientificTitle.number'
                                                 onChange={(value) => handleInputChange({
                                                     target: {
                                                         name: 'scientificTitle.number',
                                                         value
                                                     }
                                                 })} placeholder="Diplom raqami" style={{width: '100%'}}/>
                                </Form.Item>
                                <Form.Item name='file'>
                                    <Upload {...propsss('scientificTitle')}>
                                        <Button icon={<UploadOutlined/>}>Diplom (pdf)</Button>
                                    </Upload>
                                </Form.Item>
                                <hr/>
                            </div>
                            <div style={{width: '33%'}}>
                                <Form.Item label="Scopus (ORCID ID)">
                                    <Input placeholder="ORCID ID"
                                           onChange={(e)=> profilLinke("Scopus",e.target.value ,'11')} />
                                </Form.Item>
                                <Form.Item label="Google scholar (ORCID ID)">
                                    <Input placeholder="ORCID ID"
                                           onChange={(e)=> profilLinke("Google scholar",e.target.value, '13')}/>
                                </Form.Item>
                                <hr/>
                                <div className="d-flex">
                                    <Form.Item label="WEB OF SCIENCE (Profil linki)" className='col-6'>
                                        <Input placeholder="Profil linki"
                                               onChange={(e)=>webOfCounts('url',e.target.value)}/>
                                    </Form.Item>
                                    <Form.Item label="WEB OF SCIENCE (h-indeks)" className='col-6'>
                                        <Input placeholder="h-indeks" onChange={(e)=> webOfCounts('hindex',e.target.value)}/>
                                    </Form.Item>
                                </div>
                                <div className="d-flex">
                                    <Form.Item label="WEB OF SCIENCE (Ilmiy ishlar soni)" className='col-6'>
                                        <Input placeholder="Ilmiy ishlar soni" onChange={(e)=> webOfCounts('citationCount',e.target.value)}/>
                                    </Form.Item>
                                    <Form.Item label="WEB OF SCIENCE (Iqtiboslar soni)" className='col-6'>
                                        <Input placeholder="Iqtiboslar soni" onChange={(e)=> webOfCounts('citedByCount',e.target.value)}/>
                                    </Form.Item>
                                </div>
                                <hr/>
                                <Form.Item label="Davlat mukofoti bilan tag`dirlanganligi">
                                    <Input value={data.profileStateAwardDTO.nameStateAward}
                                           name="profileStateAwardDTO.nameStateAward" onChange={handleInputChange}
                                           placeholder="Davlat mukofoti nomi"/>
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
                                        <Button icon={<UploadOutlined/>}>Diplom (pdf)</Button>
                                    </Upload>
                                </Form.Item>
                            </div>
                            <div style={{width: '33%'}}>
                                <Form.Item name="Ilmiy_daraja" style={{marginTop: "27px"}} label="Ilmiy daraja bormi?">
                                    <Radio.Group name="Ilmiy_daraja" onChange={handleRadioChange}>
                                        <Radio value='ha' >Ha</Radio>
                                        <Radio value='yoq' >Yo'q</Radio>
                                    </Radio.Group>
                                </Form.Item>
                                <hr/>
                                {radio && (
                                    <>
                                        <Form.Item label="Ilmiy daraja">
                                            <Select
                                                name='scientificDegree.name'
                                                placeholder="Ilmiy daraja nomi"
                                                value={data.scientificDegree.name || undefined}
                                                onChange={(value, option) => handleSelectChange(value, {name: "scientificDegree.name"})}
                                                options={[
                                                    {value: 'Falsafa doktori (PhD)', label: 'Falsafa doktori (PhD)'},
                                                    {value: 'Fan doktori, (DSc)', label: 'Fan doktori, (DSc)'}
                                                ]}
                                            />
                                            <DatePicker
                                                value={data.scientificDegree.date ? moment(data.scientificDegree.date) : null}
                                                name='scientificDegree.date'
                                                onChange={(date) => handleDateChange(date, 'scientificDegree.date')}
                                                className='my-2'
                                                placeholder="Diplom sanasi"
                                            />
                                            <InputNumber value={data.scientificDegree.number}
                                                         name='scientificDegree.number'
                                                         onChange={(value) => handleInputChange({
                                                             target: {
                                                                 name: 'scientificDegree.number',
                                                                 value
                                                             }
                                                         })} placeholder="Diplom raqami" style={{width: '100%'}}/>
                                        </Form.Item>
                                        <Form.Item name="Ilmiy_darajaTop" style={{marginTop: "27px"}}
                                                   label="Dunyoning nufuzli TOP-1000 taligiga kiruvchi OTMlarida (PhD) yoki (DSc) darajasini olganligi">
                                            <Radio.Group name="Ilmiy_darajaTop" onChange={handleRadioChange2} value={radio2 ? 'ha1' : 'yoq1'}>
                                                <Radio value='ha1'>Ha</Radio>
                                                <Radio value='yoq1'>Yo'q</Radio>
                                            </Radio.Group>
                                        </Form.Item>
                                        {radio2 && (
                                            <Form.Item>
                                                <Input value={data.profileTop1000.country} name="profileTop1000.country"
                                                       onChange={handleInputChange} placeholder="Shaxri, davlati"/>
                                                <Input className='my-2' value={data.profileTop1000.university}
                                                       name="profileTop1000.university" onChange={handleInputChange}
                                                       placeholder="Universituti"/>
                                                <Upload {...propsss('scientificDegree')}>
                                                    <Button icon={<UploadOutlined/>}>Diplom (pdf)</Button>
                                                </Upload>
                                            </Form.Item>
                                        )}
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
                                        <a href={getFullInfo?.specialist?.attachResDTO?.url}
                                           target={"_blank"}>file</a>
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
                                        <a href={getFullInfo?.scientificTitle?.attachResDTO?.url}
                                           target={"_blank"}>file</a>
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
                                        <a href={getFullInfo?.profileTop1000?.attachResDTO?.url}
                                           target={"_blank"}>file</a>
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
                                        <a href={getFullInfo?.profileStateAwardDTO?.attachResDTO?.url}
                                           target={"_blank"}>file</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button className='btn btn-warning' style={{height: 50}} onClick={() => setEdite(!edite)}>
                            <EditOutlined/>
                        </button>
                    </div>
                    <div className='teacher_rating_bottom mt-4'>
                        <div className=' text-center br_right w-100'>
                            <a href={getFullInfo?.profileRating?.scopusURL} target={"_blank"}>
                                <img src='../img/Scopus.png' width={90} alt=""/>
                            </a>

                            <p className='text-lg text-center'>Citations</p>
                        </div>
                        <div className=' text-center br_right w-100'>
                            <a href={getFullInfo?.profileRating?.wosURL} target={"_blank"}>
                                <img src='../img/wos.png' width={90} alt=""/>
                            </a>
                            <p className='text-lg text-center'>Citations</p>
                        </div>
                        <div className='text-center w-100'>
                            <a href={getFullInfo?.profileRating?.wosURL} target={"_blank"}>
                                <img src='../img/googleScholar.png' width={90} alt=""/>
                            </a>
                            <p className='text-lg text-center'>Citations</p>
                        </div>
                    </div>
                </div>
            }
        </>
    );
};

export default TeacherRating;

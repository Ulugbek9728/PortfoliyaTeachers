import React, {useState} from 'react'
import './teacherRating.css'
import {EditOutlined,} from '@ant-design/icons';
import {Button, Form, Input, Select, Upload, Radio} from 'antd';
import {ApiName} from "../../api/APIname";


function UploadOutlined() {
    return null;
}

const TeacherRating = () => {
    const [fulInfo] = useState(JSON.parse(localStorage.getItem("myInfo")));

    const [edite, setEdite] = useState(false);

    const propsss = {
        name: 'file',
        action: `${ApiName}/api/v1/attach/upload`,
        headers: {
            authorization: `Bearer ${fulInfo?.accessToken}`,
        },

        // onChange(info) {
        //     if (info.file.status === 'removed') {
        //         const result = ariza.files.filter((idAll) => idAll?.id !== info?.file?.response?.id);
        //         setAriza({...ariza, files: result})
        //
        //         axios.delete(`${ApiName}/api/v1/attach/${info?.file?.response?.id}`, {
        //             headers: {"Authorization": `Bearer ${fulInfo?.accessToken}`}
        //         }).then((res) => {
        //             message.success("File o'chirildi")
        //         }).catch((error) => {
        //             message.error(`${info.file.name} file delete failed.`);
        //         })
        //     } else if (info.file.status === "done") {
        //         ariza.files.push({
        //                 fileId: info.file.response.id,
        //             }
        //         )
        //
        //
        //         message.success(`${info.file.name} File uploaded successfully`);
        //     } else if (info.file.status === 'error') {
        //         message.error(`${info.file.name} File upload failed.`);
        //     }
        // },

    };

    return (
        <>
            <div className='TeacherRating'>
                <div className='TeacherRating_header'>
                    <div className='TeacherRating_img'>
                        {<img src={fulInfo?.imageUrl} alt=''/>}

                        {/*<img src={user} alt=''/>*/}
                    </div>
                    <div className='TeacherRating_text'>
                        <h3 className='TeacherRating_text_name'>{fulInfo?.fullName}</h3>
                        <div className='TeacherRating_text_description'>
                            <div className='d-flex'>
                                <b className='mx-3'>Ish joy:</b>
                                <p>{fulInfo?.parentDepartment?.name} <br/> {fulInfo?.department?.name}</p>
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
                    <button className='btn btn-warning' style={{height: 50}}
                            onClick={() => {
                                setEdite(!edite)
                            }}
                    ><EditOutlined/></button>
                </div>
                <div className='teacher_rating_bottom'>
                    <div className='text-center br_right'>
                        <span className='fw-bolder text-4xl '>132</span>
                        <p className=' text-lg text-center'>Citations</p>
                    </div>
                    <div className='text-center br_right'>
                        <span className='fw-bolder text-4xl '>132</span>
                        <p className=' text-lg text-center'>Citations</p>
                    </div>
                    <div className='text-center br_right'>
                        <span className='fw-bolder text-4xl '>132</span>
                        <p className=' text-lg text-center'>Citations</p>
                    </div>
                    <div className='text-center'>
                        <span className='fw-bolder text-4xl '>132</span>
                        <p className=' text-lg text-center'>Citations</p>
                    </div>
                </div>
            </div>
            {
                edite ? <div className="TeacherRating">
                    <Form
                        labelAlign="left" layout="vertical" colon={false}
                        style={{maxWidth:'100%',}}
                    >
                        <div className="d-flex gap-5">
                            <div style={{width:'33%'}}>
                                <Form.Item
                                    label="Mutaxassislik"
                                    name="password"
                                    rules={[
                                        {
                                            required: true,
                                        },
                                    ]}
                                >
                                    <Input placeholder="Mutaxasislik nomi"/>
                                    <Input className='my-2' placeholder="Diplom sanasi"/>
                                    <Input placeholder="Diplom raqami"/>
                                </Form.Item>
                                <Form.Item name='file'>
                                    <Upload name='file' {...propsss}>
                                        <Button icon={<UploadOutlined/>}>Diplom (pdf)</Button>
                                    </Upload>
                                </Form.Item>
                                <hr/>
                                <Form.Item
                                    label="Ilmiy unvon"
                                    name="password"

                                >
                                    <Select
                                        placeholder="Ilmiy unvon nomi"
                                        options={[
                                            {
                                                value: 'Stajer-tadqiqotchi',
                                                label: 'Dotsent',
                                            },
                                            {
                                                value: 'Tayanch doktorant (PhD)',
                                                label: 'Professor',
                                            },
                                        ]}
                                    />
                                    <Input className='my-2' placeholder="Diplom sanasi"/>
                                    <Input placeholder="Diplom raqami"/>
                                </Form.Item>
                                <Form.Item name='file'>
                                    <Upload name='file' {...propsss}>
                                        <Button icon={<UploadOutlined/>}>Diplom (pdf)</Button>
                                    </Upload>
                                </Form.Item>
                                <hr/>

                            </div>
                            <div style={{width:'33%'}}>
                                <Form.Item
                                    label="Kafedra doktoranti" name="username"
                                    rules={[{required: true,},]}>
                                    <Select
                                        defaultValue="Tayanch doktorant (PhD),"
                                        options={[
                                            {
                                                value: 'Stajer-tadqiqotchi',
                                                label: 'Stajer-tadqiqotchi',
                                            },
                                            {
                                                value: 'Tayanch doktorant (PhD)',
                                                label: 'Tayanch doktorant (PhD)',
                                            },
                                            {
                                                value: 'doktorant (DSc)',
                                                label: 'Doktorant (DSc)',
                                            },
                                            {
                                                value: 'Mustaqil izlanuvchi (PhD)',
                                                label: 'Mustaqil izlanuvchi (PhD)',
                                            },
                                            {
                                                value: 'Mustaqil izlanuvchi (DSc)',
                                                label: 'Mustaqil izlanuvchi (DSc)',
                                            },

                                        ]}
                                    />
                                </Form.Item>
                                <hr/>
                                <Form.Item style={{marginTop:"27px"}}
                                    label="Dunyoning nufuzli TOP-1000 taligiga kiruvchi OTMlarida (RhD) yoki (DSc) darajasini olganligi"
                                    name="username"
                                    rules={[{required: true,},]}>
                                    <Radio.Group>
                                        <Radio value={1}>Ha</Radio>
                                        <Radio value={2}>Yo'q</Radio>

                                    </Radio.Group>
                                </Form.Item>
                                <hr/>
                                <Form.Item
                                    label="Ilmiy daraja"
                                    name="password"
                                >
                                    <Select
                                        placeholder="Ilmiy daraja nomi"
                                        options={[
                                            {
                                                value: 'Stajer-tadqiqotchi',
                                                label: 'Falsafa doktori (PhD) ',
                                            },
                                            {
                                                value: 'Fan doktori, (DSc)',
                                                label: 'Fan doktori, (DSc)',
                                            },
                                        ]}
                                    />
                                    <Input className='my-2' placeholder="Diplom sanasi"/>
                                    <Input placeholder="Diplom raqami"/>
                                </Form.Item>
                                <Form.Item name='file'>
                                    <Upload name='file' {...propsss}>
                                        <Button icon={<UploadOutlined/>}>Diplom (pdf)</Button>
                                    </Upload>
                                </Form.Item>
                                <hr/>
                            </div>
                            <div style={{width:'33%'}}>
                                <Form.Item
                                    label="Reyting"
                                    name="password"
                                >
                                    <Input className='my-2' placeholder="Scopus maʼlumotlar bazasidagi sahifasiga (profiliga) havola"/>
                                    <Input className='my-2' placeholder="WoS maʼlumotlar bazasidagi sahifasiga (profiliga) havola"/>
                                    <Input placeholder="GoogleScholar maʼlumotlar bazasidagi sahifasiga (profiliga) havola"/>
                                </Form.Item>
                            </div>
                        </div>
                        <Form.Item label=" ">
                            <Button type="primary" htmlType="submit">
                                Submit
                            </Button>
                        </Form.Item>

                    </Form>
                </div> : ''
            }


        </>
    )
}

export default TeacherRating
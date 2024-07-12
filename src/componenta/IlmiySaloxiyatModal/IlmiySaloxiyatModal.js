import React from 'react'
import {   Button,Modal,
    DatePicker,
    Form,
    Input,
    InputNumber,
    Select,
    Upload, } from 'antd';
    import {ApiName} from "../../api/APIname";
import { useState } from 'react';
    function UploadOutlined() {
        return null;
    }
const IlmiySaloxiyatModal = () => {
    const [fulInfo] = useState(JSON.parse(localStorage.getItem("myInfo")));
    const propsss = {
        name: 'file',
        action: `${ApiName}/api/v1/attach/upload`,
        headers: {
            authorization: `Bearer ${fulInfo?.accessToken}`,
        }
    }
  return (
    <>
        <Form className='row'>
           <Form.Item layout="vertical"label="Ilmiy raxbarlik turi"name="IlmFan" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}  className='col-6'>
             <Select>
             <Select.Option  value={1}>Ilmiy raxbarligi ostida ximoya qilgan fan nomzodi shogirdlar</Select.Option>
               <Select.Option value={2}>Ilmiy raxbarligi ostida ximoya qilgan falsafa doktori shogirdlar</Select.Option>
               <Select.Option value={3}>Ilmiy raxbarligi ostida ximoya qilgan fan doktori shogirdlar</Select.Option>
             </Select>
           </Form.Item>           
            <Form.Item layout="vertical" label="Ximoya qilgan yili" name="data" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} className='col-6'>
                  <DatePicker className='py-2' />
           </Form.Item> 
           <Form.Item         
           layout="vertical"
           label="F.I.SH"
           name="name"
           labelCol={{ span: 24 }}
           wrapperCol={{ span: 24 }}
           rules={[{ required: true, message: 'Iltimos ism familyangiz kiriting'}]}
           className='col-6'>
              <Input  placeholder='Name' className='py-2'/>
           </Form.Item>   
            <Form.Item         
           layout="vertical"
           label="Dissertatsiya mavzusi"
           name="name"
           labelCol={{ span: 24 }}
           wrapperCol={{ span: 24 }}
           rules={[{ required: true, message: 'Iltimos ism familyangiz kiriting'}]}
           className='col-6'>
              <Input  placeholder='Dissertatsiya mavzusi' className='py-2'/>
           </Form.Item>
           <Form.Item label="Shogirdning ilmiy darajasi"name="password" className='col-6' layout="vertical" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} >
             <Select placeholder="Ilmiy daraja nomi"
                options={[
                    {
                        value: 'texnika fanlar nomzodi',
                        label: 'texnika fanlar nomzodi ',
                    },
                    {
                        value: 'texnika fanlari boyicha falsafa doktori',
                        label: 'texnika fanlari boyicha falsafa doktori',
                    },
                    {
                        value: 'texnika fanlari doktori',
                        label: 'texnika fanlari doktori',
                    },
                ]}
                />   
           </Form.Item>  
           <Form.Item         
           layout="vertical"
           label="Xozirgi kunda ish joyi, lavozimi"
           name="name"
           labelCol={{ span: 24 }}
           wrapperCol={{ span: 24 }}
           className='col-6'>
              <Input  placeholder='Xozirgi kunda ish joyi lavozimi' className='py-2'/>
           </Form.Item>  
           <Form.Item name='file' className='col-12 d-flex justify-content-end'>
                <Upload name='file' {...propsss}>
                    <Button icon={<UploadOutlined/>}>Diplom (pdf)</Button>
                </Upload>
           </Form.Item>
           <Form.Item className='col-12 d-flex justify-content-end'>
             <Button type="primary" htmlType="submit" >
                Submit
             </Button>
           </Form.Item>
        </Form>
    </>
  )
}

export default IlmiySaloxiyatModal
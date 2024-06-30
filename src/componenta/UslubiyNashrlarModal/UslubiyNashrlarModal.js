import React, { useState } from 'react'
import { PlusOutlined } from '@ant-design/icons';
import {   Button,Modal,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  Upload, } from 'antd';
import './UslubiyNashrlarModal.scss'
import UploadFile from '../UploadFile/UploadFile';
import { useEffect } from 'react';
import IntURL from '../IntURL/IntURL';
const UslubiyNashrlarModal = () => {
    const [selected, setSelected] = useState('')
    const [open, setOpen] = useState(false);
    const { RangePicker } = DatePicker;
    const [url, seturl] = useState(false) 
    const [upload, setupload] = useState(false) 
    const handleChange = (event) => {
      setSelected(event)
      console.log(selected);
  }
  useEffect(()=>{
if(selected === 'Url'){
   seturl(true)
   setupload(false)
}else{
  seturl(false)
  setupload(true)
}
    },[selected])
  return (
    <div>
    <Form className='row'>
    <Form.Item         
           layout="vertical"
           label="Xodim"
           name="name"
           labelCol={{ span: 24 }}
           wrapperCol={{ span: 24 }}
           className='col-6'>
        <Input  placeholder='Name' className='py-2'/>
      </Form.Item>
      <Form.Item
           layout="vertical"
           label="Uslubiy nashr turi"
           name="IlmiyNashr"
           labelCol={{ span: 24 }}
           wrapperCol={{ span: 24 }}  
           className='col-3'>
      <Select value={selected}>
        <Select.Option className='py-2' value={'demo'}>Boshqa</Select.Option>
        <Select.Option className='py-2' value={'Monografiya'}>Darslik</Select.Option>
        <Select.Option className='py-2' value={'Monografiya'}>Oquv qollanma</Select.Option>
        <Select.Option className='py-2' value={'Monografiya'}>Uslubiy qollanma</Select.Option>
        <Select.Option className='py-2' value={'Monografiya'}>Uslubiy korsatma</Select.Option>
      </Select>
      </Form.Item>
      <Form.Item  
          layout="vertical"
          label="Til"
          name="Til"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          className='col-3'>
      <Select>
        <Select.Option value="o`zbek">o`zbek</Select.Option>
        <Select.Option value="rus">rus</Select.Option>
        <Select.Option value="eng">eng</Select.Option>
      </Select>
      </Form.Item>
      <Form.Item
          layout="vertical"
          label="Nashrning bibliografik matni"
          name="nashr"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          className='col-6'>
      <Input className='py-2'  placeholder='text'/>
      </Form.Item>

      <Form.Item        
        layout="vertical"
        label="fayl joylash turi"
        name="IlmFan"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}  
        className='col-6'>
      <Select value={selected}  onChange={(e)=> handleChange(e)}>
        <Select.Option value={"Url"} >Url</Select.Option>
        <Select.Option value={"Upload"}>Upload</Select.Option>
      </Select>
      </Form.Item>

      <Form.Item         
        layout="vertical"
        label="Mualliflar soni"
        name="number"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }} 
        className='col-2' >
      <InputNumber className='py-1'/>
      </Form.Item>
      <Form.Item         
        layout="vertical"
        label="Mualliflar"
        name="Mualliflar"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }} 
        className='col-4'>
      <Input className='py-2'  placeholder='text'/>
      </Form.Item>         
      {url && <IntURL/>}
         {upload && <UploadFile/>}
      <Form.Item         
        layout="vertical"
        label="Nashriyot"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }} 
        className='col-6'>
      <Input  className='py-2'/>
      </Form.Item>
      <Form.Item         
        layout="vertical"
        label="Nashr yili"
        name="data"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }} 
        className='col-6'>
          <DatePicker className='py-2' />
      </Form.Item>
      <Form.Item          
        layout="vertical"
        label="Guvohnoma Raqami"
        name="IlmiyBazalar"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}  
        className='col-3'>
              <InputNumber className='py-1'/>
      </Form.Item>
      <Form.Item         
        layout="vertical"
        label="Guvonoma sanasi"
        name="data"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }} 
        className='col-3'>
          <DatePicker className='py-2' />
      </Form.Item>
    

      <Form.Item className='col-12 d-flex justify-content-end'>
        <Button type="primary" htmlType="submit">
           Submit
        </Button>
      </Form.Item>
     </Form>
    </div>
  )
}

export default UslubiyNashrlarModal
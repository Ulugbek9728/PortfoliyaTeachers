
import React, { useState } from 'react'
import { PlusOutlined } from '@ant-design/icons';
import {   Button,Modal,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  Upload, } from 'antd';
import './IntModal.scss'
import { useEffect } from 'react';
import UploadFile from '../UploadFile/UploadFile';
import IntURL from '../IntURL/IntURL';
import { upload } from '@testing-library/user-event/dist/upload';
const IntMulkModal = () => {
   
    const [url, seturl] = useState(false) 
    const [upload, setupload] = useState(false) 
    const [selected, setSelected] = useState('')
    const [open, setOpen] = useState(false);
    const { RangePicker } = DatePicker;

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
           label="Ism Familya"
           name="name"
           labelCol={{ span: 24 }}
           wrapperCol={{ span: 24 }}
           className='col-6'>
        <Input  placeholder='Name' className='py-2'/>
      </Form.Item>
      <Form.Item
           layout="vertical"
           label="Ilmiy nashr turi"
           name="IlmiyNashr"
           labelCol={{ span: 24 }}
           wrapperCol={{ span: 24 }}  
           className='col-3'>
      <Select value={selected}>
        <Select.Option className='py-2' value={'demo'}>Demo</Select.Option>
        <Select.Option className='py-2' value={'Monografiya'}>Monografiya</Select.Option>
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
        label="fayl joylash"
        name="IlmFan"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}  
        className='col-2'>
      <Select value={selected}  onChange={(e)=> handleChange(e)}>
        <Select.Option value={"Url"} >Url</Select.Option>
        <Select.Option value={"Upload"}>Upload</Select.Option>
      </Select>
      </Form.Item>       

      <Form.Item        
        layout="vertical"
        label="Ilm-fan soxasi"
        name="IlmFan"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}  
        className='col-6'>
      <Select>
        <Select.Option value="Aniq fanlar">Aniq fanlar</Select.Option>
        <Select.Option value="Amaliy fanlar">Amaliy fanlar</Select.Option>
      </Select>
      </Form.Item>
      {url && <IntURL/>}
      {upload && <UploadFile/>}
      <Form.Item         
        layout="vertical"
        label="Mualliflar somi"
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


      <Form.Item          
        layout="vertical"
        label="Xalqaro Ilmiy bazalar"
        name="IlmiyBazalar"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}  
        className='col-3'>
      <Select>
          <Select.Option value="Aniq fanlar">Aniq fanlar</Select.Option>
          <Select.Option value="Amaliy fanlar">Amaliy fanlar</Select.Option>
      </Select>
      </Form.Item>
      <Form.Item         
        layout="vertical"
        label="Nashr yili"
        name="data"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }} 
        className='col-2'>
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

export default IntMulkModal
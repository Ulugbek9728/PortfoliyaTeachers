
import React, { useState } from 'react'
import { PlusOutlined } from '@ant-design/icons';
import {   Button,Modal,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  Upload, } from 'antd';
const IIlmiyFaollik = () => {
  return (
    <>
      <Form className='row'>
      <Form.Item        
        layout="vertical"
        label="Ilm-fan soxasi"
        name="IlmFan"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}  
        className='col-12'>
      <Select>
        <Select.Option value="Aniq fanlar">Aniq fanlar</Select.Option>
        <Select.Option value="Amaliy fanlar">Amaliy fanlar</Select.Option>
      </Select>
      </Form.Item>
      <Form.Item         
        layout="vertical"
        label="URL"
        name="URL"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }} 
        className='col-12'
        rules={[
          {  message: "请输入有效的网址" },

          {
           type: 'url',
          }

        ]}>
          <Input  className='py-2' placeholder='text'/>
        </Form.Item>

      <Form.Item         
        layout="vertical"
        label="h-index"
        name="number"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }} 
        className='col-12' >
      <InputNumber className='py-1'/>
      </Form.Item>
      <Form.Item         
        layout="vertical"
        label="Ilmiy nashr somi"
        name="number"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }} 
        className='col-12' >
      <InputNumber className='py-1'/>
      </Form.Item>
      <Form.Item         
        layout="vertical"
        label="Iqtibosla somi"
        name="number"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }} 
        className='col-12' >
      <InputNumber className='py-1'/>
      </Form.Item>
      </Form>
    </>
  )
}

export default IIlmiyFaollik
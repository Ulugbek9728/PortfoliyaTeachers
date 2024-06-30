import React from 'react'
import { PlusOutlined } from '@ant-design/icons';
import {   Button,Modal,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  Upload, } from 'antd';

const IntURL = () => {


  return (
    <>
    <Form.Item         
        layout="vertical"
        label="URL"
        name="URL"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }} 
        className='col-6'
        rules={[
          {  message: "请输入有效的网址" },

          {
           type: 'url',
          }
          // {
          //   pattern: new RegExp(/(https):\/\/([\w.]+\/?)\S*/),
          //   message: "notogri manzil"
          // }
        ]}>
      <Input  className='py-2' placeholder='text'/>
      </Form.Item>
    </>
  )
}

export default IntURL
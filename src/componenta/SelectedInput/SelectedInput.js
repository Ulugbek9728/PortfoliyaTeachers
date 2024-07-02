import { Form, Input } from 'antd'
import React from 'react'

const SelectedInput = () => {
  return (
    <>
          <Form.Item         
           layout="vertical"
           label="Ilmiy yo`ki ilmiy kengash qarori"
           name="name"
           labelCol={{ span: 24 }}
           wrapperCol={{ span: 24 }}
           className='col-6'>
        <Input  placeholder='Name' className='py-2'/>
      </Form.Item>
    </>
  )
}

export default SelectedInput
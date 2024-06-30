import React from 'react'
import { PlusOutlined } from '@ant-design/icons';
import {   Button,Modal,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  Upload, } from 'antd';
  import './UploadFile.scss'
const UploadFile = () => {
    const normFile = (e) => {
        if (Array.isArray(e)) {
          return e;
        }
        return e?.fileList;
      };
  return (
    <>
    <Form.Item  labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }} className='col-6' valuePropName="fileList" getValueFromEvent={normFile}>
      <Upload action="/upload.do"  listType="picture-card">
            <button
              style={{
                border: 0,
                background: 'none',
              }}
              type="button"
            >
              <PlusOutlined />
              <div
                style={{
                  marginTop: 8,
                }}
              >
                Upload
              </div>
            </button>
      </Upload>
      </Form.Item>
    </>
  )
}

export default UploadFile
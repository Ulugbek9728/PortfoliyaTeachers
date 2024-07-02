import React, { useState } from 'react'
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
  const [selectfile, setselectfile] = useState()
  const [error, seterror] = useState('')

  return (
    < >

      <Upload  action="/upload.do"  listType="picture-card">
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
    </>
  )
}

export default UploadFile
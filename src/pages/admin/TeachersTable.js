import { Button, Form, InputNumber, Select } from 'antd';
import Input from 'antd/es/input/Input';
import axios from 'axios';
import React, { useState } from 'react'
import { useEffect } from 'react';
import { useRef } from 'react';
import { useQueries, useQuery } from 'react-query';
import { Route, Routes, useNavigate, useSearchParams } from 'react-router-dom';
import { getFaculty, TeacherList } from '../../api/general';
const TeachersTable = () => {
  const [departmentAdd, setDepartmentAdd] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const formRef = useRef(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  
  const { data: facultyData } = useQuery({
    queryKey: ["FacultyList"],
    queryFn: () => getFaculty(11, '').then(res => res.data)
  });
  const {data: Department} = useQuery({
    queryKey: ["DepartmentList"],
    queryFn: () => getFaculty(13).then(res => res.data)
})

  const [srcItem, setSrcItem] = useState({
    facultyId: searchParams.get('facultyId') || null,
    departmentId: searchParams.get('departmentId') || null,
    query: searchParams.get('query') || null,
    staffPosition: searchParams.get('staffPosition') || null
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['get_teacher_info', srcItem],
    queryFn: () => TeacherList({
      page: 0,
      size: 30,
      facultyId: srcItem.facultyId,
      departmentId: srcItem.departmentId,
      query: srcItem.query,
      staffPosition: srcItem.staffPosition
    }).then(res => res.data.data.content)
  });

  useEffect(() => {
    form.setFieldsValue(srcItem);
  }, [srcItem, form]);

  const handleCardClick = (id) => {
    navigate(`/userInfo/${id}`);
  }

  const onChangeField = (fieldKey, value) => {
    if (value === undefined || value === false) {
      searchParams.delete(fieldKey);
      setSearchParams(searchParams, {replace: true});
      setSrcItem(prevState => ({ ...prevState, [fieldKey]: null }));
    } else {
      setSrcItem(prevState => ({ ...prevState, [fieldKey]: value }));
      setSearchParams((prevParams) => {
        prevParams.set(fieldKey, value);
        return prevParams;
      }, {replace: true});
    }
  }


  return (
    <>
      <Form 
        form={form}
        layout="vertical"
        ref={formRef}
        className='d-flex align-items-center gap-4'
      >
        <Form.Item name="facultyId" label="Faculty">
          <Select 
            style={{ width: 250 }}
            name="facultyId"
            allowClear
            placeholder='Facultet'
            onChange={(value) => {
              onChangeField('facultyId', value);
            }}
            options={facultyData?.map((item) => ({
              value: item.id, 
              label: item.name 
            }))} 
          />
        </Form.Item>

        <Form.Item name="departmentId" label="Department">
          <Select
            name="departmentId"
            allowClear
            placeholder="Bo'lim"
            onChange={(value) => {
              onChangeField('departmentId', value);
            }}
            options={Department?.map((item) => ({
              value: item.id,
              label: item.name,
              key: item.id
            }))}
          />
        </Form.Item>

        <Form.Item name="query" label="Search Query">
          <Input placeholder="Search by query" />
        </Form.Item>

        <Form.Item name="staffPosition" label="Staff Position">
          <Input placeholder="Enter staff position" />
        </Form.Item>

        <Button type="primary" onClick={() => form.submit()}>
          Search
        </Button>
      </Form>
     <div className="card-list">
       {data?.map(card => (
        <div key={card.id} className="card  p-3 d-flex flex-column flex-md-row align-items-center mb-3"
        style={{
          "backgroundColor": "#091E3E",
          "color": "#ffffff",
          "borderRadius": "0.375rem",
          "cursor": 'pointer'
        }}
        onClick={() => handleCardClick(card.id)}
        >
        <div className="d-flex align-items-center mb-3 mb-md-0">
          <img
            src={card?.imageUrl}
            alt="Profile"
            className="rounded-circle"
            style={{ width: '60px', height: '60px' }}
          />
        </div>
        <div className="flex-grow-1 ms-3 text-center text-md-start mb-3 mb-md-0">
          <h5 className="mb-0">{card?.fullName}</h5>
          <p className="mb-0">{card?.department?.name}</p>
        </div>
        <div className="d-flex justify-content-center justify-content-md-end w-100 w-md-auto">
          <div className="text-center me-3">
            <h4 className="fw-bold mb-0">{card.hIndex}</h4>
            <p className="mb-0">H-Index</p>
          </div>
          <div className="text-center me-3">
            <h4 className="fw-bold mb-0">{card.publications}</h4>
            <p className="mb-0">Publications</p>
          </div>
          <div className="text-center">
            <h4 className="fw-bold mb-0">{card.citations}</h4>
            <p className="mb-0">Citations</p>
          </div>
        </div>
      </div>
          ))}
        </div>
      </>
      );
}

export default TeachersTable
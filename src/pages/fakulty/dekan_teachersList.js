import React, { useState } from "react";
import { Button, Form, InputNumber, Select } from "antd";
import { useEffect } from "react";
import { useRef } from "react";
import { useQueries, useQuery } from "react-query";
import { Route, Routes, useNavigate, useSearchParams } from "react-router-dom";
import { ClassifairGet, getFaculty, TeacherList } from "../../api/general";
const Dekan_teachersList = () => {
    const [departmentAdd, setDepartmentAdd] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const formRef = useRef(null);
    const [form] = Form.useForm();
    const navigate = useNavigate();
  
    const { data: facultyData } = useQuery({
      queryKey: ["FacultyList"],
      queryFn: () => getFaculty(11, "").then((res) => res.data),
    });

    const stafPosition = useQuery({
      queryKey: ["h_teacher_position_type"],
      queryFn: () =>
        ClassifairGet("h_teacher_position_type").then(
          (res) => res?.data[0]?.options
        ),
    });

    const { data: Department } = useQuery({
      queryKey: ["DepartmentList"],
      queryFn: () => getFaculty(13).then((res) => res.data),
    });
  
    const [srcItem, setSrcItem] = useState({
      facultyId: searchParams.get("facultyId") || null,
      departmentId: searchParams.get("departmentId") || null,
      query: searchParams.get("query") || null,
      staffPosition: searchParams.get("staffPosition") || null,
    });
  
    const { data, isLoading, error } = useQuery({
      queryKey: ["get_teacher_info", srcItem],
      queryFn: () =>
        TeacherList({
          facultyId: srcItem.facultyId,
          departmentId: srcItem.departmentId,
          query: srcItem.query,
          staffPosition: srcItem.staffPosition,
        }).then((res) => res.data.data.content),
    });

    useEffect(() => {
      form.setFieldsValue(srcItem);
    }, [srcItem, form]);
  
    const handleCardClick = (id) => {
      navigate(`/userInfo/${id}`);
    };
  
    const onChangeField = (fieldKey, value) => {
      if (value === undefined || value === false) {
        searchParams.delete(fieldKey);
        setSearchParams(searchParams, { replace: true });
        setSrcItem((prevState) => ({ ...prevState, [fieldKey]: null }));
      } else {
        setSrcItem((prevState) => ({ ...prevState, [fieldKey]: value }));
        setSearchParams(
          (prevParams) => {
            prevParams.set(fieldKey, value);
            return prevParams;
          },
          { replace: true }
        );
      }
    };
  
    return (
      <>
        <Form
          form={form}
          layout="vertical"
          ref={formRef}
          className="d-flex align-items-center gap-4"
        >
          <Form.Item name="facultyId" label="Fakultetni tanlang">
            <Select
              style={{ width: 250 }}
              name="facultyId"
              allowClear
              placeholder="Facultet"
              onChange={(value) => {
                onChangeField("facultyId", value);
              }}
              options={facultyData?.map((item) => ({
                value: item.id,
                label: item.name,
              }))}
            />
          </Form.Item>
  
          <Form.Item name="departmentId" label="Bo`limni tanlang">
            <Select
              name="departmentId"
              style={{ width: 250 }}
              allowClear
              placeholder="Bo'lim"
              onChange={(value) => {
                onChangeField("departmentId", value);
              }}
              options={Department?.map((item) => ({
                value: item.id,
                label: item.name,
                key: item.id,
              }))}
            />
          </Form.Item>
  
          <Form.Item name="stafPosition" label="Lavozimni tanlang">
            <Select
              name="stafPosition"
              style={{ width: 250 }}
              allowClear
              placeholder="Lavozim"
              onChange={(value) => {
                onChangeField("staffPosition", value);
              }}
              options={
                stafPosition?.data?.map((item) => ({
                  value: item.code,
                  label: item.name,
                  key: item.code,
                })) || []
              }
            />
          </Form.Item>
  
          <Button type="primary" onClick={() => form.submit()}>
            Search
          </Button>
        </Form>
        <div className="card-list">
          {data?.map((card) => (
            <div
              key={card.id}
              className="card  p-3 d-flex flex-column flex-md-row align-items-center mb-3"
              style={{
                backgroundColor: "#091E3E",
                color: "#ffffff",
                borderRadius: "0.375rem",
                cursor: "pointer",
              }}
              onClick={() => handleCardClick(card.id)}
            >
              <div className="d-flex align-items-center mb-3 mb-md-0">
                <img
                  src={card?.imageUrl}
                  alt="Profile"
                  className="rounded-circle"
                  style={{ width: "60px", height: "60px" }}
                />
              </div>
              <div className="flex-grow-1 ms-3 text-center text-md-start mb-3 mb-md-0">
                <h5 className="mb-0">{card?.fullName}</h5>
                <p className="mb-0">{card?.department?.name}</p>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  };
export default Dekan_teachersList
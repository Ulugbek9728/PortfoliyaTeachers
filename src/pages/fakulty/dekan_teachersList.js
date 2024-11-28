import React, { useState } from "react";
import { Button, Form, InputNumber, Select } from "antd";
import { useEffect } from "react";
import { useRef } from "react";
import { useQueries, useQuery } from "react-query";
import { Route, Routes, useNavigate, useSearchParams } from "react-router-dom";
import { ClassifairGet, getFaculty, getFacultyDekan, TeacherList } from "../../api/general";
const Dekan_teachersList = () => {
    const [departmentAdd, setDepartmentAdd] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const formRef = useRef(null);
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const fulInfo = JSON.parse(localStorage.getItem("myInfo"));
    const fakultyInfo = fulInfo.roleInfos.filter((item) => item?.faculty?.id != null)

    const{ data: KafedraList} = useQuery({
      queryKey: ["kafedraList"],
      queryFn: () => getFaculty(12, fakultyInfo[0]?.faculty?.id).then(res =>
          res?.data
      )
  })

    const [srcItem, setSrcItem] = useState({
      departmentId: searchParams.get("kafedraList") || null,
    });
  
    const teacherList = useQuery({
      queryKey: ["get_teacher_info", srcItem],
      queryFn: () =>
        TeacherList({
            facultyId:fakultyInfo[0]?.faculty?.id,
          departmentId: srcItem.departmentId,
          query: srcItem.query,
          // staffPosition: srcItem.staffPosition,
        }).then((res) => res.data.data.content),
    });

  
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
          <Form.Item name="kafedraList" label="Kafedrani tanlang">
          <Select
            style={{ width: 250 }}
            name="kafedraList"
            allowClear
            placeholder="Kafedra"
            onChange={(value) => {
              onChangeField("departmentId", value);
            }}
            options={KafedraList?.map((item) => ({
              value: item.id,
              label: item.name,
            }))}
          />
        </Form.Item>
  

  

        </Form>
        <div className="card-list">
          {teacherList?.data?.map((card) => (
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
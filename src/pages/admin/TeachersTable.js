import { Form } from 'antd';
import axios from 'axios';
import React from 'react'
import { useQueries, useQuery } from 'react-query';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { TeacherList } from '../../api/general';
const TeachersTable = () => {
  // const data = [
  //   {
  //     id: 1,
  //     rating: 1,
  //     profileImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRC6iPDSqcgCcAtdEz_rPY0B-sxqMd7hz0Hlg&s',
  //     name: 'Rashid Ashirovich Ganeev',
  //     institute: 'TIQXMMI MTU qoshidagi "Fundamental va Amaliy Tadqiqotlar instituti"',
  //     hIndex: 51,
  //     publications: 539,
  //     citations: 8392,
  //   },
  //   {
  //     id: 2,
  //     rating: 2,
  //     profileImage: 'path_to_image2.jpg',
  //     name: 'Olga Nikolaevna Petrova',
  //     institute: 'Moskva Davlat Universiteti',
  //     hIndex: 45,
  //     publications: 432,
  //     citations: 7345,
  //   },
  //   {
  //     id: 3,
  //     rating: 3,
  //     profileImage: 'path_to_image3.jpg',
  //     name: 'Vladimir Ivanovich Sokolov',
  //     institute: 'Sankt-Peterburg Texnika Instituti',
  //     hIndex: 39,
  //     publications: 389,
  //     citations: 6403,
  //   },
  //   {
  //     id: 4,
  //     rating: 4,
  //     profileImage: 'path_to_image4.jpg',
  //     name: 'Anna Sergeevna Ivanova',
  //     institute: 'Novosibirsk Davlat Universiteti',
  //     hIndex: 42,
  //     publications: 410,
  //     citations: 5821,
  //   },
  //   {
  //     id: 5,
  //     rating: 5,
  //     profileImage: 'path_to_image5.jpg',
  //     name: 'Dmitry Aleksandrovich Kuznetsov',
  //     institute: 'Tomsk Politeknika Universiteti',
  //     hIndex: 47,
  //     publications: 450,
  //     citations: 7104,
  //   },
  // ];

  const { data, isLoading, error } = useQuery({
    queryKey: ['get_teacher_info'],
    queryFn: () => TeacherList()
    .then(res => {
      console.log(res); // Ma'lumot tuzilmasini tekshirish
      return res.data.data.content; // To'g'ri tuzilmani qaytarish
    })// res.data.data.content dan ma'lumotlarni olish
  });

  console.log(data);
  const navigate = useNavigate();
  const handleCardClick = (id) => {
    navigate(`/userInfo/${id}`);
  };


    
      // Kartalar ro'yxatini chiqarish
      return (
      <>
       <Form
      >
    
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
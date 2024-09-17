import React from 'react'
import './teacherInfo.css';
import Navbar from '../../componenta/Navbar'
import { useParams } from 'react-router';
import { TeacherFullInfo } from '../../api/general';
import { useQuery } from 'react-query';

const TeachersInfo = () => {
  const fulInfo = JSON.parse(localStorage.getItem("myInfo"));
  const { id } = useParams();
  const { data: teachersData, isLoading, error } = useQuery(
    'teachers', 
    TeacherFullInfo, 
    {
      enabled: !!id,
    }
  );
  
  const teacher = teachersData?.data?.data?.content?.find(teacher => teacher.id === id);

  // Attach obyektlarini JSON.parse yordamida parse qilish
  const parsedSpecialistAttach = teacher?.specialist?.attach ? JSON.parse(teacher.specialist.attach) : null;
  const parsedScientificTitleAttach = teacher?.scientificTitle?.attach ? JSON.parse(teacher.scientificTitle.attach) : null;
  const parsedScientificDegreeAttach = teacher?.scientificDegree?.attach ? JSON.parse(teacher.scientificDegree.attach) : null;
  const parsedStateAwardAttach = teacher?.profileStateAwardDTO?.attach ? JSON.parse(teacher.profileStateAwardDTO.attach) : null;

  return (
    <>
      <Navbar/>
      <div className='TeacherRating mb-5'>
       <div className='TeacherRating_header'>
          <div className='TeacherRating_img'>
              {<img src={teacher?.imageUrl} alt=''/>}
          </div>
          <div className='TeacherRating_text'>
              <h3 className='TeacherRating_text_name'>{teacher?.fullName}</h3>
              <div className='TeacherRating_text_description row'>
                  <div className='col-4 card p-4'>
                      <div>
                          <b>Ish joy:</b>
                          <p>{fulInfo?.parentDepartment?.name} <br/> {fulInfo?.department?.name}</p>
                      </div>
                      <div>
                          <b>Lavozim: </b>
                          <p> {fulInfo?.staffPosition?.name}</p>
                      </div>
                      <div>
                          <b>Shtat birligi:</b>
                          <p> {fulInfo?.employmentForm?.name} {fulInfo?.employmentStaff?.name}</p>
                      </div>
                  </div>
                  <div className='col-4 card p-4'>
                      <div className=''>
                          <b>Mutaxasislik nomi</b>
                          <p> {teacher?.specialist?.name}</p>
                      </div>
                      <div className=''>
                          <b>Diplom sanasi</b>
                          <p> {teacher?.specialist?.date}</p>
                      </div>
                      <div>
                          <b>Diplom raqami</b>
                          <p> {teacher?.specialist?.number}</p>
                      </div>
                      <div>
                          <b>Diplom</b> <br/>
                          {
                              parsedSpecialistAttach ?
                                  <a href={parsedSpecialistAttach.url} target={"_blank"}>{parsedSpecialistAttach.fileName}</a>
                                  :
                                  ''
                          }
                      </div>
                  </div>
                  <div className='col-4 card p-4'>
                      <div className=''>
                          <b>Ilmiy unvon nomi</b>
                          <p> {teacher?.scientificTitle?.name ? teacher?.scientificTitle?.name :"yo'q" }</p>
                      </div>
                      <div className=''>
                          <b>Diplom sanasi</b>
                          <p> {teacher?.scientificTitle?.name ? teacher?.scientificTitle?.date :"yo'q" }</p>
                      </div>
                      <div className=''>
                          <b>Diplom raqami</b>
                          <p> {teacher?.scientificTitle?.name ? teacher?.scientificTitle?.number  :"yo'q" }</p>
                      </div>
                      <div>
                          <b>Diplom</b> <br/>
                          {
                              parsedScientificTitleAttach ?
                                  <a href={parsedScientificTitleAttach.url} target={"_blank"}>{parsedScientificTitleAttach.fileName}</a>
                                  :
                                  "yo'q"
                          }
                      </div>
                  </div>
                  <div className='col-4 card p-4'>
                      <div className=''>
                          <b>Ilmiy daraja nomi</b>
                          <p>{teacher?.scientificDegree?.name ? teacher?.scientificDegree?.name : "yo'q"}</p>
                      </div>
                      <div className=''>
                          <b>Diplom sanasi</b>
                          <p> {teacher?.scientificDegree?.name ? teacher?.scientificDegree?.date : "yo'q"}</p>
                      </div>
                      <div className=''>
                          <b>Diplom raqami</b>
                          <p> {teacher?.scientificDegree?.name ? teacher?.scientificDegree?.number : "yo'q"}</p>
                      </div>
                      <div>
                          <b>Diplom</b> 
                          <br/>
                          {
                              parsedScientificDegreeAttach ?
                                  <a href={parsedScientificDegreeAttach.url} target={"_blank"}>{parsedScientificDegreeAttach.fileName}</a>
                                  :
                                  "yo'q"
                          }
                      </div>
                  </div>
                  <div className='col-4 card p-4'>
                      <div>
                          <b>Davlat mukofoti nomi</b>
                          <p>{teacher?.profileStateAwardDTO?.nameStateAward ? teacher?.profileStateAwardDTO?.nameStateAward :"yo'q" }</p>
                      </div>
                      <div>
                          <b>Davlat mukofotini olgan sanasi</b>
                          <p> {teacher?.profileStateAwardDTO?.nameStateAward ? teacher?.profileStateAwardDTO?.date : "yo'q"}</p>
                      </div>
                      <div>
                          <b>Diplom</b> <br/>
                          {
                              parsedStateAwardAttach ?
                                  <a href={parsedStateAwardAttach.url} target={"_blank"}>{parsedStateAwardAttach.fileName}</a>
                                  :
                                  "yo'q"
                          }
                      </div>
                  </div>
              </div>
          </div>
       </div>
      </div>
    </>
  )
}

export default TeachersInfo;

import React, { useEffect, useState } from 'react'
import './teacherInfo.css';
import Navbar from '../../componenta/Navbar'
import { useParams } from 'react-router';
import { TeacherFullInfo } from '../../api/general';
import { useQuery } from 'react-query';
import axios from 'axios';
import { ApiName } from '../../api/APIname';
const TeachersInfo = () => {
    const [data, setData] = useState(null); 
  const fulInfo = JSON.parse(localStorage.getItem("myInfo"));
  const { id } = useParams();
  const { data: teachersData, isLoading, error } = useQuery(
    'teachers', 
    TeacherFullInfo, 
    {
      enabled: !!id,
    }
  );
  const [profiles, setProfiles] = useState([]);


  const getData = async () => {
    try {
      const response = await axios.get(`${ApiName}/api/author-profile/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${fulInfo?.accessToken}`,
        },
      });

      if (response.data.isSuccess && response.data.data) {
        console.log("Ma'lumotlar:", response.data.data);
        setProfiles(response.data.data); 
      } else {
        console.error("Ma'lumot olishda xato:", response.data.message);
      }
    } catch (error) {
      console.error("Ma'lumot olishda xato yuz berdi:", error);
    }
  };

  useEffect(() => {
    getData();
  }, [id]); 

  const getProfileImage = (profileTypeName) => {
    switch (profileTypeName.toLowerCase()) {
      case 'scopus':
        return '../img/Scopus.png';
      case 'google scholar':
          return '../img/googleScholar.png';
      default:
        return "../img/wos.png";
    }
  };
  const teacher = teachersData?.data?.data?.content?.find(teacher => teacher.id === id);
    
  const parsedSpecialistAttach = teacher?.specialist?.attach ? JSON.parse(teacher.specialist.attach) : null;
  const parsedScientificTitleAttach = teacher?.scientificTitle?.attach ? JSON.parse(teacher.scientificTitle.attach) : null;
  const parsedScientificDegreeAttach = teacher?.scientificDegree?.attach ? JSON.parse(teacher.scientificDegree.attach) : null;
  const parsedStateAwardAttach = teacher?.profileStateAwardDTO?.attach ? JSON.parse(teacher.profileStateAwardDTO.attach) : null;
console.log(teacher);
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
                          <p> {teacher?.department?.name}</p>
                      </div>
                      {/* <div>
                          <b>Lavozim: </b>
                          <p> {fulInfo?.staffPosition?.name}</p>
                      </div>
                      <div>
                          <b>Shtat birligi:</b>
                          <p> {fulInfo?.employmentForm?.name} {fulInfo?.employmentStaff?.name}</p>
                      </div> */}
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
       <div className='teacher_rating_bottom mt-4'>
      {profiles.length > 0 ? (
        profiles.map((profile, index) => (
          <div key={profile.id} className='align-items-center justify-content-center br_right w-100 d-flex gap-3'>
            <a href={profile.urlOrOrcid} target="_blank" rel="noreferrer">
              <img src={getProfileImage(profile.profileType.name)} width={90} alt={profile.profileType.name} />
            </a>
            {profile.databaseProfile ? (
              <div>
                {profile.databaseProfile.hindex && (
                  <>
                    <b className='m-0 text-lg'>h-index</b>
                    <p className='m-0'>{profile.databaseProfile.hindex}</p>
                    <hr />
                  </>
                )}
                {profile.databaseProfile.citationCount && (
                  <>
                    <b className='m-0 text-lg'>Ilmiy ishlar</b>
                    <p className='m-0'>{profile.databaseProfile.citationCount}</p>
                    <hr />
                  </>
                )}
                {profile.databaseProfile.citedByCount && (
                  <>
                    <b className='m-0 text-lg'>Iqtiboslar soni</b>
                    <p className='m-0'>{profile.databaseProfile.citedByCount}</p>
                  </>
                )}
              </div>
            ) : null}
          </div>
        ))
      ) : (
        <>
          <div className='align-items-center justify-content-center br_right w-100 d-flex gap-3'>
           <p>Malumot topilmadi.</p>
          </div>

        </>
      )}
    </div>
      </div>
    </>
  )
}

export default TeachersInfo;

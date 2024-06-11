import React, {useState} from 'react'
import './teacherRating.css'

const TeacherRating = () => {
    const [fulInfo] = useState(JSON.parse(localStorage.getItem("myInfo")));
    
    return (
        <>
            <div className='TeacherRating'>
                <div className='TeacherRating_header'>
                    <div className='TeacherRating_img'>
                        {<img src={fulInfo?.imageUrl} alt=''/>}

                        {/*<img src={user} alt=''/>*/}
                    </div>
                    <div className='TeacherRating_text'>
                        <h3 className='TeacherRating_text_name'>{fulInfo?.fullName}</h3>
                        <div className='TeacherRating_text_description'>
                            <div className='d-flex'>
                                <b className='mx-3'>Ish joy:</b>
                                <p>{fulInfo?.parentDepartment?.name} <br/> {fulInfo?.department?.name}</p>
                            </div>
                            <div className='d-flex'>
                                <b className='mx-3'>Lavozim: </b>
                                <p> {fulInfo?.staffPosition?.name}</p>
                            </div>
                            <div className='d-flex'>
                                <b className='mx-3'>Shtat birligi:</b>
                                <p> {fulInfo?.employmentForm?.name} {fulInfo?.employmentStaff?.name}</p>
                            </div>


                        </div>

                    </div>
                </div>
                <div className='teacher_rating_bottom'>
                    <div className='text-center br_right'>
                        <span className='fw-bolder text-4xl '>132</span>
                        <p className=' text-lg text-center'>Citations</p>
                    </div>
                    <div className='text-center br_right'>
                        <span className='fw-bolder text-4xl '>132</span>
                        <p className=' text-lg text-center'>Citations</p>
                    </div>
                    <div className='text-center br_right'>
                        <span className='fw-bolder text-4xl '>132</span>
                        <p className=' text-lg text-center'>Citations</p>
                    </div>
                    <div className='text-center'>
                        <span className='fw-bolder text-4xl '>132</span>
                        <p className=' text-lg text-center'>Citations</p>
                    </div>
                </div>
            </div>

        </>
    )
}

export default TeacherRating
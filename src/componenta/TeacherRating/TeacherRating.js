import React, {useState} from 'react'
import './teacherRating.css'
//import user from '../../img/user.png'

const TeacherRating = () => {
    const [fulInfo] = useState(JSON.parse(localStorage.getItem("myInfo")));

    console.log(fulInfo)

    return (
        <>
            <div className='TeacherRating'>
                <div className='TeacherRating_header'>
                    <div className='TeacherRating_img'>
                        {<img src={fulInfo?.imageUrl} alt=''/>}

                        {/*<img src={user} alt=''/>*/}
                    </div>
                    <div className='TeacherRating_text'>
                        <h3 className='TeacherRating_text_name'>
                            {fulInfo?.fullName}
                        </h3>
                        <p className='TeacherRating_text_description'>
                            <div className='d-flex'>
                                <b>Ish joy:</b>
                                <p> {fulInfo?.department?.name}</p>
                            </div>
                            <div className='d-flex'>
                                <b>Lavozim: </b>
                                <p> {fulInfo?.staffPosition?.name}</p>
                            </div>
                            <div className='d-flex'>
                                <b>Shtat birligi:</b>
                                <p> {fulInfo?.employmentForm?.name} {fulInfo?.employmentStaff?.name}</p>
                            </div>


                        </p>

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
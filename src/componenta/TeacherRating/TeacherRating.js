import React from 'react'
import './teacherRating.css'
import user from '../../img/user.png'
const TeacherRating = () => {
  return (
    <>
        <div className='TeacherRating'>
            <div className='TeacherRating_header'>
            <div className='TeacherRating_img'>
                <img src={user}></img>
            </div>
            <div className='TeacherRating_text'>
                 <h3 className='TeacherRating_text_name'>
                    John Doe, Professor of Computer Science
                 </h3>
                 <p className='TeacherRating_text_description'>
                    "I have been using this platform for my coursework and it has made the process so much smoother! The interface is easy to
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
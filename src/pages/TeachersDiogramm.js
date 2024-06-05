import React from 'react'
import Navbar from '../componenta/Navbar'
import TeachersComponent from '../componenta/Teachers/TeachersComponent'

const TeachersDiogramm = () => {
  return (
    <>
      <Navbar/>
        <div className="" style={{marginTop:"10%"}}>
            <TeachersComponent />
        </div>

    </>
  )
}

export default TeachersDiogramm
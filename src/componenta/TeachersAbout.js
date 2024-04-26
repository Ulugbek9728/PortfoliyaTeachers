import React from 'react'
import TeachersSwiper from './TeachersSwiper'


const TeachersAbout = () => {
  return (
    <div className="container-fluid">
    <div className="container py-4">
        <div className="section-title text-center position-relative pb-3 mb-5 mx-auto">
            <h1 className="mb-0 text-uppercase">Universitet o'qtuvchilari malumotnomasi</h1>
            <div className="linebuttom">
                <div className="nuqta"></div>
            </div>
        </div>
    </div>
    <TeachersSwiper/>
</div>

  )
}

export default TeachersAbout
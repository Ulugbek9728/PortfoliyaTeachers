import React from 'react';
import Navbar from "../componenta/Navbar";
import TeachersAbout from '../componenta/TeachersAbout';
import TeacherStatistic from "../componenta/teacherStatistic";

function KafedraStatic(props) {
    return (
        <div>
            <Navbar/>
            <TeacherStatistic/>
            <TeachersAbout/>
        </div>
    );
}

export default KafedraStatic;
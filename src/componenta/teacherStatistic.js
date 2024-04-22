import React from 'react';
import Teachers from "./teachers";

function TeacherStatistic(props) {
    return (
        <div className="container-fluid">
            <div className="container py-4">
                <div className="section-title text-center position-relative pb-3 mb-5 mx-auto">
                    <h5 className="fw-bold text-primary text-uppercase">O'qtuvchilar</h5>
                    <h1 className="mb-0 text-uppercase">Universitet o'qtuvchilari statistika</h1>
                    <div className="linebuttom">
                        <div className="nuqta"></div>
                    </div>
                </div>
                <Teachers/>

            </div>
        </div>
    );
}

export default TeacherStatistic;
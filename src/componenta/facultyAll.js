import React from 'react';
import Fakultet from "./fakultetlar/Fakultet";

function FacultyAll(props) {
    return (
        <div className="container-fluid">
            <div className="container py-4">
                <div className="section-title text-center position-relative pb-3 mb-5 mx-auto">
                    <h5 className="fw-bold text-primary text-uppercase">Bizning fakultetlar</h5>
                    <h1 className="mb-0 text-uppercase">fakultet bo'yicha statistikalar</h1>
                    <div className="linebuttom">
                        <div className="nuqta"></div>
                    </div>
                </div>
            </div>

            <Fakultet/>
        </div>
    );
}

export default FacultyAll;
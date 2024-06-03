import React from 'react';
import TeacherRating from "../componenta/TeacherRating/TeacherRating";
import Navbar from "../componenta/Navbar";

function Profile(props) {
    return (
        <div>
            <Navbar/>
            <div className="container">
                <div className="row">
                    <div className="col-3 border-3 bg-white">

                    </div>
                    <div className="col-9">
                        <TeacherRating/>
                    </div>
                </div>
            </div>



        </div>
    );
}

export default Profile;
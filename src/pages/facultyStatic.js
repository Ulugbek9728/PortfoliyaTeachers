import React from 'react';
import Navbar from "../componenta/Navbar";
import KafedraAll from "../componenta/kafedraAll";
import FakultetList from "../componenta/fakultet/fakultetList";
import Title from "../componenta/title";
import Kaferdras from "../componenta/Kaferdras";

function FacultyStatic(props) {
    return (
        <div>
            <Navbar/>
            <div className="container mt-5">
                <div className="row">
                    <Title props={{title1:"Bizning kafedralar",title2:"Fakultet bo'yicha reyting"}}/>
                    <FakultetList/>
                    <Kaferdras/>
                </div>
            </div>



        </div>
    );
}

export default FacultyStatic;
import React from 'react';
import Navbar from "../componenta/Navbar";
import Title from "../componenta/title";
import FakultetList from "../componenta/fakultet/fakultetList";


function KafedraStatic(props) {
    return (
        <div>
            <Navbar/>
            <div className="container mt-5">
                <div className="row">
                    <Title props={{title1:"O'qituvchilar reytingi",title2:"Kafedra bo'yicha reyting"}}/>
                    <FakultetList/>
                </div>
            </div>

        </div>
    );
}

export default KafedraStatic;
import React from 'react';
import Navbar from "../componenta/Navbar";
import HeaderCarusel from "../componenta/headerCarusel";
import Facts from "../componenta/facts";
import FacultyAll from "../componenta/facultyAll";
import FakultetList from "../componenta/fakultet/fakultetList";
import Title from "../componenta/title";

function Home(props) {
    return (
        <div>
            <Navbar/>
            <HeaderCarusel/>
            <Facts/>
            <Title props={{title1:"Bizning fakultetlar",title2:"Universitet bo'yicha reyting"}}/>
            <FakultetList/>
            <FacultyAll />

        </div>
    );
}

export default Home;
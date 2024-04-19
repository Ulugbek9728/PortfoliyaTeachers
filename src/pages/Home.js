import React from 'react';
import Navbar from "../componenta/Navbar";
import HeaderCarusel from "../componenta/headerCarusel";
import Facts from "../componenta/facts";
import FacultyAll from "../componenta/facultyAll";

function Home(props) {
    return (
        <div>
            <Navbar/>
            <HeaderCarusel/>
            <Facts/>
            <FacultyAll/>
        </div>
    );
}

export default Home;
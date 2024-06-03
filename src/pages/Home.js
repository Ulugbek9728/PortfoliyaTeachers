import React from 'react';
import Navbar from "../componenta/Navbar";
import HeaderCarusel from "../componenta/headerCarusel";
import Facts from "../componenta/facts";
import FakultetList from "../componenta/fakultet/fakultetList";
import Title from "../componenta/title";
import Facultys from "../componenta/Facultys";

function Home(props) {

    return (
        <div>
            <Navbar/>
            <HeaderCarusel/>
            <Facts/>


        </div>
    );
}

export default Home;
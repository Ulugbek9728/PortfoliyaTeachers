import React from 'react';
import Navbar from "../componenta/Navbar";
import HeaderCarusel from "../componenta/headerCarusel";
import Facts from "../componenta/facts";


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
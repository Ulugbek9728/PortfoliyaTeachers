import React from 'react';
import Navbar from "../componenta/Navbar";

function PageNotFound(props)
{
    return (
        <div className="container-fluid">
            <div className="row mt-5 d-flex align-items-center justify-content-center">
                <Navbar/>
                <img style={{width:'40%', marginTop:'10%'}} src="../404error1.svg" alt=""/>
            </div>

        </div>
    );
}

export default PageNotFound;
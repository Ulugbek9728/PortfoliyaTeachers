import React from 'react';
import {Link} from "react-router-dom";
import {ApiName} from "../api/APIname";

function Navbar(props) {
    return (
        <div className="p-0">

            <div className="container-fluid bg-dark px-5 d-none d-lg-block">
                <div className="row gx-0">
                    <div className="col-lg-8 text-center text-lg-start mb-2 mb-lg-0">
                        <div className="d-inline-flex align-items-center" style={{height: "45px"}}>
                            <small className="me-3 text-light"><i className="fa fa-map-marker-alt me-2"></i>123 Street, New York, USA</small>
                            <small className="me-3 text-light"><i className="fa fa-phone-alt me-2"></i>+012 345 6789</small>
                            <small className="text-light"><i className="fa fa-envelope-open me-2"></i>info@example.com</small>
                        </div>
                    </div>
                    <div className="col-lg-4 text-center text-lg-end">
                        <div className="d-inline-flex align-items-center" style={{height: "45px"}}>
                            <a className="btn btn-sm btn-outline-light btn-sm-square rounded-circle me-2" href=""><i className="fab fa-twitter fw-normal"></i></a>
                            <a className="btn btn-sm btn-outline-light btn-sm-square rounded-circle me-2" href=""><i className="fab fa-facebook-f fw-normal"></i></a>
                            <a className="btn btn-sm btn-outline-light btn-sm-square rounded-circle me-2" href=""><i className="fab fa-linkedin-in fw-normal"></i></a>
                            <a className="btn btn-sm btn-outline-light btn-sm-square rounded-circle me-2" href=""><i className="fab fa-instagram fw-normal"></i></a>
                            <a className="btn btn-sm btn-outline-light btn-sm-square rounded-circle" href=""><i className="fab fa-youtube fw-normal"></i></a>
                        </div>
                    </div>
                </div>
            </div>

            {/*Topbar End*/}

            {/*Navbar & Carousel Start*/}

            <div className="container-fluid position-relative p-0">
                <nav className="navbar navbar-expand-lg  navbar-dark px-5 py-3 py-lg-0">
                    <Link to="/" className="navbar-brand p-0">
                        <h1 className="m-0"><i className="fa fa-user-tie me-2"></i>Startup</h1>
                    </Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
                        <span className="fa fa-bars"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarCollapse">
                        <div className="navbar-nav ms-auto py-0">
                            <a href="#" className="nav-item nav-link">Home</a>
                            <a href="#" className="nav-item nav-link">About</a>
                            <a href="#" className="nav-item nav-link">Services</a>
                            <a  href={`https://hemis.tdtu.uz/oauth/authorize?response_type=code&client_id=4&state=auth_state&redirect_uri=${ApiName}/auth`}
                               className="nav-item nav-link">Hemis orqali kirish</a>
                        </div>
                    </div>
                </nav>


            </div>
        </div>
    );
}

export default Navbar;
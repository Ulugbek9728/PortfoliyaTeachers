import React from 'react';
import {Link} from "react-router-dom";
import {ApiName} from "../api/APIname";
import LanguageSwitcher from "./LanguageSwitcher";
import {useTranslation} from "react-i18next";
import { CaretDownOutlined } from '@ant-design/icons';
import { Dropdown, Space } from 'antd';


function Navbar(props) {
    const {t} = useTranslation();
    const items = [
        {
            label: (
                <Link  to="/university">
                    Universitet bo'yicha Fakultetlar reytingi
                </Link>
            ),
            key: '1',
        },
        {
            label: (
                <Link  to="/faculties">
                    Universitet bo'yicha kafedralar reytingi
                </Link>
            ),
            key: '2',
        },
        {
            label: (
                <Link  to="/kafedra">
                    Universitet bo'yicha o'qituvchilar reytingi
                </Link>
            ),
            key: '3',
        },
        {
            type: 'divider',
        },
    ];

    return (
        <div className="p-0">

            <div className="container-fluid bg-dark px-5 d-none d-lg-block">
                <div className="row gx-0">
                    <div className="col-lg-8 text-center text-lg-start mb-2 mb-lg-0">
                        <div className="d-inline-flex align-items-center" style={{height: "45px"}}>
                            <small className="me-3 text-light"><i className="fa fa-map-marker-alt me-2"></i>Toshkent shahri, Universitet ko`chasi 2-uy</small>
                            <small className="me-3 text-light"><i className="fa fa-phone-alt me-2"></i>+998 71 207 07 32</small>
                            <small className="text-light"><i
                                className="fa fa-envelope-open me-2"></i>https://webmail.tdtu.uz/</small>
                        </div>
                    </div>
                    <div className="col-lg-4 text-center text-lg-end">
                        <div className="d-inline-flex align-items-center" style={{height: "45px"}}>
                            <a className="btn btn-sm btn-outline-light btn-sm-square rounded-circle me-2" href=""><i
                                className="fab fa-twitter fw-normal"></i></a>
                            <a className="btn btn-sm btn-outline-light btn-sm-square rounded-circle me-2" href=""><i
                                className="fab fa-facebook-f fw-normal"></i></a>
                            <a className="btn btn-sm btn-outline-light btn-sm-square rounded-circle me-2" href=""><i
                                className="fab fa-linkedin-in fw-normal"></i></a>
                            <a className="btn btn-sm btn-outline-light btn-sm-square rounded-circle me-2" href=""><i
                                className="fab fa-instagram fw-normal"></i></a>
                            <a className="btn btn-sm btn-outline-light btn-sm-square rounded-circle" href=""><i
                                className="fab fa-youtube fw-normal"></i></a>
                        </div>
                    </div>
                </div>
            </div>
            {/*Topbar End*/}

            {/*Navbar & Carousel Start*/}
            <div className="container-fluid position-relative p-0">
                <nav className="navbar navbar-expand-lg  navbar-dark px-5 py-3 py-lg-0">
                    <Link to="/" className="navbar-brand p-0 w-50">
                        <h1 className="d-flex align-items-center w-100">
                            <i className="fa fa-user-tie me-2"></i>
                            <img src="" alt=""/>
                        </h1>
                    </Link>
                    <div className='d-flex gap-3'>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                                data-bs-target="#navbarCollapse1">
                            <span className="fa fa-bars"></span>
                        </button>
                        <div className="d-lg-none">
                            <LanguageSwitcher/>
                        </div>
                    </div>

                    <div className="collapse navbar-collapse" id="navbarCollapse1">
                        <div className="navbar-nav ms-auto py-0 align-items-center">
                            <a href="#" className="nav-item nav-link">Home</a>
                            <Dropdown menu={{items}}>
                                <a className='nav-item nav-link' onClick={(e) => e.preventDefault()}>
                                    <Space style={{cursor:"pointer"}}>
                                        TDTU ichki reytinglari
                                        <CaretDownOutlined />
                                    </Space>
                                </a>
                            </Dropdown>
                            {/*/!*${ApiName}*!/  http://localhost:3000/*/}
                            <a href={`https://hemis.tdtu.uz/oauth/authorize?response_type=code&client_id=5&state=auth_state&redirect_uri=http://localhost:3000/auth`}
                               className="nav-item nav-link">
                                Hemis orqali kirish
                                <i className="fa-solid fa-right-to-bracket mx-2"></i>
                            </a>
                        </div>

                    </div>
                    <div className="d-lg-block d-none mx-3">
                        <LanguageSwitcher/>
                    </div>

                </nav>
            </div>
        </div>
    );
}

export default Navbar;
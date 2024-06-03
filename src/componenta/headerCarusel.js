import React from 'react';
import img1 from "../img/carousel-1.jpg";
import img2 from "../img/carousel-2.jpg";
import {useTranslation} from "react-i18next";

function HeaderCarusel(props) {
    const {t} = useTranslation();

    return (
        <div id="header-carousel" className="carousel slide carousel-fade" data-bs-ride="carousel">
            <div className="carousel-inner " >
                <div className="carousel-item active">
                    <img className="w-100" src={img1} alt="Image"/>
                    <div className="carousel-caption d-flex flex-column align-items-center justify-content-center ">
                        <div className=" w-50">
                            <h5 className="text-white display-6 text-uppercase mb-3 animated slideInDown">{t("Home.logo1")}</h5>
                            <h1 className="display-1 text-white mb-md-4 animated zoomIn">Creative & Innovative Digital Solution</h1>
                            <a href="#" className="btn btn-primary py-md-3 px-md-5 me-3 animated slideInLeft">Free Quote</a>
                            <a href="#" className="btn btn-outline-light py-md-3 px-md-5 animated slideInRight">Contact Us</a>
                        </div>
                    </div>
                </div>
                <div className="carousel-item ">
                    <img className="w-100" src={img2} alt="Image"/>
                    <div className="carousel-caption d-flex flex-column align-items-center justify-content-center">
                        <div className=" w-50">
                            <h5 className="text-white display-6 text-uppercase mb-3 animated slideInDown">{t("Home.logo1")}</h5>
                            <h1 className="display-1 text-white mb-md-4 animated zoomIn">Creative & Innovative Digital Solution</h1>
                            <a href="#" className="btn btn-primary py-md-3 px-md-5 me-3 animated slideInLeft">Free Quote</a>
                            <a href="#" className="btn btn-outline-light py-md-3 px-md-5 animated slideInRight">Contact Us</a>
                        </div>
                    </div>
                </div>
            </div>
            <button className="carousel-control-prev" type="button" data-bs-target="#header-carousel"
                    data-bs-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#header-carousel"
                    data-bs-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
            </button>
        </div>    );
}

export default HeaderCarusel;
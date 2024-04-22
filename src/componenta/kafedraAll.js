import React from 'react';
import Kaferdras from "./Kaferdras";

function KafedraAll(props) {
    return (
        <div className="container-fluid">
            <div className="container py-4">
                <div className="section-title text-center position-relative pb-3 mb-5 mx-auto">
                    <h5 className="fw-bold text-primary text-uppercase">Bizning Kafedralar</h5>
                    <h1 className="mb-0 text-uppercase">fakultet bo'yicha statistika</h1>
                    <div className="linebuttom">
                        <div className="nuqta"></div>
                    </div>
                </div>

                <Kaferdras/>
            </div>
        </div>
    );
}

export default KafedraAll;
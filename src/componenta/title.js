import React from 'react';

function Title(props) {
    return (
        <div className="container-fluid">
            <div className="container ">
                <div className="section-title text-center position-relative pb-3 mb-5 mx-auto">
                    <h5 className="fw-bold text-primary text-uppercase">{props.props.title2}</h5>
                    <h1 className="mb-0 text-uppercase">{props.props.title1}</h1>
                    <div className="linebuttom">
                        <div className="nuqta"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Title;
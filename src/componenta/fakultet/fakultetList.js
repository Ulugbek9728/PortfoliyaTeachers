import React from 'react';
import {Link} from 'react-router-dom';
import "../../style/fakultetListe.css"

function FakultetList(props) {
    return (
        <div className='container'>
            <div className="row">
                <div className="buttons">
                    {props?.fakulty?.map((eachcard, index) => (
                        <Link to={`${eachcard.link}${eachcard.id}`} className="neumorphic" key={index}>
                            <div className='user_info'>
                                <div className='reyting '>
                                    <span className='fw-bolder '>{index + 1}</span>
                                    <p className=''>Reyting</p>
                                </div>
                                <div className='btn_img'></div>
                                <div className='user_container'>
                                    <h5 className='user_title '>{eachcard.name}</h5>
                                    <p>{eachcard.universty}</p>
                                </div>
                            </div>
                            <div className="d-flex gap-5 align-items-center">
                                <span className='text-center'>
                                    <span className='user_title'>{eachcard.index}</span>
                                    <p className='user_title'>H-Index</p>
                                </span>
                                <span className='text-center'>
                             <span className='user_title '>{eachcard.index}</span>
                             <p className='user_title'>Publications</p>
                         </span>
                                <span className='text-center'>
                             <span className='user_title '>{eachcard.index}</span>
                             <p className='user_title'>Citations</p>
                         </span>
                                <span className='text-center'>
                             <span className='user_title '>{eachcard.index}</span>
                             <p className='user_title'>Citations</p>
                         </span>
                                <span className='text-center'>
                             <span className='user_title '>{eachcard.index}</span>
                             <p className='user_title'>Citations</p>
                         </span>
                            </div>

                        </Link>
                    ))}
                </div>
            </div>

        </div>
    );
}

export default FakultetList;
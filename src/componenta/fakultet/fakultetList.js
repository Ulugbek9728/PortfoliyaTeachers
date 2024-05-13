import React from 'react';
import { Link } from 'react-router-dom';
import "../../style/fakultetListe.css"

function FakultetList(props) {

const test = [
    {

        id:1,
        name:"Akshit",
        universty:"TIQXMMI MTU qoshidagi Fundamental va Amaliy Tadqiqotlar instituti",
        rating:1,
        index:4,
    },   
    {
        id:2,
        name:"Nikita",
        universty:"TIQXMMI MTU qoshidagi Fundamental va Amaliy Tadqiqotlar instituti",
        rating:2,
        index:513,
    },
    {
        id:3,
        name:"Deeksha",
        universty:"TIQXMMI MTU qoshidagi Fundamental va Amaliy Tadqiqotlar instituti",
        rating:3,
        index:765,
    },
    {
        id:4,
        name:"Ritesh",
        universty:"TIQXMMI MTU qoshidagi Fundamental va Amaliy Tadqiqotlar instituti",
        rating:4,
        index:754,
    },
    {

        id:5,
        name:"Akshit",
        universty:"TIQXMMI MTU qoshidagi Fundamental va Amaliy Tadqiqotlar instituti",
        rating:1,
        index:4,
    },
    {
        id:6,
        name:"Nikita",
        universty:"TIQXMMI MTU qoshidagi Fundamental va Amaliy Tadqiqotlar instituti",
        rating:2,
        index:513,
    },
    {
        id:7,
        name:"Deeksha",
        universty:"TIQXMMI MTU qoshidagi Fundamental va Amaliy Tadqiqotlar instituti",
        rating:3,
        index:765,
    },
    {
        id:8,
        name:"Ritesh",
        universty:"TIQXMMI MTU qoshidagi Fundamental va Amaliy Tadqiqotlar instituti",
        rating:4,
        index:754,
    }
]

    return (
        <div className='container'>
            <div className="row">
                <div className="buttons">
             {test.map((eachcard,index) => (
                 <Link to="/TeachersDiogramm" className="neumorphic">
                    <div className='user_info'>    
                    <div className='reyting'>
                        <span className='fw-bolder '>{index+1}</span>
                        <p className=''>Rating</p>
                    </div>
                    <div className='btn_img'></div>
                    <div className='user_container'>
                        <h5 className='user_title '>{eachcard.name}</h5>
                        <p >{eachcard.universty}</p>
                     </div>
                    </div>
                    <div className='text-center'>
                        <span className='user_title'>{eachcard.index}</span>
                        <p className='user_title'>H-Index</p>
                    </div>
                    <div className='text-center'>
                        <span className='user_title '>{eachcard.index}</span>
                        <p className='user_title'>Publications</p>
                    </div>
                    <div className='text-center'>
                        <span className='user_title '>{eachcard.index}</span>
                        <p className='user_title'>Citations</p>
                    </div>
                    <div className='text-center'>
                        <span className='user_title '>{eachcard.index}</span>
                        <p className='user_title'>Citations</p>
                    </div>
                 </Link>
                        ))}
                </div>
            </div>

        </div>
    );
}

export default FakultetList;
import React from 'react';
import "../../style/fakultetListe.css"

function FakultetList(props) {

   
// File Name: /MyPractice/data.json
const test = [
    {

        id:1,
        name:"Akshit",
        universty:"TIQXMMI MTU qoshidagi Fundamental va Amaliy Tadqiqotlar instituti",
        rating:1,
        index:513,
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
    }
]


    return (
        <div className='container'>
            <div className="row">
                <div className="buttons">
                    {test.map((eachcard,index) => (
                 <button className="neumorphic">
                    <div className='user_info'>    
                    <div className='reyting'>
                        <span className='fw-bolder text-4xl text-white'>{eachcard.rating}</span>
                        <p className='text-white text-lg'>Rating</p>
                    </div>
                    <div className='btn_img'></div>
                    <div className='user_container'>
                        <h5 className='user_title text-white'>{eachcard.name}</h5>
                        <p className='text-white'>{eachcard.universty}</p>
                     </div>
                    </div>
                    <div className='text-center'>
                        <span className='fw-bolder text-4xl text-white'>{eachcard.index}</span>
                        <p className='text-white text-lg text-center'>H-Index</p>
                    </div>
                    <div className='text-center'>
                        <span className='fw-bolder text-4xl text-white'>{eachcard.index}</span>
                        <p className='text-white text-lg text-center'>Publications</p>
                    </div>
                    <div className='text-center'>
                        <span className='fw-bolder text-4xl text-white'>{eachcard.index}</span>
                        <p className='text-white text-lg text-center'>Citations</p>
                    </div>
                 </button>
                        ))}
                </div>
            </div>

        </div>
    );
}

export default FakultetList;
import React from 'react';
import Navbar from "../componenta/Navbar";
import Title from "../componenta/title";
import FakultetList from "../componenta/fakultet/fakultetList";


function KafedraStatic(props) {
    const fakulty = [
        {
            id:1,
            name:"Materiallar qarshiligi va mashina detallari",
            universty:"",
            index:4,
            link:"/teacher_info/"
        },
        {
            id:2,
            name:"Neft va gaz konlari geologiyasi va geofizikasi kafedrasi",
            universty:"",
            index:513,
            link:"/teacher_info/"
        },
        {
            id:3,
            name:"Nazariy mexanika va mashina va mexanizmlar nazariyasi",
            universty:"",
            index:765,
            link:"/teacher_info/"
        },
        {
            id:4,
            name:"Metallarga bosim bilan ishlov berish",
            universty:"",
            index:754,
            link:"/teacher_info/"
        },
        {

            id:5,
            name:"Energiya tejamkorligi va energetika auditi",
            universty:"",
            index:4,
            link:"/teacher_info/"
        },
        {
            id:6,
            name:"Tеxnоlоgik mаshinаlаr vа jihоzlаr",
            universty:"",
            index:513,
            link:"/teacher_info/"
        },
        {
            id:7,
            name:"Sanoat iqtisodiyoti va menejmenti kafedrasi",
            universty:"",
            index:765,
            link:"/teacher_info/"
        },
        {
            id:8,
            name:"Biotexnologiya kafedrasi",
            universty:"",
            index:754,
            link:"/teacher_info/"

        }
    ]
    return (
        <div>
            <Navbar/>
            <div className="container " style={{marginTop:"2%"}}>
                <div className="row">
                    <Title props={{title1:"O'qituvchilar reytingi",title2:"Kafedra bo'yicha reyting"}}/>
                    <FakultetList fakulty={fakulty}/>
                </div>
            </div>

        </div>
    );
}

export default KafedraStatic;
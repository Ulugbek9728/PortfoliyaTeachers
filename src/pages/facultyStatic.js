import React from 'react';
import Navbar from "../componenta/Navbar";
import KafedraAll from "../componenta/kafedraAll";
import FakultetList from "../componenta/fakultet/fakultetList";
import Title from "../componenta/title";
import Kaferdras from "../componenta/Kaferdras";

function FacultyStatic(props) {
    const fakulty = [
        {
            id:1,
            name:"Materiallar qarshiligi va mashina detallari",
            universty:"",
            index:4,
            link:"/kafedra/"
        },
        {
            id:2,
            name:"Neft va gaz konlari geologiyasi va geofizikasi kafedrasi",
            universty:"",
            index:513,
            link:"/kafedra/"
        },
        {
            id:3,
            name:"Nazariy mexanika va mashina va mexanizmlar nazariyasi",
            universty:"",
            index:765,
            link:"/kafedra/"
        },
        {
            id:4,
            name:"Metallarga bosim bilan ishlov berish",
            universty:"",
            index:754,
            link:"/kafedra/"
        },
        {

            id:5,
            name:"Energiya tejamkorligi va energetika auditi",
            universty:"",
            index:4,
            link:"/kafedra/"
        },
        {
            id:6,
            name:"Tеxnоlоgik mаshinаlаr vа jihоzlаr",
            universty:"",
            index:513,
            link:"/kafedra/"
        },
        {
            id:7,
            name:"Sanoat iqtisodiyoti va menejmenti kafedrasi",
            universty:"",
            index:765,
            link:"/kafedra/"
        },
        {
            id:8,
            name:"Biotexnologiya kafedrasi",
            universty:"",
            index:754,
            link:"/kafedra/"

        }
    ]

    return (
        <div>
            <Navbar/>
            <div className="container" style={{marginTop:"2%"}}>
                <div className="row">
                    <Title props={{title1:"Bizning kafedralar",title2:"Fakultet bo'yicha reyting"}}/>
                    <FakultetList fakulty={fakulty}/>
                    <Kaferdras/>
                </div>
            </div>



        </div>
    );
}

export default FacultyStatic;
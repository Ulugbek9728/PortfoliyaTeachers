import React from 'react';
import Navbar from "../componenta/Navbar";
import Title from "../componenta/title";
import FakultetList from "../componenta/fakultet/fakultetList";
import Facultys from "../componenta/Facultys";

function UniversitetStatic(props) {
    const fakulty = [
        {
            id:1,
            name:"Elektr energetika fakulteti",
            universty:"",
            index:4,
            link:"/faculties/"
        },
        {
            id:2,
            name:"Muhandislik texnologiyalari fakulteti",
            universty:"",
            index:513,
            link:"/faculties/"
        },
        {
            id:3,
            name:"Geologiya-qidiruv va kon-metallurgiya fakulteti",
            universty:"",
            index:765,
            link:"/faculties/"
        },
        {
            id:4,
            name:"Neft va gaz fakulteti",
            universty:"",
            index:754,
            link:"/faculties/"
        },
        {

            id:5,
            name:"Issiqlik Energetikasi Fakulteti",
            universty:"",
            index:4,
            link:"/faculties/"
        },
        {
            id:6,
            name:"Mashinasozlik Fakulteti",
            universty:"",
            index:513,
            link:"/faculties/"
        },
        {
            id:7,
            name:"Elektronika va Avtomatika Fakulteti",
            universty:"",
            index:765,
            link:"/faculties/"
        },
        {
            id:8,
            name:"Mexanika Fakulteti",
            universty:"",
            index:754,
            link:"/faculties/"

        }
    ]
    return (
        <div>
            <Navbar/>
            <div className="container" style={{marginTop:"10%"}}>
                <div className="row" >
                    <Title
                        props={{title1: "Bizning fakultetlar", title2: "Universitet bo'yicha fakultetlar reytingi"}}/>
                    <FakultetList fakulty={fakulty}/>

                    <Facultys/>
                </div>
            </div>

        </div>
    );
}

export default UniversitetStatic;
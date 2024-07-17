import React, {useEffect, useState} from 'react';
import {useNavigate, useSearchParams} from "react-router-dom";
import axios from "axios";
import {ApiName} from "../api/APIname";
import {toast} from "react-toastify";
import Loading from "../componenta/loading";
import Navbar from "../componenta/Navbar";

function Auth(props) {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [message, setMessage] = useState('');
    const [sucsessText, setSucsessText] = useState('');

    const [loading, setLoading] = useState(false);
    const [login, setLogin] = useState(false);


    window.onload = function() {
            setLoading(true)
            axios.get(`${ApiName}/api/auth/login`, {
                params: {
                    code: searchParams.get('code'),
                    state: searchParams.get('state')
                }
            }).then((response) => {
                if (response.data.isSuccess === true) {
                    setLoading(false)
                    setLogin(true)
                    localStorage.setItem("myInfo", JSON.stringify(response.data.data));
                    navigate('/profile')
                }
                else {
                    setLoading(false)
                    setMessage(response.data.message)
                }
            }).catch((error) => {
                console.log(error);
                setLoading(false)
                // navigate("/")
                setMessage("Loginda xato")
    
            })
        
        };

    

    useEffect(() => {
        setMessage('')
        setSucsessText('')
        notify();
    }, [message, sucsessText,]);

    function notify() {
        if (sucsessText !== '') {
            toast.success(sucsessText)
        }
        if (message !== '') {
            toast.error(message)
        }
    }

    return (
        <>
            {loading===true ? <Loading/> :  <div>
                <div className="container-fluid">
                    <div className="row mt-5 d-flex align-items-center justify-content-center">
                        <Navbar/>
                        <img style={{width:'40%', marginTop:'3%'}} src="./404error1.svg" alt=""/>
                    </div>

                </div>
            </div>}
        </>

    );
}

export default Auth;
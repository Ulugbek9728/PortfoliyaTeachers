import React, {useEffect, useState} from 'react';
import {useNavigate, useSearchParams} from "react-router-dom";

import {toast} from "react-toastify";
import Loading from "../componenta/loading";
import Navbar from "../componenta/Navbar";
import {useQuery} from "react-query"
import {getLogin} from "../api/general";

function Auth(props) {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [message, setMessage] = useState('');

    const {isLoading} = useQuery({
            queryKey: ["login"],
            queryFn: () => {
                getLogin(searchParams.get('code'), searchParams.get('state'))
                    .then((response) => {
                        if (response?.data?.isSuccess === true) {
                            localStorage.setItem("myInfo", JSON.stringify(response.data.data));

                            if (response?.data?.data?.currentRole === "ROLE_ADMIN") {
                                navigate('/dashboard-admin/1')
                            }
                            if (response?.data?.data?.currentRole === "ROLE_TEACHER") {
                                navigate('/profile/1')
                            }

                            if (response?.data?.data?.currentRole === "ROLE_FACULTY") {
                                navigate('/dashboard-fakultyadm/1')
                            } else {
                                // navigate('/profile/1')
                            }


                        } else {
                            setMessage(response?.data?.message)
                        }
                    })
            },
        }
    );


    useEffect(() => {
        setMessage('')
        notify();
    }, [message,]);

    function notify() {
        if (message !== '') {
            toast.error(message)
        }
    }

    return (
        <>
            {isLoading === true ? <Loading/> : <div>
                <div className="container-fluid">
                    <div className="row d-flex align-items-center justify-content-center">
                        <Navbar/>
                        {/*<img style={{width: '40%', marginTop: '3%'}} src="./404error1.svg" alt=""/>*/}
                    </div>
                </div>
            </div>}
        </>

    );
}

export default Auth;
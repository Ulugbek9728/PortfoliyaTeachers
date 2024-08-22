import React, {useEffect} from 'react';
import {Link, useNavigate} from "react-router-dom";
import LanguageSwitcher from "./LanguageSwitcher";
import {useTranslation} from "react-i18next";
import {CaretDownOutlined, UserOutlined, LogoutOutlined} from '@ant-design/icons';
import {Avatar, Dropdown, Menu, notification, Space} from 'antd';
import * as PropTypes from "prop-types";
import {useMutation} from "react-query"
import {ChangeRole} from "../api/general";


LogoutOutlined.propTypes = {className: PropTypes.string};

function Navbar(props) {
    const navigate = useNavigate();

    const {t} = useTranslation();
    const fulInfo = JSON.parse(localStorage.getItem("myInfo"));

    const items = [
        {
            label: (
                <Link to="/university">
                    Universitet bo'yicha Fakultetlar reytingi
                </Link>
            ),
            key: '1',
        },
        {
            label: (
                <Link to="/faculties">
                    Universitet bo'yicha kafedralar reytingi
                </Link>
            ),
            key: '2',
        },
        {
            label: (
                <Link to="/kafedra">
                    Universitet bo'yicha o'qituvchilar reytingi
                </Link>
            ),
            key: '3',
        },
    ];

    function LogOut() {
        openNewWindow(); // Yangi oynani ochish
        setTimeout(closeWindow, 100); // 0.1 sekunddan so'ng oynani yopish
        localStorage.removeItem("myInfo");
    }

    let newWindow;

    function openNewWindow() {
        newWindow = window.open('https://hemis.tdtu.uz/dashboard/logout', '_blank');

    }

    function closeWindow() {
        newWindow.close(); // Yangi oynani yopish
        navigate("/")
    }

    const changeRoles = useMutation({
        mutationFn: (e) => ChangeRole(e).then((res) => {
            notification.success({
                message: "role o'zgardi"
            })
            let value
            value = {
                ...fulInfo,
                currentRole: e,
                accessToken: res?.data?.data?.accessToken
            }
            localStorage.setItem("myInfo", JSON.stringify(value));
            if (e === 'ROLE_TEACHER') {
                navigate('/profile/1')
            } else if (e === 'ROLE_FACULTY') {
                navigate('/pertfolia_fakultyadm/1')
            } else if (e === 'ROLE_ADMIN') {
                navigate('/pertfolia_admin/1')
            }
        }),
        onError: () => {
            notification.error({
                message: "fakultet eror",
                duration: 1,
                placement: 'top'
            })
        }
    })

    const getProfileDropdownItems = () => {
        let res = [{
            label: fulInfo?.fullName,
            key: fulInfo?.fullName,
        }]
        fulInfo
            ?.roles
            ?.map(role => (
                {
                    label: role,
                    key: role,
                    onClick: (e) => {
                        fulInfo.currentRole !== e.key && changeRoles.mutate(e.key)
                    }
                }
            ))?.forEach(role => res.push(role))
        res
            .push(
                {
                    label: (
                        <a
                            style={{height: 40, alignItems: "center", display: "flex"}}
                            className='dropdown-item'
                            onClick={LogOut}
                            href="#">
                            PLATFORMADAN CHIQISH <LogoutOutlined className='mx-4'/>
                        </a>
                    ),
                    key: 'exit',
                }
            )
        return (
            <Menu
                selectedKeys={fulInfo?.roles?.filter(role => fulInfo?.currentRole === role)}
                items={res}

            >
            </Menu>
        )
    }

    return (
        <div className="p-0" style={{width: "100%"}}>
            <div className="container-fluid bg-dark px-5 d-none d-lg-block">
                <div className="row gx-0">
                    <div className="col-lg-8 text-center text-lg-start mb-2 mb-lg-0">
                        <div className="d-inline-flex align-items-center" style={{height: "45px"}}>
                            <small className="me-3 text-light"><i className="fa fa-map-marker-alt me-2"></i>Toshkent
                                shahri, Universitet ko`chasi 2-uy</small>
                            <small className="me-3 text-light"><i className="fa fa-phone-alt me-2"></i>+998 71 207 07 32</small>
                            <small className="text-light"><i className="fa fa-envelope-open me-2"></i>https://webmail.tdtu.uz/</small>
                        </div>
                    </div>
                    <div className="col-lg-4 text-center text-lg-end">
                        <div className="d-inline-flex align-items-center" style={{height: "45px"}}>
                            <a className="btn btn-sm btn-outline-light btn-sm-square rounded-circle me-2" href=""><i
                                className="fab fa-twitter fw-normal"></i></a>
                            <a className="btn btn-sm btn-outline-light btn-sm-square rounded-circle me-2" href=""><i
                                className="fab fa-facebook-f fw-normal"></i></a>
                            <a className="btn btn-sm btn-outline-light btn-sm-square rounded-circle me-2" href=""><i
                                className="fab fa-linkedin-in fw-normal"></i></a>
                            <a className="btn btn-sm btn-outline-light btn-sm-square rounded-circle me-2" href=""><i
                                className="fab fa-instagram fw-normal"></i></a>
                            <a className="btn btn-sm btn-outline-light btn-sm-square rounded-circle" href=""><i
                                className="fab fa-youtube fw-normal"></i></a>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container-fluid position-relative p-0">
                <nav className="navbar navbar-expand-lg  navbar-dark px-5 py-3 py-lg-0">
                    <Link to="/" className="navbar-brand p-0">
                        <h1 className="d-flex align-items-center w-100">
                            <i className="fa fa-user-tie me-2"></i>
                            <img src="" alt=""/>
                        </h1>
                    </Link>
                    <div className='d-flex gap-3'>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                                data-bs-target="#navbarCollapse1">
                            <span className="fa fa-bars"></span>
                        </button>
                        <div className="d-lg-none">
                            <LanguageSwitcher/>
                        </div>
                    </div>

                    <div className="collapse navbar-collapse" id="navbarCollapse1">
                        <div className="navbar-nav ms-auto py-0 align-items-center">
                            <a href="#" className="nav-item nav-link">Home</a>
                            <Dropdown menu={{items}}>
                                <a className='nav-item nav-link' onClick={(e) => e.preventDefault()}>
                                    <Space style={{cursor: "pointer"}}>
                                        TDTU ichki reytinglari
                                        <CaretDownOutlined/>
                                    </Space>
                                </a>
                            </Dropdown>
                            {/*/!*${ApiName}*!/  http://localhost:3000/*/}
                            {/*/!*${ApiName}*!/  http://portfolio.uplink.uz/*/}

                            {fulInfo === null ?
                                <a href={`https://hemis.tdtu.uz/oauth/authorize?response_type=code&client_id=5&state=auth_state&redirect_uri=http://localhost:3000/auth`}
                                   className="nav-item nav-link">
                                    Hemis orqali kirish
                                    <i className="fa-solid fa-right-to-bracket mx-2"></i>
                                </a> :
                                <Dropdown overlay={getProfileDropdownItems} placement="bottomRight">
                                    <Avatar size={40} icon={<UserOutlined/>}
                                            className="btn btn-primary dropdown-toggle p-0"
                                            type="button" id="dropdownMenuButton" data-toggle="dropdown"
                                            aria-haspopup="true" aria-expanded="false"/>
                                </Dropdown>
                                // <div className="dropleft">
                                //
                                //         {
                                //             fulInfo?.roles.map((item, index) => (
                                //                 <span key={index} style={{height: 40, alignItems: "center", display: "flex", cursor: "pointer"}}
                                //                       onClick={() => {
                                //                           changeRoles.mutate(item)
                                //                           console.log(item)
                                //                       }}
                                //                       className={`dropdown-item ${item===fulInfo.currentRole ? 'bg-primary disabled text-white': ''}`}>
                                //
                                //         {item === "ROLE_TEACHER" ? "O'qituvchi" : item === 'ROLE_ADMIN' ? 'ADMIN' : item === 'ROLE_FACULTY' ? "Fakultet" : ""}
                                //     </span>
                                //             ))
                                //         }
                                //
                                //         <a style={{height: 40, alignItems: "center", display: "flex"}}
                                //            className='dropdown-item' onClick={LogOut}
                                //            href="#">PLATFORMADAN CHIQISH <LogoutOutlined className='mx-4'/></a>
                                //
                                //     </div>
                                //
                                // </div>
                            }


                        </div>

                    </div>
                    <div className="d-lg-block d-none mx-3">
                        <LanguageSwitcher/>
                    </div>

                </nav>
            </div>
        </div>
    );
}

export default Navbar;
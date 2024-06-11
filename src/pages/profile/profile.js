import React from 'react';
import TeacherRating from "../../componenta/TeacherRating/TeacherRating";
import {UserOutlined,} from '@ant-design/icons';
import {NavLink, Route, Routes,} from "react-router-dom";
import "./profile.scss"

import {Layout, Menu, theme} from 'antd';
import {useNavigate, useParams} from "react-router-dom";
import Navbar from "../componenta/Navbar";
import Form from "../componenta/Form/Form";
import Form2 from "../componenta/Form2/Form2";

const {Content, Sider} = Layout;

const items = [
    {
        label: "Profile",
        key: '1',
        icon: <UserOutlined/>,
        access: ['ROLE_DEPARTMENT']
    },
    {
        label: "Menu 2",
        key: "2",
        icon: <UserOutlined/>,
        access: ['ROLE_DEPARTMENT']
    },
    {
        label: "Menu 3",
        key: "3",
        icon: <UserOutlined/>,
        access: ['ROLE_DEPARTMENT']
    },

];

function Profile(props) {

    return (
        <div>
            <Navbar/>
            <Layout hasSider>
                <Sider style={{
                    overflow: 'auto',
                    height: '100vh',
                    zIndex: 1,
                    position: 'fixed',
                    left: 0,
                    top: '140px',
                    bottom: 0,
                }}>
                    <div className='verticalMenu'>
                        {items.map((i, index)=>{
                                return<NavLink key={index} to={`${i.key}`}>
                                    <span>{i.icon}</span>
                                    <span className='mx-2'>{i.label}</span>
                                </NavLink>
                            })
                        }
                    </div>
                </Sider>
                <Layout>
                    <Content style={{
                        width: "90%",
                        position: "relative",
                        zIndex: 0,
                        right: "-10%",
                        top: "145px",
                        overflow: 'initial',
                        background: "#e5e9f4"
                    }}>
                        <Routes>
                            <Route path={"/1"} element={ <TeacherRating/>}/>
                        </Routes>

                       {/*<Form/>*/}
                        <Form2/>
                    </Content>
                </Layout>
            </Layout>


        </div>
    );
}

export default Profile;
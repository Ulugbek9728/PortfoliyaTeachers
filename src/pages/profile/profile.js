import React from 'react';
import TeacherRating from "../../componenta/TeacherRating/TeacherRating";
import {UserOutlined,FileTextOutlined} from '@ant-design/icons';
import {NavLink, Route, Routes,} from "react-router-dom";
import "./profile.scss"

import {Layout} from 'antd';
import Navbar from "../../componenta/Navbar";
import IlmiyNashrlar from "../ilmiy nashrlar/ilmiyNashrlar";

const {Content, Sider} = Layout;

const items = [
    {
        label: "Profile",
        key: '1',
        icon: <UserOutlined/>,
        access: ['ROLE_DEPARTMENT']
    },
    {
        label: "Ilmiy nashrlar",
        key: "2",
        icon: <FileTextOutlined />,
        access: ['ROLE_DEPARTMENT']
    },
    {
        label: "Uslubiy nashrlar",
        key: "3",
        icon: <FileTextOutlined/>,
        access: ['ROLE_DEPARTMENT']
    },
    {
        label: "Intelektual mulk agentligi tomonidan berilgan ishlar",
        key: "4",
        icon: <FileTextOutlined/>,
        access: ['ROLE_DEPARTMENT']
    },
    {
        label: "Ilmiy faollik",
        key: "5",
        icon: <FileTextOutlined/>,
        access: ['ROLE_DEPARTMENT']
    },

];

function Profile(props) {

    return (
        <div>
            <Navbar/>
            <Layout hasSider>
                <Sider style={{overflow: 'auto', height: '84.5vh',
                    // zIndex: 1, position: 'fixed', left: 0,
                    // top: '140px', bottom: 0,
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
                        width: "100%", overflow: 'initial', background: "#e5e9f4"
                    }}>
                        <Routes>
                            <Route path={"/1"} element={ <TeacherRating/>}/>
                            <Route path={"/2"} element={ <IlmiyNashrlar/>}/>
                        </Routes>
                    </Content>
                </Layout>
            </Layout>


        </div>
    );
}

export default Profile;
import React, {useState} from 'react';
import {FileTextOutlined, UserOutlined,} from '@ant-design/icons';
import { Layout,} from 'antd';
import Navbar from "../../componenta/Navbar";
import {NavLink, Route, Routes} from "react-router-dom";
import AddKafedra from "./addKafedra";

const { Sider, Content} = Layout;

const items = [
    {
        label: "Kafedra mudirini qo'shish",
        key: '1',
        icon: <UserOutlined/>,
    },
    {
        label: "Ilmiy nashirlar",
        key: "2",
        icon: <FileTextOutlined />,
    },
    {
        label: "Uslubiy nashirlar",
        key: "3",
        icon: <FileTextOutlined/>,
    },
    {
        label: "Intelektual mulk agentligi tomonidan berilgan ishlar",
        key: "4",
        icon: <FileTextOutlined/>,
    },
    {
        label: "Ilmiy saloxiyatni oshirishdagi hissasi",
        key: "5",
        icon: <FileTextOutlined/>,
    },
];
function Fakulty(props) {
    return (
        <>
            <Navbar/>
            <Layout hasSider>
                <Sider style={{overflow: 'auto', height: '84.5vh',}}>
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
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: "89vh",
                    }}
                    >
                        <Routes>
                            <Route path={"/1"} element={ <AddKafedra/>}/>
                            <Route path={"/2"} element={ <AddKafedra/>}/>
                            <Route path={"/3"} element={ <AddKafedra/>}/>
                            <Route path={"/4"} element={ <AddKafedra/>}/>
                            <Route path={"/5"} element={ <AddKafedra/>}/>
                        </Routes>
                    </Content>
                </Layout>
            </Layout>
        </>
    );
}

export default Fakulty;
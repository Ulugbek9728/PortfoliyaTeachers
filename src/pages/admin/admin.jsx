import React, {useState} from 'react';
import {FileTextOutlined, UserOutlined,} from '@ant-design/icons';
import { Layout,} from 'antd';
import Navbar from "../../componenta/Navbar";
import {NavLink} from "react-router-dom";

const { Sider, Content} = Layout;

const items = [
    {
        label: "Bo'lim qo'shish",
        key: '1',
        icon: <UserOutlined/>,
    },
    {
        label: "menu 1",
        key: "2",
        icon: <FileTextOutlined />,
    },
    {
        label: "menu 2",
        key: "3",
        icon: <FileTextOutlined/>,
    },
    {
        label: "menu 3",
        key: "4",
        icon: <FileTextOutlined/>,
    },
    {
        label: "menu 4",
        key: "5",
        icon: <FileTextOutlined/>,
    },
    {
        label: "menu 5",
        key: "6",
        icon: <FileTextOutlined/>,
    },

];
function Admin(props) {

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
                    <Content
                        style={{
                            margin: '24px 16px',
                            padding: 24,
                            minHeight: "89vh",
                        }}
                    >
                        Content
                    </Content>
                </Layout>
            </Layout>
        </>
    );
}

export default Admin;
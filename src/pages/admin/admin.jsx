import React, {useState} from 'react';
import {FileTextOutlined, UserOutlined,} from '@ant-design/icons';
import { Layout,} from 'antd';
import Navbar from "../../componenta/Navbar";
import {NavLink, Route, Routes} from "react-router-dom";
import AddFakulty from "./addFakulty";
import AdminIlmiyNashirlar from "./admin_ilmiyNashirlar";

const { Sider, Content} = Layout;

const items = [
    {
        label: "Fakultet dekanini qo'shish",
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
                    <Content style={{
                            margin: '24px 16px',
                            padding: 24,
                            minHeight: "89vh",
                        }}
                    >
                        <Routes>
                            <Route path={"/1"} element={ <AddFakulty/>}/>
                            <Route path={"/2/*"} element={ <AdminIlmiyNashirlar/>}/>
                            {/*<Route path={"/3"} element={ <UslubiyNashrlar/>}/>*/}
                            {/*<Route path={"/4"} element={ <InteliktualMulk/>}/>*/}
                            {/*<Route path={"/5"} element={ <IlmiySaloxiyati/>}/>*/}
                        </Routes>
                    </Content>
                </Layout>
            </Layout>
        </>
    );
}

export default Admin;
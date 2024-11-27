import React from 'react';
import {FileTextOutlined, UserOutlined,} from '@ant-design/icons';
import { Layout,} from 'antd';
import Navbar from "../../componenta/Navbar";
import {NavLink, Route, Routes} from "react-router-dom";
import AddFakulty from "./addFakulty";
import AdminIlmiyNashirlar from "./admin_ilmiyNashirlar";
import AddDepartment from "./AddDepartment";
import AdminUslubiyNashir from "./adminUslubiyNashir";
import AdminIntelektualMulk from "./adminIntelektualMulk";
import AdminIlmiySaloxiyat from "./adminIlmiySaloxiyat";
import "../../style/admin.scss"
import TeachersTable from './TeachersTable';
import TeachersInfo from './TeachersInfo';

const { Sider, Content} = Layout;

const items = [
    {
        label: "Fakultet dekanini qo'shish",
        key: '1',
        icon: <UserOutlined/>,
    },
    {
        label: "Bo'lim qo'shish",
        key: '2',
        icon: <UserOutlined/>,
    },
    {
        label: "O`qtuvchilar royxati",
        key: '3',
        icon: <UserOutlined/>,
    },
    {
        label: "Ilmiy nashirlar",
        key: "4",
        icon: <FileTextOutlined />,
    },
    {
        label: "Uslubiy nashirlar",
        key: "5",
        icon: <FileTextOutlined/>,
    },
    {
        label: "Intelektual mulk agentligi tomonidan berilgan ishlar",
        key: "6",
        icon: <FileTextOutlined/>,
    },
    {
        label: "Ilmiy saloxiyatni oshirishdagi hissasi",
        key: "7",
        icon: <FileTextOutlined/>,
    },
];
function Admin(props) {
    return (
        <>
            <Navbar/>
            <Layout hasSider>
                <Sider style={{overflow: 'auto', height: '100vh',position: "sticky", top: 0}}>
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
                            <Route path={"/2"} element={ <AddDepartment/>}/>
                            <Route path={"/3"} element={ <TeachersTable/>}/>
                            <Route path={"/4/*"} element={ <AdminIlmiyNashirlar/>}/>
                            <Route path={"/5/*"} element={ <AdminUslubiyNashir/>}/>
                            <Route path={"/6/*"} element={ <AdminIntelektualMulk/>}/>
                            <Route path={"/7/*"} element={ <AdminIlmiySaloxiyat/>}/>
                        </Routes>
                    </Content>
                </Layout>
            </Layout>
        </>
    );
}

export default Admin;
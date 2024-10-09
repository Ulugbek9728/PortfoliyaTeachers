import React from 'react';
import {FileTextOutlined, UserOutlined,} from '@ant-design/icons';
import { Layout,} from 'antd';
import Navbar from "../../componenta/Navbar";
import {NavLink, Route, Routes} from "react-router-dom";
import Dekan_IlmiyNashrlar from './dekan_IlmiyNashrlar';
import Sider from 'antd/es/layout/Sider';
import { Content } from 'antd/es/layout/layout';
import Dekan_UslubiyNashrlar from './dekan_UslubiyNashrlar';
import Dekan_IntelectualMulk from './dekan_IntelectualMulk';
import DekanIlmiySaloxiyat from './dekan_IlmiySaloxiyat';
import Dekan_teachersList from './dekan_teachersList';
const Dekan = () => {
    const items = [
        {
            label: "O`qtuvchilar royxati",
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
                    <Route path={"/1"} element={ <Dekan_teachersList/>}/>
                    <Route path={"/2/*"} element={ <Dekan_IlmiyNashrlar/>}/>
                    <Route path={"/3/*"} element={ <Dekan_UslubiyNashrlar/>}/>
                    <Route path={"/4/*"} element={ <Dekan_IntelectualMulk/>}/>
                    <Route path={"/5/*"} element={ <DekanIlmiySaloxiyat/>}/>
                </Routes>
            </Content>
        </Layout>
    </Layout>
</>
  )
}

export default Dekan
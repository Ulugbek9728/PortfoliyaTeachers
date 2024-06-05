import React from 'react';
import TeacherRating from "../componenta/TeacherRating/TeacherRating";
import Navbar from "../componenta/Navbar";
import {UserOutlined,} from '@ant-design/icons';
import {Layout, Menu, theme} from 'antd';
import {useNavigate, useParams} from "react-router-dom";

const {Content, Sider} = Layout;

const items = [
    {
        label: "Menu 1",
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
    const navigate = useNavigate();

    const {
        token: {colorBgContainer, borderRadiusLG},
    } = theme.useToken();
    const params = useParams()
    console.log(params)

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
                    <div className="demo-logo-vertical"/>
                    <Menu theme="dark" style={{background: "#091e3e", textColor: "white",}} mode="inline"

                          defaultSelectedKeys={params.id} items={items}
                          onClick={(id) => {
                              if (id.key === '1') {
                                  navigate("/profile/1")
                              } else if (id.key==='2'){
                                  navigate("/profile/2")}
                              else if (id.key==='3'){
                                  navigate("/profile/3")}

                          }}/>
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
                        <TeacherRating/>
                    </Content>
                </Layout>
            </Layout>


        </div>
    );
}

export default Profile;
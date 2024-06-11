import React from 'react';
import {UserOutlined,} from '@ant-design/icons';
import {Layout, Menu, theme} from 'antd';
import {useNavigate, useParams} from "react-router-dom";
import Navbar from "../componenta/Navbar";
import Form from "../componenta/Form/Form";
import Form2 from "../componenta/Form2/Form2";

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
                        width: "80%" ,
                        position: "relative",
                        zIndex: 0,
                        right: "-15%",
                        paddingTop: "200px",
                        overflow: 'initial',
                        background: "#e5e9f4"
                    }}>
                       {/*<Form/>*/}
                        <Form2/>
                    </Content>
                </Layout>
            </Layout>


        </div>
    );
}

export default Profile;
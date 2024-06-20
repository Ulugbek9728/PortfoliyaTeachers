import React, {useState, useRef} from 'react';
import {
    Space, Table, Select, Modal, Upload, Button, Steps, Skeleton,
    message, Empty, Drawer, Form, DatePicker, Popconfirm, Input
} from 'antd';
import "./ilmiyNashrlar.scss"


function IlmiyNashrlar(props) {
    const formRef = useRef(null);
    const [form] = Form.useForm();
    const [DateListe, setDateListe] = useState(['', '']);


    const onChangeDate = (value, dateString) => {
        setDateListe(dateString)
    };
    const onChange = () => {
        // const departmentID = fulInfo.roles[0] === "ROLE_OPERATOR" ? 7777 : fulInfo.department.id
        // axios.get(`${ApiName}/api/application/get-as-excel`, {
        //     headers: {"Authorization": `Bearer ${fulInfo?.accessToken}`},
        //     params: {
        //         from: DateListe[0], to: DateListe[1], departmentId: departmentID, isCome: false
        //     },
        //     responseType: 'blob'
        // }).then((response) => {
        //     const link = document.createElement('a');
        //     const blob = new Blob([response.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
        //     const url = URL.createObjectURL(blob);
        //
        //     link.href = url;
        //     link.setAttribute('download', `arizalar_${DateListe[0]}_${DateListe[1]}.xlsx`);
        //     document.body.appendChild(link);
        //     link.click();
        // }).catch((error) => {
        //     console.log(error)
        // });
    };
    const columns = [
        {
            title: '№',
            width: 50,
            render: (item, record, index) => (<>{index + 1}</>)
        },
        {
            title: 'Ilmiy ish nomi',
            dataIndex: 'name',
            width: 350,
        },
        {
            title: 'Mualliflar',
            dataIndex: 'age',
            width: 200,
        },
        {
            title: 'Nashr yili',
            dataIndex: 'address',
            width: 150
        },
        {
            title: 'Ilmiy nashr turi',
            dataIndex: 'address',
            width: 150
        },
        {
            title: 'Xodim',
            dataIndex: 'address',
            width: 150
        },
        {
            title: 'Tekshirish',
            dataIndex: 'address',
            width: 100
        },
        {
            title: "So'rov Faol",
            dataIndex: 'address',
            width: 150
        },
    ];
    const data = [];
    for (let i = 0; i < 100; i++) {
        data.push({
            key: i,
            name: `Edward King ${i}`,
            age: 32,
            address: `London, Park Lane no. ${i}`,
        });
    }

    return (
        <div className='p-4'>
            <div className=' d-flex  align-items-center justify-content-between'>
                <Form form={form} layout="vertical" ref={formRef} colon={false}
                      onFinish={onChange}
                      className=' d-flex align-items-center gap-4'
                >
                    <Form.Item label="Mudatini belgilang"
                               name="MurojatYuklash"
                               >
                        <DatePicker.RangePicker
                            // placeholder={["Bosh sana", 'Tugash sana']}
                            name="MurojatYuklash" format="YYYY-MM-DD" onChange={onChangeDate}/>
                    </Form.Item>
                    <Form.Item label="Ilmiy nashr nomi" name="MurojatYuklash">
                        <Input style={{width: '500px'}} placeholder="Nom bo'yicha qidirish"/>
                    </Form.Item>
                    <Form.Item>
                        <button className="btn btn-success mt-4" type="submit">
                            <span className="button__text">Ma'lumotni izlash</span>
                        </button>
                    </Form.Item>

                </Form>

                <button type="button" className="button1"
                    // onClick={() => {
                    //     setOpen(true)
                    // }}
                >
                    <span className="button__text">Ilmiy nashr yaratish</span>
                    <span className="button__icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" viewBox="0 0 24 24" strokeWidth="2"
                             strokeLinejoin="round" strokeLinecap="round" stroke="currentColor" height="24"
                             fill="none" className="svg">
                            <line y2="19" y1="5" x2="12" x1="12"/>
                            <line y2="12" y1="12" x2="19" x1="5"/>
                        </svg>
                    </span>
                </button>

            </div>
            <Table
                columns={columns}
                dataSource={data}
                pagination={{
                    pageSize: 50,
                }}
                scroll={{
                    y: 660,
                }}
            />
        </div>
    );
}

export default IlmiyNashrlar;
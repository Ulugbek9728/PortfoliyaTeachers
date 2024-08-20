import React, {useEffect, useRef, useState} from 'react';
import {DatePicker, Form, Input, Select} from "antd";
import {SearchOutlined} from "@ant-design/icons";
import axios from "axios";
import {ApiName} from "../../api/APIname";

function AdminIlmiyNashirlar(props) {
    const fulInfo = JSON.parse(localStorage.getItem("myInfo"));

    const formRef = useRef(null);
    const [form] = Form.useForm();
    const [DateListe, setDateListe] = useState(['', '']);
    const [Scientificpublication, setScientificpublication] = useState([]);
    const [srcItem, setSrcItem] = useState({});
    const [Getfakultet, setGetFakultet] = useState([]);


    useEffect(() => {
        ClassifairGet()
    }, []);
    function ClassifairGet() {
        axios.get(`${ApiName}/api/classifier`, {
            params: {
                key: 'h_scientific_publication_type'
            },
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${fulInfo?.accessToken}`
            }
        })
            .then(response => {
                setScientificpublication(response.data);
            })
            .catch(error => {
                console.log(error, 'error');
            });
    }

    const onChangeDate = (value, dateString) => {
        setDateListe(dateString);
    };



    return (
        <div>
            <Form form={form} layout="vertical" ref={formRef} colon={false}
                  // onFinish={() => getIlmiyNashir()}
                  className='d-flex align-items-center gap-4'
            >
                <Form.Item label="Mudatini belgilang" name="srcDate">
                    <DatePicker.RangePicker size="large" style={{width: 250,}} name="srcDate" format="YYYY-MM-DD" onChange={onChangeDate}/>
                </Form.Item>
                <Form.Item
                    name="facultyId"
                    rules={[
                        {
                            required: true,
                            message: 'Fakultetni tanlang'
                        }
                    ]}
                    label="Fakultetni tanlang"
                >
                    <Select style={{width: 250,}}
                        name={"facultyId"}
                        // onChange={}
                        placeholder='Facultet'
                        options={Getfakultet.map((item, index) => (
                            {value: item.id, label: item.name}
                        ))}
                    />

                </Form.Item>
                <Form.Item
                    name="kafedraId"
                    rules={[
                        {
                            required: true,
                            message: 'Kafedrani tanlang'
                        }
                    ]}
                    label="Kafedrani tanlang"
                >
                    <Select style={{width: 250,}}
                        name={"facultyId"}
                        // onChange={}
                        placeholder='Kafedrani'
                        options={Getfakultet.map((item, index) => (
                            {value: item.id, label: item.name}
                        ))}
                    />

                </Form.Item>

                <Form.Item label="Ilmiy nashr turi" name="srcType">
                    <Select name="srcType" labelInValue style={{width: 250,}} placeholder='Ilmiy nashr turi'
                            options={Scientificpublication[0]?.options?.map(item => ({
                                label: item.name,
                                value: item.code
                            }))}
                            onChange={(value, option) => setSrcItem({...srcItem, srcType: option.value})}
                    />
                </Form.Item>
                <Form.Item label=' '>
                    <button className="btn btn-success " type="submit">
                        <span className="button__text"><SearchOutlined /></span>
                    </button>
                </Form.Item>
            </Form>
            AdminIlmiyNashirlar
        </div>
    );
}

export default AdminIlmiyNashirlar;
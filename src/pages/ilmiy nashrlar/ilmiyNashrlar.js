import React, { useState, useRef, useEffect } from 'react';
import { Space, Table, Modal, Button, Form, DatePicker, Input, Switch, message } from 'antd';
import "./ilmiyNashrlar.scss";
import FormModal from '../../componenta/Modal/FormModal';
import axios from "axios";
import { ApiName } from "../../api/APIname";

function IlmiyNashrlar(props) {
    const fulInfo = JSON.parse(localStorage.getItem("myInfo"));
    const formRef = useRef(null);
    const [form] = Form.useForm();
    const [DateListe, setDateListe] = useState(['', '']);
    const [open, setOpen] = useState(false);
    const [dataList, setDataList] = useState([]);
    const [editingData, setEditingData] = useState(null);

    const onChangeDate = (value, dateString) => {
        setDateListe(dateString);
    };

    const onChange = () => {
        // const departmentID = fulInfo.roles[0] === "ROLE_OPERATOR" ? 7777 : fulInfo.department.id
        // axios.get(${ApiName}/api/application/get-as-excel, {
        //     headers: {"Authorization": Bearer ${fulInfo?.accessToken}},
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
        //     link.setAttribute('download', arizalar_${DateListe[0]}_${DateListe[1]}.xlsx);
        //     document.body.appendChild(link);
        //     link.click();
        // }).catch((error) => {
        //     console.log(error)
        // });
    };

    const toggleActiveStatus = (record) => {
        const newStatus = record.publicationStatus === "ACTIVE" ? "NOT_ACTIVE" : "ACTIVE";
        console.log(`Switching status for record id ${record.id} to ${newStatus}`);
        
        const requestData = { id: record.id, publicationStatus: newStatus };
        console.log('Request data:', requestData);

        axios.put(`${ApiName}/api/publication/update_status`, requestData, {
            headers: {
                Authorization: `Bearer ${fulInfo?.accessToken}`,
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            console.log('API response:', response.data);

            const updatedItem = response.data;
            setDataList(dataList.map(item => item.id === record.id ? { ...item, publicationStatus: updatedItem.publicationStatus } : item));
            message.success('Publication status updated successfully');
            getIlmiyNashir();
        }).catch((error) => {
            console.log('API error:', error.response ? error.response.data : error.message);
            message.error('Failed to update publication status');
        });
    };

    const columns = [
        {
            title: '№',
            width: 50,
            render: (item, record, index) => (<>{index + 1}</>)
        },
        {
            title: 'Ilmiy nashr turi',
            render: (item, record, index) => (<>{item?.classifierOptionsDTO?.name}</>),
            width: 150
        },
        {
            title: 'Ilmiy nashr tili',
            width: 100,
            render: (item, record, index) => (<>{item?.language}</>)
        },
        {
            title: 'Ilmiy ish nomi',
            dataIndex: 'scientificName',
            width: 350,
        },
        {
            title: 'Mualliflar',
            dataIndex: 'authorCount',
            width: 200,
        },
        {
            title: 'Nashr yili',
            dataIndex: 'issueYear',
            width: 150
        },
        {
            title: 'url',
            render: (item, record, index) => (<a href={item?.doiOrUrl} target={"_blank"}>{item?.doiOrUrl}</a>),
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
            width: 150,
            render: (text, record) => (
                <Switch
                    checked={record.publicationStatus === "ACTIVE"}
                    onChange={() => toggleActiveStatus(record)}
                />
            )
        },
        {
            title: 'Harakatlar',
            width: 100,
            render: (text, record) => (
              <Space size="middle">
                <Button type="link" onClick={() => onEdit(record)}>Tahrirlash</Button>
                <Button onClick={() => handleDelete(record.id)} type="danger">
                  O'chirish
                </Button>
              </Space>
            ),
          },
    ];

    useEffect(() => {
        getIlmiyNashir();
    }, []);

    const handleDelete = (id) => {
        axios.put(`${ApiName}/api/publication/update_status`, {
          id,
          publicationStatus: 'DELETED'
        }, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${fulInfo?.accessToken}`
          }
        })
        .then(response => {
          // API javobini tekshirish
          if (response.data.publicationStatus === 'DELETED') {
            message.success('Maqola muvaffaqiyatli o\'chirildi');
            // Ma'lumotni ro'yxatdan olib tashlash
            setDataList(prevDataList => prevDataList.filter(item => item.id !== id));
          }
        })
        .catch(error => {
          // Xatolik yuzaga kelsa
          console.error('Maqolani o\'chirishda xatolik:', error);
          message.error('Maqolani o\'chirishda xatolik');
        });
      };

    function getIlmiyNashir() {
        axios.get(`${ApiName}/api/publication/current-user`, {
            headers: {
                Authorization: `Bearer ${fulInfo?.accessToken}`
            }
        }).then((response) => {
            console.log('Fetched data:', response?.data?.data?.content);
            const fetchedData = response?.data?.data?.content.map(item => ({ ...item, key: item.id }));
            setDataList(fetchedData);
        }).catch((error) => {
            console.log('API error:', error);
            message.error('Failed to fetch data');
        });
    }

    const onEdit = (record) => {
        console.log('Editing record:', record);
        setEditingData(record);
        console.log();
        setOpen(true); // Modalni ochish uchun setOpen(true) funksiyasini chaqiramiz
    };

    const handleCancel = () => {
        setOpen(false);
        setEditingData(null);
    };

    const handleFinish = (values) => {
        if (editingData) {
            const updatedValues = { ...values, id: editingData.id }; 
            axios.put(`${ApiName}/api/publication/update`, updatedValues, {
                headers: {
                    Authorization: `Bearer ${fulInfo?.accessToken}`,
                    'Content-Type': 'application/json'
                }
            }).then((response) => {
                const updatedItem = response.data;
                setDataList(dataList.map(item => item.id === updatedItem.id ? updatedItem : item));
                message.success('Maqola muvaffaqiyatli yangilandi');
                setOpen(false);
                setEditingData(null);
            }).catch((error) => {
                message.error('Maqolani yangilashda xatolik');
            });
        } else {
            axios.post(`${ApiName}/api/publication`, values, {
                headers: {
                    Authorization: `Bearer ${fulInfo?.accessToken}`,
                    'Content-Type': 'application/json'
                }
            }).then((response) => {
                setDataList([...dataList, { ...response.data, key: response.data.id }]);
                message.success('Maqola muvaffaqiyatli qo\'shildi');
                setOpen(false);
            }).catch((error) => {
                message.error('Maqolani qo\'shishda xatolik');
            });
        }
    };

    return (
        <div className='p-4'>
            <Modal
                title={editingData ? "Maqola tahrirlash" : "Maqola kiritish punkti"}
                centered
                open={open}
                onCancel={handleCancel}
                width={1600}
                style={{ right: "-80px" }}
            >
                <FormModal publicationType="SCIENTIFIC_PUBLICATIONS" editingData={editingData} handleFinish={handleFinish} handleCancel={handleCancel} />
            </Modal>

            <div className='d-flex align-items-center justify-content-between'>
                <Form form={form} layout="vertical" ref={formRef} colon={false}
                      onFinish={onChange}
                      className='d-flex align-items-center gap-4'
                >
                    <Form.Item label="Mudatini belgilang" name="MurojatYuklash">
                        <DatePicker.RangePicker
                            name="MurojatYuklash" format="YYYY-MM-DD" onChange={onChangeDate} />
                    </Form.Item>
                    <Form.Item label="Ilmiy nashr nomi" name="MurojatYuklash">
                        <Input style={{ width: '500px' }} placeholder="Nom bo'yicha qidirish" />
                    </Form.Item>
                    <Form.Item>
                        <button className="btn btn-success mt-4" type="submit">
                            <span className="button__text">Ma'lumotni izlash</span>
                        </button>
                    </Form.Item>
                </Form>

                <button type="button" className="btn btn-success" onClick={() => setOpen(true)}>
                    <span className="button__text">Ma'lumot qo'shish</span>
                </button>
            </div>

            <div className="mt-4">
                <Table
                    columns={columns}
                    dataSource={dataList}
                    scroll={{ x: 1300 }}
                />
            </div>
        </div>
    );
}

export default IlmiyNashrlar;




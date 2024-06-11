import React, {useState} from 'react'
import axios from "axios";

const Form2 = () => {
    const url = "https://6584037e4d1ee97c6bcec4b8.mockapi.io/user"
    const [formdata, setFormData] = useState({
        radio: "",
        name: "",
        work: "",
        state: "",
        city: "",
        location: "",
        data: "",
        coment: ""
    })

    function handleChange(e) {
        const newdata = {...formdata}
        newdata[e.target.id] = e.target.value
        setFormData(newdata)
        const updateAPIData = (e) => {
            axios.post(url, {
                radio: formdata.surName,
                name: formdata.name,

            }).then(res => {
                console.log(res.formdata);
            })

            e.preventDefault()


        }
    }

    return (
        <div>
            <form className="row g-3 " style={{backgroundColor: 'white', padding: "15px", borderRadius: "8px"}}>
                <div className="col-3 d-flex  align-item-center">
                    <p style={{fontSize: "18px", fontFamily: "sans-serif"}}>Ism</p>
                </div>
                <div className="col-9">
                    <input type="text" value={formdata.name}
                           onChange={(e) => {
                               setFormData({...formdata, name: e.target.value})
                           }} className="form-control"
                           id="inputAddress" placeholder="RustamMamirov"/>
                </div>
                <div className="col-3 d-flex  align-item-center">
                    <p style={{fontSize: "18px", fontFamily: "sans-serif"}}>Ish joyi</p>
                </div>
                <div className="col-md-9">
                    <select id="inputState" value={formdata.work}
                            onChange={(e) =>
                                setFormData({...formdata,
                                    work: e.target.value})}
                            className="form-select">
                        <option selected>Toshkent Davlat Texnika Universituti</option>
                        <option>...</option>
                    </select>
                </div>
                <div className="col-3 d-flex  align-item-center">
                    <p style={{fontSize: "18px", fontFamily: "sans-serif"}}>Davlat</p>
                </div>
                <div className="col-md-9">
                    <select id="inputState" value={formdata.state}
                            onChange={(e) => setFormData({...formdata,state: e.target.value})}
                            className="form-select">
                        <option selected>Uzbekistan</option>
                        <option>...</option>
                    </select>
                </div>
                <div className="col-3 d-flex  align-item-center">
                    <p style={{fontSize: "18px", fontFamily: "sans-serif"}}>Shaxar</p>
                </div>
                <div className="col-9">
                    <input type="text" value={formdata.city}
                           onChange={(e) => setFormData({...formdata,city: e.target.value})}
                           className="form-control"
                           id="inputAddress" placeholder="Toshkent"/>
                </div>
                <div className="col-3 d-flex  align-item-center">
                    <p style={{fontSize: "18px", fontFamily: "sans-serif"}}>Manzil</p>
                </div>
                <div className="col-9">
                    <input type="text" value={formdata.location} onChange={(e) => setFormData({...formdata,location: e.target.value})}
                           className="form-control" id="inputAddress" placeholder="Talabalar shaxarchasi"/>
                </div>
                <div className="col-3 d-flex  align-item-center">
                    <p style={{fontSize: "18px", fontFamily: "sans-serif"}}>Data</p>
                </div>
                <div className="col-9">
                    <input type="date" id="start" value={formdata.data} onChange={(e) => setFormData({...formdata,data: e.target.value})}
                           name="trip-start" value="2018-07-22" min="1899-01-01"
                           max="2024-12-31"/>
                </div>
                <div className="col-3 d-flex  align-item-center">
                    <p style={{fontSize: "18px", fontFamily: "sans-serif"}}>Biografiya</p>
                </div>
                <div className="form-floating col-9">
                    <textarea className="form-control" value={formdata.coment} onChange={(e) => setFormData({...formdata,coment: e.target.value})}
                              placeholder="Leave a comment here"
                              id="floatingTextarea"></textarea>
                    <label htmlFor="floatingTextarea">Comments</label>
                </div>
                <div className="col-12 mt-5">
                    <button type="submit" className="btn btn-primary">Saxranit</button>
                </div>
            </form>
        </div>
    )
}
{/*  */
}
export default Form2
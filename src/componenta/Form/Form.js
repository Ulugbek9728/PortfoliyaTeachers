import React, { useState } from 'react'
import axios from 'axios'
import './form.css'
const Form = () => {

  const url = "https://6584037e4d1ee97c6bcec4b8.mockapi.io/user"
  const [data, setData] = useState({
      surName:"",
      name: "",
      fatherName:"",
      fullName:"",
      gmail: ""
  })    
  function handle(e) {
   const newdata = {...data}
   newdata[e.target.id] = e.target.value
   setData(newdata)
  }
  const updateAPIData = (e) => {
 
    axios.post(url, {
    surName: data.surName,
    name:data.name, 
    gmail:data.gmail,
    fatherName:data.fatherName,
    fullName:data.fullName
    }).then(res => {
        console.log(res.data);
    })
   
    e.preventDefault()

    
}
  return (
<div>
 <form onSubmit={updateAPIData} className="row g-3 " style={{ backgroundColor:'white',padding:"15px", borderRadius:"8px"}} >
  <div className="col-md-4">
  <label htmlFor="inputAddress" className="form-label">Ism</label>
    <input type="text" className="form-control" id="name" value={data.name} onChange={(e) => handle(e)} required placeholder="Rustam"/>
  </div>
  <div className="col-md-4">
  <label htmlFor="inputAddress2" className="form-label">Familya</label>
    <input type="text" className="form-control" id="surName" value={data.surName} onChange={(e) => handle(e)} required placeholder="Mamirov"/>
  </div>
  <div className="col-md-4">
  <label htmlFor="inputAddress3" className="form-label">Ochestva</label>
    <input type="text" className="form-control" id="fatherName" value={data.fatherName} onChange={(e) => handle(e)} required placeholder="Farxodovich"/>
  </div>
  <div className="email col-3">
    <h3>Imya polzovatelya</h3>
    <p>Imya polzovatelya</p>
  </div>
  <div className="col-9">
    <label for="inputAddress" className="form-label">FullName</label>
    <input type="text" className="form-control" id="fullName" value={data.fullName} onChange={(e) => handle(e)} required placeholder="RustamMamirov"/>
  </div>
  <div className="email col-3">
    <h3>Elektroniy pochta</h3>
    <p>elektroniy pochta</p>
  </div>
  <div className="col-9">
    <label for="inputEmail4" className="form-label">Email</label>
    <input type="email" className="form-control" id="gmail" value={data.gmail} onChange={(e) => handle(e)} required placeholder='jamshid@gmail.com'/>
  </div>
  <div className="col-12">
    <button type="submit" className="btn btn-primary">Saxranit</button>
  </div>
</form>
    </div>
  )
}

export default Form  
{/* <div className="col-md-4">
    <label for="inputState" className="form-label">State</label>
    <select id="inputState" className="form-select">
      <option selected>Choose...</option>
      <option>...</option>
    </select>
  </div> */}
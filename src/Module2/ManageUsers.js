import React, { useEffect, useState } from 'react'
import './Css/ManageUsers.css'
import { useNavigate } from 'react-router-dom';
export default function ManageUsers() {

  const [users, setUsers] = useState([]);
  const navigate = useNavigate()

  const validateuserdetails = () => {
    const element1 = document.getElementsByClassName('userid');
    const element2 = document.getElementsByClassName('password');
    const errormsg = document.getElementsByClassName('usererrormsg');
    // console.log(element1[0].value);
    let errcount = 0;

    if (element1[0].value === "") {
      errcount++
      errormsg[0].innerHTML = "This is required field !"
      errormsg[0].style.color = "red";
    } else {
      errormsg[0].innerHTML = "";

    }
    if (element2[0].value === "") {
      errcount++
      errormsg[0].innerHTML = "This is required field !"
      errormsg[0].style.color = "red";
    } else {
      errormsg[0].innerHTML = "";
    }
    if (errcount === 0) {
      checkuserdetails();
    }
  }

  const checkuserdetails = async () => {
    const element1 = document.getElementsByClassName('userid');
    const errormsg = document.getElementsByClassName('usererrormsg');
    let res = await fetch(`http://localhost:3443/fetchuserdetails/${element1[0].value}`, {
      method: 'GET',
      credentials: 'include'

    });
    res = await res.json();
    // console.log(res.msg);
    if (res.msg === "InvalidToken" || res.msg === "NoToken") {
      navigate('/');
      return;
    }
    if (res.msg === "newuser") {
      insertuserdetail();
    } else {
      errormsg[0].innerHTML = "User already exist!"
    }
  }

  const insertuserdetail = async () => {
    const element1 = document.getElementsByClassName('userid');
    const element2 = document.getElementsByClassName('password');
    const errormsg = document.getElementsByClassName('usererrormsg');
    let data = {
      userid: element1[0].value,
      userpassword: element2[0].value
    }
    let res = await fetch('http://localhost:3443/insertuserdetail', {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(data),
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
    });
    res = await res.json();
    if (res.msg === "InvalidToken" || res.msg === "NoToken") {
      navigate('/');
      return;
    }
    // console.log(res);
    if (res.msg === "insertedsuccesfully") {
      errormsg[0].style.color = "green";
      errormsg[0].innerHTML = "User Added Successfully";
      fetchusertabledetails();
      // setUsers(res.data)
    }
  }

  const fetchusertabledetails = async () => {
    // console.log("users fetched");
    let res = await fetch('http://localhost:3443/fetchusers', {
      method: 'GET',
      credentials: 'include'

    });
    res = await res.json();
    if (res.msg === "InvalidToken" || res.msg === "NoToken") {
      navigate('/');
      return;
    }
    if (res.msg == "usersfetched") {
      setUsers(res.data)
    }
  }

  const deleteuser = async (index) => {
    // console.log(users[index].user_name);
    let res = await fetch(`http://localhost:3443/deleteuser/${users[index].user_name}`, {
      method: 'GET',
      credentials: 'include'

    });
    res = await res.json();
    if (res.msg === "InvalidToken" || res.msg === "NoToken") {
      navigate('/');
      return;
    }
    // console.log(res);
    if (res.msg === "userdeleted") {
      // console.log("deleted");

      fetchusertabledetails();
      // setUsers(res.data)
    }
  }

  useEffect(() => {
    let ele = document.getElementsByClassName('sidebarmaincontainer')[0]
    if (ele.classList.contains('sidebaractive')) {
      ele.classList.remove('sidebaractive')
    }
    fetchusertabledetails();
  }, [])

  return (
    <div className='insertsubjectmaincontainer'>
      <div className="manageuserschildcontainer">
        <div className="manageuserssection1">
          <div className="selectprogramheader">
            <p className='insertsubjecttheader'>Add User</p>
          </div>
          <div className="selectprograminputlist">
            <div className="adduserinputitem selectprograminputitem ">
              <p>User id : </p>
              <input type="text" className="userid" name="" id="" />
            </div>
            <div className="adduserinputitem selectprograminputitem">
              <p>Password : </p>
              <input type="text" className='password' name="" id="" />
            </div>
            <div className="insertsubjectdetailsinputbuttondiv">
              <button className="insertsubjectdetailsinputbtn" onClick={validateuserdetails}>
                <label>Add User</label>
              </button>
            </div>
          </div>
        </div>
        <div className="userinputerrormsgdiv">
          <p className='usererrormsg'></p>
        </div>
        <div className="insertsubjectfiltertablecontainer manageuserstable">
          <table  >
            <tr >
              <th>Sr no.</th>
              <th>User Name</th>
              {/* <th>Semester</th> */}
              <th>Delete</th>
            </tr>
            {users?.map((item, index) => (
              <tr>
                <td>{index + 1}.</td>
                <td >{item.user_name}</td>
                <td><button onClick={() => { deleteuser(index) }} className='deletebtn'>Delete</button></td>
              </tr>
            ))}
          </table>
        </div>
      </div>
    </div>
  )
}

import React, { useEffect, useState } from 'react'
import './Css/ManageUsers.css'
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
export default function ManageUsers() {

  const [users, setUsers] = useState([]);
  const navigate = useNavigate()

  const validateuserdetails = () => {

    const element1 = document.getElementsByClassName('userid');
    const element2 = document.getElementsByClassName('password');
    let errcount = 0;
    if (element1[0].value === "") {
      errcount++
      element1[0].style.border = "1px solid red"
      toast.error("This is required field !")
    }

    if (element2[0].value === "") {
      errcount++
      element2[0].style.border = "1px solid red"
      toast.error("This is required field !");
    } else {
      element2[0].style.border = "1px solid grey";
    }

    if(errcount>0){
      return
    }

    if (!element1[0].value.includes("@")) {
      element1[0].style.border = "1px solid red";
      toast.error("Invalid Email ID.")
      errcount++
    } else {
      element1[0].style.border = "1px solid grey";
    }

    if (!element1[0].value.includes(".com")) {
      toast.error("Invalid Email ID.")
      element1[0].style.border = "1px solid red";
      errcount++
    } else {
      element1[0].style.border = "1px solid grey";
    }


    if (errcount === 0) {
      checkuserdetails();
    }
  }

  const checkuserdetails = async () => {
    const element1 = document.getElementsByClassName('userid');
    const element2 = document.getElementsByClassName('password');
    let res = await fetch(`http://localhost:3443/fetchuserdetails/${element1[0].value}`, {
      method: 'GET',
      credentials: 'include'

    });
    res = await res.json();
    if (res.msg === "InvalidToken" || res.msg === "NoToken") {
      navigate('/');
      return;
    }
    if (res.msg === "newuser") {
      toast.success("Added Successfully!")
      insertuserdetail();
    } else {
      element1[0].value = "";
      element2[0].value = "";
      toast.error("User already exist!")
    }
  }

  const insertuserdetail = async () => {
    const element1 = document.getElementsByClassName('userid');
    const element2 = document.getElementsByClassName('password');
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
    if (res.msg === "insertedsuccesfully") {
      toast.success("User Added Successfully");
      element1[0].value = "";
      element2[0].value = "";
      fetchusertabledetails();
    }
  }

  const fetchusertabledetails = async () => {
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
    let res = await fetch(`http://localhost:3443/deleteuser/${users[index].user_name}`, {
      method: 'GET',
      credentials: 'include'

    });
    res = await res.json();
    if (res.msg === "InvalidToken" || res.msg === "NoToken") {
      navigate('/');
      return;
    }
    if (res.msg === "userdeleted") {
      toast.success("User deleted successfully!")

      fetchusertabledetails();
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
    <>
      <ToastContainer />
      <div className='insertsubjectmaincontainer'>
        <div className="manageuserschildcontainer">
          <div className="manageuserssection1">
            <div className="selectprogramheader">
              <p className='insertsubjecttheader'>Add User</p>
            </div>
            <div className="selectprograminputlist">
              <div className="adduserinputitem selectprograminputitem ">
                <p>Email ID : </p>
                <input type="text" className="userid" name="" id="" />
              </div>
              <div className="adduserinputitem selectprograminputitem">
                <p>Password : </p>
                <input type="text" className='password' name="" id="" />
              </div>
              <div className="insertsubjectdetailsinputbuttondiv">
                <button className="insertsubjectdetailsinputbtn" onClick={validateuserdetails}>
                  Add User
                </button>
              </div>
            </div>
          </div>
          <div className="manageusersparenttable">
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
      </div>
    </>
  )
}

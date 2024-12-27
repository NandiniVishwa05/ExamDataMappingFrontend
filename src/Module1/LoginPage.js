import React from 'react'
import './Css/Module1.css'
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setAdminValue } from '../counterSlice';

export default function LoginPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const validatelogindetails = () => {
        const userid = document.getElementsByClassName('userid');
        const userpassword = document.getElementsByClassName('userpassword');
        const errormsg = document.getElementsByClassName('errormsg');
        console.log(userpassword);

        let errorcount = 0;

        if (userid[0].value === "") {
            errorcount++;
            errormsg[0].innerHTML = "Enter the User ID !";
            errormsg[0].style.color = "red";
        } else {
            errormsg[0].innerHTML = "";
        }

        if (userpassword[0].value === "") {
            errorcount++;
            errormsg[1].innerHTML = "Enter the password!";
            errormsg[1].style.color = "red";
        } else {
            errormsg[1].innerHTML = "";
        }

        if (errorcount === 0) {
            fetchusercredentials();
        }

    }
    const fetchusercredentials = async () => {
        const userid = document.getElementsByClassName('userid');
        const userpassword = document.getElementsByClassName('userpassword');
        const errormsg = document.getElementsByClassName('errormsg');
        let res = await fetch(`http://localhost:3443/fetchusercredentials/${userid[0].value}/${userpassword[0].value}`, {
            method: 'GET',
            credentials:'include'
        })

        res = await res.json();
        console.log(res);
        if (res.msg === "usernotexist") {
            errormsg[0].innerHTML = "Invalid Credentials !";
            errormsg[0].style.color = "red";
            errormsg[1].innerHTML = "Invalid Credentials !";
            errormsg[1].style.color = "red";
        } else {
            console.log(res.data[0].admin_check);
            dispatch(setAdminValue(res.data[0].admin_check));
            navigate('/dashboard/insertprogram');
        }

    }
    return (
        <>
            <div className="loginpagecontainer">
                <div className="logincontainer">
                    <div className="logincontainerheader">
                        <label>Login</label>
                    </div>
                    <div className="logincontaineriddiv">
                        <label className='useridlabel'>User Id</label>
                        <input type='text' className='userid' name='userid'></input>
                        <label className='errormsg'></label>
                    </div>
                    <div className="logincontainerpassworddiv">
                        <label className='userpasswordlabel'>Password</label>
                        <input type='password' className='userpassword'></input>
                        <label className='errormsg'></label>
                    </div>
                    <div className="logincontainerloginbtndiv">
                        <button className='loginsubmitbtn' onClick={validatelogindetails}>Submit</button>
                    </div>
                </div>
            </div>
        </>
    )
}

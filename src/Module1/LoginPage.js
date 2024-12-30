import React, { useEffect, useState } from 'react'
import './Css/Module1.css'
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setAdminValue } from '../counterSlice';
import otpimg from '../resources/otp1.jpg'
import otpimg2 from '../resources/otp2.png'
import { ToastContainer, toast } from 'react-toastify';

export default function LoginPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    let [otp, setOtp] = useState(0);
    const [uid, setUid] = useState(0);

    const validatelogindetails = () => {
        const userid = document.getElementsByClassName('userid');
        const userpassword = document.getElementsByClassName('userpassword');
        const errormsg = document.getElementsByClassName('errormsg');
        console.log(userpassword);

        let errorcount = 0;

        if (userid[0].value === "") {
            errorcount++;
            toast.error("Enter the User ID !");
            userid[0].style.border = "1px solid red";
        } else {
            userid[0].style.border = "none";
        }
        if (userpassword[0].value === "") {
            errorcount++;
            userpassword[0].style.border = "1px solid red";
            toast.error("Enter the User Password !")
        } else {
            userpassword[0].style.border = "none";
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
            credentials: 'include'
        })

        res = await res.json();
        console.log(res);
        if (res.msg === "usernotexist") {
            userid[0].style.border = "1px solid red";
            userpassword[0].style.border = "1px solid red";
            toast.error("Invalid Credentials!")
        } else {
            userpassword[0].style.border = "none";
            userid[0].style.border = "none";
            console.log(res.data[0].admin_check);
            dispatch(setAdminValue(res.data[0].admin_check));
            navigate('/dashboard/insertprogram');
        }
    }

    const checkuserlogin = async () => {
        let res = await fetch(`http://localhost:3443/checkuserlogin`, {
            method: 'GET',
            credentials: 'include'
        });

        res = await res.json();

        if (res.msg === "userloggedin") {
            navigate('/dashboard/insertprogram');
        }

    }
    const enableemailpage = () => {
        let emailpage = document.getElementsByClassName('forgotemailcontainer');
        let email = document.getElementsByClassName('forgotemailinput')[0].value = "";
        emailpage[0].style.display = 'flex';
        let homepage = document.getElementsByClassName('logincontainer')
        homepage[0].style.display = 'none';
        document.getElementsByClassName('userid')[0].style.border = "none";
        document.getElementsByClassName('userpassword')[0].style.border = "none";
        document.getElementsByClassName('userid')[0].value = "";
        document.getElementsByClassName('userpassword')[0].value = "";
    }
    const enablehomepage = () => {
        let emailpage = document.getElementsByClassName('forgotemailcontainer');
        emailpage[0].style.display = 'none';
        let homepage = document.getElementsByClassName('logincontainer')
        homepage[0].style.display = 'flex';
        document.getElementsByClassName('userid')[0].value = "";
        document.getElementsByClassName('userpassword')[0].value = "";
    }
    const randomNumber = (min, max) => {
        otp = Math.floor(Math.random() * (max - min) + min);
        console.log("Generated otp", otp);
        console.log("Generated otp type", typeof (otp));
        return otp;
    }
    const validateemail = () => {
        console.log("hello");

        let email = document.getElementsByClassName('forgotemailinput')[0].value;
        console.log(email);
        let ecount = 0;
        if (email === "") {
            toast.error("Please ! Enter Email ID.");
            document.getElementsByClassName('forgotemailinput')[0].style.border = "1px solid red";
            ecount++;
        } else if (!email.includes("@") || !email.includes(".com")) {
            toast.error("Please ! Enter valid Email.");
            document.getElementsByClassName('forgotemailinput')[0].style.border = "1px solid red";
            ecount++;
        }
        if (ecount === 0) {
            document.getElementsByClassName('forgotemailinput')[0].style.border = "none";
            checkemail();
        }
    }
    const checkemail = async () => {
        let email = document.getElementsByClassName('forgotemailinput')[0].value;
        let res = await fetch(`http://localhost:3443/checkemail/${email}`, {
            method: "GET",
        });
        res = await res.json();
        setUid(res);
        console.log(res);

        if (res.msg !== "validEmail") {
            document.getElementsByClassName('forgotemailinput')[0].style.border = "1px solid red";
            toast.error("Invalid Email!")
        } else {
            email = "";
            sendMail();
        }

    }
    const sendMail = async () => {
        let email = document.getElementsByClassName('forgotemailinput')[0].value;
        otp = randomNumber(100000, 999999);
        setOtp(otp);
        console.log(otp);
        console.log(email);
        let data = {
            otp: otp,
            email: email
        }
        let res = await fetch(`http://localhost:3443/sendmail`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                Accept: "application/json",
                "Content-type": "application/json",
            }
        });
        res = await res.json();
        console.log(res);
        if (res.msg === "EmailSentSuccessfully") {
            toast.success("Email sent Successfully !")
            displayOtpPage();
        }
    }
    const displayOtpPage = () => {
        let otppage = document.getElementsByClassName('forgotpasswordcontainer');
        let emailpage = document.getElementsByClassName('forgotemailcontainer');
        otppage[0].style.display = "flex";
        emailpage[0].style.display = 'none';
        console.log(otp);

    };
    const disableotppage = () => {
        let otppage = document.getElementsByClassName('forgotpasswordcontainer');
        let homepage = document.getElementsByClassName('logincontainer');
        otppage[0].style.display = "none";
        homepage[0].style.display = 'flex';
    }
    const verifyotp = () => {
        let element = document.getElementsByClassName('otpinput')[0].value;
        let setpasswordpage = document.getElementsByClassName('setpasswordcontainer')[0];
        let verifyemailpage = document.getElementsByClassName('forgotpasswordcontainer')[0];
        console.log("Email otp", otp);
        console.log("Input otp", element);
        if (otp == element) {
            element = "";
            setpasswordpage.style.display = "flex";
            verifyemailpage.style.display = "none";
        } else {
            toast.error("Incorrect OTP.")
            document.getElementsByClassName('otpinput')[0].style.border = "1px solid red";
        }
    }
    const validatepassword = () => {
        let element = document.getElementsByClassName('setpasswordinput');
        console.log(element[0].value);
        console.log(element[1].value);
        let err = 0;
        if (element[0].value == "" || element[1].value == "") {
            err++;
            element[0].style.border = "1px solid red"
            element[1].style.border = "1px solid red"
            toast.error("Please! Enter Password.")
        } else if (element[0].value.length < 8 && element[1].value.length < 8) {
            err++;
            element[0].style.border = "1px solid red"
            element[1].style.border = "1px solid red"
            toast.error("Password length should be 8.")
        } else if (element[0].value != element[1].value) {
            err++;
            element[0].style.border = "1px solid red"
            element[1].style.border = "1px solid red"
            toast.error("Please! Enter same Password.")
        }
        if (err == 0) {
            element[0].style.border = "none"
            element[1].style.border = "none"
            insertpassword();
        }
    }
    const insertpassword = async () => {
        let password = document.getElementsByClassName('setpasswordinput')[0].value;
        console.log(uid.data[0].user_id);

        let data = {
            uid: uid.data[0].user_id,
            password: password
        }
        let res = await fetch(`http://localhost:3443/insertpassword`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                Accept: "application/json",
                "Content-type": "application/json",
            }
        });
        res = await res.json();
        console.log(res);
        if (res.msg == "insertedsuccesfully") {
            toast.success("Password updated Successfully!");
            document.getElementsByClassName('logincontainer')[0].style.display = "flex";
            document.getElementsByClassName('setpasswordcontainer')[0].style.display = "none";

        }
    }
    useEffect(() => {
        checkuserlogin();
    }, [])

    return (
        <>
            <ToastContainer />
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
                        <label className='useyrpasswordlabel'>Password</label>
                        <input type='password' className='userpassword'></input>
                        <label className='errormsg'></label>
                    </div>
                    <div className="forgotpassworddiv" onClick={enableemailpage}>
                        <label className='forgotpasswordlabel'>Forgot Password ?</label>
                    </div>
                    <div className="logincontainerloginbtndiv">
                        <button className='loginsubmitbtn' onClick={validatelogindetails}>Submit</button>
                    </div>
                </div>
                <div className="forgotpasswordcontainer">
                    <div className="backbuttondiv" onClick={disableotppage}>
                        <label className='backbtn'><i class="fa-solid fa-arrow-left"></i></label>
                        <label className='backbtn'>Back</label>
                    </div>
                    <div className="forgotpasswordcontainerheader">
                        <label className='forgotpasswordheader'>Verify Email</label>
                    </div>
                    <div className="forgotpassworddesc">
                        <label className='otpdesc'>We have sent six digit OTP code to </label>
                        <label className='otpemail'>nandinivish05@gmail.com</label>
                    </div>
                    <div className="forgotpasswordbodycontainer">
                        <div className="forgotpasswordimagediv">
                            <img src={otpimg} alt='otpimg' className='otpimage'></img>
                        </div>
                        <div className="forgotpasswordinputdiv">
                            <input type="number" name="" id="" className="otpinput" placeholder='XXXXXX' maxLength={6} />
                        </div>
                    </div>
                    <div className="forgotpasswordbtndiv">
                        <button className="forgotpasswordbtn" onClick={verifyotp}>Submit</button>
                    </div>
                </div>
                <div className="setpasswordcontainer">
                    <div className="setpasswordheader">
                        <label htmlFor="" className="setpasswordheader">Reset Password</label>
                    </div>
                    <div className="setpasswordbodycontainer">
                        <div className="setpasswordbodycontainerdiv">
                            <label htmlFor="" className="setpasswordinputlabel">New Password</label>
                            <input type="password" className="setpasswordinput" />
                        </div>
                        <div className="setpasswordbodycontainerdiv">
                            <label htmlFor="" className="setpasswordinputlabel">Confirm Password</label>
                            <input type="password" className="setpasswordinput" />
                        </div>
                    </div>
                    <div className="setpasswordbuttondiv">
                        <button className="setpasswordbtn" onClick={validatepassword}>Submit</button>
                    </div>
                </div>
                <div className="forgotemailcontainer">
                    <div className="forgotemailcontainerbackbuttondiv" onClick={enablehomepage}>
                        <label className='forgotemailcontainerbackbtn'><i class="fa-solid fa-arrow-left"></i></label>
                        <label className='forgotemailcontainerbackbtn'>Back</label>
                    </div>
                    <div className="forgotemailheader">
                        <label htmlFor="" className="forgotemailheaderlabel">Forgot Password ?</label>
                    </div>
                    <div className="forgotemailbodycontainer">
                        <div className="forgotemailimagediv">
                            <img src={otpimg2} alt='otpimg' className='otpimage'></img>
                        </div>
                        <div className="forgotemailinputdiv">
                            {/* <label htmlFor="" className="forgotemailinputlabel">Enter Email</label> */}
                            <input type="text" name="" id="" className="forgotemailinput" placeholder='username@gmail.com' />
                        </div>
                    </div>
                    <div className="forgotemailbtndiv">
                        <button className="forgotemailbtn" onClick={validateemail}>Submit</button>
                    </div>
                </div>
            </div>
        </>
    )
}

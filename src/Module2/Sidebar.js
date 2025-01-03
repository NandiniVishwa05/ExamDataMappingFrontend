import React, { useEffect, useState } from 'react'
import './Css/Sidebar.css'
import './Css/InsertMarks.css'
import img from './Resources/DAV logo.jpeg'
import { Link, Outlet, useNavigate } from 'react-router-dom'

export default function Sidebar() {
  const navigate = useNavigate();
  const [adminVal, setAdminVal] = useState(0);

  const logout = async () => {
    let res = await fetch('http://localhost:3443/logout', {
      credentials: 'include',
      method: 'GET'
    })
    res = await res.json();
    if (res.msg === "LoggedOut") {
      navigate("/");
    }
  }

  const fetchUserType = async () => {
    try {
      let res = await fetch('http://localhost:3443/fetchusertype', {
        method: 'GET',
        credentials: 'include'
      })

      res = await res.json();
      // eslint-disable-next-line
      if (res[0].admin_check == 1) {
        setAdminVal(1);
      } else {
        setAdminVal(0);
      }
    } catch (error) {

    }
  }

  const toggleSidebar = () => {
    let ele = document.getElementsByClassName('sidebarmaincontainer')[0]
    if (ele.classList.contains('sidebaractive')) {
      ele.classList.remove('sidebaractive')
    } else {
      ele.classList.add('sidebaractive')
    }
  }

  useEffect(() => {

    fetchUserType();
  }, [])
  return (
    <>
      <div className="sidebarparentcontainer">
        <div className="navbarmaincontainer">
          <div className='navbarchildcontainer'>
            <div className='navbarinfosection'>
              <div className="sidebarlogosection">
                <img src={img} alt="" />
              </div>
              <div className="sidebarlabelsection">
                <p className='sidebarlabelbold'>Ramanand Arya D.A.V College</p>
                <p className='sidebarlabelsecondary'>( Autonomous )</p>
              </div>
            </div>
            <div className='navbaroptionssection'>
              <i className="fa-solid fa-bars" onClick={() => { toggleSidebar() }}></i>
            </div>
          </div>
        </div>
        <div className='sidebarmaincontainer'>
          <div className="sidebarchildcontainer">
            <div className="sidebarclosebutton" onClick={() => { toggleSidebar() }} >
              <i className="fa-solid fa-angle-left"></i>
            </div>
            <div className="sidebarheadsection">
              <div className="sidebarlogosection">
                <img src={img} alt="" />
              </div>
              <div className="sidebarlabelsection">
                <p className='sidebarlabelbold'>Ramanand Arya D.A.V College</p>
                <p className='sidebarlabelsecondary'>( Autonomous )</p>
              </div>
            </div>
            <div className="sidebarbodysection">
              <div className="sidebaroptionslist">
                <Link to='/dashboard/insertprogram' className="sidebaroptionitem">
                  <i className="fa-solid fa-paperclip"></i>
                  <p>Insert Program</p>
                </Link>
                <Link to='/dashboard/insertmarks' className="sidebaroptionitem">
                  <i className="fa-solid fa-plus"></i>
                  <p>Insert Marks</p>
                </Link>
                <Link to='/dashboard/generatereport' className="sidebaroptionitem">
                  <i className="fa-solid fa-print"></i>
                  <p>Generate Report</p>
                </Link>
                {
                  // eslint-disable-next-line
                  adminVal == 1 ?
                    <>
                      <Link to='/dashboard/insertsubject' className="sidebaroptionitem">
                        <i className="fa-solid fa-book"></i>
                        <p>Manage Subject</p>
                      </Link>
                      <Link to='/dashboard/manageusers' className="sidebaroptionitem">
                        <i className="fa-regular fa-user"></i>
                        <p>Manage Users</p>
                      </Link>
                      <Link to='/dashboard/manageprogram' className="sidebaroptionitem">
                        <i className="fa-solid fa-layer-group"></i>
                        <p>Manage Program</p>
                      </Link>
                    </> : null
                }
                <Link to='/' className="sidebaroptionitem" onClick={logout}>
                  <i className="fa-solid fa-right-from-bracket"></i>
                  <p >Logout</p>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <Outlet />
      </div>
    </>
  )
}
import React, { useEffect } from 'react'
import './Css/Sidebar.css'
import './Css/InsertMarks.css'
import img from './Resources/DAV logo.jpeg'
import { Link, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function Sidebar() {
  const adminval = useSelector((state) => state.counterSlice.adminValue)

  return (
    <>
      <div className="sidebarparentcontainer">
        <div className='sidebarmaincontainer'>
          <div className="sidebarchildcontainer">
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
                  adminval == 1 ?
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
                    </> :
                    <></>
                }
                <Link to='/' className="sidebaroptionitem">
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
import React from 'react'
import './Css/Sidebar.css'
import './Css/InsertMarks.css'
import img from './Resources/DAV logo.jpeg'
import Insertmarks from './Insertmarks'
import GenerateReport from './GenerateReport'
import { Link, Outlet } from 'react-router-dom'

export default function Sidebar() {
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
                  <i className="fa-solid fa-plus"></i>
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
                <div className="sidebaroptionitem">
                  <i className="fa-solid fa-right-from-bracket"></i>
                  <p>Logout</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Outlet />
        {/* <Insertmarks /> */}
        {/* <GenerateReport /> */}
      </div>
    </>
  )
}
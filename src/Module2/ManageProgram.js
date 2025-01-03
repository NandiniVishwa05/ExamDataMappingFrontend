import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

export default function ManageProgram() {
    const [course, setCourses] = useState([]);
    const navigate = useNavigate()

    const validateprograminput = () => {
        let element = document.getElementsByClassName('addsubjectitem');
        let errorcount = 0;
        for (let i = 0; i < element.length; i++) {
            if (element[i].value === "") {
                errorcount++;
                element[i].style.borderColor = "red";
                toast.error("This is required field!")
            } else {
                element[i].style.borderColor = "#acacac";
            }
        }
        if (errorcount !== 0) {
            toast.error("Please! fill the details !")
            return;
        }

        for (let i = 1; i < element.length; i++) {
            if (/^\d+$/.test(element[i].value)) {
                // console.log("number hai");
                element[i].style.borderColor = "#acacac";
            } else {
                element[i].style.borderColor = "red";
                errorcount++;
                // console.log(element[i].value);
            }
        }
        if (errorcount > 0) {
            toast.error("Please! Enter a Number!");
        } else {
            insertadminprogramdetail();
        }
    }
    const insertadminprogramdetail = async () => {
        let element = document.getElementsByClassName('addsubjectitem');
        // console.log(element[2].value);
        let data = {
            course_name: element[0].value,
            no_of_semester: element[1].value,
            no_of_division: element[2].value
        }
        let res = await fetch('http://localhost:3443/insertadminprogramdetail', {
            method: 'POST',
            credentials: 'include',

            body: JSON.stringify(data),
            headers: {
                Accept: "application/json",
                "Content-type": "application/json",
            },
        });
        res = await res.json();
        // console.log(res);
        if (res.msg === "InvalidToken" || res.msg === "NoToken") {
            navigate('/');
            return;
        }
        if (res.msg === "insertedsuccesfully") {
            toast.success("Program added successfully!")
            fetchadminprogramtabledetails();
        } else if (res.msg === "error") {
            toast.error("Program already exists!")
        }
    }

    const fetchadminprogramtabledetails = async () => {
        let res = await fetch(`http://localhost:3443/fetchadminprogramtabledetails`, {
            method: 'GET',
            credentials: 'include'

        });

        res = await res.json();
        // console.log(res);
        if (res.msg === "InvalidToken" || res.msg === "NoToken") {
            navigate('/');
            return;
        }
        if (res.msg !== "error") {
            setCourses(res.msg);
        }

    }
    const deleteadmintableprogramdetail = async (index) => {
        let res = await fetch(`http://localhost:3443/deleteadmintableprogramdetail/${course[index].course_id}`, {
            method: 'GET',
            credentials: 'include'

        })

        res = await res.json();
        if (res.msg === "InvalidToken" || res.msg === "NoToken") {
            navigate('/');
            return;
        }
        if (res.msg === "coursedeleted") {
            toast.success("Deleted successfully!")
            fetchadminprogramtabledetails();
        }
    }

    useEffect(() => {
        let ele = document.getElementsByClassName('sidebarmaincontainer')[0]
        if (ele.classList.contains('sidebaractive')) {
            ele.classList.remove('sidebaractive')
        }
        fetchadminprogramtabledetails();
    }, [])
    return (
        <>
            <ToastContainer />
            <div className="insertsubjectmaincontainer">
                <div className="insertsubjectchildcontainer">
                    <div className="selectsubjectcontainer">
                        <div className="selectsubjectcontainerheader">
                            <p className='insertsubjecttheader'>Manage Program</p>
                        </div>
                        <div className="selectsubjectcontainerinputlist">
                            <div className="selectprograminputitem managecourseinputitem">
                                <p>Course Name</p>
                                <input className='inputitem addsubjectitem' type="text" name="" id="" />

                            </div>
                            <div className="selectprograminputitem managecourseinputitem">
                                <p>No. of Semester</p>
                                <input className='inputitem addsubjectitem' type="text" name="" id="" />

                            </div>
                            <div className="selectprograminputitem managecourseinputitem">
                                <p>No. of Division</p>
                                <input className='inputitem addsubjectitem' type="text" name="" id="" />
                            </div>
                        </div>
                        <div className="insertsubjectdetailsinputbuttondiv">
                            <button className="insertsubjectdetailsinputbtn" onClick={validateprograminput} >
                                <p>Add</p>
                            </button>
                        </div>
                        <p className='qerrormsg'></p>

                    </div>
                    <div className="selectprogramerrormsg">
                        <p className='selectprogramerrormsgitem'></p>
                    </div>
                    <div className="insertsubjectaddfiltersectioncontainer managecoursesectioncontainer">
                        <div className="insertsubjectfiltersectionheader">
                            <p>Program Details</p>
                        </div>
                        <div className="insertsubjectfiltertablecontainer manageprogramtable">
                            <table  >
                                <tr >
                                    <th>Sr no.</th>
                                    <th>Course Name</th>
                                    <th>Division</th>
                                    <th>Semester</th>
                                    <th>Delete</th>
                                </tr>
                                {course.map((item, index) => (
                                    <tr>
                                        <td>{index + 1}</td>
                                        <td className='subjectname' >{item.course_name}</td>
                                        <td className='coursename'>{item.no_of_semester}</td>
                                        <td className='semester'>{item.no_of_division}</td>
                                        <td><button className='deletebtn' onClick={() => { deleteadmintableprogramdetail(index) }}>Delete</button></td>
                                    </tr>
                                ))}
                            </table>
                        </div>
                    </div>
                </div>
            </div></>
    )
}

import React, { useEffect, useState } from 'react'
import './Css/Insertsubject.css'
import { useNavigate } from 'react-router-dom';
export default function InsertSubject() {

    const [courses, setCourses] = useState([]);
    const [courseId, setCourseId] = useState();
    const [subject, setSubjects] = useState([]);
    const navigate = useNavigate()

    const fetchcourses = async () => {
        let res = await fetch(`http://192.168.77.141:3443/fetchcourses`, {
            method: 'GET',
            credentials: 'include'

        });

        res = await res.json();
        if (res.msg === "InvalidToken" || res.msg === "NoToken") {
            navigate('/');
            return;
        }
        if (res !== "error") {
            setCourses(res);
        }
    }

    const fetchsubjects = async () => {
        let res = await fetch('http://192.168.77.141:3443/fetchsubjects', {
            method: 'GET',
            credentials: 'include'
        });

        res = await res.json();
        if (res.msg === "InvalidToken" || res.msg === "NoToken") {
            navigate('/');
            return;
        }
        // console.log(res);
        setSubjects(res);

    }

    const fetchCourseId = async (e) => {
        // setSubjects([]);
        // console.log(e.target.value);
        let res = await fetch(`http://192.168.77.141:3443/fetchcourseid/${e.target.value}`, {
            method: 'GET',
            credentials: 'include'

        });

        res = await res.json();
        // console.log(res);
        if (res.msg === "InvalidToken" || res.msg === "NoToken") {
            navigate('/');
            return;
        }
        if (res !== "error") {
            setCourseId(res[0].course_id);
            fetchsemanddiv(res[0].course_id);
        }
    }


    const [semester, setSemester] = useState([]);
    let sems = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const fetchsemanddiv = async (courseid) => {
        let res = await fetch(`http://192.168.77.141:3443/fetchsemanddiv/${courseid}`, {
            method: 'GET',
            credentials: 'include'

        })

        res = await res.json();
        if (res.msg === "InvalidToken" || res.msg === "NoToken") {
            navigate('/');
            return;
        }
        // console.log(res);
        setSemester(res.data[0].no_of_semester);
    }

    const validateinputs = () => {
        let errorcounter = 0;
        let elements = document.getElementsByClassName('addsubjectitem');
        let errormsg = document.getElementsByClassName('selectprogramerrormsgitem');

        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            if (element.value === "" || element.value === "Select...") {
                element.style.borderColor = "red";
                errormsg[0].style.color = "red";
                errormsg[0].innerHTML = "Please Enter all the details";
            } else {
                element.style.borderColor = "black";

            }
        }

        if (errorcounter === 0) {
            checksubject();
        } else {
            errormsg[0].innerHTML = "";
        }
    }

    const checksubject = async () => {
        let errormsg = document.getElementsByClassName('selectprogramerrormsgitem');
        let res = await fetch(`http://192.168.77.141:3443/checksubject/${courseId}/${document.getElementsByClassName('inputitem')[1].value}/${document.getElementsByClassName('inputitem')[2].value}`, {
            method: 'GET',
            credentials: 'include'
        });
        res = await res.json();
        // console.log(res);
        if (res.msg === "InvalidToken" || res.msg === "NoToken") {
            navigate('/');
            return;
        }
        if (res.msg === "subjectinserted") {
            errormsg[0].innerHTML = "Subject Inserted Successfully";
            errormsg[0].style.color = "green";
            fetchsubjects();
        } else if (res.msg === "oldsubject") {
            errormsg[0].innerHTML = "Subject already exists";
            errormsg[0].style.color = "Red";
        }
    }

    const deletesubject = async (index, e) => {
        // console.log(subject[index]);
        let res = await fetch(`http://192.168.77.141:3443/deletesubject/${subject[index].subject_id}`, {
            method: 'GET',
            credentials: 'include'

        })

        res = await res.json();
        // console.log(res);
        if (res.msg === "InvalidToken" || res.msg === "NoToken") {
            navigate('/');
            return;
        }
        if (res.msg === "subjectdeleted") {
            fetchsubjects();
        }
    }

    const validatefiltersubject = () => {
        let element = document.getElementsByClassName('ddinputitem');
        // console.log(element[2].value);
        if (element[2].value !== "Select...") {
            filterbycourses();
        }

    }

    const filterbycourses = async () => {
        let element = document.getElementsByClassName('ddinputitem');
        let res = await fetch(`http://192.168.77.141:3443/filterbycourses/${courseId}/${element[3].value}`, {
            method: 'GET',
            credentials: 'include'

        })
        res = await res.json();
        // console.log(res);
        if (res.msg === "InvalidToken" || res.msg === "NoToken") {
            navigate('/');
            return;
        }
        if (res.msg === "filtersfetched") {
            setSubjects(res.data);
        }
    }
    useEffect(() => {
        let ele = document.getElementsByClassName('sidebarmaincontainer')[0]
        if (ele.classList.contains('sidebaractive')) {
            ele.classList.remove('sidebaractive')
        }
        fetchcourses();
        fetchsubjects();
    }, []);

    return (
        <>
            <div className="insertsubjectmaincontainer">
                <div className="insertsubjectchildcontainer">
                    <div className="selectsubjectcontainer">
                        <div className="selectsubjectcontainerheader">
                            <p className='insertsubjecttheader'>Add Subject</p>
                        </div>
                        <div className="selectsubjectcontainerinputlist">
                            <div className="selectprograminputitem">
                                <p>Select Course </p>
                                <select className='inputitem ddinputitem addsubjectitem' onChange={(e) => { fetchCourseId(e); }}>
                                    <option value='Select...' >Select...</option>
                                    {courses.map((data, index) => (
                                        <>
                                            <option value={data.course_name}>{data.course_name}</option>
                                        </>
                                    ))}
                                </select>
                            </div>
                            <div className="selectprograminputitem">
                                <p>Semester </p>
                                <select className='inputitem ddinputitem addsubjectitem' onChange={(e) => { }}>
                                    <option value="Select...">Select...</option>
                                    {sems.map((item, index) => (
                                        <>
                                            {item <= semester ? <option value={item}>{item}</option> : null}
                                        </>
                                    ))}
                                </select>
                            </div>
                            <div className="selectprograminputitem">
                                <p>Subject Name </p>
                                <input className='inputitem addsubjectitem' type="text" name="" id="" />
                            </div>
                            <div className="insertsubjectdetailsinputbuttondiv">
                                <button className="insertsubjectdetailsinputbtn" onClick={validateinputs}>
                                    <p>Add</p>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="selectprogramerrormsg">
                        <p className='selectprogramerrormsgitem'></p>
                    </div>
                    <div className="insertsubjectfilterandtable">
                        <div className="insertsubjectaddfiltersectioncontainer">
                            <div className="insertsubjectfiltersectionheader">
                                <p>Filter Subject</p>
                            </div>
                            <div className="insertsubjectfiltersectioninputdiv">
                                <div className="selectprograminputitem">
                                    <p>Select Course </p>
                                    <select className='inputitem ddinputitem' onChange={(e) => {
                                        fetchCourseId(e);
                                    }}>
                                        <option value='Select...' >Select...</option>
                                        {courses.map((data, index) => (
                                            <>
                                                <option value={data.course_name}>{data.course_name}</option>
                                            </>
                                        ))}
                                    </select>
                                </div>
                                <div className="selectprograminputitem">
                                    <p>Semester </p>
                                    <select className='inputitem ddinputitem' >
                                        <option value="Select...">Select...</option>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                        <option value="5">5</option>
                                        <option value="6">6</option>
                                    </select>
                                </div>
                                <div className="insertsubjectdetailsinputbuttondiv">
                                    <button className="insertsubjectdetailsinputbtn" onClick={validatefiltersubject}>
                                        <p>Submit</p>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="insertsubjectfiltertablecontainer">
                            <table  >
                                <tr >
                                    <th>Sr no.</th>
                                    <th>Subject Name</th>
                                    <th>Course Name</th>
                                    <th>Semester</th>
                                    <th>Delete</th>
                                </tr>
                                {subject.map((item, index) => (
                                    <tr>
                                        <td>{index + 1}</td>
                                        <td className='subjectname' >{item.subject_name}</td>
                                        <td className='coursename'>{item.course_name}</td>
                                        <td className='semester'>{item.semester}</td>
                                        <td><button onClick={(e) => { deletesubject(index, e) }} className='deletebtn'>Delete</button></td>
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

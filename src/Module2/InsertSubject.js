import React, { useEffect, useState } from 'react'
import './Css/Insertsubject.css'
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
export default function InsertSubject() {

    const [courses, setCourses] = useState([]);
    const [courseId, setCourseId] = useState();
    const [courseIdFilter, setCourseIdFilter] = useState();
    const [subject, setSubjects] = useState([]);
    const [semester, setSemester] = useState([]);
    const [semesterForFilter, setSemesterForFilter] = useState([]);
    let sems = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    const navigate = useNavigate()

    const fetchcourses = async () => {
        let res = await fetch(`http://localhost:3443/fetchcourses`, {
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
        let res = await fetch('http://localhost:3443/fetchsubjects', {
            method: 'GET',
            credentials: 'include'
        });

        res = await res.json();

        if (res.length === 0) {
            toast.error("Subjects not found");
            setSubjects([]);
            document.getElementsByClassName('inputitem')[4].selectedIndex = 0;
            document.getElementsByClassName('inputitem')[4].disabled = true;
        }

        if (res.msg === "InvalidToken" || res.msg === "NoToken") {
            navigate('/');
            return;
        }
        setSubjects(res);

    }

    const fetchCourseId = async (e) => {
        if (e.target.selectedIndex === 0) {
            document.getElementsByClassName('inputitem')[1].disabled = true;
            return;
        }
        let res = await fetch(`http://localhost:3443/fetchcourseid/${e.target.value}`, {
            method: 'GET',
            credentials: 'include'

        });

        res = await res.json();
        if (res.msg === "InvalidToken" || res.msg === "NoToken") {
            navigate('/');
            return;
        }

        if (res !== "error") {

            setCourseId(res[0].course_id);
            fetchsemanddiv(res[0].course_id);
            document.getElementsByClassName('inputitem')[1].disabled = false;
        }
    }

    const fetchCourseIdforFilter = async (e) => {
        if (e.target.selectedIndex === 0) {
            document.getElementsByClassName('inputitem')[4].disabled = true;
            return;
        }
        let res = await fetch(`http://localhost:3443/fetchcourseid/${e.target.value}`, {
            method: 'GET',
            credentials: 'include'

        });

        res = await res.json();
        if (res.msg === "InvalidToken" || res.msg === "NoToken") {
            navigate('/');
            return;
        }

        if (res !== "error") {

            setCourseId(res[0].course_id);
            fetchsemanddivforfilter(res[0].course_id);
            document.getElementsByClassName('inputitem')[4].disabled = false;
        }
    }

    const fetchsemanddiv = async (courseid) => {
        let res = await fetch(`http://localhost:3443/fetchsemanddiv/${courseid}`, {
            method: 'GET',
            credentials: 'include'

        })

        res = await res.json();
        if (res.msg === "InvalidToken" || res.msg === "NoToken") {
            navigate('/');
            return;
        }
        setSemester(res.data[0].no_of_semester);
    }

    const fetchsemanddivforfilter = async (courseid) => {
        let res = await fetch(`http://localhost:3443/fetchsemanddiv/${courseid}`, {
            method: 'GET',
            credentials: 'include'

        })

        res = await res.json();
        if (res.msg === "InvalidToken" || res.msg === "NoToken") {
            navigate('/');
            return;
        }
        setSemesterForFilter(res.data[0].no_of_semester);
    }

    const validateinputs = () => {
        let errorcounter = 0;
        let elements = document.getElementsByClassName('addsubjectitem');

        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            if (element.value === "" || element.value === "Select...") {
                element.style.borderColor = "red";
                toast.error("Please Enter all the details")
            } else {
                element.style.borderColor = "black";
            }
        }

        if (errorcounter === 0) {
            checksubject();
        }
    }

    const checksubject = async () => {
        let res = await fetch(`http://localhost:3443/checksubject/${courseId}/${document.getElementsByClassName('inputitem')[1].value}/${document.getElementsByClassName('inputitem')[2].value}`, {
            method: 'GET',
            credentials: 'include'
        });
        res = await res.json();
        if (res.msg === "InvalidToken" || res.msg === "NoToken") {
            navigate('/');
            return;
        }
        if (res.msg === "subjectinserted") {
            toast.success("Subject Inserted Successfully")
            fetchsubjects();
        } else if (res.msg === "oldsubject") {
            toast.error("Subject already exists")
        }
    }

    const deletesubject = async (index, e) => {
        let res = await fetch(`http://localhost:3443/deletesubject/${subject[index].subject_id}`, {
            method: 'GET',
            credentials: 'include'

        })

        res = await res.json();
        if (res.msg === "InvalidToken" || res.msg === "NoToken") {
            navigate('/');
            return;
        }
        if (res.msg === "subjectdeleted") {
            toast.success("Subject Deleted Successfully!")
            fetchsubjects();
        }
    }

    const validatefiltersubject = () => {
        let element = document.getElementsByClassName('ddinputitem');
        if (element[2].value !== "Select...") {
            filterbycourses();
        }

    }

    const filterbycourses = async () => {
        let element = document.getElementsByClassName('ddinputitem');
        let res = await fetch(`http://localhost:3443/filterbycourses/${courseId}/${element[3].value}`, {
            method: 'GET',
            credentials: 'include'

        })
        res = await res.json();
        if (res.msg === "InvalidToken" || res.msg === "NoToken") {
            navigate('/');
            return;
        }

        if (res.msg === "norecordsfound") {
            toast.error("Records not found!");
            return;
        }
        else if (res.msg === "filtersfetched") {
            toast.success("Fetched Successfully!")
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
            <ToastContainer />
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
                                        <option key={index} value={data.course_name}>{data.course_name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="selectprograminputitem">
                                <p>Semester </p>
                                <select className='inputitem ddinputitem addsubjectitem' disabled onChange={(e) => { }}>
                                    <option value="Select..." >Select...</option>
                                    {sems.map((item, index) => (
                                        item <= semester ? <option key={index} value={item}>{item}</option> : null
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
                    <div className="insertsubjectfilterandtable">
                        <div className="insertsubjectaddfiltersectioncontainer">
                            <div className="insertsubjectfiltersectionheader">
                                <p>Filter Subject</p>
                            </div>
                            <div className="insertsubjectfiltersectioninputdiv">
                                <div className="selectprograminputitem">
                                    <p>Select Course </p>
                                    <select className='inputitem ddinputitem' onChange={(e) => {
                                        fetchCourseIdforFilter(e);
                                    }}>
                                        <option value='Select...' >Select...</option>
                                        {courses.map((data, index) => (
                                            <option key={index} value={data.course_name}>{data.course_name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="selectprograminputitem">
                                    <p>Semester </p>
                                    <select disabled className='inputitem ddinputitem' >
                                        <option value="Select..." >Select...</option>
                                        {sems.map((item, index) => (
                                            item <= semesterForFilter ? <option key={index} value={item}>{item}</option> : null
                                        ))}
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
                                    <tr key={index}>
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

import React, { useState, useEffect } from 'react'
import './Css/GenerateReport.css'
import * as XLSX from 'xlsx';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
export default function GenerateReport() {
    const [courses, setCourses] = useState([]);
    const [courseId, setCourseId] = useState();
    const [subjects, setSubjects] = useState([]);
    const [subjectId, setSubjectId] = useState();
    const [studentData, setStudentData] = useState([]);
    const [subjectCode, setSubjectCode] = useState();
    const [facultyName, setFacultyName] = useState();
    const navigate = useNavigate()
    const fetchcourses = async () => {
        let res = await fetch(`http://localhost:3443/fetchcourses`, {
            method: 'GET',
            credentials: 'include'
        })
        res = await res.json();
        if (res.msg === "InvalidToken" || res.msg === "NoToken") {
            navigate('/');
            return;
        }
        if (res !== "error") {
            setCourses(res);
        }
    }

    const fetchCourseId = async (e) => {
        setSubjects([]);
        let elements = document.getElementsByClassName('inputitem');
        elements[5].disabled = true;
        elements[4].value = "Select...";
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
        }
    }


    const [semester, setSemester] = useState([]);
    const [division, setDivision] = useState([]);
    let divs = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    let sems = [1, 2, 3, 4, 5, 6, 7, 8, 9];
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
        // // (res);
        setSemester(res.data[0].no_of_semester);
        setDivision(res.data[0].no_of_division);
    }

    const fetchSubjects = async (e) => {
        let res = await fetch(`http://localhost:3443/fetchsubjects/${courseId}/${e.target.value}`, {
            method: 'GET',
            credentials: 'include'

        });
        res = await res.json();

        if (res.length === 0) {
            toast.error('Subjects not found!')
            setSubjects([]);
            document.getElementsByClassName('inputitem')[5].selectedIndex = 0;
            document.getElementsByClassName('inputitem')[5].disabled = true;
        }

        if (res.msg === "InvalidToken" || res.msg === "NoToken") {
            navigate('/');
            return;
        }

        if (res !== "error") {
            setSubjects(res);
        }
    }

    const fetchSubjectId = async (e) => {
        let res = await fetch(`http://localhost:3443/fetchsubjectid/${e.target.value}`, {
            method: 'GET',
            credentials: 'include'

        });
        res = await res.json();
        if (res.msg === "InvalidToken" || res.msg === "NoToken") {
            navigate('/');
            return;
        }
        // // (res);

        if (res !== "error") {
            setSubjectId(res[0].subject_id);
        }

    }
    const validateInputs = () => {
        let elements = document.getElementsByClassName('inputitem');
        let errorcounter = 0;
        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            if (element.value === "Select..." || element.value === "") {
                errorcounter++;
                element.style.borderColor = "red";
                toast.error("Please fill the details!");
            } else {
                element.style.borderColor = "#acacac";
            }
        }

        if (errorcounter === 0) {

            fetchprogramid();
        }

    }
    const fetchprogramid = async () => {
        let data = {
            exam_pattern: document.getElementsByClassName('inputitem')[0].value,
            course_id: courseId,
            year: document.getElementsByClassName('inputitem')[2].value,
            division: document.getElementsByClassName('inputitem')[3].value,
            semester: document.getElementsByClassName('inputitem')[4].value,
            subject_id: subjectId,
        }

        let res = await fetch('http://localhost:3443/fetchprogramidforreport', {
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
        if (res.msg === "notfound") {
            toast.error("Data does not exit !")
        } else {
            document.querySelector('.generatereportmaincontainer').style.display = "flex";
            setSubjectCode(res.data[0].subject_code);
            setFacultyName(res.data[0].faculty_name);
            setStudentData(res.data2);
            let ddelements = document.getElementsByClassName('inputitem');
            let elements = document.getElementsByClassName('reportheader');
            elements[0].innerHTML = `Subject Name : ${ddelements[5].value}`;
            elements[1].innerHTML = `Class : ${ddelements[2].value} ${ddelements[1].value}-${ddelements[3].value} `;
            elements[2].innerHTML = `Subject Code : ${res.data[0].subject_code}`;
            elements[3].innerHTML = `Semester : ${ddelements[4].value}`;
        }
    }

    const fetchDataAndExport = async () => {
        try {
            const workbook = XLSX.utils.book_new();
            const worksheet = XLSX.utils.aoa_to_sheet([]); // Create an empty sheet
            let ddelements = document.getElementsByClassName('inputitem');
            // Add custom details at the top
            const headers = [
                [`Subject: ${ddelements[5].value}`],      // Third row
                [`Subject Code: ${subjectCode}`],       // First row
                [`Class: ${ddelements[2].value} ${ddelements[1].value}-${ddelements[3].value}`],           // Second row
                [`Semester: ${ddelements[4].value}`],      // Third row
                [`Faculty name:${facultyName}`],      // Third row
                [],                        // Blank row for spacing
                ["Roll No", "Q1", "Q2", "Q3", "Q4", "Q5", "Total", "Total(in words)"],      // Table header
            ];

            XLSX.utils.sheet_add_aoa(worksheet, headers, { origin: "A1" });

            // Add table data starting from the 6th row
            const tableData = studentData.map((item) => [item.student_rollno, item.q1, item.q2, item.q3, item.q4, item.q5, item.total, item.total_in_words]);
            XLSX.utils.sheet_add_aoa(worksheet, tableData, { origin: "A8" });

            // Append the sheet to the workbook
            XLSX.utils.book_append_sheet(workbook, worksheet, "Student Marks");

            // Generate and download the Excel file
            XLSX.writeFile(workbook, "Student_Marks.xlsx");
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    useEffect(() => {
        let ele = document.getElementsByClassName('sidebarmaincontainer')[0]
        if (ele.classList.contains('sidebaractive')) {
            ele.classList.remove('sidebaractive')
        }
    }, [])

    return (
        <>
            <ToastContainer />
            <div className="insertmarkmodulesmaincontainer">
                <div className="insertmarksmodulechildcontainer">
                    <div className="selectprogrammaincontainer">
                        <div className="selectprogramheader">
                            <p>Select Program</p>
                        </div>
                        <div className="selectprograminputlist">
                            <div className="selectprograminputitem">
                                <p>Examination Pattern</p>
                                <select className='inputitem ddinputitem' onChange={() => {
                                    let elements = document.getElementsByClassName('inputitem');
                                    elements[1].disabled = false;
                                    fetchcourses();
                                }} >
                                    <option value="Select...">Select...</option>
                                    <option value="Regular">Regular</option>
                                    <option value="ATKT">ATKT</option>
                                </select>
                            </div>
                            <div className="selectprograminputitem">
                                <p>Course Name</p>
                                <select disabled className='inputitem ddinputitem' onChange={(e) => {
                                    fetchCourseId(e);
                                    let elements = document.getElementsByClassName('inputitem');
                                    elements[2].disabled = false;
                                }}>
                                    <option value='Select...' >Select...</option>
                                    {courses.map((data, index) => (
                                        <option key={index} value={data.course_name}>{data.course_name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="selectprograminputitem">
                                <p>Year</p>
                                <select disabled className='inputitem ddinputitem' onChange={() => {
                                    let elements = document.getElementsByClassName('inputitem');
                                    elements[3].disabled = false;
                                }}>
                                    <option value="Select...">Select...</option>
                                    <option value="FY">FY</option>
                                    <option value="SY">SY</option>
                                    <option value="TY">TY</option>
                                </select>
                            </div>
                            <div className="selectprograminputitem">
                                <p>Division</p>
                                <select disabled className='inputitem ddinputitem' onChange={() => {
                                    let elements = document.getElementsByClassName('inputitem');
                                    elements[4].disabled = false;
                                }}>
                                    <option value="Select...">Select...</option>
                                    {divs.map((item, index) => (
                                        index < division ? <option key={index} value={item}>{item}</option> : null
                                    ))}
                                </select>
                            </div>
                            <div className="selectprograminputitem">
                                <p>Semester</p>
                                <select disabled className='inputitem ddinputitem' onChange={(e) => {
                                    let elements = document.getElementsByClassName('inputitem');
                                    elements[5].disabled = false;
                                    fetchSubjects(e)
                                }}>
                                    <option value="Select...">Select...</option>
                                    {sems.map((item, index) => (
                                        item <= semester ? <option key={index} value={item}>{item}</option> : null
                                    ))}
                                </select>
                            </div>
                            <div className="selectprograminputitem">
                                <p>Subject Name</p>
                                <select disabled className='inputitem ddinputitem' onChange={(e) => {
                                    fetchSubjectId(e)
                                }}>
                                    <option value="Select...">Select...</option>
                                    {subjects.map((data, index) => (
                                        <option key={index} value={data.subject_name}>{data.subject_name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="selectprogramsubmitbtncontainer">
                            <div className="selectprogramsubmitbtn" onClick={validateInputs}>
                                <p>Submit</p>
                            </div>
                        </div>
                    </div>
                    <div className="generatereportmaincontainer">
                        <div className="generatereportheader">
                            <label>Report</label>
                        </div>
                        <div className="generatereportitems">
                            <div className="generatereportshowitem">
                                <label className='reportheader'>Subject Name : Core Java</label>
                                <label className='reportheader'>Class : TY BSCIT A </label>
                            </div>
                            <div className="generatereportshowitem">
                                <label className='reportheader'>Subject Code : UTSPO1</label>
                                <label className='reportheader'> Semester : 2 </label>
                            </div>
                            <div className="generatereportshowitem" onClick={fetchDataAndExport}>
                                <button className='downloadbtn'>Download Report</button>
                            </div>
                        </div>
                        <div className="generatereporttablesection">
                            <table>
                                <tr className='tableheader'>
                                    <th>Roll No.</th>
                                    <th>Q1</th>
                                    <th>Q2</th>
                                    <th>Q3</th>
                                    <th>Q4</th>
                                    <th>Q5</th>
                                    <th>Total</th>
                                    <th>Total(in words)</th>
                                </tr>
                                {studentData.map((item, index) => (
                                    <tr>
                                        <td>{item.student_rollno}</td>
                                        <td>{item.q1}</td>
                                        <td>{item.q2}</td>
                                        <td>{item.q3}</td>
                                        <td>{item.q4}</td>
                                        <td>{item.q5}</td>
                                        <td>{item.total}</td>
                                        <td>{item.total_in_words}</td>
                                    </tr>
                                ))}
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </ >
    )
}

import React, { useEffect, useState } from 'react'

export default function Insertmarks() {
    const [courses, setCourses] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [courseId, setCourseId] = useState();
    const [subjectId, setSubjectId] = useState();
    const [programId, setProgramId] = useState();


    const fetchcourses = async () => {
        let res = await fetch(`http://localhost:4000/fetchcourses`, {
            method: 'GET'
        });

        res = await res.json();

        if (res !== "error") {
            setCourses(res);
        }
    }

    const fetchCourseId = async (e) => {
        setSubjects([]);
        let elements = document.getElementsByClassName('inputitem');
        elements[5].disabled = true;
        elements[4].value = "Select...";
        let res = await fetch(`http://localhost:4000/fetchcourseid/${e.target.value}`, {
            method: 'GET'
        });

        res = await res.json();

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
        let res = await fetch(`http://localhost:4000/fetchsemanddiv/${courseid}`, {
            method: 'GET'
        })

        res = await res.json();
        setSemester(res.data[0].no_of_semester);
        setDivision(res.data[0].no_of_division);
    }

    const fetchSubjects = async (e) => {
        let res = await fetch(`http://localhost:4000/fetchsubjects/${courseId}/${e.target.value}`, {
            method: 'GET'
        });

        res = await res.json();

        if (res !== "error") {
            setSubjects(res);
        }
    }

    const fetchSubjectId = async (e) => {
        let res = await fetch(`http://localhost:4000/fetchsubjectid/${e.target.value}`, {
            method: 'GET'
        });

        res = await res.json();
        // console.log(res);

        if (res !== "error") {
            setSubjectId(res[0].subject_id);
        }

    }

    const validateInputs = () => {
        let elements = document.getElementsByClassName('inputitem');
        let errormsg = document.querySelector('.selectprogramerrormsgitem');
        let errorcounter = 0;
        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            if (element.value === "Select..." || element.value === "") {
                errorcounter++;
                element.style.borderColor = "red";
                errormsg.innerHTML = "Please fill the details!"
                errormsg.style.color = "Red"
            } else {
                errormsg.innerHTML = ""
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
            subject_code: document.getElementsByClassName('inputitem')[6].value,
            faculty_name: document.getElementsByClassName('inputitem')[7].value
        }
        // console.log("hey");

        let res = await fetch('http://localhost:4000/fetchprogramid', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                Accept: "application/json",
                "Content-type": "application/json",
            },
        });

        res = await res.json();
        // console.log(res);

        if (res.msg === "found") {
            document.querySelector('.overlay').style.display = "flex";
            document.querySelector('.popupbox').style.display = "flex";
            setProgramId(res.data[0].program_id);
            // programid = res.data[0].program_id;
        } else if (res.msg === "notfound") {
            let res = await fetch('http://localhost:4000/insertprogramdata', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    Accept: "application/json",
                    "Content-type": "application/json",
                },
            });
            res = await res.json();
            if (res.msg === "Inserted") {
                let errormsg = document.querySelector('.selectprogramerrormsgitem');
                errormsg.style.color = "Green"
                errormsg.innerHTML = "Data Inserted Successfully!"
            }
        }
    }

    const overrideprogramdata = async () => {
        // console.log(document.getElementsByClassName('inputitem')[0].value);
        let data = {
            program_id: programId,
            exam_pattern: document.getElementsByClassName('inputitem')[0].value,
            course_id: courseId,
            year: document.getElementsByClassName('inputitem')[2].value,
            division: document.getElementsByClassName('inputitem')[3].value,
            semester: document.getElementsByClassName('inputitem')[4].value,
            subject_id: subjectId,
            subject_code: document.getElementsByClassName('inputitem')[6].value,
            faculty_name: document.getElementsByClassName('inputitem')[7].value
        }
        let res = await fetch('http://localhost:4000/overrideprogramdata', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                Accept: "application/json",
                "Content-type": "application/json",
            },
        });
        res = await res.json();
        if (res.msg === "Inserted") {
            let errormsg = document.querySelector('.selectprogramerrormsgitem');
            errormsg.style.color = "Green"
            errormsg.innerHTML = "Data Inserted Successfully!"
        }
    }

    const validatequestioninput = () => {
        let errorcount = 0;
        const element = document.getElementsByClassName('qitem');
        const errormsg = document.getElementsByClassName('qerrormsg');

        for (let i = 0; i < element.length; i++) {
            if (element[i].value === "") {
                errorcount++;
                element[i].style.borderColor = "red";
            } else {
                element[i].style.borderColor = "#acacac";
            }
        }
        if (errorcount === 0) {
            errormsg[0].innerHTML = "";
            insertmarksdetails();
        } else {
            errormsg[0].innerHTML = "Please fill the details !"
            errormsg[0].style.color = "red";
            return;
        }

        for (let i = 0; i < element.length; i++) {
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
            errormsg[0].style.color = "red";
            errormsg[0].innerHTML = "Please Enter a Number!";
        } else {
            errormsg[0].innerHTML = "";
        }
    }
    const insertmarksdetails = async () => {
        let data = {
            rno: document.getElementsByClassName('rno')[0].value,
            qone: document.getElementsByClassName('qone')[0].value,
            qtwo: document.getElementsByClassName('qtwo')[0].value,
            qthree: document.getElementsByClassName('qthree')[0].value,
            qfour: document.getElementsByClassName('qfour')[0].value,
            qfive: document.getElementsByClassName('qfive')[0].value,
            program_id: programId
        }
        let res = await fetch('http://localhost:4000/insertmarksdetail', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                Accept: "application/json",
                "Content-type": "application/json",
            },
        });
        res = await res.json();
        // console.log(res);
        if (res.msg === "Inserted marks") {
            let elements = document.getElementsByClassName('qitem');
            for (let i = 0; i < elements.length; i++) {
                const element = elements[i];
                element.value = "";
            }
        }

    }
    useEffect(() => {
        fetchcourses();
    }, []);

    return (
        <>
            <div className="overlay">
            </div>
            <div className="popupcontainer">
                <div className="popupbox">
                    <div className="popupboxsection1">
                        <p>Record already exists! Are you sure you want to override the existing record?</p>
                    </div>
                    <div className="popupboxsection2">
                        <div className="selectprogramprevbtn" onClick={() => {
                            document.querySelector('.overlay').style.display = "none";
                            document.querySelector('.popupbox').style.display = "none";
                        }}>
                            No
                        </div>
                        <div className="selectprogramsubmitbtn" onClick={() => {
                            document.querySelector('.overlay').style.display = "none";
                            document.querySelector('.popupbox').style.display = "none";
                            overrideprogramdata();
                        }}>
                            Yes
                        </div>
                    </div>
                </div>
            </div>
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
                                        <>
                                            <option value={data.course_name}>{data.course_name}</option>
                                        </>
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
                                        <>
                                            {index < division ? <option value={item}>{item}</option> : null}
                                        </>
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
                                        <>
                                            {item <= semester ? <option value={item}>{item}</option> : null}
                                        </>
                                    ))}
                                </select>
                            </div>
                            <div className="selectprograminputitem">
                                <p>Subject Name</p>
                                <select disabled className='inputitem ddinputitem' onChange={(e) => {
                                    let elements = document.getElementsByClassName('inputitem');
                                    elements[6].style.backgroundColor = "#F8F2F2"
                                    elements[7].style.backgroundColor = "#F8F2F2"
                                    elements[6].disabled = false;
                                    elements[7].disabled = false;
                                    fetchSubjectId(e)
                                }}>
                                    <option value="Select...">Select...</option>
                                    {subjects.map((data, index) => (
                                        <>
                                            <option value={data.subject_name}>{data.subject_name}</option>
                                        </>
                                    ))}
                                </select>
                            </div>
                            <div className="selectprograminputitem">
                                <p>Subject Code</p>
                                <input type="text" disabled className='inputitem textinputitem' />
                            </div>
                            <div className="selectprograminputitem">
                                <p>Faculty Name</p>
                                <input type="text" disabled className='inputitem textinputitem' />
                            </div>
                        </div>
                        <div className="selectprogramsubmitbtncontainer">
                            <button className="selectprogramsubmitbtn insertdatabtn" onClick={validateInputs}>
                                <p>Submit</p>
                            </button>
                            <div className="selectprogramerrormsg">
                                <p className='selectprogramerrormsgitem'></p>
                            </div>
                        </div>
                    </div>
                    <div className="insertmarksmaincontainer">
                        <div className="selectprogramheader">
                            <p>Insert Marks</p>
                        </div>
                        <div className="selectprograminputlist insertmarksinputlist">
                            <div className="selectprograminputitem selectprograminputrollnoitem">
                                <p>Roll no</p>
                                <input type="text" className='qitem rno' />
                            </div>
                            <div className="selectprograminputitem">
                                <p>Question 1</p>
                                <input type="text" className='qitem qone' />
                            </div>
                            <div className="selectprograminputitem">
                                <p>Question 2</p>
                                <input type="text" className='qitem qtwo' />
                            </div>
                            <div className="selectprograminputitem">
                                <p>Question 3</p>
                                <input type="text" className='qitem qthree' />
                            </div>
                            <div className="selectprograminputitem">
                                <p>Question 4</p>
                                <input type="text" className='qitem qfour' />
                            </div>
                            <div className="selectprograminputitem">
                                <p>Question 5</p>
                                <input type="text" className='qitem qfive' />
                            </div>
                        </div>
                        <div className="insertmarkssubmitbtncontainer">
                            {/* <div className="selectprogramprevbtn">
                                <p>Prev</p>
                            </div> */}
                            <div className="selectprogramsubmitbtn " onClick={validatequestioninput}>
                                <p>Next</p>
                            </div>
                            <p className='qerrormsg'></p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

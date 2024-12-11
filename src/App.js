// import { Route } from "react-router-dom";
import LoginPage from "./Module1/LoginPage";
import GenerateReport from "./Module2/GenerateReport";
import Insertmarks from "./Module2/Insertmarks";
import InsertStudentMarks from "./Module2/InsertStudentMarks";
import Insertsubject from "./Module2/InsertSubject";
import ManageUsers from "./Module2/ManageUsers";
import Sidebar from './Module2/Sidebar'
import ManageProgram from "./Module2/ManageProgram";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/dashboard" element={<Sidebar />}>
            <Route path='/dashboard/insertsubject' element={< Insertsubject />} />
            <Route path='/dashboard/insertprogram' element={< Insertmarks />} />
            <Route path='/dashboard/insertmarks' element={< InsertStudentMarks />} />
            <Route path='/dashboard/generatereport' element={< GenerateReport />} />
            <Route path='/dashboard/manageusers' element={<ManageUsers />} />
            <Route path='/dashboard/manageprogram' element={<ManageProgram />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

// import { Route } from "react-router-dom";
import LoginPage from "./Module1/LoginPage";
import GenerateReport from "./Module2/GenerateReport";
import Insertmarks from "./Module2/Insertmarks";
import InsertStudentMarks from "./Module2/InsertStudentMarks";
import Sidebar from './Module2/Sidebar'
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/dashboard" element={<Sidebar />}>
            <Route path='/dashboard/insertprogram' element={< Insertmarks />} />
            <Route path='/dashboard/insertmarks' element={< InsertStudentMarks />} />
            <Route path='/dashboard/generatereport' element={< GenerateReport />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

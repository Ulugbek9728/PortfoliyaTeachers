import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css"
import {QueryClient, QueryClientProvider} from "react-query";


import {Route, Routes} from "react-router-dom";
import Home from "./pages/Home";
import FacultyStatic from "./pages/facultyStatic";
import KafedraStatic from "./pages/kafedraStatic";
import Auth from "./pages/auth";
import TeachersDiogramm from "./pages/TeachersDiogramm";
import UniversitetStatic from "./pages/universitetStatic";
import Profile from "./pages/profile";


function App() {
    const client = new QueryClient();

    return (
        <QueryClientProvider client={client}>
            <ToastContainer/>

            <ToastContainer/>
            <Routes>
                <Route path={"/"} element={<Home/>}/>
                <Route path={"/auth/*"} element={ <Auth/>}/>
                <Route path={"/university/"} element={<UniversitetStatic/>}/>
                <Route path={"/faculties/*"} element={<FacultyStatic/>}/>
                <Route path={"/kafedra/*"} element={<KafedraStatic/>}/>
                <Route path={"/TeachersDiogramm/*"} element={<TeachersDiogramm/>}/>
                <Route path={"/profile/"} element={<Profile/>}/>

            </Routes>

        </QueryClientProvider>
    )
}

export default App;

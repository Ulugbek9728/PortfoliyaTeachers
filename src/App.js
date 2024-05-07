import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css"
import {QueryClient, QueryClientProvider} from "react-query";


import {Route, Routes} from "react-router-dom";
import Home from "./pages/Home";
import FacultyStatic from "./pages/facultyStatic";
import KafedraStatic from "./pages/kafedraStatic";
import Auth from "./pages/auth";
import TeachersDiogramm from "./pages/TeachersDiogramm";


function App() {
    const client = new QueryClient();

    return (
        <QueryClientProvider client={client}>
            <ToastContainer/>

            <ToastContainer/>
            <Routes>
                <Route path={"/"} element={<Home/>}/>
                <Route path={"/auth/*"} element={ <Auth/>}/>
                <Route path={"/faculties/*"} element={<FacultyStatic/>}/>
                <Route path={"/Kafedra/*"} element={<KafedraStatic/>}/>
                <Route path={"/TeachersDiogramm/*"} element={<TeachersDiogramm/>}/>

            </Routes>

        </QueryClientProvider>
    )
}

export default App;

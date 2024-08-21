import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css"
import {QueryClient, QueryClientProvider} from "react-query";
import {createBrowserRouter, RouterProvider,} from "react-router-dom";
import Home from "./pages/Home";
import FacultyStatic from "./pages/facultyStatic";
import KafedraStatic from "./pages/kafedraStatic";
import Auth from "./pages/auth";
import TeachersDiogramm from "./pages/TeachersDiogramm";
import UniversitetStatic from "./pages/universitetStatic";
import Profile from "./pages/profile/profile";
import PageNotFound from "./pages/PageNotFound";
import Admin from "./pages/admin/admin";


const router = createBrowserRouter([

    {
        path: "/",
        element: (<Home/>),
        errorElement:<PageNotFound/>
    },
    {
        path: "/auth",
        element: (<Auth/>),
        children:[
            {
                path: "/auth/:id",
                element: (<Auth/>),
            },
        ]
    },
    {
        path: "/university",
        element: (<UniversitetStatic/>),
    },
    {
        path: "/faculties",
        element: (<FacultyStatic/>),
        children:[
            {
                path: "/faculties/:id",
                element: (<FacultyStatic/>),
            },
        ]
    },
    {
        path: "/kafedra",
        element: (<KafedraStatic/>),
        children:[
            {
                path: "/kafedra/:id",
                element: (<KafedraStatic/>),
            },
        ]
    },
    {
        path: "/teacher_info",
        element: (<TeachersDiogramm/>),
        children:[
            {
                path: "/teacher_info/:id",
                element: (<TeachersDiogramm/>),
            },
        ]
    },
    {
        path:'/profile/*',
        element:<Profile/>,
    },
    {
        path:'/pertfolia_admin/*',
        element:<Admin/>,
    },

]);

function App() {
    const client = new QueryClient();

    return (
        <QueryClientProvider client={client}>
            <ToastContainer/>
            <RouterProvider router={router}/>
        </QueryClientProvider>
    )
}

export default App;

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
import Fakulty from "./pages/fakulty/fakulty";
import TeachersInfo from "./pages/admin/TeachersInfo";
import Dekan from "./pages/dekan/dekan";


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
        path:'/dashboard-fakultyadm/*',
        element:<Dekan/>,
    },
    {
        path:'/dashboard-admin/*',
        element:<Admin/>,
    },
    {
        path: "/userInfo",
        element: (<TeachersInfo/>),
        children:[
            {
                path: "/userInfo/:id",
                element: (<TeachersInfo/>),
            },
        ]
    },
]);

const client = new QueryClient(
    {
        defaultOptions:{
            queries: {
                refetchOnWindowFocus: false,
                refetchOnmount: false,
                refetchOnReconnect: false,
                retry: false,
                staleTime: 1000 * 60 * 60 * 24,
            }
        }
    }
);

function App() {

    return (
        <QueryClientProvider client={client}>
            <ToastContainer/>
            <RouterProvider router={router}/>
        </QueryClientProvider>
    )
}

export default App;

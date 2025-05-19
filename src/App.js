import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css"
import {QueryClient, QueryClientProvider} from "react-query";
import {createBrowserRouter, RouterProvider,} from "react-router-dom";
import Home from "./pages/Home";
import FacultyStatic from "./pages/facultyStatic";
import KafedraStatic from "./pages/kafedraStatic";
import Auth from "./pages/auth";
import UniversitetStatic from "./pages/universitetStatic";
import Profile from "./pages/profile/profile";
import PageNotFound from "./pages/PageNotFound";
import Admin from "./pages/admin/admin";
import TeachersInfo from "./pages/admin/TeachersInfo";
import Dekan from "./pages/fakulty/dekan";


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
        path: "/faculties/:id",
        element: (<FacultyStatic/>),
    },
    {
        path: "/kafedra/:id",
        element: (<KafedraStatic/>),
    },
    {
        path: "/teacher_info/:id",
        element: (<TeachersInfo/>),
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

// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard";
import Person from "@material-ui/icons/Person";
// import ContentPaste from "@material-ui/icons/ContentPaste";
import LibraryBooks from "@material-ui/icons/LibraryBooks";
import BubbleChart from "@material-ui/icons/BubbleChart";
import LocationOn from "@material-ui/icons/LocationOn";
import Notifications from "@material-ui/icons/Notifications";
//import Unarchive from "@material-ui/icons/Unarchive";
// core components/views
import DashboardPage from "views/Dashboard/Dashboard.jsx";
// import UserProfile from "views/UserProfile/UserProfile.jsx";
// import TableList from "views/TableList/TableList.jsx";
import Typography from "views/Typography/Typography.jsx";
import Icons from "views/Icons/Icons.jsx";
import Maps from "views/Maps/Maps.jsx";
import NotificationsPage from "views/Notifications/Notifications.jsx";
// import UpgradeToPro from "views/UpgradeToPro/UpgradeToPro.jsx";
import UserEdit from "views/UserEdit/UserEdit.jsx";
import UserList from "views/UserList/UserList.jsx";
import FaqList from "views/FaqList/FaqList.jsx";
import FaqEdit from "views/FaqEdit/FaqEdit.jsx";

const dashboardRoutes = [
  {
    path: "/dashboard",
    sidebarName: "Dashboard",
    navbarName: "Material Dashboard",
    icon: Dashboard,
    component: DashboardPage
  },
  {
    path: "/useredit",
    sidebarName: "Editar Usuário",
    navbarName: "Editar Usuário",
    icon: Person,
    component: UserEdit
  },
  {
    path: "/userlist",
    sidebarName: "Lista de Usuários",
    navbarName: "Lista de Usuários",
    icon: "content_paste",
    component: UserList
  },
  {
    path: "/faqedit",
    sidebarName: "Editar FAQ",
    navbarName: "Editar FAQ",
    icon: "question_answer",
    component: FaqEdit
  },
  {
    path: "/faqlist",
    sidebarName: "Lista de FAQ's",
    navbarName: "Lista de FAQ's",
    icon: "content_paste",
    component: FaqList
  },
  // {
  //   path: "/user",
  //   sidebarName: "User Profile",
  //   navbarName: "Profile",
  //   icon: Person,
  //   component: UserProfile
  // },
  // {
  //   path: "/table",
  //   sidebarName: "Table List",
  //   navbarName: "Table List",
  //   icon: "content_paste",
  //   component: TableList
  // },
  {
    path: "/typography",
    sidebarName: "Typography",
    navbarName: "Typography",
    icon: LibraryBooks,
    component: Typography
  },
  {
    path: "/icons",
    sidebarName: "Icons",
    navbarName: "Icons",
    icon: BubbleChart,
    component: Icons
  },
  {
    path: "/maps",
    sidebarName: "Maps",
    navbarName: "Map",
    icon: LocationOn,
    component: Maps
  },
  {
    path: "/notifications",
    sidebarName: "Notifications",
    navbarName: "Notifications",
    icon: Notifications,
    component: NotificationsPage
  },
  // {
  //   path: "/upgrade-to-pro",
  //   sidebarName: "Upgrade To PRO",
  //   navbarName: "Upgrade To PRO",
  //   icon: Unarchive,
  //   component: UpgradeToPro
  // },
  { redirect: true, path: "/", to: "/dashboard", navbarName: "Redirect" }
];

export default dashboardRoutes;

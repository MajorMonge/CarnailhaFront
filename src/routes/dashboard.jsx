// @material-ui/icons
import Home from "@material-ui/icons/Home";
import Person from "@material-ui/icons/Person";
import Bus from "@material-ui/icons/DirectionsBus";

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
import Caravans from "views/Caravans/Caravans.jsx";
import Typography from "views/Typography/Typography.jsx";
import Icons from "views/Icons/Icons.jsx";
import Maps from "views/Maps/Maps.jsx";
import NotificationsPage from "views/Notifications/Notifications.jsx";
// import UpgradeToPro from "views/UpgradeToPro/UpgradeToPro.jsx";
import User from "views/User/User.jsx";
import Faq from "views/Faq/Faq.jsx";

const dashboardRoutes = [
  {
    path: "/dashboard",
    sidebarName: "Início",
    navbarName: "Material Dashboard",
    icon: Home,
    component: DashboardPage
  },
  {
    path: "/user",
    sidebarName: "Usuários",
    navbarName: "Usuários",
    icon: Person,
    component: User
  },
  {
    path: "/caravans",
    sidebarName: "Caravanas",
    icon: Bus,
    navbarName: "Caravanas",
    component: Caravans
  },
  {
    path: "/faq",
    sidebarName: "FAQ",
    navbarName: "FAQ",
    icon: "question_answer",
    component: Faq
  },
  // {
  //   path: "/user",
  //   sidebarName: "User Profile",
  //   navbarName: "Profile",
  //   icon: Person,
  //   component: UserProfile
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
  { redirect: true, path: "/", to: "/dashboard", navbarName: "Redirect" }
];

export default dashboardRoutes;

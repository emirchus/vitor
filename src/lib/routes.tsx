import { AppRoute } from "@/interfaces/app-route";
import { BellIcon, GearIcon, HomeIcon } from "@radix-ui/react-icons";

export const AppRoutes: AppRoute[] = [
  {
    icon: <HomeIcon className="h-4 w-4" />,
    label: "Home",
    path: "/",
    exact: true
  },
  {
    icon: <GearIcon className="h-4 w-4" />,
    label: "Settings",
    path: "/settings"
  },
  {
    icon: <BellIcon className="h-4 w-4" />,
    label: "Notifications",
    path: "/notifications"
  }
];

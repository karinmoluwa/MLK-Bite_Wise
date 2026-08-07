export type NavigationItem = {
  label: string;
  href: string;
  icon: string;
};

export const primaryNavigation: NavigationItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: "DB",
  },
  {
    label: "Log meal",
    href: "/meal-log",
    icon: "LM",
  },
  {
    label: "Nutrition",
    href: "/nutrition",
    icon: "NT",
  },
  {
    label: "History",
    href: "/history",
    icon: "HI",
  },
  {
    label: "Recommendations",
    href: "/recommendations",
    icon: "RE",
  },
];

export const secondaryNavigation: NavigationItem[] = [
  {
    label: "Notifications",
    href: "/notifications",
    icon: "NO",
  },
  {
    label: "Settings",
    href: "/settings",
    icon: "SE",
  },
  {
    label: "Help",
    href: "/help",
    icon: "HE",
  },
];
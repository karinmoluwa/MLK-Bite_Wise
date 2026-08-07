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
    href: "/dashboard#meal",
    icon: "LM",
  },
  {
    label: "Nutrition",
    href: "/dashboard#nutrition",
    icon: "NT",
  },
  {
    label: "History",
    href: "/dashboard#history",
    icon: "HI",
  },
  {
    label: "Recommendations",
    href: "/dashboard#recommendations",
    icon: "RE",
  },
];

export const secondaryNavigation: NavigationItem[] = [
  {
    label: "Notifications",
    href: "/dashboard#notifications",
    icon: "NO",
  },
  {
    label: "Settings",
    href: "/dashboard#settings",
    icon: "SE",
  },
  {
    label: "Help",
    href: "/dashboard#help",
    icon: "HE",
  },
];
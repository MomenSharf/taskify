"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { cn } from "@/lib/utils";
import {
  BarChart3,
  Calendar,
  CheckSquare,
  FileText,
  FolderKanban,
  LayoutDashboard,
  LucideIcon,
  Pin,
  Settings,
  Settings2,
  Users,
} from "lucide-react";

import { useState } from "react";
import { Button } from "../ui/button";

type NavItemState = "selected" | "firstPending" | "secondPending" | "inMore";

type NavItem = {
  key: string;
  label: string;
  icon: LucideIcon;
  state: NavItemState;
};

const NAV_ITEMS: NavItem[] = [
  {
    key: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    state: "selected",
  },
  {
    key: "tasks",
    label: "Tasks",
    icon: CheckSquare,
    state: "firstPending",
  },
  {
    key: "projects",
    label: "Projects",
    icon: FolderKanban,
    state: "secondPending",
  },
  {
    key: "calendar",
    label: "Calendar",
    icon: Calendar,
    state: "inMore",
  },
  {
    key: "team",
    label: "Team",
    icon: Users,
    state: "inMore",
  },
  {
    key: "analytics",
    label: "Analytics",
    icon: BarChart3,
    state: "inMore",
  },
  {
    key: "files",
    label: "Files",
    icon: FileText,
    state: "inMore",
  },
  {
    key: "settings",
    label: "Settings",
    icon: Settings,
    state: "inMore",
  },
];

export default function NavSwitcher() {
  const [navItems, setNavItems] = useState(NAV_ITEMS);

  const swapState = (
    item: NavItem,
    current: NavItem,
    targetState: NavItemState,
  ) => {
    setNavItems((items) =>
      items.map((navItem) => {
        if (navItem.key === item.key) {
          return { ...navItem, state: targetState };
        }

        if (navItem.key === current.key) {
          return { ...navItem, state: item.state };
        }

        return navItem;
      }),
    );
  };

  const selectedItem = navItems.find((item) => item.state === "selected")!;

  const firstPendingItem = navItems.find(
    (item) => item.state === "firstPending",
  )!;

  const secondPendingItem = navItems.find(
    (item) => item.state === "secondPending",
  )!;

  const inMoreItems = navItems.filter((item) => item.state === "inMore");

  return (
    <div className="flex items-center justify-center gap-3 rounded-md  px-2 py-2">
      {[selectedItem, firstPendingItem, secondPendingItem].map((item) => (
        <Button
          key={item.key}
          size="icon"
          variant="ghost"
          className={cn(
            "flex h-10 w-10 cursor-pointer flex-col hover:bg-transparent hover:text-primary",
            {
              "h-14 w-14 border border-primary bg-primary/10 text-primary hover:bg-primary/10":
                item.state === "selected",
            },
          )}
          onClick={() => swapState(item, selectedItem, "selected")}
        >
          <item.icon
            className={cn("size-4", {
              "size-6": item.state === "selected",
            })}
          />
          <span className="text-xxs font-bold">{item.key}</span>
        </Button>
      ))}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="icon"
            variant="outline"
            className="flex h-10 w-10 flex-col"
          >
            <Settings2 className="size-4" />
            <span className="text-xxs font-bold">More</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-52">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Sections</DropdownMenuLabel>

            {inMoreItems.map((item) => (
              <DropdownMenuItem
                key={item.key}
                onSelect={() => swapState(item, selectedItem, "selected")}
              >
                <item.icon className="size-4" />

                <span className="flex-1">{item.label}</span>

                <div
                  className="group relative cursor-pointer p-1.5"
                  onClick={(e) => {
                    e.stopPropagation();
                    swapState(item, firstPendingItem, "firstPending");
                  }}
                >
                  <Pin className="size-3 group-hover:fill-muted-foreground group-hover:stroke-muted-foreground" />
                  <span className="absolute left-0 top-0 flex h-3 w-3 items-center justify-center text-xxs">
                    1
                  </span>
                </div>

                <div
                  className="group relative cursor-pointer p-1.5"
                  onClick={(e) => {
                    e.stopPropagation();
                    swapState(item, secondPendingItem, "secondPending");
                  }}
                >
                  <Pin className="size-3 group-hover:fill-muted-foreground group-hover:stroke-muted-foreground" />
                  <span className="absolute left-0 top-0 flex h-3 w-3 items-center justify-center text-xxs">
                    2
                  </span>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

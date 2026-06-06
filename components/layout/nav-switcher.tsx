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
  IconAdjustments,
  IconBrandGoogleAnalytics,
  IconFile,
  IconHome,
  IconPin,
  IconPlanet,
  IconProps,
  IconSettings,
  IconSparkle2,
  IconUsers
} from "@tabler/icons-react";
import { ComponentType, useState } from "react";
import { Button } from "../ui/button";

type NavItemState = "selected" | "firstPending" | "secondPending" | "inMore";

type NavItem = {
  key: string;
  label: string;
  icon: ComponentType<IconProps>;
  state: NavItemState;
};

const NAV_ITEMS: NavItem[] = [
  {
    key: "home",
    label: "Home",
    icon: IconHome,
    state: "selected",
  },
  {
    key: "spaces",
    label: "Spaces",
    icon: IconPlanet,
    state: "firstPending",
  },
  {
    key: "teams",
    label: "Teams",
    icon: IconUsers,
    state: "secondPending",
  },
  {
    key: "ai",
    label: "AI",
    icon: IconSparkle2,
    state: "inMore",
  },
  {
    key: "analytics",
    label: "Analytics",
    icon: IconBrandGoogleAnalytics,
    state: "inMore",
  },
  {
    key: "files",
    label: "Files",
    icon: IconFile,
    state: "inMore",
  },
  {
    key: "settings",
    label: "Settings",
    icon: IconSettings,
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
  console.log('secondPendingItem');
  console.log(secondPendingItem);
  
  if (!selectedItem || !firstPendingItem || !secondPendingItem) return null;
  
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
            <IconAdjustments />
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
                  <IconPin className="group-hover:fill-popover-foreground group-hover:stroke-popover-foreground" />
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
                  <IconPin className="group-hover:fill-popover-foreground group-hover:stroke-popover-foreground" />
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

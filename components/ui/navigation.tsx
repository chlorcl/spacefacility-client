import {
    NavigationMenu, NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink, NavigationMenuList,
    NavigationMenuTrigger, navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import {Switch} from "@/components/ui/switch";
import React from "react";
import {Button} from "@/components/ui/button";
import {LogOut} from "lucide-react";

const Navigation = () => {
    return (
        <NavigationMenu className="py-4">
            <NavigationMenuList>
                <NavigationMenuItem>
                    <Link href="/missions" legacyBehavior passHref>
                        <NavigationMenuLink className={navigationMenuTriggerStyle()} >
                            Missions
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <Link href="/items" legacyBehavior passHref>
                        <NavigationMenuLink className={navigationMenuTriggerStyle()} >
                            Items
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <Link href="/rooms" legacyBehavior passHref>
                        <NavigationMenuLink className={navigationMenuTriggerStyle()} >
                            Rooms
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <Link href="/professions" legacyBehavior passHref>
                        <NavigationMenuLink className={navigationMenuTriggerStyle()} >
                            Professions
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <Link href="/logout" legacyBehavior passHref>
                        <NavigationMenuLink className={navigationMenuTriggerStyle()} >
                            <LogOut/>
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    )
}

export default Navigation;
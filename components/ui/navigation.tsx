import {
    NavigationMenu, NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink, NavigationMenuList,
    NavigationMenuTrigger, navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import {Switch} from "@/components/ui/switch";
import React from "react";

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
            </NavigationMenuList>
        </NavigationMenu>
    )
}

export default Navigation;
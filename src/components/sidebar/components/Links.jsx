import React from "react";
import { Link, useLocation } from "react-router-dom";
import DashIcon from "components/icons/DashIcon";

export function SidebarLinks({ routes }) {
    let location = useLocation();

    const activeRoute = (routeName) => {
        return location.pathname.includes(routeName);
    };

    const createLinks = (routes) => {
        return routes.map((route, index) => (
            <Link key={index} to={route.layout + "/" + route.path}>
                <div className="relative mb-3 flex hover:cursor-pointer">
                    <li className="my-[3px] flex cursor-pointer items-center px-8">
            <span className={`${activeRoute(route.path) ? "font-bold text-brand-500 dark:text-white" : "font-medium text-gray-600"}`}>
              {route.icon ? route.icon : <DashIcon />}{" "}
            </span>
                        <p className={`leading-1 ml-4 flex ${activeRoute(route.path) ? "font-bold text-navy-700 dark:text-blue-500" : "font-medium text-gray-600 dark:text-white"}`}>
                            {route.name}
                        </p>
                    </li>
                    {activeRoute(route.path) && <div className="absolute right-0 top-px h-9 w-1 rounded-lg bg-brand-500 dark:bg-brand-400" />}
                </div>
            </Link>
        ));
    };

    return (
        <>
            {createLinks(routes)}
        </>
    );
}

export default SidebarLinks;

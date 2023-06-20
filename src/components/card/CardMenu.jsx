import React from "react";
import Dropdown from "components/dropdown";
import { BsThreeDots } from "react-icons/bs";

function CardMenu({ transparent, children }) {
  return (
    <Dropdown
      button={
        <button
          className={`flex items-center text-xl hover:cursor-pointer ${transparent
            ? "bg-none text-white hover:bg-none active:bg-none"
            : "bg-lightPrimary p-2 text-brand-500 hover:bg-gray-100 dark:bg-navy-700 dark:text-white dark:hover:bg-white/20 dark:active:bg-white/10"
            } linear justify-center rounded-lg font-bold transition duration-200`}
        >
          <BsThreeDots className="h-6 w-6" />
        </button>
      }
    >
      {children}
    </Dropdown>
  );
}

export default CardMenu;

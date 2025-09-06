import React from "react";
import { Link } from "react-router-dom";

export default function Breadcrumb({ items }) {
  // items = [{ label: "Home", to: "/" }, { label: "Room 1", to: "/room/1" }, ...]
  return (
    <nav className="text-gray-600 text-sm mb-4" aria-label="breadcrumb">
      <ol className="list-none p-0 inline-flex">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center">
              {!isLast ? (
                <>
                  <Link to={item.to} className="hover:text-blue-600">
                    {item.label}
                  </Link>
                  <span className="mx-2">/</span>
                </>
              ) : (
                <span className="font-semibold">{item.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

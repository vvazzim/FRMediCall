import React, { useState } from 'react';

export default function ThreeDotsDropdown() {
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleEdit = () => {
    console.log('Edit clicked');
  };

  const handlePreview = () => {
    console.log('Preview clicked');
  };

  const handleDelete = () => {
    console.log('Delete clicked');
  };

  return (
    <div className="relative z-100">
      <button
        className="inline-flex items-center justify-center w-8 h-8 text-gray-500 hover:text-gray-700 focus:outline-none"
        onClick={toggleDropdown}
      >
        <svg
          className="w-5 h-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 7a2 2 0 100-4 2 2 0 000 4zM2 7a2 2 0 114 0 2 2 0 01-4 0zm14 2a2 2 0 100-4 2 2 0 000 4zm-2 6a2 2 0 11-4 0 2 2 0 014 0z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-40 py-2 bg-white border rounded shadow-lg z-30 dark:bg-navy-700">
          <button
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-navy-800"
            onClick={handleEdit}
          >
            Edit
          </button>
          <button
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-navy-800"
            onClick={handlePreview}
          >
            Preview
          </button>
          <button
            className="block px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

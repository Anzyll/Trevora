import React from "react";
import  { useState } from "react";
import {  useNavigate } from "react-router-dom";

const AdminHeader = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const navigate = useNavigate();
  

  const tabs = [
    { key: "overview", label: "Overview", path: "/admin/dashboard" },
    { key: "products", label: "Products", path: "/admin/productmanagement" },
    { key: "orders", label: "Orders",path:"/admin/ordermanagement"  },
    { key: "users", label: "Users",path:"/admin/usermanagement" },
  ];
  const handleTab=(tab)=>{
     setActiveTab(tab.key)
     if(tab.path){
     navigate(tab.path)}
  }
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex justify-between items-center px-6 py-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 text-sm">
            Welcome back, {user.fullName || "Admin"}
          </p>
        </div>
       
        <div className="flex items-center space-x-4">
          <button onClick={()=>navigate("/home")}><svg xmlns="http://www.w3.org/2000/svg" 
     fill="none" 
     viewBox="0 0 24 24" 
     strokeWidth="2" 
     stroke="currentColor" 
     className="w-6 h-6">
  <path strokeLinecap="round" 
        strokeLinejoin="round" 
        d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M18 12l3-3m0 0l-3-3m3 3H9" />
</svg>
</button>
          <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-white font-semibold">
            {user.fullName ? user.fullName.charAt(0).toUpperCase() : "A"}
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200">
        <div className="px-6">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={()=>handleTab(tab)}
                className={`
                  py-4 px-1 border-b-2 font-medium text-sm transition-colors
                  ${
                    activeTab === tab.key
                      ? "border-black text-black"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;

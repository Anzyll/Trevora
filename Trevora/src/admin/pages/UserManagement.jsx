import axios from "axios";
import React, { useEffect, useState } from "react";


const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [userFilter, setUserFilter] = useState("all");
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/users`
      );
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      console.error("error while fetching users");
      setLoading(false);
    }
  };

  const toggleBlockUser = async (userId, currentStatus) => {
    try {
      axios.patch(`http://localhost:3001/users/${userId}`, {
        isBlock: !currentStatus,
      });
      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, isBlock: !currentStatus } : user
        )
      );
    } catch (error) {
      console.error("error while blocking user", error);
    }
  };

  const toggleAdminOrUser = async (userId, currentStatus) => {
    try {
      axios.patch(`http://localhost:3001/users/${userId}`, {
        isAdmin: !currentStatus,
      });
      setUsers(
        users.map((user) =>
         !user.isBlock&& user.id === userId ? { ...user, isAdmin: !currentStatus } : user
        )
      );
    } catch (error) {
      console.error("error while making or removing admin", error);
    }
  };
  const totalUsers = users.length;
  const activeUser = users.filter((user) => !user.isBlock).length;
  const blockedUser = users.filter((user) => user.isBlock).length;

  const getNewUsersCount = () => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return users.filter((user) => {
      if (!user.joinDate) return false;
      const joinDate = new Date(user.joinDate);
      return joinDate >= thirtyDaysAgo;
    }).length;
  };

  const newUsersCount = getNewUsersCount();

  const filteredUsers = users.filter((user) => {
    const searchUsers = user.fullName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const filteredUsers =
      userFilter === "all" ||
      (userFilter === "true" && user.isBlock) ||
      (userFilter === "false" && !user.isBlock);
    return searchUsers && filteredUsers;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            User Management
          </h1>
          <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
            Manage customer accounts and profiles
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-3 sm:p-4 lg:p-6 shadow-sm">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">
                Total Users
              </p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mt-1">
                {totalUsers}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-3 sm:p-4 lg:p-6 shadow-sm">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">
                Active Users
              </p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold  mt-1">
                {activeUser}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-3 sm:p-4 lg:p-6 shadow-sm">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">
                Blocked Users
              </p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold  mt-1">
                {blockedUser}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-3 sm:p-4 lg:p-6 shadow-sm">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">
                New Users (30d)
              </p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold  mt-1">
                {newUsersCount}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6 shadow-sm ">
          <div className="relative flex justify-between gap-2">
            <input
              type="text"
              placeholder="Search users by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className=" w-full  pl-10 sm:pl-12 pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            />
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 absolute left-3 sm:left-4 top-2.5 sm:top-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <select
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              className="  px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent focus:outline-0"
            >
              <option value="all">All Users</option>
              <option value="false">Active Users</option>
              <option value="true">Blocked Users</option>
            </select>
          </div>
        </div>
        <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="hidden lg:block">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Orders
                  </th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 lg:px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                          <span className="text-gray-600 font-medium text-xs lg:text-sm">
                            {user.fullName?.charAt(0).toUpperCase() || "U"}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {user.fullName || "Unknown User"}
                          </div>
                          <div className="text-xs text-gray-500">
                            ID: {user.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 lg:px-6 py-4">
                      <div className="text-sm text-gray-900">{user.email}</div>
                    </td>
                    <td className="px-4 lg:px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          user.isBlock
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {user.isBlock ? "Blocked" : "Active"}
                      </span>
                    </td>
                    <td className="px-4 lg:px-6 py-4 text-sm text-gray-900">
                      {user.joinDate
                        ? new Date(user.joinDate).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="px-4 lg:px-6 py-4">
                      <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        {user.orders?.length || 0}
                      </span>
                    </td>
                    <td className="px-4 lg:px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          user.isAdmin
                            ? "bg-purple-100 text-purple-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {user.isAdmin ? "Admin" : "User"}
                      </span>
                    </td>
                    <td className="px-4 lg:px-6 py-4">
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() =>
                            toggleAdminOrUser(user.id, user.isAdmin)
                          }
                          className={`px-3 py-2 rounded text-xs font-medium transition-colors duration-200 ${
                            user.isAdmin
                              ? "bg-gray-600 text-white hover:bg-gray-700"
                              : "bg-indigo-600 text-white hover:bg-indigo-700"
                          }`}
                        >
                          {user.isAdmin ? "Remove Admin" : "Make Admin"}
                        </button>
                        <button
                          onClick={() => toggleBlockUser(user.id, user.isBlock)}
                          className={`px-3 py-2 rounded text-xs font-medium transition-colors duration-200 ${
                            user.isBlock
                              ? "bg-green-600 text-white hover:bg-green-700"
                              : "bg-red-600 text-white hover:bg-red-700"
                          }`}
                        >
                          {user.isBlock ? "Unblock" : "Block"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="lg:hidden">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="border-b border-gray-200 last:border-b-0 p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                      <span className="text-gray-600 font-medium text-sm">
                        {user.fullName?.charAt(0).toUpperCase() || "U"}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {user.fullName || "Unknown User"}
                      </div>
                      <div className="text-xs text-gray-500">ID: {user.id}</div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        user.isBlock
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {user.isBlock ? "Blocked" : "Active"}
                    </span>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        user.isAdmin
                          ? "bg-purple-100 text-purple-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {user.isAdmin ? "Admin" : "User"}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                  <div>
                    <div className="text-gray-600 text-xs">Email</div>
                    <div className="text-gray-900 truncate">{user.email}</div>
                  </div>
                  <div>
                    <div className="text-gray-600 text-xs">Joined</div>
                    <div className="text-gray-900">
                      {user.joinDate
                        ? new Date(user.joinDate).toLocaleDateString()
                        : "N/A"}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-gray-600 text-xs mr-2">Orders:</span>
                    <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      {user.orders?.length || 0}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleAdminOrUser(user.id, user.isAdmin)}
                      className={`px-3 py-1.5 rounded text-xs font-medium transition-colors duration-200 ${
                        user.isAdmin
                          ? "bg-gray-600 text-white hover:bg-gray-700"
                          : "bg-indigo-600 text-white hover:bg-indigo-700"
                      }`}
                    >
                      {user.isAdmin ? "Remove Admin" : "Make Admin"}
                    </button>
                    <button
                      onClick={() => toggleBlockUser(user.id, user.isBlock)}
                      className={`px-3 py-1.5 rounded text-xs font-medium transition-colors duration-200 ${
                        user.isBlock
                          ? "bg-green-600 text-white hover:bg-green-700"
                          : "bg-red-600 text-white hover:bg-red-700"
                      }`}
                    >
                      {user.isBlock ? "Unblock" : "Block"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-8 sm:py-12">
              <div className="text-gray-400 text-4xl sm:text-6xl mb-3 sm:mb-4">
                👥
              </div>
              <p className="text-gray-500 text-base sm:text-lg">
                No users found
              </p>
              <p className="text-gray-400 text-xs sm:text-sm mt-1">
                {searchTerm
                  ? "Try adjusting your search terms"
                  : "No users in the system"}
              </p>
            </div>
          )}
        </div>
        <div className="mt-4 sm:mt-6 text-center">
          <p className="text-gray-500 text-xs sm:text-sm">
            Showing {filteredUsers.length} of {users.length} users
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;

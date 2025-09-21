import React from "react";

const DepartmentIssuesTable = ({ filteredIssues, openIssueModal }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden mx-2 sm:mx-0">
    {/* Mobile Card View */}
    <div className="block md:hidden">
      {filteredIssues.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          No issues found matching your filters.
        </div>
      ) : (
        filteredIssues.map((issue) => (
          <div
            key={issue.id}
            className="border-b border-gray-200 p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1 mr-2">
                <h3 className="font-medium text-gray-900 text-sm leading-tight">
                  {issue.title}
                </h3>
                <p className="text-xs text-gray-600 mt-1">
                  {issue.location}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <span
                  className={`px-2 py-1 text-xs leading-4 font-semibold rounded-full ${
                    issue.priority === "High"
                      ? "bg-red-100 text-red-800"
                      : issue.priority === "Medium"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {issue.priority}
                </span>
                <span
                  className={`px-2 py-1 text-xs leading-4 font-semibold rounded-full ${
                    issue.status === "Resolved"
                      ? "bg-green-100 text-green-800"
                      : issue.status === "In Progress"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-orange-100 text-orange-800"
                  }`}
                >
                  {issue.status}
                </span>
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-3">
              <div className="flex items-center gap-3">
                <span className="px-2 py-1 text-xs leading-4 font-semibold rounded-full bg-blue-100 text-blue-800">
                  {issue.category}
                </span>
                <span className="text-xs text-gray-500">
                  {issue.reportedDate}
                </span>
              </div>
              <button
                onClick={() => openIssueModal(issue)}
                className="text-blue-600 hover:text-blue-900 text-sm font-medium px-2 py-1"
              >
                View Details
              </button>
            </div>
          </div>
        ))
      )}
    </div>

    {/* Desktop Table View */}
    <div className="hidden md:block">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Issue Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Priority
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredIssues.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                  No issues found matching your filters.
                </td>
              </tr>
            ) : (
              filteredIssues.map((issue) => (
                <tr key={issue.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {issue.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {issue.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {issue.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        issue.priority === "High"
                          ? "bg-red-100 text-red-800"
                          : issue.priority === "Medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {issue.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        issue.status === "Resolved"
                          ? "bg-green-100 text-green-800"
                          : issue.status === "In Progress"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-orange-100 text-orange-800"
                      }`}
                    >
                      {issue.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {issue.reportedDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => openIssueModal(issue)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

export default DepartmentIssuesTable;
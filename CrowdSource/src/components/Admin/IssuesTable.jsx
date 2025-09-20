import React from "react";

const IssuesTable = ({ filteredIssues, openIssueModal }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full table-fixed">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
              Issue Title
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/7">
              Department
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/8">
              State
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/10">
              Priority
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/10">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/8">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/8">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredIssues.map((issue) => (
            <tr key={issue.id} className="hover:bg-gray-50">
              {/* Description wraps properly now */}
              <td className="px-6 py-4 text-sm font-medium text-gray-900 max-w-xs break-words">
                {issue.description}
              </td>

              <td className="px-6 py-4 text-sm whitespace-nowrap">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                  DEPT HERE
                </span>
              </td>

              <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                To change
              </td>

              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    issue.priority === "high"
                      ? "bg-red-100 text-red-800"
                      : issue.priority === "medium"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {issue?.priority ? issue.priority.toUpperCase() : "N/A"}
                </span>
              </td>

              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    issue.status === "resolved"
                      ? "bg-green-100 text-green-800"
                      : issue.status === "reviewed" ||
                        issue.status === "forwarded"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-orange-100 text-orange-800"
                  }`}
                >
                  {issue?.status ? issue.status.toUpperCase() : "N/A"}
                </span>
              </td>

              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {new Date(issue.reportedAt).toLocaleDateString()}
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
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default IssuesTable;

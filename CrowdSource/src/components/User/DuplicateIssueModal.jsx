import React from "react";

export default function DuplicateIssueModal({ open, issues, onConfirm, onCancel, onUpvote }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-lg w-full">
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          Possible Duplicate Issues Found
        </h2>

        {/* Tiny helper text */}
        <p className="text-xs text-gray-500 mb-4">
          If one matches, click <span className="font-semibold">+1</span> to upvote instead of reporting again.
        </p>

        <ul className="space-y-3 max-h-60 overflow-y-auto">
          {issues.map((issue, idx) => (
            <li
              key={idx}
              className="p-3 border rounded-lg bg-gray-50 text-gray-700 shadow-sm flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{issue.description}</p>
                <p className="text-sm text-gray-500">
                  Priority: {issue.priority.toUpperCase()} | Date:{" "}
                  {new Date(issue.reportedAt).toLocaleDateString()}
                </p>
              </div>

              {/* Upvote widget */}
              <div className="flex flex-col items-center ml-4">
                <button
                  onClick={() => onUpvote(issue.ID)}
                  className={`text-lg font-bold transition ${
                    issue.upvoted
                      ? "text-green-600"
                      : "text-gray-500 hover:text-green-600"
                  }`}
                  title="Upvote this issue"
                >
                  ▲
                </button>
                <span
                  className={`text-sm font-semibold ${
                    issue.upvoted ? "text-green-600" : "text-gray-600"
                  }`}
                >
                  +1
                </span>
              </div>
            </li>
          ))}
        </ul>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Report Anyway
          </button>
        </div>
      </div>
    </div>
  );
}
import React from "react";
import { LogEntry } from "../../types/types";

interface HistoryTabProps {
  logs: LogEntry[];
}

function HistoryTab({
  logs,
}: HistoryTabProps) {
  return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">
              System Audit Log
            </h2>

            <div className="relative border-l-2 border-gray-200 ml-4 space-y-8">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="relative pl-8"
                >
                  <div
                    className={`absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 border-white ${
                      log.action_type ===
                      "Disabling"
                        ? "bg-red-500"
                        : log.action_type ===
                          "Addition"
                        ? "bg-green-500"
                        : log.action_type ===
                          "Tag Creation"
                        ? "bg-blue-500"
                        : "bg-gray-500"
                    }`}
                  />

                  <div className="bg-white p-4 rounded-lg border shadow-sm">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-semibold text-gray-900">
                        {log.action_type}
                      </span>

                      <span className="text-xs text-gray-500 font-mono">
                        {new Date(
                          log.timestamp
                        ).toLocaleString()}
                      </span>
                    </div>

                    <p className="text-gray-700 text-sm mb-2">
                      {log.details}
                    </p>

                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="bg-gray-100 px-2 py-0.5 rounded">
                        User: {log.user_id}
                      </span>

                      {log.rationale && (
                        <span className="bg-red-50 text-red-700 px-2 py-0.5 rounded border border-red-100">
                          Rationale: {log.rationale}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
        </div>
  );
}

export default React.memo(HistoryTab)
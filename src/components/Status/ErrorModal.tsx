import React from "react";
import { X, AlertTriangle, Database, Bot, Settings } from "lucide-react";

interface ServiceStatus {
  name: string;
  status: "Healthy" | "Degraded" | "Critical";
  description: string;
  issue?: string;
  lastChecked: string;
  details: Record<string, any>;
}

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  services: ServiceStatus[];
  overallStatus: string;
}

const ErrorModal: React.FC<ErrorModalProps> = ({
  isOpen,
  onClose,
  services,
  overallStatus,
}) => {
  if (!isOpen) return null;

  const getServiceIcon = (serviceName: string) => {
    switch (serviceName.toLowerCase()) {
      case "database":
        return <Database className="h-5 w-5" />;
      case "ai agent":
        return <Bot className="h-5 w-5" />;
      case "configuration":
        return <Settings className="h-5 w-5" />;
      default:
        return <Settings className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Healthy":
        return "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20";
      case "Degraded":
        return "text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20";
      case "Critical":
        return "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20";
      default:
        return "text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20";
    }
  };

  const getOverallStatusColor = (status: string) => {
    switch (status) {
      case "Healthy":
        return "text-green-600";
      case "Degraded":
        return "text-yellow-600";
      case "Critical":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const criticalServices = services.filter((s) => s.Status === "Critical");
  const degradedServices = services.filter((s) => s.Status === "Degraded");

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative w-full max-w-4xl transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow-xl transition-all">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  System Status Issues
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {criticalServices.length} critical, {degradedServices.length}{" "}
                  degraded
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <div className="max-h-96 overflow-y-auto px-6 py-4">
            {/* Overall Status */}
            <div className="mb-6 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  Overall Status
                </h3>
                <span
                  className={`px-2 py-1 rounded-full text-sm font-medium ${getOverallStatusColor(
                    overallStatus
                  )}`}
                >
                  {overallStatus}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {overallStatus === "Critical"
                  ? "Multiple services are not functioning properly. The system requires immediate attention."
                  : overallStatus === "Degraded"
                  ? "Some services are experiencing issues but the system is partially functional."
                  : "All services are operating normally."}
              </p>
            </div>

            {/* Service Issues */}
            <div className="space-y-4">
              {services
                .filter((service) => service.Status !== "Healthy")
                .map((service) => (
                  <div
                    key={service.name}
                    className="rounded-lg border border-gray-200 dark:border-gray-700 p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getServiceIcon(service.name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="text-base font-medium text-gray-900 dark:text-gray-100">
                            {service.name}
                          </h4>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              service.Status
                            )}`}
                          >
                            {service.Status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {service.description}
                        </p>
                        {service.issue && (
                          <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-3 mb-3">
                            <p className="text-sm text-red-800 dark:text-red-200 font-medium mb-1">
                              Issue:
                            </p>
                            <p className="text-sm text-red-700 dark:text-red-300">
                              {service.issue}
                            </p>
                          </div>
                        )}
                        <div className="text-xs text-gray-500 dark:text-gray-500">
                          Last checked:{" "}
                          {new Date(service.lastChecked).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4">
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorModal;

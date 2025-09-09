import React, { useState, useEffect } from "react";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Database,
  Bot,
  Settings,
  Cloud,
} from "lucide-react";
import ErrorModal from "./ErrorModal";

interface ServiceStatus {
  name: string;
  status: "Healthy" | "Degraded" | "Critical";
  description: string;
  issue?: string;
  lastChecked: string;
  details: Record<string, any>;
}

interface SystemStatus {
  timestamp: string;
  overallStatus: "Healthy" | "Degraded" | "Critical";
  services: ServiceStatus[];
  issues: string[];
}

const ServiceStatusComponent: React.FC = () => {
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/v1/status");

      // Handle both 200 (Healthy) and 503 (Critical) responses
      if (response.status === 200 || response.status === 503) {
        const data = await response.json();
        setStatus(data);
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch status");
      console.error("Error fetching status:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    // Refresh every 30 seconds
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Healthy":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "Degraded":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "Critical":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Healthy":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Degraded":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "Critical":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getServiceIcon = (serviceName: string) => {
    switch (serviceName.toLowerCase()) {
      case "database":
        return <Database className="h-4 w-4" />;
      case "ai agent":
        return <Bot className="h-4 w-4" />;
      case "configuration":
        return <Settings className="h-4 w-4" />;
      default:
        return <Settings className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-center">
          <RefreshCw className="h-5 w-5 animate-spin text-blue-500" />
          <span className="ml-2 text-gray-600 dark:text-gray-400">
            Loading system status...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-red-200 dark:border-red-700 p-6">
        <div className="flex items-center">
          <XCircle className="h-5 w-5 text-red-500" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
              Failed to load system status
            </h3>
            <p className="text-sm text-red-600 dark:text-red-400 mt-1">
              {error}
            </p>
            <button
              onClick={fetchStatus}
              className="mt-2 text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 underline"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!status) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          System Status
        </h2>
        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
              status.overallStatus
            )}`}
          >
            {status.overallStatus}
          </span>
          {status.overallStatus !== "Healthy" && (
            <button
              onClick={() => setIsErrorModalOpen(true)}
              className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-colors"
              title="View detailed error information"
            >
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </button>
          )}
          <button
            onClick={fetchStatus}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            title="Refresh status"
          >
            <RefreshCw className="h-4 w-4 text-gray-500" />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {status.services.map((service) => (
          <div
            key={service.name}
            className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="flex-shrink-0 mt-0.5">
              {getServiceIcon(service.name)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {service.name}
                </h3>
                {getStatusIcon(service.status)}
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                    service.status
                  )}`}
                >
                  {service.status}
                </span>
                {service.status !== "Healthy" && (
                  <button
                    onClick={() => setIsErrorModalOpen(true)}
                    className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-colors"
                    title="View detailed error information"
                  >
                    <AlertTriangle className="h-3 w-3 text-red-500" />
                  </button>
                )}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                {service.description}
              </p>
              {service.issue && (
                <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-2 rounded">
                  {service.issue}
                </p>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-500">
                Last checked: {new Date(service.lastChecked).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {status.issues.length > 0 && (
        <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
          <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">
            Issues Detected:
          </h4>
          <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
            {status.issues.map((issue, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-yellow-500 mt-0.5">•</span>
                <span>{issue}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Error Modal */}
      <ErrorModal
        isOpen={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
        services={status.services}
        overallStatus={status.overallStatus}
      />
    </div>
  );
};

export default ServiceStatusComponent;

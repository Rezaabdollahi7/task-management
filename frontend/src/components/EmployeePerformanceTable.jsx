// src/components/EmployeePerformanceTable.jsx
import { useTranslation } from "react-i18next";

const EmployeePerformanceTable = ({ data }) => {
  const { t } = useTranslation();

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No employee data available
      </div>
    );
  }

  const MobileEmployeeCard = ({ employee }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-3 shadow-sm">
      <div className="flex justify-center items-center  mb-3">
        <h3 className="font-semibold text-gray-900 text-center">
          {employee.full_name}
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-8 text-md">
        <div className="text-center p-2 bg-gray-50 rounded">
          <div className="font-semibold text-gray-900">
            {employee.total_tasks}
          </div>
          <div className="text-gray-600">
            {t("dashboard.charts.totalTasks")}
          </div>
        </div>
        <div className="text-center p-2 bg-green-50 rounded">
          <div className="font-semibold text-green-700">
            {employee.completed_tasks}
          </div>
          <div className="text-green-600">
            {t("dashboard.charts.completed")}
          </div>
        </div>
        <div className="text-center p-2 bg-blue-50 rounded">
          <div className="font-semibold text-blue-700">
            {employee.in_progress_tasks}
          </div>
          <div className="text-blue-600">{t("tasks.statuses.in_progress")}</div>
        </div>
        <div className="text-center p-2 bg-gray-50 rounded">
          <div className="font-semibold text-gray-700">
            {employee.open_tasks}
          </div>
          <div className="text-gray-600">{t("tasks.statuses.open")}</div>
        </div>
        <div className="text-center p-2 bg-purple-50 rounded">
          <div className="font-semibold text-purple-700">
            {employee.this_week_tasks}
          </div>
          <div className="text-purple-600">{t("time.thisWeek")}</div>
        </div>
        <div className="text-center p-2 bg-orange-50 rounded">
          <div className="font-semibold text-orange-700">
            {employee.today_tasks}
          </div>
          <div className="text-orange-600">{t("time.today")}</div>
        </div>
      </div>

      {/* Progress Bar*/}
      <div className="mt-3 pt-3 border-t border-gray-100">
        <div className="flex justify-between items-center text-xs mb-1">
          <span className="text-gray-600">{t("tasks.completedRate")}</span>
          <span className="font-semibold">{employee.completion_rate}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${
              employee.completion_rate >= 75
                ? "bg-green-500"
                : employee.completion_rate >= 50
                ? "bg-yellow-500"
                : "bg-red-500"
            }`}
            style={{ width: `${employee.completion_rate}%` }}
          ></div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Table*/}
      <div className="hidden lg:block w-full overflow-x-auto">
        <div className="min-w-[800px]">
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t("users.roles.employee")}
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t("dashboard.charts.totalTasks")}
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t("dashboard.charts.completed")}
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t("tasks.statuses.in_progress")}
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t("tasks.statuses.open")}
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t("time.thisWeek")}
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t("time.today")}
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t("tasks.completedRate")}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {employee.full_name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm font-semibold text-gray-900">
                      {employee.total_tasks}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {employee.completed_tasks}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {employee.in_progress_tasks}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                      {employee.open_tasks}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm text-gray-900">
                      {employee.this_week_tasks}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm text-gray-900">
                      {employee.today_tasks}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center">
                      <div className="w-16">
                        <div className="text-sm font-semibold text-gray-900">
                          {employee.completion_rate}%
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div
                            className={`h-2 rounded-full ${
                              employee.completion_rate >= 75
                                ? "bg-green-500"
                                : employee.completion_rate >= 50
                                ? "bg-yellow-500"
                                : "bg-red-500"
                            }`}
                            style={{ width: `${employee.completion_rate}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards (lg پایین‌تر) */}
      <div className="lg:hidden space-y-3">
        {data.map((employee) => (
          <MobileEmployeeCard key={employee.id} employee={employee} />
        ))}
      </div>
    </>
  );
};

export default EmployeePerformanceTable;

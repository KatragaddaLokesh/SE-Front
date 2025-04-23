import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

type Department = {
  _id: string;
  departmentId: string;
  departmentName: string;
  managerId: string;
  createdAt: string;
  employeeCount?: number;
};

const DepartmentSummary = () => {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("hrms_token");
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Fetch departments
      const deptResponse = await fetch('http://localhost:5000/api/departments', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!deptResponse.ok) {
        if (deptResponse.status === 401) {
          localStorage.removeItem("hrms_token");
          navigate("/login");
          return;
        }
        throw new Error('Failed to fetch departments');
      }

      const deptData = await deptResponse.json();
      
      // Fetch employees
      const empResponse = await fetch('http://localhost:5000/api/employees', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!empResponse.ok) {
        throw new Error('Failed to fetch employees');
      }

      const empData = await empResponse.json();

      // Calculate employee count for each department
      const departmentsWithCount = deptData.data.map((dept: Department) => ({
        ...dept,
        employeeCount: empData.data.filter((emp: any) => emp.department === dept._id).length
      }));

      setDepartments(departmentsWithCount);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to load departments');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Department Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {departments.map((dept) => (
            <div
              key={dept._id}
              className="flex items-center justify-between p-4 rounded-lg border"
            >
              <div>
                <h4 className="font-medium">{dept.departmentName}</h4>
                <p className="text-sm text-muted-foreground">ID: {dept.departmentId}</p>
              </div>
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-2xl font-bold">{dept.employeeCount}</p>
                  <p className="text-xs text-muted-foreground">employees</p>
                </div>
                <div className={`w-2 h-2 rounded-full ${
                  dept.employeeCount === 0 ? 'bg-red-500' :
                  dept.employeeCount < 5 ? 'bg-yellow-500' : 'bg-green-500'
                }`} />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DepartmentSummary; 

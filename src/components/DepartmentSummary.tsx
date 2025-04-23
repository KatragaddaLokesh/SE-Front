
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

type Department = {
  _id: string;
  name: string;
  description: string;
  employeeCount?: number;
};

const DepartmentSummary = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

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

      const response = await fetch('http://localhost:5000/api/departments/with-employee-count', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 401) {
          localStorage.removeItem("hrms_token");
          navigate("/login");
          return;
        }
        throw new Error(errorData.error || 'Failed to fetch departments');
      }

      const data = await response.json();
      if (!data || !data.data || !Array.isArray(data.data)) {
        throw new Error('Invalid data format received from server');
      }
      setDepartments(data.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
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
            <div key={dept._id} className="flex items-center justify-between">
              <div>
                <p className="font-medium">{dept.name}</p>
                <p className="text-sm text-muted-foreground">{dept.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{dept.employeeCount || 0}</span>
                <span className="text-sm text-muted-foreground">employees</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DepartmentSummary; 


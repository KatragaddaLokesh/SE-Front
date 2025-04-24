import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Search, 
  User, 
  Mail, 
  Phone, 
  Briefcase, 
  MapPin, 
  Calendar,
  PenSquare,
  Trash2
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";

type Department = {
  _id: string;
  departmentId: string;
  departmentName: string;
  managerId: string | null;
  createdAt: string;
};

type Employee = {
  _id: string;
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  department: {
    _id: string;
    departmentId: string;
    departmentName: string;
  };
  address: string;
  dob: string;
  salary: number;
  role: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
};

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const EmployeeManagement = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [viewMode, setViewMode] = useState<"view" | "edit">("view");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    departmentId: "",
    address: "",
    dob: "",
    salary: "",
    role: "employee"
  });

  useEffect(() => {
    const token = localStorage.getItem("hrms_token");
    if (!token) {
      toast.error("Please login to access this page");
      navigate("/login");
      return;
    }
    fetchDepartments();
    fetchEmployees();
  }, [navigate]);

  const fetchDepartments = async () => {
    try {
      const token = localStorage.getItem("hrms_token");
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('http://localhost:5000/api/departments', {
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
    }
  };

  const getDepartmentName = (employee: Employee) => {
    return employee.department?.departmentName || 'Unknown Department';
  };

  const fetchEmployees = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("hrms_token");
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('http://localhost:5000/api/employees', {
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
        throw new Error(errorData.error || 'Failed to fetch employees');
      }

      const data = await response.json();
      if (!data || !data.data || !Array.isArray(data.data)) {
        throw new Error('Invalid data format received from server');
      }
      setEmployees(data.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to load employees');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddEmployee = async () => {
    try {
      // Check if user is HR
      if (user?.role !== 'hr') {
        toast.error('Only HR administrators can add employees');
        return;
      }

      setIsActionLoading(true);
      const token = localStorage.getItem("hrms_token");
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('http://localhost:5000/api/employees/register', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newEmployee.name,
          email: newEmployee.email,
          phone: newEmployee.phone,
          position: newEmployee.position,
          department: newEmployee.departmentId,
          address: newEmployee.address,
          dob: newEmployee.dob,
          salary: Number(newEmployee.salary),
          role: newEmployee.role,
          password: 'password123' // Default password, should be changed by employee
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 401) {
          localStorage.removeItem("hrms_token");
          navigate("/login");
          return;
        }
        throw new Error(errorData.error || 'Failed to add employee');
      }

      toast.success('Employee added successfully!');
      fetchEmployees();
      setNewEmployee({
        name: "",
        email: "",
        phone: "",
        position: "",
        departmentId: "",
        address: "",
        dob: "",
        salary: "",
        role: "employee"
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to add employee');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleEditSave = async () => {
    try {
      setIsActionLoading(true);
      const token = localStorage.getItem("hrms_token");
      if (!token) {
        throw new Error('No authentication token found');
      }

      if (!selectedEmployee) return;

      const response = await fetch(`http://localhost:5000/api/employees/${selectedEmployee._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: selectedEmployee.name,
          email: selectedEmployee.email,
          phone: selectedEmployee.phone,
          position: selectedEmployee.position,
          departmentId: selectedEmployee.department._id,
          address: selectedEmployee.address,
          dob: selectedEmployee.dob,
          salary: selectedEmployee.salary,
          role: selectedEmployee.role,
          status: selectedEmployee.status
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 401) {
          localStorage.removeItem("hrms_token");
          navigate("/login");
          return;
        }
        throw new Error(errorData.error || 'Failed to update employee');
      }

      toast.success('Employee updated successfully!');
      fetchEmployees();
      setSelectedEmployee(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update employee');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedEmployee) return;

    // Check if user is HR
    if (user?.role !== 'hr') {
      toast.error('Only HR administrators can remove employees');
      return;
    }

    try {
      setIsActionLoading(true);
      const token = localStorage.getItem("hrms_token");
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`http://localhost:5000/api/employees/${selectedEmployee._id}`, {
        method: 'DELETE',
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
        throw new Error(errorData.error || 'Failed to delete employee');
      }

      toast.success('Employee removed successfully!');
      fetchEmployees();
      setSelectedEmployee(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete employee');
    } finally {
      setIsActionLoading(false);
    }
  };

  // Apply filters
  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = searchTerm === '' || 
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.phone.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDepartment = filterDepartment === "all" || employee.department._id === filterDepartment;
    
    return matchesSearch && matchesDepartment;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading employees...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Employee Management</h2>
        <p className="text-muted-foreground">
          View and manage employee information.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <CardTitle className="flex items-center">
              <Users className="mr-2" />
              <span>All Employees ({filteredEmployees.length})</span>
            </CardTitle>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="flex-1 sm:max-w-[300px]">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search employees..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="All Departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept._id} value={dept._id}>{dept.departmentName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Add Employee</Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>Add New Employee</DialogTitle>
                  </DialogHeader>
                  
                  <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Full Name</label>
                        <Input 
                          placeholder="Enter full name" 
                          value={newEmployee.name}
                          onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Email</label>
                        <Input 
                          type="email" 
                          placeholder="Enter email address" 
                          value={newEmployee.email}
                          onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Phone Number</label>
                        <Input 
                          placeholder="Enter phone number" 
                          value={newEmployee.phone}
                          onChange={(e) => setNewEmployee({...newEmployee, phone: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Position</label>
                        <Input 
                          placeholder="Enter job position" 
                          value={newEmployee.position}
                          onChange={(e) => setNewEmployee({...newEmployee, position: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Department</label>
                        <Select 
                          value={newEmployee.departmentId}
                          onValueChange={(value) => setNewEmployee({...newEmployee, departmentId: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent>
                            {departments.map((dept) => (
                              <SelectItem key={dept._id} value={dept._id}>{dept.departmentName}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Address</label>
                        <Input 
                          placeholder="Enter address" 
                          value={newEmployee.address}
                          onChange={(e) => setNewEmployee({...newEmployee, address: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Date of Birth</label>
                        <Input 
                          type="date" 
                          value={newEmployee.dob}
                          onChange={(e) => setNewEmployee({...newEmployee, dob: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Salary</label>
                        <Input 
                          type="number" 
                          placeholder="Enter salary" 
                          value={newEmployee.salary}
                          onChange={(e) => setNewEmployee({...newEmployee, salary: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <DialogFooter className="gap-2">
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button 
                      onClick={handleAddEmployee}
                      disabled={isActionLoading}
                    >
                      {isActionLoading ? "Adding..." : "Add Employee"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredEmployees.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No employees found matching your search criteria.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted">
                    <th className="py-3 px-4 text-left font-medium">Employee</th>
                    <th className="py-3 px-4 text-left font-medium">Position</th>
                    <th className="py-3 px-4 text-left font-medium">Department</th>
                    <th className="py-3 px-4 text-left font-medium">Location</th>
                    <th className="py-3 px-4 text-left font-medium">Status</th>
                    <th className="py-3 px-4 text-left font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map((employee) => (
                    <tr key={employee._id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-muted overflow-hidden mr-3">
                            <img 
                              src={`https://ui-avatars.com/api/?name=${employee.name}&background=random`} 
                              alt={employee.name} 
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium">{employee.name}</p>
                            <p className="text-xs text-muted-foreground">{employee.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">{employee.position}</td>
                      <td className="py-3 px-4">
                        {employee.department?.departmentName || 'Unknown Department'}
                      </td>
                      <td className="py-3 px-4">{employee.address}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          employee.status === "Active" 
                            ? "bg-green-100 text-green-800" 
                            : employee.status === "On Leave"
                            ? "bg-orange-100 text-orange-800"
                            : "bg-red-100 text-red-800"
                        }`}>
                          {employee.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => {
                                setSelectedEmployee(employee);
                                setViewMode("view");
                              }}
                            >
                              View
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl">
                            <DialogHeader>
                              <DialogTitle>Employee Details</DialogTitle>
                            </DialogHeader>
                            
                            {selectedEmployee && (
                              <div className="py-4">
                                <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "view" | "edit")}>
                                  <TabsList className="mb-4">
                                    <TabsTrigger value="view" className="flex items-center gap-2">
                                      <User size={16} />
                                      <span>View</span>
                                    </TabsTrigger>
                                    <TabsTrigger value="edit" className="flex items-center gap-2">
                                      <PenSquare size={16} />
                                      <span>Edit</span>
                                    </TabsTrigger>
                                  </TabsList>
                                  
                                  <TabsContent value="view">
                                    <div className="flex flex-col md:flex-row gap-6">
                                      <div className="md:w-1/3 flex flex-col items-center">
                                        <div className="h-32 w-32 rounded-full bg-muted overflow-hidden mb-4">
                                          <img 
                                            src={`https://ui-avatars.com/api/?name=${selectedEmployee.name}&background=random`} 
                                            alt={selectedEmployee.name} 
                                            className="h-full w-full object-cover"
                                          />
                                        </div>
                                        <h3 className="text-xl font-bold">{selectedEmployee.name}</h3>
                                        <p className="text-muted-foreground">{selectedEmployee.position}</p>
                                        
                                        <div className="mt-4 space-y-2 w-full">
                                          <div className="flex items-center">
                                            <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                                            <span>{selectedEmployee.email}</span>
                                          </div>
                                          <div className="flex items-center">
                                            <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                                            <span>{selectedEmployee.phone}</span>
                                          </div>
                                        </div>
                                      </div>
                                      
                                      <div className="md:w-2/3 space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                          <div>
                                            <p className="text-sm font-medium text-muted-foreground">Department</p>
                                            <div className="flex items-center mt-1">
                                              <Briefcase className="mr-2 h-4 w-4 text-muted-foreground" />
                                              <p>{getDepartmentName(selectedEmployee)}</p>
                                            </div>
                                          </div>
                                          <div>
                                            <p className="text-sm font-medium text-muted-foreground">Location</p>
                                            <div className="flex items-center mt-1">
                                              <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                                              <p>{selectedEmployee.address}</p>
                                            </div>
                                          </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-4">
                                          <div>
                                            <p className="text-sm font-medium text-muted-foreground">Date of Birth</p>
                                            <div className="flex items-center mt-1">
                                              <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                                              <p>{formatDate(selectedEmployee.dob)}</p>
                                            </div>
                                          </div>
                                          <div>
                                            <p className="text-sm font-medium text-muted-foreground">Status</p>
                                            <p className="mt-1">
                                              <span className={`px-2 py-1 rounded-full text-xs ${
                                                selectedEmployee.status === "Active" 
                                                  ? "bg-green-100 text-green-800" 
                                                  : selectedEmployee.status === "On Leave"
                                                  ? "bg-orange-100 text-orange-800"
                                                  : "bg-red-100 text-red-800"
                                              }`}>
                                                {selectedEmployee.status}
                                              </span>
                                            </p>
                                          </div>
                                        </div>
                                        
                                        <div>
                                          <p className="text-sm font-medium text-muted-foreground">Salary</p>
                                          <p className="mt-1">${selectedEmployee.salary.toLocaleString()}</p>
                                        </div>
                                      </div>
                                    </div>
                                  </TabsContent>
                                  
                                  <TabsContent value="edit">
                                    <div className="space-y-4">
                                      <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                          <label className="text-sm font-medium">Full Name</label>
                                          <Input 
                                            defaultValue={selectedEmployee.name}
                                            onChange={(e) => setSelectedEmployee({...selectedEmployee, name: e.target.value})}
                                          />
                                        </div>
                                        <div className="space-y-2">
                                          <label className="text-sm font-medium">Email</label>
                                          <Input 
                                            type="email" 
                                            defaultValue={selectedEmployee.email}
                                            onChange={(e) => setSelectedEmployee({...selectedEmployee, email: e.target.value})}
                                          />
                                        </div>
                                      </div>
                                      
                                      <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                          <label className="text-sm font-medium">Phone Number</label>
                                          <Input 
                                            defaultValue={selectedEmployee.phone}
                                            onChange={(e) => setSelectedEmployee({...selectedEmployee, phone: e.target.value})}
                                          />
                                        </div>
                                        <div className="space-y-2">
                                          <label className="text-sm font-medium">Position</label>
                                          <Input 
                                            defaultValue={selectedEmployee.position}
                                            onChange={(e) => setSelectedEmployee({...selectedEmployee, position: e.target.value})}
                                          />
                                        </div>
                                      </div>
                                      
                                      <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                          <label className="text-sm font-medium">Department</label>
                                          <Select 
                                            defaultValue={selectedEmployee.department._id}
                                            onValueChange={(value) => setSelectedEmployee({
                                              ...selectedEmployee, 
                                              department: {
                                                ...selectedEmployee.department,
                                                _id: value,
                                                departmentName: departments.find(d => d._id === value)?.departmentName || ''
                                              }
                                            })}
                                          >
                                            <SelectTrigger>
                                              <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                              {departments.map((dept) => (
                                                <SelectItem key={dept._id} value={dept._id}>{dept.departmentName}</SelectItem>
                                              ))}
                                            </SelectContent>
                                          </Select>
                                        </div>
                                        <div className="space-y-2">
                                          <label className="text-sm font-medium">Address</label>
                                          <Input 
                                            defaultValue={selectedEmployee.address}
                                            onChange={(e) => setSelectedEmployee({...selectedEmployee, address: e.target.value})}
                                          />
                                        </div>
                                      </div>
                                      
                                      <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                          <label className="text-sm font-medium">Date of Birth</label>
                                          <Input 
                                            type="date" 
                                            defaultValue={selectedEmployee.dob}
                                            onChange={(e) => setSelectedEmployee({...selectedEmployee, dob: e.target.value})}
                                          />
                                        </div>
                                        <div className="space-y-2">
                                          <label className="text-sm font-medium">Salary</label>
                                          <Input 
                                            type="number" 
                                            defaultValue={selectedEmployee.salary}
                                            onChange={(e) => setSelectedEmployee({...selectedEmployee, salary: Number(e.target.value)})}
                                          />
                                        </div>
                                      </div>
                                      
                                      <div className="space-y-2">
                                        <label className="text-sm font-medium">Status</label>
                                        <Select 
                                          defaultValue={selectedEmployee.status}
                                          onValueChange={(value) => setSelectedEmployee({...selectedEmployee, status: value as string})}
                                        >
                                          <SelectTrigger>
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="Active">Active</SelectItem>
                                            <SelectItem value="On Leave">On Leave</SelectItem>
                                            <SelectItem value="Terminated">Terminated</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    </div>
                                  </TabsContent>
                                </Tabs>
                              </div>
                            )}
                            
                            <DialogFooter className="gap-2">
                              <DialogClose asChild>
                                <Button variant="outline">Close</Button>
                              </DialogClose>
                              {viewMode === "view" && user?.role === 'hr' ? (
                                <Button 
                                  variant="destructive"
                                  onClick={handleDelete}
                                  disabled={isActionLoading}
                                  className="flex items-center gap-2"
                                >
                                  <Trash2 size={16} />
                                  <span>{isActionLoading ? "Deleting..." : "Remove Employee"}</span>
                                </Button>
                              ) : (
                                viewMode === "edit" && (
                                  <Button 
                                    onClick={handleEditSave}
                                    disabled={isActionLoading}
                                  >
                                    {isActionLoading ? "Saving..." : "Save Changes"}
                                  </Button>
                                )
                              )}
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
export default EmployeeManagement;


import { useState } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogClose,
  DialogDescription
} from "@/components/ui/dialog";
import { 
  ChartBar, 
  DollarSign, 
  Search, 
  Calendar, 
  FileText, 
  Download, 
  Send,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

// Mock data for payroll
const MOCK_PAYROLL = [
  { 
    id: "1", 
    employeeName: "John Doe",
    employeeId: "EMP001",
    department: "Engineering",
    position: "Senior Frontend Developer",
    baseSalary: 120000,
    bonus: 5000,
    deductions: 3200,
    netSalary: 121800,
    status: "Processed",
    paymentDate: "2025-04-30",
    bankAccount: "****4567",
  },
  { 
    id: "2", 
    employeeName: "Jane Smith",
    employeeId: "EMP002",
    department: "Design",
    position: "UX Designer",
    baseSalary: 95000,
    bonus: 2000,
    deductions: 2100,
    netSalary: 94900,
    status: "Processed",
    paymentDate: "2025-04-30",
    bankAccount: "****7890",
  },
  { 
    id: "3", 
    employeeName: "Robert Johnson",
    employeeId: "EMP003",
    department: "Engineering",
    position: "Full Stack Developer",
    baseSalary: 110000,
    bonus: 0,
    deductions: 2800,
    netSalary: 107200,
    status: "Pending",
    paymentDate: "2025-04-30",
    bankAccount: "****1234",
  },
  { 
    id: "4", 
    employeeName: "Emily Davis",
    employeeId: "EMP004",
    department: "Product",
    position: "Product Manager",
    baseSalary: 115000,
    bonus: 3000,
    deductions: 3000,
    netSalary: 115000,
    status: "Pending",
    paymentDate: "2025-04-30",
    bankAccount: "****5678",
  },
  { 
    id: "5", 
    employeeName: "Michael Wilson",
    employeeId: "EMP005",
    department: "Infrastructure",
    position: "DevOps Engineer",
    baseSalary: 105000,
    bonus: 2500,
    deductions: 2600,
    netSalary: 104900,
    status: "Pending",
    paymentDate: "2025-04-30",
    bankAccount: "****9012",
  },
  { 
    id: "6", 
    employeeName: "Amanda Martinez",
    employeeId: "EMP006",
    department: "Marketing",
    position: "Marketing Specialist",
    baseSalary: 85000,
    bonus: 1000,
    deductions: 1800,
    netSalary: 84200,
    status: "Pending",
    paymentDate: "2025-04-30",
    bankAccount: "****3456",
  },
];

// Mock payroll history
const MOCK_PAYROLL_HISTORY = [
  {
    month: "March 2025",
    totalAmount: 635000,
    employeeCount: 6,
    status: "Completed",
    processedDate: "2025-03-28",
  },
  {
    month: "February 2025",
    totalAmount: 630000,
    employeeCount: 6,
    status: "Completed",
    processedDate: "2025-02-28",
  },
  {
    month: "January 2025",
    totalAmount: 625000,
    employeeCount: 6,
    status: "Completed",
    processedDate: "2025-01-30",
  },
];

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Mock departments
const DEPARTMENTS = ["All", "Engineering", "Design", "Product", "Marketing", "Infrastructure", "Finance", "HR", "Sales"];

const PayrollSystem = () => {
  const [activeTab, setActiveTab] = useState("current");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("All");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedPayroll, setSelectedPayroll] = useState<typeof MOCK_PAYROLL[0] | null>(null);
  const [processingPayroll, setProcessingPayroll] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleRunPayroll = () => {
    setProcessingPayroll(true);
    setProgress(0);
    
    // Simulate payroll processing
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setProcessingPayroll(false);
          toast.success("Payroll processed successfully!");
          return 100;
        }
        return prev + 20;
      });
    }, 800);
  };

  const handleApprovePayroll = () => {
    toast.success("Payroll entry approved!");
  };

  // Apply filters to payroll entries
  const filteredPayroll = MOCK_PAYROLL.filter(entry => {
    const matchesSearch = 
      entry.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.position.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = filterDepartment === "All" || entry.department === filterDepartment;
    const matchesStatus = filterStatus === "all" || entry.status.toLowerCase() === filterStatus.toLowerCase();
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Payroll System</h2>
        <p className="text-muted-foreground">
          Manage and process employee payroll.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <DollarSign className="mr-2 h-4 w-4" />
              <span>Total Payroll</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatCurrency(630000)}</div>
            <p className="text-sm text-muted-foreground">
              April 2025 (estimated)
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              <span>Next Payroll Date</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">April 30</div>
            <p className="text-sm text-muted-foreground">
              {processingPayroll ? 
                "Currently processing" : 
                "10 days remaining"}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <ChartBar className="mr-2 h-4 w-4" />
              <span>Processed Payments</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">2 / 6</div>
            <p className="text-sm text-muted-foreground">
              Employees paid this month
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle className="flex items-center">
              <ChartBar className="mr-2" />
              <span>Payroll Management</span>
            </CardTitle>
            <div className="flex gap-3">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span>Reports</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Payroll Reports</DialogTitle>
                  </DialogHeader>
                  
                  <div className="space-y-4 py-4">
                    <p className="text-sm text-muted-foreground">
                      Generate and download payroll reports for the specified period.
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">From Date</label>
                        <Input type="date" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">To Date</label>
                        <Input type="date" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Report Type</label>
                      <Select defaultValue="summary">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="summary">Payroll Summary</SelectItem>
                          <SelectItem value="detailed">Detailed Report</SelectItem>
                          <SelectItem value="tax">Tax Report</SelectItem>
                          <SelectItem value="department">Department Summary</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Format</label>
                      <Select defaultValue="pdf">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pdf">PDF</SelectItem>
                          <SelectItem value="excel">Excel</SelectItem>
                          <SelectItem value="csv">CSV</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button className="flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      <span>Generate Report</span>
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    disabled={processingPayroll}
                    className="flex items-center gap-2"
                  >
                    <Send className="h-4 w-4" />
                    <span>Run Payroll</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Run April 2025 Payroll</DialogTitle>
                    <DialogDescription>
                      This will process payments for all employees.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 py-4">
                    {processingPayroll ? (
                      <div className="space-y-3">
                        <p className="text-sm font-medium">Processing payroll...</p>
                        <Progress value={progress} className="h-2" />
                        <p className="text-xs text-muted-foreground">
                          This may take a few moments. Please do not close this window.
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center p-3 bg-amber-50 text-amber-800 rounded-md">
                          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                          <p className="text-sm">
                            Running payroll will process payments for all employees and cannot be easily reversed.
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Payment Date</label>
                          <Input type="date" defaultValue="2025-04-30" />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Payment Notes (Optional)</label>
                          <Input placeholder="e.g., 'April 2025 Salary'" />
                        </div>
                      </>
                    )}
                  </div>
                  
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline" disabled={processingPayroll}>
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button 
                      onClick={handleRunPayroll}
                      disabled={processingPayroll}
                    >
                      Confirm & Process
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="current" className="flex items-center gap-2">
                <Calendar size={16} />
                <span>Current Month</span>
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <FileText size={16} />
                <span>Payroll History</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="current">
              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <div className="flex-1">
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
                    {DEPARTMENTS.map((dept) => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full sm:w-[150px]">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="processed">Processed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {filteredPayroll.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No payroll entries found matching your criteria.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted">
                        <th className="py-3 px-4 text-left font-medium">Employee</th>
                        <th className="py-3 px-4 text-left font-medium">Position</th>
                        <th className="py-3 px-4 text-right font-medium">Base Salary</th>
                        <th className="py-3 px-4 text-right font-medium">Bonus</th>
                        <th className="py-3 px-4 text-right font-medium">Deductions</th>
                        <th className="py-3 px-4 text-right font-medium">Net Salary</th>
                        <th className="py-3 px-4 text-center font-medium">Status</th>
                        <th className="py-3 px-4 text-left font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPayroll.map((entry) => (
                        <tr key={entry.id} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4">
                            <div>
                              <p className="font-medium">{entry.employeeName}</p>
                              <p className="text-xs text-muted-foreground">{entry.employeeId}</p>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div>
                              <p>{entry.position}</p>
                              <p className="text-xs text-muted-foreground">{entry.department}</p>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right">{formatCurrency(entry.baseSalary)}</td>
                          <td className="py-3 px-4 text-right">{formatCurrency(entry.bonus)}</td>
                          <td className="py-3 px-4 text-right">{formatCurrency(entry.deductions)}</td>
                          <td className="py-3 px-4 text-right font-medium">{formatCurrency(entry.netSalary)}</td>
                          <td className="py-3 px-4 text-center">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              entry.status === "Processed" 
                                ? "bg-green-100 text-green-800" 
                                : "bg-orange-100 text-orange-800"
                            }`}>
                              {entry.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => setSelectedPayroll(entry)}
                                >
                                  View
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-3xl">
                                <DialogHeader>
                                  <DialogTitle>Payroll Details</DialogTitle>
                                </DialogHeader>
                                
                                {selectedPayroll && (
                                  <div className="space-y-6 py-4">
                                    <div className="flex justify-between items-center">
                                      <div>
                                        <h3 className="text-xl font-bold">{selectedPayroll.employeeName}</h3>
                                        <p className="text-muted-foreground">{selectedPayroll.position} - {selectedPayroll.department}</p>
                                        <p className="text-xs text-muted-foreground mt-1">Employee ID: {selectedPayroll.employeeId}</p>
                                      </div>
                                      <span className={`px-2 py-1 rounded-full text-xs ${
                                        selectedPayroll.status === "Processed" 
                                          ? "bg-green-100 text-green-800" 
                                          : "bg-orange-100 text-orange-800"
                                      }`}>
                                        {selectedPayroll.status}
                                      </span>
                                    </div>
                                    
                                    <div className="grid gap-4 border rounded-lg p-4">
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <p className="text-sm font-medium text-muted-foreground">Payment Date</p>
                                          <p className="font-medium">{formatDate(selectedPayroll.paymentDate)}</p>
                                        </div>
                                        <div>
                                          <p className="text-sm font-medium text-muted-foreground">Bank Account</p>
                                          <p className="font-medium">{selectedPayroll.bankAccount}</p>
                                        </div>
                                      </div>
                                      
                                      <div className="pt-2 border-t">
                                        <div className="flex justify-between items-center mb-2">
                                          <p className="text-sm">Base Salary</p>
                                          <p className="font-medium">{formatCurrency(selectedPayroll.baseSalary)}</p>
                                        </div>
                                        <div className="flex justify-between items-center mb-2">
                                          <p className="text-sm">Bonus</p>
                                          <p className="font-medium">{formatCurrency(selectedPayroll.bonus)}</p>
                                        </div>
                                      </div>
                                      
                                      <div className="pt-2 border-t">
                                        <div className="flex justify-between items-center mb-2">
                                          <p className="text-sm">Tax Deductions</p>
                                          <p className="font-medium text-red-600">-{formatCurrency(selectedPayroll.deductions * 0.7)}</p>
                                        </div>
                                        <div className="flex justify-between items-center mb-2">
                                          <p className="text-sm">Insurance Deductions</p>
                                          <p className="font-medium text-red-600">-{formatCurrency(selectedPayroll.deductions * 0.2)}</p>
                                        </div>
                                        <div className="flex justify-between items-center mb-2">
                                          <p className="text-sm">Other Deductions</p>
                                          <p className="font-medium text-red-600">-{formatCurrency(selectedPayroll.deductions * 0.1)}</p>
                                        </div>
                                      </div>
                                      
                                      <div className="pt-2 border-t">
                                        <div className="flex justify-between items-center">
                                          <p className="font-medium">Net Salary</p>
                                          <p className="text-lg font-bold">{formatCurrency(selectedPayroll.netSalary)}</p>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    {selectedPayroll.status === "Pending" && (
                                      <div className="flex justify-end gap-3">
                                        <Button 
                                          variant="outline"
                                          className="flex items-center gap-2"
                                        >
                                          <FileText className="h-4 w-4" />
                                          <span>Edit</span>
                                        </Button>
                                        <Button 
                                          onClick={handleApprovePayroll}
                                          className="flex items-center gap-2"
                                        >
                                          <Send className="h-4 w-4" />
                                          <span>Process Payment</span>
                                        </Button>
                                      </div>
                                    )}
                                  </div>
                                )}
                                
                                <DialogFooter>
                                  <DialogClose asChild>
                                    <Button variant="outline">Close</Button>
                                  </DialogClose>
                                  {selectedPayroll?.status === "Processed" && (
                                    <Button className="flex items-center gap-2">
                                      <Download className="h-4 w-4" />
                                      <span>Download Slip</span>
                                    </Button>
                                  )}
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-muted/50">
                        <td colSpan={5} className="py-3 px-4 text-right font-medium">Total</td>
                        <td className="py-3 px-4 text-right font-bold">{formatCurrency(filteredPayroll.reduce((sum, entry) => sum + entry.netSalary, 0))}</td>
                        <td colSpan={2}></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="history">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="py-3 px-4 text-left font-medium">Month</th>
                      <th className="py-3 px-4 text-center font-medium">Employees</th>
                      <th className="py-3 px-4 text-right font-medium">Total Amount</th>
                      <th className="py-3 px-4 text-center font-medium">Status</th>
                      <th className="py-3 px-4 text-left font-medium">Processed On</th>
                      <th className="py-3 px-4 text-left font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_PAYROLL_HISTORY.map((history, index) => (
                      <tr key={index} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4 font-medium">{history.month}</td>
                        <td className="py-3 px-4 text-center">{history.employeeCount}</td>
                        <td className="py-3 px-4 text-right">{formatCurrency(history.totalAmount)}</td>
                        <td className="py-3 px-4 text-center">
                          <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                            {history.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">{formatDate(history.processedDate)}</td>
                        <td className="py-3 px-4">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="flex items-center gap-1"
                          >
                            <FileText className="h-3 w-3" />
                            <span>Report</span>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default PayrollSystem;


import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
} from "@/components/ui/dialog";
import { 
  UserPlus, 
  Search, 
  Briefcase,
  User,
  Mail,
  Phone,
  FileText,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

// Mock job applications data
const MOCK_APPLICATIONS = [
  { 
    id: "1", 
    name: "Sarah Wilson",
    email: "sarah.wilson@example.com",
    phone: "555-789-4561",
    position: "Senior Frontend Developer",
    department: "Engineering",
    applyDate: "2025-04-15",
    experience: "7 years",
    status: "New",
    resumeUrl: "#",
    coverLetter: "I am writing to express my interest in the Senior Frontend Developer position. With over 7 years of experience in web development, I have a strong background in React, TypeScript, and building responsive user interfaces...",
    skills: ["React", "TypeScript", "Redux", "CSS", "Node.js"]
  },
  { 
    id: "2", 
    name: "Michael Brown",
    email: "michael.brown@example.com",
    phone: "555-456-7832",
    position: "UX Designer",
    department: "Design",
    applyDate: "2025-04-12",
    experience: "5 years",
    status: "Interview",
    interviewDate: "2025-04-25",
    resumeUrl: "#",
    coverLetter: "I'm excited to apply for the UX Designer position. With 5 years of experience in user research, wireframing, and prototyping, I've worked on projects spanning from e-commerce platforms to mobile applications...",
    skills: ["Figma", "User Research", "Wireframing", "Prototyping", "UI Design"]
  },
  { 
    id: "3", 
    name: "Jennifer Taylor",
    email: "jennifer.taylor@example.com",
    phone: "555-369-8521",
    position: "Product Manager",
    department: "Product",
    applyDate: "2025-04-10",
    experience: "6 years",
    status: "Interview",
    interviewDate: "2025-04-22",
    resumeUrl: "#",
    coverLetter: "I am applying for the Product Manager position at your company. With 6 years of experience in product management across different industries, I have successfully launched multiple products and led cross-functional teams...",
    skills: ["Product Strategy", "User Stories", "Agile", "Market Research", "Roadmapping"]
  },
  { 
    id: "4", 
    name: "David Lee",
    email: "david.lee@example.com",
    phone: "555-852-7413",
    position: "DevOps Engineer",
    department: "Infrastructure",
    applyDate: "2025-04-08",
    experience: "4 years",
    status: "New",
    resumeUrl: "#",
    coverLetter: "I am interested in the DevOps Engineer position. With 4 years of experience in infrastructure automation, CI/CD pipeline implementation, and cloud platforms, I have helped organizations improve their deployment processes and system reliability...",
    skills: ["AWS", "Docker", "Kubernetes", "CI/CD", "Terraform"]
  },
  { 
    id: "5", 
    name: "Emily Johnson",
    email: "emily.johnson@example.com",
    phone: "555-741-9632",
    position: "Marketing Specialist",
    department: "Marketing",
    applyDate: "2025-04-05",
    experience: "3 years",
    status: "Rejected",
    rejectionReason: "Selected another candidate with more relevant industry experience",
    resumeUrl: "#",
    coverLetter: "I am writing to apply for the Marketing Specialist position. With 3 years of experience in digital marketing and content creation, I have developed successful marketing campaigns and improved brand visibility for multiple companies...",
    skills: ["Content Marketing", "Social Media", "SEO", "Analytics", "Email Marketing"]
  },
];

// Mock job postings data
const MOCK_JOB_POSTINGS = [
  { 
    id: "1", 
    title: "Senior Frontend Developer",
    department: "Engineering",
    location: "San Francisco, CA (Hybrid)",
    type: "Full-time",
    postedDate: "2025-04-10",
    deadline: "2025-05-15",
    applicants: 3,
    status: "Open"
  },
  { 
    id: "2", 
    title: "Product Manager",
    department: "Product",
    location: "New York, NY (Remote)",
    type: "Full-time",
    postedDate: "2025-04-05",
    deadline: "2025-05-05",
    applicants: 5,
    status: "Open"
  },
  { 
    id: "3", 
    title: "UX Designer",
    department: "Design",
    location: "Chicago, IL (On-site)",
    type: "Full-time",
    postedDate: "2025-04-12",
    deadline: "2025-05-12",
    applicants: 4,
    status: "Open"
  },
  { 
    id: "4", 
    title: "Marketing Specialist",
    department: "Marketing",
    location: "Boston, MA (Hybrid)",
    type: "Full-time",
    postedDate: "2025-04-15",
    deadline: "2025-05-15",
    applicants: 2,
    status: "Open"
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

// Mock departments
const DEPARTMENTS = ["Engineering", "Design", "Product", "Marketing", "Infrastructure", "Finance", "HR", "Sales"];

const RecruitmentPanel = () => {
  const [activeTab, setActiveTab] = useState("applications");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedApplication, setSelectedApplication] = useState<typeof MOCK_APPLICATIONS[0] | null>(null);

  const handleAccept = () => {
    toast.success("Candidate accepted! Offer letter will be sent.");
  };

  const handleReject = () => {
    toast.success("Candidate rejected. Notification email will be sent.");
  };

  const handleScheduleInterview = () => {
    toast.success("Interview scheduled successfully!");
  };

  const handleAddJobPosting = () => {
    toast.success("New job posting created successfully!");
  };

  // Apply filters to applications
  const filteredApplications = MOCK_APPLICATIONS.filter(application => {
    const matchesSearch = 
      application.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      application.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      application.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || application.status.toLowerCase() === filterStatus.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Recruitment Panel</h2>
        <p className="text-muted-foreground">
          Manage job applications and postings.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle>Recruitment Dashboard</CardTitle>
            {activeTab === "jobPostings" && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    <span>Add Job Posting</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>Create New Job Posting</DialogTitle>
                  </DialogHeader>
                  
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Job Title</label>
                      <Input placeholder="Enter job title" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Department</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent>
                            {DEPARTMENTS.map((dept) => (
                              <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Location</label>
                        <Input placeholder="Enter location" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Employment Type</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="full-time">Full-time</SelectItem>
                            <SelectItem value="part-time">Part-time</SelectItem>
                            <SelectItem value="contract">Contract</SelectItem>
                            <SelectItem value="internship">Internship</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Application Deadline</label>
                        <Input type="date" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Job Description</label>
                      <Textarea 
                        placeholder="Enter detailed job description..." 
                        className="min-h-[100px]"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Requirements</label>
                      <Textarea 
                        placeholder="Enter job requirements..." 
                        className="min-h-[100px]"
                      />
                    </div>
                  </div>
                  
                  <DialogFooter className="gap-2">
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button onClick={handleAddJobPosting}>Create Job Posting</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="applications" className="flex items-center gap-2">
                <UserPlus size={16} />
                <span>Applications</span>
              </TabsTrigger>
              <TabsTrigger value="jobPostings" className="flex items-center gap-2">
                <Briefcase size={16} />
                <span>Job Postings</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="applications">
              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search applications..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="interview">Interview</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {filteredApplications.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No applications found matching your criteria.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted">
                        <th className="py-3 px-4 text-left font-medium">Applicant</th>
                        <th className="py-3 px-4 text-left font-medium">Position</th>
                        <th className="py-3 px-4 text-left font-medium">Applied On</th>
                        <th className="py-3 px-4 text-left font-medium">Experience</th>
                        <th className="py-3 px-4 text-left font-medium">Status</th>
                        <th className="py-3 px-4 text-left font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredApplications.map((application) => (
                        <tr key={application.id} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4">
                            <div>
                              <p className="font-medium">{application.name}</p>
                              <p className="text-xs text-muted-foreground">{application.email}</p>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div>
                              <p>{application.position}</p>
                              <p className="text-xs text-muted-foreground">{application.department}</p>
                            </div>
                          </td>
                          <td className="py-3 px-4">{formatDate(application.applyDate)}</td>
                          <td className="py-3 px-4">{application.experience}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              application.status === "New" 
                                ? "bg-blue-100 text-blue-800" 
                                : application.status === "Interview"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-red-100 text-red-800"
                            }`}>
                              {application.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => setSelectedApplication(application)}
                                >
                                  View
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl">
                                <DialogHeader>
                                  <DialogTitle>Application Details</DialogTitle>
                                </DialogHeader>
                                
                                {selectedApplication && (
                                  <div className="space-y-6 py-4">
                                    <div className="flex flex-col md:flex-row gap-6">
                                      <div className="md:w-1/3 space-y-4">
                                        <div>
                                          <h3 className="text-xl font-bold">{selectedApplication.name}</h3>
                                          <p className="text-muted-foreground">{selectedApplication.position}</p>
                                        </div>
                                        
                                        <div className="space-y-2">
                                          <div className="flex items-center">
                                            <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                                            <span>{selectedApplication.email}</span>
                                          </div>
                                          <div className="flex items-center">
                                            <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                                            <span>{selectedApplication.phone}</span>
                                          </div>
                                          <div className="flex items-center">
                                            <Briefcase className="mr-2 h-4 w-4 text-muted-foreground" />
                                            <span>{selectedApplication.experience} experience</span>
                                          </div>
                                        </div>
                                        
                                        <div>
                                          <p className="text-sm font-medium mb-2">Skills</p>
                                          <div className="flex flex-wrap gap-2">
                                            {selectedApplication.skills.map((skill, index) => (
                                              <Badge key={index} variant="secondary">{skill}</Badge>
                                            ))}
                                          </div>
                                        </div>
                                        
                                        <div>
                                          <p className="text-sm font-medium mb-2">Application Status</p>
                                          <span className={`px-2 py-1 rounded-full text-xs ${
                                            selectedApplication.status === "New" 
                                              ? "bg-blue-100 text-blue-800" 
                                              : selectedApplication.status === "Interview"
                                              ? "bg-purple-100 text-purple-800"
                                              : "bg-red-100 text-red-800"
                                          }`}>
                                            {selectedApplication.status}
                                          </span>
                                          
                                          {selectedApplication.status === "Interview" && selectedApplication.interviewDate && (
                                            <div className="mt-2 text-xs">
                                              Interview scheduled for: <br />
                                              <span className="font-medium">{formatDate(selectedApplication.interviewDate)}</span>
                                            </div>
                                          )}
                                          
                                          {selectedApplication.status === "Rejected" && selectedApplication.rejectionReason && (
                                            <div className="mt-2 text-xs">
                                              Reason: <span className="font-medium">{selectedApplication.rejectionReason}</span>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                      
                                      <div className="md:w-2/3 space-y-4">
                                        <div>
                                          <p className="text-sm font-medium mb-2">Cover Letter</p>
                                          <div className="bg-muted/30 p-4 rounded-md">
                                            <p>{selectedApplication.coverLetter}</p>
                                          </div>
                                        </div>
                                        
                                        <div>
                                          <p className="text-sm font-medium mb-2">Resume</p>
                                          <Button variant="outline" className="flex items-center gap-2">
                                            <FileText className="h-4 w-4" />
                                            <span>Download Resume</span>
                                          </Button>
                                        </div>
                                        
                                        {selectedApplication.status === "New" && (
                                          <div>
                                            <p className="text-sm font-medium mb-2">Schedule Interview</p>
                                            <div className="flex gap-3">
                                              <Input type="date" className="max-w-[200px]" />
                                              <Input type="time" className="max-w-[150px]" />
                                              <Button onClick={handleScheduleInterview}>Schedule</Button>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                )}
                                
                                <DialogFooter className="gap-2">
                                  <DialogClose asChild>
                                    <Button variant="outline">Close</Button>
                                  </DialogClose>
                                  {selectedApplication?.status !== "Rejected" && (
                                    <>
                                      <Button 
                                        variant="destructive" 
                                        onClick={handleReject}
                                        className="flex items-center gap-2"
                                      >
                                        <XCircle size={16} />
                                        <span>Reject</span>
                                      </Button>
                                      <Button 
                                        variant="default" 
                                        onClick={handleAccept}
                                        className="flex items-center gap-2"
                                      >
                                        <CheckCircle size={16} />
                                        <span>Accept</span>
                                      </Button>
                                    </>
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
            </TabsContent>
            
            <TabsContent value="jobPostings">
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                {MOCK_JOB_POSTINGS.map((job) => (
                  <Card key={job.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{job.title}</CardTitle>
                        <Badge variant="outline" className="ml-2">{job.status}</Badge>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <span>{job.department}</span>
                        <span className="mx-2">•</span>
                        <span>{job.location}</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Type</p>
                            <p className="font-medium">{job.type}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Deadline</p>
                            <p className="font-medium">{formatDate(job.deadline)}</p>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="text-sm">
                            <span className="text-muted-foreground">Posted: </span>
                            <span>{formatDate(job.postedDate)}</span>
                          </div>
                          <div className="text-sm">
                            <span className="text-muted-foreground">Applicants: </span>
                            <span className="font-medium">{job.applicants}</span>
                          </div>
                        </div>
                        
                        <div className="flex justify-between pt-2">
                          <Button variant="outline" size="sm">Edit</Button>
                          <Button size="sm">View Applicants</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecruitmentPanel;

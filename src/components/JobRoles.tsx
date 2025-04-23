
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Briefcase, FileText, Building, DollarSign, Calendar } from "lucide-react";
import { toast } from "sonner";
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
import { Badge } from "@/components/ui/badge";

// Mock data for job roles
const MOCK_JOB_ROLES = [
  { 
    id: "1", 
    title: "Senior Frontend Developer",
    department: "Engineering",
    location: "San Francisco, CA (Hybrid)",
    description: "We're looking for a Senior Frontend Developer experienced in React and modern JavaScript frameworks to join our engineering team.",
    requirements: [
      "5+ years of experience with React",
      "Strong understanding of state management",
      "Experience with TypeScript",
      "Knowledge of responsive design principles"
    ],
    salary: "$120,000 - $150,000",
    postedDate: "2025-04-10",
    deadline: "2025-05-15"
  },
  { 
    id: "2", 
    title: "Product Manager",
    department: "Product",
    location: "New York, NY (Remote)",
    description: "Join our product team to help define and execute our product roadmap and strategy.",
    requirements: [
      "3+ years of product management experience",
      "Strong analytical and problem-solving skills",
      "Excellent communication abilities",
      "Experience with agile methodologies"
    ],
    salary: "$110,000 - $140,000",
    postedDate: "2025-04-05",
    deadline: "2025-05-05"
  },
  { 
    id: "3", 
    title: "UX Designer",
    department: "Design",
    location: "Chicago, IL (On-site)",
    description: "We're seeking a talented UX Designer to create beautiful, functional designs for our products.",
    requirements: [
      "Portfolio demonstrating UX design skills",
      "Experience with Figma or similar tools",
      "User research experience",
      "Understanding of accessibility standards"
    ],
    salary: "$90,000 - $120,000",
    postedDate: "2025-04-12",
    deadline: "2025-05-12"
  },
  { 
    id: "4", 
    title: "DevOps Engineer",
    department: "Infrastructure",
    location: "Austin, TX (Remote)",
    description: "Help us scale our infrastructure and improve our deployment processes.",
    requirements: [
      "Experience with AWS or similar cloud platforms",
      "Knowledge of containerization (Docker, Kubernetes)",
      "CI/CD pipeline experience",
      "Infrastructure as code experience"
    ],
    salary: "$115,000 - $145,000",
    postedDate: "2025-04-08",
    deadline: "2025-05-08"
  },
  { 
    id: "5", 
    title: "Marketing Specialist",
    department: "Marketing",
    location: "Boston, MA (Hybrid)",
    description: "Join our marketing team to develop and execute marketing strategies for our products.",
    requirements: [
      "3+ years in digital marketing",
      "Experience with marketing analytics",
      "Content creation skills",
      "Social media marketing experience"
    ],
    salary: "$85,000 - $110,000",
    postedDate: "2025-04-15",
    deadline: "2025-05-15"
  },
];

// Mock data for applications
const MOCK_APPLICATIONS = [
  {
    id: "1",
    jobId: "3",
    jobTitle: "UX Designer",
    appliedDate: "2025-04-14",
    status: "In Review"
  },
  {
    id: "2",
    jobId: "1",
    jobTitle: "Senior Frontend Developer",
    appliedDate: "2025-03-20",
    status: "Interview Scheduled",
    interviewDate: "2025-04-25"
  }
];

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const JobRoles = () => {
  const [selectedJob, setSelectedJob] = useState<typeof MOCK_JOB_ROLES[0] | null>(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const handleApply = () => {
    if (!coverLetter.trim()) {
      toast.error("Please provide a cover letter");
      return;
    }
    
    toast.success(`Application submitted for ${selectedJob?.title}`);
    setCoverLetter("");
  };

  const filteredJobs = MOCK_JOB_ROLES.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Internal Job Opportunities</h2>
        <p className="text-muted-foreground">
          Explore and apply for internal job positions.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Briefcase className="mr-2" />
                  <span>Available Positions</span>
                </CardTitle>
                <Input
                  placeholder="Search jobs..."
                  className="max-w-xs"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredJobs.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No matching positions found. Try a different search term.
                  </div>
                ) : (
                  filteredJobs.map((job) => (
                    <Card key={job.id} className="overflow-hidden">
                      <div className="p-4 border-b">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-lg">{job.title}</h3>
                            <div className="flex items-center text-sm text-muted-foreground mt-1">
                              <Building className="h-4 w-4 mr-1" />
                              <span>{job.department}</span>
                              <span className="mx-2">•</span>
                              <span>{job.location}</span>
                            </div>
                          </div>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                onClick={() => setSelectedJob(job)}
                              >
                                View Details
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl">
                              <DialogHeader>
                                <DialogTitle>{job.title}</DialogTitle>
                                <DialogDescription>
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    <Badge variant="outline" className="flex items-center gap-1">
                                      <Building className="h-3 w-3" />
                                      {job.department}
                                    </Badge>
                                    <Badge variant="outline" className="flex items-center gap-1">
                                      <DollarSign className="h-3 w-3" />
                                      {job.salary}
                                    </Badge>
                                    <Badge variant="outline" className="flex items-center gap-1">
                                      <Calendar className="h-3 w-3" />
                                      Apply by {formatDate(job.deadline)}
                                    </Badge>
                                  </div>
                                </DialogDescription>
                              </DialogHeader>
                              
                              <div className="space-y-4 py-4">
                                <div>
                                  <h4 className="text-sm font-medium mb-2">Location</h4>
                                  <p>{job.location}</p>
                                </div>
                                
                                <div>
                                  <h4 className="text-sm font-medium mb-2">Description</h4>
                                  <p>{job.description}</p>
                                </div>
                                
                                <div>
                                  <h4 className="text-sm font-medium mb-2">Requirements</h4>
                                  <ul className="list-disc pl-5 space-y-1">
                                    {job.requirements.map((req, index) => (
                                      <li key={index}>{req}</li>
                                    ))}
                                  </ul>
                                </div>
                                
                                <div>
                                  <h4 className="text-sm font-medium mb-2">Cover Letter</h4>
                                  <Textarea
                                    placeholder="Why are you interested in this position?"
                                    className="min-h-[100px]"
                                    value={coverLetter}
                                    onChange={(e) => setCoverLetter(e.target.value)}
                                  />
                                </div>
                              </div>
                              
                              <DialogFooter className="gap-2">
                                <DialogClose asChild>
                                  <Button variant="outline">Cancel</Button>
                                </DialogClose>
                                <Button onClick={handleApply}>Submit Application</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                      <CardContent className="p-4 pt-3">
                        <p className="text-sm line-clamp-2">{job.description}</p>
                        <div className="flex justify-between items-center mt-3 text-xs text-muted-foreground">
                          <div className="flex items-center">
                            <DollarSign className="h-3 w-3 mr-1" />
                            <span>{job.salary}</span>
                          </div>
                          <div>Posted: {formatDate(job.postedDate)}</div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2" />
                <span>Your Applications</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {MOCK_APPLICATIONS.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  You haven't applied to any positions yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {MOCK_APPLICATIONS.map((application) => (
                    <div key={application.id} className="border rounded-md p-3">
                      <h4 className="font-medium">{application.jobTitle}</h4>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-muted-foreground">
                          Applied: {formatDate(application.appliedDate)}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          application.status === "Interview Scheduled" 
                            ? "bg-blue-100 text-blue-800" 
                            : "bg-orange-100 text-orange-800"
                        }`}>
                          {application.status}
                        </span>
                      </div>
                      {application.interviewDate && (
                        <div className="mt-2 text-xs bg-blue-50 p-2 rounded-md">
                          Interview scheduled for {formatDate(application.interviewDate)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Application Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <div className="bg-primary text-primary-foreground p-1 rounded-full mt-1 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check"><path d="M20 6 9 17l-5-5"/></svg>
                  </div>
                  <span>Tailor your cover letter to highlight relevant experience.</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="bg-primary text-primary-foreground p-1 rounded-full mt-1 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check"><path d="M20 6 9 17l-5-5"/></svg>
                  </div>
                  <span>Apply for positions that match your career growth plan.</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="bg-primary text-primary-foreground p-1 rounded-full mt-1 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check"><path d="M20 6 9 17l-5-5"/></svg>
                  </div>
                  <span>Speak with current team members to understand role expectations.</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="bg-primary text-primary-foreground p-1 rounded-full mt-1 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check"><path d="M20 6 9 17l-5-5"/></svg>
                  </div>
                  <span>Keep your employee profile updated with recent accomplishments.</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default JobRoles;

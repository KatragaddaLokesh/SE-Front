import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FileText, FileUp, CheckCircle, Clock, AlertCircle, Calendar } from "lucide-react";
import { toast } from "sonner";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type BaseTask = {
  id: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  progress: number;
  assignedBy: string;
  department: string;
}

type ActiveTask = BaseTask & {
  dueDate: string;
}

type CompletedTask = BaseTask & {
  completedDate: string;
}

const MOCK_TASKS: ActiveTask[] = [
  { 
    id: "1", 
    title: "Update CSS for the login page",
    description: "Fix responsiveness issues on mobile devices and ensure consistent styling with brand guidelines.",
    dueDate: "2025-04-25",
    priority: "High",
    status: "In Progress",
    progress: 60,
    assignedBy: "Sarah Johnson",
    department: "Engineering"
  },
  { 
    id: "2", 
    title: "Create user documentation for the new feature",
    description: "Document the steps to use the new analytics dashboard for the users.",
    dueDate: "2025-04-30",
    priority: "Medium",
    status: "Not Started",
    progress: 0,
    assignedBy: "Michael Brown",
    department: "Engineering"
  },
  { 
    id: "3", 
    title: "Peer review code for the payment module",
    description: "Review the pull request #345 for the new payment gateway integration.",
    dueDate: "2025-04-22",
    priority: "High",
    status: "In Progress",
    progress: 25,
    assignedBy: "David Lee",
    department: "Engineering"
  },
];

const MOCK_COMPLETED_TASKS: CompletedTask[] = [
  { 
    id: "4", 
    title: "Implement user authentication",
    description: "Set up JWT-based authentication flow for the application.",
    completedDate: "2025-04-12",
    priority: "High",
    status: "Completed",
    progress: 100,
    assignedBy: "David Lee",
    department: "Engineering"
  },
  { 
    id: "5", 
    title: "Fix navigation bug on Safari",
    description: "Address the dropdown menu not working correctly on Safari browsers.",
    completedDate: "2025-04-10",
    priority: "Medium",
    status: "Completed",
    progress: 100,
    assignedBy: "Sarah Johnson",
    department: "Engineering"
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

const DepartmentWork = () => {
  const [activeTab, setActiveTab] = useState("active");
  const [selectedTask, setSelectedTask] = useState<ActiveTask | CompletedTask | null>(null);
  const [updateComment, setUpdateComment] = useState("");
  const [taskProgress, setTaskProgress] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const handleTaskUpdate = () => {
    if (!updateComment.trim()) {
      toast.error("Please provide an update comment");
      return;
    }
    
    toast.success("Task update submitted successfully");
    setUpdateComment("");
  };

  const handleTaskSubmit = () => {
    toast.success("Task marked as complete");
  };

  const filteredActiveTasks = MOCK_TASKS.filter(task => 
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCompletedTasks = MOCK_COMPLETED_TASKS.filter(task => 
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDisplayDate = (task: ActiveTask | CompletedTask) => {
    if ('dueDate' in task) {
      return formatDate(task.dueDate);
    }
    return formatDate(task.completedDate);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Department Work</h2>
        <p className="text-muted-foreground">
          Manage your departmental tasks and projects.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <FileText className="mr-2" />
              <span>Tasks & Assignments</span>
            </CardTitle>
            <Input
              placeholder="Search tasks..."
              className="max-w-xs"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="active" className="flex items-center gap-2">
                <Clock size={16} />
                <span>Active Tasks ({filteredActiveTasks.length})</span>
              </TabsTrigger>
              <TabsTrigger value="completed" className="flex items-center gap-2">
                <CheckCircle size={16} />
                <span>Completed ({filteredCompletedTasks.length})</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="active">
              {filteredActiveTasks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {searchTerm ? 
                    "No matching tasks found." : 
                    "You have no active tasks at the moment."}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredActiveTasks.map((task) => (
                    <Card key={task.id} className="overflow-hidden">
                      <div className="p-4 border-b">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-lg">{task.title}</h3>
                            <div className="flex items-center text-sm text-muted-foreground mt-1">
                              <span>Due: {formatDate(task.dueDate)}</span>
                              <span className="mx-2">•</span>
                              <span>Priority: {task.priority}</span>
                            </div>
                          </div>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                onClick={() => {
                                  setSelectedTask(task);
                                  setTaskProgress(task.progress);
                                }}
                              >
                                Update
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl">
                              <DialogHeader>
                                <DialogTitle>Task Details</DialogTitle>
                              </DialogHeader>
                              
                              {selectedTask && (
                                <div className="space-y-4 py-4">
                                  <div className="flex justify-between items-start">
                                    <h3 className="font-medium text-lg">{selectedTask.title}</h3>
                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                      selectedTask.priority === "High" 
                                        ? "bg-red-100 text-red-800" 
                                        : selectedTask.priority === "Medium"
                                        ? "bg-orange-100 text-orange-800"
                                        : "bg-blue-100 text-blue-800"
                                    }`}>
                                      {selectedTask.priority}
                                    </span>
                                  </div>
                                  
                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                      <p className="font-medium text-muted-foreground">Status</p>
                                      <p>{selectedTask.status}</p>
                                    </div>
                                    <div>
                                      <p className="font-medium text-muted-foreground">Due Date</p>
                                      <p>{getDisplayDate(selectedTask)}</p>
                                    </div>
                                    <div>
                                      <p className="font-medium text-muted-foreground">Assigned By</p>
                                      <p>{selectedTask.assignedBy}</p>
                                    </div>
                                    <div>
                                      <p className="font-medium text-muted-foreground">Department</p>
                                      <p>{selectedTask.department}</p>
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <p className="font-medium text-muted-foreground text-sm">Description</p>
                                    <p className="mt-1">{selectedTask.description}</p>
                                  </div>
                                  
                                  <div>
                                    <div className="flex justify-between mb-2">
                                      <p className="font-medium text-muted-foreground text-sm">Progress</p>
                                      <span>{taskProgress}%</span>
                                    </div>
                                    <Progress value={taskProgress} className="h-2" />
                                    <Input
                                      type="range"
                                      min="0"
                                      max="100"
                                      value={taskProgress}
                                      onChange={(e) => setTaskProgress(Number(e.target.value))}
                                      className="mt-2"
                                    />
                                  </div>
                                  
                                  <div>
                                    <p className="font-medium text-muted-foreground text-sm mb-2">Update Comments</p>
                                    <Textarea
                                      placeholder="Provide an update on this task..."
                                      className="min-h-[100px]"
                                      value={updateComment}
                                      onChange={(e) => setUpdateComment(e.target.value)}
                                    />
                                  </div>
                                </div>
                              )}
                              
                              <DialogFooter className="gap-2">
                                <DialogClose asChild>
                                  <Button variant="outline">Cancel</Button>
                                </DialogClose>
                                {taskProgress < 100 ? (
                                  <Button onClick={handleTaskUpdate}>Submit Update</Button>
                                ) : (
                                  <Button onClick={handleTaskSubmit}>Mark as Complete</Button>
                                )}
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                      <CardContent className="p-4 pt-3">
                        <p className="text-sm line-clamp-2">{task.description}</p>
                        <div className="mt-3">
                          <div className="flex justify-between mb-1 text-xs">
                            <span>Progress</span>
                            <span>{task.progress}%</span>
                          </div>
                          <Progress value={task.progress} className="h-2" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="completed">
              {filteredCompletedTasks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {searchTerm ? 
                    "No matching completed tasks found." : 
                    "You have no completed tasks yet."}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredCompletedTasks.map((task) => (
                    <Card key={task.id} className="overflow-hidden">
                      <div className="p-4 border-b">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-lg">{task.title}</h3>
                            <div className="flex items-center text-sm text-muted-foreground mt-1">
                              <span>Completed: {formatDate(task.completedDate)}</span>
                              <span className="mx-2">•</span>
                              <span>Priority: {task.priority}</span>
                            </div>
                          </div>
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            Completed
                          </span>
                        </div>
                      </div>
                      <CardContent className="p-4 pt-3">
                        <p className="text-sm">{task.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2" />
              <span>Upcoming Deadlines</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredActiveTasks.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                No upcoming deadlines.
              </div>
            ) : (
              <div className="space-y-3">
                {filteredActiveTasks
                  .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                  .map((task) => (
                    <div key={task.id} className="flex justify-between items-center p-3 border rounded-md">
                      <div>
                        <p className="font-medium">{task.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">Due: {formatDate(task.dueDate)}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        task.priority === "High" 
                          ? "bg-red-100 text-red-800" 
                          : task.priority === "Medium"
                          ? "bg-orange-100 text-orange-800"
                          : "bg-blue-100 text-blue-800"
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileUp className="mr-2" />
              <span>Submit Work</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">
                  Title
                </label>
                <Input id="title" placeholder="Enter title for your submission" />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Description
                </label>
                <Textarea 
                  id="description" 
                  placeholder="Describe your work..." 
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="file" className="text-sm font-medium">
                  Attachments
                </label>
                <div className="border-2 border-dashed rounded-md p-4 text-center cursor-pointer hover:bg-muted/50 transition-colors">
                  <FileUp className="mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Drag & drop files here, or click to browse
                  </p>
                  <input id="file" type="file" className="hidden" />
                </div>
              </div>
              
              <Button className="w-full">Submit Work</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DepartmentWork;

const tasks = [
  {
    id: "1",
    title: "Design Dashboard UI",
    description: "Create the main dashboard layout and sidebar navigation.",
    status: "In Progress",
    dueDate: "2025-07-10",
    subTasks: [
      { id: "1-1", title: "Sidebar", done: true },
      { id: "1-2", title: "Main Content", done: false },
    ],
  },
  {
    id: "2",
    title: "Setup Project Structure",
    description: "Organize folders and files for scalability.",
    status: "Completed",
    dueDate: "2025-07-01",
    subTasks: [
      { id: "2-1", title: "Create folders", done: true },
      { id: "2-2", title: "Add mock data", done: true },
    ],
  },
  {
    id: "3",
    title: "Implement Task List",
    description: "Display tasks with status and due dates.",
    status: "Pending",
    dueDate: "2025-07-15",
  },
  {
    id: "4",
    title: "User Authentication",
    description: "Add login and registration functionality.",
    status: "Logged",
    dueDate: "2025-07-20",
    subTasks: [
      { id: "4-1", title: "Login page", done: false },
      { id: "4-2", title: "Register page", done: false },
    ],
  },
  {
    id: "5",
    title: "Project Overview Page",
    description: "Create a page to list all projects with summary stats.",
    status: "On hold",
    dueDate: "2025-07-18",
  },
  {
    id: "6",
    title: "Task Filtering",
    description: "Allow users to filter tasks by status, due date, and project.",
    status: "In Review",
    dueDate: "2025-07-25",
  },
  {
    id: "7",
    title: "Notifications System",
    description: "Implement notifications for task updates and deadlines.",
    status: "Canceled",
    dueDate: "2025-07-30",
  },
  {
    id: "8",
    title: "Responsive Design",
    description: "Ensure the dashboard works well on all devices.",
    status: "In Progress",
    dueDate: "2025-07-22",
    subTasks: [
      { id: "8-1", title: "Mobile layout", done: false },
      { id: "8-2", title: "Tablet layout", done: false },
    ],
  },
  {
    id: "9",
    title: "Dark Mode Support",
    description: "Add dark mode toggle and styles.",
    status: "Completed",
    dueDate: "2025-07-05",
  },
  {
    id: "10",
    title: "Team Collaboration",
    description: "Enable team members to comment and assign tasks.",
    status: "Pending",
    dueDate: "2025-08-01",
  },
];

export default tasks; 
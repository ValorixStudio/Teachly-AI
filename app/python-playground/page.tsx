"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  RotateCcw,
  Lightbulb,
  CheckCircle2,
  Lock,
  Unlock,
  Terminal,
  FileCode,
  FolderTree,
  Table,
  BarChart2,
  Award,
  Sun,
  Moon,
  ShieldAlert,
  Zap,
  Package,
  GitBranch,
  Cpu,
  Layers,
  ChevronRight,
  Sparkles,
  AlertTriangle,
  FileText,
  Database,
  Check,
  X,
  RefreshCw,
  Eye,
  Send,
  Plus,
  ArrowRight,
  TrendingUp,
  Sliders,
  Download
} from "lucide-react";

// ==========================================
// TYPES & DATA STRUCTURES
// ==========================================

type Theme = "dark" | "light";

interface Mission {
  id: number;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  xp: number;
  description: string;
  requirements: string[];
  keywords: string[];
  starterCode: Record<string, string>;
  activeFile: string;
  hints: string[];
}

interface FileItem {
  name: string;
  type: "file" | "folder";
  content?: string;
  children?: FileItem[];
}

interface StudentData {
  id: number;
  name: string;
  age: number;
  math: number;
  science: number;
  english: number;
  attendance: string;
}

// ==========================================
// MISSIONS INITIAL CONFIGURATION
// ==========================================

const MISSIONS: Mission[] = [
  {
    id: 1,
    title: "Python Basics Revision",
    subtitle: "Start your Python engine",
    icon: <Cpu className="w-4 h-4" />,
    xp: 50,
    description: "Calculate the average score of all students and identify students who scored above 80.",
    requirements: [
      "Define student dataset as a list of dictionaries",
      "Loop through the list to accumulate scores",
      "Calculate the average score",
      "Filter and print students scoring > 80"
    ],
    keywords: ["for", "if", "sum", "len", "print", "score"],
    activeFile: "main.py",
    starterCode: {
      "main.py": `# Mission 1: Python Basics Revision\n# Calculate average score and print high performers (>80)\n\nstudents = [\n    {"name": "Aarav", "score": 82},\n    {"name": "Riya", "score": 91},\n    {"name": "Kabir", "score": 67},\n    {"name": "Ananya", "score": 88}\n]\n\ntotal_score = 0\nfor student in students:\n    total_score += student["score"]\n\naverage = total_score / len(students)\nprint(f"Average Score: {average:.2f}")\n\nprint("High Performers (>80):")\nfor student in students:\n    if student["score"] > 80:\n        print(f"- {student['name']}: {student['score']}")\n`
    },
    hints: [
      "Iterate over the list using 'for student in students:'",
      "Sum the scores and divide by len(students).",
      "Use an 'if student['score'] > 80:' condition to filter high performers."
    ]
  },
  {
    id: 2,
    title: "Advanced Data Structures",
    subtitle: "Build the data engine",
    icon: <Database className="w-4 h-4" />,
    xp: 60,
    description: "Group students into 'High Performers' and 'Average Performers' using dictionaries, sets, and list comprehensions.",
    requirements: [
      "Use list comprehension to extract top scorers",
      "Use a set to ensure unique performance categories",
      "Group students into a structured dictionary"
    ],
    keywords: ["dict", "set", "tuple", "[", "]", "{", "}"],
    activeFile: "data_engine.py",
    starterCode: {
      "data_engine.py": `# Mission 2: Advanced Data Structures\n\nstudents = [\n    {"name": "Aarav", "score": 82, "tags": ("math", "physics")},\n    {"name": "Riya", "score": 91, "tags": ("cs", "math")},\n    {"name": "Kabir", "score": 67, "tags": ("art",)},\n    {"name": "Ananya", "score": 88, "tags": ("math", "cs")}\n]\n\n# List comprehension for high performers\nhigh_performers = [s["name"] for s in students if s["score"] >= 80]\n\n# Unique subjects using sets\nall_subjects = {tag for s in students for tag in s["tags"]}\n\n# Grouping dictionary\nperformance_groups = {\n    "High": [s["name"] for s in students if s["score"] >= 80],\n    "Average": [s["name"] for s in students if s["score"] < 80]\n}\n\nprint("High Performers:", high_performers)\nprint("Unique Subjects:", all_subjects)\nprint("Grouped Data:", performance_groups)\n`
    },
    hints: [
      "Use list comprehension: [s['name'] for s in students if s['score'] >= 80]",
      "Use set comprehensions with curly braces {...} for unique subjects.",
      "Construct a dictionary mapping category strings to list results."
    ]
  },
  {
    id: 3,
    title: "Functions & Modules",
    subtitle: "Make your code reusable",
    icon: <Layers className="w-4 h-4" />,
    xp: 70,
    description: "Refactor messy logic into clean, modular functions split across multi-file utilities.",
    requirements: [
      "Define calculate_average() function",
      "Define find_top_student() function",
      "Import or combine functions cleanly"
    ],
    keywords: ["def", "return", "calculate_average", "find_top_student"],
    activeFile: "main.py",
    starterCode: {
      "main.py": `# Mission 3: Modular Architecture\nfrom statistics_util import calculate_average, find_top_student\n\nstudents = [\n    {"name": "Aarav", "score": 82},\n    {"name": "Riya", "score": 91},\n    {"name": "Kabir", "score": 67}\n]\n\navg = calculate_average(students)\ntop = find_top_student(students)\n\nprint(f"System Avg: {avg:.1f}")\nprint(f"Top Student: {top['name']} ({top['score']})")\n`,
      "statistics_util.py": `# Utility Functions\n\ndef calculate_average(data):\n    if not data:\n        return 0\n    return sum(item["score"] for item in data) / len(data)\n\ndef find_top_student(data):\n    return max(data, key=lambda s: s["score"])\n`
    },
    hints: [
      "Define functions using the 'def' keyword with return values.",
      "Use max() with a key parameter: max(data, key=lambda s: s['score']).",
      "Ensure modular design by keeping processing separate from presentation."
    ]
  },
  {
    id: 4,
    title: "Object-Oriented Programming",
    subtitle: "Turn your system into objects",
    icon: <Package className="w-4 h-4" />,
    xp: 90,
    description: "Encapsulate student state and methods inside a modern Student class with custom methods.",
    requirements: [
      "Define class Student",
      "Implement __init__ method",
      "Implement get_grade() and is_passing() methods"
    ],
    keywords: ["class", "def __init__", "self", "get_grade", "is_passing"],
    activeFile: "student_model.py",
    starterCode: {
      "student_model.py": `# Mission 4: OOP Architecture\n\nclass Student:\n    def __init__(self, name: str, score: int):\n        self.name = name\n        self.score = score\n\n    def is_passing(self) -> bool:\n        return self.score >= 70\n\n    def get_grade(self) -> str:\n        if self.score >= 90: return "A"\n        if self.score >= 80: return "B"\n        if self.score >= 70: return "C"\n        return "F"\n\ns1 = Student("Riya", 91)\ns2 = Student("Kabir", 67)\n\nprint(f"{s1.name} Grade: {s1.get_grade()} (Passing: {s1.is_passing()})")\nprint(f"{s2.name} Grade: {s2.get_grade()} (Passing: {s2.is_passing()})")\n`
    },
    hints: [
      "Classes are declared with 'class Student:'",
      "Always include 'self' as the first parameter in instance methods.",
      "Initialize state inside __init__(self, name, score)."
    ]
  },
  {
    id: 5,
    title: "File Handling",
    subtitle: "Give your application real data",
    icon: <FileText className="w-4 h-4" />,
    xp: 90,
    description: "Read records from students.csv and write an executive summary into report.txt.",
    requirements: [
      "Use 'with open(...)' context manager",
      "Read lines from students.csv",
      "Parse CSV lines and generate report.txt"
    ],
    keywords: ["open", "with", "read", "write", "students.csv", "report.txt"],
    activeFile: "file_processor.py",
    starterCode: {
      "file_processor.py": `# Mission 5: File Operations\n\n# Read CSV Data\nstudents = []\nwith open("students.csv", "r") as f:\n    lines = f.readlines()\n    for line in lines[1:]:  # Skip header\n        if line.strip():\n            parts = line.strip().split(",")\n            students.append({"name": parts[0], "score": int(parts[1])})\n\n# Generate Report\nwith open("report.txt", "w") as f:\n    f.write("=== STUDENT PERFORMANCE REPORT ===\\n")\n    for s in students:\n        f.write(f"Student: {s['name']} | Score: {s['score']}\\n")\n\nprint("Report generated successfully in report.txt!")\n`
    },
    hints: [
      "Always use 'with open(filename, mode) as f:' for safe resource handling.",
      "Use '.split(\",\")' to separate comma-delimited strings.",
      "Mode 'r' reads files, 'w' writes files."
    ]
  },
  {
    id: 6,
    title: "Exception Handling",
    subtitle: "Make your application resilient",
    icon: <ShieldAlert className="w-4 h-4" />,
    xp: 90,
    description: "Safeguard file parsing against missing files, invalid values, and zero division crashes.",
    requirements: [
      "Wrap risky parsing code in a try block",
      "Handle FileNotFoundError and ValueError explicitly",
      "Use a finally block for logging cleanup"
    ],
    keywords: ["try", "except", "FileNotFoundError", "ValueError", "finally"],
    activeFile: "resilient_parser.py",
    starterCode: {
      "resilient_parser.py": `# Mission 6: Error Handling\n\ndef parse_data(filename):\n    try:\n        print(f"Attempting to read {filename}...")\n        with open(filename, "r") as f:\n            data = f.read()\n            # Simulate numeric division/conversion\n            score = int("invalid_number")\n    except FileNotFoundError:\n        print("[HANDLED ERROR] File not found. Creating fallback defaults.")\n    except ValueError as e:\n        print(f"[HANDLED ERROR] Invalid value encountered: {e}")\n    finally:\n        print("[CLEANUP] File handle operation finalized safely.")\n\nparse_data("non_existent_data.csv")\n`
    },
    hints: [
      "Place volatile operations inside a try: block.",
      "Catch specific errors like FileNotFoundError or ValueError using 'except SpecificError:'",
      "Code inside 'finally:' executes regardless of exceptions."
    ]
  },
  {
    id: 7,
    title: "Decorators",
    subtitle: "Add superpowers to your functions",
    icon: <Zap className="w-4 h-4" />,
    xp: 100,
    description: "Implement a @timer decorator to measure execution speed and log activity dynamically.",
    requirements: [
      "Create decorator function timer",
      "Wrap target function using inner wrapper",
      "Apply @timer syntax to analysis functions"
    ],
    keywords: ["def timer", "wrapper", "*args", "**kwargs", "@timer"],
    activeFile: "decorators.py",
    starterCode: {
      "decorators.py": `# Mission 7: Python Decorators\nimport time\n\ndef timer(func):\n    def wrapper(*args, **kwargs):\n        start = time.time()\n        result = func(*args, **kwargs)\n        end = time.time()\n        print(f"[MONITOR] {func.__name__} executed in {(end - start):.4f}s")\n        return result\n    return wrapper\n\n@timer\ndef analyze_large_dataset():
    # Simulate work
    total = sum(i * i for i in range(10000))
    return total

analyze_large_dataset()
`
    },
    hints: [
      "A decorator takes a function as an argument and returns a replacement function.",
      "Use *args and **kwargs in wrapper to accept any parameters.",
      "Apply the decorator with '@timer' above your function header."
    ]
  },
  {
    id: 8,
    title: "Generators & Iterators",
    subtitle: "Process massive datasets efficiently",
    icon: <RefreshCw className="w-4 h-4" />,
    xp: 120,
    description: "Build a stream generator using yield to process 1,000,000 dataset rows with minimal memory usage.",
    requirements: [
      "Define generator function using yield",
      "Stream dataset records chunk by chunk",
      "Process items with memory efficiency"
    ],
    keywords: ["yield", "def", "for", "generator"],
    activeFile: "stream_processor.py",
    starterCode: {
      "stream_processor.py": `# Mission 8: High-Performance Generators\n\ndef stream_big_data(total_records=1000000):\n    for i in range(1, total_records + 1):\n        # Yield items one-by-one without memory blowout\n        yield {"id": i, "value": f"Record_{i}"}\n\nprint("Initializing dataset stream...")\ngenerator = stream_big_data(1000000)\n\n# Process first 3 records dynamically\nprint("Chunk 1:", next(generator))\nprint("Chunk 2:", next(generator))\nprint("Chunk 3:", next(generator))\n`
    },
    hints: [
      "Replace 'return' with 'yield' to transform a function into a generator.",
      "Generators produce items on-demand using next() or a for loop.",
      "Memory stays low because values aren't stored all at once."
    ]
  },
  {
    id: 9,
    title: "Virtual Environments",
    subtitle: "Create an isolated environment",
    icon: <Sliders className="w-4 h-4" />,
    xp: 80,
    description: "Isolate dependencies by provisioning a project virtual environment.",
    requirements: [
      "Run python -m venv venv command",
      "Activate the environment",
      "Verify environment status"
    ],
    keywords: ["venv", "activate", "python -m venv"],
    activeFile: "terminal.sh",
    starterCode: {
      "terminal.sh": `# Run the shell commands below in the Virtual Env Simulator panel:\n$ python -m venv venv\n$ source venv/bin/activate\n`
    },
    hints: [
      "Virtual environments keep dependencies isolated between projects.",
      "Execute 'python -m venv venv' to build the environment directory.",
      "Use 'source venv/bin/activate' (or venv\\Scripts\\activate on Windows) to activate."
    ]
  },
  {
    id: 10,
    title: "Package Management",
    subtitle: "Install and manage dependencies",
    icon: <Package className="w-4 h-4" />,
    xp: 100,
    description: "Manage packages with pip, install pandas & numpy, and generate a requirements.txt file.",
    requirements: [
      "Install required packages (pandas, numpy)",
      "Verify package status in manager",
      "Generate requirements.txt"
    ],
    keywords: ["pip install", "pandas", "numpy", "requirements.txt"],
    activeFile: "requirements.txt",
    starterCode: {
      "requirements.txt": `# Installed dependencies\npandas>=2.0.0\nnumpy>=1.24.0\n`
    },
    hints: [
      "Use 'pip install <package>' to fetch libraries from PyPI.",
      "Use 'pip freeze > requirements.txt' to document exact environment dependencies.",
      "Click 'Install' next to packages in the Package Manager tab."
    ]
  },
  {
    id: 11,
    title: "Git & GitHub Basics",
    subtitle: "Ship your Python project",
    icon: <GitBranch className="w-4 h-4" />,
    xp: 150,
    description: "Initialize a local Git repository, commit code changes, and push your repository to GitHub.",
    requirements: [
      "Execute git init",
      "Stage files with git add .",
      "Create commit with git commit",
      "Publish with git push"
    ],
    keywords: ["git init", "git add", "git commit", "git push"],
    activeFile: "git_workflow.sh",
    starterCode: {
      "git_workflow.sh": `# Git Deployment Workflow\n$ git init\n$ git add .\n$ git commit -m "feat: complete python data analyzer"\n$ git push origin main\n`
    },
    hints: [
      "Initialize version control with 'git init'.",
      "Stage changes with 'git add .' and record snapshot with 'git commit -m \"...\"'.",
      "Upload local commits to GitHub using 'git push'."
    ]
  }
];

// Sample Spreadsheet Data for Data Panel
const SAMPLE_STUDENTS_DATA: StudentData[] = [
  { id: 1, name: "Aarav Sharma", age: 20, math: 85, science: 90, english: 78, attendance: "94%" },
  { id: 2, name: "Riya Patel", age: 21, math: 92, science: 95, english: 88, attendance: "98%" },
  { id: 3, name: "Kabir Verma", age: 20, math: 65, science: 70, english: 68, attendance: "82%" },
  { id: 4, name: "Ananya Gupta", age: 22, math: 88, science: 84, english: 92, attendance: "91%" },
  { id: 5, name: "Rohan Singh", age: 21, math: 74, science: 78, english: 80, attendance: "88%" },
  { id: 6, name: "Isha Reddy", age: 20, math: 95, science: 96, english: 94, attendance: "99%" },
  { id: 7, name: "Vikram Malhotra", age: 22, math: 58, science: 62, english: 60, attendance: "75%" }
];

// Available Packages for Mission 10
interface PyPackage {
  name: string;
  version: string;
  description: string;
  installed: boolean;
}

const INITIAL_PACKAGES: PyPackage[] = [
  { name: "pandas", version: "2.1.4", description: "Powerful data structures and data analysis toolkit", installed: false },
  { name: "numpy", version: "1.26.2", description: "Fundamental package for scientific computing with Python", installed: false },
  { name: "requests", version: "2.31.0", description: "Elegant and simple HTTP library for Python", installed: false },
  { name: "matplotlib", version: "3.8.2", description: "Comprehensive library for creating static, animated, and interactive visualizations", installed: false },
  { name: "scikit-learn", version: "1.3.2", description: "Machine learning and data mining algorithms in Python", installed: false }
];

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function PythonEngineeringPlayground() {
  // Theme State
  const [theme, setTheme] = useState<Theme>("dark");

  // Game Engine State
  const [currentMissionId, setCurrentMissionId] = useState<number>(1);
  const [completedMissions, setCompletedMissions] = useState<number[]>([]);
  const [unlockedMissions, setUnlockedMissions] = useState<number[]>([1]);
  const [xp, setXp] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<"code" | "terminal" | "files" | "data" | "progress">("code");
  
  // Editor & Files State
  const [fileContents, setFileContents] = useState<Record<string, string>>(MISSIONS[0].starterCode);
  const [activeFileName, setActiveFileName] = useState<string>("main.py");
  
  // Terminal State
  const [terminalLogs, setTerminalLogs] = useState<Array<{ text: string; type: "info" | "success" | "warn" | "error" }>>([
    { text: "🐍 Python Engineering Playground Terminal initialized.", type: "info" },
    { text: "Select a mission and click 'Run Code' to execute logic.", type: "info" }
  ]);

  // Hints System State
  const [currentHintIndex, setCurrentHintIndex] = useState<number>(-1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Exception Handling Mission State
  const [injectedError, setInjectedError] = useState<string | null>(null);

  // Virtual Env & Package Manager State
  const [venvActive, setVenvActive] = useState<boolean>(false);
  const [venvCreated, setVenvCreated] = useState<boolean>(false);
  const [packages, setPackages] = useState<PyPackage[]>(INITIAL_PACKAGES);

  // Git State
  const [gitStatus, setGitStatus] = useState<{
    initialized: boolean;
    staged: boolean;
    committed: boolean;
    pushed: boolean;
    logs: string[];
  }>({
    initialized: false,
    staged: false,
    committed: false,
    pushed: false,
    logs: []
  });

  // Capstone & Modal State
  const [capstoneUnlocked, setCapstoneUnlocked] = useState<boolean>(false);
  const [capstoneCompleted, setCapstoneCompleted] = useState<boolean>(false);
  const [showCertificate, setShowCertificate] = useState<boolean>(false);

  // Data Panel Filter
  const [dataSearch, setDataSearch] = useState<string>("");

  const activeMission = MISSIONS.find((m) => m.id === currentMissionId) || MISSIONS[0];

  // Sync editor file contents when changing missions
  useEffect(() => {
    setFileContents(activeMission.starterCode);
    setActiveFileName(activeMission.activeFile);
    setCurrentHintIndex(-1);
  }, [currentMissionId]);

  // Toast auto-clear
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Calculate Total Max XP
  const maxXP = MISSIONS.reduce((sum, m) => sum + m.xp, 0) + 200; // 200 extra for Capstone
  const completionPercentage = Math.min(100, Math.round((xp / maxXP) * 100));

  // Switch Dark/Light Mode
  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  // Log to Terminal Helper
  const addTerminalLog = (text: string, type: "info" | "success" | "warn" | "error" = "info") => {
    setTerminalLogs((prev) => [...prev, { text, type }]);
  };

  // Toast Notification Helper
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
  };

  // Show Next Hint
  const handleShowHint = () => {
    if (currentHintIndex < activeMission.hints.length - 1) {
      setCurrentHintIndex((prev) => prev + 1);
      triggerToast(`💡 Hint unlocked! (-5 XP penalty)`);
      setXp((prev) => Math.max(0, prev - 5));
    } else {
      triggerToast("No more hints available for this mission.");
    }
  };

  // Reset Code
  const handleResetCode = () => {
    setFileContents(activeMission.starterCode);
    addTerminalLog(`Reset code for ${activeFileName} to default.`, "warn");
    triggerToast("Code reset to starter state.");
  };

  // ==========================================
  // SIMULATED PYTHON EXECUTION ENGINE
  // ==========================================
  const handleRunCode = () => {
    setActiveTab("terminal");
    addTerminalLog(`$ python ${activeFileName}`, "info");
    addTerminalLog("Loading Python Virtual Engine simulator...", "info");

    const code = fileContents[activeFileName] || "";
    let isPassed = false;
    let feedback = "";

    switch (currentMissionId) {
      case 1: {
        const hasLoop = code.includes("for") || code.includes("while");
        const hasCalc = code.includes("/") || code.includes("sum");
        const hasIf = code.includes("if");
        if (hasLoop && hasCalc && hasIf) {
          isPassed = true;
          feedback = "Output:\nAverage Score: 80.50\nHigh Performers (>80):\n- Aarav: 82\n- Riya: 91\n- Ananya: 88\n\n✓ Code executed successfully! Criteria met.";
        } else {
          feedback = "⚠️ Output:\nExecution completed, but mission criteria incomplete. Make sure to use a loop, calculate average, and filter with an if condition.";
        }
        break;
      }
      case 2: {
        const hasDict = code.includes("{") && code.includes("}");
        const hasComp = code.includes("for") && code.includes("in");
        if (hasDict && hasComp) {
          isPassed = true;
          feedback = "Output:\nHigh Performers: ['Aarav', 'Riya', 'Ananya']\nUnique Subjects: {'math', 'physics', 'cs', 'art'}\nGrouped Data: {'High': ['Aarav', 'Riya', 'Ananya'], 'Average': ['Kabir']}\n\n✓ Advanced data structures validated!";
        } else {
          feedback = "⚠️ Data structure grouping failed. Ensure list/set comprehensions and dictionary mappings are present.";
        }
        break;
      }
      case 3: {
        const hasDefAvg = code.includes("calculate_average") || fileContents["statistics_util.py"]?.includes("def calculate_average");
        const hasDefTop = code.includes("find_top_student") || fileContents["statistics_util.py"]?.includes("def find_top_student");
        if (hasDefAvg && hasDefTop) {
          isPassed = true;
          feedback = "Output:\nSystem Avg: 80.0\nTop Student: Riya (91)\n\n✓ Modular refactoring verified across modules!";
        } else {
          feedback = "⚠️ Make sure you defined and called calculate_average() and find_top_student() properly.";
        }
        break;
      }
      case 4: {
        const hasClass = code.includes("class Student");
        const hasInit = code.includes("__init__");
        const hasGrade = code.includes("get_grade") && code.includes("is_passing");
        if (hasClass && hasInit && hasGrade) {
          isPassed = true;
          feedback = "Output:\nRiya Grade: A (Passing: True)\nKabir Grade: F (Passing: False)\n\n✓ Object-Oriented class definition verified!";
        } else {
          feedback = "⚠️ Object structure missing required methods. Implement class Student, __init__, get_grade, and is_passing.";
        }
        break;
      }
      case 5: {
        const hasOpen = code.includes("open(");
        const hasWith = code.includes("with");
        if (hasOpen && hasWith) {
          isPassed = true;
          // Update simulated files
          setFileContents((prev) => ({
            ...prev,
            "report.txt": "=== STUDENT PERFORMANCE REPORT ===\nStudent: Aarav | Score: 82\nStudent: Riya | Score: 91\nStudent: Kabir | Score: 67\n"
          }));
          feedback = "Output:\nReading students.csv...\nGenerating report.txt...\nReport generated successfully in report.txt!\n\n✓ File operations completed and report created!";
        } else {
          feedback = "⚠️ Always use 'with open()' for proper file resource management.";
        }
        break;
      }
      case 6: {
        const hasTryExcept = code.includes("try:") && code.includes("except");
        if (hasTryExcept) {
          isPassed = true;
          setInjectedError(null);
          feedback = "Output:\nAttempting to read data file...\n[HANDLED ERROR] File/Value error gracefully caught and logged.\n[CLEANUP] File handle operation finalized safely.\n\n✓ Exception handling active! Resilience test passed.";
        } else {
          feedback = "❌ Traceback (most recent call last):\n  File \"main.py\", line 8, in <module>\nValueError: invalid literal for int() with base 10\nCRASH! Unhandled exception terminated execution.";
        }
        break;
      }
      case 7: {
        const hasDecoratorDef = code.includes("def timer") || code.includes("wrapper");
        const hasSyntax = code.includes("@timer");
        if (hasDecoratorDef && hasSyntax) {
          isPassed = true;
          feedback = "Output:\n[MONITOR] analyze_large_dataset executed in 0.0024s\nCalculation Result: 333283335000\n\n✓ Decorator performance monitoring applied successfully!";
        } else {
          feedback = "⚠️ Decorator pattern incomplete. Define def timer(func) and apply using @timer syntax.";
        }
        break;
      }
      case 8: {
        const hasYield = code.includes("yield");
        if (hasYield) {
          isPassed = true;
          feedback = "Output:\nInitializing dataset stream...\nChunk 1: {'id': 1, 'value': 'Record_1'}\nChunk 2: {'id': 2, 'value': 'Record_2'}\nChunk 3: {'id': 3, 'value': 'Record_3'}\nProcessed: 1,000,000 records dynamically using generator yield!\n\n✓ Generator streaming verified with ultra-low memory footprint!";
        } else {
          feedback = "⚠️ High memory alert! Use 'yield' instead of returning large lists at once.";
        }
        break;
      }
      case 9: {
        if (venvActive) {
          isPassed = true;
          feedback = "Output:\nVirtual Environment: (venv) active\nPython Runtime: 3.11.4 [Isolated]\n\n✓ Virtual Environment validated!";
        } else {
          feedback = "⚠️ Virtual Environment not activated yet. Use the Shell simulation commands below.";
        }
        break;
      }
      case 10: {
        const pandasInstalled = packages.find((p) => p.name === "pandas")?.installed;
        const numpyInstalled = packages.find((p) => p.name === "numpy")?.installed;
        if (pandasInstalled && numpyInstalled) {
          isPassed = true;
          feedback = "Output:\nPackage Verification:\n- pandas==2.1.4 [INSTALLED]\n- numpy==1.26.2 [INSTALLED]\nRequirements match requirements.txt.\n\n✓ Package Management mission complete!";
        } else {
          feedback = "⚠️ Missing required dependencies. Go to Package Manager and install 'pandas' and 'numpy'.";
        }
        break;
      }
      case 11: {
        if (gitStatus.pushed) {
          isPassed = true;
          feedback = "Output:\nRemote: GitHub Repository Updated!\nBranch: main -> main\nStatus: 100% Synced & Deployed!\n\n✓ Git & GitHub Deployment completed!";
        } else {
          feedback = "⚠️ Git workflow incomplete. Execute git init, add, commit, and push in the Git simulator.";
        }
        break;
      }
      default:
        feedback = "Code executed.";
    }

    addTerminalLog(feedback, isPassed ? "success" : "warn");

    if (isPassed && !completedMissions.includes(currentMissionId)) {
      completeMission(currentMissionId, activeMission.xp);
    }
  };

  // Complete Mission Handler
  const completeMission = (missionId: number, xpReward: number) => {
    setCompletedMissions((prev) => [...prev, missionId]);
    setXp((prev) => prev + xpReward);
    triggerToast(`🎉 Mission ${missionId} Complete! +${xpReward} XP`);

    // Unlock next mission
    const nextId = missionId + 1;
    if (nextId <= MISSIONS.length) {
      setUnlockedMissions((prev) => Array.from(new Set([...prev, nextId])));
    } else {
      setCapstoneUnlocked(true);
      triggerToast("🚀 ALL MISSIONS COMPLETE! Capstone Challenge Unlocked!");
    }
  };

  // Reset entire playground
  const handleResetLab = () => {
    if (confirm("Are you sure you want to reset all progress? XP and missions will be cleared.")) {
      setCurrentMissionId(1);
      setCompletedMissions([]);
      setUnlockedMissions([1]);
      setXp(0);
      setFileContents(MISSIONS[0].starterCode);
      setActiveFileName("main.py");
      setTerminalLogs([{ text: "Lab progress reset successfully.", type: "info" }]);
      setPackages(INITIAL_PACKAGES);
      setVenvActive(false);
      setVenvCreated(false);
      setGitStatus({ initialized: false, staged: false, committed: false, pushed: false, logs: [] });
      setCapstoneUnlocked(false);
      setCapstoneCompleted(false);
      setShowCertificate(false);
      triggerToast("Lab progress reset.");
    }
  };

  // Run Capstone Challenge Validation
  const handleRunCapstone = () => {
    setActiveTab("terminal");
    addTerminalLog("$ python capstone_analyzer.py", "info");
    addTerminalLog("Executing Full Pipeline Python Data Analyzer...", "info");

    setTimeout(() => {
      addTerminalLog("✓ Data Ingestion (employee_data.csv): 500 records loaded", "success");
      addTerminalLog("✓ Decorator @timer benchmarking data engine: 0.012s execution", "success");
      addTerminalLog("✓ Generator stream streaming rows without memory spike", "success");
      addTerminalLog("✓ Exception handling caught 2 corrupt salary rows safely", "success");
      addTerminalLog("✓ Summary analytics exported to final_analytics_report.txt", "success");
      addTerminalLog("🎉 CAPSTONE COMPLETE! YOU ARE A CERTIFIED PYTHON ENGINEER!", "success");

      if (!capstoneCompleted) {
        setCapstoneCompleted(true);
        setXp((prev) => prev + 200);
        setShowCertificate(true);
      }
    }, 1000);
  };

  // Filtered dataset for Data Panel
  const filteredStudents = SAMPLE_STUDENTS_DATA.filter((s) =>
    s.name.toLowerCase().includes(dataSearch.toLowerCase())
  );

  return (
    <div className={theme === "dark" ? "bg-slate-950 text-slate-100 min-h-screen font-sans" : "bg-slate-50 text-slate-900 min-h-screen font-sans"}>
      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-3 bg-indigo-600 text-white px-5 py-3 rounded-xl shadow-2xl animate-bounce">
          <Sparkles className="w-5 h-5" />
          <span className="font-medium text-sm">{toastMessage}</span>
        </div>
      )}

      {/* TOP HEADER */}
      <header className={`border-b ${theme === "dark" ? "bg-slate-900/80 border-slate-800" : "bg-white/80 border-slate-200"} backdrop-blur sticky top-0 z-40 px-4 py-3`}>
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-yellow-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg font-bold text-xl">
              🐍
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight flex items-center gap-2">
                Python Engineering Playground
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  Level 4 • Engineer
                </span>
              </h1>
              <p className="text-xs text-slate-400">Interactive Interactive Hands-On Lab</p>
            </div>
          </div>

          {/* Gamification Status Bar */}
          <div className="flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-3 bg-slate-800/50 border border-slate-700/50 px-3 py-1.5 rounded-lg">
              <Award className="w-5 h-5 text-yellow-400" />
              <div>
                <div className="flex items-center justify-between text-xs gap-4">
                  <span className="text-slate-400">XP Progress</span>
                  <span className="font-mono font-bold text-yellow-400">{xp} / {maxXP} XP</span>
                </div>
                <div className="w-32 bg-slate-700 h-2 rounded-full overflow-hidden mt-1">
                  <div
                    className="bg-gradient-to-r from-yellow-400 to-amber-500 h-full transition-all duration-500"
                    style={{ width: `${completionPercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Dark / Light Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg border transition-colors ${
                theme === "dark"
                  ? "bg-slate-800 border-slate-700 text-yellow-400 hover:bg-slate-700"
                  : "bg-slate-200 border-slate-300 text-slate-700 hover:bg-slate-300"
              }`}
              title="Toggle Theme"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Reset Button */}
            <button
              onClick={handleResetLab}
              className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 px-3 py-1.5 rounded-lg border border-rose-500/20 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Lab
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT SIDEBAR: MISSION TREE (4 Cols) */}
        <aside className="lg:col-span-4 space-y-4">
          <div className={`p-4 rounded-2xl border ${theme === "dark" ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"} shadow-sm`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-sm uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <FolderTree className="w-4 h-4" /> Mission Tree
              </h2>
              <span className="text-xs bg-indigo-500/10 text-indigo-400 font-semibold px-2 py-0.5 rounded-full border border-indigo-500/20">
                {completedMissions.length} / {MISSIONS.length} Done
              </span>
            </div>

            {/* Mission List */}
            <div className="space-y-2 max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
              {MISSIONS.map((m) => {
                const isCompleted = completedMissions.includes(m.id);
                const isUnlocked = unlockedMissions.includes(m.id);
                const isActive = currentMissionId === m.id;

                return (
                  <button
                    key={m.id}
                    onClick={() => isUnlocked && setCurrentMissionId(m.id)}
                    disabled={!isUnlocked}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                      isActive
                        ? "bg-indigo-600/10 border-indigo-500 text-indigo-300 ring-1 ring-indigo-500/50"
                        : isCompleted
                        ? "bg-emerald-500/5 border-emerald-500/30 text-slate-300 hover:border-emerald-500/50"
                        : isUnlocked
                        ? "bg-slate-800/40 border-slate-700/60 text-slate-300 hover:bg-slate-800"
                        : "opacity-50 bg-slate-900/40 border-slate-800/40 cursor-not-allowed"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                          isCompleted
                            ? "bg-emerald-500 text-slate-950"
                            : isActive
                            ? "bg-indigo-600 text-white"
                            : isUnlocked
                            ? "bg-slate-700 text-slate-300"
                            : "bg-slate-800 text-slate-600"
                        }`}
                      >
                        {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : m.id}
                      </div>
                      <div>
                        <div className="font-semibold text-xs flex items-center gap-1.5">
                          {m.title}
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-1">{m.subtitle}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-1.5 py-0.5 rounded">
                        +{m.xp}XP
                      </span>
                      {isUnlocked ? (
                        <ChevronRight className={`w-4 h-4 ${isActive ? "text-indigo-400" : "text-slate-500"}`} />
                      ) : (
                        <Lock className="w-3.5 h-3.5 text-slate-600" />
                      )}
                    </div>
                  </button>
                );
              })}

              {/* CAPSTONE CARD */}
              <div
                className={`p-3.5 rounded-xl border transition-all mt-4 ${
                  capstoneUnlocked
                    ? "bg-gradient-to-r from-amber-500/10 to-indigo-500/10 border-amber-500/40 text-amber-300"
                    : "opacity-40 bg-slate-900 border-slate-800 cursor-not-allowed"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                      🚀
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-amber-300">Final Capstone Challenge</h4>
                      <p className="text-[10px] text-slate-400">Full Data Analyzer Deployment</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">
                    +200 XP
                  </span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* RIGHT MAIN PLAYGROUND (8 Cols) */}
        <main className="lg:col-span-8 space-y-4">
          
          {/* MISSION CONTEXT BANNER */}
          <div className={`p-5 rounded-2xl border ${theme === "dark" ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"} shadow-sm`}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-semibold">
                    MISSION {activeMission.id} OF {MISSIONS.length}
                  </span>
                  <span className="text-xs text-slate-400">• Reward: {activeMission.xp} XP</span>
                </div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  {activeMission.title}
                </h2>
                <p className="text-sm text-slate-300 mt-1">{activeMission.description}</p>
              </div>

              {/* Action Toolbar */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleShowHint}
                  className="flex items-center gap-1 text-xs bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                  Hint
                </button>
                <button
                  onClick={handleResetCode}
                  className="flex items-center gap-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset
                </button>
              </div>
            </div>

            {/* Checklist */}
            <div className="mt-4 pt-4 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-2 gap-2">
              {activeMission.requirements.map((req, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-slate-400">
                  <div className="w-4 h-4 rounded-full border border-slate-700 flex items-center justify-center text-[10px]">
                    ✓
                  </div>
                  <span>{req}</span>
                </div>
              ))}
            </div>

            {/* Active Hint display */}
            {currentHintIndex >= 0 && (
              <div className="mt-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong>Hint {currentHintIndex + 1}:</strong> {activeMission.hints[currentHintIndex]}
                </div>
              </div>
            )}
          </div>

          {/* PLAYGROUND TABS & WORKSPACE */}
          <div className={`rounded-2xl border ${theme === "dark" ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"} shadow-sm overflow-hidden`}>
            
            {/* TAB HEADER */}
            <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/50 px-4">
              <div className="flex items-center gap-1 overflow-x-auto">
                <button
                  onClick={() => setActiveTab("code")}
                  className={`px-3 py-2.5 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === "code"
                      ? "border-indigo-500 text-indigo-400 bg-indigo-500/5"
                      : "border-transparent text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5" />
                  Code Editor
                </button>

                <button
                  onClick={() => setActiveTab("terminal")}
                  className={`px-3 py-2.5 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === "terminal"
                      ? "border-indigo-500 text-indigo-400 bg-indigo-500/5"
                      : "border-transparent text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5" />
                  Terminal / Simulator
                </button>

                <button
                  onClick={() => setActiveTab("files")}
                  className={`px-3 py-2.5 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === "files"
                      ? "border-indigo-500 text-indigo-400 bg-indigo-500/5"
                      : "border-transparent text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <FolderTree className="w-3.5 h-3.5" />
                  Files
                </button>

                <button
                  onClick={() => setActiveTab("data")}
                  className={`px-3 py-2.5 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === "data"
                      ? "border-indigo-500 text-indigo-400 bg-indigo-500/5"
                      : "border-transparent text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Table className="w-3.5 h-3.5" />
                  Data Panel
                </button>

                <button
                  onClick={() => setActiveTab("progress")}
                  className={`px-3 py-2.5 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === "progress"
                      ? "border-indigo-500 text-indigo-400 bg-indigo-500/5"
                      : "border-transparent text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <BarChart2 className="w-3.5 h-3.5" />
                  Progress
                </button>
              </div>

              {/* Execution Action */}
              <button
                onClick={handleRunCode}
                className="my-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs px-4 py-1.5 rounded-lg flex items-center gap-1.5 shadow-md transition-all active:scale-95"
              >
                <Play className="w-3.5 h-3.5 fill-slate-950" />
                Run Code
              </button>
            </div>

            {/* TAB CONTENT PANELS */}
            <div className="p-4 min-h-[380px]">
              
              {/* TAB 1: CODE EDITOR */}
              {activeTab === "code" && (
                <div className="space-y-3">
                  {/* File Selector Tabs if mission has multiple files */}
                  <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                    {Object.keys(fileContents).map((fileName) => (
                      <button
                        key={fileName}
                        onClick={() => setActiveFileName(fileName)}
                        className={`text-xs px-3 py-1 rounded-md font-mono flex items-center gap-1.5 transition-colors ${
                          activeFileName === fileName
                            ? "bg-slate-800 text-indigo-300 border border-slate-700"
                            : "text-slate-400 hover:bg-slate-800/50"
                        }`}
                      >
                        <FileText className="w-3 h-3" />
                        {fileName}
                      </button>
                    ))}
                  </div>

                  {/* Textarea Code Editor */}
                  <div className="relative font-mono text-sm rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                    <div className="flex">
                      {/* Line Numbers */}
                      <div className="select-none py-3 px-2 text-right bg-slate-900/50 text-slate-600 border-r border-slate-800/60 text-xs font-mono space-y-1 w-10">
                        {Array.from({ length: (fileContents[activeFileName] || "").split("\n").length || 1 }).map((_, i) => (
                          <div key={i}>{i + 1}</div>
                        ))}
                      </div>

                      {/* Code Input */}
                      <textarea
                        value={fileContents[activeFileName] || ""}
                        onChange={(e) =>
                          setFileContents({
                            ...fileContents,
                            [activeFileName]: e.target.value
                          })
                        }
                        className="w-full h-80 bg-transparent p-3 text-slate-200 focus:outline-none resize-none font-mono text-xs leading-relaxed"
                        spellCheck={false}
                      />
                    </div>
                  </div>

                  {/* MISSION 6 SPECIFIC TOOL: INJECT ERROR */}
                  {currentMissionId === 6 && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs space-y-2">
                      <div className="font-semibold text-rose-300 flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-rose-400" />
                        Exception Handling Simulator - Inject Error Test:
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {["Missing File", "Invalid Number", "Division By Zero"].map((errName) => (
                          <button
                            key={errName}
                            onClick={() => {
                              setInjectedError(errName);
                              addTerminalLog(`[SIMULATION] Injected fault: ${errName}`, "error");
                            }}
                            className="bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 px-2.5 py-1 rounded border border-rose-500/30 text-[11px]"
                          >
                            Trigger {errName}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* MISSION 9 SPECIFIC TOOL: VIRTUAL ENV SIMULATOR */}
                  {currentMissionId === 9 && (
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-3">
                      <h4 className="font-bold text-slate-300 flex items-center gap-2">
                        <Sliders className="w-4 h-4 text-indigo-400" /> Virtual Environment Control
                      </h4>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setVenvCreated(true);
                            addTerminalLog("$ python -m venv venv -> Created directory ./venv", "info");
                          }}
                          className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded border border-slate-700"
                        >
                          $ python -m venv venv
                        </button>
                        <button
                          disabled={!venvCreated}
                          onClick={() => {
                            setVenvActive(true);
                            addTerminalLog("$ source venv/bin/activate -> Environment (venv) ACTIVE", "success");
                          }}
                          className={`px-3 py-1.5 rounded border ${
                            venvCreated
                              ? "bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-500"
                              : "bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed"
                          }`}
                        >
                          $ source venv/bin/activate
                        </button>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Status: <span className={venvActive ? "text-emerald-400 font-bold" : "text-amber-400"}>{venvActive ? "Active (venv)" : "Global Environment"}</span>
                      </div>
                    </div>
                  )}

                  {/* MISSION 10 SPECIFIC TOOL: PACKAGE MANAGER */}
                  {currentMissionId === 10 && (
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-3">
                      <h4 className="font-bold text-slate-300 flex items-center gap-2">
                        <Package className="w-4 h-4 text-indigo-400" /> PyPI Package Manager Simulator
                      </h4>
                      <div className="space-y-2">
                        {packages.map((pkg) => (
                          <div key={pkg.name} className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800">
                            <div>
                              <div className="font-bold text-slate-200">{pkg.name} <span className="text-slate-500 text-[10px]">v{pkg.version}</span></div>
                              <div className="text-[10px] text-slate-400">{pkg.description}</div>
                            </div>
                            <button
                              onClick={() => {
                                setPackages(packages.map(p => p.name === pkg.name ? { ...p, installed: !p.installed } : p));
                                addTerminalLog(`pip ${pkg.installed ? 'uninstall' : 'install'} ${pkg.name}`, "info");
                              }}
                              className={`px-2.5 py-1 rounded text-[11px] font-bold ${
                                pkg.installed
                                  ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                                  : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                              }`}
                            >
                              {pkg.installed ? "Uninstall" : "Install"}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* MISSION 11 SPECIFIC TOOL: GIT SIMULATOR */}
                  {currentMissionId === 11 && (
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-3">
                      <h4 className="font-bold text-slate-300 flex items-center gap-2">
                        <GitBranch className="w-4 h-4 text-indigo-400" /> Git Version Control Actions
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => {
                            setGitStatus((prev) => ({ ...prev, initialized: true }));
                            addTerminalLog("$ git init -> Initialized empty Git repository in .git/", "info");
                          }}
                          className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded border border-slate-700"
                        >
                          git init
                        </button>
                        <button
                          disabled={!gitStatus.initialized}
                          onClick={() => {
                            setGitStatus((prev) => ({ ...prev, staged: true }));
                            addTerminalLog("$ git add . -> Staged 8 modified files", "info");
                          }}
                          className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded border border-slate-700 disabled:opacity-40"
                        >
                          git add .
                        </button>
                        <button
                          disabled={!gitStatus.staged}
                          onClick={() => {
                            setGitStatus((prev) => ({ ...prev, committed: true }));
                            addTerminalLog("$ git commit -m 'feat: complete python analyzer' -> Commit saved", "info");
                          }}
                          className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded border border-slate-700 disabled:opacity-40"
                        >
                          git commit
                        </button>
                        <button
                          disabled={!gitStatus.committed}
                          onClick={() => {
                            setGitStatus((prev) => ({ ...prev, pushed: true }));
                            addTerminalLog("$ git push origin main -> Deployed to GitHub repository!", "success");
                          }}
                          className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded border border-indigo-500 disabled:opacity-40"
                        >
                          git push
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: TERMINAL / OUTPUT */}
              {activeTab === "terminal" && (
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs h-96 overflow-y-auto space-y-2">
                  <div className="text-slate-500 border-b border-slate-800/80 pb-2 flex items-center justify-between">
                    <span>Python Simulator Terminal Output</span>
                    <button
                      onClick={() => setTerminalLogs([])}
                      className="text-[10px] text-slate-400 hover:text-slate-200"
                    >
                      Clear Log
                    </button>
                  </div>
                  {terminalLogs.map((log, idx) => (
                    <div
                      key={idx}
                      className={`whitespace-pre-wrap ${
                        log.type === "success"
                          ? "text-emerald-400"
                          : log.type === "warn"
                          ? "text-amber-400"
                          : log.type === "error"
                          ? "text-rose-400"
                          : "text-slate-300"
                      }`}
                    >
                      {log.text}
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 3: FILE EXPLORER */}
              {activeTab === "files" && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Project File Explorer</h4>
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs space-y-2">
                    <div className="text-indigo-400 font-bold flex items-center gap-1.5">
                      📁 python-data-analyzer/
                    </div>
                    <div className="pl-4 space-y-1 text-slate-300">
                      {Object.keys(fileContents).map((f) => (
                        <div
                          key={f}
                          onClick={() => {
                            setActiveFileName(f);
                            setActiveTab("code");
                          }}
                          className="cursor-pointer hover:text-indigo-300 flex items-center gap-2 py-1 px-2 rounded hover:bg-slate-900"
                        >
                          <FileText className="w-3.5 h-3.5 text-slate-500" />
                          <span>{f}</span>
                        </div>
                      ))}
                      <div className="flex items-center gap-2 py-1 px-2 text-slate-500">
                        <FileText className="w-3.5 h-3.5" />
                        <span>students.csv</span>
                      </div>
                      <div className="flex items-center gap-2 py-1 px-2 text-slate-500">
                        <FileText className="w-3.5 h-3.5" />
                        <span>config.json</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: DATA PANEL */}
              {activeTab === "data" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-4">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Dataset Preview (students.csv)</h4>
                    <input
                      type="text"
                      placeholder="Search student..."
                      value={dataSearch}
                      onChange={(e) => setDataSearch(e.target.value)}
                      className="bg-slate-950 border border-slate-800 text-xs px-3 py-1 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="overflow-x-auto border border-slate-800 rounded-xl">
                    <table className="w-full text-left text-xs text-slate-300">
                      <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 font-mono">
                        <tr>
                          <th className="p-2.5">ID</th>
                          <th className="p-2.5">Name</th>
                          <th className="p-2.5">Age</th>
                          <th className="p-2.5">Math</th>
                          <th className="p-2.5">Science</th>
                          <th className="p-2.5">English</th>
                          <th className="p-2.5">Attendance</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 bg-slate-900/40 font-mono">
                        {filteredStudents.map((s) => (
                          <tr key={s.id} className="hover:bg-slate-800/50">
                            <td className="p-2.5 text-slate-500">#{s.id}</td>
                            <td className="p-2.5 font-bold text-slate-200">{s.name}</td>
                            <td className="p-2.5">{s.age}</td>
                            <td className="p-2.5">{s.math}</td>
                            <td className="p-2.5">{s.science}</td>
                            <td className="p-2.5">{s.english}</td>
                            <td className="p-2.5 text-emerald-400">{s.attendance}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 5: PROGRESS */}
              {activeTab === "progress" && (
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Overall Skill Breakdown</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { name: "Python Basics", progress: completedMissions.includes(1) ? 100 : 0 },
                      { name: "Data Structures", progress: completedMissions.includes(2) ? 100 : 0 },
                      { name: "Modular Design", progress: completedMissions.includes(3) ? 100 : 0 },
                      { name: "Object Oriented Programming", progress: completedMissions.includes(4) ? 100 : 0 },
                      { name: "File Operations", progress: completedMissions.includes(5) ? 100 : 0 },
                      { name: "Exception Handling", progress: completedMissions.includes(6) ? 100 : 0 },
                      { name: "Decorators & Generators", progress: completedMissions.includes(7) && completedMissions.includes(8) ? 100 : 50 },
                      { name: "Git & Deployment", progress: completedMissions.includes(11) ? 100 : 0 }
                    ].map((skill, i) => (
                      <div key={i} className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5">
                        <div className="flex justify-between text-xs font-medium">
                          <span>{skill.name}</span>
                          <span className="text-indigo-400 font-mono">{skill.progress}%</span>
                        </div>
                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-indigo-500 h-full transition-all duration-500"
                            style={{ width: `${skill.progress}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* CAPSTONE RUNNER PANEL (Unlocked when all missions complete) */}
          {capstoneUnlocked && (
            <div className="p-5 rounded-2xl border border-amber-500/40 bg-gradient-to-r from-amber-500/10 via-slate-900 to-indigo-500/10 shadow-lg space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-amber-300 flex items-center gap-2">
                    🚀 Capstone Mission: Full Python Analyzer
                  </h3>
                  <p className="text-xs text-slate-300">
                    Execute end-to-end Python analyzer combining all 11 topics.
                  </p>
                </div>
                <button
                  onClick={handleRunCapstone}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-5 py-2 rounded-xl shadow-lg transition-transform active:scale-95"
                >
                  Deploy Capstone Analyzer
                </button>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* FINAL CERTIFICATE MODAL */}
      {showCertificate && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-xl w-full bg-slate-900 border-2 border-yellow-500/50 rounded-2xl p-8 text-center space-y-6 shadow-2xl relative">
            <button
              onClick={() => setShowCertificate(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-20 h-20 bg-yellow-500/20 text-yellow-400 border border-yellow-500/40 rounded-full flex items-center justify-center mx-auto text-4xl shadow-lg">
              🏆
            </div>

            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-yellow-400 font-bold">
                CERTIFICATE OF COMPLETION
              </span>
              <h2 className="text-2xl font-extrabold text-white mt-1">
                PYTHON ENGINEER UNLOCKED
              </h2>
              <p className="text-xs text-slate-400 mt-2">
                Has successfully mastered 11 Python Engineering competencies and built a production data analyzer.
              </p>
            </div>

            {/* Checklist of competencies */}
            <div className="grid grid-cols-2 text-left gap-2 text-xs bg-slate-950 p-4 rounded-xl border border-slate-800">
              {MISSIONS.map((m) => (
                <div key={m.id} className="flex items-center gap-2 text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{m.title}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center gap-4 pt-2">
              <button
                onClick={() => setShowCertificate(false)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-lg transition-all"
              >
                Review Playground
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
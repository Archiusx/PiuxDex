import Dexie, { type Table } from 'dexie';

export interface SyllabusTopic {
  name: string;
  isCompleted: boolean;
  priority: 'High' | 'Medium' | 'Low';
  predictedQuestions: ('3M' | '6M')[];
  timeEst: number; // in hours
}

export interface Subject {
  id?: number;
  name: string;
  code: string;
  color: string;
  ca: number;
  mse: number;
  ese: number;
  totalMarks: number;
  syllabus: SyllabusTopic[];
}

export interface Task {
  id?: number;
  title: string;
  description: string;
  date: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
}

export interface Resource {
  id?: number;
  name: string;
  type: 'pdf' | 'pptx' | 'c' | 'algo' | 'other';
  url: string;
  subjectId?: number;
  topicName?: string;
  addedAt: number;
}

export class PiuxDexDatabase extends Dexie {
  subjects!: Table<Subject>;
  tasks!: Table<Task>;
  resources!: Table<Resource>;

  constructor() {
    super('PiuxDexDB');
    this.version(2).stores({
      subjects: '++id, name, code',
      tasks: '++id, title, date, priority',
      resources: '++id, name, type, subjectId'
    });
  }
}

export const db = new PiuxDexDatabase();

// Initial seed data for DBATU 4th Sem (Refined)
export async function seedDatabase() {
  const first = await db.subjects.toCollection().first();
  // If collection is empty, or if existing data is from an older schema version (missing syllabus)
  if (!first || !first.syllabus) {
    if (first) {
      console.log("Upgrading database records to version 2 schema...");
      await db.subjects.clear();
    }
    await db.subjects.bulkAdd([
      { 
        name: 'Design and Analysis of Algorithms', 
        code: '25AF1245PC401', 
        color: '#ef4444', 
        ca: 20, mse: 20, ese: 60, totalMarks: 100, 
        syllabus: [
          { name: 'Introduction to Algorithms (Flowchart, Analysis, Asymptotic, Master Theorem)', isCompleted: false, priority: 'High', predictedQuestions: ['3M'], timeEst: 7 },
          { name: 'Divide and Conquer (Binary Search, Merge, Quick, Strassen)', isCompleted: false, priority: 'High', predictedQuestions: ['6M'], timeEst: 7 },
          { name: 'Backtracking (N-Queens, Hamiltonian, Sum of Subsets, Branch and Bound)', isCompleted: false, priority: 'Medium', predictedQuestions: ['6M'], timeEst: 7 },
          { name: 'Greedy Algorithms (Huffman, Knapsack, Activity Selection, MST)', isCompleted: false, priority: 'High', predictedQuestions: ['3M', '6M'], timeEst: 7 },
          { name: 'Dynamic Programming & NP Completeness (LCS, Bellman-Ford, Floyd Warshall, P/NP)', isCompleted: false, priority: 'High', predictedQuestions: ['6M'], timeEst: 7 }
        ] 
      },
      { 
        name: 'Computer Architecture and Organisation', 
        code: '25AF1245PC402', 
        color: '#f59e0b', 
        ca: 20, mse: 20, ese: 60, totalMarks: 100, 
        syllabus: [
          { name: 'Introduction (Fundamental unit, Computer function, CPU structure)', isCompleted: false, priority: 'Medium', predictedQuestions: ['3M'], timeEst: 7 },
          { name: 'Instruction Sets (Addressing modes, Execution, RISC/CISC)', isCompleted: false, priority: 'High', predictedQuestions: ['6M'], timeEst: 7 },
          { name: 'Computer Arithmetic (ALU, Fixed/Floating Point, Co-processor)', isCompleted: false, priority: 'High', predictedQuestions: ['3M', '6M'], timeEst: 8 },
          { name: 'Memory Organization (Cache, Virtual Memory, RAID)', isCompleted: false, priority: 'High', predictedQuestions: ['6M'], timeEst: 8 },
          { name: 'I/O Organization & Pipelining (DMA, Interrupts, Cache coherence)', isCompleted: false, priority: 'High', predictedQuestions: ['6M'], timeEst: 8 }
        ] 
      },
      { 
        name: 'Probability and Statistics', 
        code: '25AF1245PC403', 
        color: '#3b82f6', 
        ca: 20, mse: 20, ese: 60, totalMarks: 100, 
        syllabus: [
          { name: 'Probability Theory (Axioms, Addition/Mult, Bayes Theorem)', isCompleted: false, priority: 'High', predictedQuestions: ['3M', '6M'], timeEst: 10 },
          { name: 'Random Variable & Expectation (PMF/PDF, Join/Marginal, Variance)', isCompleted: false, priority: 'High', predictedQuestions: ['6M'], timeEst: 6 },
          { name: 'Theoretical Probability Distributions (Binomial, Poisson, Normal, Fitting)', isCompleted: false, priority: 'High', predictedQuestions: ['6M'], timeEst: 10 },
          { name: 'Correlation (Pearson, Spearman Correlation Coefficient)', isCompleted: false, priority: 'Medium', predictedQuestions: ['3M'], timeEst: 6 },
          { name: 'Linear Regression Analysis (Regression lines, Angle, Theorems)', isCompleted: false, priority: 'High', predictedQuestions: ['6M'], timeEst: 6 }
        ] 
      },
      { 
        name: 'Constitution of India', 
        code: '25AFCOIAE407', 
        color: '#8b5cf6', 
        ca: 60, mse: 0, ese: 40, totalMarks: 100, 
        syllabus: [
          { name: 'Intro (Meaning, Citizenship, Fundamental Rights/Duties, DPSP)', isCompleted: false, priority: 'High', predictedQuestions: ['3M'], timeEst: 5 },
          { name: 'Union Govt (Federalism, President, PM, Ministers, Lok/Rajya Sabha)', isCompleted: false, priority: 'Medium', predictedQuestions: ['6M'], timeEst: 5 },
          { name: 'State Govt (Governor, CM, Secretariat Structure)', isCompleted: false, priority: 'Medium', predictedQuestions: ['3M'], timeEst: 4 },
          { name: 'Local Admin (Mayor, CEO, Panchayati Raj, Organisation Hierarchy)', isCompleted: false, priority: 'Low', predictedQuestions: ['3M'], timeEst: 5 },
          { name: 'Election Commission (Role/Functions, SC/ST/OBC/Women Welfare Agencies)', isCompleted: false, priority: 'Medium', predictedQuestions: ['3M', '6M'], timeEst: 5 }
        ] 
      },
      { 
        name: 'Python Programming', 
        code: '25AF1245PCL05', 
        color: '#10b981', 
        ca: 60, mse: 0, ese: 40, totalMarks: 100, 
        syllabus: [
          { name: 'Intro & Algorithms (Installation, Basic programs)', isCompleted: false, priority: 'Medium', predictedQuestions: ['3M'], timeEst: 2 },
          { name: 'Variables & Flow Control (Loops, Functions, Exception handling, Files)', isCompleted: false, priority: 'High', predictedQuestions: ['6M'], timeEst: 2 },
          { name: 'Data Structures (List, Tuple, set, Dictionaries, OOP)', isCompleted: false, priority: 'High', predictedQuestions: ['6M'], timeEst: 4 },
          { name: 'Database & SQL (SQLite, Spidering, JOIN queries)', isCompleted: false, priority: 'High', predictedQuestions: ['6M'], timeEst: 4 }
        ] 
      }
    ]);
  }
}

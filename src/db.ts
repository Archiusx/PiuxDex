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
      resources: '++id, name, type, subjectId, url'
    });
  }
}

export const db = new PiuxDexDatabase();

// Initial seed data for DBATU 4th Sem (Refined)
export async function seedDatabase() {
  const currentVersion = 3; // Increment this to force seed update
  const storedVersion = localStorage.getItem('syllabus_seed_version');
  
  const subjectsCount = await db.subjects.count();
  
  if (subjectsCount === 0 || !storedVersion || parseInt(storedVersion) < currentVersion) {
    console.log(`Seeding database (Version ${currentVersion})...`);
    await db.subjects.clear();
    localStorage.setItem('syllabus_seed_version', currentVersion.toString());
    
    await db.subjects.bulkAdd([
      // --- SEMESTER IV ---
      { 
        name: 'Design and Analysis of Algorithms', 
        code: '25AF1245PC401', 
        color: '#ef4444', 
        ca: 20, mse: 20, ese: 60, totalMarks: 100, 
        syllabus: [
          { name: 'Unit 1: Introduction to Algorithms (Performance Analysis, Asymptotic Notations)', isCompleted: false, priority: 'High', predictedQuestions: ['3M'], timeEst: 7 },
          { name: 'Unit 2: Divide and Conquer (Binary Search, Merge Sort, Quick Sort, Strassen)', isCompleted: false, priority: 'High', predictedQuestions: ['6M'], timeEst: 7 },
          { name: 'Unit 3: Backtracking (N-Queens, Hamiltonian Cycle, Graph Coloring, Branch and Bound)', isCompleted: false, priority: 'Medium', predictedQuestions: ['6M'], timeEst: 7 },
          { name: 'Unit 4: Greedy Algorithms (Huffman Coding, Knapsack, MST, Single Source Shortest Path)', isCompleted: false, priority: 'High', predictedQuestions: ['3M', '6M'], timeEst: 7 },
          { name: 'Unit 5: Dynamic Programming & NP Completeness (LCS, Floyd Warshall, Complexity Classes)', isCompleted: false, priority: 'High', predictedQuestions: ['6M'], timeEst: 7 }
        ] 
      },
      { 
        name: 'Computer Architecture and Organisation', 
        code: '25AF1245PC402', 
        color: '#f59e0b', 
        ca: 20, mse: 20, ese: 60, totalMarks: 100, 
        syllabus: [
          { name: 'Unit 1: Introduction (CPU Structure, Fundamental Functionality)', isCompleted: false, priority: 'Medium', predictedQuestions: ['3M'], timeEst: 7 },
          { name: 'Unit 2: Instruction Sets (Addressing Modes, RISC vs CISC Architecture)', isCompleted: false, priority: 'High', predictedQuestions: ['6M'], timeEst: 7 },
          { name: 'Unit 3: Computer Arithmetic (ALU, Floating Point representation, Co-processor)', isCompleted: false, priority: 'High', predictedQuestions: ['3M', '6M'], timeEst: 8 },
          { name: 'Unit 4: Memory Organization (Cache, Virtual Memory, RAID, Memory Controllers)', isCompleted: false, priority: 'High', predictedQuestions: ['6M'], timeEst: 8 },
          { name: 'Unit 5: I/O Organization & Control Unit (DMA, MESI protocol, Pipelining)', isCompleted: false, priority: 'High', predictedQuestions: ['6M'], timeEst: 8 }
        ] 
      },
      { 
        name: 'Probability and Statistics', 
        code: '25AF1245PC403', 
        color: '#3b82f6', 
        ca: 20, mse: 20, ese: 60, totalMarks: 100, 
        syllabus: [
          { name: 'Unit 1: Probability Theory (Axioms, Bayes Theorem, Inverse Probability)', isCompleted: false, priority: 'High', predictedQuestions: ['3M', '6M'], timeEst: 10 },
          { name: 'Unit 2: Random Variable & Expectation (PMF/PDF, Join/Marginal distributions)', isCompleted: false, priority: 'High', predictedQuestions: ['6M'], timeEst: 6 },
          { name: 'Unit 3: Theoretical Probability Distributions (Binomial, Poisson, Normal fitting)', isCompleted: false, priority: 'High', predictedQuestions: ['6M'], timeEst: 10 },
          { name: 'Unit 4: Correlation (Karl Pearson, Spearman Rank correlation coefficient)', isCompleted: false, priority: 'Medium', predictedQuestions: ['3M'], timeEst: 6 },
          { name: 'Unit 5: Linear Regression Analysis (Angle between lines, Regression theorems)', isCompleted: false, priority: 'High', predictedQuestions: ['6M'], timeEst: 6 }
        ] 
      },
      { 
        name: 'Constitution of India', 
        code: '25AFCOIAE407', 
        color: '#8b5cf6', 
        ca: 60, mse: 0, ese: 40, totalMarks: 100, 
        syllabus: [
          { name: 'Unit 1: Introduction (Citizenship, Preamble, Fundamental Rights, DPSP)', isCompleted: false, priority: 'High', predictedQuestions: ['3M'], timeEst: 5 },
          { name: 'Unit 2: Union Govt (Federalism, President/PM roles, Council of Ministers)', isCompleted: false, priority: 'Medium', predictedQuestions: ['6M'], timeEst: 5 },
          { name: 'Unit 3: State Govt (Governor, CM, State Secretariat structure)', isCompleted: false, priority: 'Medium', predictedQuestions: ['3M'], timeEst: 4 },
          { name: 'Unit 4: Local Administration (Mayor, CEO, Zila Pachayat, Block/Village level)', isCompleted: false, priority: 'Low', predictedQuestions: ['3M'], timeEst: 5 },
          { name: 'Unit 5: Election Commission (Chief Commissioner roles, Welfare bodies)', isCompleted: false, priority: 'Medium', predictedQuestions: ['3M', '6M'], timeEst: 5 }
        ] 
      },
      { 
        name: 'Python Programming', 
        code: '25AF1245PCL05', 
        color: '#10b981', 
        ca: 60, mse: 0, ese: 40, totalMarks: 100, 
        syllabus: [
          { name: 'Unit 1: Programming Foundations (Algorithms, Data structures, Interpreter setup)', isCompleted: false, priority: 'Medium', predictedQuestions: ['3M'], timeEst: 2 },
          { name: 'Unit 2: Control Flow & Files (Loops, Functions, Strings, Exception Handling)', isCompleted: false, priority: 'High', predictedQuestions: ['6M'], timeEst: 2 },
          { name: 'Unit 3: Data Structures & OOP (List, Tuple, Sequence, Set, Dictionaries)', isCompleted: false, priority: 'High', predictedQuestions: ['6M'], timeEst: 4 },
          { name: 'Unit 4: Database & SQL (SQLite manager, Twitter Spidering project, JOINs)', isCompleted: false, priority: 'High', predictedQuestions: ['6M'], timeEst: 4 }
        ] 
      },
      {
        name: 'Modern Indian Languages (Marathi)',
        code: '25AF1000VE410',
        color: '#f43f5e',
        ca: 20, mse: 20, ese: 60, totalMarks: 100,
        syllabus: [
          { name: 'Unit 1: उगम आणि विकास (संत परंपरेचा प्रभाव, ज्ञानेश्वर, तुकाराम)', isCompleted: false, priority: 'Medium', predictedQuestions: ['3M'], timeEst: 2 },
          { name: 'Unit 2: स्वातंत्र्यानंतरची मराठी भाषा (महाराष्ट्र राज्य निर्मिती, डिजिटल युगातील भाषा)', isCompleted: false, priority: 'Medium', predictedQuestions: ['3M'], timeEst: 2 },
          { name: 'Unit 3: लेखनाचे नियम आणि व्याकरण (संधि, वाक्यप्रकार, विरामचिन्हे)', isCompleted: false, priority: 'High', predictedQuestions: ['3M'], timeEst: 2 },
          { name: 'Unit 4: लेखन कौशल्य (पत्रलेखन, निबंध लेखन, सारांश)', isCompleted: false, priority: 'High', predictedQuestions: ['6M'], timeEst: 2 },
          { name: 'Unit 5: भाषांतर (इंग्रजी-मराठी भाषांतर, पारिभाषिक शब्दावली)', isCompleted: false, priority: 'Medium', predictedQuestions: ['6M'], timeEst: 2 }
        ]
      },
      {
        name: 'Life of Chhatrapati Shivaji Maharaj',
        code: '25AF1000VE308A',
        color: '#f97316',
        ca: 50, mse: 0, ese: 0, totalMarks: 50,
        syllabus: [
          { name: 'Unit 1: Master Strategist (Guerrilla Warfare, Fortress Strategy, Diplomacy)', isCompleted: true, priority: 'Medium', predictedQuestions: ['6M'], timeEst: 5 },
          { name: 'Unit 2: Management & Leadership (Architecture, Raigad Fort, Logistics)', isCompleted: true, priority: 'Low', predictedQuestions: ['3M'], timeEst: 5 },
          { name: 'Unit 3: Social Values (Women’s rights, Religious tolerance, Nationalism)', isCompleted: true, priority: 'Low', predictedQuestions: ['3M'], timeEst: 5 }
        ]
      },
      {
        name: 'Life of Dr. Babasaheb Ambedkar',
        code: '25AF1000VE308B',
        color: '#3b82f6',
        ca: 50, mse: 0, ese: 0, totalMarks: 50,
        syllabus: [
          { name: 'Unit 1: Socio-political context (Freedom struggle, Reform movements)', isCompleted: false, priority: 'Medium', predictedQuestions: ['3M'], timeEst: 5 },
          { name: 'Unit 2: Constitutional Contributions (Vision for Social Justice)', isCompleted: false, priority: 'High', predictedQuestions: ['6M'], timeEst: 5 },
          { name: 'Unit 3: Marxism & Caste (Economic ideas and policies)', isCompleted: false, priority: 'Low', predictedQuestions: ['3M'], timeEst: 5 }
        ]
      },
      // --- SEMESTER III (Historical/Ref Material) ---
      {
        name: 'Object-Oriented Programming (Java)',
        code: '25AF1245PC304',
        color: '#fbbf24',
        ca: 20, mse: 20, ese: 60, totalMarks: 100,
        syllabus: [
          { name: 'Unit 1: Classes and Objects (Typical Environment, Memory Concepts)', isCompleted: true, priority: 'High', predictedQuestions: ['3M'], timeEst: 5 },
          { name: 'Unit 2: Modulization (Java Package, Static fields, Overloading)', isCompleted: true, priority: 'High', predictedQuestions: ['6M'], timeEst: 5 },
          { name: 'Unit 3: Inheritance and Polymorphism (Constructors, Object class)', isCompleted: true, priority: 'High', predictedQuestions: ['6M'], timeEst: 5 },
          { name: 'Unit 4: Exception-handling (Hierarchy, Finally block, Iterators)', isCompleted: true, priority: 'Medium', predictedQuestions: ['6M'], timeEst: 6 }
        ]
      },
      { 
        name: 'Engineering Mathematics-III', 
        code: '25AF1000BS301', 
        color: '#4f46e5', 
        ca: 20, mse: 20, ese: 60, totalMarks: 100, 
        syllabus: [
          { name: 'Unit 1: Laplace Transform (Linearity, Shifting, Periodic functions)', isCompleted: true, priority: 'High', predictedQuestions: ['6M'], timeEst: 8 },
          { name: 'Unit 2: Inverse Laplace Transform (Convolution Theorem, PDE solutions)', isCompleted: true, priority: 'High', predictedQuestions: ['6M'], timeEst: 7 },
          { name: 'Unit 3: Fourier Transform (Fourier Integral, Sine/Cosine transforms)', isCompleted: true, priority: 'Medium', predictedQuestions: ['6M'], timeEst: 7 },
          { name: 'Unit 4: PDE & Applications (Direct integration, Separation of variables)', isCompleted: true, priority: 'High', predictedQuestions: ['3M', '6M'], timeEst: 8 },
          { name: 'Unit 5: Functions of Complex Variables (Cauchy-Riemann, Residue theorem)', isCompleted: true, priority: 'Medium', predictedQuestions: ['6M'], timeEst: 7 }
        ] 
      },
      { 
        name: 'Data Structures', 
        code: '25AF1245PC302', 
        color: '#ec4899', 
        ca: 20, mse: 20, ese: 60, totalMarks: 100, 
        syllabus: [
          { name: 'Unit 1: Arrays & Hash Tables (Sparse matrices, Perfect hashing)', isCompleted: true, priority: 'High', predictedQuestions: ['3M'], timeEst: 6 },
          { name: 'Unit 2: Stacks and Queues (Priority queue, Circular queue, Recursion)', isCompleted: true, priority: 'High', predictedQuestions: ['6M'], timeEst: 6 },
          { name: 'Unit 3: Linked Lists (Dynamic memory, Garbage collection, Circular lists)', isCompleted: true, priority: 'High', predictedQuestions: ['6M'], timeEst: 6 },
          { name: 'Unit 4: Trees and Graphs (Warshall’s algorithm, Balanced Trees, AVL)', isCompleted: true, priority: 'High', predictedQuestions: ['6M'], timeEst: 7 },
          { name: 'Unit 5: Searching and Sorting (Skip lists, Radix sort, File handling)', isCompleted: true, priority: 'Medium', predictedQuestions: ['3M'], timeEst: 7 }
        ] 
      },
      { 
        name: 'Discrete Mathematics', 
        code: '25AF1245PC303', 
        color: '#06b6d4', 
        ca: 20, mse: 20, ese: 60, totalMarks: 100, 
        syllabus: [
          { name: 'Unit 1: Propositional Logic (Quantifiers, Rules of Inference, Fallacies)', isCompleted: true, priority: 'High', predictedQuestions: ['3M'], timeEst: 9 },
          { name: 'Unit 2: Sets, Functions, Relations (Hasse Diagram, Topological Sort)', isCompleted: true, priority: 'Medium', predictedQuestions: ['6M'], timeEst: 9 },
          { name: 'Unit 3: Combinatorics (Recurrence Relations, Linear recurrence)', isCompleted: true, priority: 'Low', predictedQuestions: ['3M'], timeEst: 6 },
          { name: 'Unit 4: Graphs & Trees (Planar graphs, Kruskal’s/Prim’s algorithms)', isCompleted: true, priority: 'High', predictedQuestions: ['6M'], timeEst: 7 },
          { name: 'Unit 5: Algebraic Structures (Semi Groups, Rings, Boolean Algebra)', isCompleted: true, priority: 'Medium', predictedQuestions: ['6M'], timeEst: 5 }
        ] 
      },
      { 
        name: 'Digital Electronics', 
        code: '25AF1245PC305', 
        color: '#84cc16', 
        ca: 20, mse: 20, ese: 60, totalMarks: 100, 
        syllabus: [
          { name: 'Unit 1: Logic Gates & Boolean Algebra (K-map, Minimization)', isCompleted: true, priority: 'High', predictedQuestions: ['3M'], timeEst: 5 },
          { name: 'Unit 2: Number Systems (Binary/Hex arithmetic, Error codes)', isCompleted: true, priority: 'Medium', predictedQuestions: ['3M'], timeEst: 5 },
          { name: 'Unit 3: Combinational Logic (Mux/Demux, Adders/Subtractors)', isCompleted: true, priority: 'High', predictedQuestions: ['6M'], timeEst: 5 },
          { name: 'Unit 4: Design Examples (ALU, BCD to 7-segment, Comparators)', isCompleted: true, priority: 'Medium', predictedQuestions: ['6M'], timeEst: 5 },
          { name: 'Unit 5: Sequential Circuits (Flip Flops, counters, Shift registers)', isCompleted: true, priority: 'High', predictedQuestions: ['6M'], timeEst: 6 }
        ] 
      }
    ]);
  }
}

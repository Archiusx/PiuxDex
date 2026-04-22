import Dexie, { type Table } from 'dexie';

export interface Subject {
  id?: number;
  name: string;
  ca1: number;
  ca2: number;
  ese: number;
  totalMarks: number;
  topics: string[];
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
  addedAt: number;
}

export class PiuxDexDatabase extends Dexie {
  subjects!: Table<Subject>;
  tasks!: Table<Task>;
  resources!: Table<Resource>;

  constructor() {
    super('PiuxDexDB');
    this.version(1).stores({
      subjects: '++id, name',
      tasks: '++id, title, date, priority',
      resources: '++id, name, type'
    });
  }
}

export const db = new PiuxDexDatabase();

// Initial seed data for DBATU 4th Sem
export async function seedDatabase() {
  const count = await db.subjects.count();
  if (count === 0) {
    await db.subjects.bulkAdd([
      { name: 'Design and Analysis of Algorithms', ca1: 0, ca2: 0, ese: 0, totalMarks: 100, topics: ['Divide & Conquer', 'Greedy', 'Dynamic Programming', 'NP Completeness'] },
      { name: 'Computer Architecture and Organisation', ca1: 0, ca2: 0, ese: 0, totalMarks: 100, topics: ['Instruction Sets', 'Memory Org', 'I/O Organization', 'Pipelining'] },
      { name: 'Probability and Statistics', ca1: 0, ca2: 0, ese: 0, totalMarks: 100, topics: ['Probability Theory', 'Random Variables', 'Distributions', 'Regression'] },
      { name: 'Python Programming', ca1: 0, ca2: 0, ese: 0, totalMarks: 50, topics: ['Data Structures', 'OOPS', 'SQLite', 'Web Spidering'] },
      { name: 'Constitution of India', ca1: 0, ca2: 0, ese: 0, totalMarks: 50, topics: ['Fundamental Rights', 'Union Govt', 'Local Admin', 'Election Commission'] },
    ]);
  }
}

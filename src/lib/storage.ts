import type { Project, EvaluationReport } from '@/types/project';

const PROJECTS_KEY = 'perception-auditor-projects';
const REPORTS_KEY = 'perception-auditor-reports';
const USER_KEY = 'perception-auditor-user';

export interface StoredUser {
  email: string;
  name: string;
  isLoggedIn: boolean;
}

export function getProjects(): Project[] {
  const stored = localStorage.getItem(PROJECTS_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function saveProject(project: Project): void {
  const projects = getProjects();
  const existingIndex = projects.findIndex(p => p.id === project.id);
  
  if (existingIndex >= 0) {
    projects[existingIndex] = project;
  } else {
    projects.push(project);
  }
  
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
}

export function deleteProject(projectId: string): void {
  const projects = getProjects().filter(p => p.id !== projectId);
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
  
  // Also delete associated reports
  const reports = getReports().filter(r => r.projectId !== projectId);
  localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
}

export function getReports(): EvaluationReport[] {
  const stored = localStorage.getItem(REPORTS_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function getProjectReports(projectId: string): EvaluationReport[] {
  return getReports().filter(r => r.projectId === projectId);
}

export function saveReport(report: EvaluationReport): void {
  const reports = getReports();
  reports.push(report);
  localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
  
  // Update project evaluation count
  const projects = getProjects();
  const project = projects.find(p => p.id === report.projectId);
  if (project) {
    project.evaluationCount += 1;
    project.lastScore = report.overallScore;
    saveProject(project);
  }
}

export function getUser(): StoredUser | null {
  const stored = localStorage.getItem(USER_KEY);
  return stored ? JSON.parse(stored) : null;
}

export function saveUser(user: StoredUser): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearUser(): void {
  localStorage.removeItem(USER_KEY);
}

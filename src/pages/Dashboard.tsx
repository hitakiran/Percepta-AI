import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/layout/Header";
import { Plus, Play, History, Trash2, ExternalLink, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getProjects, deleteProject } from "@/lib/storage";
import type { Project } from "@/types/project";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function Dashboard() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    setProjects(getProjects());
  }, []);

  const handleDeleteProject = (projectId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteProject(projectId);
    setProjects(getProjects());
    toast.success("Project deleted");
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return "text-score-excellent";
    if (score >= 0.6) return "text-score-good";
    if (score >= 0.4) return "text-score-warning";
    return "text-score-danger";
  };

  return (
    <div className="min-h-screen bg-gradient-surface">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1">Dashboard</h1>
            <p className="text-muted-foreground">Manage your product evaluations</p>
          </div>
          <Button onClick={() => navigate('/evaluate')} className="gap-2 bg-gradient-primary hover:opacity-90">
            <Plus className="w-4 h-4" />
            New Evaluation
          </Button>
        </div>

        {projects.length === 0 ? (
          <Card className="border-dashed border-2">
            <CardContent className="py-16 text-center">
              <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Start your first evaluation to see how AI perceives your product.
              </p>
              <Button onClick={() => navigate('/evaluate')} className="gap-2">
                <Plus className="w-4 h-4" />
                Create First Evaluation
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Card 
                key={project.id} 
                className="group hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/reports/${project.id}`)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg font-semibold truncate">
                        {project.name}
                      </CardTitle>
                      <CardDescription className="truncate flex items-center gap-1 mt-1">
                        <ExternalLink className="w-3 h-3" />
                        {project.websiteUrl}
                      </CardDescription>
                    </div>
                    {project.lastScore !== undefined && (
                      <div className={cn("text-2xl font-bold", getScoreColor(project.lastScore))}>
                        {Math.round(project.lastScore * 100)}
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {project.description || "No description provided"}
                  </p>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant="secondary" className="text-xs">
                      {project.evaluationCount} evaluation{project.evaluationCount !== 1 ? 's' : ''}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Created {new Date(project.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 gap-1.5"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate('/evaluate', { state: { projectId: project.id } });
                      }}
                    >
                      <Play className="w-3.5 h-3.5" />
                      Rerun
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 gap-1.5"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/reports/${project.id}`);
                      }}
                    >
                      <History className="w-3.5 h-3.5" />
                      Reports
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="text-muted-foreground hover:text-destructive"
                      onClick={(e) => handleDeleteProject(project.id, e)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

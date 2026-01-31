import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Header } from "@/components/layout/Header";
import { ArrowLeft, Play, Eye, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { getProjects, getProjectReports } from "@/lib/storage";
import type { Project, EvaluationReport } from "@/types/project";
import { cn } from "@/lib/utils";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function Reports() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [reports, setReports] = useState<EvaluationReport[]>([]);

  useEffect(() => {
    const projects = getProjects();
    const foundProject = projects.find(p => p.id === projectId);
    setProject(foundProject || null);
    
    if (projectId) {
      setReports(getProjectReports(projectId));
    }
  }, [projectId]);

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return "text-score-excellent";
    if (score >= 0.6) return "text-score-good";
    if (score >= 0.4) return "text-score-warning";
    return "text-score-danger";
  };

  const getScoreTrend = (currentIndex: number) => {
    if (currentIndex === 0 || reports.length < 2) return null;
    const current = reports[currentIndex].overallScore;
    const previous = reports[currentIndex - 1].overallScore;
    const diff = current - previous;
    
    if (Math.abs(diff) < 0.02) return { icon: Minus, color: "text-muted-foreground", value: 0 };
    if (diff > 0) return { icon: TrendingUp, color: "text-score-good", value: diff };
    return { icon: TrendingDown, color: "text-score-danger", value: diff };
  };

  const chartData = reports.map((r, i) => ({
    iteration: `#${r.iteration}`,
    overall: Math.round(r.overallScore * 100),
    ...r.modelScores.reduce((acc, ms) => ({
      ...acc,
      [ms.modelName]: Math.round(ms.score * 100),
    }), {}),
  }));

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-surface">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <p className="text-muted-foreground">Project not found</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-surface">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/dashboard')} 
          className="gap-2 mb-6 -ml-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>

        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1">{project.name}</h1>
            <p className="text-muted-foreground">{project.websiteUrl}</p>
          </div>
          <Button 
            onClick={() => navigate('/evaluate', { state: { projectId: project.id } })}
            className="gap-2 bg-gradient-primary hover:opacity-90"
          >
            <Play className="w-4 h-4" />
            Run New Evaluation
          </Button>
        </div>

        {reports.length === 0 ? (
          <Card className="border-dashed border-2">
            <CardContent className="py-16 text-center">
              <h3 className="text-lg font-semibold mb-2">No evaluations yet</h3>
              <p className="text-muted-foreground mb-6">
                Run your first evaluation to see results here.
              </p>
              <Button onClick={() => navigate('/evaluate', { state: { projectId: project.id } })}>
                Start Evaluation
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {/* Score Trend Chart */}
            {reports.length > 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Score Trend</CardTitle>
                  <CardDescription>Track perception improvements over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                        <XAxis dataKey="iteration" className="text-xs" />
                        <YAxis domain={[0, 100]} className="text-xs" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))', 
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }}
                        />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="overall" 
                          name="Overall Score"
                          stroke="hsl(var(--primary))" 
                          strokeWidth={2}
                          dot={{ fill: 'hsl(var(--primary))' }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Reports Table */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Evaluation History</CardTitle>
                <CardDescription>{reports.length} evaluation{reports.length !== 1 ? 's' : ''} completed</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-20">Iteration</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Models Used</TableHead>
                      <TableHead className="text-right">Score</TableHead>
                      <TableHead className="text-right">Trend</TableHead>
                      <TableHead className="w-28"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reports.map((report, index) => {
                      const trend = getScoreTrend(index);
                      return (
                        <TableRow key={report.id}>
                          <TableCell className="font-medium">#{report.iteration}</TableCell>
                          <TableCell className="text-muted-foreground">
                            {new Date(report.timestamp).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1 flex-wrap">
                              {report.modelScores.map((ms) => (
                                <Badge key={ms.modelId} variant="secondary" className="text-xs">
                                  {ms.modelName}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell className={cn("text-right font-bold text-lg", getScoreColor(report.overallScore))}>
                            {Math.round(report.overallScore * 100)}
                          </TableCell>
                          <TableCell className="text-right">
                            {trend && (
                              <div className={cn("flex items-center justify-end gap-1", trend.color)}>
                                <trend.icon className="w-4 h-4" />
                                {trend.value !== 0 && (
                                  <span className="text-sm">
                                    {trend.value > 0 ? '+' : ''}{Math.round(trend.value * 100)}
                                  </span>
                                )}
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="gap-1.5"
                              onClick={() => navigate(`/report/${report.id}`)}
                            >
                              <Eye className="w-3.5 h-3.5" />
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Latest Report Summary */}
            {reports.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Latest Evaluation Summary</CardTitle>
                  <CardDescription>Key insights from your most recent evaluation</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{reports[reports.length - 1].summary}</p>
                  <div className="flex flex-wrap gap-2">
                    {reports[reports.length - 1].gaps.slice(0, 3).map((gap) => (
                      <Badge 
                        key={gap.id} 
                        variant="outline" 
                        className={cn(
                          "text-xs",
                          gap.severity === 'high' && "border-score-danger/50 text-score-danger",
                          gap.severity === 'medium' && "border-score-warning/50 text-score-warning",
                          gap.severity === 'low' && "border-muted-foreground/50"
                        )}
                      >
                        {gap.title}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

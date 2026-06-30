export async function calculateDashboardMetrics(feedbacks: any[], tasks: any[]) {
  const memoriesCount = feedbacks.filter(
    (f: any) => f.status === 'processed' || f.feature_tag === 'Memory'
  ).length;

  const openIssues = tasks.filter(
    (t: any) => t.status !== 'Resolved'
  ).length;

  return {
    totalFeedback: feedbacks.length,
    totalMemories: memoriesCount,
    memoryGrowth: 18.4,
    openIssuesCount: openIssues,
  };
}

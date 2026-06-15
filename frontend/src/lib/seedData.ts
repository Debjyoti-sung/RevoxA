// High-Fidelity Demo Database & Seed Data for RevoxA
// Represents a scaled system of 5,000+ feedback logs, 50 clusters, 100 features, and 12 months of analytics.

export interface Feedback {
  id: string;
  title: string;
  content: string;
  source_type: 'gmail' | 'slack' | 'discord' | 'reddit' | 'twitter' | 'csv' | 'zendesk' | 'hubspot' | 'intercom';
  customer_name: string;
  customer_email: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  sentiment_score: number; // -1 to 1
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'new' | 'processed' | 'ignored';
  cluster_id: string;
  feature_tag: string;
  created_at: string;
}

export interface Cluster {
  id: string;
  name: string;
  summary: string;
  growth_rate: number; // percentage
  trend: 'rising' | 'declining' | 'stable';
  sentiment_score: number; // -1 to 1
  total_feedback_count: number;
  last_updated: string;
}

export interface FeatureRequest {
  id: string;
  name: string;
  summary: string;
  popularity_score: number; // upvotes/requests
  growth_rate: number;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  revenue_impact: number; // in USD
  status: 'Backlog' | 'Planned' | 'In Progress' | 'Completed';
  created_at: string;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  business_impact: string;
  affected_users: number;
  revenue_risk: number; // USD
  confidence: number; // percentage (e.g. 94)
  suggested_action: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  created_at: string;
}

export interface MentalModel {
  id: string;
  name: string;
  summary: string;
  memory_coverage: number; // coverage %
  last_updated: string;
}

export interface TimelineEvent {
  id: string;
  month: string;
  title: string;
  description: string;
  memory_growth: number;
  evolution_type: 'memory' | 'issue' | 'trend' | 'feature';
}

export interface Integration {
  id: string;
  name: string;
  type: string;
  status: 'Connected' | 'Disconnected' | 'Syncing';
  health: 'healthy' | 'warning' | 'error';
  last_sync: string;
  records_synced: number;
  errors: number;
}

// 1. MENTAL MODELS
export const mockMentalModels: MentalModel[] = [
  {
    id: "model-1",
    name: "Payment Issues",
    summary: "Reflects checkout friction, credit card declines, PayPal gateway timeouts, subscription renew failures, and Stripe integration bugs.",
    memory_coverage: 92.5,
    last_updated: "2026-06-14T20:30:00Z"
  },
  {
    id: "model-2",
    name: "Customer Pain Points",
    summary: "Tracks onboarding hurdles, lack of documentation, slow response times on support channels, and difficulties with custom dashboard configurations.",
    memory_coverage: 88.0,
    last_updated: "2026-06-13T18:15:00Z"
  },
  {
    id: "model-3",
    name: "Feature Requests",
    summary: "Consolidates requests for dark mode, mobile applications, multi-workspace support, API webhooks, and deeper Hubspot syncing workflows.",
    memory_coverage: 76.4,
    last_updated: "2026-06-14T11:45:00Z"
  },
  {
    id: "model-4",
    name: "Product Bugs",
    summary: "Aggregates reportings of active sessions expiring prematurely, page crashes on heavy Recharts layouts, and CSV export file formatting errors.",
    memory_coverage: 84.2,
    last_updated: "2026-06-14T21:10:00Z"
  },
  {
    id: "model-5",
    name: "Onboarding Friction",
    summary: "Identifies drops in user activation due to excessive setup steps, email validation bugs, and initial workspace invitation failures.",
    memory_coverage: 91.0,
    last_updated: "2026-06-12T09:00:00Z"
  }
];

// 2. CLUSTERS (50 Clusters - seeded with details for the top and generic labels for scaling)
const TOP_CLUSTER_NAMES = [
  "Stripe Checkout Gateway Timeout",
  "Workspace Invitation Links Expiring",
  "Slack Notification Webhook Delay",
  "CSV feedback parsing failure",
  "Gmail Authentication JWT Expiry",
  "Slow Recharts Dashboard rendering",
  "Dark Mode visibility contrast",
  "Zendesk ticket synchronization lag",
  "Discord Bot message scraping limit",
  "Reddit subreddit ingestion throttle",
  "Billing currency mismatch",
  "PDF Executive report downloads failing",
  "Hubspot integration CRM mapping error",
  "Intercom chat transcript loss",
  "API rate limits on free tier",
  "Android app login fingerprint crash",
  "iOS push notifications silent fail",
  "Member permissions role sync lag",
  "Two-factor auth SMS code delay",
  "Audit logs download structure error"
];

export const mockClusters: Cluster[] = Array.from({ length: 50 }).map((_, index) => {
  const isTop = index < TOP_CLUSTER_NAMES.length;
  const name = isTop ? TOP_CLUSTER_NAMES[index] : `Semantic Cluster Group #${index + 1}`;
  const totalFeedbackCount = isTop ? Math.floor(Math.random() * 80) + 120 : Math.floor(Math.random() * 40) + 10;
  const growthRate = parseFloat((Math.random() * 45 * (Math.random() > 0.4 ? 1 : -0.5)).toFixed(2));
  const sentiment_score = parseFloat((Math.random() * 1.6 - 0.8).toFixed(2));
  
  let trend: 'rising' | 'declining' | 'stable' = 'stable';
  if (growthRate > 15) trend = 'rising';
  else if (growthRate < -10) trend = 'declining';

  return {
    id: `cluster-${index + 1}`,
    name,
    summary: `Automatically clustered feedback items referencing ${name.toLowerCase()}. Core sentiment shows users are ${sentiment_score < -0.2 ? 'frustrated' : sentiment_score > 0.2 ? 'pleased' : 'indifferent'} regarding this behavior.`,
    growth_rate: growthRate,
    trend,
    sentiment_score,
    total_feedback_count: totalFeedbackCount,
    last_updated: new Date(Date.now() - index * 3600000 * 2).toISOString()
  };
});

// 3. FEATURE REQUESTS (100 Features)
const TOP_FEATURES = [
  "Real-time Slack Alerts Integration",
  "Advanced pgvector Semantic Search Filter",
  "Multi-workspace Admin Console",
  "Comprehensive PDF/CSV Report Scheduler",
  "HubSpot Two-way CRM Contact Sync",
  "Direct Zendesk Ticket AI Auto-Responder",
  "Mobile Dashboard (iOS & Android Native)",
  "Full Dark Mode Toggle Options",
  "Interactive Memory Graph Node Editing",
  "API Key Generation & Rate Limiting Dashboard"
];

export const mockFeatureRequests: FeatureRequest[] = Array.from({ length: 100 }).map((_, index) => {
  const isTop = index < TOP_FEATURES.length;
  const name = isTop ? TOP_FEATURES[index] : `Product Feature Enhancement Option #${index + 1}`;
  const popularity_score = isTop ? Math.floor(Math.random() * 150) + 200 : Math.floor(Math.random() * 90) + 10;
  const growth_rate = parseFloat((Math.random() * 60).toFixed(2));
  const priorities: ('Low' | 'Medium' | 'High' | 'Critical')[] = ['Low', 'Medium', 'High', 'Critical'];
  const priority = isTop ? priorities[Math.floor(Math.random() * 2) + 2] : priorities[Math.floor(Math.random() * 3)];
  const revenue_impact = popularity_score * (Math.floor(Math.random() * 150) + 50);
  const statuses: ('Backlog' | 'Planned' | 'In Progress' | 'Completed')[] = ['Backlog', 'Planned', 'In Progress', 'Completed'];
  const status = statuses[Math.floor(Math.random() * 4)];

  return {
    id: `feature-${index + 1}`,
    name,
    summary: `Suggested product enhancement: ${name.toLowerCase()}. Initiated by multiple customer requests and analyzed via vector memory systems.`,
    popularity_score,
    growth_rate,
    priority,
    revenue_impact,
    status,
    created_at: new Date(Date.now() - index * 86400000 * 2.5).toISOString()
  };
});

// 4. RECOMMENDATIONS
export const mockRecommendations: Recommendation[] = [
  {
    id: "rec-1",
    title: "Upgrade Stripe Webhook Concurrency Limits",
    description: "Memory recall shows checkout timeouts peaked during European business hours. Increase API handler workers to prevent gateway dropouts.",
    business_impact: "Reduce cart abandonment and secure pending subscriptions.",
    affected_users: 1420,
    revenue_risk: 42000,
    confidence: 96,
    suggested_action: "Edit `services/stripe.py` thread-pool config and check AWS server limits.",
    priority: "Critical",
    created_at: new Date().toISOString()
  },
  {
    id: "rec-2",
    title: "Redesign Workspace Member Invitation Flow",
    description: "Reflection analysis highlights 42 complaints regarding expired verification tokens. Change token duration from 2 hours to 24 hours.",
    business_impact: "Boost workspace activation rate by 14.5% MoM.",
    affected_users: 840,
    revenue_risk: 18500,
    confidence: 91,
    suggested_action: "Update Supabase JWT expiration hook in invite handler.",
    priority: "High",
    created_at: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: "rec-3",
    title: "Build Slack Alerts Notification Toggle",
    description: "Ingestion trends reveal high demand for real-time notifications when new Critical feedback arrives.",
    business_impact: "Reduce customer support SLA times from 4 hours to 15 minutes.",
    affected_users: 2150,
    revenue_risk: 12000,
    confidence: 88,
    suggested_action: "Leverage Slack incoming webhooks and deploy message dispatcher.",
    priority: "Medium",
    created_at: new Date(Date.now() - 172800000).toISOString()
  },
  {
    id: "rec-4",
    title: "Fix Chart Legend Contrast in Light Theme",
    description: "Several customers on Twitter reported text formatting difficulties in the Executive PDF exports on laptops.",
    business_impact: "Improve accessibility scores (WCAG AA).",
    affected_users: 320,
    revenue_risk: 3500,
    confidence: 94,
    suggested_action: "Override chart typography color styles to Deep Slate (#1E2433).",
    priority: "Low",
    created_at: new Date(Date.now() - 259200000).toISOString()
  }
];

// 5. FEEDBACK ITEMS (100 Items)
const SAMPLES = [
  {
    title: "Subscription renew failing with error code 402",
    content: "I've been trying to renew our corporate plan for the last 3 days using our corporate Visa. The checkout page keeps spinning and eventually throws a Stripe timeout error code 402. We need this sorted ASAP as our team is locked out of dashboard controls.",
    source_type: "gmail",
    name: "Clara Vance",
    email: "clara.v@company.com",
    sentiment: "negative",
    severity: "critical",
    feature: "Billing",
    cluster_idx: 0
  },
  {
    title: "Onboarding flow is incredibly confusing",
    content: "Just signed up for RevoxA and I'm totally lost. The workspace invite email was expired when my developer clicked it. Then we couldn't figure out how to import the CSV file because the template page kept returning a 500 server error. Documentation is sparse.",
    source_type: "zendesk",
    name: "Mark Harrison",
    email: "mharrison@techcorp.io",
    sentiment: "negative",
    severity: "high",
    feature: "Onboarding",
    cluster_idx: 1
  },
  {
    title: "Slack notifications lag by 30 mins",
    content: "The webhook integrations are useful but we noticed that Slack alerts for new customer issues are delayed by 25 to 30 minutes. Real-time updates should actually be real-time, otherwise we check the dashboard manually anyway.",
    source_type: "slack",
    name: "Dev Team",
    email: "devops@chatlabs.com",
    sentiment: "neutral",
    severity: "medium",
    feature: "Integrations",
    cluster_idx: 2
  },
  {
    title: "Love the new memory graph feature!",
    content: "The React Flow Memory Graph is absolutely incredible! We can easily trace feedback items directly to our release schedules and pinpoint feature requests. This is a game-changer for product sprint planning.",
    source_type: "discord",
    name: "Alex Rivera",
    email: "alex@indiedev.org",
    sentiment: "positive",
    severity: "low",
    feature: "Analytics",
    cluster_idx: 5
  },
  {
    title: "Cannot download PDF executive reports",
    content: "Whenever I click 'Generate Report' and select PDF format, the loading icon spins forever. Eventually, the browser says the network connection timed out. CSV export works fine, but we need PDF for our board meetings.",
    source_type: "hubspot",
    name: "Sarah Jenkins",
    email: "s.jenkins@investpartners.com",
    sentiment: "negative",
    severity: "high",
    feature: "Reporting",
    cluster_idx: 11
  }
];

export const mockFeedback: Feedback[] = Array.from({ length: 100 }).map((_, index) => {
  const sample = SAMPLES[index % SAMPLES.length];
  const source_types: Feedback['source_type'][] = ['gmail', 'slack', 'discord', 'reddit', 'twitter', 'csv', 'zendesk', 'hubspot', 'intercom'];
  const source_type = index < SAMPLES.length ? sample.source_type as Feedback['source_type'] : source_types[index % source_types.length];
  
  const title = index < SAMPLES.length ? sample.title : `Feedback report regarding ${mockClusters[index % 50].name}`;
  const content = index < SAMPLES.length ? sample.content : `Feedback comment submitted by client. The main theme is related to ${mockClusters[index % 50].name.toLowerCase()} and they would like this resolved quickly. Interface performance is crucial.`;
  const customer_name = index < SAMPLES.length ? sample.name : `Customer ${index + 1}`;
  const customer_email = index < SAMPLES.length ? sample.email : `customer${index + 1}@domain.com`;
  
  const sentiments: Feedback['sentiment'][] = ['positive', 'negative', 'neutral'];
  const sentiment = index < SAMPLES.length ? sample.sentiment as Feedback['sentiment'] : sentiments[index % 3];
  const sentiment_score = sentiment === 'positive' ? 0.75 : sentiment === 'negative' ? -0.80 : 0.05;
  
  const severities: Feedback['severity'][] = ['low', 'medium', 'high', 'critical'];
  const severity = index < SAMPLES.length ? sample.severity as Feedback['severity'] : severities[index % 4];
  
  const statuses: Feedback['status'][] = ['new', 'processed', 'ignored'];
  const status = statuses[index % 3];
  
  const cluster_id = `cluster-${(index % 50) + 1}`;
  const feature_tag = index < SAMPLES.length ? sample.feature : ['Billing', 'Onboarding', 'Integrations', 'Reporting', 'UI UX', 'API'][index % 6];

  return {
    id: `feedback-${index + 1}`,
    title,
    content,
    source_type,
    customer_name,
    customer_email,
    sentiment,
    sentiment_score,
    severity,
    status,
    cluster_id,
    feature_tag,
    created_at: new Date(Date.now() - index * 1800000 * 3).toISOString()
  };
});

// 6. HISTORICAL ANALYTICS (12 Months)
export const mockSentimentHistory = [
  { month: "Jul", positive: 62, neutral: 25, negative: 13 },
  { month: "Aug", positive: 65, neutral: 22, negative: 13 },
  { month: "Sep", positive: 60, neutral: 28, negative: 12 },
  { month: "Oct", positive: 58, neutral: 30, negative: 12 },
  { month: "Nov", positive: 70, neutral: 20, negative: 10 },
  { month: "Dec", positive: 75, neutral: 18, negative: 7 },
  { month: "Jan", positive: 72, neutral: 20, negative: 8 },
  { month: "Feb", positive: 78, neutral: 15, negative: 7 },
  { month: "Mar", positive: 80, neutral: 14, negative: 6 },
  { month: "Apr", positive: 83, neutral: 12, negative: 5 },
  { month: "May", positive: 85, neutral: 11, negative: 4 },
  { month: "Jun", positive: 88, neutral: 8, negative: 4 }
];

export const mockFeedbackVolumeHistory = [
  { month: "Jul", email: 120, slack: 230, discord: 150, zendesk: 180, api: 90 },
  { month: "Aug", email: 135, slack: 240, discord: 165, zendesk: 195, api: 110 },
  { month: "Sep", email: 140, slack: 290, discord: 180, zendesk: 210, api: 130 },
  { month: "Oct", email: 160, slack: 320, discord: 210, zendesk: 240, api: 150 },
  { month: "Nov", email: 180, slack: 350, discord: 250, zendesk: 280, api: 190 },
  { month: "Dec", email: 210, slack: 420, discord: 290, zendesk: 310, api: 220 },
  { month: "Jan", email: 240, slack: 480, discord: 310, zendesk: 340, api: 260 },
  { month: "Feb", email: 280, slack: 520, discord: 350, zendesk: 390, api: 290 },
  { month: "Mar", email: 320, slack: 590, discord: 390, zendesk: 430, api: 340 },
  { month: "Apr", email: 350, slack: 650, discord: 420, zendesk: 480, api: 410 },
  { month: "May", email: 390, slack: 710, discord: 480, zendesk: 520, api: 480 },
  { month: "Jun", email: 420, slack: 780, discord: 520, zendesk: 580, api: 550 }
];

export const mockIssueGrowthHistory = [
  { month: "Jul", open: 12, inProgress: 8, resolved: 35 },
  { month: "Aug", open: 15, inProgress: 12, resolved: 40 },
  { month: "Sep", open: 18, inProgress: 15, resolved: 42 },
  { month: "Oct", open: 22, inProgress: 19, resolved: 45 },
  { month: "Nov", open: 14, inProgress: 22, resolved: 60 },
  { month: "Dec", open: 10, inProgress: 18, resolved: 75 },
  { month: "Jan", open: 9, inProgress: 14, resolved: 85 },
  { month: "Feb", open: 11, inProgress: 10, resolved: 90 },
  { month: "Mar", open: 8, inProgress: 12, resolved: 105 },
  { month: "Apr", open: 6, inProgress: 9, resolved: 115 },
  { month: "May", open: 5, inProgress: 7, resolved: 130 },
  { month: "Jun", open: 3, inProgress: 5, resolved: 148 }
];

export const mockSourceDistribution = [
  { name: "Gmail", value: 920, color: "#6366F1" },
  { name: "Slack", value: 1420, color: "#8B5CF6" },
  { name: "Discord", value: 850, color: "#06B6D4" },
  { name: "Zendesk", value: 1100, color: "#10B981" },
  { name: "HubSpot", value: 650, color: "#F59E0B" },
  { name: "Others", value: 430, color: "#F472B6" }
];

// 7. EVOLUTION TIMELINE
export const mockTimelineEvents: TimelineEvent[] = [
  {
    id: "time-1",
    month: "July 2025",
    title: "Platform Memory Initialization",
    description: "Successfully configured Hindsight client vector pipelines. Started scraping Discord user groups.",
    memory_growth: 15,
    evolution_type: "memory"
  },
  {
    id: "time-2",
    month: "September 2025",
    title: "Emergence of Stripe Checkout Gateway timeouts",
    description: "Groq detection marked Stripe 402 response clusters with high priority. Triggered action ticket.",
    memory_growth: 45,
    evolution_type: "issue"
  },
  {
    id: "time-3",
    month: "November 2025",
    title: "Workspace Invite Security Patch Release",
    description: "Resolved the 2-hour invitation token expiry friction. Workspace onboarding statistics increased 18% MoM.",
    memory_growth: 68,
    evolution_type: "feature"
  },
  {
    id: "time-4",
    month: "February 2026",
    title: "Deep Memory Retrieval Engine Upgrade",
    description: "Embedded Hindsight Recall with context mapping. AI assistant response accuracy rose to 98.4%.",
    memory_growth: 120,
    evolution_type: "memory"
  },
  {
    id: "time-5",
    month: "May 2026",
    title: "12-Month Historical Forecast Prediction",
    description: "Began modeling customer pain point vectors to recommend preventative engineering tasks.",
    memory_growth: 180,
    evolution_type: "trend"
  }
];

// 8. INTEGRATIONS
export const mockIntegrations: Integration[] = [
  { id: "int-1", name: "Gmail Integration", type: "email", status: "Connected", health: "healthy", last_sync: "2 mins ago", records_synced: 1420, errors: 0 },
  { id: "int-2", name: "Slack Link", type: "chat", status: "Connected", health: "healthy", last_sync: "5 mins ago", records_synced: 3500, errors: 0 },
  { id: "int-3", name: "Discord Scraper", type: "chat", status: "Connected", health: "warning", last_sync: "12 mins ago", records_synced: 2150, errors: 4 },
  { id: "int-4", name: "Zendesk Sync", type: "support", status: "Connected", health: "healthy", last_sync: "1 hour ago", records_synced: 1100, errors: 0 },
  { id: "int-5", name: "HubSpot CRM", type: "crm", status: "Syncing", health: "healthy", last_sync: "Just now", records_synced: 650, errors: 0 },
  { id: "int-6", name: "Intercom Widget", type: "support", status: "Connected", health: "error", last_sync: "4 hours ago", records_synced: 940, errors: 18 },
  { id: "int-7", name: "Reddit Community Scraping", type: "social", status: "Connected", health: "healthy", last_sync: "3 hours ago", records_synced: 320, errors: 0 },
  { id: "int-8", name: "Twitter/X Stream API", type: "social", status: "Disconnected", health: "warning", last_sync: "Never", records_synced: 0, errors: 0 },
  { id: "int-9", name: "CSV Feed File Upload", type: "manual", status: "Connected", health: "healthy", last_sync: "1 day ago", records_synced: 890, errors: 0 }
];

// 9. NOTIFICATIONS
export const mockNotifications = [
  { id: "not-1", title: "New Critical Cluster Detected", message: "Stripe Checkout Gateway Timeout is surging (+42% growth rate in last 4 hours).", type: "ai", read: false, time: "5m ago" },
  { id: "not-2", title: "Slack webhook connection warning", message: "Integration returned status code 429: Too Many Requests on alert dispatcher.", type: "system", read: false, time: "24m ago" },
  { id: "not-3", title: "Monthly Report Ready", message: "May 2026 Executive Performance Summary has been generated.", type: "trend", read: true, time: "2h ago" },
  { id: "not-4", title: "Issue #104 Assigned", message: "Alex Rivera assigned you to 'Investigate checkout failure code 402'.", type: "issue", read: true, time: "1d ago" }
];

// 10. WORKSPACE MEMBERS
export const mockWorkspaceMembers = [
  { id: "user-1", name: "Sarah Jenkins", email: "sarah@revoxa.ai", role: "Owner", avatar: "SJ" },
  { id: "user-2", name: "Alex Rivera", email: "alex@revoxa.ai", role: "Admin", avatar: "AR" },
  { id: "user-3", name: "Clara Vance", email: "clara@revoxa.ai", role: "Manager", avatar: "CV" },
  { id: "user-4", name: "Dave Miller", email: "dave@revoxa.ai", role: "Analyst", avatar: "DM" }
];

// 11. WORKSPACE TASKS
export const mockWorkspaceTasks = [
  { id: "task-1", title: "Audit checkout timeout database logs", assignee: "Dave Miller", status: "In Progress", priority: "High" },
  { id: "task-2", title: "Verify email template webhook URLs", assignee: "Alex Rivera", status: "Open", priority: "Medium" },
  { id: "task-3", title: "Deploy version 4.2 feedback graph nodes", assignee: "Sarah Jenkins", status: "Resolved", priority: "High" },
  { id: "task-4", title: "Write weekly board meeting PDF draft", assignee: "Clara Vance", status: "In Progress", priority: "Low" }
];

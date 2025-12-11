import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  FolderKanban,
  Clock,
  DollarSign,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { projectApi, billingApi } from '../lib/api';
import { useAuthStore } from '../stores/auth';

export default function Dashboard() {
  const { user, company } = useAuthStore();

  const { data: projectsData, isLoading: projectsLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectApi.list().then((res) => res.data.data),
  });

  const { data: billingData, isLoading: billingLoading } = useQuery({
    queryKey: ['billing-overview'],
    queryFn: () => billingApi.getOverview().then((res) => res.data.data),
  });

  const projects = projectsData || [];
  const activeProjects = projects.filter(
    (p: { status: string }) =>
      p.status !== 'COMPLETED' && p.status !== 'CANCELLED'
  );

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.name?.split(' ')[0]}
        </h1>
        <p className="text-gray-600 mt-1">
          Here's what's happening with {company?.name}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
              <FolderKanban className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Projects</p>
              <p className="text-2xl font-bold text-gray-900">
                {projectsLoading ? '-' : activeProjects.length}
              </p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-accent-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Next Milestone</p>
              <p className="text-2xl font-bold text-gray-900">
                {projectsLoading ? '-' : '3 days'}
              </p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Outstanding</p>
              <p className="text-2xl font-bold text-gray-900">
                {billingLoading
                  ? '-'
                  : `$${(billingData?.outstandingBalance || 0).toLocaleString()}`}
              </p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Subscription</p>
              <p className="text-2xl font-bold text-gray-900 capitalize">
                {billingLoading
                  ? '-'
                  : billingData?.activeSubscription?.plan || 'None'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">
                Active Projects
              </h2>
              <Link
                to="/projects"
                className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1"
              >
                View all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="divide-y divide-gray-100">
              {projectsLoading ? (
                <div className="p-6 text-center text-gray-500">Loading...</div>
              ) : activeProjects.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  No active projects
                </div>
              ) : (
                activeProjects.slice(0, 3).map((project: {
                  id: string;
                  name: string;
                  status: string;
                  _count?: { tasks?: number };
                  milestones?: { status: string }[];
                }) => (
                  <Link
                    key={project.id}
                    to={`/projects/${project.id}`}
                    className="flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                        <FolderKanban className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {project.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {project._count?.tasks || 0} tasks
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={project.status} />
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Activity
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <ActivityItem
              icon={<CheckCircle2 className="w-5 h-5 text-green-500" />}
              title="Milestone completed"
              description="Dashboard MVP delivered"
              time="2 hours ago"
            />
            <ActivityItem
              icon={<AlertCircle className="w-5 h-5 text-yellow-500" />}
              title="New feedback received"
              description="3 items need review"
              time="5 hours ago"
            />
            <ActivityItem
              icon={<DollarSign className="w-5 h-5 text-primary-500" />}
              title="Payment received"
              description="$12,500 for Milestone 2"
              time="Yesterday"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const statusStyles: Record<string, string> = {
    DISCOVERY: 'badge-info',
    PROPOSAL: 'badge-warning',
    ACTIVE: 'badge-success',
    ON_HOLD: 'badge-gray',
    COMPLETED: 'badge-success',
    CANCELLED: 'badge-error',
  };

  return (
    <span className={statusStyles[status] || 'badge-gray'}>
      {status.replace('_', ' ')}
    </span>
  );
}

function ActivityItem({
  icon,
  title,
  description,
  time,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  time: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="flex-shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">{title}</p>
        <p className="text-sm text-gray-500 truncate">{description}</p>
      </div>
      <span className="text-xs text-gray-400 flex-shrink-0">{time}</span>
    </div>
  );
}

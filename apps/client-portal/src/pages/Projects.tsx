import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { FolderKanban, Search, Filter, ArrowRight } from 'lucide-react';
import { projectApi } from '../lib/api';

interface Project {
  id: string;
  name: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  company?: { name: string };
  _count?: {
    tasks: number;
    featureRequests: number;
    issues: number;
  };
  milestones?: Array<{
    id: string;
    name: string;
    status: string;
    dueDate?: string;
  }>;
}

export default function Projects() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const { data, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectApi.list().then((res) => res.data.data),
  });

  const projects: Project[] = data || [];

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600 mt-1">
            Manage and track your software projects
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search projects..."
            className="input pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <select
            className="input pl-10 pr-8 appearance-none"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="DISCOVERY">Discovery</option>
            <option value="PROPOSAL">Proposal</option>
            <option value="ACTIVE">Active</option>
            <option value="ON_HOLD">On Hold</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      {isLoading ? (
        <div className="text-center py-12 text-gray-500">Loading projects...</div>
      ) : filteredProjects.length === 0 ? (
        <div className="card p-12 text-center">
          <FolderKanban className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No projects found
          </h3>
          <p className="text-gray-600">
            {search || statusFilter !== 'all'
              ? 'Try adjusting your filters'
              : 'Your projects will appear here once created'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const statusColors: Record<string, string> = {
    DISCOVERY: 'bg-blue-500',
    PROPOSAL: 'bg-yellow-500',
    ACTIVE: 'bg-green-500',
    ON_HOLD: 'bg-gray-500',
    COMPLETED: 'bg-green-600',
    CANCELLED: 'bg-red-500',
  };

  const nextMilestone = project.milestones?.find(
    (m) => m.status === 'PENDING' || m.status === 'IN_PROGRESS'
  );

  return (
    <Link to={`/projects/${project.id}`} className="card hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
            <FolderKanban className="w-6 h-6 text-primary-600" />
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${statusColors[project.status] || 'bg-gray-500'}`}
            />
            <span className="text-sm text-gray-600">
              {project.status.replace('_', ' ')}
            </span>
          </div>
        </div>

        <h3 className="font-semibold text-gray-900 mb-2">{project.name}</h3>

        {nextMilestone && (
          <p className="text-sm text-gray-600 mb-4">
            Next: {nextMilestone.name}
          </p>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex gap-4 text-sm text-gray-500">
            <span>{project._count?.tasks || 0} tasks</span>
            <span>{project._count?.issues || 0} issues</span>
          </div>
          <ArrowRight className="w-5 h-5 text-gray-400" />
        </div>
      </div>
    </Link>
  );
}

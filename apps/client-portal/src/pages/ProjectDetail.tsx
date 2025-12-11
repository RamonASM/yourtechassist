import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  MessageSquare,
  FileText,
  AlertTriangle,
  Lightbulb,
  Users,
  DollarSign,
} from 'lucide-react';
import { format } from 'date-fns';
import { projectApi, billingApi } from '../lib/api';

type TabType = 'overview' | 'milestones' | 'requests' | 'messages' | 'files';

export default function ProjectDetail() {
  const { projectId } = useParams<{ projectId: string }>();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const queryClient = useQueryClient();

  const { data: project, isLoading } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => projectApi.get(projectId!).then((res) => res.data.data),
    enabled: !!projectId,
  });

  const { data: comments } = useQuery({
    queryKey: ['project-comments', projectId],
    queryFn: () => projectApi.getComments(projectId!).then((res) => res.data.data),
    enabled: !!projectId && activeTab === 'messages',
  });

  const { data: files } = useQuery({
    queryKey: ['project-files', projectId],
    queryFn: () => projectApi.getFiles(projectId!).then((res) => res.data.data),
    enabled: !!projectId && activeTab === 'files',
  });

  const payMilestoneMutation = useMutation({
    mutationFn: (milestoneId: string) =>
      billingApi.createMilestoneCheckout(milestoneId),
    onSuccess: (data) => {
      if (data.data.data.url) {
        window.location.href = data.data.data.url;
      }
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading project...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Project not found
        </h2>
        <Link to="/projects" className="text-primary-600 hover:underline">
          Back to projects
        </Link>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FileText },
    { id: 'milestones', label: 'Milestones', icon: Calendar },
    { id: 'requests', label: 'Requests', icon: Lightbulb },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'files', label: 'Files', icon: FileText },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to="/projects"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
          <p className="text-gray-600">
            {project.status.replace('_', ' ')} &bull; Last updated{' '}
            {format(new Date(project.updatedAt), 'MMM d, yyyy')}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex items-center gap-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <OverviewTab project={project} onPayMilestone={(id) => payMilestoneMutation.mutate(id)} />
      )}
      {activeTab === 'milestones' && (
        <MilestonesTab
          milestones={project.milestones}
          onPayMilestone={(id) => payMilestoneMutation.mutate(id)}
          isPaymentLoading={payMilestoneMutation.isPending}
        />
      )}
      {activeTab === 'requests' && <RequestsTab projectId={projectId!} />}
      {activeTab === 'messages' && (
        <MessagesTab projectId={projectId!} comments={comments || []} />
      )}
      {activeTab === 'files' && <FilesTab files={files || []} />}
    </div>
  );
}

function OverviewTab({ project, onPayMilestone }: { project: any; onPayMilestone: (id: string) => void }) {
  const currentMilestone = project.milestones?.find(
    (m: any) => m.status === 'IN_PROGRESS'
  );
  const upcomingMilestone = project.milestones?.find(
    (m: any) => m.status === 'PENDING'
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="card p-4">
            <p className="text-sm text-gray-600">Tasks</p>
            <p className="text-2xl font-bold text-gray-900">
              {project._count?.tasks || 0}
            </p>
          </div>
          <div className="card p-4">
            <p className="text-sm text-gray-600">Requests</p>
            <p className="text-2xl font-bold text-gray-900">
              {project._count?.featureRequests || 0}
            </p>
          </div>
          <div className="card p-4">
            <p className="text-sm text-gray-600">Issues</p>
            <p className="text-2xl font-bold text-gray-900">
              {project._count?.issues || 0}
            </p>
          </div>
          <div className="card p-4">
            <p className="text-sm text-gray-600">Files</p>
            <p className="text-2xl font-bold text-gray-900">
              {project._count?.files || 0}
            </p>
          </div>
        </div>

        {/* Current Milestone */}
        {currentMilestone && (
          <div className="card p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary-600" />
              Current Milestone
            </h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">{currentMilestone.name}</p>
                {currentMilestone.dueDate && (
                  <p className="text-sm text-gray-600">
                    Due {format(new Date(currentMilestone.dueDate), 'MMM d, yyyy')}
                  </p>
                )}
              </div>
              <span className="badge-info">{currentMilestone.status}</span>
            </div>
          </div>
        )}

        {/* Team */}
        <div className="card p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-primary-600" />
            Project Team
          </h3>
          <div className="space-y-3">
            {project.members?.map((member: any) => (
              <div key={member.id} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                  <span className="text-primary-700 font-medium">
                    {(member.user?.name || member.adminUser?.name || 'U')[0]}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {member.user?.name || member.adminUser?.name}
                  </p>
                  <p className="text-sm text-gray-500">{member.role}</p>
                </div>
              </div>
            )) || <p className="text-gray-500">No team members assigned</p>}
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Upcoming Payment */}
        {upcomingMilestone?.paymentAmount && upcomingMilestone.paymentStatus === 'PENDING' && (
          <div className="card p-6 border-primary-200 bg-primary-50">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-primary-600" />
              Payment Due
            </h3>
            <p className="text-3xl font-bold text-gray-900 mb-2">
              ${Number(upcomingMilestone.paymentAmount).toLocaleString()}
            </p>
            <p className="text-sm text-gray-600 mb-4">
              For: {upcomingMilestone.name}
            </p>
            <button
              onClick={() => onPayMilestone(upcomingMilestone.id)}
              className="btn-primary w-full"
            >
              Pay Now
            </button>
          </div>
        )}

        {/* Project Info */}
        <div className="card p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Project Details</h3>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-gray-500">Status</dt>
              <dd className="font-medium text-gray-900">
                {project.status.replace('_', ' ')}
              </dd>
            </div>
            <div>
              <dt className="text-gray-500">Started</dt>
              <dd className="font-medium text-gray-900">
                {format(new Date(project.createdAt), 'MMM d, yyyy')}
              </dd>
            </div>
            <div>
              <dt className="text-gray-500">Milestones</dt>
              <dd className="font-medium text-gray-900">
                {project.milestones?.filter((m: any) => m.status === 'COMPLETED').length || 0} /{' '}
                {project.milestones?.length || 0} completed
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}

function MilestonesTab({
  milestones,
  onPayMilestone,
  isPaymentLoading,
}: {
  milestones: any[];
  onPayMilestone: (id: string) => void;
  isPaymentLoading: boolean;
}) {
  const statusIcon: Record<string, React.ReactNode> = {
    COMPLETED: <CheckCircle2 className="w-5 h-5 text-green-500" />,
    IN_PROGRESS: <Clock className="w-5 h-5 text-primary-500" />,
    PENDING: <Clock className="w-5 h-5 text-gray-400" />,
  };

  return (
    <div className="space-y-4">
      {milestones?.map((milestone: any, index: number) => (
        <div key={milestone.id} className="card p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              {statusIcon[milestone.status] || statusIcon.PENDING}
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {index + 1}. {milestone.name}
                  </h3>
                  {milestone.dueDate && (
                    <p className="text-sm text-gray-600 mt-1">
                      Due: {format(new Date(milestone.dueDate), 'MMM d, yyyy')}
                    </p>
                  )}
                </div>
                <span
                  className={
                    milestone.status === 'COMPLETED'
                      ? 'badge-success'
                      : milestone.status === 'IN_PROGRESS'
                        ? 'badge-info'
                        : 'badge-gray'
                  }
                >
                  {milestone.status.replace('_', ' ')}
                </span>
              </div>

              {milestone.tasks && milestone.tasks.length > 0 && (
                <div className="mt-4 space-y-2">
                  {milestone.tasks.map((task: any) => (
                    <div
                      key={task.id}
                      className="flex items-center gap-2 text-sm"
                    >
                      {task.status === 'DONE' ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      ) : (
                        <div className="w-4 h-4 border-2 border-gray-300 rounded" />
                      )}
                      <span
                        className={
                          task.status === 'DONE'
                            ? 'text-gray-500 line-through'
                            : 'text-gray-700'
                        }
                      >
                        {task.name}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {milestone.paymentAmount && (
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Payment</p>
                    <p className="font-semibold text-gray-900">
                      ${Number(milestone.paymentAmount).toLocaleString()}
                    </p>
                  </div>
                  {milestone.paymentStatus === 'PENDING' &&
                    milestone.status !== 'PENDING' && (
                      <button
                        onClick={() => onPayMilestone(milestone.id)}
                        disabled={isPaymentLoading}
                        className="btn-primary text-sm"
                      >
                        Pay Now
                      </button>
                    )}
                  {milestone.paymentStatus === 'PAID' && (
                    <span className="badge-success">Paid</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )) || <p className="text-gray-500">No milestones yet</p>}
    </div>
  );
}

function RequestsTab({ projectId }: { projectId: string }) {
  const { data: requests, isLoading } = useQuery({
    queryKey: ['project-requests', projectId],
    queryFn: () =>
      projectApi.getFeatureRequests(projectId).then((res) => res.data.data),
  });

  const { data: issues } = useQuery({
    queryKey: ['project-issues', projectId],
    queryFn: () => projectApi.getIssues(projectId).then((res) => res.data.data),
  });

  if (isLoading) {
    return <div className="text-gray-500">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="p-4 border-b border-gray-100 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-primary-600" />
          <h3 className="font-semibold text-gray-900">Feature Requests</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {requests?.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No feature requests yet
            </div>
          ) : (
            requests?.map((request: any) => (
              <div key={request.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{request.title}</h4>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {request.description}
                    </p>
                  </div>
                  <span
                    className={
                      request.status === 'approved'
                        ? 'badge-success'
                        : request.status === 'rejected'
                          ? 'badge-error'
                          : 'badge-warning'
                    }
                  >
                    {request.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="card">
        <div className="p-4 border-b border-gray-100 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          <h3 className="font-semibold text-gray-900">Issues</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {issues?.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No issues reported</div>
          ) : (
            issues?.map((issue: any) => (
              <div key={issue.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{issue.title}</h4>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {issue.description}
                    </p>
                  </div>
                  <span
                    className={
                      issue.severity === 'critical'
                        ? 'badge-error'
                        : issue.severity === 'high'
                          ? 'badge-warning'
                          : 'badge-gray'
                    }
                  >
                    {issue.severity}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function MessagesTab({ projectId, comments }: { projectId: string; comments: any[] }) {
  const [newMessage, setNewMessage] = useState('');
  const queryClient = useQueryClient();

  const sendMessageMutation = useMutation({
    mutationFn: (content: string) =>
      projectApi.createComment(projectId, { content }),
    onSuccess: () => {
      setNewMessage('');
      queryClient.invalidateQueries({ queryKey: ['project-comments', projectId] });
    },
  });

  return (
    <div className="card">
      <div className="p-6 border-b border-gray-100">
        <h3 className="font-semibold text-gray-900">Project Discussion</h3>
      </div>

      <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
        {comments?.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No messages yet. Start the conversation!
          </div>
        ) : (
          comments?.map((comment: any) => (
            <div key={comment.id} className="p-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary-700 font-medium text-sm">
                    {(comment.user?.name || comment.adminUser?.name || 'U')[0]}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">
                      {comment.user?.name || comment.adminUser?.name}
                    </span>
                    <span className="text-xs text-gray-400">
                      {format(new Date(comment.createdAt), 'MMM d, h:mm a')}
                    </span>
                  </div>
                  <p className="text-gray-700 mt-1">{comment.content}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-4 border-t border-gray-100">
        <div className="flex gap-3">
          <input
            type="text"
            className="input flex-1"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && newMessage.trim()) {
                sendMessageMutation.mutate(newMessage);
              }
            }}
          />
          <button
            onClick={() => {
              if (newMessage.trim()) {
                sendMessageMutation.mutate(newMessage);
              }
            }}
            disabled={!newMessage.trim() || sendMessageMutation.isPending}
            className="btn-primary"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

function FilesTab({ files }: { files: any[] }) {
  return (
    <div className="card">
      <div className="p-6 border-b border-gray-100">
        <h3 className="font-semibold text-gray-900">Project Files</h3>
      </div>
      <div className="divide-y divide-gray-100">
        {files?.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No files uploaded</div>
        ) : (
          files?.map((file: any) => (
            <div key={file.id} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">{file.filename}</p>
                  <p className="text-sm text-gray-500">
                    {(file.filesize / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
              <a
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:underline text-sm"
              >
                Download
              </a>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

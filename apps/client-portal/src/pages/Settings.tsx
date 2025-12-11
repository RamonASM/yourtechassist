import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { User, Building2, Users, Bell, Lock, Loader2, Check } from 'lucide-react';
import { companyApi } from '../lib/api';
import { useAuthStore } from '../stores/auth';

type TabType = 'profile' | 'company' | 'team' | 'notifications' | 'security';

export default function Settings() {
  const [activeTab, setActiveTab] = useState<TabType>('profile');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'company', label: 'Company', icon: Building2 },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Lock },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account and preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64 flex-shrink-0">
          <nav className="card p-2 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`sidebar-link w-full ${activeTab === tab.id ? 'active' : ''}`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === 'profile' && <ProfileSettings />}
          {activeTab === 'company' && <CompanySettings />}
          {activeTab === 'team' && <TeamSettings />}
          {activeTab === 'notifications' && <NotificationSettings />}
          {activeTab === 'security' && <SecuritySettings />}
        </div>
      </div>
    </div>
  );
}

function ProfileSettings() {
  const { user, updateUser } = useAuthStore();
  const [saved, setSaved] = useState(false);

  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
    },
  });

  const onSubmit = (data: { name: string; email: string }) => {
    // TODO: API call to update profile
    updateUser({ name: data.name });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="card p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Profile Settings</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-md">
        <div>
          <label htmlFor="name" className="label">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            className="input"
            {...register('name', { required: true })}
          />
        </div>

        <div>
          <label htmlFor="email" className="label">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            className="input"
            disabled
            {...register('email')}
          />
          <p className="mt-1 text-sm text-gray-500">
            Contact support to change your email
          </p>
        </div>

        <button type="submit" className="btn-primary flex items-center gap-2">
          {saved ? (
            <>
              <Check className="w-4 h-4" />
              Saved
            </>
          ) : (
            'Save Changes'
          )}
        </button>
      </form>
    </div>
  );
}

function CompanySettings() {
  const { company } = useAuthStore();
  const queryClient = useQueryClient();
  const [saved, setSaved] = useState(false);

  const { data: companyData } = useQuery({
    queryKey: ['company', company?.id],
    queryFn: () => companyApi.get(company!.id).then((res) => res.data.data),
    enabled: !!company?.id,
  });

  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: companyData?.name || company?.name || '',
      website: companyData?.website || '',
      industry: companyData?.industry || '',
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: Record<string, string>) =>
      companyApi.update(company!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company', company?.id] });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    },
  });

  const onSubmit = (data: Record<string, string>) => {
    updateMutation.mutate(data);
  };

  return (
    <div className="card p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Company Settings</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-md">
        <div>
          <label htmlFor="companyName" className="label">
            Company Name
          </label>
          <input
            id="companyName"
            type="text"
            className="input"
            {...register('name', { required: true })}
          />
        </div>

        <div>
          <label htmlFor="website" className="label">
            Website
          </label>
          <input
            id="website"
            type="url"
            className="input"
            placeholder="https://yourcompany.com"
            {...register('website')}
          />
        </div>

        <div>
          <label htmlFor="industry" className="label">
            Industry
          </label>
          <select id="industry" className="input" {...register('industry')}>
            <option value="">Select industry</option>
            <option value="technology">Technology</option>
            <option value="healthcare">Healthcare</option>
            <option value="finance">Finance</option>
            <option value="retail">Retail</option>
            <option value="manufacturing">Manufacturing</option>
            <option value="other">Other</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={updateMutation.isPending}
          className="btn-primary flex items-center gap-2"
        >
          {updateMutation.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : saved ? (
            <>
              <Check className="w-4 h-4" />
              Saved
            </>
          ) : (
            'Save Changes'
          )}
        </button>
      </form>
    </div>
  );
}

function TeamSettings() {
  const { company } = useAuthStore();
  const [showInvite, setShowInvite] = useState(false);
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery({
    queryKey: ['company-users', company?.id],
    queryFn: () => companyApi.getUsers(company!.id).then((res) => res.data.data),
    enabled: !!company?.id,
  });

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      email: '',
      name: '',
      role: 'MEMBER',
    },
  });

  const inviteMutation = useMutation({
    mutationFn: (data: { email: string; name: string; role: string }) =>
      companyApi.inviteUser(company!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-users', company?.id] });
      setShowInvite(false);
      reset();
    },
  });

  return (
    <div className="card">
      <div className="flex items-center justify-between p-6 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">Team Members</h2>
        <button onClick={() => setShowInvite(true)} className="btn-primary text-sm">
          Invite Member
        </button>
      </div>

      {showInvite && (
        <form
          onSubmit={handleSubmit((data) => inviteMutation.mutate(data))}
          className="p-6 bg-gray-50 border-b border-gray-100 space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="inviteName" className="label">
                Name
              </label>
              <input
                id="inviteName"
                type="text"
                className="input"
                placeholder="John Doe"
                {...register('name', { required: true })}
              />
            </div>
            <div>
              <label htmlFor="inviteEmail" className="label">
                Email
              </label>
              <input
                id="inviteEmail"
                type="email"
                className="input"
                placeholder="john@company.com"
                {...register('email', { required: true })}
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <select className="input w-auto" {...register('role')}>
              <option value="MEMBER">Member</option>
              <option value="ADMIN">Admin</option>
            </select>
            <button
              type="submit"
              disabled={inviteMutation.isPending}
              className="btn-primary"
            >
              {inviteMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'Send Invite'
              )}
            </button>
            <button
              type="button"
              onClick={() => setShowInvite(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="divide-y divide-gray-100">
        {isLoading ? (
          <div className="p-6 text-center text-gray-500">Loading...</div>
        ) : users?.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No team members</div>
        ) : (
          users?.map((user: any) => (
            <div key={user.id} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                  <span className="text-primary-700 font-medium">
                    {user.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="badge-gray">{user.role}</span>
                {user.isActive ? (
                  <span className="badge-success">Active</span>
                ) : (
                  <span className="badge-warning">Invited</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function NotificationSettings() {
  const [settings, setSettings] = useState({
    emailUpdates: true,
    milestoneAlerts: true,
    paymentReminders: true,
    weeklyDigest: false,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="card p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">
        Notification Preferences
      </h2>
      <div className="space-y-4">
        {[
          {
            key: 'emailUpdates',
            label: 'Email Updates',
            description: 'Receive email notifications for project updates',
          },
          {
            key: 'milestoneAlerts',
            label: 'Milestone Alerts',
            description: 'Get notified when milestones are completed or due',
          },
          {
            key: 'paymentReminders',
            label: 'Payment Reminders',
            description: 'Receive reminders for upcoming or overdue payments',
          },
          {
            key: 'weeklyDigest',
            label: 'Weekly Digest',
            description: 'Receive a weekly summary of all activity',
          },
        ].map((item) => (
          <div
            key={item.key}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
          >
            <div>
              <p className="font-medium text-gray-900">{item.label}</p>
              <p className="text-sm text-gray-500">{item.description}</p>
            </div>
            <button
              onClick={() => toggleSetting(item.key as keyof typeof settings)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings[item.key as keyof typeof settings]
                  ? 'bg-primary-600'
                  : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings[item.key as keyof typeof settings]
                    ? 'translate-x-6'
                    : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function SecuritySettings() {
  const [showChangePassword, setShowChangePassword] = useState(false);

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = (data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    // TODO: API call to change password
    console.log('Change password:', data);
    setShowChangePassword(false);
    reset();
  };

  return (
    <div className="card p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Security Settings</h2>

      {!showChangePassword ? (
        <button
          onClick={() => setShowChangePassword(true)}
          className="btn-secondary"
        >
          Change Password
        </button>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
          <div>
            <label htmlFor="currentPassword" className="label">
              Current Password
            </label>
            <input
              id="currentPassword"
              type="password"
              className="input"
              {...register('currentPassword', { required: true })}
            />
          </div>
          <div>
            <label htmlFor="newPassword" className="label">
              New Password
            </label>
            <input
              id="newPassword"
              type="password"
              className="input"
              {...register('newPassword', { required: true, minLength: 8 })}
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="label">
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              className="input"
              {...register('confirmPassword', { required: true })}
            />
          </div>
          <div className="flex gap-3">
            <button type="submit" className="btn-primary">
              Update Password
            </button>
            <button
              type="button"
              onClick={() => {
                setShowChangePassword(false);
                reset();
              }}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

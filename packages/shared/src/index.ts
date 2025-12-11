// =============================================================================
// USER & AUTH TYPES
// =============================================================================

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  companyId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type UserRole = 'OWNER' | 'ADMIN' | 'MEMBER';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  isActive: boolean;
  createdAt: Date;
}

export type AdminRole = 'SUPER_ADMIN' | 'PROJECT_MANAGER' | 'DEVELOPER' | 'DESIGNER';

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole | AdminRole;
  companyId?: string;
  isAdmin?: boolean;
}

// =============================================================================
// COMPANY & ONBOARDING TYPES
// =============================================================================

export interface Company {
  id: string;
  name: string;
  industry?: string;
  size?: CompanySize;
  website?: string;
  stripeCustomerId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CompanySize = '1-10' | '11-50' | '51-200' | '200+';

export interface OnboardingData {
  id: string;
  companyId: string;
  // Step 2: Business Profile
  industry?: string;
  companySize?: CompanySize;
  revenueRange?: string;
  currentTechStack?: string;
  // Step 3: Requirements
  projectTypes: string[];
  problemDescription?: string;
  keyFeatures: string[];
  integrations: string[];
  targetUsers?: 'internal' | 'customers' | 'both';
  timeline?: 'ASAP' | '1-3-months' | '3-6-months' | 'flexible';
  // Step 4: Budget
  engagementModel?: 'one-time' | 'licensing' | 'not-sure';
  budgetRange?: string;
  communicationPref?: string;
  additionalNotes?: string;
  // Calculated
  suggestedTier?: PricingTier;
  estimatedMin?: number;
  estimatedMax?: number;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type PricingTier = 'starter' | 'launchpad' | 'growth' | 'scale';

// =============================================================================
// PROJECT TYPES
// =============================================================================

export interface Project {
  id: string;
  companyId: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  startDate?: Date;
  targetEndDate?: Date;
  actualEndDate?: Date;
  totalBudget?: number;
  createdAt: Date;
  updatedAt: Date;
}

export type ProjectStatus =
  | 'DISCOVERY'
  | 'PLANNING'
  | 'DESIGN'
  | 'DEVELOPMENT'
  | 'TESTING'
  | 'LAUNCH'
  | 'MAINTENANCE'
  | 'COMPLETED'
  | 'ON_HOLD'
  | 'CANCELLED';

export interface Milestone {
  id: string;
  projectId: string;
  name: string;
  description?: string;
  status: MilestoneStatus;
  dueDate?: Date;
  completedAt?: Date;
  paymentAmount?: number;
  paymentStatus: PaymentStatus;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export type MilestoneStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'SKIPPED';
export type PaymentStatus = 'PENDING' | 'INVOICED' | 'PAID' | 'OVERDUE' | 'WAIVED';

export interface ProjectTask {
  id: string;
  projectId: string;
  milestoneId?: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  assigneeId?: string;
  dueDate?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'COMPLETED';
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface Iteration {
  id: string;
  projectId: string;
  name: string;
  type: 'sprint' | 'design_review' | 'demo';
  startDate: Date;
  endDate: Date;
  status: 'planned' | 'active' | 'completed';
  demoUrl?: string;
  notes?: string;
  createdAt: Date;
}

// =============================================================================
// FEATURE REQUESTS & ISSUES
// =============================================================================

export interface FeatureRequest {
  id: string;
  projectId: string;
  userId: string;
  type: 'feature' | 'enhancement' | 'bug';
  priority: Priority;
  title: string;
  description: string;
  status: RequestStatus;
  estimatedEffort?: string;
  adminNotes?: string;
  resolvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type RequestStatus =
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'PLANNED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'DECLINED';

export interface Issue {
  id: string;
  projectId: string;
  reportedBy: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'investigating' | 'resolved' | 'closed';
  resolvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// =============================================================================
// BILLING TYPES
// =============================================================================

export interface Subscription {
  id: string;
  companyId: string;
  stripeSubscriptionId: string;
  status: SubscriptionStatus;
  plan: PricingTier;
  priceId: string;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type SubscriptionStatus =
  | 'active'
  | 'past_due'
  | 'canceled'
  | 'incomplete'
  | 'trialing';

export interface Invoice {
  id: string;
  companyId: string;
  milestoneId?: string;
  stripeInvoiceId?: string;
  invoiceNumber: string;
  amount: number;
  status: InvoiceStatus;
  dueDate?: Date;
  paidAt?: Date;
  description?: string;
  lineItems?: InvoiceLineItem[];
  createdAt: Date;
  updatedAt: Date;
}

export type InvoiceStatus =
  | 'DRAFT'
  | 'SENT'
  | 'PAID'
  | 'OVERDUE'
  | 'CANCELLED'
  | 'REFUNDED';

export interface InvoiceLineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface PaymentMethod {
  id: string;
  companyId: string;
  stripePaymentMethodId: string;
  type: 'card' | 'bank_account';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
  createdAt: Date;
}

// =============================================================================
// COMMUNICATION TYPES
// =============================================================================

export interface Comment {
  id: string;
  projectId: string;
  userId?: string;
  adminUserId?: string;
  content: string;
  parentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FileAttachment {
  id: string;
  projectId?: string;
  featureRequestId?: string;
  issueId?: string;
  commentId?: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  uploadedBy: string;
  createdAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  readAt?: Date;
  createdAt: Date;
}

export type NotificationType =
  | 'milestone_due'
  | 'milestone_completed'
  | 'payment_received'
  | 'payment_due'
  | 'comment_mention'
  | 'project_update'
  | 'feature_request_update';

// =============================================================================
// API RESPONSE TYPES
// =============================================================================

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  error: string;
  message: string;
  statusCode: number;
  details?: Record<string, string[]>;
}

// =============================================================================
// UTILITY TYPES
// =============================================================================

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type WithTimestamps<T> = T & {
  createdAt: Date;
  updatedAt: Date;
};

import { useQuery, useMutation } from '@tanstack/react-query';
import {
  CreditCard,
  DollarSign,
  FileText,
  ExternalLink,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { format } from 'date-fns';
import { billingApi } from '../lib/api';

export default function Billing() {
  const { data, isLoading } = useQuery({
    queryKey: ['billing-overview'],
    queryFn: () => billingApi.getOverview().then((res) => res.data.data),
  });

  const portalMutation = useMutation({
    mutationFn: () => billingApi.createPortalSession(),
    onSuccess: (res) => {
      if (res.data.data.url) {
        window.location.href = res.data.data.url;
      }
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  const { activeSubscription, invoices, paymentMethods, outstandingBalance } =
    data || {};

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Billing</h1>
        <p className="text-gray-600 mt-1">
          Manage your subscription and payments
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Current Plan</p>
              <p className="text-xl font-bold text-gray-900 capitalize">
                {activeSubscription?.plan || 'No Plan'}
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
              <p className="text-sm text-gray-600">Outstanding Balance</p>
              <p className="text-xl font-bold text-gray-900">
                ${(outstandingBalance || 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Next Billing</p>
              <p className="text-xl font-bold text-gray-900">
                {activeSubscription?.currentPeriodEnd
                  ? format(
                      new Date(activeSubscription.currentPeriodEnd),
                      'MMM d, yyyy'
                    )
                  : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Invoices */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Invoices
              </h2>
            </div>
            <div className="divide-y divide-gray-100">
              {invoices?.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  No invoices yet
                </div>
              ) : (
                invoices?.slice(0, 5).map((invoice: any) => (
                  <div
                    key={invoice.id}
                    className="p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          invoice.status === 'PAID'
                            ? 'bg-green-100'
                            : invoice.status === 'OVERDUE'
                              ? 'bg-red-100'
                              : 'bg-gray-100'
                        }`}
                      >
                        {invoice.status === 'PAID' ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        ) : invoice.status === 'OVERDUE' ? (
                          <AlertCircle className="w-5 h-5 text-red-600" />
                        ) : (
                          <FileText className="w-5 h-5 text-gray-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {invoice.milestone?.project?.name ||
                            invoice.milestone?.name ||
                            'Subscription'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {format(new Date(invoice.createdAt), 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        ${Number(invoice.amount).toLocaleString()}
                      </p>
                      <span
                        className={
                          invoice.status === 'PAID'
                            ? 'badge-success'
                            : invoice.status === 'OVERDUE'
                              ? 'badge-error'
                              : 'badge-warning'
                        }
                      >
                        {invoice.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Payment Methods & Actions */}
        <div className="space-y-6">
          {/* Active Subscription */}
          {activeSubscription && (
            <div className="card p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Subscription</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Plan</span>
                  <span className="font-medium text-gray-900 capitalize">
                    {activeSubscription.plan}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Status</span>
                  <span
                    className={
                      activeSubscription.status === 'active'
                        ? 'badge-success'
                        : 'badge-warning'
                    }
                  >
                    {activeSubscription.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Renews</span>
                  <span className="text-gray-900">
                    {format(
                      new Date(activeSubscription.currentPeriodEnd),
                      'MMM d, yyyy'
                    )}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Payment Methods */}
          <div className="card p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Payment Methods</h3>
            <div className="space-y-3">
              {paymentMethods?.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No payment methods on file
                </p>
              ) : (
                paymentMethods?.map((method: any) => (
                  <div
                    key={method.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <CreditCard className="w-5 h-5 text-gray-400" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 capitalize">
                        {method.brand} ****{method.last4}
                      </p>
                      <p className="text-sm text-gray-500">
                        Expires {method.expMonth}/{method.expYear}
                      </p>
                    </div>
                    {method.isDefault && (
                      <span className="badge-info">Default</span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Manage Billing */}
          <button
            onClick={() => portalMutation.mutate()}
            disabled={portalMutation.isPending}
            className="btn-secondary w-full flex items-center justify-center gap-2"
          >
            {portalMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <ExternalLink className="w-4 h-4" />
                Manage Billing
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

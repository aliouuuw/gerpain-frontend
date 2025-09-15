import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Mail, Plus, Search, Trash2 } from 'lucide-react'
import { useAdminStore } from '../../stores/adminStore'
import { useOrganizationStore } from '../../stores/organizationStore'
import { InvitationFormDialog } from '../../components/admin/InvitationFormDialog'
import { DeleteConfirmDialog } from '../../components/admin/DeleteConfirmDialog'

export const Route = createFileRoute('/(admin)/admin/invitations')({
  component: InvitationsPage,
})

function InvitationsPage() {
  const {
    invitations,
    isLoading,
    loadInvitations,
    sendInvitation,
    cancelInvitation,
  } = useAdminStore()

  const { selectedOrganization } = useOrganizationStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [showInviteForm, setShowInviteForm] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedInvitation, setSelectedInvitation] = useState<any>(null)

  useEffect(() => {
    if (selectedOrganization) {
      loadInvitations()
    }
  }, [selectedOrganization, loadInvitations])

  const filteredInvitations = invitations.filter(invitation =>
    invitation.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invitation.organizationName?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSendInvitation = async (invitationData: any) => {
    await sendInvitation(invitationData)
    setShowInviteForm(false)
  }

  const handleCancelInvitation = async () => {
    if (selectedInvitation) {
      await cancelInvitation(selectedInvitation.id)
      setShowDeleteDialog(false)
      setSelectedInvitation(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'accepted':
        return 'bg-green-100 text-green-800'
      case 'expired':
        return 'bg-gray-100 text-gray-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Mail className="w-8 h-8 text-gray-600" />
          <div>
            <h1 className="text-2xl font-light text-gray-900">Invitations</h1>
            <p className="text-sm text-gray-600">Send and manage organization invitations</p>
          </div>
        </div>
        <button
          onClick={() => setShowInviteForm(true)}
          className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-light transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Send Invitation</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search invitations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Invitations Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-light text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-light text-gray-500 uppercase tracking-wider">
                    Organization
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-light text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-light text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-light text-gray-500 uppercase tracking-wider">
                    Sent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-light text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInvitations.map((invitation) => (
                  <tr key={invitation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <Mail className="w-4 h-4 text-gray-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-light text-gray-900">{invitation.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-light text-gray-900">
                        {invitation.organizationName || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-light bg-blue-100 text-blue-800">
                        {invitation.role || 'Member'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-light ${getStatusColor(invitation.status)}`}>
                        {invitation.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-light text-gray-500">
                        {new Date(invitation.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-light">
                      {invitation.status === 'pending' && (
                        <button
                          onClick={() => {
                            setSelectedInvitation(invitation)
                            setShowDeleteDialog(true)
                          }}
                          className="text-gray-400 hover:text-red-600"
                          title="Cancel Invitation"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filteredInvitations.length === 0 && !isLoading && (
          <div className="p-8 text-center">
            <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-sm font-light text-gray-900 mb-1">No invitations found</h3>
            <p className="text-sm text-gray-500">
              {searchTerm ? 'Try adjusting your search terms.' : 'Send your first invitation to get started.'}
            </p>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Mail className="w-8 h-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-light text-gray-600">Pending</p>
              <p className="text-2xl font-light text-gray-900">
                {invitations.filter(i => i.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Mail className="w-8 h-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-light text-gray-600">Accepted</p>
              <p className="text-2xl font-light text-gray-900">
                {invitations.filter(i => i.status === 'accepted').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Mail className="w-8 h-8 text-gray-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-light text-gray-600">Expired</p>
              <p className="text-2xl font-light text-gray-900">
                {invitations.filter(i => i.status === 'expired').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Mail className="w-8 h-8 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-light text-gray-600">Cancelled</p>
              <p className="text-2xl font-light text-gray-900">
                {invitations.filter(i => i.status === 'cancelled').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <InvitationFormDialog
        isOpen={showInviteForm}
        onClose={() => setShowInviteForm(false)}
        onSubmit={handleSendInvitation}
      />

      <DeleteConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false)
          setSelectedInvitation(null)
        }}
        onConfirm={handleCancelInvitation}
        title="Cancel Invitation"
        description={`Are you sure you want to cancel the invitation to ${selectedInvitation?.email}?`}
      />
    </div>
  )
}


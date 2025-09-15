import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Building2, Pencil, Plus, Search, Trash2, Users } from 'lucide-react'
import { useAdminStore } from '../../stores/adminStore'
import { OrganizationFormDialog } from '../../components/admin/OrganizationFormDialog'
import { DeleteConfirmDialog } from '../../components/admin/DeleteConfirmDialog'

export const Route = createFileRoute('/(admin)/admin/organizations')({
  component: OrganizationsPage,
})

function OrganizationsPage() {
  const {
    organizations,
    isLoading,
    loadOrganizations,
    createOrganization,
    updateOrganization,
    deleteOrganization,
  } = useAdminStore()

  const [searchTerm, setSearchTerm] = useState('')
  const [showOrgForm, setShowOrgForm] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedOrg, setSelectedOrg] = useState<any>(null)
  const [editingOrg, setEditingOrg] = useState<any>(null)

  useEffect(() => {
    loadOrganizations()
  }, [loadOrganizations])

  const filteredOrganizations = organizations.filter(org =>
    org.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCreateOrganization = async (orgData: any) => {
    await createOrganization(orgData)
    setShowOrgForm(false)
  }

  const handleUpdateOrganization = async (orgData: any) => {
    if (editingOrg) {
      await updateOrganization(editingOrg.id, orgData)
      setEditingOrg(null)
    }
  }

  const handleDeleteOrganization = async () => {
    if (selectedOrg) {
      await deleteOrganization(selectedOrg.id)
      setShowDeleteDialog(false)
      setSelectedOrg(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Building2 className="w-8 h-8 text-gray-600" />
          <div>
            <h1 className="text-2xl font-light text-gray-900">Organizations</h1>
            <p className="text-sm text-gray-600">Manage organizations and their settings</p>
          </div>
        </div>
        <button
          onClick={() => setShowOrgForm(true)}
          className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-light transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Organization</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search organizations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Organizations Table */}
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
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-light text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-light text-gray-500 uppercase tracking-wider">
                    Members
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-light text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-light text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrganizations.map((org) => (
                  <tr key={org.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                          <Building2 className="w-4 h-4 text-gray-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-light text-gray-900">{org.name}</div>
                          <div className="text-sm text-gray-500">{org.description || 'No description'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-light ${
                        org.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {org.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm font-light text-gray-900">
                        <Users className="w-4 h-4 mr-2 text-gray-400" />
                        {org.memberCount || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-light text-gray-500">
                        {new Date(org.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-light">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setEditingOrg(org)
                            setShowOrgForm(true)
                          }}
                          className="text-gray-400 hover:text-gray-600"
                          title="Edit Organization"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedOrg(org)
                            setShowDeleteDialog(true)
                          }}
                          className="text-gray-400 hover:text-red-600"
                          title="Delete Organization"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filteredOrganizations.length === 0 && !isLoading && (
          <div className="p-8 text-center">
            <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-sm font-light text-gray-900 mb-1">No organizations found</h3>
            <p className="text-sm text-gray-500">
              {searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating your first organization.'}
            </p>
          </div>
        )}
      </div>

      {/* Dialogs */}
      <OrganizationFormDialog
        isOpen={showOrgForm}
        onClose={() => {
          setShowOrgForm(false)
          setEditingOrg(null)
        }}
        onSubmit={editingOrg ? handleUpdateOrganization : handleCreateOrganization}
        organization={editingOrg}
      />

      <DeleteConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false)
          setSelectedOrg(null)
        }}
        onConfirm={handleDeleteOrganization}
        title="Delete Organization"
        description={`Are you sure you want to delete "${selectedOrg?.name}"? This will remove all associated data and cannot be undone.`}
      />
    </div>
  )
}


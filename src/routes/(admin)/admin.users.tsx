import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Pencil, Plus, Search, Shield, Trash2, Users } from 'lucide-react'
import { useAdminStore } from '../../stores/adminStore'
import { useOrganizationStore } from '../../stores/organizationStore'
import { UserFormDialog } from '../../components/admin/UserFormDialog'
import { RoleDialog } from '../../components/admin/RoleDialog'
import { DeleteConfirmDialog } from '../../components/admin/DeleteConfirmDialog'

export const Route = createFileRoute('/(admin)/admin/users')({
  component: UsersPage,
})

function UsersPage() {
  const {
    users,
    isLoading,
    loadUsers,
    createUser,
    updateUser,
    deleteUser,
    assignRole,
    removeRole,
  } = useAdminStore()

  const { selectedOrganization } = useOrganizationStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [showUserForm, setShowUserForm] = useState(false)
  const [showRoleDialog, setShowRoleDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [editingUser, setEditingUser] = useState<any>(null)

  useEffect(() => {
    if (selectedOrganization) {
      loadUsers()
    }
  }, [selectedOrganization, loadUsers])

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCreateUser = async (userData: any) => {
    await createUser(userData)
    setShowUserForm(false)
  }

  const handleUpdateUser = async (userData: any) => {
    if (editingUser) {
      await updateUser(editingUser.id, userData)
      setEditingUser(null)
    }
  }

  const handleDeleteUser = async () => {
    if (selectedUser) {
      await deleteUser(selectedUser.id)
      setShowDeleteDialog(false)
      setSelectedUser(null)
    }
  }

  const handleAssignRole = async (roleId: string): Promise<boolean> => {
    if (selectedUser) {
      try {
        await assignRole(selectedUser.id, roleId)
        setShowRoleDialog(false)
        setSelectedUser(null)
        return true
      } catch {
        return false
      }
    }
    return false
  }

  const handleRemoveRole = async (roleId: string): Promise<boolean> => {
    if (selectedUser) {
      try {
        await removeRole(selectedUser.id, roleId)
        setShowRoleDialog(false)
        setSelectedUser(null)
        return true
      } catch {
        return false
      }
    }
    return false
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Users className="w-8 h-8 text-gray-600" />
          <div>
            <h1 className="text-2xl font-light text-gray-900">Users</h1>
            <p className="text-sm text-gray-600">Manage user accounts and permissions</p>
          </div>
        </div>
        <button
          onClick={() => setShowUserForm(true)}
          className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-light transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add User</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Users Table */}
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
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-light text-gray-500 uppercase tracking-wider">
                    Roles
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
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-sm font-light text-gray-600">
                            {user.name?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-light text-gray-900">
                            {user.name || 'No name'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-light text-gray-900">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {user.roles.length > 0 ? (
                          user.roles.map((role: string) => (
                            <span
                              key={role}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-light bg-gray-100 text-gray-800"
                            >
                              {role}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-gray-500 font-light">No roles</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-light text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-light">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedUser(user)
                            setShowRoleDialog(true)
                          }}
                          className="text-gray-400 hover:text-gray-600"
                          title="Manage Roles"
                        >
                          <Shield className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setEditingUser(user)
                            setShowUserForm(true)
                          }}
                          className="text-gray-400 hover:text-gray-600"
                          title="Edit User"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedUser(user)
                            setShowDeleteDialog(true)
                          }}
                          className="text-gray-400 hover:text-red-600"
                          title="Delete User"
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

        {filteredUsers.length === 0 && !isLoading && (
          <div className="p-8 text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-sm font-light text-gray-900 mb-1">No users found</h3>
            <p className="text-sm text-gray-500">
              {searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating your first user.'}
            </p>
          </div>
        )}
      </div>

      {/* Dialogs */}
      <UserFormDialog
        isOpen={showUserForm}
        onClose={() => {
          setShowUserForm(false)
          setEditingUser(null)
        }}
        onSubmit={editingUser ? handleUpdateUser : handleCreateUser}
        user={editingUser}
      />

      <RoleDialog
        isOpen={showRoleDialog}
        onClose={() => {
          setShowRoleDialog(false)
          setSelectedUser(null)
        }}
        onAssignRole={handleAssignRole}
        onRemoveRole={handleRemoveRole}
        user={selectedUser}
      />

      <DeleteConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false)
          setSelectedUser(null)
        }}
        onConfirm={handleDeleteUser}
        title="Delete User"
        description={`Are you sure you want to delete ${selectedUser?.name || selectedUser?.email}? This action cannot be undone.`}
      />
    </div>
  )
}


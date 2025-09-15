import { useState } from 'react';
import { X, Shield, Plus, Minus } from 'lucide-react';
import type { User as UserType } from '../../services/api';

interface RoleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAssignRole: (roleId: string) => Promise<boolean>;
  onRemoveRole: (roleId: string) => Promise<boolean>;
  user: UserType | null;
}

export function RoleDialog({
  isOpen,
  onClose,
  onAssignRole,
  onRemoveRole,
  user,
}: RoleDialogProps) {
  const [availableRoles] = useState(['ADMIN', 'USER', 'MANAGER', 'MODERATOR']);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const handleAssignRole = async (role: string) => {
    if (!user) return;

    setIsProcessing(role);
    try {
      const success = await onAssignRole(role);
      if (success) {
        // Role will be updated via store refresh
      }
    } finally {
      setIsProcessing(null);
    }
  };

  const handleRemoveRole = async (role: string) => {
    if (!user) return;

    setIsProcessing(role);
    try {
      const success = await onRemoveRole(role);
      if (success) {
        // Role will be updated via store refresh
      }
    } finally {
      setIsProcessing(null);
    }
  };

  if (!isOpen || !user) return null;

  const userRoles = user.roles;
  const unassignedRoles = availableRoles.filter(role => !userRoles.includes(role));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Shield className="w-6 h-6 text-gray-600" />
            <div>
              <h2 className="text-xl font-light text-gray-900">Manage Roles</h2>
              <p className="text-sm text-gray-600">{user.name || user.email}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Current Roles */}
          <div>
            <h3 className="text-sm font-light text-gray-700 mb-3">Current Roles</h3>
            {userRoles.length > 0 ? (
              <div className="space-y-2">
                {userRoles.map((role) => (
                  <div
                    key={role}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <Shield className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-light text-gray-900">{role}</span>
                    </div>
                    <button
                      onClick={() => handleRemoveRole(role)}
                      disabled={isProcessing === role}
                      className="text-red-600 hover:text-red-800 disabled:opacity-50"
                    >
                      {isProcessing === role ? (
                        <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Minus className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 font-light">No roles assigned</p>
            )}
          </div>

          {/* Available Roles */}
          {unassignedRoles.length > 0 && (
            <div>
              <h3 className="text-sm font-light text-gray-700 mb-3">Available Roles</h3>
              <div className="space-y-2">
                {unassignedRoles.map((role) => (
                  <div
                    key={role}
                    className="flex items-center justify-between p-3 bg-blue-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <Shield className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-light text-gray-900">{role}</span>
                    </div>
                    <button
                      onClick={() => handleAssignRole(role)}
                      disabled={isProcessing === role}
                      className="text-blue-600 hover:text-blue-800 disabled:opacity-50"
                    >
                      {isProcessing === role ? (
                        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-light text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}


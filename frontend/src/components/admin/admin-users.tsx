"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { UserPlus, Edit, Trash2, Shield } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface AdminUser {
  id: number
  name: string
  email: string
  role: string
  status: string
  lastLogin: string
  permissions: string[]
}

interface AdminUsersProps {
  currentUser: any
}

export function AdminUsers({ currentUser }: AdminUsersProps) {
  const { toast } = useToast()
  const [users, setUsers] = useState<AdminUser[]>([
    {
      id: 1,
      name: "Admin User",
      email: "admin@nayak.com",
      role: "Super Admin",
      status: "Active",
      lastLogin: "2024-01-15 10:30 AM",
      permissions: ["all"],
    },
    {
      id: 2,
      name: "Manager User",
      email: "manager@nayak.com",
      role: "Manager",
      status: "Active",
      lastLogin: "2024-01-15 09:15 AM",
      permissions: ["products", "orders", "customers", "reports"],
    },
    {
      id: 3,
      name: "Viewer User",
      email: "viewer@nayak.com",
      role: "Viewer",
      status: "Active",
      lastLogin: "2024-01-14 04:20 PM",
      permissions: ["view_orders", "view_reports"],
    },
    {
      id: 4,
      name: "Sales Rep",
      email: "sales@nayak.com",
      role: "Sales",
      status: "Inactive",
      lastLogin: "2024-01-10 02:45 PM",
      permissions: ["customers", "orders"],
    },
  ])

  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null)
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "",
    status: "Active",
  })

  const roles = [
    { value: "Super Admin", label: "Super Admin", permissions: ["all"] },
    { value: "Manager", label: "Manager", permissions: ["products", "orders", "customers", "reports"] },
    { value: "Sales", label: "Sales Representative", permissions: ["customers", "orders"] },
    { value: "Viewer", label: "Viewer", permissions: ["view_orders", "view_reports"] },
  ]

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email || !newUser.role) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const roleData = roles.find((r) => r.value === newUser.role)
    const user: AdminUser = {
      id: Date.now(),
      ...newUser,
      lastLogin: "Never",
      permissions: roleData?.permissions || [],
    }

    setUsers((prev) => [...prev, user])
    setNewUser({ name: "", email: "", role: "", status: "Active" })
    setIsAddUserOpen(false)

    toast({
      title: "User Added",
      description: `${user.name} has been added successfully`,
    })
  }

  const handleEditUser = (user: AdminUser) => {
    setEditingUser(user)
  }

  const handleUpdateUser = () => {
    if (!editingUser) return

    setUsers((prev) => prev.map((u) => (u.id === editingUser.id ? editingUser : u)))
    setEditingUser(null)

    toast({
      title: "User Updated",
      description: `${editingUser.name} has been updated successfully`,
    })
  }

  const handleDeleteUser = (userId: number) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId))
    toast({
      title: "User Deleted",
      description: "User has been removed from the system",
    })
  }

  const toggleUserStatus = (userId: number) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: u.status === "Active" ? "Inactive" : "Active" } : u)),
    )
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "Super Admin":
        return "destructive"
      case "Manager":
        return "default"
      case "Sales":
        return "secondary"
      case "Viewer":
        return "outline"
      default:
        return "outline"
    }
  }

  if (currentUser?.role !== "Super Admin") {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold">Access Restricted</h3>
          <p className="text-muted-foreground">Only Super Admins can manage users</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">Manage user accounts and role assignments</p>
        </div>
        <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>Create a new user account with appropriate role and permissions</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={newUser.name}
                  onChange={(e) => setNewUser((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Select
                  value={newUser.role}
                  onValueChange={(value) => setNewUser((prev) => ({ ...prev, role: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddUser}>Add User</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Users</CardTitle>
          <CardDescription>Manage user accounts, roles, and permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getRoleBadgeColor(user.role)}>{user.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.status === "Active" ? "default" : "secondary"}>{user.status}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{user.lastLogin}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditUser(user)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => toggleUserStatus(user.id)}>
                        {user.status === "Active" ? "Deactivate" : "Activate"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update user information and role assignment</DialogDescription>
          </DialogHeader>
          {editingUser && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Full Name</Label>
                <Input
                  id="edit-name"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser((prev) => (prev ? { ...prev, name: e.target.value } : null))}
                />
              </div>
              <div>
                <Label htmlFor="edit-email">Email Address</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser((prev) => (prev ? { ...prev, email: e.target.value } : null))}
                />
              </div>
              <div>
                <Label htmlFor="edit-role">Role</Label>
                <Select
                  value={editingUser.role}
                  onValueChange={(value) => {
                    const roleData = roles.find((r) => r.value === value)
                    setEditingUser((prev) =>
                      prev
                        ? {
                            ...prev,
                            role: value,
                            permissions: roleData?.permissions || [],
                          }
                        : null,
                    )
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setEditingUser(null)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateUser}>Update User</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { UserPlus, Edit, Trash2, Key, ArrowLeft } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

interface User {
  id: string;
  username: string;
}

export default function Users() {
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");

  const [editUsername, setEditUsername] = useState("");
  
  const [changePassword, setChangePassword] = useState("");
  const [changePasswordConfirm, setChangePasswordConfirm] = useState("");

  const { data: users = [], isLoading } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });

  const createUserMutation = useMutation({
    mutationFn: async (data: { username: string; password: string }) => {
      const res = await apiRequest("POST", "/api/users", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      setCreateDialogOpen(false);
      setNewUsername("");
      setNewPassword("");
      setNewPasswordConfirm("");
      toast({
        title: "Success",
        description: "User created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create user",
      });
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: async ({ id, username }: { id: string; username: string }) => {
      const res = await apiRequest("PATCH", `/api/users/${id}`, { username });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      setEditDialogOpen(false);
      setSelectedUser(null);
      setEditUsername("");
      toast({
        title: "Success",
        description: "User updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update user",
      });
    },
  });

  const updatePasswordMutation = useMutation({
    mutationFn: async ({ id, password, confirmPassword }: { id: string; password: string; confirmPassword: string }) => {
      const res = await apiRequest("PATCH", `/api/users/${id}/password`, { password, confirmPassword });
      return res.json();
    },
    onSuccess: () => {
      setPasswordDialogOpen(false);
      setSelectedUser(null);
      setChangePassword("");
      setChangePasswordConfirm("");
      toast({
        title: "Success",
        description: "Password changed successfully",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to change password",
      });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest("DELETE", `/api/users/${id}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete user",
      });
    },
  });

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== newPasswordConfirm) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Passwords don't match",
      });
      return;
    }
    createUserMutation.mutate({ username: newUsername, password: newPassword });
  };

  const handleEditUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUser) {
      updateUserMutation.mutate({ id: selectedUser.id, username: editUsername });
    }
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (changePassword !== changePasswordConfirm) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Passwords don't match",
      });
      return;
    }
    if (selectedUser) {
      updatePasswordMutation.mutate({
        id: selectedUser.id,
        password: changePassword,
        confirmPassword: changePasswordConfirm,
      });
    }
  };

  const openEditDialog = (user: User) => {
    setSelectedUser(user);
    setEditUsername(user.username);
    setEditDialogOpen(true);
  };

  const openPasswordDialog = (user: User) => {
    setSelectedUser(user);
    setChangePassword("");
    setChangePasswordConfirm("");
    setPasswordDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>

      <div className="container mx-auto p-6 max-w-6xl">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/")}
            data-testid="button-back"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">User Management</h1>
            <p className="text-muted-foreground">Manage application users</p>
          </div>

          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-create-user">
                <UserPlus className="mr-2 h-4 w-4" />
                Create User
              </Button>
            </DialogTrigger>
            <DialogContent data-testid="dialog-create-user">
              <DialogHeader>
                <DialogTitle>Create New User</DialogTitle>
                <DialogDescription>
                  Add a new user to the system
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateUser}>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-username">Username</Label>
                    <Input
                      id="new-username"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      placeholder="Enter username"
                      required
                      minLength={3}
                      data-testid="input-new-username"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter password"
                      required
                      minLength={6}
                      data-testid="input-new-password"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password-confirm">Confirm Password</Label>
                    <Input
                      id="new-password-confirm"
                      type="password"
                      value={newPasswordConfirm}
                      onChange={(e) => setNewPasswordConfirm(e.target.value)}
                      placeholder="Confirm password"
                      required
                      minLength={6}
                      data-testid="input-new-password-confirm"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="submit"
                    disabled={createUserMutation.isPending}
                    data-testid="button-submit-create-user"
                  >
                    {createUserMutation.isPending ? "Creating..." : "Create User"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Username</TableHead>
              <TableHead>User ID</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} data-testid={`row-user-${user.id}`}>
                <TableCell className="font-medium" data-testid={`text-username-${user.id}`}>
                  {user.username}
                </TableCell>
                <TableCell className="text-muted-foreground">{user.id}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Dialog open={editDialogOpen && selectedUser?.id === user.id} onOpenChange={(open) => {
                      setEditDialogOpen(open);
                      if (!open) setSelectedUser(null);
                    }}>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(user)}
                          data-testid={`button-edit-user-${user.id}`}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent data-testid="dialog-edit-user">
                        <DialogHeader>
                          <DialogTitle>Edit User</DialogTitle>
                          <DialogDescription>
                            Update user information
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleEditUser}>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label htmlFor="edit-username">Username</Label>
                              <Input
                                id="edit-username"
                                value={editUsername}
                                onChange={(e) => setEditUsername(e.target.value)}
                                placeholder="Enter username"
                                required
                                minLength={3}
                                data-testid="input-edit-username"
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button
                              type="submit"
                              disabled={updateUserMutation.isPending}
                              data-testid="button-submit-edit-user"
                            >
                              {updateUserMutation.isPending ? "Updating..." : "Update User"}
                            </Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>

                    <Dialog open={passwordDialogOpen && selectedUser?.id === user.id} onOpenChange={(open) => {
                      setPasswordDialogOpen(open);
                      if (!open) setSelectedUser(null);
                    }}>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openPasswordDialog(user)}
                          data-testid={`button-change-password-${user.id}`}
                        >
                          <Key className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent data-testid="dialog-change-password">
                        <DialogHeader>
                          <DialogTitle>Change Password</DialogTitle>
                          <DialogDescription>
                            Set a new password for {user.username}
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleChangePassword}>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label htmlFor="change-password">New Password</Label>
                              <Input
                                id="change-password"
                                type="password"
                                value={changePassword}
                                onChange={(e) => setChangePassword(e.target.value)}
                                placeholder="Enter new password"
                                required
                                minLength={6}
                                data-testid="input-change-password"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="change-password-confirm">Confirm Password</Label>
                              <Input
                                id="change-password-confirm"
                                type="password"
                                value={changePasswordConfirm}
                                onChange={(e) => setChangePasswordConfirm(e.target.value)}
                                placeholder="Confirm new password"
                                required
                                minLength={6}
                                data-testid="input-change-password-confirm"
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button
                              type="submit"
                              disabled={updatePasswordMutation.isPending}
                              data-testid="button-submit-change-password"
                            >
                              {updatePasswordMutation.isPending ? "Changing..." : "Change Password"}
                            </Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={currentUser?.id === user.id}
                          data-testid={`button-delete-user-${user.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent data-testid="dialog-delete-user">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete User</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete user "{user.username}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel data-testid="button-cancel-delete">Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteUserMutation.mutate(user.id)}
                            data-testid="button-confirm-delete"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </div>

        {users.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No users found</p>
          </div>
        )}
      </div>
    </div>
  );
}

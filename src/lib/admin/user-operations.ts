import { usersAPI, User, CreateUserData, UpdateUserData } from "@/lib/api/users";
import { useToast } from "@/components/ui/toast";

export const useUserOperations = () => {
  const { toast } = useToast();

  const addUser = async (formData: any, onSuccess: () => void) => {
    try {
      // Validate password match
      if (formData.password !== formData.confirmPassword) {
        toast({
          title: "Error",
          description: "Passwords do not match",
          variant: "destructive",
        });
        return;
      }
      
      // Validate password strength
      if (formData.password.length < 6) {
        toast({
          title: "Error",
          description: "Password must be at least 6 characters long",
          variant: "destructive",
        });
        return;
      }
      
      const createUserData: CreateUserData = {
        email: formData.email,
        username: formData.name,
        role: "USER",
        status: formData.status,
        password: formData.password,
      };
      
      await usersAPI.createUser(createUserData);
      
      toast({
        title: "Success",
        description: "User added successfully",
      });
      
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add user",
        variant: "destructive",
      });
    }
  };

  const editUser = async (userId: string, formData: any, onSuccess: () => void) => {
    try {
      // Validate password if provided
      if (formData.password) {
        if (formData.password !== formData.confirmPassword) {
          toast({
            title: "Error",
            description: "Passwords do not match",
            variant: "destructive",
          });
          return;
        }
        
        if (formData.password.length < 6) {
          toast({
            title: "Error",
            description: "Password must be at least 6 characters long",
            variant: "destructive",
          });
          return;
        }
      }
      
      const updateUserData: UpdateUserData = {
        email: formData.email,
        username: formData.name,
        status: formData.status,
        ...(formData.password && { password: formData.password }),
      };
      
      await usersAPI.updateUser(userId, updateUserData);
      
      toast({
        title: "Success",
        description: "User updated successfully",
      });
      
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update user",
        variant: "destructive",
      });
    }
  };

  const deleteUser = async (userId: string, onSuccess: () => void) => {
    try {
      await usersAPI.deleteUser(userId);
      
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
      
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete user",
        variant: "destructive",
      });
    }
  };

  const approveUser = async (user: User, onSuccess: () => void) => {
    try {
      await usersAPI.updateUser(user.id, { status: "ACTIVE" });
      
      toast({
        title: "Success",
        description: "User approved successfully",
      });
      
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to approve user",
        variant: "destructive",
      });
    }
  };

  const disableUser = async (user: User, onSuccess: () => void) => {
    try {
      await usersAPI.updateUser(user.id, { status: "DISABLED" });
      
      toast({
        title: "Success",
        description: "User disabled successfully",
      });
      
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to disable user",
        variant: "destructive",
      });
    }
  };

  return {
    addUser,
    editUser,
    deleteUser,
    approveUser,
    disableUser,
  };
};

import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface InvitationDetails {
  isValid: boolean;
  projectId?: string;
  projectName?: string;
  clientEmail?: string;
  projectDetails?: {
    description: string;
    deadline: string;
    status: string;
  };
}

const AcceptInvitation = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const { toast } = useToast();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Verify invitation token
  const { data: invitation, isLoading, isError } = useQuery<InvitationDetails>({
    queryKey: ["invitationDetails", token],
    queryFn: async () => {
      try {
        const response = await fetch(`/api/invitations/verify/${token}`);
        if (!response.ok) throw new Error("Invalid invitation");
        return response.json();
      } catch (error) {
        console.error("Error verifying invitation:", error);
        throw error;
      }
    },
    enabled: !!token,
  });

  // Accept invitation mutation
  const acceptInvitationMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      try {
        const response = await fetch(`/api/invitations/accept/${token}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        });
        if (!response.ok) throw new Error("Failed to accept invitation");
        return response.json();
      } catch (error) {
        console.error("Error accepting invitation:", error);
        throw error;
      }
    },
    onSuccess: async (data) => {
      toast({
        title: "Invitation Accepted",
        description: "You have successfully joined the project.",
      });
      
      // Login with the provided credentials
      try {
        await login(credentials.email, credentials.password);
        navigate("/projects");
      } catch (error) {
        console.error("Error logging in:", error);
        toast({
          title: "Login Failed",
          description: "Please try logging in manually.",
          variant: "destructive",
        });
        navigate("/auth");
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to accept invitation. Please check your credentials.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (invitation?.clientEmail) {
      setCredentials(prev => ({ ...prev, email: invitation.clientEmail }));
    }
  }, [invitation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    
    try {
      await acceptInvitationMutation.mutateAsync(credentials);
    } finally {
      setIsAuthenticating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container py-8">
        <Card>
          <CardContent className="p-6">
            Verifying invitation...
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError || !invitation?.isValid) {
    return (
      <div className="container py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-red-500">Invalid Invitation</CardTitle>
            <CardDescription>
              This invitation link is invalid or has expired.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <Card>
        <CardHeader>
          <CardTitle>Project Invitation</CardTitle>
          <CardDescription>
            You've been invited to join: {invitation.projectName}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {invitation.projectDetails && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Project Details:</h3>
              <p className="text-sm text-muted-foreground">
                {invitation.projectDetails.description}
              </p>
              <p className="text-sm">
                <span className="font-medium">Status:</span> {invitation.projectDetails.status}
              </p>
              <p className="text-sm">
                <span className="font-medium">Deadline:</span> {new Date(invitation.projectDetails.deadline || "").toLocaleDateString()}
              </p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={credentials.email}
                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                required
                readOnly={!!invitation.clientEmail}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                required
                placeholder="Enter the password from your invitation email"
              />
              <p className="text-xs text-muted-foreground">
                Please enter the password that was sent to you in the invitation email.
              </p>
            </div>
            <Button 
              type="submit" 
              className="w-full"
              disabled={isAuthenticating || acceptInvitationMutation.isPending}
            >
              {isAuthenticating || acceptInvitationMutation.isPending ? "Processing..." : "Accept Invitation"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AcceptInvitation;
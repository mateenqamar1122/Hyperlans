
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { updateUserProfile, getCurrentUserProfile } from "@/services/teamService";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import ImageUpload from "@/components/ImageUpload";

const Profile = () => {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const loadProfile = async () => {
      if (user) {
        setEmail(user.email || "");
        setDisplayName(user.user_metadata?.name || "");
        setAvatarUrl(user.user_metadata?.avatar_url || "");
        
        const profile = await getCurrentUserProfile();
        if (profile) {
          setDisplayName(profile.display_name || displayName);
          setAvatarUrl(profile.avatar_url || avatarUrl);
        }
      }
    };
    
    loadProfile();
  }, [user]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await updateUserProfile({
        display_name: displayName,
        avatar_url: avatarUrl
      });
      
      // Also update the user metadata in auth
      const { error } = await supabase.auth.updateUser({
        data: { name: displayName, avatar_url: avatarUrl }
      });
      
      if (error) throw error;
      
      toast.success("Profile updated successfully");
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error(error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUploaded = (url: string) => {
    setAvatarUrl(url);
  };
  
  const initials = displayName
    ? displayName.substring(0, 2).toUpperCase()
    : email
      ? email.substring(0, 2).toUpperCase()
      : "U";
  
  return (
    <div className="container max-w-3xl py-10">
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
      
      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Update your personal details and how others see you on the platform
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
              <div className="flex flex-col items-center gap-2">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={avatarUrl} alt={displayName} />
                  <AvatarFallback className="text-xl">{initials}</AvatarFallback>
                </Avatar>
                <ImageUpload 
                  onImageUploaded={handleAvatarUploaded}
                  bucket="avatars"
                  title="Upload Profile Picture"
                  description="Choose a profile picture to represent you"
                  aspectRatio="1/1"
                  buttonVariant="outline"
                  buttonText="Change Avatar"
                  maxSizeMB={2}
                />
              </div>
              
              <div className="space-y-4 flex-1">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Your name"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email"
                    type="email"
                    value={email}
                    readOnly
                    disabled
                  />
                  <p className="text-sm text-muted-foreground">
                    To change your email, please go to account settings
                  </p>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="avatar-url">Avatar URL</Label>
                  <Input 
                    id="avatar-url"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="https://example.com/your-avatar.jpg"
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2 border-t px-6 py-4">
            <Button type="button" variant="outline">Cancel</Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Profile;

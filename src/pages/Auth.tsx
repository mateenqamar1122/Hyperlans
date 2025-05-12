import { useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import {
  Mail,
  Lock,
  User as UserIcon,
  Sparkles,
  CheckCircle,
  Briefcase,
  Shield,
} from "lucide-react";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };

    fetchUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
        },
      });

      if (error) throw error;
      toast.success("Account created successfully! Check your email.");
    } catch (error: any) {
      toast.error(error.message || "Sign-up failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast.success("Logged in successfully!");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin + "/dashboard",
        },
      });

      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || "Google sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGithubSignIn = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: window.location.origin + "/dashboard",
        },
      });

      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || "GitHub sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  const handleMicrosoftSignIn = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "azure",
        options: {
          redirectTo: window.location.origin + "/dashboard",
        },
      });

      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || "Microsoft sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (

    
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-background via-background/95 to-primary/5 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-primary/5 to-transparent"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-[0.02]"></div>
        
        {/* Animated gradient orbs */}
        <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-gradient-to-br from-brand-cyan/20 to-brand-blue/20 blur-3xl animate-float opacity-60"></div>
        <div className="absolute bottom-1/3 left-1/3 w-80 h-80 rounded-full bg-gradient-to-br from-brand-blue/10 to-brand-magenta/10 blur-3xl animate-float-delay opacity-40"></div>
      </div>
      <div className="flex items-center justify-center p-8 md:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center flex flex-col items-center">
            <div className="flex items-center justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-brand-cyan to-brand-blue p-[2px] shadow-lg">
                <div className="h-full w-full rounded-full bg-background flex items-center justify-center">
                  <img src="/logo.png" alt="FreelanceFlow Logo" className="h-10 w-10" />
                </div>
              </div>
            </div>
            <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-brand-cyan to-brand-blue">
              SPIKELANCE
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage your freelance career with ease
            </p>
          </div>

          <Card className="w-full shadow-lg border border-border/50 bg-background/95 backdrop-blur-sm hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleSignIn}>
                  <CardHeader>
                    <CardTitle>Welcome back</CardTitle>
                    <CardDescription>
                      Enter your credentials to access your account
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="login-email"
                          type="email"
                          placeholder="name@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10 border-input/50 focus:border-primary/50 transition-all duration-300 shadow-sm"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="login-password">Password</Label>
                        <a href="#" className="text-xs text-primary hover:underline">
                          Forgot password?
                        </a>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="login-password"
                          type="password"
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10 border-input/50 focus:border-primary/50 transition-all duration-300 shadow-sm"
                          required
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <Button 
                        type="submit" 
                        className="w-full font-semibold relative overflow-hidden bg-gradient-to-r from-brand-cyan to-brand-blue hover:from-brand-blue hover:to-brand-cyan text-white shadow-lg hover:shadow-brand-blue/25 transition-all duration-300" 
                        disabled={loading}
                      >
                        {loading ? (
                          <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
                        ) : (
                          "Sign in"
                        )}
                      </Button>
                    </div>

                    <div className="relative my-4">
                      <div className="absolute inset-0 flex items-center">
                        <Separator />
                      </div>
                      <div className="relative flex justify-center">
                        <span className="bg-card px-2 text-xs text-muted-foreground">
                          OR CONTINUE WITH
                        </span>
                      </div>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleGoogleSignIn}
                      disabled={loading}
                      className="w-full hover:border-brand-blue/50 hover:bg-brand-blue/5 transition-all duration-300 shadow-sm"
                    >
                      <img
                        src="/companies_logo/google.svg"
                        alt="Google"
                        className="h-4 w-4 mr-2"
                      />
                      Google
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleGithubSignIn}
                      disabled={loading}
                      className="w-full hover:border-brand-blue/50 hover:bg-brand-blue/5 transition-all duration-300 shadow-sm"
                    >
                      <img
                        src="/companies_logo/github.svg"
                        alt="GitHub"
                        className="h-4 w-4 mr-2"
                      />
                      GitHub
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleMicrosoftSignIn}
                      disabled={loading}
                      className="w-full hover:border-brand-blue/50 hover:bg-brand-blue/5 transition-all duration-300 shadow-sm"
                    >
                      <img
                        src="/companies_logo/microsoft.svg"
                        alt="Microsoft"
                        className="h-4 w-4 mr-2"
                      />
                      Microsoft
                    </Button>
                  </CardContent>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleSignUp}>
                  <CardHeader>
                    <CardTitle>Create an account</CardTitle>
                    <CardDescription>
                      Enter your information to get started
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-name">Full Name</Label>
                      <div className="relative">
                        <UserIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="register-name"
                          type="text"
                          placeholder="John Doe"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="pl-10 border-input/50 focus:border-primary/50 transition-all duration-300 shadow-sm"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="register-email"
                          type="email"
                          placeholder="name@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10 border-input/50 focus:border-primary/50 transition-all duration-300 shadow-sm"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="register-password"
                          type="password"
                          placeholder="Create a strong password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10 border-input/50 focus:border-primary/50 transition-all duration-300 shadow-sm"
                          required
                          minLength={8}
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <Button 
                        type="submit" 
                        className="w-full font-semibold relative overflow-hidden bg-gradient-to-r from-brand-cyan to-brand-blue hover:from-brand-blue hover:to-brand-cyan text-white shadow-lg hover:shadow-brand-blue/25 transition-all duration-300" 
                        disabled={loading}
                      >
                        {loading ? (
                          <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
                        ) : (
                          "Create Account"
                        )}
                      </Button>
                    </div>

                    <div className="relative my-4">
                      <div className="absolute inset-0 flex items-center">
                        <Separator />
                      </div>
                      <div className="relative flex justify-center">
                        <span className="bg-card px-2 text-xs text-muted-foreground">
                          OR CONTINUE WITH
                        </span>
                      </div>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleGoogleSignIn}
                      disabled={loading}
                      className="w-full hover:border-brand-blue/50 hover:bg-brand-blue/5 transition-all duration-300 shadow-sm"
                    >
                      <img
                        src="/companies_logo/google.svg"
                        alt="Google"
                        className="h-4 w-4 mr-2"
                      />
                      Google
                    </Button>
                  </CardContent>

                  <CardFooter className="flex flex-col space-y-4 border-t px-6 py-4">
                    <p className="text-xs text-muted-foreground text-center">
                      By creating an account, you agree to our Terms of Service and Privacy Policy
                    </p>
                  </CardFooter>
                </form>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Auth;

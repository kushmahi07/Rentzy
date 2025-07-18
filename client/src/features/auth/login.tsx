import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { loginSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Mail, Lock, Shield, Eye, EyeOff, Sparkles, ArrowRight } from "lucide-react";
import { useLocation } from "wouter";
import rentziLogo from "@assets/Rentzi logo 2_1751542644537.png";

interface LoginResponse {
  success: boolean;
  message: string;
  sessionId?: number;
  expiresAt?: string;
  emailSent?: boolean;
  smsSent?: boolean;
  otp?: string; // OTP code for development/testing
}

export default function Login() {
  const [, navigate] = useLocation();
  const [error, setError] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }
      
      return response.json() as Promise<LoginResponse>;
    },
    onSuccess: (data) => {
      console.log('Login response:', data);
      if (data.success && data.sessionId) {
        localStorage.setItem('otpSession', JSON.stringify({
          sessionId: data.sessionId,
          expiresAt: data.expiresAt,
          email: form.getValues('email')
        }));
        
        // Display OTP information in console for testing
        console.log('🔐 OTP SENT SUCCESSFULLY!');
        console.log('📧 Email:', form.getValues('email'));
        console.log('📱 Check your email and SMS for the OTP code');
        console.log('⏰ OTP expires at:', new Date(data.expiresAt || '').toLocaleString());
        
        // Show OTP code in development mode
        if (data.otp) {
          console.log('🔢 OTP CODE FOR TESTING:', data.otp);
          console.log('⚠️  This OTP is only shown in development mode');
        } else {
          console.log('🎯 For testing: Check the backend logs above for the actual OTP code');
        }
        
        console.log('Navigating to OTP verification...');
        navigate('/verify-otp');
      } else {
        setError(data.message || "Login failed");
      }
    },
    onError: (error: any) => {
      setError(error.message || "An error occurred during login");
    },
  });

  const onSubmit = (data: { email: string; password: string }) => {
    setError("");
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Clean white background */}
      
      <div className="relative flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          {/* Logo/Brand Section */}
          <div className="text-center mb-10">
            <div className="mx-auto relative mb-8 bg-gradient-to-b from-white to-gray-50/30 rounded-2xl p-4">
              <img 
                src={rentziLogo} 
                alt="Rentzi Logo" 
                className="w-32 h-auto mx-auto sm:w-36 md:w-40 drop-shadow-lg filter brightness-105"
              />
            </div>
            <p className="text-xl text-black font-medium mb-6">Admin Portal</p>
            <div className="flex items-center justify-center space-x-2 text-[#004182]">
              <div className="w-2 h-2 bg-[#004182] rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">2FA Protected System</span>
            </div>
          </div>

          {/* Main Login Card */}
          <Card className="w-full bg-white border-gray-200 shadow-lg">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold text-black">Welcome Back</CardTitle>
              <CardDescription className="text-gray-600">
                Enter your credentials to access the admin dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-700">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-black font-medium">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      className="pl-10 border-gray-300 focus:border-[#004182] focus:ring-[#004182] text-black"
                      {...form.register("email")}
                    />
                  </div>
                  {form.formState.errors.email && (
                    <p className="text-sm text-red-600">{form.formState.errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-black font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="pl-10 pr-10 border-gray-300 focus:border-[#004182] focus:ring-[#004182] text-black"
                      {...form.register("password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {form.formState.errors.password && (
                    <p className="text-sm text-red-600">{form.formState.errors.password.message}</p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-[#004182] hover:bg-[#003366] text-white font-medium py-3 transition-colors"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>

              {/* Demo Credentials */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="text-center mb-4">
                  <p className="text-sm text-gray-600 font-medium">Demo Credentials</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Email:</span>
                    <code className="text-sm bg-white px-2 py-1 rounded text-[#004182] font-mono">
                      admin@rentzy.com
                    </code>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Password:</span>
                    <code className="text-sm bg-white px-2 py-1 rounded text-[#004182] font-mono">
                      admin123
                    </code>
                  </div>
                </div>
              </div>

              {/* Features Info */}
              <div className="mt-6 text-center">
                <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Shield className="h-3 w-3" />
                    <span>2FA Secured</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Sparkles className="h-3 w-3" />
                    <span>Enterprise Grade</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
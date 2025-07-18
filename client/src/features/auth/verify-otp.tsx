import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { otpVerificationSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Loader2,
  Shield,
  RefreshCw,
  Clock,
  Mail,
  Smartphone,
  CheckCircle,
} from "lucide-react";
import { useLocation } from "wouter";
import rentziLogo from "@assets/Rentzi logo 2_1751542644537.png";

interface VerifyOtpResponse {
  success: boolean;
  message: string;
  user?: {
    id: number;
    email: string;
    role: string;
  };
}

interface ResendOtpResponse {
  success: boolean;
  message: string;
  expiresAt?: string;
  resendCount?: number;
  emailSent?: boolean;
  smsSent?: boolean;
}

export default function VerifyOtp() {
  const [, navigate] = useLocation();
  const [error, setError] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState<number>(120); // 2 minutes in seconds
  const [canResend, setCanResend] = useState<boolean>(false);
  const [resendCooldown, setResendCooldown] = useState<number>(30);
  const [sessionData, setSessionData] = useState<{
    sessionId: string;
    expiresAt: string;
    email: string;
  } | null>(null);

  useEffect(() => {
    // Get session data from localStorage
    const storedSession = localStorage.getItem("otpSession");
    // console.log('OTP session data:', storedSession);

    if (!storedSession) {
      console.log("No session data found, redirecting to login");
      navigate("/login");
      return;
    }

    try {
      const sessionInfo = JSON.parse(storedSession);
      setSessionData(sessionInfo);

      // Calculate initial time left
      if (sessionInfo.expiresAt) {
        const expiry = new Date(sessionInfo.expiresAt);
        const now = new Date();
        const remaining = Math.max(
          0,
          Math.floor((expiry.getTime() - now.getTime()) / 1000),
        );
        setTimeLeft(remaining);
        console.log("Time remaining:", remaining, "seconds");
      }
    } catch (error) {
      console.error("Error parsing session data:", error);
      navigate("/login");
    }
  }, [navigate]);

  // Timer countdown effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setError("OTP has expired. Please login again.");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Resend cooldown effect
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const form = useForm<{ otp: string; sessionId: string }>({
    resolver: zodResolver(otpVerificationSchema),
    defaultValues: {
      otp: "",
      sessionId: "",
    },
    mode: "onSubmit",
  });

  // Update form when sessionData is loaded
  useEffect(() => {
    if (sessionData?.sessionId) {
      form.setValue("sessionId", sessionData.sessionId);
      console.log("Session ID set in form:", sessionData.sessionId);
    }
  }, [sessionData, form]);

  const verifyMutation = useMutation({
    mutationFn: async (data: { otp: string; sessionId: string }) => {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "OTP verification failed");
      }

      return response.json() as Promise<VerifyOtpResponse>;
    },
    onSuccess: (data) => {
      console.log("OTP verification response:", data);
      if (data.success) {
        // Store user data and clear OTP session
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
        }
        localStorage.removeItem("otpSession");
        console.log("OTP verified successfully, navigating to dashboard");
        // Use setTimeout to ensure state updates are complete before navigation
        setTimeout(() => {
          navigate("/dashboard");
        }, 100);
      } else {
        setError(data.message || "OTP verification failed");
      }
    },
    onError: (error: any) => {
      console.error("OTP verification error:", error);
      setError(error.message || "An error occurred during verification");
    },
  });

  const resendMutation = useMutation({
    mutationFn: async () => {
      if (!sessionData) {
        throw new Error("No session data available");
      }

      const response = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sessionId: sessionData.sessionId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to resend OTP");
      }

      return response.json() as Promise<ResendOtpResponse>;
    },
    onSuccess: (data) => {
      if (data.success) {
        setError("");
        setCanResend(false);
        setResendCooldown(30);

        // Update timer with new expiry
        if (data.expiresAt) {
          const expiry = new Date(data.expiresAt);
          const now = new Date();
          const remaining = Math.max(
            0,
            Math.floor((expiry.getTime() - now.getTime()) / 1000),
          );
          setTimeLeft(remaining);

          // Update localStorage with new expiry
          if (sessionData) {
            const updatedSession = {
              ...sessionData,
              expiresAt: data.expiresAt,
            };
            localStorage.setItem("otpSession", JSON.stringify(updatedSession));
            setSessionData(updatedSession);
          }
        }

        setError("");
      } else {
        setError(data.message || "Failed to resend OTP");
      }
    },
    onError: (error: any) => {
      setError(error.message || "Failed to resend OTP");
    },
  });

  const onSubmit = (data: { otp: string; sessionId: string }) => {
    console.log("Form submitted:", {
      otp: data.otp ? '***' : 'missing',
      sessionId: data.sessionId || 'missing',
      sessionData: sessionData?.sessionId || 'missing'
    });
    
    if (timeLeft <= 0) {
      setError("OTP has expired. Please login again.");
      return;
    }
    
    if (!sessionData?.sessionId && !data.sessionId) {
      setError("Session data not found. Please login again.");
      return;
    }
    
    setError("");
    const submitData = {
      otp: data.otp,
      sessionId: data.sessionId || sessionData.sessionId,
    };
    
    console.log("Submitting to API:", {
      otp: submitData.otp ? '***' : 'missing',
      sessionId: submitData.sessionId || 'missing'
    });
    
    verifyMutation.mutate(submitData);
  };
  

  const handleResend = () => {
    if (canResend && !resendMutation.isPending) {
      resendMutation.mutate();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = timeLeft > 0 ? (timeLeft / 120) * 100 : 0;

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Logo/Brand Section */}
        <div className="text-center mb-10">
          <div className="mx-auto mb-8 bg-gradient-to-b from-white to-gray-50/30 rounded-2xl p-4">
            <img
              src={rentziLogo}
              alt="Rentzi Logo"
              className="w-32 h-auto mx-auto sm:w-36 md:w-40 drop-shadow-lg filter brightness-105"
            />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-black mb-3">
            Verification Required
          </h1>
          <p className="text-sm sm:text-base text-black">
            Enter the 6-digit code sent to your devices
          </p>
        </div>

        <Card className="shadow-lg border border-gray-200 bg-white">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold text-center text-black flex items-center justify-center gap-2">
              <CheckCircle className="h-6 w-6 text-[#004182]" />
              Two-Factor Authentication
            </CardTitle>
            <CardDescription className="text-center text-black">
              We've sent a verification code to {sessionData?.email}
            </CardDescription>
          </CardHeader>

          <CardContent className="px-6 pb-6">
            {/* Delivery Status */}
            <div className="mb-6 grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
                <Mail className="h-4 w-4 text-green-600" />
                <span className="text-xs font-medium text-green-800">
                  Email Sent
                </span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <Smartphone className="h-4 w-4 text-blue-600" />
                <span className="text-xs font-medium text-blue-800">
                  SMS Sent
                </span>
              </div>
            </div>

            {/* Timer Section */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-black" />
                  <span className="text-sm font-medium text-black">
                    Time Remaining
                  </span>
                </div>
                <span
                  className={`text-lg font-bold ${timeLeft <= 30 ? "text-red-600" : "text-black"}`}
                >
                  {formatTime(timeLeft)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-1000 ${
                    timeLeft <= 30
                      ? "bg-red-500"
                      : timeLeft <= 60
                        ? "bg-yellow-500"
                        : "bg-[#004182]"
                  }`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {error && (
                <Alert
                  variant={error.includes("sent") ? "default" : "destructive"}
                  className={
                    error.includes("sent")
                      ? "bg-green-50 border-green-200"
                      : "bg-red-50 border-red-200"
                  }
                >
                  <AlertDescription
                    className={
                      error.includes("sent") ? "text-green-800" : "text-red-800"
                    }
                  >
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {/* Hidden sessionId field */}
              <input
                type="hidden"
                {...form.register("sessionId")}
              />

              <div className="space-y-2">
                <Label htmlFor="otp" className="text-sm font-medium text-black">
                  Verification Code
                </Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="000000"
                  maxLength={6}
                  className="text-center text-2xl font-mono h-14 tracking-widest border-gray-300 text-black focus:border-[#004182] focus:ring-[#004182]/20"
                  {...form.register("otp", {
                    onChange: (e) => {
                      console.log("OTP input changed:", {
                        value: e.target.value,
                        length: e.target.value.length,
                        timeLeft,
                        isPending: verifyMutation.isPending,
                      });
                    },
                  })}
                  autoComplete="one-time-code"
                />
                {form.formState.errors.otp && (
                  <p className="text-sm text-red-600">
                    {form.formState.errors.otp.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={
                  verifyMutation.isPending ||
                  timeLeft <= 0 ||
                  form.watch("otp")?.trim().length !== 6
                }
                className="w-full h-11 bg-[#004182] hover:bg-[#003366] text-white font-medium shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {verifyMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Verify Code
                  </>
                )}
              </Button>

              <div className="text-center pt-2">
                <p className="text-sm text-black mb-3">
                  Didn't receive the code?
                </p>
                <Button
                  type="button"
                  variant="outline"
                  disabled={!canResend || resendMutation.isPending}
                  onClick={handleResend}
                  className="w-full border-gray-300 text-black hover:bg-gray-50"
                >
                  {resendMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : canResend ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Resend Code
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Resend in {resendCooldown}s
                    </>
                  )}
                </Button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <Button
                variant="ghost"
                onClick={() => navigate("/login")}
                className="text-sm text-black hover:text-[#004182]"
              >
                Back to Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

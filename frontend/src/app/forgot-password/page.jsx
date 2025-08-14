'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import axios from '@/utils/axios';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [resetUrl, setResetUrl] = useState('');
  const [showResetUrl, setShowResetUrl] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post('/auth/forgot-password', { email });
      
      if (response.data.success) {
        setIsSuccess(true);
        
        // Check if reset URL is provided (development mode)
        if (response.data.data && response.data.data.resetUrl) {
          setResetUrl(response.data.data.resetUrl);
          setShowResetUrl(true);
          toast({
            title: "Success",
            description: "Password reset link generated! Check below for the reset URL.",
          });
        } else {
          toast({
            title: "Success",
            description: "Password reset email sent successfully!",
          });
        }
      } else {
        setError(response.data.message || 'Something went wrong');
        toast({
          title: "Error",
          description: response.data.message || 'Failed to send reset email',
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error('Request error:', err);
      
      if (err.response) {
        // Server responded with error status
        const errorMessage = err.response.data?.message || 'Something went wrong';
        setError(errorMessage);
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      } else if (err.request) {
        // Network error
        setError('Network error. Please check your connection and try again.');
        toast({
          title: "Error",
          description: 'Network error. Please check your connection and try again.',
          variant: "destructive",
        });
      } else {
        // Other error
        setError('An unexpected error occurred. Please try again.');
        toast({
          title: "Error",
          description: 'An unexpected error occurred. Please try again.',
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="mt-4">
                {showResetUrl ? 'Password Reset Link Generated' : 'Check Your Email'}
              </CardTitle>
              <CardDescription>
                {showResetUrl 
                  ? 'Your password reset link has been generated successfully.'
                  : `We've sent a password reset link to ${email}`
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {showResetUrl ? (
                <>
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Since email is not configured, here's your password reset link. Copy and paste it in your browser:
                    </AlertDescription>
                  </Alert>
                  <div className="bg-gray-100 p-3 rounded-md">
                    <p className="text-sm text-gray-600 mb-2">Reset Link:</p>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={resetUrl}
                        readOnly
                        className="flex-1 text-xs p-2 border rounded bg-white"
                      />
                      <Button
                        onClick={() => {
                          navigator.clipboard.writeText(resetUrl);
                          toast({
                            title: "Copied!",
                            description: "Reset link copied to clipboard",
                          });
                        }}
                        size="sm"
                        variant="outline"
                      >
                        Copy
                      </Button>
                    </div>
                  </div>
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      This link will expire in 10 minutes for security reasons.
                    </AlertDescription>
                  </Alert>
                </>
              ) : (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    If you don't see the email, check your spam folder. The reset link will expire in 10 minutes.
                  </AlertDescription>
                </Alert>
              )}
              <div className="flex flex-col space-y-2">
                <Button
                  onClick={() => {
                    setIsSuccess(false);
                    setShowResetUrl(false);
                    setResetUrl('');
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Try another email
                </Button>
                <Button
                  onClick={() => router.push('/login')}
                  className="w-full"
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link href="/login" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Login
          </Link>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Forgot your password?
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Mail className="mr-2 h-5 w-5" />
              Reset Password
            </CardTitle>
            <CardDescription>
              Enter your email address below
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || !email}
              >
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Remember your password?{' '}
                <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

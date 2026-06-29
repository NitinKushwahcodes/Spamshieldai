"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { useAuth } from '../../../hooks/useAuth';
import { ShieldCheck, Loader2 } from 'lucide-react';

const loginSchema = zod.object({
  email: zod.string().min(1, 'Email is required').email('Invalid email address'),
  password: zod.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = zod.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    }
  });

  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null);
    try {
      await login(values);
    } catch (err: any) {
      setServerError(err.message || 'Incorrect email or password');
    }
  };

  return (
    <div>
      <div className="text-center mb-8">
        <div className="flex justify-center mb-3 md:hidden">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white">
            <ShieldCheck size={22} />
          </div>
        </div>
        <h1 className="text-2xl font-extrabold text-text-primary tracking-tight">
          Welcome Back
        </h1>
        <p className="text-text-secondary text-sm font-light mt-1.5">
          Sign in to access your scam response cases.
        </p>
      </div>

      {serverError && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
            Email Address
          </label>
          <input
            type="email"
            placeholder="name@example.com"
            {...formRegister('email')}
            className={`w-full px-4 py-3 rounded-xl bg-surface-elevated border text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-primary/50 transition-colors ${
              errors.email ? 'border-red-500/50' : 'border-border'
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1.5">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
            Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            {...formRegister('password')}
            className={`w-full px-4 py-3 rounded-xl bg-surface-elevated border text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-primary/50 transition-colors ${
              errors.password ? 'border-red-500/50' : 'border-border'
            }`}
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1.5">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 py-3.5 bg-primary hover:bg-primary-hover text-white font-semibold rounded-xl transition-all shadow-md shadow-red-500/10 hover:shadow-red-500/20 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Verifying credentials...
            </>
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      <div className="mt-8 text-center text-sm text-text-secondary font-light border-t border-border pt-6">
        Don't have an account?{' '}
        <Link href="/register" className="text-primary font-semibold hover:underline">
          Register here
        </Link>
      </div>
    </div>
  );
}

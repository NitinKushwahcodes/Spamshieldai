"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { useAuth } from '../../../hooks/useAuth';
import { ShieldCheck, Loader2 } from 'lucide-react';

const registerSchema = zod.object({
  name: zod.string().min(2, 'Name must be at least 2 characters'),
  email: zod.string().min(1, 'Email is required').email('Invalid email address'),
  password: zod.string().min(6, 'Password must be at least 6 characters'),
  city: zod.string().optional(),
  state: zod.string().optional(),
});

type RegisterFormValues = zod.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { register } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      city: '',
      state: '',
    }
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setServerError(null);
    try {
      await register(values);
    } catch (err: any) {
      setServerError(err.message || 'Registration failed. Email address may already be registered.');
    }
  };

  return (
    <div>
      <div className="text-center mb-6">
        <div className="flex justify-center mb-3 md:hidden">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white">
            <ShieldCheck size={22} />
          </div>
        </div>
        <h1 className="text-2xl font-extrabold text-text-primary tracking-tight">
          Create Account
        </h1>
        <p className="text-text-secondary text-sm font-light mt-1.5">
          Sign up to secure your cases and generate official complaints.
        </p>
      </div>

      {serverError && (
        <div className="mb-5 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
            Full Name
          </label>
          <input
            type="text"
            placeholder="Nitin Kushwah"
            {...formRegister('name')}
            className={`w-full px-4 py-2.5 rounded-xl bg-surface-elevated border text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-primary/50 transition-colors ${
              errors.name ? 'border-red-500/50' : 'border-border'
            }`}
          />
          {errors.name && (
            <p className="text-red-500 text-[11px] mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
            Email Address
          </label>
          <input
            type="email"
            placeholder="name@example.com"
            {...formRegister('email')}
            className={`w-full px-4 py-2.5 rounded-xl bg-surface-elevated border text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-primary/50 transition-colors ${
              errors.email ? 'border-red-500/50' : 'border-border'
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-[11px] mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
            Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            {...formRegister('password')}
            className={`w-full px-4 py-2.5 rounded-xl bg-surface-elevated border text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-primary/50 transition-colors ${
              errors.password ? 'border-red-500/50' : 'border-border'
            }`}
          />
          {errors.password && (
            <p className="text-red-500 text-[11px] mt-1">{errors.password.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
              City
            </label>
            <input
              type="text"
              placeholder="Delhi"
              {...formRegister('city')}
              className="w-full px-4 py-2.5 rounded-xl bg-surface-elevated border border-border text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
              State
            </label>
            <input
              type="text"
              placeholder="Delhi"
              {...formRegister('state')}
              className="w-full px-4 py-2.5 rounded-xl bg-surface-elevated border border-border text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 py-3.5 bg-primary hover:bg-primary-hover text-white font-semibold rounded-xl transition-all shadow-md shadow-red-500/10 hover:shadow-red-500/20 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed mt-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Creating profile...
            </>
          ) : (
            'Create Account'
          )}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-text-secondary font-light border-t border-border pt-4">
        Already have an account?{' '}
        <Link href="/login" className="text-primary font-semibold hover:underline">
          Sign in here
        </Link>
      </div>
    </div>
  );
}

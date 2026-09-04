/**
 * Auth Routes
 *
 * Convenience routes wrapping Supabase Auth.
 * These are public (no auth middleware).
 */

import { Router } from 'express';
import { supabase, supabaseAdmin } from '../config/supabase.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';

const router = Router();

/**
 * POST /api/auth/signup
 * Create a new user account via Supabase Auth.
 * Also creates a row in the `users` table.
 */
router.post(
  '/signup',
  asyncHandler(async (req, res) => {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      throw new AppError('Email, password, and name are required.', 400);
    }

    // Sign up with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      throw new AppError(`Signup failed: ${authError.message}`, 400);
    }

    if (!authData.user) {
      throw new AppError('Signup failed: no user returned.', 500);
    }

    // Create the user row in the `users` table
    const { error: userError } = await supabaseAdmin
      .from('users')
      .insert({
        id: authData.user.id,
        name,
      });

    if (userError) {
      console.error('Failed to create user row:', userError.message);
      // Don't throw — the auth user exists, the users row can be created later
    }

    // Initialize valli_state for the new user
    await supabaseAdmin
      .from('valli_state')
      .insert({
        user_id: authData.user.id,
        total_points: 0,
        active_vallis: 0,
        resolved_vallis: 0,
        growth_level: 1,
        growth_percentage: 0,
        severity: 'SEED',
      });

    res.status(201).json({
      message: 'Account created. Welcome to Valli Chedi. 🌱',
      user: {
        id: authData.user.id,
        email: authData.user.email,
        name,
      },
      session: authData.session,
    });
  })
);

/**
 * POST /api/auth/login
 * Sign in with email and password.
 */
router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError('Email and password are required.', 400);
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new AppError(`Login failed: ${error.message}`, 401);
    }

    res.json({
      message: 'Login successful. The chedi awaits. 🌿',
      user: {
        id: data.user.id,
        email: data.user.email,
      },
      session: {
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
        expiresAt: data.session.expires_at,
      },
    });
  })
);

export default router;

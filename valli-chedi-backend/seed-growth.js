import { supabaseAdmin } from './src/config/supabase.js';
import * as valliEngine from './src/services/valliEngine.js';
import * as activityModel from './src/models/activityModel.js';
import * as growthEngine from './src/services/growthEngine.js';

async function seed() {
  try {
    // 1. Find the test user
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('name', 'Test User')
      .single();
      
    if (error || !user) {
      console.log('Test User not found in database.');
      return;
    }
    const userId = user.id;
    console.log(`Seeding for user: ${userId}`);

    // 2. Create an activity
    const now = new Date();
    const startTime1 = new Date(now.getTime() + 24 * 60 * 60 * 1000); // Tomorrow
    
    const act1 = await activityModel.create(userId, {
      title: 'Secret Goa Trip',
      category: 'TRAVEL',
      startTime: startTime1.toISOString(),
      overnight: true,
      location: 'Goa',
      state: 'Goa'
    });
    console.log('Created Activity:', act1.title);

    // 3. Create some severe Vallis to bump up the growth points (Plant Level 4+)
    await valliEngine.createValli(userId, {
      activityId: act1.id,
      category: 'PERMISSION',
      title: 'No permission taken',
      description: 'You just packed your bags and left.',
      severity: 9,
      growthPoints: 200
    });

    await valliEngine.createValli(userId, {
      activityId: act1.id,
      category: 'COMMUNICATION',
      title: 'Phone switched off',
      description: 'Achan called 5 times. Phone was unreachable.',
      severity: 10,
      growthPoints: 350
    });
    
    await valliEngine.createValli(userId, {
      category: 'RESPONSIBILITY',
      title: 'Missed family function',
      description: 'You were supposed to attend a wedding.',
      severity: 8,
      growthPoints: 150
    });

    // 4. Force recalculate state
    await growthEngine.recalculateState(userId);

    const { data: state } = await supabaseAdmin
      .from('valli_state')
      .select('*')
      .eq('user_id', userId)
      .single();

    console.log('Growth seeded successfully! 🌿');
    console.log(`New Growth Level: ${state.growth_level}`);
    console.log(`New Points: ${state.total_points}`);
    
    process.exit(0);
  } catch (err) {
    console.error('Error seeding growth:', err);
    process.exit(1);
  }
}

seed();

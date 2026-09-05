import { supabaseAdmin } from './src/config/supabase.js';

async function getUsers() {
  try {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers();
    if (error) throw error;
    console.log(data.users.map(u => ({ id: u.id, email: u.email })));
  } catch (error) {
    console.error('Error fetching users:', error);
  }
}

getUsers();

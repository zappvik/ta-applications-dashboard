// create-user.js

const { createClient } = require('@supabase/supabase-js');



// --- CONFIGURATION ---

const SUPABASE_URL = 'https://rmoaspdeaccedyxeldgp.supabase.co'; 

const SERVICE_ROLE_KEY = 'PASTE_YOUR_SERVICE_ROLE_KEY_HERE'; 



// --- NEW SETTINGS: USERNAME ONLY ---

const USERNAME = 'admin';

const PASSWORD = 'Password123!';

// We automatically append this dummy domain

const FAKE_EMAIL = `${USERNAME}@dashboard.local`; 

// ---------------------



const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {

  auth: { autoRefreshToken: false, persistSession: false }

});



async function createNewUser() {

  console.log(`Creating user for username: "${USERNAME}"...`);

  console.log(`(System will store this as: ${FAKE_EMAIL})`);



  const { data, error } = await supabase.auth.admin.createUser({

    email: FAKE_EMAIL,

    password: PASSWORD,

    email_confirm: true

  });



  if (error) {

    console.error('❌ Error:', error.message);

  } else {

    console.log('✅ Success! User created.');

    console.log(`You can now log in with Username: "${USERNAME}" and Password: "${PASSWORD}"`);

  }

}



createNewUser();


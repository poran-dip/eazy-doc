// src/lib/adminPassword.js

const bcrypt = require('bcryptjs');

const password = 'password'; // Replace this with the actual password you want to hash
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error('Error hashing password:', err);
    return;
  }
  console.log('Hashed password for .env file:');
  console.log(hash);
  
  console.log("\nIMPORTANT: When adding to .env, escape every '$' with a '\\' like this:");
  console.log("ADMIN_PASSWORD=\\$2b\\$10\\$yourHashedPasswordHere");
});

/*
📌 HOW TO USE:
1️⃣ Run this script to generate a hashed password:
   ➜ node src/lib/adminPassword.js

2️⃣ Copy the outputted hash and add it to your .env file like this:
   ADMIN_USERNAME=admin   # Change as needed
   ADMIN_PASSWORD=\$2b\$10\$yourHashedPasswordHere

3️⃣ Restart your server to apply changes:
   ➜ npm run dev
*/

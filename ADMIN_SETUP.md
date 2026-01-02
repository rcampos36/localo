# Admin Setup Instructions

## Quick Setup

1. **Make sure you're registered and logged in** with email: `rcrogercampos@gmail.com`

2. **Set Admin Role** - Choose one method:

   **Option A: Use the Admin Setup Page**
   - Navigate to: `http://localhost:3000/admin-setup`
   - Click "Set as Admin"
   - Log out and log back in

   **Option B: Use Browser Console**
   - Open browser console (F12 or Cmd+Option+I)
   - Paste and run:
   ```javascript
   const users = JSON.parse(localStorage.getItem("users") || "[]");
   const userIndex = users.findIndex(u => u.email === "rcrogercampos@gmail.com");
   if (userIndex !== -1) {
     users[userIndex].role = "admin";
     localStorage.setItem("users", JSON.stringify(users));
     console.log("✓ Admin role set!");
     
     // Update current user if logged in
     const currentUser = localStorage.getItem("currentUser");
     if (currentUser) {
       const user = JSON.parse(currentUser);
       if (user.email === "rcrogercampos@gmail.com") {
         user.role = "admin";
         localStorage.setItem("currentUser", JSON.stringify(user));
       }
     }
   }
   ```
   - **IMPORTANT**: Log out and log back in for changes to take effect
   - Refresh the page after logging back in

3. **Verify Admin Access**
   - After logging back in, you should see an "Admin" button next to the language selector
   - The button will appear in the navigation on all pages
   - Click it to access `/admin` dashboard

## Troubleshooting

- **Button not showing?** Make sure you:
  1. Set the role in localStorage (see step 2)
  2. Logged out completely
  3. Logged back in
  4. Refreshed the page

- **Check if role is set correctly:**
  ```javascript
  // In browser console:
  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const user = users.find(u => u.email === "rcrogercampos@gmail.com");
  console.log("User role:", user?.role); // Should be "admin"
  
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
  console.log("Current user role:", currentUser?.role); // Should be "admin"
  ```


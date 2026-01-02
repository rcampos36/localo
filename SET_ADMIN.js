// Copy and paste this entire script into your browser console
// This will set your user as admin and update your current session

(function() {
  const email = "rcrogercampos@gmail.com";
  
  // Update users array
  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const userIndex = users.findIndex(u => u.email === email);
  
  if (userIndex !== -1) {
    users[userIndex].role = "admin";
    localStorage.setItem("users", JSON.stringify(users));
    console.log("✓ Admin role set in users array");
    
    // Update current user if logged in
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      const user = JSON.parse(currentUser);
      if (user.email === email) {
        user.role = "admin";
        localStorage.setItem("currentUser", JSON.stringify(user));
        console.log("✓ Current user role updated");
        console.log("⚠️ Please REFRESH the page (F5 or Cmd+R) for changes to take effect");
      } else {
        console.log("⚠️ You're logged in as a different user. Log out and log back in as:", email);
      }
    } else {
      console.log("⚠️ You're not logged in. Please log in as:", email);
    }
  } else {
    console.log("✗ User not found. Make sure you're registered with email:", email);
  }
  
  // Verify
  console.log("\n=== Verification ===");
  const updatedUser = users.find(u => u.email === email);
  console.log("User in users array:", updatedUser);
  const current = localStorage.getItem("currentUser");
  if (current) {
    console.log("Current logged in user:", JSON.parse(current));
  }
})();


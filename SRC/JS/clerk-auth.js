// This function will run once the document is fully loaded
window.addEventListener("load", async () => {
  // Get your publishable key from your Clerk environment variables
  const clerkPubKey = "pk_live_Y2xlcmsubWF5ZGF5ei5jb20k";

  const clerk = window.Clerk;

  if (!clerk) {
    console.error("ClerkJS script not loaded correctly.");
    return;
  }

  try {
    await clerk.load({
      // You can add options here if needed, like afterSignInUrl, etc.
    });

    //Sign in within login.html
    const signInDiv = document.getElementById("sign-in");

    const userProfileDiv = document.getElementById("user-profile");
    //Sign in for the index page
    const userSignInDiv = document.getElementById("Sign-up");
    const userSignOutDiv = document.getElementById("Sign-out");

    if (clerk.user) {
      if (signInDiv) signInDiv.style.display = "none";
      if (userProfileDiv) userProfileDiv.style.display = "block";
      if (userProfileDiv) {
        clerk.mountUserProfile(userProfileDiv, {
          afterSignOutUrl: "/Index.html",
        });
      }
      if (userSignOutDiv) userSignOutDiv.style.display = "flex";
      if (userSignOutDiv) {
        clerk.mountUserButton(userSignOutDiv, {
          afterSignOutUrl: "/Index.html",
        });
      }
      if (userSignInDiv) userSignInDiv.style.display = "none";
      if (userSignInDiv) document.getElementById("");
      if (userSignInDiv) {
        clerk.mountUserButton(userSignInDiv, {
          afterSignOutUrl: "/Index.html",
        });
      }
    } else {
      signInDiv.style.display = "block";
      userProfileDiv.style.display = "none";
      clerk.mountSignIn(signInDiv);
    }
  } catch (err) {
    console.error("Failed to load ClerkJS:", err);
  }
});

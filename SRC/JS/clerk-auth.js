window.addEventListener("load", async () => {
  const clerkPubKey = "pk_live_Y2xlcmsubWF5ZGF5ei5jb20k";
  const clerk = window.Clerk;

  if (!clerk) {
    console.error("ClerkJS script not loaded correctly.");
    return;
  }

  try {
    await clerk.load({});

    const signInDiv = document.getElementById("sign-in");
    const userProfileDiv = document.getElementById("user-profile");
    const userSignInDiv = document.getElementById("Sign-up");
    const userSignOutDiv = document.getElementById("Sign-out");

    if (clerk.user) {
      if (signInDiv) signInDiv.style.display = "none";
      if (userProfileDiv) {
        userProfileDiv.style.display = "block";
        clerk.mountUserProfile(userProfileDiv, {
          afterSignOutUrl: "/Index.html",
        });
      }
      if (userSignOutDiv) {
        userSignOutDiv.style.display = "flex";
        clerk.mountUserButton(userSignOutDiv, {
          afterSignOutUrl: "/Index.html",
        });
      }
      if (userSignInDiv) userSignInDiv.style.display = "none";
    } else {
      if (signInDiv) {
        signInDiv.style.display = "block";
        clerk.mountSignIn(signInDiv);
      }
      if (userProfileDiv) {
        userProfileDiv.style.display = "none";
      }
    }
  } catch (err) {
    console.error("Failed to load ClerkJS:", err);
  }
});

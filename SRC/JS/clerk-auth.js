// This function will run once the document is fully loaded
window.addEventListener('load', async () => {
    // Get your publishable key from your Clerk environment variables
    const clerkPubKey = 'pk_live_Y2xlcmsubWF5ZGF5ei5jb20k';
    

    const clerk = window.Clerk;

    if (!clerk) {
        console.error("ClerkJS script not loaded correctly.");
        return;
    }

    try {
        await clerk.load({
            // You can add options here if needed, like afterSignInUrl, etc.
        });

        const signInDiv = document.getElementById('sign-in');
        const userButtonDiv = document.getElementById('user-button');

        if (clerk.user) {
            signInDiv.style.display = 'none';
            userButtonDiv.style.display = 'block';
            clerk.mountUserButton(userButtonDiv);
        } else {
            signInDiv.style.display = 'block';
            userButtonDiv.style.display = 'none';
            clerk.mountSignIn(signInDiv);
        }
    } catch (err) {
        console.error("Failed to load ClerkJS:", err);
    }
});
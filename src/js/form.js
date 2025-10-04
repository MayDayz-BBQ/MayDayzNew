document
  .getElementById("email-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent the default form submission

    const form = document.getElementById("email-form"); // Moved inside the function
    const emailInput = document.getElementById("student-email");
    const nameInput = document.getElementById("name");
    const emailError = document.getElementById("email-error");
    const responseMessage = document.getElementById("response-message");

    // Clear previous messages
    emailError.textContent = "";
    responseMessage.textContent = "";

    const email = emailInput.value;
    const name = nameInput.value;

    const data = {
      email: email,
      name: name,
    };

    // Client-side validation
    if (!data.email.endsWith("@charlotte.edu")) {
      emailError.textContent = "Please enter a valid Charlotte student email.";
      return;
    }

    try {
      const response = await fetch(
        "https://maydayzsite.onrender.com/verify-uncc-student",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();

      if (response.ok) {
        responseMessage.textContent = result.message;
        responseMessage.className = "mt-4 text-center text-green-500 font-bold";
        form.reset();
        // Redirect after a short delay
        setTimeout(() => {
          window.location.href = "https://maydayz.com";
        }, 5);
      } else {
        emailError.textContent = result.message;
        responseMessage.className = "mt-4 text-center text-red-600 font-bold";
      }
    } catch (error) {
      console.error("Error during form submission:", error);
      emailError.textContent =
        "An unexpected error occurred. Please try again.";
      responseMessage.className = "mt-4 text-center text-red-600 font-bold";
    }
  });

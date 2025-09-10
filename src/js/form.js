const form = document.getElementById("email-form");
const emailError = document.getElementById("email-error");
const responseMessage = document.getElementById("response-message");

form.addEventListener("submit", async function (event) {
  event.preventDefault();

  emailError.textContent = "";
  responseMessage.textContent = "";

  const emailInput = document.getElementById("student-email");
  const email = emailInput.value;
  const nameInput = document.getElementById("name");
  const name = nameInput.value;

  const data = {
    email: email,
    name: name,
  };

  console.log(email);
  // This is the updated line to match your server-side logic
  if (!data.email.endsWith("@charlotte.edu")) {
    emailError.textContent = "Please enter a valid Charlotte student email.";
    return;
  }

  try {
    const response = await fetch("/verify-uncc-student", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (response.ok) {
      responseMessage.textContent = result.message;
      responseMessage.className = "mt-4 text-center text-green-500 font-bold";
      form.reset();
      setTimeout(100);
      window.location.href = "https://maydayz.com";
    } else {
      emailError.textContent = result.message;
      responseMessage.className = "mt-4 text-center text-red-600 font-bold";
    }
  } catch (error) {
    console.error("Error during form submission:", error);
    emailError.textContent = "An unexpected error occurred. Please try again.";
    responseMessage.className = "mt-4 text-center text-red-600 font-bold";
  }
});

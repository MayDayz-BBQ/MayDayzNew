const express = require("express");
const dotenv = require("dotenv");
// const { createClient } = require("@supabase/supabase-js");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const twilio = require("twilio");

//Reading enviornment variables using dotenv
dotenv.config();

//Reading keys from Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

//Verifies if key is valid
// if (!supabaseUrl || !supabaseKey) {
//   console.error("Supabase URL or Key is not defined in environment variables.");
//   process.exit(1);
// }

// //Creating a server client for Supabase
// const supabase = createClient(supabaseUrl, supabaseKey);

//Uses Express to access HTTP request to the server
const app = express();
const port = process.env.PORT || 3000;

//Middleware that parses JSON request from the client
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

//Cors accessible origins. There are some local links in here for testing.
const corsOptions = {
  origin: [
    "https://maydayz.com",
    "https://maydayzsite.onrender.com",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5500",
  ],
};

//Middleware to allow cors to use the list of cors options
app.use(cors(corsOptions));

//A get request that removes cache to the Index page of the site. This is to fulfill the need of the user always
//seeing the newest version of the site.
app.get("/", (request, response) => {
  response.setHeader("Cache-Control", "no-cache, must-revalidate");
  response.setHeader("Pragma", "no-cache");
  response.setHeader("Expires", "0");
  response.sendFile(path.join(__dirname, "Index.html"));
});

//Post request that utlizes Supabase OTP verification. As of July 2025 MayDayz will mainly focus on
//email request but there is a place holder for phone verification as well.
// app.post("/verify-otp", async (req, res) => {
//   try {
//     const { identifier, otp, type } = req.body; // 'identifier' is the email or phone, 'type' is 'email' or 'phone'

//     if (!identifier || !otp || !type) {
//       return res
//         .status(400)
//         .send("Missing required fields for OTP verification.");
//     }

//     let verifyOptions = { token: otp };
//     if (type === "email") {
//       verifyOptions.email = identifier;
//       verifyOptions.type = "email"; // Explicitly set type for Supabase
//     } else if (type === "phone") {
//       // Ensure phone is formatted with +1 if not already
//       verifyOptions.phone = identifier.startsWith("+")
//         ? identifier
//         : `+1${identifier}`;
//       verifyOptions.type = "sms"; // Explicitly set type for Supabase
//     } else {
//       return res.status(400).send("Invalid verification type.");
//     }

//     const { data, error } = await supabase.auth.verifyOtp(verifyOptions);

//     if (error) {
//       console.error("Supabase OTP Verification Error:", error);
//       // More specific error messages can be helpful for the user
//       if (error.message.includes("Invalid code")) {
//         return res
//           .status(401)
//           .send("Invalid or expired code. Please try again.");
//       }
//       return res.status(401).send("OTP verification failed: " + error.message);
//     }

//     if (data.session && data.user) {
//       // User successfully logged in and session established
//       console.log("User successfully verified OTP and logged in:", data.user);
//       return res.status(200).send("OTP verified successfully!");
//     } else {
//       // This case might indicate an issue where OTP was verified but session wasn't created,
//       // which is less common with verifyOtp if successful.
//       console.warn(
//         "OTP verified, but session or user data not fully returned:",
//         data
//       );
//       return res
//         .status(500)
//         .send(
//           "OTP verified, but an issue occurred establishing your session. Please try again."
//         );
//     }
//   } catch (err) {
//     console.error("Unexpected error during OTP verification:", err);
//     return res
//       .status(500)
//       .send("An unexpected error occurred during OTP verification.");
//   }
// });

//Post request for the signup page. As of July 2025 the user won't truly be able
//to utilize this exact HTTP request but there is possibility of return in
//the future.
// app.post("/signup", async (req, res) => {
//   try {
//     const { name, email, phoneNumber, emailOptIn, smsOptIn } = req.body;

//     if (!name || !email || !phoneNumber) {
//       return res.status(400).send("Missing required fields.");
//     }

//     const { data: existingUser, error: checkError } = await supabase
//       .from("MaydayzCustomers")
//       .select("*")
//       .or(`email.eq.${email},name.eq.${name}`);

//     if (checkError) {
//       console.error("Error checking for existing user:", checkError);
//       return res.status(500).send("Error checking for existing user.");
//     }

//     if (existingUser.length > 0) {
//       return res
//         .status(409)
//         .send("User with this name or email already exists.");
//     }

//     const { data, error } = await supabase.from("MaydayzCustomers").insert([
//       {
//         name,
//         email,
//         phoneNumber,
//         emailOptIn,
//         smsOptIn,
//       },
//     ]);

//     if (error) {
//       console.error("Error inserting user:", error);
//       return res.status(500).send("Error creating user.");
//     }

//     console.log("User created:", data);
//     return res.status(201).send("Signup successful!");
//   } catch (err) {
//     console.error("Unexpected error during signup:", err);
//     return res.status(500).send("An unexpected error occurred.");
//   }
// });

//Get request to acess the information entered by the user from the login
//page. This handles the information with verification and also will redirect
//the user back to the home screen.
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "SRC", "HTML", "login.html"));
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "SRC", "HTML", "menu.html"));
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "SRC", "HTML", "login.html"));
});

app.post("/login", async (req, res) => {
  try {
    const { email, phone } = req.body;

    if (!email && !phone) {
      return res.status(400).send("Please enter an email or Phone Number");
    }

    if (email && phone) {
      return res
        .status(400)
        .send(
          "Please provide either an email OR a phone number, not both for this login method."
        );
    }

    let signInOptions = {};
    let successMessage = "";

    if (email) {
      signInOptions.email = email;
      successMessage =
        "Login initiated! Please check your email for a verification code.";
      console.log(`Attempting OTP sign-in for email: ${email}`);
    } else if (phone) {
      // Add +1 if missing
      const formattedPhone = phone.startsWith("+") ? phone : `+1${phone}`;
      signInOptions.phone = formattedPhone;
      successMessage =
        "Login initiated! Please check your phone for a verification code.";
      console.log(`Attempting OTP sign-in for phone: ${formattedPhone}`);
    }

    const { data, error } = await supabase.auth.signInWithOtp(signInOptions);

    if (error) {
      console.error("Supabase Login Error:", error);
      return res
        .status(401)
        .send("Login failed. Please check your credentials or try again.");
    }

    if (data.user) {
      console.log(
        "Supabase returned user data directly, session may be established:",
        data.user
      );
      return res.status(200).send("Login successful!");
    } else {
      console.log("OTP successfully sent to the provided contact.");
      return res.status(200).send(successMessage);
    }
  } catch (err) {
    // Catch any unexpected server-side errors
    console.error("Unexpected error during login process:", err);
    return res
      .status(500)
      .send(
        "An unexpected error occurred during login. Please try again later."
      );
  }
});

//
app.get("/auth/callback", async function (req, res) {
  const code = req.query.code;
  const next = req.query.next ?? "/";

  if (code) {
    const { createServerClient } = require("@supabase/ssr");

    const supabaseServer = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll: () => req.headers.cookie,
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            res.appendHeader(
              "Set-Cookie",
              `${name}=${value}; ${Object.entries(options)
                .map(([k, v]) => `${k}=${v}`)
                .join("; ")}`
            );
          });
        },
      },
    });
    await supabaseServer.auth.exchangeCodeForSession(code);
  }

  res.redirect(303, next);
});

app.use(express.urlencoded({ extended: true }));

app.post("/src/html/uncc.html", (req, res) => {
  console.log("Form data received:", req.body);
  const email = req.body.email;
  console.log(email);
  if (!email.includes("@charlotte.edu")) {
    return res.json({
      success: false,
      message: "Please enter a valid Charlotte student email.",
    });
  } else {
    res.redirect("https://maydayz.com");
  }
});

// A route to serve your HTML page
app.get("/src/html/uncc.html", (req, res) => {
  res.sendFile(__dirname + "/src/html/uncc.html");
});
app.get("/sms-reply", (req, res) => {
  res.send(
    "This endpoint is for Twilio SMS webhooks. Please use POST requests only."
  );
});

app.post("/sms-reply", (req, res) => {
  const twiml = new twilio.twiml.MessagingResponse();
  twiml.message(
    "This number does not text back!! Please Contact 980-499-8399 with any concerns"
  );

  res.type("text/xml");
  res.send(twiml.toString());
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

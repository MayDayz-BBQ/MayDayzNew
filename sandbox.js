/**
 * Express server to verify UNCC student emails, create unique discount coupon codes
 * linked to an existing Klaviyo coupon, and send the code via email (stubbed).
 *
 * Features:
 * - Uses Klaviyo API to fetch coupons and create coupon codes.
 * - Matches coupons by their `external_id` instead of `name` due to API data structure.
 * - Generates unique coupon codes with a prefix and random/timestamp parts.
 * - Validates student emails by domain.
 * - Handles Twilio SMS webhook responses (stub).
 */

const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const path = require("path");
const twilio = require("twilio");
const crypto = require("crypto");
const axios = require("axios");
const fs = require("fs").promises;
const EMAIL_LIST_FILE = "received_coupons.txt";

dotenv.config();

const apiKey = process.env.KLAVIYO_PRIVATE_KEY;

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

/**
 * Fetch all coupons from Klaviyo API.
 * This assumes you only have a small number of coupons (no pagination handled).
 */
async function getAllKlaviyoCoupons() {
  try {
    const response = await axios.get("https://a.klaviyo.com/api/coupons", {
      headers: {
        Authorization: `Klaviyo-API-Key ${apiKey}`,
        Accept: "application/vnd.api+json",
        revision: "2025-07-15",
      },
    });

    return response.data.data;
  } catch (error) {
    console.error(
      "Error fetching coupons from Klaviyo:",
      error.response?.data || error.message
    );
    throw error;
  }
}

/**
 * Find coupon ID by matching coupon's external_id with the given name.
 * This replaces searching by 'name' because the Klaviyo API response uses 'external_id'.
 *
 * @param {string} name - The external_id to find.
 * @returns {string} - The coupon ID.
 */
async function findCouponIdByName(name) {
  const coupons = await getAllKlaviyoCoupons();

  console.log("Available coupons (full objects):");
  console.dir(coupons, { depth: null });

  const filteredCoupons = coupons.filter(
    (c) => c.attributes && c.attributes.external_id
  );

  const found = filteredCoupons.find((c) => c.attributes.external_id === name);

  if (!found) {
    throw new Error(`Coupon named "${name}" not found in Klaviyo.`);
  }

  console.log(`Found coupon ID: ${found.id} for "${name}"`);
  return found.id;
}

/**
 * Create a coupon code in Klaviyo linked to an existing coupon by ID.
 *
 * @param {string} couponId - The coupon ID in Klaviyo.
 * @param {string} discountCode - The unique discount code to create.
 */
async function createKlaviyoCouponCode(couponId, discountCode) {
  console.log("Coupon ID:", couponId);
  console.log("Discount Code:", discountCode);

  if (!discountCode) throw new Error("discountCode is missing!");

  try {
    const payload = {
      data: {
        type: "coupon-code",
        attributes: {
          unique_code: discountCode,
        },
        relationships: {
          coupon: {
            data: {
              type: "coupon",
              id: couponId,
            },
          },
        },
      },
    };

    console.log(
      "Sending payload to Klaviyo:",
      JSON.stringify(payload, null, 2)
    );

    const response = await axios.post(
      "https://a.klaviyo.com/api/coupon-codes",
      payload,
      {
        headers: {
          Authorization: `Klaviyo-API-Key ${apiKey}`,
          "Content-Type": "application/json",
          Accept: "application/vnd.api+json",
          revision: "2025-07-15",
        },
      }
    );

    console.log("Klaviyo coupon code created:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error creating Klaviyo coupon code:",
      error.response?.data || error.message
    );
    throw error;
  }
}

async function createSquareDiscountCode(discountCode) {}

/**
 * Generate a custom discount code with a prefix, timestamp, and random string.
 *
 * @param {string} prefix - Code prefix (default "MAYDAYZ").
 * @returns {string} - Generated code.
 */
function generateCustomCode(prefix = "MAYDAYZ") {
  const timestampPart = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 6);
  return `${prefix}-${timestampPart}-${randomPart}`.toUpperCase();
}

/**
 * Stub function to send email to your work address.
 * You'll replace this with a real email service (e.g., Nodemailer).
 * * @param {string} studentEmail - The email of the UNCC student.
 * @param {string} couponCode - The static coupon code to be applied.
 */
async function sendEmailWithCouponToAdmin(studentEmail, couponCode) {
  const adminEmail = "jaquis.franklin@maydayz.com";
  const subject = "New UNCC Student Discount Request";
  const emailBody = `A UNCC student has requested a discount.
    Student Email: ${studentEmail}
    Coupon Code to Apply: ${couponCode}
    
    Please apply the following for their order:
    - 15% off
    - Free delivery`;

  // This is a placeholder. You'll use an email sending library here.
  console.log(`Sending email to ${adminEmail}`);
  console.log(`Subject: ${subject}`);
  console.log(`Body: ${emailBody}`);
}

app.post("/verify-uncc-student", async (req, res) => {
  const { email } = req.body;
  console.log(req.body);

  if (!email || !email.toLowerCase().endsWith("@charlotte.edu")) {
    return res.json({
      success: false,
      message: "Please enter a valid Charlotte student email.",
    });
  }

  // The static code you will create manually in Square
  const staticSquareCode = "UNCC_STUDENT_DISCOUNT";

  // Read the list of emails that have already received a coupon
  let emailsReceived = [];
  try {
    const data = await fs.readFile(EMAIL_LIST_FILE, "utf8");
    // Split the file content into an array of emails, trimming whitespace
    emailsReceived = data
      .split("\n")
      .map((e) => e.trim())
      .filter((e) => e.length > 0);
  } catch (error) {
    // This is expected the first time the program is run
    if (error.code === "ENOENT") {
      console.log("Email list file not found, creating a new one.");
    } else {
      console.error("Error reading email list file:", error);
      return res.status(500).json({
        success: false,
        message: "An unexpected error occurred. Please try again later.",
      });
    }
  }

  // Check if the user's email is already in the list
  if (emailsReceived.includes(email.toLowerCase())) {
    console.log(`Email ${email} has already received a coupon.`);
    return res.json({
      success: false,
      message:
        "You have already requested a coupon. The code is only valid for one use per student.",
    });
  }

  // If the email is not found, proceed to send the code and update the list
  try {
    // Append the new email to the file
    await fs.appendFile(EMAIL_LIST_FILE, `${email.toLowerCase()}\n`);
    console.log(`Email ${email} added to the list.`);

    // Send the static code to your work email for manual application
    await sendEmailWithCouponToAdmin(email, staticSquareCode);

    return res.json({
      success: true,
      message:
        "Success! Your request has been received. Your discount will be manually applied to your next order.",
    });
  } catch (error) {
    console.error("Error in UNCC form submission:", error);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred. Please try again later.",
    });
  }
});

app.get("/src/html/uncc.html", (req, res) => {
  res.sendFile(path.join(__dirname, "/src/html/uncc.html"));
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

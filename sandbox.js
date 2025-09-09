const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const path = require("path");
const twilio = require("twilio");
const KlaviyoClient = require("node-klaviyo");
const crypto = require("crypto");

dotenv.config();

const klaviyoClient = new KlaviyoClient({
  publicToken: process.env.KLAYVIO_PUBLIC_KEY,
  privateToken: process.env.KLAYVIO_PRIVATE_KEY,
});

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

async function createKlaviyoCoupon(couponName, discountId) {
  try {
    const response = await klaviyoClient.coupons.create({
      data: {
        type: "coupon",
        attributes: {
          external_id: discountId,
          name: couponName,
        },
      },
    });
    console.log("Klaviyo coupon created successfully:", response.data.id);
    return response;
  } catch (error) {
    console.error("Error creating Klaviyo coupon:", error);
    throw error;
  }
}

async function sendEmailWithCoupon(toEmail, couponCode) {
  console.log(`Sending email to ${toEmail} with code: ${couponCode}`);
}

app.post("/verify-uncc-student", async (req, res) => {
  const email = req.body.email;
  console.log(req.body);

  // Server-side email domain validation
  if (!email || !email.endsWith("@charlotte.edu")) {
    return res.json({
      success: false,
      message: "Please enter a valid Charlotte student email.",
    });
  }

  console.log("Received email:", email);

  const uniqueCouponName = `UNCC-${crypto
    .createHash("md5")
    .update(email)
    .digest("hex")
    .substring(0, 8)}`;

  const squareDiscountName = "UNCC Students and Staff Discounts";

  try {
    await createKlaviyoCoupon(uniqueCouponName, squareDiscountName);

    await sendEmailWithCoupon(email, uniqueCouponName);

    return res.json({
      success: true,
      message:
        "Success! Your discount code has been sent to your student email.",
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

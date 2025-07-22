// Services/sms-service.js
const http = require('http');
const querystring = require('querystring');

const axios = require('axios');
const dotenv = require("dotenv");
dotenv.config();

class SmsApiClient {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
        console.log("Check this url", baseUrl);
    }

    async sendSingleSms(userId, password, senderId, phoneNumber, message, entityId, templateId) {
        const encodedMessage = encodeURIComponent(message);
        const encodedPassword = encodeURIComponent(password);
        const params = {
            UserID: userId,
            Password: password,
            SenderID: senderId,
            Phno: phoneNumber,
            Msg: message,
            EntityID: entityId,
            TemplateID: templateId
        };

        try {
            console.log("📞 Sending SMS with params:", {
                ...params,
                Password: "*****"
            });

            const response = await axios.get(this.baseUrl, { params });
            return response.data;

        } catch (error) {
            console.log(error)
        }
    }
}

const smsClient = new SmsApiClient(process.env.SMS_BASE_URL);

exports.sendSMS = async (phoneNumber, message) => {
    if (!phoneNumber || !/^\+91\d{10}$/.test(phoneNumber)) {
        console.error("❌ Invalid phone number:", phoneNumber);
        return null;
    }

    try {
        const result = await smsClient.sendSingleSms(
            process.env.SMS_USER_ID,
            process.env.SMS_PASSWORD,
            process.env.SMS_SENDER_ID,
            phoneNumber,
            message,
            process.env.SMS_ENTITY_ID,
            process.env.SMS_TEMPLATE_ID
        );
        console.log("✅ SMS Sent:", result);
        return result;
    } catch (err) {
        console.error("❌ Failed to send SMS:", err.message);
        return null;
    }
};
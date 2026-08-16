import nodemailer from "nodemailer";
import "dotenv/config";


// ==========================================
// EMAIL TRANSPORTER
// ==========================================

const transporter =
    nodemailer.createTransport({
        service: "gmail",

        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });


// ==========================================
// SEND ADMIN CREDENTIALS
// ==========================================

export const sendAdminCredentialsEmail = async ({
    recipientEmail,
    adminName,
    loginEmail,
    temporaryPassword,
}) => {

    if (
        !process.env.SMTP_USER ||
        !process.env.SMTP_PASS
    ) {
        throw new Error(
            "SMTP email configuration is missing"
        );
    }


    const loginUrl =
        process.env.FRONTEND_URL ||
        "http://localhost:5173";


    await transporter.sendMail({

        from: `"TryQuizzers" <${process.env.SMTP_USER}>`,

        to: recipientEmail,

        subject:
            "Your TryQuizzers Administrator Account",

        text: `
Hello ${adminName},

Your administrator account for TryQuizzers has been created.

Login Details
------------------------------
Login Email: ${loginEmail}
Temporary Password: ${temporaryPassword}

Login:
${loginUrl}/login

IMPORTANT:
This password was created as a temporary password for your account.

Please log in and change your password to a password of your choice after your first login.

If you did not expect to receive this email, please contact the TryQuizzers administrator.

Regards,
TryQuizzers Administration
        `.trim(),

        html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>TryQuizzers Administrator Account</title>
</head>

<body style="
    margin: 0;
    padding: 0;
    background: #f8fafc;
    font-family: Arial, Helvetica, sans-serif;
">

    <div style="
        max-width: 600px;
        margin: 40px auto;
        padding: 0 20px;
    ">

        <div style="
            background: #ffffff;
            border-radius: 16px;
            padding: 32px;
            border: 1px solid #e2e8f0;
        ">

            <div style="
                width: 52px;
                height: 52px;
                border-radius: 12px;
                background: #2563eb;
                color: #ffffff;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 22px;
                font-weight: bold;
                margin-bottom: 20px;
            ">
                T
            </div>

            <h1 style="
                margin: 0;
                color: #0f172a;
                font-size: 24px;
            ">
                Welcome to TryQuizzers
            </h1>

            <p style="
                margin-top: 12px;
                color: #64748b;
                line-height: 1.6;
            ">
                Hello ${adminName},
            </p>

            <p style="
                color: #64748b;
                line-height: 1.6;
            ">
                Your administrator account has been created
                successfully.
            </p>


            <div style="
                margin-top: 24px;
                padding: 20px;
                background: #f8fafc;
                border-radius: 12px;
                border: 1px solid #e2e8f0;
            ">

                <h2 style="
                    margin: 0 0 16px;
                    color: #0f172a;
                    font-size: 17px;
                ">
                    Login Details
                </h2>

                <p style="
                    margin: 8px 0;
                    color: #475569;
                ">
                    <strong>Login Email:</strong>
                    ${loginEmail}
                </p>

                <p style="
                    margin: 8px 0;
                    color: #475569;
                ">
                    <strong>Temporary Password:</strong>
                    ${temporaryPassword}
                </p>

            </div>


            <div style="
                margin-top: 24px;
                text-align: center;
            ">

                <a
                    href="${loginUrl}/login"
                    style="
                        display: inline-block;
                        padding: 12px 24px;
                        background: #2563eb;
                        color: #ffffff;
                        text-decoration: none;
                        border-radius: 8px;
                        font-weight: 600;
                    "
                >
                    Login to TryQuizzers
                </a>

            </div>


            <div style="
                margin-top: 24px;
                padding: 16px;
                background: #fffbeb;
                border: 1px solid #fde68a;
                border-radius: 10px;
            ">

                <p style="
                    margin: 0;
                    color: #92400e;
                    font-size: 14px;
                    line-height: 1.6;
                ">
                    <strong>Security Notice:</strong>
                    This is a temporary password.
                    Please log in and change your password
                    to a password of your choice after your
                    first login.
                </p>

            </div>


            <p style="
                margin-top: 28px;
                color: #94a3b8;
                font-size: 12px;
                line-height: 1.5;
            ">
                If you did not expect to receive this email,
                please contact the TryQuizzers administrator.
            </p>

        </div>


        <p style="
            text-align: center;
            color: #94a3b8;
            font-size: 12px;
            margin-top: 20px;
        ">
            TryQuizzers
        </p>

    </div>

</body>
</html>
        `.trim(),
    });
};
const nodemailer = require("nodemailer")
const { google } = require("googleapis")


const { OAuth2 } = google.auth
const oauth_link = "https://developers.google.com/oauthplayground"
const { SENDER_EMAIL_ACCOUNT, MAIL_CLIENT_ID, MAIL_CLIENT_SECRET, MAIL_REFRESH_TOKEN } = process.env

const auth = new OAuth2(MAIL_CLIENT_ID, MAIL_CLIENT_SECRET, MAIL_REFRESH_TOKEN, oauth_link)

exports.sendNotifyEmail = async (email, name, url) => {
    auth.setCredentials({
        refresh_token: MAIL_REFRESH_TOKEN,
    })
    try {
        const access_token = await auth.getAccessToken();
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAUTH2",
                user: SENDER_EMAIL_ACCOUNT,
                clientId: MAIL_CLIENT_ID,
                clientSecret: MAIL_CLIENT_SECRET,
                refreshToken: MAIL_REFRESH_TOKEN,
                accessToken: access_token,
            }
        })
        const mailOptions = {
            from: SENDER_EMAIL_ACCOUNT,
            to: email,
            subject: "iNeedSomething Account Confirmation",
            html: `
             <div style="
        max-width: 700px;
        padding-top: 2rem;
        padding-bottom: 2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: 'Times New Roman', Times, serif;
        font-weight: 600;
        color: #3b5998;
        ">
        <img style="width: 40px" src="https://res.cloudinary.com/ruyisbaros/image/upload/v1675030772/qnd7cnxvuogfy1mndvqi.jpg" alt="">
        <span>Action requires: Activate your iNeedSomething account</span>
    </div>
    <div style="
    padding: 1rem 0;
    border-top: 1px solid #e5e5e5;
    border-bottom: 1px solid #e5e5e5;
    color: #141823;
    margin-left: 2rem;
    font-size: 17px;
    font-family: 'Times New Roman', Times, serif;
    ">
        <span>Hello ${name.charAt(0).toUpperCase() + name.slice(1)},</span>
        <div style="
        padding: 20px 0;
        ">
            <span style="
        padding: 1.5rem 0;
        ">You recently create an account on iNeedSomething.org. To complete your
                registration, please confirm your account.
            </span>
        </div>
        <a href=${url} target="_blank" style="
        width: 200px;
        padding: 10px 15px;
        color: #fff;
        background: #4c649b;
        text-decoration: none;
        font-weight: 600;
        letter-spacing: 0.5px;
        ">Confirm your account</a>
        <br />
        <div style="
        padding-top: 20px;
        ">
            <span style="
            padding: 1.5rem 0;
            color: #898f9c;
            ">
                iNeedSomething allows you to stay in touch with all friends.
                once you registered, you can share photos, organize events and much more.
            </span>
        </div>
    </div>
          `,
        }

        const result = await transporter.sendMail(mailOptions)
        return result;
    } catch (error) {
        console.log(error)
    }
}
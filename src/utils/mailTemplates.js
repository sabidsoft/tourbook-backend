exports.resetPassworMailTemplates = (url) => {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <style>
                @media only screen and (max-width: 620px){
                    h1{
                        font-size: 20px;
                        padding: 5px;
                    }
                }
            </style>
        </head>
        <body>
            <div style="background: #f6f6f6;  padding-left: 40px; padding-right: 40px; padding-top: 20px; padding-bottom: 40px; max-width: 620px; margin: 0 auto; font-family: sans-serif; color: #272727;">
                <h1 style="text-align: center; padding-bottom: 20px; color: #267CB5;">Tourbook</h1>
                <p>Someone (hopefully you) has requested a password reset for your Tourbook account. Click the button below to set a new password:</p>
                <div style="margin-top: 30px; margin-bottom: 30px; text-align: center">
                    <a href="${url}" style="font-family: sans-serif; margin: 0 auto; padding-left: 20px; padding-right: 20px; padding-top: 14px; padding-bottom: 14px; text-align: center; background: #267CB5; border-radius: 5px; font-size: 20px 10px; color: #fff; cursor: pointer; text-decoration: none; display: inline-block; font-weight: bold;
                    ">Reset Password</a>
                </div>
                <p style="margin-bottom: 30px;">If you don't wish to reset your password, disregard this email and no action will be taken. The link will expire in an hour.</p>
                <p>Thanks,</p>
                <p style="font-weight: bold;">Tourbook Team</p>
            </div>
        </body>
        </html>
    `
}

exports.resetPasswordSuccedMailTemplates = () => {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <style>
                @media only screen and (max-width: 620px){
                    h1{
                        font-size: 20px;
                        padding: 5px;
                    }
                }
            </style>
        </head>
        <body>
            <div style="background: #f6f6f6;  padding-left: 40px; padding-right: 40px; padding-top: 20px; padding-bottom: 40px; max-width: 620px; margin: 0 auto; font-family: sans-serif; color: #272727;">
                <h1 style="text-align: center; padding-bottom: 20px; color: #267CB5;">Tourbook</h1>
                <p style="margin-bottom: 30px;">Your Tourbook account password has been successfully updated. Now you can login with your new password.</p>
                <p>Thanks,</p>
                <p style="font-weight: bold;">Tourbook Team</p>
            </div>
        </body>
        </html>
    `
}
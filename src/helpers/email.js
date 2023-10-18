import nodemailer from "nodemailer";

export const emailRegistro = async (datos) => {
    const { email, nombre, token } = datos;
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const info = await transport.sendMail({
        from: '"Uptask - Administrador de Proyectos" <cuentas@uptask.com>',
        to: email,
        subject: "Uptask - Confirma tu cuenta",
        html: `
            <html>
            <head>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                        background-color: #f7f7f7;
                    }
                    .header {
                        background-color: #4CAF50;
                        color: white;
                        padding: 20px;
                        text-align: center;
                    }
                    .content {
                        background-color: #fff;
                        padding: 20px;
                        border-radius: 5px;
                    }
                    .button {
                        display: inline-block;
                        background-color: #4CAF50;
                        color: white;
                        padding: 10px 20px;
                        text-decoration: none;
                        border-radius: 5px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Uptask - Administrador de Proyectos</h1>
                    </div>
                    <div class="content">
                        <p>Hola ${nombre},</p>
                        <p>¡Bienvenido a Uptask! Tu cuenta está casi lista. Solo debes confirmarla haciendo clic en el siguiente enlace:</p>
                        <p><a class="button" href="${process.env.FRONTEND_URL}/confirmar/${token}">Confirmar Cuenta</a></p>
                        <p>Si no creaste esta cuenta, por favor ignora este mensaje.</p>
                    </div>
                </div>
            </body>
            </html>
        `
    });
};


export const emailOlvidePassword = async (datos) => {
    const { email, nombre, token } = datos;
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const info = await transport.sendMail({
        from: '"Uptask - Administrador de Proyectos" <cuentas@uptask.com>',
        to: email,
        subject: "Uptask - Restablece tu password",
        html: `
            <html>
            <head>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                        background-color: #f7f7f7;
                    }
                    .header {
                        background-color: #4CAF50;
                        color: white;
                        padding: 20px;
                        text-align: center;
                    }
                    .content {
                        background-color: #fff;
                        padding: 20px;
                        border-radius: 5px;
                    }
                    .button {
                        display: inline-block;
                        background-color: #4CAF50;
                        color: white;
                        padding: 10px 20px;
                        text-decoration: none;
                        border-radius: 5px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Uptask - Administrador de Proyectos</h1>
                    </div>
                    <div class="content">
                        <p>Hola ${nombre},</p>
                        <p>Has solicitado restablecer tu password. Sigue el siguiente enlace para generar un nuevo password:</p>
                        <p><a class="button" href="${process.env.FRONTEND_URL}/olvide-password/${token}">Restablecer password</a></p>
                        <p>Si tu no solicitaste este email, por favor ignora este mensaje.</p>
                    </div>
                </div>
            </body>
            </html>
        `
    });
};

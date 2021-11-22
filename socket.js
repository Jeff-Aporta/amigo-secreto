const nodemailer = require("nodemailer");

module.exports = function (io, app) {
  io.on("connection", (socket) => {
    //Se ha conectado un nuevo usuario
    socket.on("enviar correos", (jugadores, parejas) => {
      for (let i = 0; i < jugadores.length; i++) {
        const j = jugadores[i];
        const p = parejas[i];
        console.log(j[0] + " -> " + p[0]);
        console.log(j[1] + " -> " + p[1]);
        setTimeout(() => { //protocolo del gestor de envios
          enviarCorreo(
            j[1], //correo
            "Amigo secreto", //Asunto
            `<h4>Hola ${j[0]}</h4>Tu amigo secreto es: ${p[0]} (${p[1]})<br><span style="color:lightgray">No reveles esta información a otra persona</span>` //Cuerpo del mensaje (html)
          );
        }, 1000 * i);
      }
    });

    conexiones_correo = 0;

    function enviarCorreo(para, asunto, html) {
      //Tienen que crearse un correo @outlook, @hotmail funciona pero tiene menos cobertura
      if (conexiones_correo == 0) { //Protocolo del gestor de envios
        conexiones_correo++;
        const transporter = nodemailer.createTransport({
          host: "smtp-mail.outlook.com",
          secureConnection: false,
          port: 587,
          tls: {
            ciphers: "SSLv3",
          },
          auth: {
            user: "no-reply-3@outlook.com",
            pass: "pass123word.",
          },
        });
        const correo_opns = {
          from: '"No responder" no-reply-3@outlook.com',
          to: para,
          subject: asunto + " " + Math.floor(Math.random() * 1000),
          html,
        };
        console.log("enviando correo a: " + para);
        transporter.sendMail(correo_opns, (error, info) => {
          conexiones_correo--;
          if (error) {
            io.to(socket.id).emit("correo no enviado", error);
            console.log(error);
          } else {
            io.to(socket.id).emit("correo enviado", para);
            console.log("correo enviado a : " + para);
          }
        });
      } else {
        setTimeout(() => {//protocolo del gestor de envios
          enviarCorreo(para, asunto, html);
        }, 1000);
      }
    }
  });
};

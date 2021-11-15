const nodemailer = require("nodemailer");

module.exports = function (io, app) {
  io.on("connection", (socket) => {
    console.log("nuevo usuario conectado: " + socket.id);

    socket.on("disconnect", function () {
      console.log("Usuario desconectado: " + socket.id);
    });

    socket.on("enviar correos", (lista) => {
      let jugadores = lista[0];
      let parejas = lista[1];
      for (let i = 0; i < jugadores.length; i++) {
        let jugador = jugadores[i];
        let pareja = parejas[i];
        console.log(jugador[0] + " : " + pareja[0]);
        console.log(jugador[1] + " : " + pareja[1]);
        enviarMail(
          jugador[1],
          "Amigo secreto",
          `<h4>Hola ${jugador[0]}</h4> Tu amigo secreto es: ${pareja[0]}`
        );
      }
    });

    function enviarMail(to, subject, html) {
      const transporter = nodemailer.createTransport({
        host: "smtp-mail.outlook.com",
        secureConnection: false,
        port: 587,
        tls: {
          ciphers: "SSLv3",
        },
        auth: {
          user: "no-reply-3@outlook.com",
          pass: "Jeffrey1.618",
        },
      });
      var mailOptions = {
        from: '"No responder" no-reply-3@outlook.com',
        to,
        subject: subject + " " + Math.floor(Math.random() * 1000),
        html,
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          io.to(socket.id).emit("correo no enviado", error);
          console.log(error);
        }else{
          io.to(socket.id).emit("correo enviado", to);
        }
      });
    }
  });
};

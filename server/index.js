const io = require("socket.io")({ cors: { origin: "*" } });

let users = [];
let tasks = [];

// cuando se conecta un cliente lo agregamos al array, le emitimos las tareas que ya existen
io.on("connection", (socket) => {
  users.push(socket);
  if (tasks.length >= 1) {
    socket.emit("sharedList", tasks);
  }

  // al conectar el cliente emitimos el numero de personas conectadas a cada cliente
  users.forEach((user) => {
    user.emit("counter", users.length);
  });

  // cuando se desecncadena este evento (al escribir una tarea), agregamos la tarea al array y se la mandamos a todos
  socket.on("sharedList", (task) => {
    tasks.push(task);
    users.forEach((user) => {
      user.emit("sharedList", tasks);
    });
  });

  // Cuando se desencadena el evento (al darle al boton de borrar), se elimina la tarea del array y se emite el array nuevo
  socket.on("deleteTask", (id) => {
    tasks = tasks.filter((item) => {
      return item.id !== id;
    });
    users.forEach((user) => {
      user.emit("sharedList", tasks);
    });
  });

  // al desconectarse el cliente lo quitamos del array y enviamos el numero de clientes conectados
  socket.on("disconnect", () => {
    users = users.filter((user) => {
      return user.id !== socket.id;
    });
    users.forEach((user) => {
      user.emit("counter", users.length);
    });
  });
});

io.listen(3000);

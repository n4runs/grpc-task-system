const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const readline = require('readline');

// LOAD PROTO
const taskDef = protoLoader.loadSync(
  path.join(__dirname, '../proto/task.proto')
);
const taskObj = grpc.loadPackageDefinition(taskDef);
const taskPackage = taskObj.task;

const notifDef = protoLoader.loadSync(
  path.join(__dirname, '../proto/notification.proto')
);
const notifObj = grpc.loadPackageDefinition(notifDef);
const notifPackage = notifObj.notification;

const userDef = protoLoader.loadSync(
  path.join(__dirname, '../proto/user.proto')
);
const userObj = grpc.loadPackageDefinition(userDef);
const userPackage = userObj.user;

// CLIENTS
const taskClient = new taskPackage.TaskService(
  'localhost:50051',
  grpc.credentials.createInsecure()
);

const notifClient = new notifPackage.NotificationService(
  'localhost:50052',
  grpc.credentials.createInsecure()
);

const userClient = new userPackage.UserService(
  'localhost:50053',
  grpc.credentials.createInsecure()
);

// STREAM NOTIFICATION
const stream = notifClient.Subscribe({});
stream.on('data', (msg) => {
  console.log("\n🔔 Notification:", msg.message);
});

// READLINE
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// MENU
function showMenu() {
  console.log("\n=== MENU ===");
  console.log("1. Register");
  console.log("2. Login");
  console.log("3. Create Task");
  console.log("4. Exit");

  rl.question("Pilih: ", handleMenu);
}

// HANDLE MENU
function handleMenu(choice) {
  switch (choice) {
    case '1':
      registerUser();
      break;
    case '2':
      loginUser();
      break;
    case '3':
      createTask();
      break;
    case '4':
      rl.close();
      break;
    default:
      console.log("Pilihan tidak valid");
      showMenu();
  }
}

// REGISTER
function registerUser() {
  rl.question("Username: ", (username) => {
    userClient.Register({ username }, (err, res) => {
      if (err) return console.error(err.message);
      console.log(res.message);
      showMenu();
    });
  });
}

// LOGIN
function loginUser() {
  rl.question("Username: ", (username) => {
    userClient.Login({ username }, (err, res) => {
      if (err) return console.error(err.message);
      console.log(res.message);
      showMenu();
    });
  });
}

// CREATE TASK
function createTask() {
  rl.question("Judul task: ", (title) => {
    rl.question("Deskripsi: ", (description) => {

      taskClient.CreateTask(
        { title, description },
        (err, res) => {
          if (err) return console.error(err.message);
          console.log("Task dibuat:", res);
          showMenu();
        }
      );

    });
  });
}

// START
showMenu();
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

// USER PROTO
const userDef = protoLoader.loadSync(
  path.join(__dirname, '../proto/user.proto')
);

const userObj = grpc.loadPackageDefinition(userDef);
const userPackage = userObj.user;

// USER CLIENT
const userClient = new userPackage.UserService(
  'localhost:50053',
  grpc.credentials.createInsecure()
);

// TEST REGISTER
userClient.Register({ username: "andi" }, (err, res) => {
  if (err) return console.error(err);
  console.log("Register:", res.message);
});

// TEST LOGIN
userClient.Login({ username: "andi" }, (err, res) => {
  if (err) return console.error(err);
  console.log("Login:", res.message);
});

// TASK PROTO
const taskDef = protoLoader.loadSync(
  path.join(__dirname, '../proto/task.proto')
);
const taskObj = grpc.loadPackageDefinition(taskDef);
const taskPackage = taskObj.task;

// NOTIFICATION PROTO
const notifDef = protoLoader.loadSync(
  path.join(__dirname, '../proto/notification.proto')
);
const notifObj = grpc.loadPackageDefinition(notifDef);
const notifPackage = notifObj.notification;

// NOTIFICATION CLIENT (STREAMING)
const notifClient = new notifPackage.NotificationService(
  'localhost:50052',
  grpc.credentials.createInsecure()
);

const stream = notifClient.Subscribe({});

stream.on('data', (msg) => {
  console.log("Notification:", msg.message);
});

// TASK CLIENT (UNARY)
const client = new taskPackage.TaskService(
  'localhost:50051',
  grpc.credentials.createInsecure()
);

client.CreateTask(
  {
    title: "Belajar gRPC",
    description: "Node.js implementation"
  },
  (err, response) => {
    if (err) {
      console.error(err);
    } else {
      console.log("Response:", response);
    }
  }
);
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

// LOAD TASK PROTO
const taskDef = protoLoader.loadSync(
  path.join(__dirname, '../../proto/task.proto')
);

const taskObj = grpc.loadPackageDefinition(taskDef);
const taskPackage = taskObj.task;

// LOAD NOTIFICATION PROTO
const notifDef = protoLoader.loadSync(
  path.join(__dirname, '../../proto/notification.proto')
);

const notifObj = grpc.loadPackageDefinition(notifDef);
const notifPackage = notifObj.notification;

// buat client ke notification service
const notifClient = new notifPackage.NotificationService(
  'localhost:50052',
  grpc.credentials.createInsecure()
);

let tasks = [];

function createTask(call, callback) {
  if (!call.request.title) {
    return callback({
      code: grpc.status.INVALID_ARGUMENT,
      message: "Title is required"
    });
  }

  const task = {
    id: String(tasks.length + 1),
    title: call.request.title,
    description: call.request.description
  };

  tasks.push(task);

  console.log("Task created:", task);

  // KIRIM NOTIFIKASI
  notifClient.SendNotification(
    { message: `Task baru: ${task.title}` },
    (err, res) => {
      if (err) {
        console.error("Notif error:", err);
      }
    }
  );

  callback(null, task);
}

const server = new grpc.Server();

server.addService(taskPackage.TaskService.service, {
  CreateTask: createTask
});

server.bindAsync(
  '0.0.0.0:50051',
  grpc.ServerCredentials.createInsecure(),
  () => {
    console.log('Task Service running on port 50051');
    server.start();
  }
);
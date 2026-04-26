const WebSocket = require('ws');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const notifDef = protoLoader.loadSync(
  path.join(__dirname, '../proto/notification.proto')
);
const taskDef = protoLoader.loadSync(
  path.join(__dirname, '../proto/task.proto')
);

const notifObj = grpc.loadPackageDefinition(notifDef);
const taskObj = grpc.loadPackageDefinition(taskDef);

const notifClient = new notifObj.notification.NotificationService(
  'localhost:50052',
  grpc.credentials.createInsecure()
);

const taskClient = new taskObj.task.TaskService(
  'localhost:50051',
  grpc.credentials.createInsecure()
);

const wss = new WebSocket.Server({ port: 8080 });

let totalTasks = 0;

wss.on('connection', (ws) => {
  const stream = notifClient.Subscribe({});

  stream.on('data', (msg) => {
    ws.send(JSON.stringify({
      type: 'notification',
      data: msg.message
    }));
  });

  ws.on('message', (message) => {
    const parsed = JSON.parse(message);

    if (parsed.type === 'createTask') {
      taskClient.CreateTask(parsed, (err, res) => {
        if (!err) {
          totalTasks++;

          ws.send(JSON.stringify({
            type: 'taskCreated'
          }));

          ws.send(JSON.stringify({
            type: 'counter',
            data: totalTasks
          }));
        }
      });
    }
  });
});

console.log("WebSocket running on 8080");
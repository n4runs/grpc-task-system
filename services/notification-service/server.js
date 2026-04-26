const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const packageDef = protoLoader.loadSync(
  path.join(__dirname, '../../proto/notification.proto')
);

const grpcObject = grpc.loadPackageDefinition(packageDef);
const notifPackage = grpcObject.notification;

let clients = [];

function subscribe(call) {
  clients.push(call);

  call.on('end', () => {
    clients = clients.filter(c => c !== call);
  });
}

function broadcast(message) {
  clients.forEach(client => {
    client.write({ message });
  });
}

function sendNotification(call, callback) {
  broadcast(call.request.message);
  callback(null, {});
}

const server = new grpc.Server();

server.addService(notifPackage.NotificationService.service, {
  Subscribe: subscribe,
  SendNotification: sendNotification
});

server.bindAsync(
  '0.0.0.0:50052',
  grpc.ServerCredentials.createInsecure(),
  () => {
    console.log("Notification Service running on 50052");
    server.start();
  }
);
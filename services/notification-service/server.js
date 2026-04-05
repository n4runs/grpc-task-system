const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const packageDef = protoLoader.loadSync(
  path.join(__dirname, '../../proto/notification.proto')
);

const grpcObject = grpc.loadPackageDefinition(packageDef);
const notifPackage = grpcObject.notification;

// simpan semua client
let clients = [];

function subscribe(call) {
  console.log("Client subscribed");

  clients.push(call);

  call.on('end', () => {
    console.log("Client disconnected");
    clients = clients.filter(c => c !== call);
  });
}

//  fungsi broadcast (PENTING)
function broadcast(message) {
  clients.forEach(client => {
    client.write({ message });
  });
}

function sendNotification(call, callback) {
  const message = call.request.message;

  console.log("Broadcasting:", message);

  broadcast(message);

  callback(null, {}); // Empty response
}

const server = new grpc.Server();

server.addService(notifPackage.NotificationService.service, {
  Subscribe: subscribe,
  SendNotification: sendNotification
});

// export broadcast biar bisa dipanggil
module.exports = { broadcast };

server.bindAsync(
  '0.0.0.0:50052',
  grpc.ServerCredentials.createInsecure(),
  () => {
    console.log('Notification Service running on 50052');
    server.start();
  }
);
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const packageDef = protoLoader.loadSync(
  path.join(__dirname, '../../proto/user.proto')
);

const grpcObject = grpc.loadPackageDefinition(packageDef);
const userPackage = grpcObject.user;

let users = [];

function register(call, callback) {
  const { username } = call.request;

  if (!username) {
    return callback({
      code: grpc.status.INVALID_ARGUMENT,
      message: "Username required"
    });
  }

  if (users.includes(username)) {
    return callback({
      code: grpc.status.ALREADY_EXISTS,
      message: "User exists"
    });
  }

  users.push(username);

  callback(null, { message: "Registered" });
}

function login(call, callback) {
  const { username } = call.request;

  if (!users.includes(username)) {
    return callback({
      code: grpc.status.NOT_FOUND,
      message: "User not found"
    });
  }

  callback(null, { message: "Login success" });
}

const server = new grpc.Server();

server.addService(userPackage.UserService.service, {
  Register: register,
  Login: login
});

server.bindAsync(
  '0.0.0.0:50053',
  grpc.ServerCredentials.createInsecure(),
  () => {
    console.log("User Service running on 50053");
    server.start();
  }
);
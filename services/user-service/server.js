const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const packageDef = protoLoader.loadSync(
  path.join(__dirname, '../../proto/user.proto')
);

const grpcObject = grpc.loadPackageDefinition(packageDef);
const userPackage = grpcObject.user;

// in-memory user store
let users = [];

function register(call, callback) {
  const { username } = call.request;

  if (!username) {
    return callback({
      code: grpc.status.INVALID_ARGUMENT,
      message: "Username is required"
    });
  }

  const exists = users.find(u => u === username);

  if (exists) {
    return callback({
      code: grpc.status.ALREADY_EXISTS,
      message: "User already exists"
    });
  }

  users.push(username);

  console.log("User registered:", username);

  callback(null, {
    message: `User ${username} registered`
  });
}

function login(call, callback) {
  const { username } = call.request;

  const exists = users.find(u => u === username);

  if (!exists) {
    return callback({
      code: grpc.status.NOT_FOUND,
      message: "User not found"
    });
  }

  console.log("User login:", username);

  callback(null, {
    message: `Welcome ${username}`
  });
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
    console.log('User Service running on port 50053');
    server.start();
  }
);
#  Smart Task Management System (gRPC)

##  Deskripsi

Smart Task Management System adalah aplikasi berbasis **microservices** yang menggunakan **gRPC** untuk komunikasi antar layanan.

Sistem ini memungkinkan:

* Manajemen task
* Notifikasi real-time
* Manajemen user

Dibangun untuk mendemonstrasikan penggunaan:

* Unary RPC
* Streaming RPC
* Komunikasi antar service (service-to-service)

---

##  Tujuan

* Mengimplementasikan arsitektur client-server menggunakan gRPC
* Menerapkan komunikasi antar microservices
* Mendukung multi-client dan real-time update

---

##  Arsitektur Sistem

```
Client
   │
   ├──> User Service (Register/Login)
   │
   ├──> Task Service (Create Task)
   │          │
   │          └──> Notification Service (Send Notification)
   │
   └──< Notification Service (Streaming ke client)
```

---

##  Services

### 1. User Service (Port: 50053)

Fungsi:

* Register user
* Login user

RPC:

* `Register(UserRequest) -> UserResponse`
* `Login(UserRequest) -> UserResponse`

---

### 2. Task Service (Port: 50051)

Fungsi:

* Membuat task
* Menyimpan task (in-memory)

RPC:

* `CreateTask(TaskRequest) -> TaskResponse`

Fitur tambahan:

* Mengirim notifikasi ke Notification Service

---

### 3. Notification Service (Port: 50052)

Fungsi:

* Mengirim notifikasi real-time ke client

RPC:

* `Subscribe(Empty) -> stream Notification` (Server Streaming)
* `SendNotification(Notification) -> Empty`

---

##  Jenis gRPC yang Digunakan

| Jenis            | Implementasi                |
| ---------------- | --------------------------- |
| Unary RPC        | CreateTask, Register, Login |
| Server Streaming | Subscribe (Notification)    |

---

##  State Management

* Menggunakan **in-memory storage**

  * Task disimpan dalam array
  * User disimpan dalam array

---

##  Multi Client

* Mendukung banyak client secara bersamaan
* Semua client menerima notifikasi real-time

---

##  Teknologi

* Node.js
* @grpc/grpc-js
* @grpc/proto-loader

---

##  Cara Menjalankan

### 1. Install dependency

```
npm install
```

---

### 2. Jalankan Services

#### Terminal 1:

```
node services/notification-service/server.js
```

#### Terminal 2:

```
node services/task-service/server.js
```

#### Terminal 3:

```
node services/user-service/server.js
```

---

### 3. Jalankan Client

```
node client/client.js
```

---

##  Demo Flow

1. Client melakukan **register & login**
2. Client membuat task
3. Task Service menyimpan task
4. Task Service mengirim notifikasi ke Notification Service
5. Semua client menerima notifikasi secara real-time

---

##  Contoh Output

```
Register: User andi registered
Login: Welcome andi

Response: { id: '1', title: 'Belajar gRPC' }

Notification: Task baru: Belajar gRPC
```

---

##  Error Handling

Contoh:

* Username kosong → `INVALID_ARGUMENT`
* User tidak ditemukan → `NOT_FOUND`
* User sudah ada → `ALREADY_EXISTS`

---

##  Struktur Project

```
grpc-task-system/
│
├── proto/
│   ├── task.proto
│   ├── user.proto
│   └── notification.proto
│
├── services/
│   ├── task-service/
│   ├── notification-service/
│   └── user-service/
│
├── client/
│
├── package.json
└── README.md
```

---

##  Fitur yang Dipenuhi

* ✔ Unary RPC
* ✔ Streaming gRPC
* ✔ Multi-service (≥3)
* ✔ Multi-client
* ✔ Error handling
* ✔ In-memory state
* ✔ Service-to-service communication

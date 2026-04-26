#  Smart Task Management System (gRPC)

| NRP              | Nama                        |
| ---------------- | --------------------------- |
| 5027241101       | Binar Najmuddin Mahya       |
| 5027241105       | Naruna Vicranthyo P G       |

## Deskripsi

Smart Task Management System adalah aplikasi berbasis microservices yang menggabungkan gRPC dan WebSocket untuk komunikasi real-time antara backend dan frontend.

Sistem ini memungkinkan:

Manajemen task
Notifikasi real-time
Manajemen user
Dashboard monitoring berbasis web

## Tujuan
* Mengimplementasikan komunikasi antar layanan menggunakan gRPC
* Menghubungkan backend ke frontend menggunakan WebSocket
* Membangun event-driven UI berbasis real-time
* Mendemonstrasikan arsitektur Client → Gateway → Microservices

## Arsitektur Sistem
```
Browser (Dashboard UI)
        │
        ▼
WebSocket Gateway (Node.js)
        │
        ▼
gRPC Services
   ├── User Service
   ├── Task Service
   └── Notification Service
```

## Services
1. User Service (Port: 50053)

Fungsi:

* Register user
* Login user

RPC:

* `Register(UserRequest) -> UserResponse`
* `Login(UserRequest) -> UserResponse`

2. Task Service (Port: 50051)

Fungsi:

* Membuat task
* Menyimpan task (in-memory)

RPC:

* `CreateTask(TaskRequest) -> TaskResponse`

Fitur tambahan:

* Mengirim notifikasi ke Notification Service

3. Notification Service (Port: 50052)

Fungsi:

* Mengirim notifikasi real-time ke client

RPC:

* `Subscribe(Empty) -> stream Notification` (Server Streaming)
* `SendNotification(Notification) -> Empty`

4. WebSocket Gateway (Port: 8080)

Fungsi:

* Menjembatani komunikasi antara browser dan gRPC
* Meneruskan streaming gRPC ke UI
* Menerima command dari UI dan memanggil gRPC


## Jenis Komunikasi
| Jenis              | Implementasi                |
| ----------------   | --------------------------- |
| Unary RPC          | CreateTask, Register, Login |
| Server Streaming   | Subscribe (Notification)    |
| WebSocket          | UI ↔ Gateway                |
| Service-to-Service | Task → Notification         |

## State Management

* Menggunakan in-memory storage
* Task disimpan dalam array
* User disimpan dalam array

## Multi Client

* Mendukung banyak client secara bersamaan
* Semua client menerima notifikasi real-time melalui WebSocket

## Dashboard UI (Event-Driven)

Dashboard menampilkan data secara real-time menggunakan WebSocket.

#### Komponen UI:

* 🔔 Notification Log (real-time)
* 📊 Task Counter
* 📈 Grafik Task Activity (Chart.js)
* 🟢 Status Connection Indicator

#### Teknologi

* Node.js
* gRPC (`@grpc/grpc-js`)
* WebSocket (`ws`)
* Chart.js (visualisasi)
* HTML, CSS (Dashboard UI)

## Cara Menjalankan

### 1. Install dependency

npm install

### 2. Jalankan gRPC Services

Terminal 1:

node services/notification-service/server.js

Terminal 2:

node services/task-service/server.js

Terminal 3:

node services/user-service/server.js

### 3. Jalankan WebSocket Gateway

node gateway/server.js

### 4. Jalankan Client (CLI)

node client/client.js

### 5. Jalankan Dashboard UI

Buka file:

gateway/index.html

## Contoh Output
```
Notification: Task baru: Belajar gRPC

Total Task: 1

Chart updated
```

## Error Handling

Contoh:

* Username kosong → INVALID_ARGUMENT
* User tidak ditemukan → NOT_FOUND
* User sudah ada → ALREADY_EXISTS

## Struktur Project
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
├── gateway/
│   ├── server.js
│   └── index.html
│
├── client/
│
├── package.json
└── README.md
```

## Fitur yang Dipenuhi
* ✔ Unary RPC
* ✔ Streaming gRPC
* ✔ Multi-service (≥3)
* ✔ Multi-client
* ✔ Error handling
* ✔ In-memory state
* ✔ Service-to-service communication
* ✔ WebSocket integration
* ✔ Event-driven UI (≥3 komponen)
* ✔ Server-initiated events
* ✔ Command & Control bridge
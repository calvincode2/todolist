# PRODUCT REQUIREMENT DOCUMENT (PRD)

## Aplikasi TodoList

### 1. Informasi Proyek

**Nama:** TodoList
**Platform:** Web Application

**Tech Stack**

* Frontend: React JS + Vite
* Backend: Laravel 12 REST API
* Database: MySQL
* Authentication: Laravel Sanctum
* UI: Tailwind CSS + shadcn/ui
* Alert: SweetAlert2
* HTTP Client: Axios

---

# 2. Latar Belakang

Aplikasi TodoList dibuat untuk membantu Project Manager dalam mengelola pekerjaan dan Programmer dalam mengerjakan pekerjaan yang telah diberikan.

Sistem menggunakan konsep **Kanban Board**, di mana Todo dikelompokkan berdasarkan status:

```text
PUBLISH → REVIEW → DONE
```

Todo ditampilkan dalam bentuk card dan dapat dipindahkan menggunakan **drag-and-drop** sesuai hak akses masing-masing role.

---

# 3. Tujuan Aplikasi

Aplikasi bertujuan untuk:

1. Mengelola daftar pekerjaan dalam satu sistem.
2. Membantu Project Manager memberikan pekerjaan kepada Programmer.
3. Mempermudah Programmer melihat pekerjaan yang harus dikerjakan.
4. Memantau progres pekerjaan melalui status Todo.
5. Mempermudah perubahan status menggunakan drag-and-drop.
6. Membatasi akses berdasarkan role user.

---

# 4. Role Pengguna

Aplikasi memiliki dua role:

```text
project_manager
programmer
```

## 4.1 Project Manager

Project Manager bertugas mengelola Todo secara keseluruhan.

Hak akses:

* Register/Login
* Logout
* Melihat dashboard
* Melihat seluruh Todo
* Membuat Todo
* Melihat detail Todo
* Mengedit Todo
* Menghapus Todo
* Menentukan Programmer
* Menentukan point
* Mengubah status Todo
* Drag-and-drop Todo pada seluruh status
* Melakukan review pekerjaan

## 4.2 Programmer

Programmer bertugas mengerjakan Todo yang diberikan kepadanya.

Hak akses:

* Register/Login
* Logout
* Melihat dashboard
* Melihat Todo miliknya
* Melihat detail Todo
* Memperbarui detail pekerjaan
* Drag-and-drop Todo dari Publish ke Review

Programmer tidak dapat:

* Membuat Todo
* Menghapus Todo
* Mengubah point
* Mengubah Programmer yang ditugaskan
* Mengakses Todo milik Programmer lain
* Memindahkan Todo ke Done

---

# 5. Todo Status

Todo mempunyai tiga status:

```text
publish
review
done
```

## Publish

Todo sudah dibuat dan dipublikasikan oleh Project Manager.

Artinya pekerjaan siap dikerjakan Programmer.

## Review

Todo sudah dikerjakan Programmer dan menunggu pemeriksaan Project Manager.

## Done

Todo telah diperiksa oleh Project Manager dan dinyatakan selesai.

---

# 6. Workflow Todo

Workflow utama:

```text
PUBLISH
   ↓
REVIEW
   ↓
DONE
```

### Project Manager

Project Manager dapat memindahkan Todo secara bebas antara ketiga status:

```text
PUBLISH ↔ REVIEW ↔ DONE
```

Contohnya:

```text
Publish → Review
Review → Done
Done → Review
Review → Publish
Publish → Done
Done → Publish
```

### Programmer

Programmer hanya memiliki dua status yang dapat digunakan:

```text
PUBLISH
REVIEW
```

Programmer dapat:

```text
Publish → Review
```

Programmer tidak dapat:

```text
Review → Done
Publish → Done
```

Status `done` hanya dapat ditentukan oleh Project Manager.

---

# 7. Tampilan Todo

Todo ditampilkan dalam bentuk **Kanban Board** dengan card yang dapat di-drag-and-drop.

## Project Manager

Tampilan:

```text
┌─────────────────┐
│     PUBLISH     │
├─────────────────┤
│ Todo Card       │
│ Todo Card       │
│ Todo Card       │
└─────────────────┘

┌─────────────────┐
│     REVIEW      │
├─────────────────┤
│ Todo Card       │
│ Todo Card       │
└─────────────────┘

┌─────────────────┐
│      DONE       │
├─────────────────┤
│ Todo Card       │
│ Todo Card       │
└─────────────────┘
```

Ketiga status ditampilkan sebagai **slide/area status** dan setiap Todo berbentuk card.

Card dapat dipindahkan dengan drag-and-drop.

## Programmer

Tampilan hanya:

```text
┌─────────────────┐
│     PUBLISH     │
├─────────────────┤
│ Todo Card       │
│ Todo Card       │
└─────────────────┘

┌─────────────────┐
│     REVIEW      │
├─────────────────┤
│ Todo Card       │
│ Todo Card       │
└─────────────────┘
```

Kolom `DONE` tidak ditampilkan sebagai area pekerjaan Programmer.

---

# 8. Isi Todo Card

Setiap card minimal menampilkan:

```text
Todo Name
Programmer
Status
Point
```

Contoh:

```text
┌─────────────────────────┐
│ Membuat Halaman Login   │
│                         │
│ Programmer: Calvin     │
│ Point: 10              │
│                         │
│ Status: Publish        │
└─────────────────────────┘
```

Card dapat diklik untuk melihat detail Todo.

---

# 9. Data Todo

Setiap Todo memiliki:

```text
name
status
user_id
point
description
```

Keterangan:

| Data          | Fungsi                             |
| ------------- | ---------------------------------- |
| `name`        | Nama pekerjaan                     |
| `status`      | Publish, Review, atau Done         |
| `user_id`     | Programmer yang menerima pekerjaan |
| `point`       | Nilai pekerjaan                    |
| `description` | Penjelasan pekerjaan               |

---

# 10. Todo Detail

Setiap Todo mempunyai detail pekerjaan.

Contoh:

```text
Todo:
Membuat halaman Login

Description:
Membuat halaman login menggunakan React,
menghubungkannya dengan API Laravel,
dan menangani autentikasi user.
```

Todo detail digunakan untuk menjelaskan pekerjaan secara lebih lengkap.

---

# 11. Project Manager Workflow

Flow Project Manager:

```text
Login
 ↓
Dashboard
 ↓
Todo Board
 ↓
Create Todo
 ↓
Assign Programmer
 ↓
Set Point
 ↓
Publish
 ↓
Programmer mengerjakan
 ↓
Programmer drag Publish → Review
 ↓
Project Manager melakukan review
 ↓
Project Manager drag Review → Done
```

Project Manager juga dapat memindahkan kembali Todo apabila pekerjaan belum sesuai.

Contoh:

```text
Review → Publish
```

Artinya pekerjaan dikembalikan untuk dikerjakan kembali.

---

# 12. Programmer Workflow

Flow Programmer:

```text
Login
 ↓
Dashboard
 ↓
Melihat Todo miliknya
 ↓
Pilih Todo
 ↓
Mengerjakan Todo
 ↓
Update detail pekerjaan
 ↓
Drag Publish → Review
 ↓
Menunggu Project Manager
```

Programmer tidak dapat memindahkan Todo ke `done`.

---

# 13. Authentication

## Register

User melakukan register dengan:

```text
name
email
password
confirm_password
```

`confirm_password` hanya digunakan frontend untuk memastikan password sama.

Role default:

```text
programmer
```

Project Manager tidak dibuat melalui register biasa.

---

# 14. Login

User login menggunakan:

```text
email
password
```

Backend mengembalikan:

```text
user
token
token_type
message
```

Frontend menyimpan token Sanctum.

Redirect berdasarkan role:

```text
project_manager
↓
/project-manager/dashboard
```

```text
programmer
↓
/programmer/dashboard
```

Redirect ditentukan berdasarkan:

```js
response.data.user.role
```

bukan berdasarkan email.

---

# 15. Logout

User dapat logout dari dashboard.

Flow:

```text
Klik Logout
 ↓
POST /api/logout
 ↓
Laravel menghapus token
 ↓
localStorage token dihapus
 ↓
Redirect /login
```

---

# 16. Authorization

Authentication menggunakan:

```text
Laravel Sanctum
```

Authorization menggunakan:

```text
Role Middleware
```

Role:

```text
project_manager
programmer
```

Selain role, Todo juga harus melakukan pengecekan kepemilikan.

Contoh:

```text
Programmer A
↓
hanya dapat mengubah Todo miliknya
```

Programmer A tidak dapat mengubah:

```text
Todo Programmer B
```

---

# 17. Hak Akses Todo

| Fitur             | Project Manager | Programmer |
| ----------------- | --------------: | ---------: |
| Melihat Dashboard |               ✅ |          ✅ |
| Melihat Todo      |           Semua |   Miliknya |
| Create Todo       |               ✅ |          ❌ |
| Edit Todo         |               ✅ |   Terbatas |
| Delete Todo       |               ✅ |          ❌ |
| Assign Programmer |               ✅ |          ❌ |
| Mengubah Point    |               ✅ |          ❌ |
| Drag Publish      |               ✅ |          ✅ |
| Drag Review       |               ✅ |          ✅ |
| Drag Done         |               ✅ |          ❌ |
| Publish → Review  |               ✅ |          ✅ |
| Review → Done     |               ✅ |          ❌ |
| Done → Review     |               ✅ |          ❌ |
| Done → Publish    |               ✅ |          ❌ |

---

# 18. Dashboard Project Manager

Dashboard menampilkan informasi:

```text
Total Todo
Publish
Review
Done
```

Contoh:

```text
Total Todo: 20
Publish: 8
Review: 7
Done: 5
```

Kemudian terdapat akses menuju Todo Board.

---

# 19. Dashboard Programmer

Dashboard menampilkan:

```text
Total Todo Saya
Publish
Review
```

Programmer hanya melihat pekerjaan yang ditugaskan kepadanya.

---

# 20. Todo Management

## Create

Project Manager memasukkan:

```text
Nama Todo
Description
Programmer
Point
Status
```

Status awal biasanya:

```text
publish
```

## Read

Todo ditampilkan berdasarkan role:

Project Manager:

```text
semua Todo
```

Programmer:

```text
Todo user yang sedang login
```

## Update

Project Manager dapat mengubah seluruh informasi Todo.

Programmer hanya dapat memperbarui bagian pekerjaan yang memang menjadi tanggung jawabnya.

## Delete

Hanya Project Manager.

---

# 21. Drag-and-Drop Requirement

Drag-and-drop merupakan salah satu fitur utama aplikasi.

Saat Todo dipindahkan:

```text
Publish
   ↓ drag
Review
```

Frontend mengirim perubahan status ke backend.

Contoh:

```http
PATCH /api/todos/{id}/status
```

Request:

```json
{
  "status": "review"
}
```

Backend wajib memeriksa:

1. User sudah login.
2. User memiliki role yang sesuai.
3. Todo memang boleh diubah oleh user tersebut.
4. Status tujuan valid.
5. Programmer tidak boleh memindahkan ke `done`.

Frontend tidak boleh menjadi satu-satunya tempat pembatasan status.

---

# 22. Error Handling

Frontend menggunakan SweetAlert2 untuk menampilkan:

### Success

```text
Todo berhasil dibuat
Todo berhasil diperbarui
Todo berhasil dihapus
Status berhasil diperbarui
Logout berhasil
```

### Error

```text
Email atau password salah
Anda tidak memiliki akses
Todo tidak ditemukan
Status tidak valid
Terjadi kesalahan
```

---

# 23. Responsive Design

Aplikasi harus dapat digunakan pada:

* Desktop
* Laptop
* Tablet
* Mobile

Kanban Board harus tetap dapat digunakan pada layar kecil.

Pada desktop:

```text
Publish | Review | Done
```

Pada mobile, area status dapat ditampilkan sebagai **slide horizontal** agar tidak terlalu sempit.

---

# 24. Struktur Halaman

## Public

```text
/login
/register
```

## Project Manager

```text
/project-manager/dashboard
/project-manager/todos
/project-manager/todos/create
/project-manager/todos/:id
/project-manager/todos/:id/edit
```

## Programmer

```text
/programmer/dashboard
/programmer/todos
/programmer/todos/:id
```

---

# 25. API Utama

## Authentication

```text
POST /api/register
POST /api/login
GET  /api/me
POST /api/logout
```

## Todo

```text
GET    /api/todos
GET    /api/todos/{id}
POST   /api/todos
PUT    /api/todos/{id}
DELETE /api/todos/{id}
PATCH  /api/todos/{id}/status
```

---

# 26. Database

### users

```text
id
name
email
password
role
created_at
updated_at
```

### todos

```text
id
name
status
user_id
point
created_at
updated_at
```

### todo_details

```text
id
todo_id
description
created_at
updated_at
```

Relationship:

```text
User
  1
  |
  N
Todo
  |
  1
  |
  1
TodoDetail
```

---

# 27. Security Requirement

Backend harus selalu melakukan authorization.

Contoh:

```text
Programmer:
PATCH /todos/1/status
```

Backend mengecek:

```text
Apakah login?
↓
Apakah role programmer?
↓
Apakah Todo tersebut miliknya?
↓
Apakah status tujuan = review?
↓
Update
```

Frontend hanya membantu memberikan pengalaman penggunaan yang sesuai.

---

# 28. MVP

MVP dianggap selesai apabila:

### Authentication

* Register berhasil
* Login berhasil
* Logout berhasil
* Token Sanctum bekerja
* Redirect berdasarkan role

### Project Manager

* Dashboard
* Create Todo
* Read Todo
* Update Todo
* Delete Todo
* Assign Programmer
* Set Point
* Kanban 3 status
* Drag-and-drop Publish
* Drag-and-drop Review
* Drag-and-drop Done

### Programmer

* Dashboard
* Melihat Todo sendiri
* Melihat detail Todo
* Update pekerjaan
* Kanban Publish dan Review
* Drag Publish → Review
* Tidak dapat mengakses Done

### Backend

* Authentication
* Role middleware
* Ownership check
* Validation
* Todo API
* Status authorization

---

# 29. Prinsip Utama Aplikasi

Aplikasi menggunakan konsep:

```text
ROLE
 +
OWNERSHIP
 +
STATUS
 +
DRAG & DROP
```

Ketiganya harus berjalan bersama.

Contoh:

```text
Project Manager
→ dapat mengelola semua Todo
→ dapat memindahkan semua status

Programmer
→ hanya dapat mengelola Todo sendiri
→ hanya dapat bekerja pada Publish/Review
→ tidak dapat menentukan Done
```

Status `Done` menjadi tanda bahwa pekerjaan sudah melewati proses review Project Manager.

---

# 30. Target User Experience

Penggunaan aplikasi diharapkan sesederhana:

```text
Project Manager
    ↓
Buka Todo Board
    ↓
Lihat semua pekerjaan
    ↓
Drag Todo
    ↓
Publish / Review / Done
```

dan:

```text
Programmer
    ↓
Buka Todo Board
    ↓
Lihat pekerjaan sendiri
    ↓
Kerjakan
    ↓
Drag Publish → Review
```

Dengan demikian status pekerjaan dapat dipantau secara visual tanpa harus membuka form edit setiap kali progres berubah.

# Development Commands

This file stores common commands used while developing the Badminton Shop API.

File này lưu các lệnh thường dùng khi phát triển project Badminton Shop API.

## Project

Check installed .NET SDK version:

Kiểm tra máy đang dùng phiên bản .NET SDK nào:

```powershell
dotnet --version
```

Build the whole solution:

Build toàn bộ solution để kiểm tra code có compile được không:

```powershell
dotnet build
```

Run the API locally:

Chạy backend API ở máy local:

```powershell
dotnet run --project src/BadmintonShop.Api
```

The API usually runs at:

API thường chạy ở địa chỉ:

```text
http://localhost:5120
```

## Git

Check current file changes:

Kiểm tra hiện tại có file nào mới, file nào đã sửa, file nào chưa commit:

```powershell
git status
```

Stage all changes:

Đưa tất cả thay đổi vào khu vực chuẩn bị commit:

```powershell
git add .
```

Create a commit:

Tạo một điểm lưu lịch sử code với message rõ ràng:

```powershell
git commit -m "Write a clear commit message"
```

Push commits to GitHub:

Đẩy các commit từ máy local lên GitHub:

```powershell
git push
```

Common workflow:

Quy trình Git thường dùng sau khi hoàn thành một phần việc:

```powershell
git status
git add .
git commit -m "Add feature name"
git push
```

## Entity Framework Core

Create a new migration after changing entities or DbContext:

Tạo migration mới sau khi thay đổi Entity hoặc AppDbContext. Migration là file kế hoạch thay đổi cấu trúc database:

```powershell
dotnet ef migrations add MigrationName --project src/BadmintonShop.Api --startup-project src/BadmintonShop.Api
```

Example:

Ví dụ tạo migration khi thêm bảng Categories:

```powershell
dotnet ef migrations add AddCategories --project src/BadmintonShop.Api --startup-project src/BadmintonShop.Api
```

Apply pending migrations to PostgreSQL:

Áp dụng các migration chưa chạy vào PostgreSQL để database thật được cập nhật:

```powershell
dotnet ef database update --project src/BadmintonShop.Api --startup-project src/BadmintonShop.Api
```

Remove the latest migration if it was created by mistake and has not been applied to the database:

Xóa migration mới nhất nếu vừa tạo sai và chưa update vào database:

```powershell
dotnet ef migrations remove --project src/BadmintonShop.Api --startup-project src/BadmintonShop.Api
```

## PostgreSQL

Check PostgreSQL command-line client version:

Kiểm tra phiên bản công cụ psql của PostgreSQL:

```powershell
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" --version
```

Default local database settings:

Thông tin database local mặc định của project:

```text
Host: localhost
Port: 5432
Database: badminton_shop
Username: postgres
```

Do not commit real database passwords to GitHub.

Không commit password database thật lên GitHub.

## API Testing

Run the API first:

Trước khi test API, cần chạy backend trước:

```powershell
dotnet run --project src/BadmintonShop.Api
```

Then test requests in:

Sau đó test các request trong file:

```text
src/BadmintonShop.Api/BadmintonShop.Api.http
```

Install the VS Code REST Client extension if the file does not show Send Request links.

Cài extension REST Client trong VS Code nếu file .http không hiện nút Send Request.

## Feature Checklist

When adding a new CRUD feature, usually follow this order:

Khi thêm một chức năng CRUD mới, thường làm theo thứ tự này:

```text
1. Create Entity
2. Add DbSet to AppDbContext
3. Create DTOs
4. Create Controller
5. Build the project
6. Add EF Core migration
7. Update database
8. Add .http test requests
9. Test API
10. Commit and push
```

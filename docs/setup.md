# Volunti — Local Setup

## 1. Clone & branch

```bash
git clone <repo-url>
cd VoluntiFinal
git checkout -b feature/YourNameBackend   # or YourNameFrontend
```

## 2. Backend — `appsettings.Development.json`

Create `backend/Volunti/appsettings.Development.json` (gitignored, do NOT commit). Replace the connection string with your own LocalDB / SQL Server, and generate your own JWT key (see step 3).

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=(localdb)\\MSSQLLocalDB;Database=VoluntiDb;Integrated Security=True;Encrypt=True;TrustServerCertificate=True;Connect Timeout=30"
  },
  "Jwt": {
    "Key": "REPLACE_WITH_GENERATED_KEY",
    "Issuer": "Volunti",
    "Audience": "VoluntiUsers"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*"
}
```

The database is created automatically on first run by `db.Database.Migrate()` in `Program.cs` — no manual SQL needed.

## 3. Generate a JWT signing key

The backend uses HS512 (see `SecurityAlgorithms.HmacSha512Signature` in `TokenService.cs`), which requires a key of at least 512 bits = 64 bytes.

**Git Bash / Linux / Mac:**

```bash
openssl rand -base64 64
```

**PowerShell:**

```powershell
[Convert]::ToBase64String((1..64 | ForEach-Object { Get-Random -Maximum 256 }))
```

Paste the output into `Jwt:Key` in `appsettings.Development.json`.

## 4. Run

**Backend** (Visual Studio): open `backend/Volunti.slnx`, F5.
**Frontend**: `cd frontend && npm install && npm run dev`.
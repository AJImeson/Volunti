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
**Frontend**: `cd frontend/Volunti.Web && npm install && npm run dev`.

## Useful commands

- `git blame src/App.jsx` — shows who wrote each line and when
- `git log --oneline src/App.jsx` — commit history for a file
- `q` — exit git pager view
- `git add -A` — stage all changes across the repo (handles new + deleted files)

## Architecture notes

- **Token expiry**: hardcoded to 1 day in `backend/Volunti/Service/TokenService.cs` (`DateTime.UtcNow.AddDays(1)`) 
- **JWT algorithm**: HS512 (requires 64-byte key minimum).
- **CORS**: `AllowAnyOrigin()` in dev, allowlist in prod (see `Program.cs`).
- **OrgRegister context**: one `<OrgRegisterProvider>` wraps all 4 step routes via a layout route + `<Outlet />` in `App.jsx` so `formData` survives navigation.
- **Frontend env vars**: `VITE_API_BASE` in `frontend/Volunti.Web/.env.development` (`http://localhost:5066`) and `.env.production` (deployed API URL).

## Known issues (Phase 2 polish)

- OrgRegister Step 1: field order is off (Namn should be first, confirm password missing, confirm email duplicated)
- OrgRegister Step 1: missing organisationsnummer field
- OrgRegister Steps 1-4: no client-side validation — "Nästa" button works even with empty required fields (compare to RegisterForm.jsx which has full `validateStep()` logic)
- OrgRegister Step 4: on successful registration, navigates to `/profile` (volunteer page) instead of `/org-dashboard` — wrong landing page for org accounts


## Production TODOs (DevOps)

- Set `Jwt:Key`, `Jwt:Issuer`, `Jwt:Audience` as environment variables / secrets (NEVER commit `appsettings.Production.json` with a real key)
- Lock CORS to `https://volunti.se` and `https://volunti.doe25.swarm.chas-lab.dev`
- Move JWT to httpOnly cookie (Phase 3 in roadmap)
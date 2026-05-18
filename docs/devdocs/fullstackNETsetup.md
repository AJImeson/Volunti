# Volunti — Local Setup

## 1. Clone — TWO folders (one per branch)

Working from a single folder and switching branches causes git to swap files between backend and frontend versions, which leads to lost work and merge conflicts. Use two clones instead — one for each branch.

```bash
cd ~/Documents

# Backend folder - stays on feature/YourNameBackend permanently
git clone <repo-url> VoluntiFinal
cd VoluntiFinal
git checkout -b feature/YourNameBackend
cd ..

# Frontend folder - stays on feature/YourNameFrontend permanently
git clone <repo-url> voluntiFrontend
cd voluntiFrontend
git checkout -b feature/YourNameFrontend
```

Open `VoluntiFinal/backend/Volunti.slnx` in **Visual Studio**.
Open `voluntiFrontend/frontend/Volunti.Web` in **VS Code**.
Never switch branches in either folder.

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

**Backend** (Visual Studio): open `VoluntiFinal/backend/Volunti.slnx`, F5. Runs on `http://localhost:5066` (HTTP) and `https://localhost:7007` (HTTPS).
**Frontend** (VS Code terminal): `cd voluntiFrontend/frontend/Volunti.Web && npm install && npm run dev`. Runs on `http://localhost:5173`.

## Useful commands

- `git blame src/App.jsx` — shows who wrote each line and when
- `git log --oneline src/App.jsx` — commit history for a file
- `q` — exit git pager view
- `git add -A` — stage all changes across the repo (handles new + deleted files)
- `git checkout origin/feature/OtherBranch -- path/to/file` — pull a single file from another branch without switching (used to move work between branches without conflicts)
- `git cherry-pick <commit-hash>` — apply one specific commit from another branch onto current branch

## Architecture notes

- **Token expiry**: hardcoded to 1 day in `backend/Volunti/Service/TokenService.cs` (`DateTime.UtcNow.AddDays(1)`)
- **JWT algorithm**: HS512 (requires 64-byte key minimum)
- **JsonStringEnumConverter**: registered globally in `Program.cs` so enums (JobCategory, ApplicationStatus, JobStatus) serialize as strings in both directions — POST accepts `"Cleaning"`, GET returns `"Approved"` instead of `0`/`1`/`2`
- **CORS**: `AllowAnyOrigin()` in dev, allowlist in prod (see `Program.cs`)
- **OrgRegister context**: one `<OrgRegisterProvider>` wraps all 4 step routes via a layout route + `<Outlet />` in `App.jsx` so `formData` survives navigation
- **Frontend env vars**: `VITE_API_BASE` in `frontend/Volunti.Web/.env.development` (`http://localhost:5066`) and `.env.production` (deployed API URL)
- **Org lookup with fallback**: backend endpoints that need the user's org first check `Organizations.UserId` (OrgAdmin = org creator), then fall back to `OrganizationMembers.UserId` (OrgUser = invited member) — applied in `POST /jobs`, `GET /jobs/mine`, `GET /applications/mine`
- **Route order matters**: `GET /jobs/mine` must be registered BEFORE `GET /jobs/{id}` in `JobEndpoints.cs`, otherwise ASP.NET tries to parse `"mine"` as an int and throws `Failed to bind parameter`
- **Role-based login redirect**: `LoginForm.jsx` reads role from JWT and routes to `/org-dashboard` (OrgAdmin), `/org-user-dashboard` (OrgUser), or `/missions` (Volunteer)

## Dashboard endpoints

- `GET /jobs/mine` — returns jobs belonging to logged-in user's org (OrgAdmin + OrgUser)
- `GET /applications/mine?status=Pending` — returns applications for the org's jobs, optional status filter
- `PUT /applications/{id}` — approve or reject application, body `{ "status": "Approved" }` or `"Rejected"` (OrgAdmin only — OrgUser gets 403)
- `POST /org/members` — OrgAdmin invites a new OrgUser to the org (creates AppUser + OrganizationMember row)

## Dashboards built today

- `/org-dashboard` — Adminpanel (OrgAdmin): publish jobs, see applications, Godkänn/Avvisa buttons
- `/org-user-dashboard` — Medarbetarpanel (OrgUser): publish jobs, read-only application list with note "Endast administratörer kan godkänna eller avvisa ansökningar"
- Both reuse `OrgDashboard.css` (DRY)

## Known issues (Phase 2 polish)

- OrgRegister Step 1: field order is off (Namn should be first, confirm password missing, confirm email duplicated)
- OrgRegister Step 1: missing organisationsnummer field
- OrgRegister Steps 1-4: no client-side validation — "Nästa" button works even with empty required fields (compare to `RegisterForm.jsx` which has full `validateStep()` logic)
- CreateJobForm: time inputs (`datetime-local`) display the date pickers but `--:--` won't accept input
- CreateJobForm: category list mismatches backend `JobCategory` enum — frontend sends Swedish labels ("Miljö", "Djur") but backend expects English enum names ("Cleaning", "Teaching", etc.)
- CV upload (profile): 404 when uploading PNG — backend file upload endpoint either missing or filtering by file type
- `Jwt:ExpiresInMinutes` in `appsettings.Development.json` is unused — actual expiry is hardcoded in `TokenService.cs` (`AddDays(1)`); wire it into config or delete the setting
- OrgUser dashboard: Godkänn/Avvisa buttons aren't shown (correct), but profile/settings pages still show volunteer-specific fields like skills/interests — Phase 2 should split into role-specific profile pages

## Production TODOs (DevOps)

- Set `Jwt:Key`, `Jwt:Issuer`, `Jwt:Audience` as environment variables / secrets (NEVER commit `appsettings.Production.json` with a real key)
- Lock CORS to `https://volunti.se` and `https://volunti.doe25.swarm.chas-lab.dev`
- Move JWT to httpOnly cookie (Phase 3 in roadmap)
- Generate fresh JWT signing key for production — never reuse a dev key
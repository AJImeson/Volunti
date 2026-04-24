* Instructions for Personal Access Token

+ Create the token

1. In the GitLab home screen - Click on Profile Avatar and select Edit Profile
2. Left sidebar - Access Tokens
3. Click on Add new Token
4: Configure:

	Name: Relevant for purpose
	Expiration: Optional
	Scopes: Basic VS-Code, check following; api, read_user, read_repository and write_repository

6. Click Create personal access token

Note: When your token has been generated copy it immediately, as soon you leave this creation page you will not be able to see it again

+ Authenticate in VS-Code or Terminal

A | In vs-code:

1. Install GitLab workflow
2. Open Command (CTRL/CMD+Shift+P)
3. Type Gitlab:Authenticate and enter
4. Choose instance/server - In our case, https://git.chas-lab.dev/
5. Select A new personal Access token and paste the one generated on Gitlab

B | Terminal:

1. First clone our repo (Burgundy) and a login prompt will appear.
2. When asked for Username, enter your credentials. When asked for password , paste your Personal Access Token, Windows/Mac/Linux should save this in credential manager for future pull/push without the need of manually entering your credentials every time you perform an action

+ SSH Keys

1. Generate

ssh-keygen -t ed25519 -C "your-email@example.com"

When prompted:

- File location — press Enter to accept the default (C:\Users\YourName\.ssh\id_ed25519)

- Passphrase — type a passphrase or press Enter for none

This creates two files:

~/.ssh/id_ed25519 — your private key (Keep private)
~/.ssh/id_ed25519.pub — your public key (Use this for GitLab)

2. Copy the Public Key

Get-Content ~/.ssh/id_ed25519.pub | Set-Clipboard

3. Add the Key to GitLab

- Log in to GitLab
- Go to Settings → SSH Keys (or navigate to /-/user_settings/ssh_keys)
- Paste your public key into the Key field
- Give it a recognizable Title (e.g. "Laptop" or "Home PC")
- Optionally set an Expiration date
- Click Add key

4. Test the Connection

- ssh -T git@git.chas-lab.dev

If it works you'll see a welcome message like:
Welcome to GitLab, @yourusername!

5. Start Using SSH URLs

- When cloning, use the SSH URL instead of HTTPS:
bashgit clone git@git.chas-lab.dev:your-group/your-project.git

- For an existing repo already cloned over HTTPS, switch the remote:
bashgit remote set-url origin git@git.chas-lab.dev:your-group/your-project.git

+ Troubleshooting

- "Permission denied (publickey)" — make sure the OpenSSH Authentication Agent service is running:

    - Get-Service ssh-agent | Set-Service -StartupType Automatic -PassThru | Start-Service
    - ssh-add ~\.ssh\id_ed25519

+ Multiple SSH keys

- If you have more than one key, create or edit ~/.ssh/config:

Host git.chas-lab.dev
    HostName git.chas-lab.dev
    User git
    IdentityFile ~/.ssh/id_ed25519 

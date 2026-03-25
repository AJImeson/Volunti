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

 


* CI/CD Tools

    - Built in:

        - SAST Security test - GitLab
        - Secret Detection - GitLab
    
* Pipeline Needed

    - Lint: Check language "grammar"
    - Build: Build app/projects code
    - Test: Run through before packaging
    - Container: Docker
    - Database: MS SQL

* Pipeline Set

    - Root: lint - Root
    - Frontend: build, container-build, test, deploy - Directory 
    - Backend: build, container-build, test, deploy - Directory
        

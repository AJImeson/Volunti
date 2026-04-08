
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

* Pipeline/Stages Set

    - Root: lint - Root
    - .gitlab-ci: security (For built in)
    - Frontend: build, container-build, test, deploy - Directory 
    - Backend: build, container-build, test, deploy - Directory
        

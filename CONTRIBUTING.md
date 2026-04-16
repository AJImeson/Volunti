* Contributing Guidelines 

    * Branching

        - Two branches in the repo: main and Develop
        - Main works as production, this is where completed finished work will be pushed to from Develop.
        - Branch from Develop - Feature branches, own workspace 
        - When resuming work from previous sessions, don't forget to git pull before continuing to avoid conflicts
        - Name your branch accordingly for idea/purpose:

                - DevOps/pipeline for builds skeleton
                - DevOps_test/building test for database

        - If conflicts appear, this worflow can solve for your specific branch:

            - git checkout/switch <branch_name>
            - git fetch origin
            - git rebase origin/main
            - git status <-- Review the conflicts
            - git add <files> <-- This adds the files where the conflicts appear
            - git rebase --continue
            - git push --force-with-lease origin <-- Safeguard if several people are working at the same time

    * Commits

        - Conventional Commits? Great for clear understanding of work flow 
        - English descriptive, general examples: 

            - "Fixed typo in frontend"

        - For specific changes, examples: 

            - "feat/added button for frontend"
            - "fixed/bug in Entity"
            - "docs:DevOps/updated log for 2026-04-08"
            - "ci:build/new build logic for backend"
            - "cd/built deploy to portainer"

    * Pipelines

        - One file for each stage in relevant directory (Except for built in templates and lint.yml)
        - If a pipeline fails, fix the issue according to the logs that will appear. No merging of failed pipelines (as long as it's not the pipeline that is the issue)  

    * Documentation 

        - Log your activity and thoughts for traceback and development
        - Also for project viewers to acknowledge that we document properly but also keep it simple

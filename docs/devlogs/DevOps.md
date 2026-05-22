
* 2026-03-11

    - Repo for project created - Axel
    - Created directories for documentation - Axel 
    - Created token guide with instructions - Axel
    - Pipeline yml file created in project root - Axel

* 2026-03-13

    - Created guide for documentation use - Axel
    - Inserted info from google docs agreement and defined workflow - Axel
    - Fixed SCRUM sprint suggestions and linked Jira to repo - Mika

* 2026-03-16

    - Dockerfile created for each directory - Axel
    - docker-compose.yml created in root - Mika

* 2026-03-17

    - Created pipeline lint/build/test files as template - Axel
    - Added .gitignore to repository - Axel
    - Dockerfile mapping added - Axel
        At this point, complete mapping of .yml files and container related files will need to wait until tech stacks are decided

* 2026-03-25

    - Added .yml files for deploy stage in front end and back end directories. Updated .gitlab-ci.yml with stage logic - Axel

* 2026-03-28

    - Runner created in gitlab-ci - Mika

* 2026-03-30

    - Debuging runner, issue with docker socket connection - Mika&Axel
        Fixed: typo in docker-compose
    - Created .gitattributes file for future file ending handling - Axel
    - Created a database directory - Axel

* 2026-04-04

    - Sorted and structured Jira for more readability - Mika

* 2026-04-07

    - Created variable for password in repo - Mika
    - Pipeline mapping for .gitlab-ci.yml - Mika

* 2026-04-08

    - Updated CONTRIBUTING.md for more clarity - Axel
    - Added security stage for built in GitLab testing - Axel

* 2026-04-16

    - Decided to skip the lintin pipeline and designt a pre commit linting test instead - Axel & Mika
    - Built test and container-build for backend - Mika & Axel

* 2026-04-20

    - Started skeleton for two separate branches:
        feature/DevOps-Portainer | For testing and deploying to Portainer
        feature/DevOps-Testing | Future Kubernetes working branch 
                                                                        /Axel & Mika

* 2026-04-21

    - Started creating variables and mapping for pipelines in Portainer branch - Axel & Mika
    - Created mock-data for both frontend and backend for testing and integrating - Axel 
    - Stack is succesfully deployed but can't see frontend (React) on purposed URL (404 not found error) - Axel & Mika

* 2026-04-22

    - Removed the mock data and replaced with code from developers in both frontend and backend for integrating and testing - Axel & Mika
    - Sucesfully deployed the frontend stack to a working URL - Mika

* 2026-04-30

    - Fixing workflow rules for .gitlab-ci.yml, several deployments per branch occured - Axel

* 2026-05-04

    - Branched out a Monitoring branch for grafana - Axel

* 2026-05-05

    - Branched out a K3s branch for Kubernetes implementation - Mika
    - Cleaned repository, deleted obsolete branches and merged frontend&backend logic for new 

* 2026-05-06

    - Worked on logic and pipeline building for Grafana monitoring, pipelines pass but no stack for Grafana is built.

* 2026-05-07

    - Structured K3s branch for future implementation of Kubernetes for a multi stack build - Mika
    - Debugging of the monitoring stack - Axel

* 2026-05-11

    - Started mapping out K3s scripts and - Mika
    - Continous debugging and fixing of monitor stack - Axel

* 2026-05-13

    - Created base ingresses and secrets for database - Mika
    - Monitoring succesfull in own stack - Axel

* 2026-05-15

    - Continous implementation of K3s, backend and frontend deployment - Axel & Mika
    - Monitoring in K3s more sucessfull, connected and prometheus scraping - Axel

* 2026-05-18

    - Sealed secrets fixed for project - Mika
    - Monitoring in K3s more or less completed, set more alerts and CPU for backend? 

* 2026-05-20

    - Application working in K8s cluster, need debugging - Axel & Mika 
>>>>>>> origin/Develop

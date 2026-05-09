
- Volunti is a volunteer coordination platform, connecting individuals with nonprofit organisations and other entities seeking volunteer support.

    - The platform serves main purpose for the following two entities:

        - Volunteers — Individuals who create a profile with their availability, location (municipality), maximum travel distance, skills, interests, and notification preferences, then browse and apply to vacant charity jobs and tasks, depending on set preferences.

        - Organisations — Registered entities that create a profile and post jobs and tasks for volunteers, listings with details such as:

            - Category 
            - Time 
            - Location
            - Critical status
            - Organisation

- Core features (backend API):

    - JWT-authenticated registration and login for both Volunteers and Organisations
    - Role-based access control (Volunteer, OrgAdmin, OrgUser)
    - Admins from organisations can invite sub-members under their organisation, for easy management of listings
    - Volunteer opportunity (job) listings — Browse freely trough all or search by ID
    - Organisation catalogue — Browse freely through all or search by ID
    - Password reset via secure authentication and authorisation
    - Data models for messaging, notifications, and volunteer applications (in progress)
    - Social media community for building relationships and connecting (in progress)

  *Tech stack: ASP.NET Core (.NET 10) minimal API, Entity Framework Core, SQL Server, ASP.NET Identity, JWT Bearer authentication.

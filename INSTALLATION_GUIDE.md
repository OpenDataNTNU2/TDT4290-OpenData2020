# Installation Guide
This section describes the steps needed to set up a new instance of our product.

The full deployed system spans three servers, two of which use off-the-shelf services, and one which our codebase is deployed to. Our codebase is divided into two parts, frontend and backend, which can be deployed onto separate servers, but we have decided to host them together on one.  

The frontend and backend can be run on a server and be accessed through a web- or ip-address, they can be run locally, or the frontend can be run locally while accessing the backend via a server.

Our codebase requires two external services to function, GitLab and PostgreSQL, which need to be set  up on their own servers. 

## GitLab
Our system requires a GitLab CE (Community Edition) instance (or alternatively a premium Enterprise Edition) for forum and discussion functionality.

### Setting up a GitLab instance
If you do not have a working GitLab installation, please see the official GitLab documentation:

- [https://docs.gitlab.com/omnibus/installation/](https://docs.gitlab.com/omnibus/installation/)
- [https://docs.gitlab.com/ee/install/](https://docs.gitlab.com/ee/install/)

Before continuing, ensure that the GitLab instance has been configured correctly with the correct host address, and has a working root user.

### Creating an OpenData user
The OpenData platform requires a user on GitLab in order to perform the necessary actions to uphold the GitLab project states in accordance with the current information on the platform.

1. Register a new GitLab user with a desired username, like "OpenData" or "Datakatalog", and a secure password. This will be the user used by the system.
2. Log in to the GitLab root user, and under the admin area, go to the user list and edit the OpenData user’s access level to admin level.
3. Log in to the OpenData user, and under the user settings page, enter the Access Tokens section, and create a new API key for the open data user. The API key should have the scope of the full API.

### Setting up OpenData project groups
The GitLab project structure for datasets and coordinations involves a general group for all open data projects, containing subgroups for publishers, and a subgroup for coordinations. While subgroups for publishers are generated automatically, the general open-data project group and coordination subgroup should be generated manually in order to ensure the desired project structure and default settings.

- While logged in as the OpenData user, go to the gitlab group page, and create a new group. Choose a suitable name such as "OpenData" or "Datakatalog". Make sure the visibility level is set to "Public".
- Inside the OpenData project group, create a new subgroup using the green button. Click the extender symbol to choose a new subgroup instead of a new project. Choose a suitable name such as "Samordninger" or "Coordinations". Make sure the visibility level is set to "Public".

### Setting up discussion board labels
Each GitLab project will also get an issue discussion board upon creation. The labels (columns) that show up on this issue board are the same as the labels defined for the main OpenData group.

- While logged in as the OpenData user, go to the Issue section of the general OpenData group, and find the Labels section. Ignore the labels "To Do" and "Doing" if there are any.
- Create the desired labels for the discussion board, with the desired names and colors. The labels will be assigned columns on the generated discussion boards based on their order of creation, so make sure the ordering is correct.

### Configuring the GitLab integration
The configuration file of the backend contains a section for GitLab which looks like the following:

```javascript
"Gitlab": {
    "GitlabHost": "http://gitlab.com",
    "GitlabApi" : "/api/v4/",
    "GitlabApiToken": "Token for connecting to gitlab API",
    "Projects": {
        "OpenDataUsername": "opendata",
        "OpenDataPassword": "open data password",
        "OpenDataUserId": 1,
        "OpenDataNamespaceId": 2,
        "OpenDataCoordinationsNamespaceId": 3,
        "IssueDiscussionBoardName": "Diskusjon"
    }
}
```

- **"GitlabHost":** this is an url to your gitlab instance.
- **"GitlabApi":** the current integration uses the API v4. Leave this as is.
- **"GitlabApiToken":** this is the token we created previously.
- **"OpenDataUsername":** username of the created OpenData user.
- **"OpenDataPassword":** password of the created OpenData user. This is required in order to access GitLab functionality normally only available through the Enterprise Edition API.
- **"OpenDataUserId":** this is the user ID of the OpenData user, found on the user settings page for the OpenData user.
- **"OpenDataNamespaceId":** this is the group ID of the general OpenData group. This can be found on the main group page of the group if you are logged in.
- **"OpenDataCoordinationsNamespaceId":** this is the group ID of the coordinations group. This can be found on the main group page of the group if you are logged in.
- **"IssueDiscussionBoardName":** this is the name of the generated issue discussion boards for the projects. Choose something sensible like "Discussion" or "Diskusjon".

### GitLab default user settings
To prevent abuse of the GitLab instance, the following settings are recommended. These settings are found on the Admin Area, under Settings -> General.

- **Account and limit -> default projects limit: 0.** This ensures only authorized users are able to create new projects. Normally only the OpenData user should create projects.
- **Account and limit -> New users set to external: checked.** All new registered users should be marked as external users, until otherwise authenticated. External users can still participate in discussions on public projects.

## PostgreSQL
While many database solutions could be used, this project uses a PostgreSQL database instance to store data for the platform. Our PostgreSQL instance is running on a CentOS 8 virtual machine, installed after the following guide:

[https://www.digitalocean.com/community/tutorials/how-to-install-and-use-postgresql-on-centos-8](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-postgresql-on-centos-8)

### Setup
The following steps are required for the system to use the PostgreSQL instance:

1. Create a database for the platform with a reasonable name like "opendata_db", and create a user for the OpenData platform with access privileges to the database.
	On our postgres instance this can be achieved by using the psql client tool:
	```bash
	sudo -u postgres createdb opendata_db
	sudo -u postgres psql
	```
	and running the following PostgreSQL commands: 
	```sql
	create user opendata with password 'very-secure-password';
	grant all privileges on database opendata_db to opendata;
	```
2. Ensure that the postgres instance allows connections from the OpenData backend to the opendata database with the opendata user authenticated using password. This is done by adding a record in the `pg\hba.conf` file according to the documentation:  
	[https://www.postgresql.org/docs/current/auth-pg-hba-conf.html](https://www.postgresql.org/docs/current/auth-pg-hba-conf.html)  
	The line could look something like any of the following, differentiated by the allowed source addresses:
	```
	host   opendata_db  opendata  <backend ip>   scram-sha-256
	host   opendata_db  opendata  0.0.0.0/0      scram-sha-256
	host   opendata_db  opendata  ::0/0          scram-sha-256
	```
	It should be noted that it is not recommended to allow arbitrary connections from any host in a production environment.
3. The first time the backend connects to the database, new tables matching the data model will automatically be generated. Therefore it is not necessary to create any tables in the database manually.

#### Connection string
The connection string used by the backend to connect to the PostgreSQL instance should contain the postgres host, database, username and password, your configuration file should contain the following line:
```javascript
"ConnectionStrings": {
    "PostgreSQL": "Host=postgres.host.com;
            Database=opendata_db;
            Username=opendata;
            Password=very-secure-password"
}
```

## Our system
With a database and a GitLab instance configured, it is possible to run the system. This involves installing prerequisites and configuring the system, for both the backend and the frontend.

The prerequisite libraries and software for the project are:
- **Git:** our codebase is hosted on GitHub, and can be cloned to any machine via Git.
- **Node package manager:** npm will install all other frontend dependencies using the package.json-file.
- **.NET:** dotnet will install all other frontend dependencies using the .csproj-file.

The first step is then to clone the GitHub repository onto your machine. After downloading our code, there are two folders containing the code for our frontend and backend each, and one folder for supplementary material.

Within the top-level folder, there is a README containing information about the project and references to three other README's, as well as a copy of the user guide from below. The frontend and backend README's contain more technical information about the deployment and testing of the project, while the config README has more extensive description of how to set the project up on a server.

### Backend
Our backend is built on .NET, and uses `dotnet` as the primary command.  
The backend program is configured through the `appsettings.json`-file, and local override files.  
In addition to the Gitlab section, as described in the section "Configuring the GitLab integration", there are a few variables to take note of here:
- **"ConnectionStrings" -> "PostgreSQL":** this variable contains the connection string from the section above.
- **"Kestrel" -> "EndPoints" -> "Http" -> "Url":** this variable is the address and port that other services access the backend through.
- **"identifierUrl":** this variable refers to the address that is used to generate the access point address for each dataset, to save in their database entry.

Of these, the "PostgreSQL", as well as the "GitlabToken" and the "OpenDataPassword" from the Gitlab section, are considered secrets, and should therefore not be stored openly on a public service like GitHub.

### Frontend
Our frontend is built on Node.js, and therefore uses `npm` as the primary command.  
The frontend program is configured through the `.env`-file, and local override files.  
The frontend has much fewer connections and variables than the backend, so the configuration file contains only two values:  
- **NEXT_PUBLIC_DOTNET_HOST** this variable is the address through which the frontend accesses the backend.
- **PORT** this variable is the port-number that the frontend will listen for requests through.

## Local
It is possible to run the frontend and backend on the same machine, and access them locally, for development purposes.

### Configuration
#### Backend
To configure the backend for local use, navigate to the folder `.\config\backend` and find the file `appsettings.Development.json`. This file should be copied to the `.\backend` folder. Inside this file are default settings for running the backend in production.  
This file needs to be modified in three areas to function properly, but only one is crucial for development.  
The PostgreSQL string needs to be filled in so that the application will we populated with datasets. To get this string, see above in the section on PostgreSQL.  
The Gitlab section also needs to be filled in, as described in its section above. Primarily, the GitlabHost and GitlabToken values need to be filled in to be able to form links to the Gitlab service.  
Some features may not work correctly without a proper identifierUrl, but when running the project locally, this is unavoidable.  
The endpoint is set up to be "http://localhost:5000" by default, and can be accessed in-browser through the address [http://localhost:5000/swagger/index.html](http://localhost:5000/swagger/index.html)

#### Frontend
To configure the frontend for local use, no further configuration is needed. However, to avoid unexpected changes when the repository is altered, it is recommended to copy the file `.\config\frontend\.env.local` into your `.\frontend` folder.

### Running
To run the system locally, it is necessary to download all dependencies first:  

#### Backend
For the backend, open a command line interface in the backend folder, and use the command
```
dotnet restore
```
Afterwards, you can run the backend using the command
```
dotnet run
```

#### Frontend
For the frontend, open a command line interface in the frontend folder, and use the command
```
npm install
```
Afterwards, you can run the frontend using the command
```
npm run dev
```

Once the system is successfully running, it can be accessed through [http://localhost:3000](http://localhost:3000)

## Server
For production/deployment, the frontend and backend can be set up on a server and accessed via the internet.

### Configuration
#### Backend
To configure the backend for production, which is to say, on a server, more values need to be provided.  
An example configuration is provided in `.\config\server\backend\appsettings.Production.json`, but some values must be filled in:
- **"PostgreSQL":** string for connecting to the database, see section above on PostgreSQL.
- **"Url":** this variable should be the address of the server, including the port you want the backend to listen to. Important note for special characters (æ, ø, å): this string should not be in punycode. e.g. it should be `samåpne`, not `xn--sampne-kua`.
- **"identifierUrl":** Address of the API path for datasets, used to store the API-pages of each dataset in the database.

In addition, the Gitlab values need to be filled in, as described in its section above.

When this is running correctly, navigating to your chosen endpoint, with the added path "/swagger/index.html" should show the auto-generated interactive API documentation page.

#### Frontend
To configure the frontend for a server, only one variable needs to be set. Copy the configuration example provided in `.\config\server\frontend\.env.local`, and override the NEXT_PUBLIC_DOTNET_HOST variable with your chosen endpoint for the backend. You can optionally alter the port number by changing the PORT variable.

### Running
To run the system on a server, bash scripts are provided. These assume a particular server file structure, and a linux operating system. For alternate ways of running the system, consult `.\config\README.md`.

The file structure assumed on the server is that within the user directory of user "student" (identified as `~` or `\home\student`) is a folder with the name of one repository branch (release or dev), which serves as the top-level folder of the repository. Also in the user directory is one folder "shortcuts", containing symlinks to the `.\config\server\scripts` and `.config\server\webhooks` folders, but this is optional to recreate.

With this file structure, running the server involves first invoking the `build.sh` script, and then the `run.sh` script, both with a command line argument of your chosen branch/folder. From within the scripts folder or the scripts symlink in "shortcuts", that may look like:
```
./build.sh dev
./run.sh dev
```
The folder also contains `stop.sh`, which takes no command line argument, and simply shuts down all instances of the frontend and backend, as well as `update.sh`, which pulls the newest version of the branch given as command line argument.

### Webhooks
To automatically deploy the system using Continuous Integration, the server needs Python3 installed. When making a fresh clone of the repository, a python environment must be built in `.\config\server\webhooks` by running the command:
```
source ./bin/activate
```
Then, you can invoke the script `runWebhookListener.sh` to start listening for webhook requests on port 8080. By default, it only listens for changes to dev, but both the tracked branches and the port can be changed by modifying the `.\config\server\webhooks\main.py`-file.  
It is recommended that you make this script be called whenever the server reboots, which involves putting a new bash script of any name in the `\etc\init.d` folder:
```
#!/bin/bash
at now + 1 min -f /home/student/shortcuts/runWebhookListener.sh &
```

Afterwards, the webhook must be added to the GitHub project, under the project's Settings -> Webhooks.
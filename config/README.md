## Frontend
Find the `.env.local` file in `./frontend`, and copy it directly in the frontend folder to override the backend host address.  
This is not needed by default, but should be done to ensure changes to the repo don't affect your settings.  
Single #-signs are used to comment out a line.

## Backend
Find the `appsettings.Development.json` file in `./backend`, and copy it directly into the backend folder.  
The default settings are mostly not needed for development, but there are three secrets that must be filled in, which you can read about in `../backend/README.md`.  

## Server
The `.env.local file` in frontend should be copied from `./server/frontend`.
The `appsettings.Development.json` file should instead be `appsettings.Production.json`, an example of which an be found in `./server/backend`.  
You will still need to put in the secrets, as specified in `../backend/README.md`.  
If the server should eventually need a https certificate, these things should change:  
* `frontend/pages/api/serverSideProps.js`, use require('https') instead of 'http'
* `backend/appsettings.Production.json`, in Kestrel, a certificate must be made and referenced, and an http endpoint must be configured.
* Follow [this StackOverflow question](https://stackoverflow.com/questions/55485511/how-to-run-dotnet-dev-certs-https-trust), using the workaround for non-windows OS's. A localhost.conf file is provided in `config/server/`, but an official certificate must be provided by third parties, or users will have to override their browsers security protection.

### Server routes
The server has multiple ports dedicated to this project:
* 80: This port is still being used for the default Apache2 ubuntu page, visible when accessing [katalog.samåpne.no](katalog.samåpne.no). Ideally, the release frontend of the program gets registered to this port.
* 8080: This port is used for webhook POST requests. Specifically 8080/git-push.
* 3000: This is the port configured for the frontend of the dev branch. Go to [katalog.samåpne.no:3000](katalog.samåpne.no:3000) to access the working system.
* 5000: This is the port configured for the backend of the dev branch. Go to [katalog.samåpne.no:5000/swagger/index.html](http://katalog.xn--sampne-kua.no:5000/swagger/index.html) to access the API documentation.
* 3001: This is the port configured for the frontend of the release branch. [katalog.samåpne.no:3001](katalog.samåpne.no:3001)
* 5001: This is the port configured for the backend of the release branch. [katalog.samåpne.no:5001/swagger/index.html](http://katalog.xn--sampne-kua.no:5001/swagger/index.html)
All branches use http, not https.


### Running the server
The key difference between running locally and running the server, is that the backend cannot easily be run in development mode, as this mode stops executing once other tasks are started in ubuntu.  
After connecting to the server through PuTTY you have two options:  

#### Using bash scripts
Scripts are found in the folder `./server/scripts`, as well as in `~/shortcuts/scripts` (a shortcut to the scripts in the dev repository, specifically). When developing the project further, a dedicated branch to use for updating the scripts on the server would be ideal.  
All scripts can take one command line argument, to specify both the git branch and the local folder name. The default is dev. Example: `./run.sh dev`  
Use `update.sh` to pull the newest changes from git.  
Then, use `build.sh` to compile production versions of frontend and backend.  
These only need to be run once whenever you want to change or update the server repo.

Use `run.sh` to start the frontend and backend as background processes.  
The logs for the most recent call of run are found in the frontend and backend folder each, and named `output.log`.  
Use `stop.sh` to stop all background processes that use dotnet or npm commands.

The server has a script for listening to webhooks and automatically deploying new pushes to dev (and release). This script is in the same folder, and named `runWebhookListener.sh`.  
It calls a python program found in `./server/webhooks`. To be able to run this after pulling a fresh repository copy, a python environment must be built.  
To do this, navigate to the webhooks folder, and run `source ./bin/activate`.  
The server automatically runs the `runWebhookListener.sh` script any time the server restarts, with a one minute delay.  
The script responsible for this can be found in `/etc/init.d` named `github_webhook.sh`.

#### Using commands

The first step is to navigate to `~/dev` or `~/release` and using `git fetch`, then `git pull` or `git checkout` to ensure the server repository is up to date.

Afterwards, navigate to `frontend`, and run (line by line)
```bash
npm install
npm run build
npm run start &
```
(The `&` here runs the command as a background process.)  
To stop npm later, use `fg npm` and then Ctrl+C to stop the process.  
Then, navigate to `backend`, and run
```bash
dotnet restore
dotnet build
```
This will generate a production version of the backend code (a single `dll` file). To run it, use
```bash
dotnet bin/Debug/netcoreapp3.1/netcoreapp3.1/OpenData.API.dll &
```
To stop dotnet once it is running, use `fg dotnet` and then Ctrl+C to stop the process.  
Logging out of PuTTY will not stop these processes.


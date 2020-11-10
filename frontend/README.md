# Welcome to FRONTEND

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Before running frontend

Frontend might not run unless a backend is running or available.

First, open a console in the frontend folder, then install the dependencies:

```bash
npm install
```

If you are running frontend locally, you may find a configuration file `../config/frontend/.env.local`, which you can copy to this frontend folder and change at will to ensure your settings are not tied to the git repository.  
You can change the DOTNET_HOST variable to the actual backend (`http://katalog.samåpne.no:5000`) to use the servers backend instead of running it locally.

If you are running frontend on a server, you may find a configuration file in `../config/server/frontend/.env.local`, which you may use instead. Make sure the DOTNET_HOST variable is accurate, and the PORT number is not in use by other programs.

## To run the frontend in development

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## To run the frontend in production

```bash
npm run build
npm run start
```

## Running tests

```bash
npm test
```

You need to call `npm install` first, if you haven't.

## Writing tests

Any file within the \_\_tests\_\_ folder are considered tests by Jest.  
Use FilterPublisherTests.js as an example.

Tests are defined by calling `test()`, with a name/success message and a method (this method is the actual test),  
use `() => ` to define an anonymous function in the second argument.  
Use `expect(variable)` and [any number of extensions](https://jestjs.io/docs/en/expect) to define the expected execution.  
Typically `.toBe(value)`, `toEqual(value)`, `.not.`, `.toBeFalsy/Truthy()`, `toHaveLength(n)`, `toHaveProperty(key, [value])`, `toBeNull()`, `toContain(item)`  
Use `expect(promise).resolves.` for promises / things that dont resolve right away.

## Frontend structure

**Bold** is folders.

Common text is description of content in folder.

- **.next**
  - Not important, contains the next.js files which comes with npm install after creating the next app
- **\_\_tests\_\_**
  - Contains Jest unit tests (and possibly snapshots) for our code
- **Components**
  - **AddNewDatasett**
    - Components for the creating and importing datasets and creating coordinations.
  - **ApiCalls**
    - Components for each of the API calls (get, post, put, patch and delete)
  - **Filters**
    - Components for the filters in the catalogue.

  - **Forms**
    - Input field components that we create go here
  - Normal components we create go here, e.g. Header
- **node_modules**
  - Contains packages from the dependencies, auto generated, gitignored
- **pages**
  - **api**
    - Handles props sent to components and pages. This is where we send information about our cookies. 
  - **DetailedCoordination**
    - Contains the dynamic page for detailed coordination and the components assosiated.
  - **DetailedDataset**
    - Contains the dynamic page for detailed dataset and the components assosiated.
    
  - This is where all out pages is located, this allows us to use next features like dynamic routing and SSR
- **public**
  - Not important
- **styles**
  - Containes the style modules
- **utils**
  - Utility components
- .env
  - This contains environment variables used to connect to the backend
- .env.local
  - gitignored. You can make this file to override any of the environment variables defined in .env

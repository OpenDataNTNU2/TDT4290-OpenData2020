This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

Frontend may not run unless a backend is running or available.

First, open a console in the frontend folder, then install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

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
  - **Forms**
    - Input field components that we create go here
  - Normal components we create go here, e.g. Header
- **node_modules**
  - Contains packages from the dependencies, auto generated, gitignored
- **pages**
  - **api**
    - Not important yet, since we are using .NET for backend and api handling
  - This is where all out pages is located, this allows us to use next features like dynamic routing and SSR
- **public**
  - Not important
- **styles**
  - Not important, might delete since we are using material ui
- **utils**
  - This will handle global state for logged in users

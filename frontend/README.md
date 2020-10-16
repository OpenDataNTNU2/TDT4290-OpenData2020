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
Tests are defined by calling `test()`, with a name/success message and a method (this method is the actual test),  
use `() => ` to define an anonymous function in the second argument.  
Use `expect(variable)` and [any number of extensions](https://jestjs.io/docs/en/expect) to define the expected execution.  
Typically `.toBe(value)`, `toEqual(value)`, `.not.`, `.toBeFalsy/Truthy()`, `toHaveLength(n)`, `toHaveProperty(key, [value])`, `toBeNull()`, `toContain(item)`  
Use `expect(promise).resolves.` for promises / things that dont resolve right away.  

## Frontend structure
__Bold__ is folders.

Common text is description of content in folder.


* __.next__
  * Not important, contains the next.js files which comes with npm install after creating the next app
* __\_\_tests\_\___
  * Contains Jest unit tests (and possibly snapshots) for our code
* __Components__
  * __Forms__
    * Input field components that we create go here
  * Normal components we create go here, e.g. Header
  
* __node_modules__
    * Contains packages from the dependencies, auto generated, gitignored
* __pages__
    * __api__
        * Not important yet, since we are using .NET for backend and api handling
    * This is where all out pages is located, this allows us to use next features like dynamic routing and SSR
* __public__
  * Not important
* __styles__
  * Not important, might delete since we are using material ui
* __utils__
  * This will handle global state for logged in users

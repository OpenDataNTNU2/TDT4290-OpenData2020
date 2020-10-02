This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Frontend structure
__Bold__ is folders.

Common text is description of content in folder.


* __.next__
  * Not important, contains the next.js files which comes with npm install after creating the next app
* __Componenets__
  * __Forms__
    * Input field components that we create go here
  * Normal components we create go here, e.g. Header
  
* __node_modules__
    * Comes with node, and is cancer, do not mess with this or else...!!
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


# Welcome to BACKEND

## Before running backend
If you are running backend locally, navigate to `../config/backend` and copy the appsettings.Development.json into the backend folder.    
If you are running backend on a server, navigate to `../config/server/backend` and copy the appsettings.Production.json into the backend folder.  
For both of these, there are three secrets that must be filled in: `PostgreSQL`, `GitlabApiToken`, and `OpenDataPassword`.  
`PostgreSQL` is a connection string on the form `Host=[1];Database=[2];Username=[3];Password=[4]`.  
* [1] is the address of the postgres server, e.g.: `Host=postgres.potrik.com`.
* [2] is the id of the database to use on this server: `Database=opendata_db`.
* [3] is the username for the user which the backend accesses the database through: `Username=opendata`.
* [4] is the password for this user, which we will not store on this public git repository.  

`GitlabApiToken` is a token used to access a the API of a gitlab server, and must be generated using the admin tools on gitlab.  
`OpenDataPassword` is the password used to give end users access to viewing the gitlab projects.

The way to get these secrets is primarily by asking members of the team, but new ones can still be generated as needed.

## To run the backend in devevelopment
```bash
cd backend
dotnet restore
dotnet run
```
Then go to ```http://localhost:5000/swagger/index.html``` to see an overview of the api endpoints. It is also possible to test the endpoints by expanding/clicking it. Then click on the `Try it out` button to the right and inputting proper query/body parameters before clicking `Execute`. Just below you will get the response. Alternatively it is possible to use a program like [Postman](https://www.postman.com/downloads/).

## To run the backend in production
```bash
cd backend
dotnet build
dotnet bin/Debug/netcoreapp3.1/netcoreapp3.1/OpenData.API.dll &
```

## To test the backend

```
cd backend
dotnet test
```

Alternatively, install the "NUnit 3 Test Adapter" extension in visual studio.
Then you can run tests via the Test Explorer. (You can find it under view in the top menu bar)

## Writing tests
Use "DatasetServiceTests.cs" as a guide for how to set up a tests file.  
Make a new class in the Tests folder/Tests project (at the bottom of the Solution explorer).  

Make sure to write [TestFixture] above the class declaration.  
Tests are functions declared under [Test], the return type for tests is called Task.  
A function declared under [SetUp] will run before every single test.  
A function delcared under [TearDown] will run after every single test.  
[OneTimeSetUp] and [OneTimeTearDown] will run once before and after all tests.  
OneTimeSetUp -> SetUp -> Test1 -> TearDown -> SetUp -> Test2 -> TearDown -> OneTimeTearDown  

Use the Assert package to write tests. Assert.IsTrue([variable or expression], [Error message if it is false]) and IsFalse are most useful. Assert.AreEqual([a], [b], [message]) and AreNotEqual can also be useful, but it requires that the classes have a well defined equals method.  

The TestDatabase class can be used to set up a lighter database for testing.  
It comes with a function for adding test data (Strender i Bodø og Trondheim), this test data is stored in AppDbContext at the moment, make sure to move it to the TestDatabase once you no longer need it in AppDbContext.

## Backend structure
__Bold__ is folders.

Common text is description of content in folder.

CRUD - Create, Read, Update, and Delete. Corresponding to the HTTP verbs POST, GET, PUT, DELETE. 
Entity type: Dataset, Publisher etc..

* __Controllers__
  * Controller files for different endpoints based on entity types. Such as the /api/datasets with different methods for CRUD. It handles the request and sends it to the appropriate method in the corresponding service for the entity type.
* __Domain__
  * __Models__
    * __Queries__ 
      * Query models for Dataset and Coordination with search, filters and pagination.
    * Entity models for the different entity types. Each files contains a list of attributes that entity has.
  * __Repositories__
    * Interfaces for repositories.
  * __Services__
    * Interfaces for services.
    * __Communication__
      * Responses sent between service and controller.
* __Extensions__
* __External\Gitlab__
  * __Models__
    * Models for Gitlab groups and projects
  * __Services__
    * Gitlab services
  * Gitlab client and configurations
* __Infrastructure__
  * CacheKeys.cs - Telling what keys should be cached.
* __Mapping__
  * Two files mapping to and from models and resources with automapper.
* __Persistence__
  * __Context__
    * AppDbContext.cs - Setting up the database context with primary keys, foreign keys and example data.
  * __Repositories__
    * Repository files that does CRUD operations with the database context for the different entity types. 
* __Resources__ 
  * Resource files for each entity type, where e.g DatasetResource.cs is the response sent to frontend and the SaveDatasetResource is what is sent in before the dataset is created.
* __Services__
  * Service files for each entiity type with different methods for CRUD. If there is some processing to be done it is done here, before it calls the appropriate repository methods.
* __Tests__
  * NUnit test files to detect problems with the basic functionality of important classes.
* __Util__
  * Helper methods for handling the fetching and transformation from DCAT to be stores in the database.
* Program.cs - Contains the main method for the application.
* StartUp.cs - Add configurations and services to the program. _Also where to map from an interface to the class using it_.
* appsettings.json - These are the default configuration values for the program. This is tracked in git, and should rarely be changed.
* appsettings.Development.json - gitignored. These are local configuration changes for running the program locally. This should be copied from `../config/backend`. It will require a PostgreSQL connection string provided from elsewhere.
* appsettings.Producction.json - gitignored. These are local configuration changes for running the program on a server. This should be copied from `../config/server/backend`. It will require the same connection string, and may be given an https certificate as well.

## An example path for saving a Dataset.
A dataset request is sent to the backend, containing a `SaveDatasetResource`.  
It is routed to the correct controller, `DatasetsController`, because sent on the endpoint `/api/datasets`.  
Because it is sendt using the HTTP verb `POST` it goes to the method `PostAsync`.  
Here it gets mapped from the `SaveDatasetResource` to the `Dataset` model using the mapper file `ResourceToModelProfile`.  
Then it is sent to the corresponding `DatasetService`' method `SaveAsync` there is not any processing for this action so it is sent to the `DatasetRepository`' method `AddAsync` which adds it to the database context `AppDbContext`.  
The `UnitOfWork`' method `CompleteAsync` makes sure there is no conflict in the database if more than one action is executed simultaneously.  
The `DatasetService` then returns a `DatasetResponse` with the dataset that was added to the database, now containing a id.  
Then the `DatasetsController` validates the result, maps from `Dataset` to `DatasetResource` with the `ModelToResourceProfile` and sends the response to the frontend with code `201`. 

# Welcome to BACKEND

## To run the backend

```
cd backend
dotnet restore
dotnet run
```
Then go to ```https://localhost:5001/swagger/index.html``` to look for the api documentation. 
In order to use the post, put and delete you have to use something like [Postman](https://www.postman.com/downloads/).


## Backend structure
__Bold__ is folders.

Common text is description of content in folder.

CRUD - Create, Read, Update, and Delete. Corresponding to the HTTP verbs POST, GET, PUT, DELETE. 
Entity type: Dataset, Publisher etc..

* __Controllers__
  * Controller files for different endpoints based on entity types. Such as the /api/datasets with different methods for CRUD. It handles the request and sends it to the appropriate method in the corresponding service for the entity type.
* __Domain__
  * __Models__
    * Entity models for the different entity types. Each files contains a list of attributes that entity has.
  * __Repositories__
    * Interfaces for repositories.
  * __Services__
    * Interfaces for services.
    * __Communication__
      * Responses sent between service and controller.
* __Extensions__
  * Not important
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
* Program.cs - Contains the main method for the application.
* StartUp.cs - Add configurations and services to the program. _Also where to map from an interface to the class using it_.

## An example path for saving a Dataset.
A dataset request is sent to the backend, containing a `SaveDatasetResource`. It is routed to the correct controller, `DatasetsController`, because sent on the endpoint `/api/datasets`. Because it is sendt using the HTTP verb `POST` it goes to the method `PostAsync`. Here it gets mapped from the `SaveDatasetResource` to the `Dataset` model using the mapper file `ResourceToModelProfile`. Then it is sent to the corresponding `DatasetService`' method `SaveAsync` there is not any processing for this action so it is sent to the `DatasetRepository`' method `AddAsync` which adds it to the database context `AppDbContext`. The `UnitOfWork`' method `CompleteAsync` makes sure there is no conflict in the database if more than one action is executed simultaneously. The `DatasetService` then returns a `DatasetResponse` with the dataset that was added to the database, now containing a id. Then the `DatasetsController` validates the result, maps from `Dataset` to `DatasetResource` with the `ModelToResourceProfile` and sends the response to the frontend with code `201`. 

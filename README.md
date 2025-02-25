# Platform Api
Platform Api is a GraphQL-based server-side application that interacts with a PostgreSQL database. This project is set up using Node.js and can be utilized as a starting point for building robust backend services.

## Environment setup

Before you begin, make sure you have Node.js(v20.10) and Yarn package manager installed on your machine. You will also need PostgreSQL installed and running locally.

Follow these steps to set up your environment:

### Database Setup

1. Set up your local PostgreSQL database.
2. Ensure that PostgreSQL is running on port `5432` (or update the `.env` file with your custom port).

### Application Setup

1. Clone this repository to your local machine.
2. Navigate to the project root directory in your terminal.
3. Run `yarn` to install all the necessary dependencies.
4. Create a `.env` file in the root directory and add the following environment variables:

```sh
DB_HOST=localhost
DB_NAME=bqCore
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=CORE_ADMIN
JWT_SECRET=hello_beeQuant
DEFAULT_REFERENCE=COREINTERNAL
DEFAULT_DISPLAY_NAME='New User'
```

Make sure to replace `CORE_ADMIN` with the actual password for your local PostgreSQL instance.

### Start Developing Work

Once the environment setup is complete, you can start the development server:

Run `yarn start` for a production server or `yarn start:dev` for a development server.
Navigate to `http://localhost:3000/graphql` in your web browser to test queries and mutations using the interactive GraphQL playground.

### Test

The project comes with pre-configured unit and end-to-end (e2e) tests. To run these tests and check code coverage, use the following commands:

```bash
# unit tests
$ yarn run test

# test coverage
$ yarn run test:cov
```

These tests are essential for ensuring your application runs correctly before deployment.


## Running public queries 
Navigate to web app: http://localhost:5173/, to create(register) users
Make sure the project is running at: http://localhost:3000/graphql
Running an example query like:

```
query GetUsers {
  getUsers {
    id
    email
  }
}
```

## To run a PostgreSQL database locally:

1. Install docker locally:https://www.docker.com/get-started
2. Pull the PostgreSQL Image:
   ```
   docker pull postgres
   ```
3. Run a PostgreSQL Container:
   ```
   docker run --name bqCore -e POSTGRES_PASSWORD=CORE_ADMIN -e POSTGRES_DB=bqCore -p 5432:5432 -d postgres
   ```

4. Wait for the Container to Start and check the container's status:

   ```
   docker ps
   ```

5. Download a DBeaver: https://dbeaver.io/download/, connect your db using DBeaver by using the following config:
   ```
   Host: localhost
   Port: 5432
   Database: bqCore
   Username: postgres
   Password: CORE_ADMIN
   ```

6. (optional) Stop and remove the container: (you need to run step 3 again once you remove it):
   ```
   docker stop bqCore
   docker rm bqCore
   ```

## To run the backend within the docker container:(optional)
Follow these steps to get the backend up and running inside a Docker container.

1. Pre-request: 
create docker network: 
   ```
   docker network create platform_api
   ```

   Ensure the PostgreSQL docker container is running properly.
   follow the commands to run postgres container:
   ```
   docker run --name bqCore  --network platform_api -e POSTGRES_PASSWORD=CORE_ADMIN -e POSTGRES_DB=bqCore -p 5432:5432 -d postgres
   ```

2. build docker image: 
Run the following command to build the Docker image for the platform API:
   ```
   docker build -t platform_api .
   ```

3. run docker
Execute this command to run the Docker container in the background:
   ```
   docker run --name platform_api --network platform_api -e DB_HOST=bqCore -e DB_PORT=5432 -e DB_NAME=bqCore -e DB_USERNAME=postgres -e DB_PASSWORD=CORE_ADMIN -e JWT_SECRET=hello_beeQuant -p 3000:3000 -d platform_api
   ```

4. Navigate to `http://localhost:3000/graphql` in your web browser to test queries and mutations using the interactive GraphQL playground. 

## To run the backend with docker-compose:(optional)
This step will show you how to run backend application and the postgreSQL database in a docker network with a simple docker compose up.

Remember, to successfully run the docker compose up command you will need to make sure your postgres container created by the last step is stopped,
   ```
   docker stop bqCore
   ```
and there are no other processes using localhost:5432. Alternatively you can change the port mapping though this wouldn't be recommended.

Follow these steps to get the backend up and running inside a Docker container.

1. build backend docker container:
   ```
   docker compose build
   ```

2. docker compose up: 

   as easy as:
   ```
   docker compose up
   ```

   However, if you made any changes to your source code and you want to run the containers again then please make sure you run the "docker compose build" again. Otherwise your docker will decide to reuse the existing docker image which obviously won't have your latest changes.
3. Navigate to `http://localhost:3000/graphql` in your web browser to test queries and mutations using the interactive GraphQL playground. 
4. To temporarily stop the services, just simply run:
   ```
   docker compose stop        # this won't delete any containers
   ```
   and resume with:
   ```
   docker compose start
   ```
   To completely shut down, run:
   ```
   docker compose down        # this will delete both containers

## To deploy or update the backend to uat environment:(optional, BorisM version)
This step will show you how to deploy the backend application to BorisM's cloud environment (approval from Chris and Boris required).

The complete deployment involves operations in 2 different repos: platform_api and terraform_BorisM.
The CD workflow in platform_api will only build docker image and push the image to aws ecr, you will need to go to the terraform repo to manually trigger the execution of terraform configurations.
1. Go to Actions

   In Actions page, you will see there are 3 pipelines: "CI pipeline", "uat deploy Boris" and "uat to Prod Boris".
2. Go to workflow - Uat Deploy Boris

   In this workflow, you should see there is a manual trigger, which will need you to put in software version number, remember this number because you will need it to double confirm in the terraform repo.
   ![alt text](.github/workflows/images/readmeScreenshot-uatDeployWorkflow.png)
3. Run the Uat Deploy Workflow

   You don't need to run the CI workflow again because the deploy workflow will automatically do this for you.
4. Go to terraform_BorisM repository - Actions

   This repo contains the aws cloud infrastructure as code targeting to Boris' aws cloud account. You will see that there is only 1 workflow which is manually triggered as well. This workflow requires you type in environment (uat or prod, case sensitive) and version number. 
   Once you put in the correct environment and version number, run the workflow. This will trigger the terraform configuration and the new version of application will be deploy or updated to aws cloud.
   ![alt text](.github/workflows/images/readmeScreenshot-uatDeployterraformWorkflow.png)

## To deploy or update the backend to prod environment:(optional, BorisM version)
   This step will show you how to deploy or update the application from uat environment to production environment(approval from Chris and Boris required).

   Note that you have to complete the uat deployment/update and finished testing in uat environment if you want to deploy in production environment.
1. Run workflow - Uat to Prod Boris
   
   This workflow will pull the image that has been tested from the uat ecr repo, retag the image, then upload to the prod ecr repo.

2. Go to terraform_BorisM repository - Actions

   In this step you will use the same workflow that you used in the uat-deploy step. Type in "prod" as environment and the exact same version number from the uat deployment, then click run workflow.
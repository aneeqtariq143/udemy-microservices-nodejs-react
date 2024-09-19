# Udemy - Microservices with Node.js and React

# Start Project

## Start Minikube

```bash
minikube start
minikube dashboard # To access kubernetes dashboard
```

## Start Skaffold

```bash
skaffold dev
```

## Section 1 to 4

## Kubernetes

### Important Terminologies

![img_6.png](img_6.png)

### Example of Kubernetes Cluster

![img_7.png](img_7.png)

### Notes on Config Files

![img_8.png](img_8.png)

### Common docker & kubectl commands

#### Common Docker Commands

![img_10.png](img_10.png)

#### Common Kubernetes Commands

![img_11.png](img_11.png)

#### Common Deployments Commands

![img_12.png](img_12.png)

#### Updating Deployments

![img_13.png](img_13.png)

- Note: if we don't specify the version of image in `Deployment` then kubernetes always consider `latest`
- Example without version: `aneeqtariq143/auth` => `aneeqtariq143/auth:latest`

#### Preferred Method for Updating Deployments

![img_14.png](img_14.png)

#### Networking With Services

![img_15.png](img_15.png)

##### Services provide networking between pods

![img_16.png](img_16.png)

##### Types of Services

![img_17.png](img_17.png)

##### Setting Up Cluster IP Services for each Microservice

![img_18.png](img_18.png)

##### How to Communicate Between Services

![img_19.png](img_19.png)
![img_20.png](img_20.png)
![img_21.png](img_21.png)

##### Load Balancer Services

![img_22.png](img_22.png)

##### Load Balancers and Ingress

![img_24.png](img_24.png)

##### Skaffold

![img_25.png](img_25.png)

### Lesson Learned from APP #1

![lesson 1](lesson-1.png)

### Painful Things from APP #1 and their Solutions

![Painful Things from APP #1 and their Solutions #1](painfull-things-from-app-1.png)

## 5. Architecture of Multi-Service Apps

### App Overview

![App Overview](app-overview.png)

### Resources Types

![img.png](img.png)

### Service Types

![img_1.png](img_1.png)

#### Notes on Services

![img_2.png](img_2.png)

### Events and Architecture Design

Each service has its own folder, common libraries shared between all the resources

![img_4.png](img_4.png)
![img_3.png](img_3.png)

### Auth Service Setup

![img_5.png](img_5.png)

1. Create a `auth` folder in a project root directory for `Auth Service`
2. run command `npm init -y`
3. Install dependencies `npm install typescript ts-node-dev express @types/express`
    - typescript: A superset of JavaScript that adds static types, which can help catch errors early and improve code
      quality.
    - ts-node-dev: A development tool that combines ts-node and nodemon to automatically restart the server and
      recompile TypeScript files when changes are detected.
    - express: A minimal and flexible Node.js web application framework that provides a robust set of features for web
      and mobile applications.
    - @types/express: TypeScript type definitions for Express, which provide type information to help with development
      in TypeScript.
4. Generate a typscript config file `tsc --init`
    - Note: install typescript globally if it's not installed already. `npm install -g typescript`
5. Setup Express Server listing on port 3000
    - Express Server `auth/src/index.ts`
   ```javascript
   import express from 'express';
   import { json } from 'body-parser';
   
   const app = express();
   app.use(json());
   
   app.listen(3000, () => {
     console.log('Listening on port 3000!');
   });
   ```
    - Specify entry point in `package.json` file
   ```
   "scripts": {
    "start": "ts-node-dev src/index.ts"
   },
   ```
6. Auth K8s Setup
    1. Create a docker image of `auth` service using `auth/Dockerfile`.
        - Note: Don't forget to add `node_modules` into `.dockerignore`. Because we don't want to copy the
          `node_modules` folder at the time of building image
    2. Build Docker Image `docker build -t aneeqtariq143/udemy-microservices-nodejs-react-auth-service .`
    3. Create kubernetes `Deployment` file under project root directory `infra/k8s/auth-depl.yaml`
        - Note: install `minikube` for [ubuntu](https://kubernetes.io/docs/tasks/tools/install-minikube) or
          `Docker-Toolbox` for Window/Mac
       ```
       # Install Minikube
       curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
       sudo install minikube-linux-amd64 /usr/local/bin/minikube && rm minikube-linux-amd64
       
       # Install kubctl
       
 
       # To make docker the default driver:
       minikube config set driver docker
       
       # Start a cluster using the docker driver:
       
       # Add User to Group
       $ sudo groupadd docker
       $ sudo usermod -aG docker $USER
       $ newgrp docker
       
       # verify
       minikube kubectl version
       ```
    4. create `skafffold.yaml` config file at project root folder
    5. run skafffold `sudo skaffold dev`
    6. To access the `auth` microservice from browser then install `ingress`
        1. Create `Ingress Rules` config file under `infra/k8s/ingress-srv.yaml`

        - Note: [Installation Ingress](https://kubernetes.github.io/ingress-nginx/deploy/)
    7. Add `ingress-nginx-controller` to `/etc/hosts` file. In our case it's we add `minikube ip` to `/etc/hosts` file
       `192.168.49.2 dev.ticketing.dev`.
        - Note: In linux we use `minikube ip` and Windows/Mac we use `Docker-Toolbox` ip
        - Run command `minikube ip` to get the ip address of minikube or use `minikube dashboard` and Navigate to
          Ingresses Select desired ingress service to get the ip address of minikube
    8. Access `auth` microservice from browser `http://dev.ticketing.dev/api/users/currentuser`

### Authenticated Strategies and Options

#### 1. Fundamental Authentication Strategies

![img_26.png](img_26.png)

##### Option#1: Individual Services rely on the auth services

![img_27.png](img_27.png)

###### Downside of Option#1

- **Downside**: If the `auth` service goes down, all the other services will not be able to authenticate users.

##### Option#1.1: Individual Services rely on the auth service as a gateway

![img_28.png](img_28.png)

###### Downside of Option#1.1

- **Downside**: If the `auth` service goes down, all the other services will not be able to authenticate users.

##### Option#2: Individual services know how to authenticate a user

![img_29.png](img_29.png)

###### How?

- **How**: Shared Common code between all the services. Each service has its own copy of the code that knows how to
  authenticate a user.

###### Downside of Option#2

- **Downside**: Duplicate Code.

##### Comparison

![img_31.png](img_31.png)

#### 5. Reminder on Cookies vs JWT's

![img_32.png](img_32.png)

#### 6. Microservices Auth Requirements

![img_33.png](img_33.png)

#### 8. Use Cookies to send JWT Token

![img_34.png](img_34.png)

###### Why not Encrypt Cookies?

- **Why not Encrypt Cookies?**: We don't need to encrypt the content (JWT) of cookie because JWT's are tamper resistant.
  If someone tries to change the content of the JWT, the server will reject it.
- **Why Encrypt Cookies?**: We can encrypt the cookie to hide the content from the user. But it's not necessary because
  the content of the JWT is already encrypted.
- **Why Encrypt Cookies?**: We can encrypt the cookie to if we store sensitive data other than JWT in the cookie.

###### Library Used to manage cookies

- **Library Used**: `cookie-session` library is used to manage cookies in the Node.js
  application. [Documentation](https://www.npmjs.com/package/cookie-session)
    - Install `cookie-session` library `npm install cookie-session @types/cookie-session --save`
    - `cookie-session` is a middleware that stores the session data on the client within a cookie. It is signed with a
      secret to prevent tampering.

#### 13. Securely Storing Secrets and Accessing Secrets from different pods with Kubernetes

![img_35.png](img_35.png)
![img_36.png](img_36.png)

###### **Notes on Secrets**

- **Secrets**: Secrets are a way to store sensitive information in Kubernetes. Secrets are stored in base64 encoded
  format.
- **Accessing Secrets**: Secrets can be accessed by pods using environment variables or volumes.
- **Different Types of Secrets**: There are different types of secrets like generic, docker-registry, tls etc. we can
  create is some information related to accessing a repository of Docker images That is a different kind of secret. We
  are creating a generic secret which means this is just a all purpose kind of secret piece of information the name of
  the secret.
- **Creating Secrets in Dev Environments (imperative approach)**: The reason that we are using this imperative approach
  right here is because we don't really want to have a config file that lists out the value of our secrets. We don't
  necessarily have to list out the value of a secret inside the config file. We can technically use a local environment
  variable on your machine and then refer to that from the config file.
    - **Important Note**: The one downside to it is that anytime you start to create or spin up a new cluster you are
      going to have to remember all the different secrets that you had created over time.
- **Creating Secrets in Production Environments (declarative approach)**: We will write config file approach
- Example of creating a secret in Kubernetes
  ```bash
  # Create a secret
  kubectl create secret generic jwt-secret --from-literal=JWT_KEY=58092296374621923899602564172863
  ```

### 10. Testing Isolated Microservices

#### 4. Index to App Refactor

The reason for this refactor is to make the app listen to the port only, So when `supertest` runs the test, it may start
the server on the default port or assign a random (ephemeral) port.
![img_37.png](img_37.png)

#### 5. A Few Dependencies

1. `jest` library is used for testing. [Documentation](https://jestjs.io/docs/en/getting-started)
    1. Install `jest` library
       `npm install jest @types/jest ts-jest supertest @types/supertest mongodb-memory-server --save-dev`

#### 6. Test Environment Setup

1. **Initialize Configuration**: `npm init jest@latest`
2. Create a `./src/test` folder in the root directory of the project
2. Create a `setup.ts` file in the `test` folder

```typescript
import {MongoMemoryServer} from "mongodb-memory-server";
import mongoose from "mongoose";
import {app} from "../app";

// Start Set up the in-memory MongoDB database
let mongo: any;
beforeAll(async () => {
    // Create a new instance of MongoDB in memory
    const mongo = new MongoMemoryServer();
    // Get the URI of the in-memory MongoDB instance
    const mongoUri = await mongo.getUri();

    await mongoose.connect(mongoUri);
});

// Clear the database before each test
beforeEach(async () => {
    // Get all the collections in the database
    const collections = await mongoose.connection.db?.collections();


    // Delete all the collections
    if (collections) {
        for (let collection of collections) {
            await collection.deleteMany({});
        }
    }
});

// Close the connection to the in-memory database and stop the instance
afterAll(async () => {
    await mongoose.connection.close();
    await mongoose.disconnect();
});
// End Set up the in-memory MongoDB database
```

3. set configuration `jest.config.json` file to run the `setup.ts` file before running the tests

```typescript
import type {Config} from 'jest';

console.log('./test/setup.ts')
const config: Config = {
    preset: 'ts-jest', // Use ts-jest preset
    testEnvironment: 'node', // Set the test environment to Node.js
    transform: {
        '^.+\\.ts$': 'ts-jest', // Transform TypeScript files using ts-jest
    },
    moduleFileExtensions: ['ts', 'js', 'json', 'node'], // Recognize these file extensions
    setupFilesAfterEnv: ['./src/test/setup.ts'], // Include the setup file
};

export default config;
```

4. Update `package.json` file to run the `npm run test`

```json
"scripts": {
"test": "jest --watchAll --no-cache --detectOpenHandles"
},
```

5. Create a folder named `__test__` in the same directory as the file you want to test. Inside the `__test__` folder,
   create a test file with the same name as the original file but with `.test` added before the file extension. **For
   example**, to write a test for the file `./src/route/signup.ts`, you would create a `__test__` folder in
   `./src/route` and then create a file named `signup.test.ts` inside that folder.
6. **Important Note**: if our script contains `Environment Variables` then we need to set the `Environment Variables` in
   the `setup.ts` file. For example, if we have `JWT_KEY` in the `.env` file then we need to set it in the `setup.ts`
   file. There are many other ways to set the `Environment Variables` in the `setup.ts` file. For example, we can use
   `dotenv` library to set the `Environment Variables` in the `setup.ts` file. But the simplest way is to set the
   `Environment Variables` in the `setup.ts` file. For example, if we have `JWT_KEY` in the `.env` file then we can set
   it in the `setup.ts` file as shown below.
   ```typescript
   beforeAll(async () => {
        process.env.JWT_KEY = 'testjwtkey';
        // Create a new instance of MongoDB in memory
        const mongo = new MongoMemoryServer();
        // Get the URI of the in-memory MongoDB instance
        const mongoUri = await mongo.getUri();

        await mongoose.connect(mongoUri);
   });
   ```

### 11. Integrating a Server-Side-Rendered React App Microservice

1. **Create Client**: Create a `client` folder in a project root directory for `Client Service`
2. **Install NextJs**: run command `npx create-next-app client`
3. **Install Dependencies**: `npm install --save clsx axios`
    1. **clsx**: A tiny (228B) utility for constructing `className` strings conditionally.
    2. **axios**: Promise based HTTP client for the browser and node.js
4. **Run Client**: run command `npm run dev` to verify the client is running
5. **Building a NextJs Docker Image**: Create a `client/Dockerfile` file
    1. **Create a Development Image for deployment**: Check Dockerfile.dev for Development image
    2. **Create a Production Image for deployment**: Check Dockerfile.prod for production image
    3. Use the appropriate Dockerfile for development or production
        - **Development**: Use `Dockerfile.dev` for development in `skaffold.yaml` file
        - **Production**:
          `docker build -f Dockerfile.prod -t aneeqtariq143/udemy-microservices-nodejs-react-client-service .` when we
          need to push the image to the docker hub
6. **Build Docker Image**: run command `docker build -t aneeqtariq143/udemy-microservices-nodejs-react-client-service .`
7. **Create kubernetes `Deployment` file**: Create a `infra/k8s/client-depl.yaml` file
8. **Create/Update `skaffold.yaml` config file**: To sync the application files and kubernetes deployment with the local
   machine
9. **Helpers and Hooks**
    1. **client/helpers/build-axios-client**: Used to create an axios client with the base URL which help to make a
       request from Client side and Server Side to the `cross-namespace` services
    2. **client/hooks/use-request**: Used to make a request from the client side to the backend services and set the
       error message and loading state

### How Can we make request to other microservices from the other microservice

Watch the videos from 16 to 20
![img_38.png](img_38.png)

#### Option#1 (Not a Good Option)

![img_39.png](img_39.png)
We can use microservice service URL to reach out the other service. for example we want to make a request from server
side `client` microservice to `auth` microservice then we can use the auth microservice url `http://auth-srv/`.

- **Note**: We access services using that `http://auth-srv` style only when they are in the same namespace. If they are
  in different namespaces, we need to use the full URL like `http://auth-srv.namespace.svc.cluster.local`. But in our
  case, all the services are in the same namespace so we can use the `http://auth-srv` style.
  ![img_41.png](img_41.png)

- Why Not a good option: Reason
    - client code is going to know the exact service name for every different thing it's ever going to want to reach out
      to. So if we start to introduce other services we're going to have to encode those exact service names into our
      NextJs application And that's just a little bit of a nightmare.
    - The other problem is that we need to somehow know not only those service names but also which route corresponds to
      which service

#### Option#2 (Good Option)

![img_40.png](img_40.png)
we need to fetch data from a service inside of our kubernettes cluster.
***we're going to have our NextJS. application reach out to an `ingress-nginx` which is already running, inside the
cluster `ingress-nginx` can then figure out where to send this request off to based upon just the path by itself***

So all we have to do is say hey `ingress-nginx` I'm trying to make a request to API users current user and
`ingress-nginx` already has the set of relevant rules and we put together right here. It knows how to take a request to
some arbitrary endpoint and map it up to some service and some actual port.

***How do we reach out `ingress-nginx` from inside the `client` service cluster? There's one other little challenge as
well, Remember our entire authentication mechanism right now works based upon cookies. And so as we're talking about
somehow fetching the current user we need to keep in mind in the very back of our head that we have some requests coming
into our next as application and it includes a cookie and at some point in time we're going to make a follow up request
from inside of next and that follow up request is probably going to have to include that cookie information right now
back inside of our index.ts file when this gets executed on the server or inside of next we do not have access to the
browser to automatically manage that cookie or anything like that.***

***Solution of cookie: We take a look at the original incoming request we extract that cookie off there and include it
in the request off to `ingress-nginx` so that when this request finally gets routed through `ingress-nginx` over to the
all service and I like that right there the all service will see that incoming cookie***

- **Note**: If they are in different namespaces, we need to use the full URL like
  `http://[name-of-service].[namespace].svc.cluster.local`.
  ![img_43.png](img_43.png)

##### Notes on Namespace

- **Namespace**: A way to divide cluster resources between multiple users (via resource quota) or multiple projects (via
  resource isolation).
- **Default Namespace**: If you don't specify a namespace, Kubernetes will use the default namespace.
- **Our Case**: We are using the default namespace for all the microservices, because we didn't specify any namespace.
- **How to build URL for different namespaces**: If they are in different namespaces, we need to use the full URL like
  `http://[name-of-service].[namespace].svc.cluster.local`.
    - **Identify the namespace**: First we need to identify the namespace we try to reach .Run the command
      `kubectl get namespaces` to get the list of all the namespaces.
    - **Identify the service name**: Run the command `kubectl get services -n [namespace]` to get the list of all the
      services in the namespace.
    - **Identify the service URL**: Run the command `kubectl describe service [service-name] -n [namespace]` to get the
      URL of the service.
    - **Build the URL**: Use the URL of the service to build the URL like
      `http://[name-of-service].[namespace].svc.cluster.local`.
    - We can also create a `ExternalName` type service so we can follow easier
      pattern. [Documentation](https://kubernetes.io/docs/concepts/services-networking/service/#externalname)

### 12. Code Sharing and Reuse Between Services
1. **Create a common folder**: Create a `common` folder in the root directory of the project and put all the
   shared code which will be shared among all the services in the `common` folder.
2. **Create a package.json file**: Create a `package.json` file in the `common` folder and specify the name, version, and
   main file of the common library.
3. **Initialize the common folder as a git repository**: Initialize the `common` folder as a git repository. (Optional:
   and push it to the git repository) .
4. **Publish the common library to the npm registry**: Publish the common library to the npm registry using the
   `npm publish --access public` command.
5. **Relocating Shared Code**: Move the shared code from the `auth` service to the `common` folder.
6. **Install the common library**: Install libraries from that are used in the relocated code.
   - `npm install express express-validator cookie-session jsonwebtoken @types/express @types/cookie-session @types/jsonwebtoken --save`
7. **Export the shared code**: Export the shared code from the `common/src/index.ts` folder. Then we can import the shared code in the `auth` service by importing the common library `import { BadRequestError } from @atgitix/common`. 
```typescript
export * from './errors/bad-request-error';
export * from './errors/custom-error';
export * from './errors/database-connection-error';
export * from './errors/not-authorized-error';
export * from './errors/not-found-error';
export * from './errors/request-validation-error';

export * from './middlewares/current-user';
export * from './middlewares/error-handler';
export * from './middlewares/require-auth';
export * from './middlewares/validate-request';
```
8. **Updating Import Statements**: Update the import statements in the `auth` service to import the shared code from the common library.
9. **Make changes to common library**: Make changes to the common library and publish the changes to the npm registry.
10. **Update the common library**: Update the common library in the `auth` service by running the `npm update @atgitix/common` command or we can use `npm install @atgitix/common@1.0.5`.
    - **Note**:  `npm update @atgitix/common` will not update the `package.json` file. It will only update the `package-lock.json` file. If we want to update the `package.json` file, we have to use `npm install @atgitix/common@1.0.5`.
    - **How to check the latest version of the common library**: Run the `npm show @atgitix/common version` command to check the latest version of the common library.

### Ticketing Microservice (13. Create-Read-Update-Destroy Server Setup)
#### Ticketing Service Setup
![img_45.png](img_45.png)

- **Create a `tickets` folder in a project root directory for `Tickets Service`**
- **Copy files from `auth` service to `tickets` service**: `.dockerignore`, `.gitignore`, `Dockerfile`, `jest.config.ts`, `tsconfig.json`, `package.json`, `src/index.ts`, `src/test`
- **Install Dependencies**: Copy the dependencies from the `auth` service to the `tickets` service
- **Search and replace the `auth` with `tickets`**: Search and replace the `auth` with `tickets` in the `tickets` service
- **Build Docker Image**: Build the Docker image for the `tickets` service. `docker build -t aneeqtariq143/udemy-microservices-nodejs-react-tickets-service .`
- **Create kubernetes `Deployment` file**: Create a `infra/k8s/tickets-depl.yaml` file.
  - **Note**: In our case it is almost identical to the `auth` service `Deployment` file. Copy and paste the content of the `auth` service `Deployment` file to the `tickets` service `Deployment` file. Then search and replace the `auth` with `tickets` in the `tickets` service `Deployment` file.
- **Create/Update `skaffold.yaml` config file**: To sync the application files and kubernetes deployment with the local machine
- 

#### Ticketing Service (API Endpoints)
![img_46.png](img_46.png)

### 14. NATS Streaming Server - An Event Bus Implementation

#### 2. Three Important Items
![img_47.png](img_47.png)

##### Important Notes
- **Client ID Generation**: The client ID should be unique for each client. Reason: If two clients have the same client ID, NATS refuses to connect to the second client. When Kubernetes auto-scaling the nodes, and if the multiple nodes has the same client ID, then the NATS will refuse to connect to the second node.
  - We can use the `randomBytes` function from the `crypto` module to generate a unique client ID.
- **Queue Groups**: If kubernetes auto-scales the nodes, then the same event will be processed by multiple nodes. To avoid this, we can use the `Queue Groups` feature of NATS. When we create a subscription with the same `Queue Group`, then the event will be processed by only one node.
![img_48.png](img_48.png)
- **setManualAckMode**: If we set the `setManualAckMode` to `true`, then we have to manually acknowledge the message. If we don't acknowledge the message, then the message will be redelivered to the same or another subscriber.
  - **Note**: If we don't acknowledge the message, then the message will be redelivered to the same or another subscriber. So we have to make sure that we acknowledge the message after processing it.
  - **Default timeout**: If we don't acknowledge the message within the default (30s) timeout, then the message will be redelivered to the same or another subscriber.
  - **Default Behavior**: By default, the message is acknowledged automatically after processing it.
- **Client Health Check**: Set the `heart beath configuration` to check the health of the client. If the client is not healthy, then the NATS server will disconnect the client.
  - **Client Health Check Configuration**: we can set the configuration during `docker image` creation using `arg[]`.
    ```dockerfile
    "-hbi",
    "5s",
    "-hbt",
    "5s",
    "-hbf",
    "2"
    ```
- **Graceful Shutdown**: We have to handle the `SIGINT` signal to gracefully shutdown the client. If we don't handle the `SIGINT` signal, then the client will not be able to gracefully shutdown.
  - Example: 
    ```javascript
    stan.on('close', () => {
        console.log('NATS connection closed!');
        process.exit();
    });
    
    
    process.on('SIGINT', () => stan.close());
    process.on('SIGTERM', () => stan.close());
    ```
- **setDeliverAllAvailable**: If we set the `setDeliverAllAvailable` to `true`, then the subscriber will receive all the events that were published before the subscriber was created. This is useful when we want to replay all the events.
  - **Note**: Use this feature with caution because it can lead to a lot of events being processed by the subscriber whenever the subscriber is created/scaled up/restarted.
  - **Note**: If we want to receive all the events that were published before and don't want to receive them again then use `setDurableName(service-name)`.
  - **Scenario**: Assume we developed a new service and we want to replay all the events that were published before the service was created. We can set the `setDeliverAllAvailable` to `true` and `setDurableName(service-name)` to replay all the events. Using this approach, we can replay all the events that were published before and don't want to receive them again.
  - **Important Note**: If we set the `setDeliverAllAvailable` to `true` and set the `setDurableName(service-name)`, but we don't pass the `queue group` to the subscription, then the subscriber will receive all the events that were published before and also receive them again. So we have to pass the `queue group` to the subscription then the subscriber will receive all the events whenever `serivce restarts`.
  - **Example**: 
    ```javascript
    const options = stan.subscriptionOptions()
        .setManualAckMode(true)
        .setDeliverAllAvailable()
        .setDurableName('service-name');
    const subscription = stan.subscribe('subject', 'queue-group', options);
    ```


#### 3. Creating a NATS Streaming Deployment

#### NATS Concurrency Issues
- **Possible Issue#1**: Listener can fail to process the event.
- **Possible Issue#2**: One Listener might run more quickly than another.
- **Possible Issue#3**: NATS might think a client is still alive when it's dead.
- **Possible Issue#4**: If we have multiple instances of the same service, then the same event will be processed by multiple instances.
- **Solution**: Use the `version` field to handle the concurrency issues.
  - **Version Field**: We can use the `version` field to handle the concurrency issues. When we publish an event, we can increment the `version` field. When we process the event, we can check the `version` field. If the `version` field is not equal to the `version` field in the database, then we can ignore the event.
  - **Example**: when we add a new record to the database, we can increment the `version` field. When we update the record, we can increment the `version` field. When we delete the record, we can increment the `version` field. Then we pass the `version` field to the event. When we process the event, we can check the `version` field. If the `version` field is not equal to the `version` field in the database, then we can ignore the event.

### 15. Connecting to NATS in a Node JS World
we will create a `nats-wrapper` library in common (shared code) that will help to connect to the NATS server and handle the NATS client connection. We will use the `nats-wrapper` library in the other services like `auth` service to connect to the NATS server.
![img_49.png](img_49.png)

#### 2. NATS Common Shared Code
1. **Base Listener**: Create Base class for the listener in `common/events/base-listener.ts` folder. It will help to connect to the NATS server and handle the NATS client connection.
2. **Define Types**: We define the `subject` (Events Names used in microservices) and `data` type (like: TicketCreated) for the event in the `common/events/types` folder.
3. 
Example:
![img_50.png](img_50.png)

### 16. Managing a NATS Client

#### Create NATS Client (Singleton) in microservices
- This way we can make sure that we have only one instance of the NATS client in the microservices.
- **To Prevent Circular Dependencies**: We create a separate file `nats-client.ts` then we import the `nats-client.ts` file in the `src/index.ts` file and `src/routes/create.ts` files.
- Diagram Example
![img_51.png](img_51.png)
- **Note**: We need to `Gracefully Shutdown` the NATS client when the microservice is stopped. If we don't `Gracefully Shutdown` the NATS client, then the NATS server will not be able to disconnect the client and the client will be shown as connected to the NATS server.
- To verify that NATS Gracefully Shutdown is working, we can run the `kubectl get pods` command and Delete the pod in which `NATS Gracefully Shutdown handle` you will see `NATS connection closed!` in console. Example `kubectl delete pod tickets-depl-7798767878-8fg7v`. If the NATS client is not `Gracefully Shutdown`, then the NATS client will be shown as connected to the NATS server.
```typescript
// src/index.ts
 await natsWrapper.connect("ticketing", "abc", "http://nats-srv:4222");
natsWrapper.client.on('close', () => {
    console.log('NATS connection closed!');
    process.exit();
});
process.on('SIGINT', () => natsWrapper.client.close());
process.on('SIGTERM', () => natsWrapper.client.close());
```

#### 11. Handling Publish Failures
- **Publish Failures**: If the NATS server goes down, then the client will not be able to publish the event. We have to handle the publish failures.
- **Option#1: Retry Logic (Add Latency)**: We can use the `retry logic` to handle the publish failures. If the NATS server goes down, then the client will try to reconnect to the NATS server and publish the event.
  - **Retry Logic Configuration**: We can set the `retry logic` configuration during `docker image` creation using `arg[]`.
    ```dockerfile
    "-reconnect",
    "true",
    "-maxReconnectAttempts",
    "-1",
    "-reconnectTimeWait",
    "1000",
    "-reconnectJitter",
    "1000",
    "-waitOnFirstConnect",
    "true"
    ```
- **Option#2: Save the event into the database**: We can use the database `transaction` to store the `ticket` and `event` with additional column `status` in the database. Write a separate logic which run periodically and publish the events which are in `pending` status. If we fail to insert `ticket` or `event` in the database, then we can retry to insert the `ticket` and `event` in the database then database `transaction` will reverse all the database changes.

#### 12. Fixing a Few Tests
If we run the test in `ticketing` microservice, We will see some tests are failing. The reason they are failing is because we have added the `NATS client` in the `src/index.ts` file.
- **Fixing Tests**: We have to fix the tests because we have added the `NATS client` in the `src/index.ts` file. We have to `mock` the `NATS client` in the tests.

There are two options to fix them:
1. **Option#1: Test environment actually connect to our NAT**: We can either try to have our test environment actually connect to our NAT server that's not super ideal because we don't really want to assume that we always have some running at Nats event bus whenever we're trying to run our tests that require us to always be running some copy of Nats on our local machine or some other mechanism to run it.
2. **Option#2: Fake initialized Nats client**: We essentially redirect import statements while we are running our application in the test environment. We're going to get just to intercept that import statements. It's going to see that this file is trying to import the real Nats wrapper and we're going to instead have just add a redirect that import statement and import a fake copy of the Nats wrapper instead and inside there we will have a fake initialized Nats client.
![img_52.png](img_52.png)
   - **Note on fake implementation**: We need to implement the only required methods that are used in the tests. For example, we need to implement the `publish` method in the fake Nats client because the tests are using the `publish` method. We don't need to implement the other methods that are not used in the tests. 
3. 
  

#### Folder & Files Organizational Structure

1. Each service has its own folder
    1. Each route handler has its own file inside `src/routes` folder
2. Common libraries shared between all the resources
    1. **Options For Code Sharing**:
        1. **Option#1: Direct Copy/Paste**: Copy the code from one service to another service. But this is not a good
           option because it leads to duplicate code and hard to maintain code between services.
        2. **Option#2: Git Submodule**: Create a git submodule for the common code. But this is not a good option
           because it leads to a lot of complexity.
       3. **Option#3: Create a Common NPM Library (Recommended)**: Create a common library that can be shared between
           all the services. This is a good option because it leads to less duplicate code and easy to maintain code
           between services.
            - **Public Package/Public Organization**: Publish the common library to the public npm registry or create a
              public organization on the npm registry.
            - **Create a common folder**: Create a `common` folder in the root directory of the project and put all the
              shared code which will be shared among all the services in the `common` folder.
            - **Create a package.json file**: Create a `package.json` file in the `common` folder and specify the name,
              version, and main file of the common library.
            - **Initialize the common folder as a git repository**: Initialize the `common` folder as a git
              repository. (Optional: and push it to the git repository) .
            - **Publish the common library to the npm registry**: Publish the common library to the npm registry using
              the `npm publish --access public` command.
            - **Install Dependencies**: Install the dependencies of the common library using the
              `npm install typescript del-cli --save-dev` command.
                - **typescript**: A superset of JavaScript that adds static types, which can help catch errors early and
                  improve code quality.
                - **del-cli**: A command-line interface for deleting files and directories.
            - **Initialize typescript configuration in the common folder**: Initialize typescript in the `common` folder
                using the `tsc --init` command.
                - ***Note***: We will write the common library in TypeScript but before publishing it to the npm
                  registry, we will compile it to JavaScript. Because the common library should be written in a language
                  that can be understood by many languages.
                - **Find and Update the tsconfig.json file**: Find and update the `tsconfig.json` file in the `common`
                  folder. Set the `outDir` to `./build` and uncomment `"declaration": true,` in the `tsconfig.json`
                  file. These configuration helps to transpile the TypeScript code to JavaScript and generate the type
                  definitions.
                - **Update `package.json` file**: Update the `package.json` file in the `common` folder. Add the `build`
                  script to compile the TypeScript code to JavaScript and add the `prepublishOnly` script to run the
                  `build` script before publishing the package.
              ```json
               "scripts": {
                 "clean": "del ./build/*", // Clean the build folder before building the project
                 "build": "npm run clean && tsc"
                 "prepublishOnly": "npm run build"
               },
               ```
                - **Configure NPM to use the build folder**: Update the `package.json` file in the `common` folder. Add
                  ```json
                  "main": "./build/index.js", // Specify the main file of the common library. This file will be used when someone imports the common library (import {EXPORT-NAME} from '@atariq/common')
                  "types": "./build/index.d.ts", // Specify the type definitions file of the common library. This file will be used to provide type information when someone imports the common library (import {NAME} from '@atariq/common')
                  "files": [ 
                     "./build/**/*" // Specify the files that should be included when someone installs the common library
                  ],
                  ```
            - **Git Commit and Push**: Commit Changes and (Optional# push the changes to the git repository).
              - **Update the version Publish the common library to the npm registry**: We have to update the version every time we publish the common library to the npm registry. There are two ways to update the version of the common library. Use `semantic versioning` to update the version of the common library.
                  - **Manual Update the version**: Update the version of the common library in the `package.json` file.
                  - **Update the version using cli**: Use the `npm version patch` command to update the version of the
                    common library.
            - **Build the common library**: Build the common library using the `npm run build` command.
            - **Publish the common library to the npm registry**: Publish the common library to the npm registry using
              the `npm publish --access public` command.
            - **Optional (Not Recommended in Production)**: We are using many commands to publish the common library. We can update package.json file to run all the commands in a single command.
           ```json
            "scripts": {
                 "pub": "npm run build && git add . && git commit -m \"Updates\" && npm version patch && npm publish"
            },
            ```
            - 

    2. **Must be understood by the many languages**: The common libraries should be written in a language that can be
       understood by many languages, because different services can be written in different languages like Java, .Net
       etv. For example, a common library written in JavaScript can be used by both Node.js and React.
       ![img_44.png](img_44.png)
        - ***Note***: We will write the common library in TypeScript but before publishing it to the npm registry, we
          will compile it to JavaScript. Because the common library should be written in a language that can be
          understood by many languages.
        -
    3. **Normalize Response**. Send a `Status Code` and `Error Message` in a consistent format. All the microservices
       should follow the same format.
        1. **Tip**: Create a abstract class `CustomError` and extend it in all the services.
        2. **Async Error Handler**: Use ExpressJS Async Errors package `npm install express-async-errors --save`. By
           using this package, all the error throws from async functions start working properly.
3. `infra` folder contains all the kubernetes configuration files
4.

#### Libraries Used

1. `express-validator` for validation. [Documentation](https://express-validator.github.io/docs/)
    1. Install `express-validator` library `npm install --save express-validator`
2. `express-async-errors` ExpressJS Async Errors package. By using this package, all the error throws from async
   functions start working properly [Documentation](https://www.npmjs.com/package/express-async-errors)
    1. Install `express-async-errors` library `npm install express-async-errors --save`
3. `mongoose` MongoDB object modeling tool designed to work in an asynchronous
   environment. [Documentation](https://mongoosejs.com/docs/guide.html)
    1. Install `mongoose` library `npm install mongoose @types/mongoose --save`
        - Mongoose is not work well with typescript.
            1. Issue#1: "While Creating a new User document, Typescript wants to make sure we are providing the correct
               properties - Mongoose does not make this easy."
          ```javascript
          // Solution to Issue#1: Solve the issue of TypeScript not being able to infer the type of the properties of the User model
          // In Mongoose, statics allows you to add static methods to your schema.
          // Static methods are available on the model (class) itself, rather than on individual instances of the model
          // (attrs: UserAttrs): This defines the parameter that the build method takes
          // Through this function, we can ensure that the user is created with the correct properties
          userSchema.statics.build = (attrs: UserAttrs) => {
              return new User(attrs);
           };
          ```
            2. Issue#2: "The properties that we pass to the use constructor don't necessarily match up with the
               properties available on the User model" or we can say "Issue number two was related to the fact that
               these set of properties that we pass in to create a new user document are different than the properties
               that actually exist on that document".
4. `cookie-session` library is used to manage cookies in the Node.js application. `cookie-session` is a middleware that
   stores the session data on the client within a cookie. It is signed with a secret to prevent
   tampering. [Documentation](https://www.npmjs.com/package/cookie-session)
    1. Install `cookie-session` library `npm install cookie-session @types/cookie-session --save`
5. `jsonwebtoken` library is used to generate and verify JWT
   tokens. [Documentation](https://www.npmjs.com/package/jsonwebtoken)
    1. Install `jsonwebtoken` library `npm install jsonwebtoken @types/jsonwebtoken --save`
6. `jest` library is used for testing. [Documentation](https://jestjs.io/docs/en/getting-started) and `supertest`
   library is used to test HTTP requests/responses. [Documentation](https://www.npmjs.com/package/supertest) and
   `mongodb-memory-server` library is used to create an in-memory MongoDB database for
   testing. [Documentation](https://www.npmjs.com/package/mongodb-memory-server)
    1. Install `jest` library
       `npm install jest @types/jest ts-jest supertest @types/supertest mongodb-memory-server --save-dev`

#### Trouble Shooting
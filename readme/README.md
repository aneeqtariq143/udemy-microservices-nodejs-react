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
   - typescript: A superset of JavaScript that adds static types, which can help catch errors early and improve code quality.
   - ts-node-dev: A development tool that combines ts-node and nodemon to automatically restart the server and recompile TypeScript files when changes are detected.
   - express: A minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.
   - @types/express: TypeScript type definitions for Express, which provide type information to help with development in TypeScript.
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
      - Note: Don't forget to add `node_modules` into `.dockerignore`. Because we don't want to copy the `node_modules` folder at the time of building image
   2. Build Docker Image `docker build -t aneeqtariq143/udemy-microservices-nodejs-react-auth-service .`
   3. Create kubernetes `Deployment` file under project root directory `infra/k8s/auth-depl.yaml`   
      - Note: install `minikube` for [ubuntu](https://kubernetes.io/docs/tasks/tools/install-minikube) or `Docker-Toolbox` for Window/Mac
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
   7. Add `ingress-nginx-controller` to `/etc/hosts` file. In our case it's we add `minikube ip` to `/etc/hosts` file `192.168.49.2 dev.ticketing.dev`.
      - Note: In linux we use `minikube ip` and Windows/Mac we use `Docker-Toolbox` ip
      - Run command `minikube ip` to get the ip address of minikube or use `minikube dashboard` and Navigate to Ingresses Select desired ingress service to get the ip address of minikube
    8. Access `auth` microservice from browser `http://dev.ticketing.dev/api/users/currentuser`


#### Folder & Files Organizational Structure
1. Each service has its own folder
   1. Each route handler has its own file inside `src/routes` folder
2. Common libraries shared between all the resources
   1. **Normalize Response**. Send a `Status Code` and `Error Message` in a consistent format. All the microservices should follow the same format.
      1. **Tip**: Create a abstract class `CustomError` and extend it in all the services.
      2. **Async Error Handler**: Use ExpressJS Async Errors package `npm install express-async-errors --save`. By using this package, all the error throws from async functions start working properly.
3. `infra` folder contains all the kubernetes configuration files
4. 


#### Libraries Used
1. `express-validator` for validation. [Documentation](https://express-validator.github.io/docs/)
   1. Install `express-validator` library `npm install --save express-validator`
2. `express-async-errors` ExpressJS Async Errors package. By using this package, all the error throws from async functions start working properly [Documentation](https://www.npmjs.com/package/express-async-errors)
   1. Install `express-async-errors` library `npm install express-async-errors --save`
3. `mongoose` MongoDB object modeling tool designed to work in an asynchronous environment. [Documentation](https://mongoosejs.com/docs/guide.html)
   1. Install `mongoose` library `npm install mongoose @types/mongoose --save`
      - Mongoose is not work well with typescript.
        1. Issue#1: "While Creating a new User document, Typescript wants to make sure we are providing the correct properties - Mongoose does not make this easy."
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
        2. Issue#2: "The properties that we pass to the use constructor don't necessarily match up with the properties available on the User model" or we can say "Issue number two was related to the fact that these set of properties that we pass in to create a new user document are different than the properties that actually exist on that document".
4. 

#### Trouble Shooting
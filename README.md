
# Social Network app

Backend social network application using serverless framework ,typescript, AWS, SDKv3, DynamoDB Single table design, Hexagonal Arquitecture, Best practices.


## 🔗 Links

[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/kennyluquet/)

[Kenny Luque](https://kennyluque.vercel.app/)


## Usage

Navigate into a branch to specific implementation.


## Blogs list

- Desarrollando Aplicaciones Escalables con Arquitectura Hexagonal, Serverless Framework, TypeScript y AWS

https://medium.com/@kenny.luque.t/c31c8e3cbac6

## Estrctura del proyecto

```bash

├── src
│   ├── functions
│   │   └── getSurvey
│   └── core
│       ├── config
│       │   └── environment.ts
│       ├── app
│       │   ├── schemas
│       │   ├── usecases
│       │   └── ports
│       ├── domain
│       │   ├── models
│       │   └── services
│       │       └── repositories
│       └── infrastructure
│           ├── adapters
│           ├── repositories
│           └── utils
├── test
│   ├── functions
│   │   └── ...
│   └── core
│        └── ...
├── serverless.yml
└── package.json

```

## Social network business use case

This use case talks about using DynamoDB as a social network. A social network is an online service that lets different users interact with each other. The social network we'll design will let the user see a timeline consisting of their posts, their followers, who they are following, and the posts written by who they are following. The access patterns for this schema design are:

* Get user information for a given userID

* Get follower list for a given userID

* Get following list for a given userID

* Get post list for a given userID

* Get user list who likes the post for a given postID

* Get the like count for a given postID

* Get the timeline for a given userID
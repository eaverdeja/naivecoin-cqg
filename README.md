# Naivecoin

### Yet another fork from the [original naivecoin project](https://github.com/conradoqg/naivecoin)

_Note: This is still a work in progress!_

My aim with this project is to explore new technologies and techniques as to contribute to the naivecoin project and to make my own understanding of the innerworks of a blockchain more solid

## Features

Some of the already implemented features:

- Adding a merkle root to the block. This makes the miner's job easier as now he only he has to hash an input of constant size - hashing in the original implementation JSON.stringifies the whole transaction objects, making the hash input much larger
- Replacing the original API for a GraphQL API. This was done for a few different reasons:
  - I REALLY want to learn and exercise GraphQL :)
  - Consuming the API with GraphQL Playground instea d of using Swagger made playing with it and grasping the possible operations way much easier
  - GraphQL Playground gives us excellent documentation on the whole schema, giving us one place to learn and play at the same time. In my honest opinion, that's especially nice for this specific project.
  - Apollo gives us Apollo Engine, which can give useful API perfomance metrics
  - The [frontend app](https://github.com/eaverdeja/naivecoin-explorer) for this project was made using React + Apollo Client. Building the UI was really smooth seeing as my domain my neatly mapped (in most part) with GraphQL schemas
  - Changes were also done at the node level, using apollo-fetch as a GraphQL client. This was especially cool, leading me to implement some other behaviours in the communication protocol
- Nodes now broadcast their known peers to other peers when receiving known peers or when receiving valid new blocks. Broadcasting is controlled by a simple peerMap
- The docker-compose setup now comprehends the frontend app too, making it necessary to clone the frontendapp to the parent folder of this project and building it's docker image to get the whole thing running

## Setup

The [original naivecoin project](https://github.com/conradoqg/naivecoin) can still be used as a reference for the setup commands, except the for the docker part. For now, running `docker-compose` can only be done with:

```
$ docker-compose up
```

This starts 3 nodes and 3 frontend explorer apps plus a local dns service for the bridge. More options coming soon.

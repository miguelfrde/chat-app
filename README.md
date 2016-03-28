# chat-app

Simple ionic2 chat app with a microservice oriented backend (users api, chat server, pull notifications service).

Developed for the course distributed systems at ITESO.

## Set up

On OSX, you'll need to install the following:

```
$ brew install nginx docker docker-machine docker-compose thrift
$ npm install -g ionic@beta
$ docker-machine create --driver virtualbox default
$ eval "$(docker-machine env default)"
```

Clone this repo and generate the thrift code for the pull notifications by doing:

```
$ ./gen-rpc-thrift.sh
```

Setup and start nginx so that the requests to localhost are redirected to the docker-machine:

```
$ cp nginx-conf/server /usr/local/etc/nginx/servers/distributed
$ cp nginx-conf/proxy-headers /usr/local/etc/nginx/includes/
$ sudo nginx
```

Finally, run the app by running the following two commands on different terminal sessions:

```
$ docker-compose up
$ ionic serve
```

You can build the app (only tested for android) using standard ionic commands. You'll need additional android
dependencies to do so.

```
$ ionic build android
$ ionic run android --consolelogs --serverlogs --livereload
```


## Deploying

Ideally, this app should be deployed to Google Container Engine, using Kubernetes and a GCE persistent disk for MongoDB.


## Possible improvements

1. Redis backend to scale the chat server to multiple nodes.
2. Load messages in the app in chunks when entering a chat room.
3. Allow to send other types of media
4. Store messages history (not so important, not the purpose of this app)
5. Add new contact information to the notifications.
6. Push notifications instead of poll notifications.

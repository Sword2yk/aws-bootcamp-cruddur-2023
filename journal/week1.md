# Week 1 Homework — Docker and App Containerization

## Backend Containerization

I created a file on backend-flask dir: <br>
``` backend-flask/Dockerfile ``` <br>

![Backend-flask Docker File](week_1_assets/Backend-flask_docker.png) <br>

I used the docker syntax below to build the backend-flask container <br>

``` docker build -t  backend-flask ./backend-flask ``` <br>

Which is running on the background. <br>

![Backend-flask Container](week_1_assets/Docker_Backend-flask.png) <br>

## Container Images or Running Container Ids

I used ``` docker container run --rm -p 4567:4567 -d backend-flask ``` to print my container Id. <br>

![Container ID](week_1_assets/docker_container_id.png) <br>

## My containers list and images

``` docker ps ``` <br>

![Containers](week_1_assets/docker_container_list.png) <br>

``` docker image ``` <br>

![Images](week_1_assets/docker_images.png) <br>


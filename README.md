# Agenda
Finally after two weeks of coding, I have managed to complete the first version 
of my latest project: Agenda, a fullstack todo list web application. 
I had wanted to do this project since I finished a similar todo list app in vanilla 
javascript, but I decided to wait till I became more familiar with the 
React framework. 

I'm glad I didn't jump onto building it right away because I was able to use 
a lot of the things I've learned the past three months as well include 
many cool features if I'd say so myself. For example, the application
supports a complete event calendar that displays tasks in 4 different views, 
and there is an interactive kanban board that users can use to 
change the status of a task. 

## Features 
* Adding, updating, duplicating and deleting tasks. Tasks are shown 
in an event calendar in 4 different views: daily time grid, weekly time grid and 
list, and monthly calendar
* Adding projects and managing project tasks. Projects are shown in a kanban board
where users can manage the status of each tasks. 
* User authentication. Users have to be logged in to use the application
* Dark mode. Users can switch between dark and light mode.

## What tools I used: 
The tools that I use to build the front-end are: 
React, TailwindCSS, React Router DOM, Formik, Yup, Axios,
React Google Login and Google API script (for
the Google Sign In feature), FullCalendar (for the event calendar), 
React Beautiful Drag and Drop (for the Kanban board),
Redux Toolkit and React Redux (for state management).

The tools that I used to create the backend are: 
NodeJS, ExpressJS, Mongoose, Jsonwebtoken

## What I have learned along the way:
While building the front-end of this app, I've learned:
* How to use Redux Toolkit to manage the states of my application and 
how to dispatch both synchronous and asynchronous actions. 
* How to use Axios to make requests to and handle responses from my backend server
* How to use external APIs, such as React Google Login, React Beautiful DnD
and FullCalendar, and fully integrate them into an application
* How to set up Nested Routes and Dynamic Routes with React Router

I have learned so much while developing the backend, and a lot of it came from
watching a MERN application tutorial by JavaScript Mastery on Youtube. It would've
taken a long time to figure everything out myself so I'm thankful for those 
videos. I've learned:
* How to set up routes for server requests with ExpressJS as well as 
the difference between Express Router and React Router
* How to handle different kinds of server requests like get, post, patch and
delete as well as different status codes for server requests
* How to set up and integrate MongoDB into my application
* How  to create a mongoose model and handle CRUD operations with data in MongoDB.
* MongoDB subdocuments and how to update them in the database
* How to use Jsonwebtoken to authenticate users  
* How to set up an authentication middleware for server requests

## What's next?
I've done a lot for the first version, but I still want to include a few more 
features to make the app more complete. So for the next version, I plan to include:
* Settings page where user can set up their profile and choose a theme for the 
app
* Notifications about tasks that are about to be due
* Messenger page where users can interact with each other, like Facebook Messenger

I noticed that while building the front-end, I had to build a lot of components 
from scratch and wrote of a lot of the styling myself. Although that gave me 
more practice with tailwind, I think I can save time doing that by using 
components already built with MUI for example. 
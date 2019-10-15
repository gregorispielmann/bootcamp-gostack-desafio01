const express = require("express");

const server = express();

//read json at body
server.use(express.json());

//Request:
//Query params = ?teste=1 - req.query
//Route params = /projects/1 - req.params
//Req body = { "name": "Gregori", "email": "gregori@pixeltech.com.br" }

const projects = [];
let counter = 0;

//MIDDLEWARES
function counterReq(req, res, next) {
  counter++;
  console.log(`Requisições: ${counter}`);
  next();
}

function projectExists(req, res, next) {
  const { id } = req.params;
  project = projects.find(p => p.id == id);
  if (!project) res.status(400).send("Project not found!");
  else next();
}

//ROUTES
server.get("/projects", counterReq, (req, res) => {
  res.json(projects);
});

server.post("/projects", counterReq, (req, res) => {
  const { id, title } = req.body;

  projects.push({
    id: id,
    title: title,
    tasks: []
  });

  res.send(`New Project "${title}" created!`);
});

server.put("/projects/:id", counterReq, projectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);
  project.title = title;
  res.send("Successfully altered!");
});

server.delete("/projects/:id", counterReq, projectExists, (req, res) => {
  const { id } = req.params;

  const projectId = projects.findIndex(p => p.id == id);

  projects.splice(projectId, 1);

  res.send("Successfully removed!");
});

server.post("/projects/:id/tasks", counterReq, projectExists, (req, res) => {
  const { id } = req.params;
  const task = req.body.title;

  const projectId = projects.findIndex(p => p.id == id);

  projects[projectId].tasks.push(task);

  res.send("Successfully task inserted!");
});

server.listen(3000);

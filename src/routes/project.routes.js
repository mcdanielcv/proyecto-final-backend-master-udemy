'use strict'

var express = require('express');
var projectController = require('../controllers/project.controller');

var router = express.Router();

//middelware ->se ejecuta antes de que se ejecute la accion del controlador
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart({uploadDir : './uploads'});



router.get('/home', projectController.home);
router.get('/test', projectController.test);
router.post('/save-project', projectController.saveProject);
router.get('/project/:id', projectController.getProject);
router.get('/projects', projectController.getProjects);
router.put('/project-update/:id', projectController.updateProject);
router.delete('/project-delete/:id', projectController.deleteProject);
router.post('/upload-image/:id',multipartMiddleware, projectController.uploadImage);
router.get('/get-image/:image', projectController.getImageFile);

module.exports = router;
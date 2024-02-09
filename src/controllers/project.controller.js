'use strict'


const Project = require('../model/project');
var fs = require('fs');  //libreria file system
var path = require('path');

const controller = {
    home: function (req, res) {
        return res.status(200).send({
            message: 'Soy la home'

        });
    },
    test: function (req, res) {
        return res.status(200).send({
            message: 'soy el metodo test controlador'
        });
    },
    saveProject: function (req, res) {
        let project = new Project(); //instancio proyecto
        let params = req.body;

        project.name = params.name;
        project.description = params.description;
        project.category = params.category;
        project.langs = params.langs;
        project.year = params.year;
        project.image = null;

        project.save().then((projectStored) => {
            if (!projectStored) return res.status(404).send({ message: 'No se ha podido guardar el proyecto' });

            return res.status(200).send({ project: projectStored });
        }).catch((err) => {
            return res.status(500).send({ message: 'Error en la peticion' });
        })
    },
    getProject: function (req, res) {
        var projectId = req.params.id;
        if (projectId == null) return res.status(404).send({ message: 'El proyecto no existe' });

        Project.findById(projectId).then((project) => {
            if (!project) return res.status(404).send({ message: 'El proyecto no existe' });

            return res.status(200).send({
                project
            });
        }).catch((err) => {
            return res.status(500).send({ message: 'Error en la peticion' });
        });
    },
    getProjects: function (req, res) {
        Project.find({}).sort({ year: 'desc', test: 1 }).then((projects) => {
            if (!projects) return res.status(404).send({ message: 'No hay proyectos que mostrar' });
            return res.status(200).send({ projects });
        }).catch((err) => {
            return res.status(500).send({ message: 'Error en la peticion' });
        });
    },
    updateProject: function (req, res) {
        var projectId = req.params.id;
        var update = req.body; //objeto completo con los datos ya actualizados
        Project.findByIdAndUpdate(projectId, update, { new: true }).then((projectUpdate) => {
            if (!projectUpdate) return res.status(404).send({ message: 'No hay proyecto que actualizar' });
            return res.status(200).send({ project: projectUpdate });
        }).catch((err) => {
            return res.status(500).send({ message: 'Error en la peticion' });
        })
    },
    deleteProject: function (req, res) {
        var projectId = req.params.id;
        Project.findByIdAndDelete(projectId).then((projectDelete) => {
            if (!projectDelete) return res.status(404).send({ message: 'No hay proyecto que actualizar' });
            return res.status(200).send({ message: 'Borrado Exitoso', project: projectDelete });
        }).catch((err) => {
            return res.status(500).send({ message: 'Error en la peticion' });
        })
    },
    uploadImage: function (req, res) {
        var projectId = req.params.id;
        var fileName = 'Imagen no subida..';

        if (req.files) {
            var filePath = req.files.image.path;
            var fileSplit = filePath.split('\\');
            var fileName = fileSplit[1];
            var extensionSplit = fileName.split('.');
            var fileExt = extensionSplit[1];
            if (fileExt == 'png' || fileExt == 'jpg' || fileExt == 'gif' || fileExt == 'JPG') {
                Project.findByIdAndUpdate(projectId, { image: fileName }, { new: true }).then((projectUpdate) => {
                    if (!projectUpdate) return res.status(404).send({ message: 'No hay proyecto al cual subir imagen' });
                    return res.status(200).send({ message: 'Imagen Cargada al proyecto', project: projectUpdate });
                }).catch((err) => {
                    return res.status(500).send({ message: 'Error en la peticion' });
                })
            } else {
                fs.unlink(filePath, function (err) {
                    return res.status(200).send({ message: 'Extension no es valida ' });

                });
            }
        } else {
            if(res.status(200)){
                return res.status(200).send({
                    message: fileName
                });
            }

            if(res.status(500)){
                return res.status(500).send({
                    message: fileName
                });
            }
        }
    },
    getImageFile: function (req, res) {
        var file = req.params.image;
        var path_file = './uploads/' + file;
        fs.exists(path_file, (exists) => {
            if (exists) {
                return res.sendFile(path.resolve(path_file));
            } else {
                return res.status(200).send({ message: 'No existe la ruta' });
            }
        });
    }
};

module.exports = controller;
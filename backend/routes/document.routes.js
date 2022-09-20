module.exports = app => {
	const documents = require("../controllers/document.controller.js");

	var router = require("express").Router();

	router.post("/upload", documents.upload);

	app.use('/api/documents', router);
}
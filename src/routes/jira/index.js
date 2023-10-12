const routes = require('express').Router()
const jiraController = require('../../controllers/jiraController')

routes.get('/issue', jiraController.indexIssueByID)
routes.get('/projects', jiraController.indexRecentProjects)
routes.get('/users', jiraController.indexUsersFunc)
routes.get('/issues', jiraController.indexIssuesFunc)

module.exports = routes
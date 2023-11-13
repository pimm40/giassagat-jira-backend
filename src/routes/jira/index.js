const routes = require('express').Router()
const jiraController = require('../../controllers/jiraController')

routes.get('/issue', jiraController.indexIssueByID)
routes.get('/projects', jiraController.indexProjects)
routes.get('/projects/all', jiraController.indexAllProjects)
routes.get('/projects/period', jiraController.indexProjectsByPeriod)
routes.get('/projects/key-period', jiraController.indexProjectKeyByPeriod)
routes.get('/users', jiraController.indexUsersFunc)
routes.get('/issues', jiraController.indexIssuesFunc)

module.exports = routes
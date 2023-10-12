const routes = require('express').Router()
const jiraRoute = require('./jira')

routes.use('/jira', jiraRoute)


module.exports = routes
const axios = require('axios')
require('dotenv').config()

const username = process.env.ATLASSIAN_USERNAME
const password = process.env.ATLASSIAN_API_KEY
const domain = process.env.DOMAIN

const auth = {
  username: username,
  password: password
}

async function getProjects () {
  try {
    const baseUrl = 'https://' + domain + '.atlassian.net'

    const config = {
      method: 'get',
      url: baseUrl + '/rest/api/3/project/recent',
      headers: { 'Content-Type': 'application/json' },
      auth: auth
    }
    const response = await axios.request(config)
    // Mapear os dados para retornar apenas as propriedades desejadas
    const mappedData = response.data.map(project => ({
      name: project.name,
      key: project.key,
      projectCategory: {
        id: project.projectCategory.id,
        name: project.projectCategory.name
      }
    }));

    console.log(mappedData);
    return mappedData;
  } catch (error) {
    console.log('error: ')
    console.log(error.response.data.errors)
  }
}

async function getIssueByID(issueKey) {
  try {
    const baseUrl = 'https://' + domain + '.atlassian.net';

    const config = {
      method: 'get',
      url: baseUrl + '/rest/api/3/issue/' + issueKey,
      headers: { 'Content-Type': 'application/json' },
      auth: auth,
    };

    const response = await axios.request(config);

    // Filtrar os campos desejados da resposta da API
    const filteredData = {
      id: response.data.id,
      key: response.data.key,
      fieldField_id: response.data.fields.customfield_10500.id,
      fieldField_name: response.data.fields.customfield_10500.name,
      assigneeAccountId: response.data.fields.assignee.accountId,
      assigneeDisplayName: response.data.fields.assignee.displayName,
      project_id: response.data.fields.project.id,
      project_key: response.data.fields.project.key,
      project_name: response.data.fields.project.name,
      projectCategory_id: response.data.fields.project.projectCategory.id,
      projectCategory_name: response.data.fields.project.projectCategory.name,
      timetrackingTimeSpent: response.data.fields.timetracking.timeSpent,
      timetrackingStatus_id: response.data.fields.status.id,
      timetrackingStatus_name: response.data.fields.status.name,
      statusCategory_id: response.data.fields.status.statusCategory.id,
      statusCategory_key: response.data.fields.status.statusCategory.key,
      statusCategory_colorName: response.data.fields.status.statusCategory.colorName,
      statusCategory_name: response.data.fields.status.statusCategory.name
    };

    console.log(filteredData);
    return filteredData;
  } catch (error) {
    console.log('error: ');
    console.log(error.response.data.errors);
  }
}


async function getUsers () {
  try {
    const baseUrl = 'https://' + domain + '.atlassian.net'

    const config = {
      method: 'get',
      url: baseUrl + '/rest/api/3/users',
      headers: { 'Content-Type': 'application/json' },
      auth: auth
    }
    const response = await axios.request(config)
    console.log(response.data)
    return response.data
  } catch (error) {
    console.log('error: ')
    console.log(error.response.data.errors)
  }
}

async function getIssues() {
  try {
    const baseUrl = 'https://' + domain + '.atlassian.net';

    const config = {
      method: 'get',
      url: baseUrl + '/rest/api/3/search',
      headers: { 'Content-Type': 'application/json' },
      auth: auth
    }

    const response = await axios.request(config);
    const issues = response.data.issues.map(issue => ({
      id: issue.id,
      key: issue.key,
      fields: {
        project: {
          id: issue.fields.project.id,
          key: issue.fields.project.key,
          name: issue.fields.project.name,
          projectCategory: {
            id: issue.fields.project.projectCategory.id,
            name: issue.fields.project.projectCategory.name
          }
        }
      }
    }));

    console.log(issues);
    return issues;
  } catch (error) {
    console.log('error: ');
    console.log(error.response.data.errors);
  }
}

module.exports = {
  getProjects,
  getIssues,
  getIssueByID,
  getUsers
}




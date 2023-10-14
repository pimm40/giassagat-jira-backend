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
    console.log('issueKey')
    const config = {
      method: 'get',
      url: baseUrl + '/rest/api/3/issue/' + issueKey,
      headers: { 'Content-Type': 'application/json' },
      auth: auth,
    };
    console.log('config', config);
    const response = await axios.request(config);
    let filteredData = {}; // Inicialize filteredData como um objeto vazio
    try {
      if (response.data) {
        const data = response.data;
        const modifiedData = {
          id: data.id ?? '',
          key: data.key ?? '',
          fields: {
            assignee: {
              accountId: data.fields.assignee?.accountId ?? '',
              displayName: data.fields.assignee?.displayName ?? ''
            },
            reporter: {
              accountId: data.fields.reporter?.accountId ?? '',
              displayName: data.fields.reporter?.displayName ?? ''
            },
            issuetype: {
              id: data.fields.issuetype?.id ?? '',
              description: data.fields.issuetype?.description ?? '',
              name: data.fields.issuetype?.name ?? ''
            },
            project: {
              id: data.fields.project?.id ?? '',
              key: data.fields.project?.key ?? '',
              name: data.fields.project?.name ?? '',
              projectTypeKey: data.fields.project?.projectTypeKey ?? '',
              projectCategory: {
                id: data.fields.project?.projectCategory?.id ?? '',
                description: data.fields.project?.projectCategory?.description ?? '',
                name: data.fields.project?.projectCategory?.name ?? ''
              }
            },
            summary: data.fields.summary ?? '',
            priority: {
              id: data.fields.priority?.id ?? '',
              name: data.fields.priority?.name ?? ''
            },
            status: {
              id: data.fields.status?.id ?? '',
              description: data.fields.status?.description ?? '',
              statusCategory: {
                id: data.fields.status?.statusCategory?.id ?? '',
                key: data.fields.status?.statusCategory?.key ?? '',
                colorName: data.fields.status?.statusCategory?.colorName ?? '',
                name: data.fields.status?.statusCategory?.name ?? ''
              }
            },
            creator: {
              accountId: data.fields.creator?.accountId ?? '',
              displayName: data.fields.creator?.displayName ?? ''
            },
            timetracking: {
              remainingEstimate: data.fields.timetracking?.remainingEstimate ?? '',
              timeSpent: data.fields.timetracking?.timeSpent ?? '',
              remainingEstimateSeconds: data.fields.timetracking?.remainingEstimateSeconds ?? '',
              timeSpentSeconds: data.fields.timetracking?.timeSpentSeconds ?? ''
            }
          }
        };

        console.log('modifiedData ok');
        filteredData = modifiedData; // Atribua modifiedData a filteredData
        };
    } catch (error) {
      console.error("Erro ao filtrar dados da resposta da API:", error);
    }

    console.log('filteredData', filteredData);
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




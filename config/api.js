const axios = require('axios')
require('dotenv').config()

const username = process.env.ATLASSIAN_USERNAME
const password = process.env.ATLASSIAN_API_KEY
const domain = process.env.DOMAIN

const auth = {
  username: username,
  password: password
}

async function getProjects(projectKey) {
  try {
    const baseUrl = 'https://' + domain + '.atlassian.net';
    let jql = 'project is not EMPTY';

    if (projectKey) {
      jql = 'project=' + projectKey;
    }

    const config = {
      method: 'get',
      url: baseUrl + '/rest/api/3/search?jql=' + jql,
      headers: { 'Content-Type': 'application/json' },
      auth: auth
    }

    console.log('config', config);
    const response = await axios.request(config);
    let filteredData = []; // Inicialize filteredData como um array vazio para armazenar a lista de objetos

    try {
      if (response.data) {
        const data = response.data.issues;
        for (const issue of data) {
          const modifiedData = {
            id: issue.id ?? '',
            key: issue.key ?? '',
            fields: {
              customfield_11282: {
                id: issue.fields.customfield_11282?.id ?? '',
                value: issue.fields.customfield_11282?.value ?? ''
              },
              customfield_11397: {
                accountId: issue.fields.customfield_11397?.accountId ?? '',
                displayName: issue.fields.customfield_11397?.displayName ?? ''
              },
              assignee: {
                accountId: issue.fields.assignee?.accountId ?? '',
                displayName: issue.fields.assignee?.displayName ?? ''
              },
              reporter: {
                accountId: issue.fields.reporter?.accountId ?? '',
                displayName: issue.fields.reporter?.displayName ?? ''
              },
              project: {
                id: issue.fields.project?.id ?? '',
                key: issue.fields.project?.key ?? '',
                name: issue.fields.project?.name ?? '',
                projectTypeKey: issue.fields.project?.projectTypeKey ?? '',
                projectCategory: {
                  id: issue.fields.project?.projectCategory?.id ?? '',
                  description: issue.fields.project?.projectCategory?.description ?? '',
                  name: issue.fields.project?.projectCategory?.name ?? ''
                }
              },
              summary: issue.fields.summary ?? '',
              priority: {
                id: issue.fields.priority?.id ?? '',
                name: issue.fields.priority?.name ?? ''
              },
              status: {
                id: issue.fields.status?.id ?? '',
                name: issue.fields.status?.name ?? '',
                description: issue.fields.status?.description ?? '',
                statusCategory: {
                  id: issue.fields.status?.statusCategory?.id ?? '',
                  key: issue.fields.status?.statusCategory?.key ?? '',
                  colorName: issue.fields.status?.statusCategory?.colorName ?? '',
                  name: issue.fields.status?.statusCategory?.name ?? ''
                }
              },
              creator: {
                accountId: issue.fields.creator?.accountId ?? '',
                displayName: issue.fields.creator?.displayName ?? ''
              }
            }
          };

          filteredData.push(modifiedData); // Adicione o objeto modificado à lista
        }
      }
    } catch (error) {
      console.error("Erro ao filtrar dados da resposta da API:", error);
    }

    console.log('filteredData', filteredData);
    return filteredData;
  } catch (error) {
    console.log('error:');
    console.log(error.response.data.errors);
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




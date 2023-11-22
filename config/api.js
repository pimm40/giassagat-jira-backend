const axios = require('axios')
require('dotenv').config()

const username = process.env.ATLASSIAN_USERNAME
const password = process.env.ATLASSIAN_API_KEY
const domain = process.env.DOMAIN

const auth = {
  username: username,
  password: password
}

async function getAllProjects(projectKey, pageSize = 50, startAt = 0) {
  try {
    const baseUrl = 'https://' + domain + '.atlassian.net';
    let jql = 'project is not EMPTY';

    if (projectKey) {
      jql = `project=${projectKey}`;
    }

    const apiUrl = new URL(baseUrl);
    apiUrl.pathname = '/rest/api/3/search';
    apiUrl.searchParams.append('jql', jql);
    apiUrl.searchParams.append('maxResults', pageSize);
    apiUrl.searchParams.append('startAt', startAt);

    const config = {
      method: 'get',
      url: apiUrl.toString(),
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
              customfield_10975: {
                id: issue.fields.customfield_10975?.id ?? '',
                value: issue.fields.customfield_10975?.value ?? ''
              },
              customfield_11222: {
                id: issue.fields.customfield_11222?.id ?? '',
                value: issue.fields.customfield_11222?.value ?? ''
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
              description: issue.fields.description?.content[0]?.content[0]?.text ?? '',
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

    // Verificar se há mais páginas de resultados
    const totalResults = response.data.total;
    const nextPageStartAt = startAt + pageSize;

    if (nextPageStartAt < totalResults) {
      // Fazer uma chamada recursiva para buscar a próxima página de resultados
      const nextPageResults = await getProjects(projectKey, pageSize, nextPageStartAt);
      filteredData = filteredData.concat(nextPageResults);
    }

    return filteredData;
  } catch (error) {
    console.log('error:');
    console.log(error.response.data.errors);
  }

}
async function getProjectKeyByPeriod(projectKey, startDate, endDate, pageSize, pageNumber) {
  try {
    const baseUrl = 'https://' + domain + '.atlassian.net';
    const jql = `project=${projectKey} AND created >= '${startDate}' AND created <= '${endDate}'`;

    const apiUrl = new URL(baseUrl);
    apiUrl.pathname = '/rest/api/3/search';
    apiUrl.searchParams.append('jql', jql);
    apiUrl.searchParams.append('maxResults', pageSize);
    apiUrl.searchParams.append('startAt', (parseInt(pageNumber, 10) - 1) * parseInt(pageSize, 10));

    const config = {
      method: 'get',
      url: apiUrl.toString(),
      headers: { 'Content-Type': 'application/json' },
      auth: auth
    }

    console.log('config', config);
    const response = await axios.request(config);

    if (!response.data || !Array.isArray(response.data.issues)) {
      throw new Error("Resposta da API não possui dados válidos.");
    }

    const data = response.data.issues;
    const filteredData = data.map(issue => {
      return {
        id: issue.id || '',
        key: issue.key || '',
        fields: {
          customfield_11282: {
            id: issue.fields.customfield_11282?.id || '',
            value: issue.fields.customfield_11282?.value || ''
          },
          customfield_11397: {
            accountId: issue.fields.customfield_11397?.accountId || '',
            displayName: issue.fields.customfield_11397?.displayName || ''
          },
          customfield_10975: {
            id: issue.fields.customfield_10975?.id ?? '',
            value: issue.fields.customfield_10975?.value ?? ''
          },
          customfield_11222: {
            id: issue.fields.customfield_11222?.id ?? '',
            value: issue.fields.customfield_11222?.value ?? ''
          },
          assignee: {
            accountId: issue.fields.assignee?.accountId || '',
            displayName: issue.fields.assignee?.displayName || ''
          },
          reporter: {
            accountId: issue.fields.reporter?.accountId || '',
            displayName: issue.fields.reporter?.displayName || ''
          },
          project: {
            id: issue.fields.project?.id || '',
            key: issue.fields.project?.key || '',
            name: issue.fields.project?.name || '',
            projectTypeKey: issue.fields.project?.projectTypeKey || '',
            projectCategory: {
              id: issue.fields.project?.projectCategory?.id || '',
              description: issue.fields.project?.projectCategory?.description || '',
              name: issue.fields.project?.projectCategory?.name || ''
            }
          },
          description: issue.fields.description?.content[0]?.content[0]?.text || '',
          summary: issue.fields.summary || '',
          priority: {
            id: issue.fields.priority?.id || '',
            name: issue.fields.priority?.name || ''
          },
          status: {
            id: issue.fields.status?.id || '',
            name: issue.fields.status?.name || '',
            description: issue.fields.status?.description || '',
            statusCategory: {
              id: issue.fields.status?.statusCategory?.id || '',
              key: issue.fields.status?.statusCategory?.key || '',
              colorName: issue.fields.status?.statusCategory?.colorName || '',
              name: issue.fields.status?.statusCategory?.name || ''
            }
          },
          creator: {
            accountId: issue.fields.creator?.accountId || '',
            displayName: issue.fields.creator?.displayName || ''
          }
        }
      };
    });

    const totalPages = Math.ceil(parseInt(response.data.total, 10) / parseInt(pageSize, 10));

    if (parseInt(pageNumber, 10) < totalPages) {
      const nextPageResults = await getProjectKeyByPeriod(projectKey, startDate, endDate, parseInt(pageSize, 10), parseInt(pageNumber, 10) + 1);
      filteredData.push(...nextPageResults);
    }

    return filteredData;
  } catch (error) {
    console.error("Erro na chamada da API:", error);
    throw error;
  }
}
async function getProjects(projectKey, pageSize, pageNumber) {
  try {
    const baseUrl = 'https://' + domain + '.atlassian.net';
    let jql = 'project is not EMPTY';

    if (projectKey) {
      jql = `project=${projectKey}`;
    }

    const apiUrl = new URL(baseUrl);
    apiUrl.pathname = '/rest/api/3/search';
    apiUrl.searchParams.append('jql', jql);
    apiUrl.searchParams.append('maxResults', pageSize);
    apiUrl.searchParams.append('startAt', (parseInt(pageNumber, 10) - 1) * parseInt(pageSize, 10));

    const config = {
      method: 'get',
      url: apiUrl.toString(),
      headers: { 'Content-Type': 'application/json' },
      auth: auth
    }

    console.log('config', config);
    const response = await axios.request(config);

    if (!response.data || !Array.isArray(response.data.issues)) {
      throw new Error("Resposta da API não possui dados válidos.");
    }

    const data = response.data.issues;
    const filteredData = data.map(issue => {
      return {
        id: issue.id || '',
        key: issue.key || '',
        fields: {
          customfield_11282: {
            id: issue.fields.customfield_11282?.id || '',
            value: issue.fields.customfield_11282?.value || ''
          },
          customfield_11397: {
            accountId: issue.fields.customfield_11397?.accountId || '',
            displayName: issue.fields.customfield_11397?.displayName || ''
          },
          customfield_10975: {
            id: issue.fields.customfield_10975?.id ?? '',
            value: issue.fields.customfield_10975?.value ?? ''
          },
          customfield_11222: {
            id: issue.fields.customfield_11222?.id ?? '',
            value: issue.fields.customfield_11222?.value ?? ''
          },
          assignee: {
            accountId: issue.fields.assignee?.accountId || '',
            displayName: issue.fields.assignee?.displayName || ''
          },
          reporter: {
            accountId: issue.fields.reporter?.accountId || '',
            displayName: issue.fields.reporter?.displayName || ''
          },
          project: {
            id: issue.fields.project?.id || '',
            key: issue.fields.project?.key || '',
            name: issue.fields.project?.name || '',
            projectTypeKey: issue.fields.project?.projectTypeKey || '',
            projectCategory: {
              id: issue.fields.project?.projectCategory?.id || '',
              description: issue.fields.project?.projectCategory?.description || '',
              name: issue.fields.project?.projectCategory?.name || ''
            }
          },
          description: issue.fields.description?.content[0]?.content[0]?.text || '',
          summary: issue.fields.summary || '',
          priority: {
            id: issue.fields.priority?.id || '',
            name: issue.fields.priority?.name || ''
          },
          status: {
            id: issue.fields.status?.id || '',
            name: issue.fields.status?.name || '',
            description: issue.fields.status?.description || '',
            statusCategory: {
              id: issue.fields.status?.statusCategory?.id || '',
              key: issue.fields.status?.statusCategory?.key || '',
              colorName: issue.fields.status?.statusCategory?.colorName || '',
              name: issue.fields.status?.statusCategory?.name || ''
            }
          },
          creator: {
            accountId: issue.fields.creator?.accountId || '',
            displayName: issue.fields.creator?.displayName || ''
          }
        }
      };
    });

    const totalPages = Math.ceil(parseInt(response.data.total, 10) / parseInt(pageSize, 10));

    if (parseInt(pageNumber, 10) < totalPages) {
      const nextPageResults = await getProjects(projectKey, parseInt(pageSize, 10), parseInt(pageNumber, 10) + 1);
      filteredData.push(...nextPageResults);
    }

    return filteredData;
  } catch (error) {
    console.error("Erro na chamada da API:", error);
    throw error;
  }
}
async function getProjectsByPeriod(startDate, endDate, pageSize, pageNumber) {
  try {
    const baseUrl = 'https://' + domain + '.atlassian.net';
    const jql = `created >= '${startDate}' AND created <= '${endDate}'`;

    const apiUrl = new URL(baseUrl);
    apiUrl.pathname = '/rest/api/3/search';
    apiUrl.searchParams.append('jql', jql);
    apiUrl.searchParams.append('maxResults', pageSize);
    apiUrl.searchParams.append('startAt', (parseInt(pageNumber, 10) - 1) * parseInt(pageSize, 10));

    const config = {
      method: 'get',
      url: apiUrl.toString(),
      headers: { 'Content-Type': 'application/json' },
      auth: auth
    }

    console.log('config', config);
    const response = await axios.request(config);

    if (!response.data || !Array.isArray(response.data.issues)) {
      throw new Error("Resposta da API não possui dados válidos.");
    }

    const data = response.data.issues;
    const filteredData = data.map(issue => {
      return {
        id: issue.id || '',
        key: issue.key || '',
        fields: {
          customfield_11282: {
            id: issue.fields.customfield_11282?.id || '',
            value: issue.fields.customfield_11282?.value || ''
          },
          customfield_11397: {
            accountId: issue.fields.customfield_11397?.accountId || '',
            displayName: issue.fields.customfield_11397?.displayName || ''
          },
          customfield_10975: {
            id: issue.fields.customfield_10975?.id ?? '',
            value: issue.fields.customfield_10975?.value ?? ''
          },
          customfield_11222: {
            id: issue.fields.customfield_11222?.id ?? '',
            value: issue.fields.customfield_11222?.value ?? ''
          },
          assignee: {
            accountId: issue.fields.assignee?.accountId || '',
            displayName: issue.fields.assignee?.displayName || ''
          },
          reporter: {
            accountId: issue.fields.reporter?.accountId || '',
            displayName: issue.fields.reporter?.displayName || ''
          },
          project: {
            id: issue.fields.project?.id || '',
            key: issue.fields.project?.key || '',
            name: issue.fields.project?.name || '',
            projectTypeKey: issue.fields.project?.projectTypeKey || '',
            projectCategory: {
              id: issue.fields.project?.projectCategory?.id || '',
              description: issue.fields.project?.projectCategory?.description || '',
              name: issue.fields.project?.projectCategory?.name || ''
            }
          },
          description: issue.fields.description?.content[0]?.content[0]?.text || '',
          summary: issue.fields.summary || '',
          priority: {
            id: issue.fields.priority?.id || '',
            name: issue.fields.priority?.name || ''
          },
          status: {
            id: issue.fields.status?.id || '',
            name: issue.fields.status?.name || '',
            description: issue.fields.status?.description || '',
            statusCategory: {
              id: issue.fields.status?.statusCategory?.id || '',
              key: issue.fields.status?.statusCategory?.key || '',
              colorName: issue.fields.status?.statusCategory?.colorName || '',
              name: issue.fields.status?.statusCategory?.name || ''
            }
          },
          creator: {
            accountId: issue.fields.creator?.accountId || '',
            displayName: issue.fields.creator?.displayName || ''
          }
        }
      };
    });

    const totalPages = Math.ceil(parseInt(response.data.total, 10) / parseInt(pageSize, 10));

    if (parseInt(pageNumber, 10) < totalPages) {
      const nextPageResults = await getProjectsByPeriod(startDate, endDate, parseInt(pageSize, 10), parseInt(pageNumber, 10) + 1);
      filteredData.push(...nextPageResults);
    }

    return filteredData;
  } catch (error) {
    console.error("Erro na chamada da API:", error);
    throw error;
  }
}
async function getRDAByPeriod(RDA, startDate, endDate, pageSize, pageNumber) {
  try {
    const baseUrl = 'https://' + domain + '.atlassian.net';
    const jql = `created >= '${startDate}' AND created <= '${endDate}' AND issuetype=Task AND cf[10975]='${RDA}'`;
    console.log('jql', jql)
    const apiUrl = new URL(`${baseUrl}/rest/api/3/search`);
    apiUrl.searchParams.append('jql', jql);
    apiUrl.searchParams.append('maxResults', pageSize);
    apiUrl.searchParams.append('startAt', (parseInt(pageNumber, 10) - 1) * parseInt(pageSize, 10));

    console.log('apiUrl', apiUrl.toString())
    const config = {
      method: 'get',
      url: apiUrl.toString(),
      headers: { 'Content-Type': 'application/json' },
      auth: auth
    }

    console.log('config', config);
    const response = await axios.request(config);
    console.log('response', response)
    if (!response.data || !Array.isArray(response.data.issues)) {
      throw new Error("Resposta da API não possui dados válidos.");
    }

    const data = response.data.issues;
    const filteredData = data.map(issue => {
      console.log('issue => ', issue)
      return {
        id: issue.id || '',
        key: issue.key || '',
        fields: {
          customfield_11282: {
            id: issue.fields.customfield_11282?.id || '',
            value: issue.fields.customfield_11282?.value || ''
          },
          customfield_11397: {
            accountId: issue.fields.customfield_11397?.accountId || '',
            displayName: issue.fields.customfield_11397?.displayName || ''
          },
          customfield_10975: {
            id: issue.fields.customfield_10975?.id ?? '',
            value: issue.fields.customfield_10975?.value ?? ''
          },
          customfield_11222: {
            id: issue.fields.customfield_11222?.id ?? '',
            value: issue.fields.customfield_11222?.value ?? ''
          },
          assignee: {
            accountId: issue.fields.assignee?.accountId || '',
            displayName: issue.fields.assignee?.displayName || ''
          },
          reporter: {
            accountId: issue.fields.reporter?.accountId || '',
            displayName: issue.fields.reporter?.displayName || ''
          },
          project: {
            id: issue.fields.project?.id || '',
            key: issue.fields.project?.key || '',
            name: issue.fields.project?.name || '',
            projectTypeKey: issue.fields.project?.projectTypeKey || '',
            projectCategory: {
              id: issue.fields.project?.projectCategory?.id || '',
              description: issue.fields.project?.projectCategory?.description || '',
              name: issue.fields.project?.projectCategory?.name || ''
            }
          },
          description: issue.fields.description?.content[0]?.content[0]?.text || '',
          summary: issue.fields.summary || '',
          priority: {
            id: issue.fields.priority?.id || '',
            name: issue.fields.priority?.name || ''
          },
          status: {
            id: issue.fields.status?.id || '',
            name: issue.fields.status?.name || '',
            description: issue.fields.status?.description || '',
            statusCategory: {
              id: issue.fields.status?.statusCategory?.id || '',
              key: issue.fields.status?.statusCategory?.key || '',
              colorName: issue.fields.status?.statusCategory?.colorName || '',
              name: issue.fields.status?.statusCategory?.name || ''
            }
          },
          creator: {
            accountId: issue.fields.creator?.accountId || '',
            displayName: issue.fields.creator?.displayName || ''
          },
          created: issue.fields.created || '',
          updated: issue.fields.updated || ''
        }
      };
    });

    const totalPages = Math.ceil(parseInt(response.data.total, 10) / parseInt(pageSize, 10));

    if (parseInt(pageNumber, 10) < totalPages) {
      const nextPageResults = await getRDAByPeriod(RDA, startDate, endDate, parseInt(pageSize, 10), parseInt(pageNumber, 10) + 1);
      filteredData.push(...nextPageResults);
    }

    return filteredData;
  } catch (error) {
    console.error("Erro na chamada da API:", error);
    throw error;
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
            dateStarted: data.fields.customfield_10971 ?? '', // Data de Início
            assignee: { // Responsável
              accountId: data.fields.assignee?.accountId ?? '',
              displayName: data.fields.assignee?.displayName ?? ''
            },
            qaAnalyst:{ // QA Analyst
              displayName: data.fields.worklog?.worklogs?.author?.displayName ?? '',
              accountId: data.fields.worklog?.worklogs?.author?.accountId ?? '',
              started: data.fields.worklog?.worklogs?.started ?? '',
              timeSpentSeconds: data.fields.worklog?.worklogs?.timeSpentSeconds ?? ''
            },
            qeReviewer: { // QE Reviewer
              displayName: data.fields.customfield_10908?.displayName ?? '',
              accountId: data.fields.customfield_10908?.accountId ?? ''
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
            description: data.fields.description?.content[0]?.content[0]?.text ?? '',
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
            creator: { // Criador
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
  getAllProjects,
  getProjectKeyByPeriod,
  getProjects,
  getProjectsByPeriod,
  getRDAByPeriod,
  getIssues,
  getIssueByID,
  getUsers
}




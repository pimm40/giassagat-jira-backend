const {
    getUsersFunc,
    getIssueByIDFunc,
    getAllProjectsFunc,
    getProjectKeyByPeriodFunc,
    getProjectsFunc,
    getProjectsByPeriodFunc,
    getRDAByPeriodFunc,
    getIssuesFunc
} = require('../services/jiraService')

async function indexIssueByID(req, res, next) {
    const { idIssue } = req.query
    console.log('req.query', req.query)
    try {
        const result = await getIssueByIDFunc(idIssue)
        return res.json(result); // Retorna a resposta bem-sucedida
    } catch (error) {
        console.error('Erro ao buscar a issue:', error);
        return res.status(500).json({ error: 'Erro ao buscar a issue' }); // Retorna um status 500 com uma mensagem de erro
    }
}
async function indexAllProjects(req, res, next) {
    const { projectKey } = req.query
    console.log('req.query', req.query)
    try {
        const result = await getAllProjectsFunc(projectKey)
        return res.json(result);
    } catch (error) {
        console.error('Erro ao buscar todos os projetos:', error);
        return res.status(500).json({ error: 'Erro ao buscar todos os projetos' }); // Retorna um status 500 com uma mensagem de erro
    }
}
async function indexProjects(req, res, next) {
    const { projectKey, pageSize, pageNumber } = req.query
    console.log('req.query', req.query)
    try {
        const result = await getProjectsFunc(projectKey, pageSize, pageNumber)
        return res.json(result); // Retorna a resposta bem-sucedida
    } catch (error) {
        console.error('Erro ao buscar os projetos recentes:', error);
        return res.status(500).json({ error: 'Erro ao buscar os projetos recentes' }); // Retorna um status 500 com uma mensagem de erro
    }
}
async function indexProjectKeyByPeriod(req, res, next) {
    const { projectKey, startDate, endDate, pageSize, pageNumber } = req.query
    console.log('req.query', req.query)
    try {
        const result = await getProjectKeyByPeriodFunc(projectKey, startDate, endDate, pageSize, pageNumber)
        return res.json(result); // Retorna a resposta bem-sucedida
    } catch (error) {
        console.error('Erro ao buscar os projetos por período:', error);
        return res.status(500).json({ error: 'Erro ao buscar os projetos por período' }); // Retorna um status 500 com uma mensagem de erro
    }
}
async function indexProjectsByPeriod(req, res, next) {
    const { startDate, endDate, pageSize, pageNumber } = req.query
    console.log('req.query', req.query)
    try {
        const result = await getProjectsByPeriodFunc(startDate, endDate, pageSize, pageNumber)
        return res.json(result); // Retorna a resposta bem-sucedida
    } catch (error) {
        console.error('Erro ao buscar os projetos por período:', error);
        return res.status(500).json({ error: 'Erro ao buscar os projetos por período' }); // Retorna um status 500 com uma mensagem de erro
    }
}
async function indexRDAByPeriod(req, res, next) {
    const { RDA, startDate, endDate, pageSize, pageNumber } = req.query
    console.log('req.query', req.query)
    try {
        const result = await getRDAByPeriodFunc(RDA, startDate, endDate, pageSize, pageNumber)
        return res.json(result); // Retorna a resposta bem-sucedida
    } catch (error) {
        console.error('Erro ao buscar os projetos de rda por período:', error);
        return res.status(500).json({ error: 'Erro ao buscar os projetos de rda por período' }); // Retorna um status 500 com uma mensagem de erro
    }
}
async function indexUsersFunc(req, res, next) {
    try {
        const result = await getUsersFunc()
        return res.json(result); // Retorna a resposta bem-sucedida
    } catch (error) {
        console.error('Erro ao buscar os usuários:', error);
        return res.status(500).json({ error: 'Erro ao buscar os usuários' }); // Retorna um status 500 com uma mensagem de erro
    }
}
async function indexIssuesFunc(req, res, next) {
    try {
        const result = await getIssuesFunc()
        return res.json(result); // Retorna a resposta bem-sucedida
    } catch (error) {
        console.error('Erro ao buscar as issues:', error);
        return res.status(500).json({ error: 'Erro ao buscar as issues' }); // Retorna um status 500 com uma mensagem de erro
    }
}

module.exports = {
    indexIssueByID,
    indexAllProjects,
    indexProjectKeyByPeriod,
    indexProjects,
    indexProjectsByPeriod,
    indexRDAByPeriod,
    indexUsersFunc,
    indexIssuesFunc
}

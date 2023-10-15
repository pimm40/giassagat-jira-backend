const {
    getUsersFunc,
    getIssueByIDFunc,
    getProjectsFunc,
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

async function indexRecentProjects(req, res, next) {
    const { projectKey } = req.query
    console.log('req.query', req.query)
    try {
        const result = await getProjectsFunc(projectKey)
        return res.json(result); // Retorna a resposta bem-sucedida
    } catch (error) {
        console.error('Erro ao buscar os projetos recentes:', error);
        return res.status(500).json({ error: 'Erro ao buscar os projetos recentes' }); // Retorna um status 500 com uma mensagem de erro
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
    indexRecentProjects,
    indexUsersFunc,
    indexIssuesFunc
}

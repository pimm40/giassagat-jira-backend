const { getAllProjects, getProjectKeyByPeriod, getProjects, getProjectsByPeriod, getIssues, getIssueByID, getUsers } = require('../../config/api');

const getUsersFunc = async () => {
  try {
    const users = await getUsers();
    return users;
  } catch (error) {
    throw error; // Lança o erro para ser tratado no controlador
  }
}

const getIssueByIDFunc = async (issueKey) => {
  try {
    const issue = await getIssueByID(issueKey);
    return issue;
  } catch (error) {
    throw error; // Lança o erro para ser tratado no controlador
  }
}
const getAllProjectsFunc = async (projectKey) => {
  try {
    const allProjects = await getAllProjects(projectKey);
    return allProjects;
  } catch (error) {
    throw error; // Lança o erro para ser tratado no controlador
  }
}
const getProjectKeyByPeriodFunc = async (projectKey, startDate, endDate, pageSize, pageNumber) => {
  try {
    const data = await getProjectKeyByPeriod(projectKey, startDate, endDate, pageSize, pageNumber);
    return data;
  } catch (error) {
    throw error; // Lança o erro para ser tratado no controlador
  }
}
const getProjectsFunc = async (projectKey, pageSize, pageNumber) => {
  try {
    const recentProjects = await getProjects(projectKey, pageSize, pageNumber);
    return recentProjects;
  } catch (error) {
    throw error; // Lança o erro para ser tratado no controlador
  }
}
const getProjectsByPeriodFunc = async (startDate, endDate, pageSize, pageNumber) => {
  try {
    const data = await getProjectsByPeriod(startDate, endDate, pageSize, pageNumber);
    return data;
  } catch (error) {
    throw error; // Lança o erro para ser tratado no controlador
  }
}
const getIssuesFunc = async () => {
  try {
    const issues = await getIssues();
    return issues;
  } catch (error) {
    throw error; // Lança o erro para ser tratado no controlador
  }
}

module.exports = {
  getUsersFunc,
  getIssueByIDFunc,
  getAllProjectsFunc,
  getProjectKeyByPeriodFunc,
  getProjectsFunc,
  getProjectsByPeriodFunc,
  getIssuesFunc
};

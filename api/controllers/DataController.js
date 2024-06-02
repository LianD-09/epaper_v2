const dataService = require("../services/DataService");

exports.getAllData = async (req, res) => {
  console.log(req.baseUrl, "\n", req.body);
  //filter
  let filters = {};
  if (req.query.groupBy) {
    filters.groupBy = req.query.groupBy;
  }
  if (req.user.userID) {
    filters.userID = req.user.userID;
  }

  try {
    const dataList = await dataService.getAllData(filters);
    res.json({ data: dataList, status: 1 });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
}

exports.createData = async (req, res) => {
  try {
    console.log(req.baseUrl, "\n", req.body);
    const data = await dataService.createData(req.body, req.user.userID);
    res.json({ data: data, status: 1 });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

exports.createDataNoMqtt = async (req, res) => {
  try {
    console.log(req.baseUrl, "\n", req.body);
    const data = await dataService.createDataNoMqtt(req.body, req.user.userID);
    res.json({ data: data, status: 1 });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

exports.getDataById = async (req, res) => {
  try {
    console.log(req.baseUrl, "\n", req.body);
    const data = await dataService.getDataById(req.params.id);
    res.json({ data: data, status: 1 });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
}

exports.updateData = async (req, res) => {
  try {
    console.log(req.baseUrl, "\n", req.body);
    const data = await dataService.updateData(req.params.id, req.body);
    res.json({ data: data, status: 1 });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

exports.updateDataNoMqtt = async (req, res) => {
  try {
    console.log(req.baseUrl, "\n", req.body);
    const data = await dataService.updateDataNoMqtt(req.params.id, req.body);
    res.json({ data: data, status: 1 });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

exports.deleteData = async (req, res) => {
  try {
    console.log(req.baseUrl, "\n", req.body);
    const data = await dataService.deleteData(req.params.id, req.user.userID);
    res.json({ data: data, status: 1 });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};
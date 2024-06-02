const DataModel = require("../models/Data");
const DeviceModel = require("../models/Device");
const mqttClient = require("../mqtt/mqtt");

exports.findDataByEmail = async (email) => {
  email = email.trim().toLowerCase();
  return await DataModel.findOne({ email: `${email}` });
}

exports.getAllData = async (filters = null) => {
  try {
    // Normal filter
    let query = {};
    if (filters) {
      if ("active" in filters) {
        query.active = filters.active;
      }
      if ("userID" in filters) {
        query.createdBy = filters.userID;
      }
    }
    return await DataModel.find(query);
  } catch (error) {
    console.log(error);
  }
};

exports.getDataById = async (id) => {
  return await DataModel.findById(id);
}

exports.createData = async (data, userID = null) => {
  data.createdBy = userID;
  console.log(data);

  if (data.active) {
    const createdData = await DataModel.create(data);
    await mqttClient.writeDevice(createdData);
    return await DataModel.findById(createdData._id);
  } else {
    return await DataModel.create(data);
  }
}

exports.createDataNoMqtt = async (data, userID = null) => {
  data.createdBy = userID;
  console.log(data);

  if (data.active) {
    const createdData = await DataModel.create(data);

    const device = await DeviceModel.findById(data.deviceID);
    const oldDataID = device.dataID;
    const now = Math.floor(new Date().getTime() / 1000);

    if (oldDataID !== "" && oldDataID !== `${data._id}`) {
      const oldData = await DataModel.findById(oldDataID);

      if (oldData) {
        oldData["active"] = false;
        oldData["deviceID"] = "";
        oldData["deviceName"] = "";
        oldData["activeTimestamp"].push(`${oldData["activeStartTime"]}-${now}`)
        oldData["activeStartTime"] = -1;
        await DataModel.findByIdAndUpdate(oldDataID, oldData);
      }
    }
    data["activeStartTime"] = `${now}`;
    await DataModel.findByIdAndUpdate(`${data._id}`, data);

    device["active"] = true;
    device["dataID"] = `${data._id}`;
    device["dataName"] = `${data.name}`;
    await DeviceModel.findByIdAndUpdate(data.deviceID, device);

    return await DataModel.findById(createdData._id);
  } else {
    return await DataModel.create(data);
  }
}

exports.updateData = async (id, data) => {
  const oldData = await DataModel.findById(id);
  if (oldData.active) {
    await mqttClient.updateDevice(oldData.deviceID, {});
    if (!data.active) {
      const now = Math.floor(new Date().getTime() / 1000);
      data.activeStartTime = -1;
      data.deviceID = "";
      data.deviceName = "";
      oldData["activeTimestamp"].push(`${oldData["activeStartTime"]}-${now}`)
      data["activeTimestamp"] = oldData["activeTimestamp"];
      return await DataModel.findByIdAndUpdate(id, data);
    }
  }

  if (data.active) {
    await mqttClient.writeDevice(data);
  }
  return await DataModel.findByIdAndUpdate(id, data);
}

exports.updateDataNoMqtt = async (id, data) => {
  const oldData = await DataModel.findById(id);
  if (oldData.active) {
    const device = await DeviceModel.findById(oldData.deviceID);

    device["dataID"] = "";
    device["dataName"] = "";
    await DeviceModel.findByIdAndUpdate(id, device);

    if (!data.active) {
      const now = Math.floor(new Date().getTime() / 1000);
      data.activeStartTime = -1;
      data.deviceID = "";
      data.deviceName = "";
      oldData["activeTimestamp"].push(`${oldData["activeStartTime"]}-${now}`)
      data["activeTimestamp"] = oldData["activeTimestamp"];
      return await DataModel.findByIdAndUpdate(id, data);
    }
  }

  if (data.active) {
    const device = await DeviceModel.findOne({
      uniqueID: data.uniqueID,
    });
    const oldDataID = device.dataID;
    const now = Math.floor(new Date().getTime() / 1000);

    if (oldDataID !== "" && oldData) {
      oldData["active"] = false;
      oldData["deviceID"] = "";
      oldData["deviceName"] = "";
      oldData["activeTimestamp"].push(`${oldData["activeStartTime"]}-${now}`)
      oldData["activeStartTime"] = -1;
      await DataModel.findByIdAndUpdate(oldDataID, oldData);
    }
    data["activeStartTime"] = `${now}`;
    await DataModel.findByIdAndUpdate(`${data._id}`, data);

    device["active"] = true;
    device["dataID"] = `${data._id}`;
    device["dataName"] = `${data.name}`;
    await DeviceModel.findByIdAndUpdate(data.deviceID, device);
  }
  return await DataModel.findByIdAndUpdate(id, data);
}

exports.deleteData = async (id, userID = null) => {
  let data = await this.getDataById(id, userID);
  if (data === null) {
    return null;
  }
  console.log(data)
  if (data.active) {
    mqttClient.updateDevice(data.deviceID, {});
  }
  return await DataModel.findByIdAndDelete(id);
};
const express = require("express");
const router = express.Router();
const axios = require("axios");

const apiAdapter = (baseURL) => axios.create({ baseURL });

const TASK_SERVICE_URL = "http://localhost:5000";
const api = apiAdapter(TASK_SERVICE_URL);

router.post("/tasks", async (req, res) => {
  try {
    const response = await api.post(req.path, req.body, { headers: req.headers });
    res.send(response.data);
  } catch (e) {
    res.status(502).send(e);
  }
});

router.get("/tasks", async (req, res) => {
  try {
    const response = await api.get(req.path, { headers: req.headers });
    res.send(response.data);
  } catch (e) {
    res.status(502).send(e);
  }
});

router.get("/tasks/:id", async (req, res) => {
  try {
    const response = await api.get(req.path, {
      headers: req.headers,
    });
    res.send(response.data);
  } catch (e) {
    res.status(502).send(e);
  }
});

router.patch("/tasks/:id", async (req, res) => {
  try {
    const response = await api.patch(req.path, req.body, {
    headers: req.headers,
    });
    res.send(response.data);
  } catch (e) {
    res.status(502).send(e);
  }
});

router.delete("/tasks/:id", async (req, res) => {
  try {
    const response = await api.delete(req.path, {
    headers: req.headers,
    });
    res.send(response.data);
  } catch (e) {
    res.status(502).send(e);
  }
});

module.exports = router;

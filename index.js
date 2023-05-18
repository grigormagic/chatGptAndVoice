require("dotenv").config();
const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = process.env.PORT;

app.use(bodyParser.json());
app.use(express.static("chatGpt"));
app.use(cors());

app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "chatGpt", "index.html"));
});

const serverValue = { message: "Hello!!!" };

app.post("/server", async (req, res) => {
  const { Configuration, OpenAIApi } = require("openai");
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const input = req.body.message;
  const openai = new OpenAIApi(configuration);
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: input }],
  });
  serverValue.message = completion.data.choices[0].message.content;
  res.send("POST");
});

app.get("/server", (req, res) => {
  res.json(serverValue);
});

app.listen(PORT, () => {
  console.log(`Server started ${PORT}`);
});

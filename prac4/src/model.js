import axios from "axios";

const model = {
  async get() {
    // const result = await axios.get("/api/keywords");
    // return result;
    // const { data } = await axios.get("http://localhost:8081/api/keywords");
    const { data } = await axios.get("/api/keywords");
    return data;
  },
};

export default model;

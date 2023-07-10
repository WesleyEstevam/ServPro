import axios from 'axios';

const api = axios.create({
  baseURL: 'http://143.198.230.181:8090/api/', //http://10.0.2.2:8090/api/   http://143.198.230.181:8090/api/
  headers: {
    "Content-type": "application/json"
  }
});

export default api;

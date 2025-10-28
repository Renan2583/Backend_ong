import 'dotenv/config';
import app from './app.js';
const PORT = process.env.PORT;
/*
  Inicia as tabelas no MySQL
  import initDb from './config/initdb.js'
*/

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}\nhttp://localhost:${PORT}`);
});

/*
Iniciar tabelas antes de rodar o servidor
  
  async function startServer() {
    await initDb()    
    app.listen(...
  }
  
startServer()
*/
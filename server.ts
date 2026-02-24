import 'dotenv/config'
import app from "./src/app.ts";


const PORTA = process.env.PORTA_URL || 3000;

app.listen(PORTA, () => {
    console.log(`Servidor ouvindo na porta: ${PORTA}`);
});
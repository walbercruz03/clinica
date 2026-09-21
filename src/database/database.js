import * as SQLite from "expo-sqlite"

export async function conectarBD(){
    const db = await SQLite.openDatabaseAsync('./src/database/database.db')

    if (db){
        console.log ("Banco de dados aberto com sucesso!")
        return db
        
    }else{  
        console.log("Erro ao abrir o banco de dados")
        }
}
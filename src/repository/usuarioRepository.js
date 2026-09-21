import { Updates } from "expo/config-plugins"
import { ConectarBD } from "../database/database"

export async function inserirUsuario(nome, email, senha) {
    const db = await ConectarBD()
    try {
        const result = await db.runAsync(
            `INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)`,
            [nome, email, senha]
        )
        if (result.lastInsertRowId) {
            console.log("Usuário foi inserido com sucesso!")
        } else {
            console.log("Usuário não foi inserido!")
        }
    } catch (error) {
        console.log("Erro ao inserir usuário", error)
    }
}


export async function mostrarUsuario() {
    const db = await ConectarBD()
    try{
        const result = await db.getFirstAsync("select * from usuarios where id = ?", id)
        if(result){
            console.log("Usuário encontrado:", result)
        }else{
            console.log("Usuário não encontrado!")
        }
    }catch(error){
        console.log("Erro ao buscar usuário", error)
    }
}

export async function atualizarUsuario(id, nome, email, senha){
    const db = await ConectarBD()
    try{
        const result = await db.runAsync(
            "UPDATE usuarios SET nome = ?, email = ?, senha = ? WHERE id = ?",
            [nome, email, senha, id]
        )
        if(result.changes > 0){
            console.log("Usuário atualizado com sucesso!")
        }else{
            console.log("Usuário não encontrado!")
        }
    }catch(error){
        console.log("Erro ao atualizar usuário", error)
    }
    }
import express, {Request, Response} from 'express'
import { users, products } from './database'
import cors from "cors"
import { TypeUser, ProductsType } from './types'

const app = express();

app.use(express.json());
app.use(cors());

app.listen(3003, () => {
    console.log("Servidor na port 3003");
}).addListener

app.get("/users", (req: Request, res: Response) => {
  try {
    res.status(200).send(users)
  } catch (error:any) {
    console.log(error)
    res.status(400).send("Erro inesperado. ")
  }
})

app.post("/users", (req: Request, res: Response ) => {
    try {
        const id = req.body.id as string
        const name = req.body.name as string
        const email = req.body.email as string

        if(!id || !name || !email ){
            throw new Error ("Todos os campos precisam ser preenchidos.")
        }

        const idUser = users.find((user) => user.id === id)
        const emailUser = users.find((user) => user.email === email)

        if(idUser){
            throw new Error ("Usuário já existe.")
        }

        if(emailUser){
            throw new Error ("Email já existe. Tente outro")
        }

        const newUser: TypeUser = {
            id,
            name,
            email
        }
        users.push(newUser)

        res.status(201).send("Cadastro de usuário realizado com sucesso !")

    } catch (error: any) {
        console.log(error)
        res.status(400).send("Erro inesperado. ")
    }
})

//delete user
app.delete("/users/:id", (req: Request, res: Response) => {
    const idToDelete = req.params.id
    const userIndex = users.findIndex((user) => user.id === idToDelete)

    if(userIndex){
        users.splice(userIndex, 1)
    }
    
    res.status(200).send("Item excluido com sucesso!")

})

app.get("/products/search", (req: Request, res: Response) => {
    try {
        const nameToFind = req.query.name as string;

        if(nameToFind !== undefined){

            if(typeof nameToFind !== 'string'){
                throw new Error("Erro: 'name' tem que ser uma string")
            }

            if(nameToFind.length < 1 ){
                throw new Error("Erro: 'name' tem que ter no minímo um caracter")
            }
        }

        const result : ProductsType[] = products.filter(
            (prod) =>  prod.name.toLowerCase().includes(nameToFind.toLowerCase())
        );

        res.status(200).send(result);
      
    } catch (error: any) {

        console.log(error);
        res.status(400).send(error.message);

    }
})
app.post("/products", (req: Request, res: Response) => {
    try {
        const id = req.body.id as string
        const name = req.body.name as string
        const price = req.body.price as number
        const desc = req.body.desc as string
        const imageUrl = req.body.imageUrl as string

        if(!id || !name || !price || !desc || !imageUrl ){
            throw new Error ("Todos os campos precisam ser preenchidos.")
        }

        const prodcutId = products.find((prod) => prod.id === id)

        if(prodcutId){
            throw new Error ("Produto já existe ou produto com IDs semelhantes.")
        }
        const newProduct: ProductsType = {
            id,
            name,
            price,
            desc,
            imageUrl
        }
        products.push(newProduct)

        res.status(201).send("Cadastro de produto realizado realizado com sucesso !")
    } catch (error:any) {
        console.log(error)
        res.status(400).send(error.message)
    }

})

//put
app.put("/products/:id",  (req: Request, res: Response) => {

    const idToEdit = req.params.id

    const newId = req.body.id as string | undefined
    const newName = req.body.name as string | undefined
    const newPrice = req.body.price as number | undefined
    const newDesc = req.body.desc as string | undefined
    const newImageUrl = req.body.price as string | undefined

    const product = products.find((prod) => prod.id === idToEdit)

    if(product){

        product.id = newId || product.id
        product.name = newName || product.name
        product.desc = newDesc || product.desc
        product.imageUrl = newImageUrl || product.imageUrl
        product.price = isNaN(Number(newPrice)) ? product.price : newPrice as number
    }
    res.status(200).send("Atualização feita com sucesso!")

})

//delete
app.delete("/products/:id", (req: Request, res: Response) => {

    const idToDelete = req.params.id
    const productIndex = products.findIndex((prod) => prod.id === idToDelete)

    if(productIndex){
        products.splice(productIndex, 1)
    }
    
    res.status(200).send("Item excluido com sucesso!")
})

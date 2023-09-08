import fs from 'node:fs/promises'

const databasePath = new URL('../db.json', import.meta.url)

export class Database {
  //# => private attribute
  #database = {} 

  constructor(){
    fs.readFile(databasePath, 'utf8')
      .then(data => {
        this.#database = JSON.parse(data)
      })
      .catch(() =>{
        this.#persist()
      })
  }

  // # => private methods
  #persist(){ 
    fs.writeFile(databasePath, JSON.stringify(this.#database))
  }

  select(table, filter){
    let data = this.#database[table] ?? []

    if (Object.keys(filter).length > 0){
      data = data.filter(row => {
        return Object.entries(filter).some(([key, value])=>{
          return row[key].toLowerCase().includes(value.toLowerCase())
        })
      })
    }

    return data
  }

  insert(table, data){
    if(Array.isArray(this.#database[table])){
      this.#database[table].push(data)
    } else {
      this.#database[table] = [data]
    }
    this.#persist()
    return data
  }
}
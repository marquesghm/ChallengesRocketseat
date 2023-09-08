//Query: localhost:3333/tasks?title=testar&description=usar

export function buildRoutePath(path){
  // () cria um grupo
  //?<NomeDoGrupo>
  // . Quer dizer qualquer caracter. * quer dizer inumeras vezes. 
  // O ? depois dos () torna o grupo opcional.
  // O $ no final faz com que a verificação desse grupo seja no final da url, não pode ter nada depois
  const routeParametersRegex = /:([a-zA-Z]+)/g

  const pathWithParams = path.replace(routeParametersRegex,'(?<$1>[a-z0-9\-_]+)') //?<NomeDoGrupo>

  // O ^ valida que a string "começa com ..." que é diferente de "contém ..."
  // const pathRegex = new RegExp(`^${queryRegex}`) 
  // console.log(Array.from(path.matchAll(queryGroupRegex)))
  const pathRegex = new RegExp(`^${pathWithParams}(?<query>\\?(.*))?`)
  return pathRegex
}
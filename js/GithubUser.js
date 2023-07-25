// Classe responsável por buscar informações de um usuário no GitHub
export class GithubUser {
    static search(username) {
        // Método estático que recebe um 'username' como argumento para buscar o usuário no GitHub.

        const endpoint = `https://api.github.com/users/${username}`
        // Criação da constante 'endpoint', que é uma URL para a API do GitHub, utilizando o 'username' fornecido.

        return fetch(endpoint)
            // Utiliza a função fetch para fazer uma requisição HTTP à API do GitHub.
            .then(data => data.json())
            // O resultado da requisição é convertido para JSON.
            .then(({login, name, public_repos, followers}) => ({
                // Os dados do usuário são extraídos do JSON retornado pela API.
                login,
                name,
                public_repos,
                followers,
            }))
            // Retorna um objeto contendo o login, nome, quantidade de repositórios públicos e seguidores do usuário.
    }
}
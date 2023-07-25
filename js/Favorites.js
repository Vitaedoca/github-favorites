import { GithubUser } from "./GithubUser.js";

// Classe responsável por armazenar e gerenciar os usuários favoritos
export class Favorites {
    constructor(root) {
        // Construtor da classe 'Favorites', recebe um elemento 'root' que representa o elemento HTML raiz da aplicação.
        this.root = document.querySelector(root)
        // Armazena o elemento raiz em uma propriedade 'root'.
        this.load();
        // Carrega os usuários favoritos armazenados no 'localStorage'.
    }

    load() {
        // Método para carregar os usuários favoritos do 'localStorage'.

        this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
        // Obtém os dados armazenados no 'localStorage' com a chave '@github-favorites:', 
        // converte de JSON para um array de objetos. Se não houver dados, inicializa como um array vazio.
    }

    save() {
        // Método para salvar os usuários favoritos no 'localStorage'.

        localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
        // Salva os dados no 'localStorage' com a chave '@github-favorites:', convertendo o array de objetos para JSON.
    }

    async add(username) {
        // Método para adicionar um usuário favorito.

        try {

            const userExists = this.entries.find(entry => entry.login == username)

            if(userExists) {
                throw new Error('Usuário já cadastrado')
            }

            const user = await GithubUser.search(username)
            // Utiliza o método estático 'search' da classe 'GithubUser' para buscar informações do usuário.

            if (user.login == undefined) {
                throw new Error('Usuário não encontrado!')
            
                // Caso o usuário não seja encontrado, lança um erro com a mensagem especificada.
            }

            this.entries = [user, ...this.entries]
            // Adiciona o usuário encontrado na lista de usuários favoritos.

            this.update()
            // Atualiza a visualização dos usuários favoritos.

            this.save()
            // Salva os dados no localStorage
            

            


        } catch (error) {
            alert(error.message);
            // Exibe um alerta com a mensagem de erro caso ocorra algum problema na busca do usuário.
        }

    }

    delete(user) {
        // Método para remover um usuário favorito.

        const filteredEntries = this.entries
        .filter(entry => entry.login !== user.login)
        // Filtra os usuários favoritos, removendo o usuário especificado da lista.

        this.entries = filteredEntries

        this.update();
        // Atualiza a visualização dos usuários favoritos.

        this.save()
        // Salva os usuários favoritos atualizados no 'localStorage'.
    }

}

// Classe responsável por criar a visualização e os eventos no HTML
// Extendendo a classe 'Favorites' para aproveitar suas funcionalidades de armazenamento e gerenciamento de usuários favoritos.
export class FavoritesView extends Favorites {
    constructor(root) {
        super(root)
        // Chama o construtor da classe 'Favorites' para inicializar as funcionalidades de gerenciamento de usuários favoritos.

        this.tbody = this.root.querySelector('table tbody')
        // Armazena a referência ao elemento 'tbody' da tabela onde serão exibidos os usuários favoritos.

        this.update();
        // Atualiza a visualização dos usuários favoritos.

        this.onadd();
        // Configura o evento para adicionar um novo usuário favorito.
    }

    onadd() {
        // Método para configurar o evento de adicionar um novo usuário favorito.

        const addButton = this.root.querySelector('.search button')
        // Obtém a referência ao botão de adicionar usuário.

        addButton.onclick = () => {
            const { value } = this.root.querySelector('.search input')
            // Obtém o valor digitado no campo de busca.

            this.add(value)
            // Chama o método 'add' da classe 'Favorites' para adicionar o usuário com o 'username' digitado.
        }

    }

    update() {
        // Método para atualizar a visualização dos usuários favoritos.

        this.removeAllTr()
        // Remove todos os elementos 'tr' (linhas) existentes no 'tbody'.

        this.entries.forEach(user => {
            // Percorre os usuários favoritos.

            const row = this.createRow()
            // Cria uma nova linha para exibir as informações do usuário.

            row.querySelector('.user img').src = `https://github.com/${user.login}.png`
            // Define a imagem do usuário na célula correspondente.

            row.querySelector('.user img').alt = `Imagem do ${user.name}`
            // Define o atributo 'alt' da imagem com o nome do usuário.

            row.querySelector('.user a').href = `https://github.com/${user.login}`
            // Define o atributo 'alt' da imagem com o nome do usuário.

            row.querySelector('.user p').textContent = user.name;
            // Define o nome do usuário na célula correspondente.

            row.querySelector('.user span').textContent = user.login;
            // Define o login do usuário na célula correspondente.

            row.querySelector('.repositories').textContent = user.public_repos;
            // Define a quantidade de repositórios públicos do usuário na célula correspondente.

            row.querySelector('.follower').textContent = user.followers;
            // Define a quantidade de seguidores do usuário na célula correspondente.

            row.querySelector('.remove').onclick = () => {
                if (confirm("Tem certeza que deseja deletar essa linha? ")) {
                    this.delete(user);
                    // Configura o evento de clique no botão de remoção para remover o usuário favorito.
                }
            }

            this.tbody.append(row);
            // Adiciona a linha criada à tabela.
        })

    }

    createRow() {
        // Método para criar uma nova linha (tr) para exibir as informações do usuário.

        const tr = document.createElement("tr");
        // Cria um novo elemento 'tr' (linha).

        tr.innerHTML = `
            <td class="user">
                <img src="https://github.com/maykbrito.png" alt="Imagem do mayk">
                <a href="https://github.com/maykbrito" target="_blank">
                    <p>vinicius</p>
                    <span>Vitaedoca</span>
                </a>
            </td>
            <td class="repositories">
                76
            </td>
            <td class="follower">
                9589
            </td>
            <td>
                <button class="remove">&times;</button class="remove">
            </td>
        `
        // Define o conteúdo HTML da linha, onde os dados do usuário serão preenchidos posteriormente.

        return tr
        // Retorna a linha criada.
    }

    removeAllTr() {
        // Método para remover todas as linhas (tr) do 'tbody'.

        this.tbody.querySelectorAll('tr')
            // Obtém todas as linhas do 'tbody'.
            .forEach((tr) => {
                tr.remove()
                // Remove cada linha encontrada.
            })
    }
}

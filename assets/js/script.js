let carrinho = JSON.parse(localStorage.getItem("carrinho")) || []

function salvarCarrinho() {

    localStorage.setItem("carrinho", JSON.stringify(carrinho))

}

function adicionarCarrinho(nome, preco, idProduto) {

    let quantidade = parseInt(
        document.getElementById(`quantidade-${idProduto}`).value
    )

    let tamanho = document.getElementById(`tamanho-${idProduto}`).value

    let cor = document.getElementById(`cor-${idProduto}`).value

    let produtoExistente = carrinho.find(item =>
        item.nome === nome &&
        item.tamanho === tamanho &&
        item.cor === cor
    )

    if(produtoExistente){

        produtoExistente.quantidade += quantidade

    } else {

        carrinho.push({
            nome,
            preco,
            quantidade,
            tamanho,
            cor
        })

    }

    salvarCarrinho()

    atualizarCarrinho()
}

function aumentarQuantidade(index){

    carrinho[index].quantidade++

    salvarCarrinho()

    atualizarCarrinho()
}

function diminuirQuantidade(index){

    if(carrinho[index].quantidade > 1){

        carrinho[index].quantidade--

    } else {

        carrinho.splice(index,1)

    }

    salvarCarrinho()

    atualizarCarrinho()
}

function removerProduto(index){

    carrinho.splice(index,1)

    salvarCarrinho()

    atualizarCarrinho()
}

function limparCarrinho(){

    carrinho = []

    salvarCarrinho()

    atualizarCarrinho()
}

function atualizarCarrinho(){

    let area = document.getElementById("carrinho")

    let total = document.getElementById("total")

    let totalCheckout = document.getElementById("totalCheckout")

    let quantidadeCheckout =
    document.getElementById("quantidadeCheckout")

    if(!area) return

    area.innerHTML = ""

    let soma = 0

    let totalItens = 0

    carrinho.forEach((produto,index)=>{

        let subtotal =
        produto.preco * produto.quantidade

        soma += subtotal

        totalItens += produto.quantidade

        area.innerHTML += `

        <div class="item-carrinho">

            <div>

                <h4>${produto.nome}</h4>

                <p>Tamanho: ${produto.tamanho}</p>

                <p>Cor: ${produto.cor}</p>

                <span>
                    R$ ${produto.preco.toFixed(2)}
                </span>

                <div class="controle-quantidade">

                    <button onclick="diminuirQuantidade(${index})">
                        -
                    </button>

                    <span>${produto.quantidade}</span>

                    <button onclick="aumentarQuantidade(${index})">
                        +
                    </button>

                </div>

            </div>

            <button class="btn-remover"
            onclick="removerProduto(${index})">

                Remover

            </button>

        </div>

        `
    })

    total.innerText =
    `Total: R$ ${soma.toFixed(2)}`

    totalCheckout.innerText =
    `R$ ${soma.toFixed(2)}`

    quantidadeCheckout.innerText =
    `${totalItens} itens`
}

atualizarCarrinho()

paypal.Buttons({

    createOrder: function(data, actions){

        let total = carrinho.reduce((acc,item)=>{

            return acc + (item.preco * item.quantidade)

        },0)

        return actions.order.create({

            purchase_units:[{

                amount:{
                    value: total.toFixed(2)
                }

            }]

        })
    },

    onApprove: function(data, actions){

        return actions.order.capture().then(function(){

            alert("Pagamento realizado com sucesso!")

            carrinho = []

            salvarCarrinho()

            atualizarCarrinho()

        })
    },

    onCancel: function(){

        alert("Pagamento cancelado!")

    },

    onError: function(){

        alert("Erro no pagamento!")

    }

}).render('#paypal-button-container')



let campoPesquisa =
document.getElementById("campoPesquisa")

let filtroCategoria =
document.getElementById("filtroCategoria")

function filtrarProdutos(){

    let texto =
    campoPesquisa.value.toLowerCase()

    let categoria =
    filtroCategoria.value

    let produtos =
    document.querySelectorAll(".produto-item")

    produtos.forEach(produto => {

        let nome =
        produto.dataset.nome.toLowerCase()

        let categoriaProduto =
        produto.dataset.categoria

        let nomeMatch =
        nome.includes(texto)

        let categoriaMatch =
        categoria === "todos" ||
        categoriaProduto === categoria

        if(nomeMatch && categoriaMatch){

            produto.style.display = "block"

        } else {

            produto.style.display = "none"

        }

    })
}

campoPesquisa.addEventListener("keyup", filtrarProdutos)

filtroCategoria.addEventListener("change", filtrarProdutos)

function toggleCheckout(){

    let checkout =
    document.querySelector(".checkout-box")

    if(checkout.style.display === "none"){

        checkout.style.display = "block"

    } else {

        checkout.style.display = "none"

    }

}
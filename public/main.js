document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.getElementById('produtosTableBody');
  const form = document.getElementById('produtoForm');

  // Função para carregar os produtos na tabela
  const loadProducts = async () => {
    const response = await fetch('/produtos');
    const data = await response.json();
    const produtos = data.produtos;

    tableBody.innerHTML = '';
    produtos.forEach((produto) => {
      const row = `
        <tr>
          <td>${produto.id}</td>
          <td>${produto.nome}</td>
          <td>${produto.codigo}</td>
          <td>${produto.descricao}</td>
          <td>${produto.preco}</td>
          <td>
            <button onclick="editProduct(${produto.id})">Editar</button>
            <button onclick="deleteProduct(${produto.id})">Excluir</button>
          </td>
        </tr>
      `;
      tableBody.innerHTML += row;
    });
  };

  // Função para adicionar/editar um produto
  const saveProduct = async (event) => {
    event.preventDefault();

    const nome = document.getElementById('nome').value;
    const codigo = document.getElementById('codigo').value;
    const descricao = document.getElementById('descricao').value;
    const preco = document.getElementById('preco').value;

    const id = form.dataset.id;

    let url = '/produtos';
    let method = 'POST';

    if (id) {
      url += `/${id}`;
      method = 'PUT';
    }

    await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nome, codigo, descricao, preco }),
    });

    form.reset();
    form.dataset.id = '';
    loadProducts();
  };

  // Função para editar um produto
  window.editProduct = async (id) => {
    const response = await fetch(`/produtos/${id}`);
    const data = await response.json();
    const produto = data.produtos[0];

    document.getElementById('nome').value = produto.nome;
    document.getElementById('codigo').value = produto.codigo;
    document.getElementById('descricao').value = produto.descricao;
    document.getElementById('preco').value = produto.preco;

    form.dataset.id = id;
  };

  // Função para excluir um produto
  window.deleteProduct = async (id) => {
    const confirmDelete = confirm('Deseja realmente excluir este produto?');

    if (confirmDelete) {
      await fetch(`/produtos/${id}`, {
        method: 'DELETE',
      });
      loadProducts();
    }
  };

  // Carrega os produtos na tabela ao carregar a página
  loadProducts();

  // Adiciona o evento de submit ao formulário
  form.addEventListener('submit', saveProduct);
});

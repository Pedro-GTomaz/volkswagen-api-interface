'use strict';
// A interface é servida pelo próprio ASP.NET. Assim, usa a mesma origem da API.
const API = '/api/carros';
const $ = selector => document.querySelector(selector);
const currency = value => Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
let cars = [];
let editingId = null;
let removingId = null;
let loading = false;

function status(message = '', error = false) {
  $('#status').textContent = message;
  $('#status').classList.toggle('error', error);
}
async function request(path = '', options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);
  try {
    const response = await fetch(API + path, { ...options, signal: controller.signal });
    if (!response.ok) {
      if (response.status === 404) throw new Error('Veículo não encontrado. Atualize a lista e tente novamente.');
      throw new Error(`A API retornou o erro HTTP ${response.status}.`);
    }
    if (response.status === 204) return null;
    return await response.json();
  } catch (error) {
    if (error.name === 'AbortError') throw new Error('A API demorou para responder. Tente novamente.');
    if (error instanceof TypeError) throw new Error('Não foi possível acessar a API. Verifique se o projeto está rodando e abra a interface pelo endereço do servidor.');
    throw error;
  } finally { clearTimeout(timeout); }
}
function node(tag, className, text) {
  const element = document.createElement(tag);
  element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}
function button(text, className, action) {
  const element = node('button', className, text);
  element.type = 'button';
  element.addEventListener('click', action);
  return element;
}
function render() {
  const query = $('#name-search').value.toLocaleLowerCase('pt-BR');
  const list = cars.filter(car => car.nome.toLocaleLowerCase('pt-BR').includes(query));
  const order = $('#sort').value;
  list.sort((a,b) => order === 'name' ? a.nome.localeCompare(b.nome, 'pt-BR') : order === 'low' ? a.preco-b.preco : order === 'high' ? b.preco-a.preco : a.id-b.id);
  $('#count').textContent = `${list.length} ${list.length === 1 ? 'veículo encontrado' : 'veículos encontrados'}`;
  $('#cars').replaceChildren();
  if (!list.length) $('#cars').append(node('div', 'empty', query ? 'Nenhum carro corresponde à sua busca.' : 'Seu estoque está vazio. Cadastre o primeiro veículo.'));
  for (const car of list) {
    const card = node('article', 'card');
    const top = node('div', 'card-top');
    top.append(node('span', 'model-letter', car.nome.slice(0,2).toUpperCase()), node('span', 'code', `ID ${car.id}`));
    const body = node('div', 'card-body');
    body.append(node('h3', '', car.nome), node('div', 'price-caption', 'Preço cadastrado'), node('div', 'price', currency(car.preco)));
    body.append(button('Ver detalhes  →', 'view', () => showDetails(car.id)));
    const actions = node('div', 'card-actions');
    actions.append(button('Editar veículo', '', () => openEditor(car)), button('Excluir', 'delete', () => openRemoval(car)));
    body.append(actions); card.append(top,body); $('#cars').append(card);
  }
}
async function loadCars(message = '') {
  if (loading) return;
  loading = true;
  $('#refresh').disabled = true;
  $('#cars').setAttribute('aria-busy','true');
  status('Carregando veículos…');
  try {
    const result = await request();
    if (!Array.isArray(result) || result.some(car => typeof car.nome !== 'string' || typeof car.id !== 'number' || typeof car.preco !== 'number')) throw new Error('A resposta da API não tem o formato esperado: id, nome e preco.');
    cars = result; render(); status(message);
  } catch (error) { status((message ? message + ' Porém, não foi possível atualizar a lista: ' : '') + error.message, true); $('#count').textContent = 'Lista não atualizada'; }
  finally { loading = false; $('#refresh').disabled = false; $('#cars').setAttribute('aria-busy','false'); }
}
async function showDetails(id) {
  status('Consultando veículo…');
  try {
    const car = await request('/' + encodeURIComponent(id));
    $('#detail-name').textContent = car.nome;
    $('#detail-id').textContent = car.id;
    $('#detail-price').textContent = currency(car.preco);
    $('#details').showModal(); status();
  } catch (error) { status(error.message,true); }
}
function openEditor(car = null) {
  editingId = car ? car.id : null;
  $('#edit-title').textContent = car ? 'Editar veículo' : 'Novo veículo';
  $('#car-name').value = car ? car.nome : '';
  $('#car-price').value = car ? car.preco : '';
  $('#edit-error').textContent = '';
  $('#editor').showModal(); $('#car-name').focus();
}
function openRemoval(car) {
  removingId = car.id;
  $('#remove-name').textContent = `${car.nome} · ID ${car.id}`;
  $('#remove-error').textContent = '';
  $('#removal').showModal();
}
function lockDialog(dialog, locked) {
  dialog.dataset.busy = String(locked);
  dialog.querySelectorAll('button,input').forEach(element => element.disabled = locked);
}
$('#edit-form').addEventListener('submit', async event => {
  event.preventDefault();
  const nome = $('#car-name').value.trim();
  const preco = Number($('#car-price').value);
  if (!Number.isFinite(preco) || preco <= 0) {
  $('#edit-error').textContent = 'Informe um preço válido.';
  return;
}
  if (!nome) { $('#edit-error').textContent = 'Informe o nome do veículo.'; return; }
  const dialog = $('#editor'); lockDialog(dialog,true);
  $('#edit-error').textContent = '';
  try {
    const editing = editingId !== null;
    await request(editing ? '/' + editingId : '', {
      method: editing ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, preco })
    });
    dialog.close();
    await loadCars(editing ? 'Veículo atualizado.' : 'Veículo cadastrado.');
  } catch (error) { $('#edit-error').textContent = error.message; }
  finally { lockDialog(dialog,false); }
});
$('#confirm-remove').addEventListener('click', async () => {
  const dialog = $('#removal'); lockDialog(dialog,true);
  $('#remove-error').textContent = '';
  try {
    await request('/' + removingId, { method:'DELETE' });
    dialog.close(); await loadCars('Veículo excluído.');
  } catch (error) { $('#remove-error').textContent = error.message; }
  finally { lockDialog(dialog,false); }
});
$('#id-form').addEventListener('submit', event => {
  event.preventDefault(); const id = Number($('#id-search').value);
  if (Number.isInteger(id) && id > 0 && id <= 2147483647) showDetails(id);
  else status('Informe um ID inteiro positivo válido.', true);
});
$('#name-search').addEventListener('input',render);
$('#sort').addEventListener('change',render);
$('#refresh').addEventListener('click',() => loadCars());
$('#add').addEventListener('click',() => openEditor());
$('#hero-add').addEventListener('click',() => openEditor());
document.querySelectorAll('dialog .close').forEach(element => element.addEventListener('click',() => element.closest('dialog').close()));
document.querySelectorAll('dialog').forEach(dialog => dialog.addEventListener('cancel',event => { if(dialog.dataset.busy === 'true') event.preventDefault(); }));
loadCars();

//Array parar guardar los objetos (productos y servicios) almacenados en el localstorage, si no, usa un array vacío
let items = JSON.parse(localStorage.getItem('arrayItems')) || [];
const modalItems = document.getElementById('modal-items');
const formNewItem = document.getElementById('form-newitem');
const txtName = document.getElementById('name');
const btnNewRegister = document.getElementById('btn-newregister');
const btnCancel = document.getElementById('btn-cancel');
const btnNewItem = document.getElementById('btn-newitem');
const btnEditItem = document.getElementById('btn-edititem');
const table = document.getElementById('tbl-content');
const indicatorServices = document.getElementById('card-services');
const indicatorProducts = document.getElementById('card-products');
const indicatorAll = document.getElementById('card-total');

//Retorna verdadero si ya se encuentra un item registrado con el mismo nombre
const findItem = (name) => {
    let find = false;
    items.find((element) => {
        if(element.name.toLowerCase() == name.toLowerCase()){
            find = true;
        }
    });
    return find;
}
//Crea un objeto item y lo inserta en el array, luego se pasa al localstorage
const newItem = (name, type, price) => {
    const item = {
        name: name,
        type: type,
        price: price
    }
    items.push(item);
    setLocalStorage(items);
}

//Retorna un objeto según su nombre
const getItem = (name) => {
    const item = items.find(element => element.name === name);
    return item;
}

//Elimina el objeto del array según su nombre
const deleteItem = (name) => {
    let index = null;
    index = items.findIndex((element) => element.name === name);
    console.log(index);
    items.splice(index, 1);
    setLocalStorage(items);
}

//Edita los valores: tipo y precio de un objeto
const editItem = (name, type, price) => {
    let index;
    index = items.findIndex((element) => element.name === name);
    items[index].type = type;
    items[index].price = price;
    setLocalStorage(items);
}

//El array se transforma en un string para ser guardado en el localstorage
const setLocalStorage = (array) => {
    localStorage.setItem('arrayItems', JSON.stringify(array));
}

//Inserta diferentes elementos en el DOM
const elementsTemplate = () => {
    tableTemplate();
    indicatorTemplate();
}

//Diseño y elementos de la tabla
const tableTemplate = () => {
    items = JSON.parse(localStorage.getItem('arrayItems'));
    table.innerHTML = '';
    items.forEach(element => {
        table.innerHTML += `
            <tr>
                <td>${element.name}</td>
                <td>${element.type}</td>
                <td>${element.price}</td>
                <td><button class="btn-small red" value="${element.name}">Eliminar</button></td>
                <td><button class="btn-small" value="${element.name}">Editar</button></td>
            </tr>
        `;
    });
}

//Diseño y elementos de indicadores
const indicatorTemplate = () => {
    indicatorServices.innerHTML = '';
    indicatorProducts.innerHTML = '';
    indicatorAll.innerHTML = '';

    let countServices = 0;
    let countProducts = 0;
    let countAll = 0;

    countServices = items.filter(element => element.type === 'Servicio').length;
    countProducts = items.filter(element => element.type === 'Producto').length;
    countAll = items.length;

    indicatorServices.innerHTML = `
        <img src="img/servicios.png" class="icon-card"><p>Servicios registrados: ${countServices}</p>
    `;
    indicatorProducts.innerHTML = `
        <img src="img/productos.png" class="icon-card"><p>Productos registrados: ${countProducts}</p>
    `;
    indicatorAll.innerHTML = `
        <img src="img/total.png" class="icon-card"><p>Total de registros: ${countAll}<p>
    `;
}

const formValidator = () => {
    const name = document.getElementById('name').value;
    const type = document.getElementById('slc-type').value;
    const price = document.getElementById('price').value;
    const find = findItem(name);

    if(name == '' || name.length == 0){
        M.toast({html: `Debe ingresar un nombre`});
        document.getElementById('name').focus();
        return false;
    }else if(find){
        M.toast({html: `Ya existe un producto/servicio registrado con el nombre: ${name}`});
        document.getElementById('name').focus();
        return false;
    }else if(type == 0){
        M.toast({html: `Debe seleccionar un tipo`});
        document.getElementById('slc-type').focus();
        return false;
    }else if(price == 0 || price == null){
        M.toast({html: `Debe ingresar un valor mayor a 0`});
        document.getElementById('price').focus();
        return false;
    }else{
        return true;
    }
}

//Inicia los componentes de materialize
document.addEventListener('DOMContentLoaded', function() {
    const elemsNav = document.querySelectorAll('.sidenav');
    const instancesNav = M.Sidenav.init(elemsNav);
    const elemsMdl = document.querySelectorAll('.modal');
    const instancesMdl = M.Modal.init(elemsMdl);
    const elemsSlc = document.querySelectorAll('select');
    const instancesSlc = M.FormSelect.init(elemsSlc);
    
});

//Carga de contenido DOM, funciones
window.onload = () => {
    elementsTemplate();
    const instanceModal = M.Modal.getInstance(modalItems);

    btnNewRegister.addEventListener('click', (e) => {
        formNewItem.reset();
        document.getElementById('title-mdl').innerHTML = 'Nuevo registro';
        instanceModal.open();
        txtName.disabled = false;
        btnNewItem.disabled = false;
        btnNewItem.style.display = "";
        btnEditItem.disabled = true;
        btnEditItem.style.display = 'none';
        e.preventDefault();
    });

    btnCancel.addEventListener('click', (e) => {
        e.preventDefault();
        instanceModal.close();
        formNewItem.reset();
    });

    btnNewItem.addEventListener('click', (e) => {
        //e.preventDefault previene que la página se refresque
        e.preventDefault();
        const name = document.getElementById('name').value;
        const type = document.getElementById('slc-type').value;
        const price = document.getElementById('price').value;
        const validator = formValidator();

        if(validator){
            newItem(name.trim(),type,price);
            M.toast({html: `El ${type} con nombre: ${name} fue registrado correctamente`});
            elementsTemplate();
            formNewItem.reset();
        }
    });

    btnEditItem.addEventListener('click', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const type = document.getElementById('slc-type').value;
        const price = document.getElementById('price').value;
        if(type == 0){
            alert('Debe seleccionar un tipo');
            document.getElementById('slc-type').focus();
        }else if(price == 0 || price == null){
            alert('Debe ingresar un valor mayor a 0');
            document.getElementById('price').focus();
        }else{
            editItem(name, type, price);
            M.toast({html: `El ${type} con nombre: ${name} fue modificado correctamente`});
            elementsTemplate();
            formNewItem.reset();
            instanceModal.close();
        }
    });

    table.addEventListener('click', (e) =>{
        
        e.preventDefault();
        if(e.target.innerHTML === 'Eliminar' || e.target.innerHTML === 'Editar'){
            if(e.target.innerHTML === 'Eliminar'){
                deleteItem(e.target.value);
                M.toast({html: `El item: ${e.target.value} fue eliminado`, classes:'black'});
                elementsTemplate();            
            }
            if(e.target.innerHTML === 'Editar'){
                document.getElementById('title-mdl').innerHTML = 'Modificar registro';
                instanceModal.open();
                const item = getItem(e.target.value);
                txtName.disabled = true;
                document.getElementById('name').value = item.name;
                document.getElementById('slc-type').value = item.type;
                document.getElementById('price').value = item.price;
                btnNewItem.disabled = true;
                btnNewItem.style.display = 'none';
                btnEditItem.disabled = false;
                btnEditItem.style.display = "";
            }
        }
    });
}





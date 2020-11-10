//Array parar guardar los objetos (productos y servicios) almacenados en el localstorage, si no, usa un array vacío
let items = JSON.parse(localStorage.getItem('arrayItems')) || [];
const formNewItem = document.getElementById('form-newitem');
const table = document.getElementById('tbl-content');
const indicator = document.getElementById('indicator-content');

//Retorna verdadero si ya se encuentra un item registrado con el mismo nombre
const findItem = (name) => {
    let find = false;
    items.find((element) => {
        if(element.name === name){
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
 
//Elimina el objeto del array a través de su nombre
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
    table.innerHTML = '';
    items.forEach(element => {
        table.innerHTML += `
            <tr>
                <td>${element.name}</td>
                <td>${element.type}</td>
                <td>${element.price}</td>
                <td><button value="${element.name}">Eliminar</button></td>
                <td><button value="${element.name}">Editar</button></td>
            </tr>
        `;
    });
}

//Diseño y elementos de indicadores
const indicatorTemplate = () => {
    indicator.innerHTML = '';
    let countProducts = 0;
    let countServices = 0;
    let countAll = 0;

    countProducts = items.filter(element => element.type === 'producto').length;
    countServices = items.filter(element => element.type === 'servicio').length;
    countAll = items.length;
    return indicator.innerHTML = `
        <span>Productos registrados: ${countProducts}</span>
        <span>Servicios registrados: ${countServices}</span>
        <span>Total items registrados: ${countAll}</span>
        `;
}

//Carga de contenido DOM, funciones
window.onload = () => {
    elementsTemplate();

    formNewItem.addEventListener('submit', (e) => {
        //e.preventDefault previene que la página se refresque
        e.preventDefault();
        const name = document.getElementById('name').value;
        const type = document.getElementById('slc-type').value;
        const price = document.getElementById('price').value;
        const find = findItem(name);
        
        console.log(name);
        console.log(type);
        console.log(price);
        if(name == '' || name.length == 0){
            alert('Debe ingresar un nombre');
            document.getElementById('name').focus();
        }else if(find){
            alert('Ya existe un producto/servicio registrado con el nombre: '+name);
            document.getElementById('name').focus();
        }else if(type == 0){
            alert('Debe seleccionar un tipo');
            document.getElementById('slc-type').focus();
        }else if(price == 0 || price == null){
            alert('Debe ingresar un valor mayor a 0');
            document.getElementById('price').focus();
        }else{
            console.log(price);
            newItem(name,type,price);
            alert(`El ${type} con nombre: ${name} fue registrado correctamente`);
            elementsTemplate();
            formNewItem.reset();
        }
    
    });

    table.addEventListener('click', (e) =>{
        e.preventDefault();
        if(e.target.innerHTML === 'Eliminar' || e.target.innerHTML === 'Editar'){
            if(e.target.innerHTML === 'Eliminar'){
                console.log(e.target.value);
                deleteItem(e.target.value);
                alert('El item: '+e.target.value+' fue eliminado');
                elementsTemplate();
            }
            if(e.target.innerHTML === 'Editar'){

            }
        }
    
    })



}





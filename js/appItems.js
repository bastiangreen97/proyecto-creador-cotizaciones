//Array parar guardar los objetos (productos y servicios) almacenados en el localstorage, si no, usa un array vacío
let arrayItems = JSON.parse(localStorage.getItem('items')) || [];

const formNewItem = document.getElementById('form-newitem');

//Crea un objeto item y lo inserta en el array, luego se pasa al localstorage
const newItem = (name, type, price) => {
    const item = {
        name: name,
        type: type,
        price: price
    }
    arrayItems.push(item);
    setLocalStorage(arrayItems);
}

//El array se transforma en tipo string para ser guardado en el localstorage
const setLocalStorage = (array) => {
    localStorage.setItem('items', JSON.stringify(array));
}

formNewItem.addEventListener('submit', (e) => {
    //e.preventDefault previene que la página se refresque
    e.preventDefault();
    let name = document.getElementById('name').value;
    let type = document.getElementById('slc-type');
    let price = document.getElementById('price').value;
    
    if(name == '' || name.length == 0){
        alert('Debe ingresar un nombre');
    }else if(type.selectedIndex == 0){
        alert('Debe seleccionar un tipo');
    }else if(price == 0 || price == null){
        alert('Debe ingresar un valor mayor a 0');
    }else{
        console.log(price);
        newItem(name,type,price);
        alert(`El ${type.value} con nombre: ${name} fue registrado correctamente`);
        formNewItem.reset();
    }

})



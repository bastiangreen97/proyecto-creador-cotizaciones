//Llama y guarda el array junto a sus objetos almacenados desde el localstorage
let items2 = JSON.parse(localStorage.getItem('arrayItems')) || [];
const autor = localStorage.getItem('infoAutor') || [];
const tab = document.getElementById('tabs-quotation');
const quotationItems = [];
//Obtiene el elemento autocomplete
const autoCompleteInput = document.getElementById('autocomplete-input');

//Retorna un objeto con los nombres de productos/servicios como atributos, y valores null (Null porque materialize en este valor permite agregar iconos);
const itemNames = () => {
    let dataNames = new Object();
    items2.forEach(element => { 
        dataNames[element.name] = null;
    });
    return dataNames;
}

const showItem = (name) => {
    let auxItem = getItem(name);
    if(auxItem == undefined){
        document.getElementById('result-name').value = '';
        document.getElementById('result-type').value = '';
        document.getElementById('result-price').value = null;
    }else{
        document.getElementById('result-name').value = auxItem.name;
        document.getElementById('result-type').value = auxItem.type;
        document.getElementById('result-price').value = auxItem.price;
    }
}

//Inicia los componentes de materialize
document.addEventListener('DOMContentLoaded', function() {
    const elemsAuto = document.querySelectorAll('.autocomplete');
    const instancesAuto = M.Autocomplete.init(elemsAuto);
    const elemsSlc = document.querySelectorAll('select');
    const instancesSlc = M.FormSelect.init(elemsSlc);
    const instance = M.Tabs.init(tab);
    });

//Crea un objeto para almacenar todos los datos de la cotización
const newQuotation = (autor, name, ) => {

}

//Validar que todos los campos se encuentren con datos
const formValidator = () =>{
    const name = document.getElementById('result-name').value;
    const type = document.getElementById('result-type').value;
    const price = document.getElementById('result-price').value;
    const discount = document.getElementById('slc-discount').value;
    const percent = document.getElementById('percent').value;
    const quantity = document.getElementById('quantity').value;

    if(name,type, price == '' || name.length, type.length, price.length < 0){
        M.toast({html: `No ha seleccionado un producto o servicio`});
        document.getElementById('autocomplete-input').focus();
        return false;
    }else if((discount == '1' && percent == null) || (discount == '1' && percent == 0)){
        M.toast({html: `Ha seleccionado aplicar descuento, debe ingresar el número de % o seleccionar no aplicar descuento`});
        document.getElementById('percent').focus();
        return false;
    }else if(quantity == 0){
        M.toast({html: `Debe ingresar la cantidad del producto o servicio`});
        document.getElementById('quantity').focus();
        return false;
    }
    else{
        return true;
    }
}

//Obtiene un item según su nombre
const getItem = (name) => {
    const item = items2.find(element => element.name === name);
    return item;
}

//Inserta un item a la cotización
const addItemQuotation = (auxItem, discount, percent, quantity) =>{
    let subTotal = 0;

    if(discount){
        subTotal = (auxItem.price * quantity) - (price * quantity) * percent;
    }
    else{
        subTotal = auxItem.price * quantity;
    }

    const item = {
        name: auxItem.name,
        type: auxItem.type,
        price: auxItem.price,
        discount: discount,
        percent: percent,
        quantity: quantity,
        subTotal: subTotal
    }
    quotationItems.push(item);
}

window.onload = () =>{
    const instanceAuto = M.Autocomplete.getInstance(autoCompleteInput);
    instanceAuto.updateData(itemNames());
}
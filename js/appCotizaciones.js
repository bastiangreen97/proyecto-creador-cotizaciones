//Llama y guarda el array junto a sus objetos almacenados desde el localstorage
let items2 = JSON.parse(localStorage.getItem('arrayItems')) || [];
const autor = JSON.parse(localStorage.getItem('infoAutor')) || [];
const client = JSON.parse(localStorage.getItem('infoClient')) || [];
const tab = document.getElementById('tabs-quotation');
const tab1 = document.getElementById('tab-1');
const tab2 = document.getElementById('tab-2');
const tab3 = document.getElementById('tab-3');
const formAutorClient = document.getElementById('form-autor-client');
const btnContinueTab1 = document.getElementById('btn-tab-1');
const btnAddItem = document.getElementById('btn-additem');
const modalQuotation = document.getElementById('modal-items-quotation');
const formQuotation = document.getElementById('form-items-quotation');
const btnInsertItem = document.getElementById('btn-insertitem');
const btnCancelItem = document.getElementById('btn-cancelitem');
const quotationTable = document.getElementById('quotation-table')
const btnContinueTab2 = document.getElementById('btn-tab-2');
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
    const elemsMdl = document.querySelectorAll('.modal');
    const instancesMdl = M.Modal.init(elemsMdl);
    });

//Crea un objeto para almacenar todos los datos de la cotización
const newQuotation = (autor, client, ) => {

}

const newPerson = (name, cel, email, address) => {
    const person = {
        name: name,
        cel: cel,
        email: email,
        address: address
    }
    return person;
}

//Obtiene un item según su nombre
const getItem = (name) => {
    const item = items2.find(element => element.name === name);
    return item;
}

//Inserta un item a la cotización
const addItemQuotation = (name, type, price, discount, percent, quantity) =>{
    let priceWithDiscount = 0;
    let subTotal = 0;

    if(discount == 1){
        priceWithDiscount = Math.round(price - (percent/100) * price)
        subTotal = priceWithDiscount * quantity;
    }
    else{
        subTotal = price * quantity;
    }

    const item = {
        name: name,
        type: type,
        price: price,
        discount: discount,
        percent: percent,
        quantity: quantity,
        subTotal: subTotal
    }
    quotationItems.push(item);
}

const tableTemplate = () => {
    quotationTable.innerHTML = '';
    //TODO: Aplicar correción a los botones
    quotationItems.forEach(element => {
        quotationTable.innerHTML += `
            <tr>
                <td>${element.name}</td>
                <td>${element.type}</td>
                <td>${element.price}</td>
                <td>${element.discount}</td>
                <td>${element.percent}</td>
                <td>${element.quantity}</td>
                <td>${element.subTotal}</td>
            </tr>
        `;
    });
}

//Validar que todos los campos de autor y cliente se encuentren con datos
const formAutorClientValidator = () =>{
    const autorName = document.getElementById('autor-name').value;
    const autorCel = document.getElementById('autor-cel').value;
    const autorEmail = document.getElementById('autor-email').value;
    const autorAddress = document.getElementById('autor-address').value;
    const clientName = document.getElementById('client-name').value;
    const clientCel = document.getElementById('client-cel').value;
    const clientAddress = document.getElementById('client-address').value;
    const clientEmail = document.getElementById('client-email').value;

    const expRegCel = /^(\+?56)?(\s?)(0?9)(\s?)[9876543]\d{7}$/;

    if(autorName == '' || autorName.length == 0){
        M.toast({html: `Debe ingresar su nombre o el de su pyme`});
        document.getElementById('autor-name').focus();
        return false;
    }else if(autorCel == 0 || autorCel.length == 0){
        M.toast({html: `Debe ingresar un número de celular`});
        document.getElementById('autor-cel').focus();
        return false;
    }else if(expRegCel.test(autorCel) != true){
        M.toast({html: `Debe ingresar un número de celular válido`});
        document.getElementById('autor-cel').focus();
        return false;
    }else if(autorEmail == '' || autorEmail.length == 0){
        M.toast({html: `Debe ingresar su email`});
        document.getElementById('autor-email').focus();
        return false;
    }else if(clientName == '' || clientName.length == 0){
        M.toast({html: `Debe ingresar el nombre del cliente`});
        document.getElementById('client-name').focus();
        return false;
    }else if(clientCel == 0 || clientCel.length == 0){
        M.toast({html: `Debe ingresar el número de celular del cliente`});
        document.getElementById('client-cel').focus();
        return false;
    }else if(expRegCel.test(clientCel) != true){
        M.toast({html: `Debe ingresar un número de celular válido`});
        document.getElementById('client-cel').focus();
        return false;
    }else if(clientEmail == '' || clientEmail.length == 0){
        M.toast({html: `Debe ingresar el email del cliente`});
        document.getElementById('client-name').focus();
        return false;
    }else{
        return true;
    }
}

//Validar que todos los campos del form quotation se encuentren con datos
const formItemValidator = () =>{
    const name = document.getElementById('result-name').value;
    const discount = document.getElementById('slc-discount').value;
    const percent = document.getElementById('percent').value;
    const quantity = document.getElementById('quantity').value;
    const find = getItem(name);

    if(name == '' || name.length < 0){
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


window.onload = () =>{
    const instanceAuto = M.Autocomplete.getInstance(autoCompleteInput);
    const instanceTab2 = M.Tabs.getInstance(tab);
    const instanceModal = M.Modal.getInstance(modalQuotation);
    instanceAuto.updateData(itemNames());

    btnContinueTab1.addEventListener('click', (e) => {
        e.preventDefault;
        if(formAutorClientValidator()){
            const autorName = document.getElementById('autor-name').value;
            const autorCel = document.getElementById('autor-cel').value;
            const autorEmail = document.getElementById('autor-email').value;
            const autorAddress = document.getElementById('autor-address').value;
            const clientName = document.getElementById('client-name').value;
            const clientCel = document.getElementById('client-cel').value;
            const clientAddress = document.getElementById('client-address').value;
            const clientEmail = document.getElementById('client-email').value;

            const auxAutor = newPerson(autorName, autorCel, autorEmail, autorAddress);
            localStorage.setItem('infoAutor', JSON.stringify(auxAutor));
            const auxClient = newPerson(clientName, clientCel, clientEmail, clientAddress);
            localStorage.setItem('infoClient', JSON.stringify(auxClient));
            tab.children[1].classList.remove('disabled');
            instanceTab2.select('tab-2');
            M.toast({html: `Se han guardado tus datos y los del cliente`});
        }
    });

    btnAddItem.addEventListener('click', (e) => {
        e.preventDefault;
        formQuotation.reset();
        instanceModal.open();
    });

    btnInsertItem.addEventListener('click', (e) => {
        e.preventDefault;
        if(formItemValidator()){
            const name = document.getElementById('result-name').value;
            const type = document.getElementById('result-type').value;
            const price = document.getElementById('result-price').value;
            const discount = document.getElementById('slc-discount').value;
            const percent = document.getElementById('percent').value;
            const quantity = document.getElementById('quantity').value;
            addItemQuotation(name, type, price, discount, percent, quantity);
            M.toast({html: `Se ha insertado correctamente el ${type} ${name} en la cotización`}); 
        }
    });

    btnCancelItem.addEventListener('click', (e) => {
        e.preventDefault;
        formQuotation.reset();
        instanceModal.close();
    })

    btnContinueTab2.addEventListener('click', (e) => {
        e.preventDefault;

    });


}

window.jsPDF = window.jspdf.jsPDF;
//Llama y guarda el array junto a sus objetos almacenados desde el localstorage
let items2 = JSON.parse(localStorage.getItem('arrayItems')) || [];
let autor = {};
let client = {};
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
const totalQuotation = document.getElementById('card-total');
const btnContinueTab2 = document.getElementById('btn-tab-2');
const btnPdf = document.getElementById('btn-pdf');
const quotationItems = [];
let quotation = {};
let auxTotal = 0;
//Obtiene el elemento autocomplete
const autoCompleteInput = document.getElementById('autocomplete-input');

const formPdf = document.getElementById('form-generatepdf');
const logotypeFile = document.getElementById('logotype');
const btnDeleteLogo = document.getElementById('btn-deletelogotype');

//Retorna verdadero si ya se encuentra un item registrado con el mismo nombre
const findItemQuotation = (name) => {
    let find = false;
    quotationItems.find((element) => {
        if(element.name.toLowerCase() == name.toLowerCase()){
            find = true;
        }
    });
    return find;
}
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
    const elemsNav = document.querySelectorAll('.sidenav');
    const instancesNav = M.Sidenav.init(elemsNav);
    const elemsAuto = document.querySelectorAll('.autocomplete');
    const instancesAuto = M.Autocomplete.init(elemsAuto);
    const elemsSlc = document.querySelectorAll('select');
    const instancesSlc = M.FormSelect.init(elemsSlc);
    const instance = M.Tabs.init(tab);
    const elemsMdl = document.querySelectorAll('.modal');
    const instancesMdl = M.Modal.init(elemsMdl);
    });

//Crea un objeto para almacenar todos los datos de la cotización
const newQuotation = (date, autor, client, listItems, note, total) => {
    const quotation = {
        date: date,
        autor: autor,
        client: client,
        listItems: listItems,
        note: note,
        total: total
    }
    return quotation;
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

const deleteItemQuotation = (name) => {
    let index = null;
    index = quotationItems.findIndex((element) => element.name === name);
    quotationItems.splice(index, 1);
}

//Inserta un item a la cotización
const addItemQuotation = (name, type, price, discount, percent, quantity) =>{
    let priceWithDiscount = 0;
    let subTotal = 0;

    if(discount == '1'){
        priceWithDiscount = Math.round(price - (percent/100) * price);
        subTotal = priceWithDiscount * quantity;
    }
    else{
        percent = 0;
        priceWithDiscount = price;
        subTotal = price * quantity;
    }

    const item = {
        name: name,
        type: type,
        price: price,
        percent: percent,
        priceDiscount: priceWithDiscount,
        quantity: quantity,
        subTotal: subTotal
    }
    quotationItems.push(item);
}

const elementsTemplate = () => {
    tableTemplate();
    totalTemplate();
}

const tableTemplate = () => {
    quotationTable.innerHTML = '';
    quotationItems.forEach(element => {
        quotationTable.innerHTML += `
            <tr>
                <td>${element.name}</td>
                <td>${element.type}</td>
                <td>$${element.price}</td>
                <td>${element.percent}%</td>
                <td>$${element.priceDiscount}</td>
                <td>${element.quantity}</td>
                <td>$${element.subTotal}</td>
                <td><button class="btn-small red" value="${element.name}">Quitar</button></td>
            </tr>
        `;
    });
}

const totalTemplate = () => {
    totalQuotation.innerHTML = '';
    let total = 0;
    auxTotal = 0;
    quotationItems.forEach(element => {
        total = element.subTotal + total;
    });
    auxTotal = total;
    return totalQuotation.innerHTML = `
        <p>Total: $${total}</p>
    `;
}

//Validar que los campos de autor y cliente se encuentren con datos
const formAutorClientValidator = () =>{
    const autorName = document.getElementById('autor-name').value;
    const autorCel = document.getElementById('autor-cel').value;
    const autorEmail = document.getElementById('autor-email').value;
    const clientName = document.getElementById('client-name').value;

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
    const find = findItemQuotation(name);

    if(name == '' || name.length < 0){
        M.toast({html: `No ha seleccionado un producto o servicio`});
        document.getElementById('autocomplete-input').focus();
        return false;
    }else if(find){
        M.toast({html: `El producto o servicio con nombre: ${name} ya se encuentra agregado a la cotización`});
        document.getElementById('autocomplete-input').focus();
        return false;
    }else if((discount == '1' && percent == null) || (discount == '1' && percent == 0)){
        M.toast({html: `Ha seleccionado aplicar descuento, debe ingresar el número de % o seleccionar no aplicar descuento`});
        document.getElementById('percent').focus();
        return false;
    }else if(quantity == 0){
        M.toast({html: `Debe ingresar una cantidad`});
        document.getElementById('quantity').focus();
        return false;
    }
    else{
        return true;
    }
}

const createPDF = () => {
    let docName = ''
    let clientName = quotation.client.name;
    let date = '';
    date = quotation.date.getDate().toString() + '-' + quotation.date.getMonth().toString() + '-' + quotation.date.getFullYear().toString();
    docName = clientName + ' ' + date;
    let valuesBody = quotationItems.map((element) => Object.values(element));
    let doc = new jsPDF();
    doc.setFont('Lato-Regular', 'normal');
    doc.setFont('PTSansNarrow-Regular', 'normal');

    let imgData = localStorage.getItem("logotype");
    let extensionImg = localStorage.getItem("extension");
    if(imgData === null || imgData === "0"){
        /*const auxImg = new Image();
        auxImg.src = 'img/sinlogo.png';
        imgData = auxImg;
        console.log(imgData); */
        const imgBase64 = "data:image/png;base64,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";
        imgData = imgBase64;
        extensionImg = 'PNG';
    }

    console.log(imgData);

    doc.addImage(imgData, extensionImg, 15, 10, 25, 25);
    doc.setFont('PTSansNarrow-Regular', 'normal');
    doc.text(50, 15, `${quotation.autor.name}`);
    doc.setFontSize(12);
    doc.text(50, 20, `${quotation.autor.cel}`);
    doc.setFontSize(12);
    doc.text(50, 25, `${quotation.autor.email}`);
    doc.setFontSize(12);
    doc.text(50, 30, `${quotation.autor.address}`);

    doc.setDrawColor(212, 231, 236);
    doc.setLineWidth(15); 
    doc.line(0, 50, 560, 50);
    doc.autoTable({
        theme: 'plain',
        startY: 45,
        bodyStyles: {textColor: [255,255,255], halign: 'center', fontSize: 20},
        body: [['C O T I Z A C I O N']]
    });

    doc.setDrawColor(212, 200, 190);
    doc.setLineWidth(8); 
    doc.line(140, 35, 560, 35);
    doc.text(160, 38, `Fecha: ${date}`);

    doc.autoTable({
        theme: 'plain',
        bodyStyles: { font: 'Lato-Regular', fontStyle: 'normal', fontSize: 12, cellPadding: Padding = 1 },
        head: [['Datos cliente',' ']],
        body: [[`Nombre: ${quotation.client.name}`,`Email: ${quotation.client.email}`],
               [`Celular/telefono: ${quotation.client.cel}`,`Dirección: ${quotation.client.address}`]]
    });
    doc.autoTable({
        theme: 'plain',
        bodyStyles: { font: 'Lato-Regular', fontStyle: 'normal', fontSize: 12},
        head: [['Detalle items cotización']],
        body: [[`Estimad@ ${quotation.client.name}, a continuación se detallan los productos y/o servicios solicitados`]]
    });
    doc.autoTable({
        styles: {font: 'PTSansNarrow-Regular', fontStyle: 'normal', cellPadding: Padding = 3},
        headStyles: {fontSize: 12},
        footStyles: {fontSize: 12},
        columnStyles: {0: {fillColor: [212, 231, 236]}},
        showFoot: 'lastPage',
        head: [['Nombre', 'Tipo', 'Precio', '% Descuento', 'Precio con desc.', 'Cantidad', 'Subtotal']],
        body: valuesBody,
        foot: [[' ', ' ', ' ', ' ', ' ', 'Total: ', `$${auxTotal}`]]
    });
    doc.autoTable({
        theme: 'plain',
        bodyStyles: {font: 'Lato-Regular', fontStyle: 'normal', fontSize: 12},
        head:[[` Comentarios, detalles y/o especificaciones`]],
        body: [[`    ${quotation.note}`]]
    });
    M.toast({html: `Se ha descargado la cotización en formato PDF`});
    doc.save(docName+'.pdf');
}

const showLogotype = () => {
    const srcImage = localStorage.getItem("logotype");
    const imgHtml = document.getElementById('logotypePreview');
    if(srcImage){
        imgHtml.setAttribute("src", srcImage);
    }
}

const fileValidation = () => {
    const filePath = logotypeFile.value;
    const allowedExtensions = /(.jpg|.jpeg|.png)$/i;
    if(!allowedExtensions.exec(filePath)){
        return false;
    }else{
        return true;
    }
}

window.onload = () =>{
    const instanceAuto = M.Autocomplete.getInstance(autoCompleteInput);
    const instanceTab = M.Tabs.getInstance(tab);
    const instanceModal = M.Modal.getInstance(modalQuotation);
    instanceAuto.updateData(itemNames());
    elementsTemplate();

    btnContinueTab1.addEventListener('click', (e) => {
        e.preventDefault();
        if(formAutorClientValidator()){
            const autorName = document.getElementById('autor-name').value;
            const autorCel = document.getElementById('autor-cel').value;
            const autorEmail = document.getElementById('autor-email').value;
            const autorAddress = document.getElementById('autor-address').value;
            const clientName = document.getElementById('client-name').value;
            const clientCel = document.getElementById('client-cel').value;
            const clientAddress = document.getElementById('client-address').value;
            const clientEmail = document.getElementById('client-email').value;

            autor = newPerson(autorName, autorCel, autorEmail, autorAddress);
            client = newPerson(clientName, clientCel, clientEmail, clientAddress);

            tab.children[1].classList.remove('disabled');
            instanceTab.select('tab-2');
            M.toast({html: `Se han guardado tus datos y los del cliente`});
        }
    });

    btnAddItem.addEventListener('click', (e) => {
        e.preventDefault();
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
            M.toast({html: `Se agregó el ${type} ${name} en la cotización`}); 
            formQuotation.reset();
            elementsTemplate();
        }
    });

    btnCancelItem.addEventListener('click', (e) => {
        e.preventDefault();
        formQuotation.reset();
        instanceModal.close();
    });

    quotationTable.addEventListener('click', (e) =>{
        e.preventDefault();
        if(e.target.innerHTML === 'Quitar'){
            deleteItemQuotation(e.target.value);
            M.toast({html: `El item: ${e.target.value} fue quitado de la cotización`, classes:'black'});
            elementsTemplate();            
        }
    });

    btnContinueTab2.addEventListener('click', (e) => {
        e.preventDefault();
        if(quotationItems.length != 0){
            tab.children[2].classList.remove('disabled');
            instanceTab.select('tab-3');
            const date = new Date();
            const note = document.getElementById('textarea1').value;
            quotation = newQuotation(date, autor, client, quotationItems, note, auxTotal);
            M.toast({html: `Se han guardado todos los datos de la cotización`}); 
            console.log(quotation);
        }else{
            M.toast({html: `Debe ingresar al menos 1 producto o servicio`}); 
            btnAddItem.focus();
        }
    });

    logotypeFile.addEventListener('change', function() {
        if(fileValidation()){       
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                window.localStorage.setItem("logotype", reader.result);
                const type = logotypeFile.files[0].type.split("/").pop();
                localStorage.setItem("extension", type);
                console.log(reader.result);
                showLogotype();
            });
            reader.readAsDataURL(logotypeFile.files[0]);
        }else{
            M.toast({html: `Solo se pueden cargar imagenes de tipo .JPG, .JPEG y .PNG`});
            logotypeFile.value = '';
            logotypeFile.focus();
        }
    });

    btnPdf.addEventListener('click', (e) => {
        e.preventDefault();
        createPDF();
    });

    btnDeleteLogo.addEventListener('click', (e) =>{
        e.preventDefault();
        localStorage.setItem("logotype", "0");
        logotypeFile.value = '';
        const textInputFile = document.getElementsByClassName("file-path validate");
        textInputFile[0].value = '';
        const imgHtml = document.getElementById('logotypePreview');
        imgHtml.setAttribute("src", "");
    });
}
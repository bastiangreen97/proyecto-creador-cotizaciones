let items2 = JSON.parse(localStorage.getItem('arrayItems')) || [];
const autor = localStorage.getItem('infoAutor') || [];
const tab = document.getElementById('tabs-quotation');
const quotationItems = [];
const autoCompleteInput = document.getElementById('autocomplete-input');

const itemNames = () => {
    let dataNames = new Object();
    items2.forEach(element => { 
        dataNames[element.name] = null;
    });
    return dataNames;
}

document.addEventListener('DOMContentLoaded', function() {
    const elemsAuto = document.querySelectorAll('.autocomplete');
    const instancesAuto = M.Autocomplete.init(elemsAuto);
    const instance = M.Tabs.init(tab);
    });



const newQuotation = (autor, name, ) => {

}

const addItem = (item) =>{
    quotationItems.push(item);
}

window.onload = () =>{
    const instanceAuto = M.Autocomplete.getInstance(autoCompleteInput);
    instanceAuto.updateData(itemNames());
    console.log(itemNames());
}
import testModule from './modules/module';

testModule('Hola mundo! Esto es un mensaje proveniente de un modulo TS importado usando Parcel.js');

interface Int {
  casa: string;
}

let prueba: Int = {casa: 'hola'}
console.log(prueba);

interface LabeledValue {
  label: string;
}

let myObj: LabeledValue = {label: 'hola'};
console.log(myObj);
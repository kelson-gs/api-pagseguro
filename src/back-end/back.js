const fetch = require('cross-fetch');
const express = require("express");
const app = express();

const cors = require("cors");
const bodyParser = require("body-parser");

// habilitando o cors 
app.use(cors());

// configurando body-parser 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// chamando rotas do controllers

//cobrança cartão crédito
app.post('/cobrancaCard', (req, res)=>{
    const {numeroCard, mesExp, anoExp, codeSeguranca, nome, valor} = req.body;

    var url = "https://sandbox.api.pagseguro.com/charges"

    var raw = JSON.stringify({
        "reference_id": "00001",
        "description": "Plano 1 do aplicativo equivalentes",
        "amount": {
          "value": valor,
          "currency": "BRL"
        },
        "payment_method": {
          "type": "CREDIT_CARD",
          "installments": 1,
          "capture": false,
          "card": {
            "number": `${numeroCard}`,
            "exp_month": `${mesExp}`,
            "exp_year": `${anoExp}`,
            "security_code": `${codeSeguranca}`,
            "holder": {
              "name": `${nome}`
            }
          }
        }
      });

    fetch(url,{
        method:"POST",
        body: raw,
        headers: new fetch.Headers({
          'Content-Type': 'application/json',
          'Authorization': '1B933CC3173949EDB424F6F0D7ADCEAF',
          'x-api-version': '4.0'
        })
    }).then( response => response.json())
    .then( data => {
      console.log(data);
      res.send(data);
    })
    .catch(err => console.log('Erro: ',err));
    
});

//cobrança boleto
app.post('/cobrancaBoleto', ( req, res )=>{

  const{ nome, cpf, email, data, valor, rua, cidade, regiaoCode, cep, numero, bairro } =  req.body;
  var url = "https://sandbox.api.pagseguro.com/charges"
  
  var raw = JSON.stringify({
    "reference_id": "ex-00001",
    "description": "Motivo do pagamento",
    "amount": {
      "value": valor,
      "currency": "BRL"
    },
    "payment_method": {
      "type": "BOLETO",
      "boleto": {
        "due_date": `${data}`,
        "instruction_lines": {
          "line_1": "Pagamento processado para DESC Fatura",
          "line_2": "Via PagSeguro"
        },
        "holder": {
          "name": `${nome}`,
          "tax_id": `${cpf}`,
          "email": `${email}`,
          "address": {
            "region": "BR",
            "region_code": `${regiaoCode}`,
            "street": `${rua}`,
            "city": `${cidade}`,
            "postal_code": `${cep}`,
            "country": "Brasil",
            "number": `${numero}`,
            "locality": `${bairro}`
          }
        }
      }
    },
    "notification_urls": [
      "https://yourserver.com/nas_ecommerce/277be731-3b7c-4dac-8c4e-4c3f4a1fdc46/"
    ],
    "metadata": {
      "Exemplo": "Aceita qualquer informação",
      "NotaFiscal": "123",
      "idComprador": "123456"
    }
  });

  fetch(url,{
      method: "POST",
      body: raw,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': '1B933CC3173949EDB424F6F0D7ADCEAF',
        'x-api-version': '4.0',
      }
  }).then( response => response.json())
  .then( data => {
    console.log(data)
    res.send(data);
  })
  .catch(err => console.log('Erro: ',err));
  
});

// consultar uma cobrança
app.get("/consultarUmaCobranca/:id", (req, res)=>{
  const { id } = req.params;

  var url = `https://sandbox.api.pagseguro.com/charges/${id}` //adc chave id da cobrança
  fetch(url, {
    method: "GET",
    headers: {
      "Content-type":"application/json",
      "Authorization":"1B933CC3173949EDB424F6F0D7ADCEAF",
      "x-api-version":"4.0",
    }
  }).then( response => response.json())
  .then( data => {
    res.send(data);
  } )
  .catch( err => console.log('Error: ', err));
});

// buscar uma cobrança
app.get("/buscarCobranca/:referenceId", (req, res)=>{
  const{ referenceId } = req.params;
  var url = `https://sandbox.api.pagseguro.com/charges?reference_id=${referenceId}`;

  fetch(url, {
    method: "GET",
    headers: {
      "Content-type":"application/json",
      "Authorization":"1B933CC3173949EDB424F6F0D7ADCEAF",
      "x-api-version":"4.0",
    }
  }).then( response => response.json())
  .then( data => {
    res.send(data);
  })
  .catch( err => console.log("Erro: ", err) );
});


// PIX
  // cobranca pix
  app.post("/pix", (req, res) => {
    const cpf_Recebedor = "07486406578";
    const { cpf, nome, chavepix, valor } = req.body;

    var url = `https://sandbox.api.pagseguro.com/pix/pay/${cpf_Recebedor}`;
    
    /*
    var raw = JSON.stringify({
      "calendario": {
        "expiracao": "3600"
      },
      "devedor": {
        "cpf": `${cpf}`,
        "nome": `${nome}`
      },
      "valor":{
        "original":`${valor}`
      },
      "chave": `${chavepix}`,
      "solicitacaoPagador": "Serviço realizado."
    });
    */
   
    fetch(url, {
      method: "POST",
      //body: raw,
      headers: {
        "Content-type":"application/json",
        "Authorization":"1B933CC3173949EDB424F6F0D7ADCEAF",
        "x-api-version":"4.0",
      }
    }).then( response => response.json())
    .then( data => {
      res.send(data);
    })
    .catch( err => console.log("Error: ", err))
  });



// express listen server
app.listen(8081, () => {
    console.log('Servidor conectado!')
});

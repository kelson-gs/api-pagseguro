import {useState, useEffect} from 'react';
import './pagamento.css';
import axios from "axios";
import {toast} from 'react-toastify';
import { useContext } from "react/cjs/react.development";
import { AuthContext } from '../../contexts/auth';


export default function Pagamento(){
    const[numeroCard, setNumeroCard] = useState("");
    const[mesExp, setMesExp] = useState("");
    const[anoExp, setAnoExp] = useState("");
    const[codeSeguranca, setCodeSeguranca] = useState("");
    const[nome, setNome] = useState("");
    const[cpf, setCpf] = useState("");
    const[rua, setRua] = useState("");
    const[cidade, setCidade] = useState("");
    const[regiaoCode, setRegiaoCode] = useState("");
    const[cep, setCep] = useState("");
    const[bairro, setBairro] = useState("");
    const[email, setEmail] = useState("");
    const[ddd, setDdd] = useState("");
    const[telefone, setTelefone] = useState("");
    const[chavepix, setChavepix] = useState("");
    const[numero, setNumero] = useState('');
    const[areaCobranca, setAreaCobranca] = useState("");
    const [statusUser, setStatusUser] = useState('');
    const[linkBoleto, setLinkboleto] = useState('');

    const{ updatePayment } = useContext(AuthContext);
    
    async function getStatusUser(){
        let user = JSON.parse(localStorage.getItem('SistemaUser'));
        if(user.length === 0){
            setStatusUser('');
        } else {
            setStatusUser(user);
        }
    }

    useEffect(()=>{
        getStatusUser();
    },[]);

    function pagamentoCard(e){
        e.preventDefault();
        if(statusUser.plano === "plano1"){
            var valor = 1499;
        } else if(statusUser.plano === "plano2"){
            var valor = 1999;
        }

        axios.post('http://localhost:8081/cobrancaCard',{
            numeroCard: numeroCard,
            mesExp: mesExp,
            anoExp: anoExp,
            codeSeguranca: codeSeguranca,
            nome: nome,
            valor: valor
        })
        .then((resposta)=> {
            updatePayment(statusUser);
            toast.success("Pagamento no cartão realizado com sucesso!");
            console.log(resposta);
        }).catch(err => {
            toast.error("Houve um erro ao realizar o pagamento!");
            console.log(err)
        });
    }

    function pagamentoBoleto(e){
        e.preventDefault();
        const d = new Date();
        const year = d.getFullYear();
        const month = d.getMonth();
        const day = d.getDate()+7;

        let data = (`${year}-${month+1}-${day}`);
        if(statusUser.plano == "plano1"){
            var valor = 1499;
        } else if(statusUser.plano === "plano2"){
            var valor = 1999;
        }

        
        axios.post('http://localhost:8081/cobrancaBoleto', {
            nome: nome,
            cpf: cpf,
            email: email,
            data: data,
            regiaoCode: regiaoCode,
            rua: rua,
            cidade: cidade,
            cep: cep,
            numero: numero,
            bairro: bairro,
            valor: valor
        })
        .then((resposta)=> {
            updatePayment(statusUser);
            toast.success("boleto gerado com sucesso!");
            console.log(resposta.data.links[0].href);
            setLinkboleto(resposta.data.links[0].href);
        }).catch(err => {
            toast.error("Houve um erro ao realizar o pagamento!");
            console.log(err)
        });
    }

    function pix(e){
        e.preventDefault();
        if(statusUser.plano == "plano1"){
            var valor = 14.99;
        } else if(statusUser.plano === "plano2"){
            var valor = 19.99;
        }

        axios.post('http://localhost:8081/pix', {
            nome: nome,
            cpf: cpf,
            chavepix: chavepix,
            valor: valor
        })
        .then((resposta)=> {
            updatePayment(statusUser);
            toast.success("Pix enviado com sucesso!");
            console.log(resposta);
        }).catch(err => {
            toast.error("Houve um erro ao realizar o pagamento!");
            console.log(err)
        });
    }

    return(
        <div id="main-div-payment">
            <div id="view-method-payment">
                <h2>Como deseja realizar o pagamento ?</h2>
                <div id="payment-method">
                    <p className="choice-payment" onClick={ () => setAreaCobranca( "cartao" ) }> Cartão </p>
                    <p className="choice-payment" onClick={ () => setAreaCobranca( "boleto" ) }> Boleto </p>
                    <p className="choice-payment" onClick={ () => setAreaCobranca( "pix" ) }> Pix </p>
                </div>

                {areaCobranca === "cartao" ? (
                    <form onSubmit={pagamentoCard} className="form-payment">
                        <h2 className="title-name-payment"> Cartão </h2>
                        <div className="div-infor-payment">
                            <label className="label-payment">Digite o numero do cartão</label>
                            <input 
                                type="number" 
                                className="input-payment"
                                placeholder="Ex: 4242424242424242"
                                onChange={ e => setNumeroCard(e.target.value)}
                            />
                        </div>

                        <div className="div-infor-payment">
                            <label className="label-payment">Digite o mês de expiração</label>
                            <input 
                                type="number" 
                                className="input-payment"
                                placeholder="EX: 12"
                                onChange={ e => setMesExp( e.target.value ) }
                            />
                        </div>

                        <div className="div-infor-payment">
                            <label className="label-payment">Digite o ano de expiração</label>
                            <input 
                                type="number" 
                                className="input-payment"
                                placeholder="Ex: 2026"
                                onChange={ e => setAnoExp( e.target.value ) }
                            />
                        </div>

                        <div className="div-infor-payment">
                            <label className="label-payment">Digite o código de segurança do cartão</label>
                            <input 
                                type="number"
                                className="input-payment" 
                                placeholder="Ex: 123"
                                onChange={ e => setCodeSeguranca( e.target.value ) }
                            />
                        </div>

                        <div className="div-infor-payment">
                            <label className="label-payment">Digite o nome que está no cartão</label>
                            <input 
                                type="text" 
                                className="input-payment"
                                placeholder="Ex: Jose da Silva"
                                onChange={ e => setNome( e.target.value ) }
                            />
                        </div>
                        <button type="submit" className="btn-payment"> concluir </button>
                    </form>
                ):(null)}

                {areaCobranca === "boleto" ? (
                    <form onSubmit={pagamentoBoleto} className="form-payment">
                        <h2 className="title-name-payment"> Boleto </h2>
                        <div className="div-infor-payment">
                            <label className="label-payment">Nome</label>
                            <input
                                type="text"
                                className="input-payment"
                                placeholder="Antonio marcos da silva"
                                onChange={ e => setNome( e.target.value )}
                            />
                        </div>

                        <div className="div-infor-payment">
                            <label className="label-payment">cpf</label>
                            <input
                                type="number"
                                className="input-payment"
                                placeholder="Ex: 41444444444"
                                onChange={ e => setCpf( e.target.value ) }
                            />
                        </div>

                        <div className="div-infor-payment">
                            <label className="label-payment">email</label>
                            <input
                                type="email"
                                className="input-payment"
                                placeholder="Ex: Antonio@email.com"
                                onChange={ e => setEmail( e.target.value ) }
                            />
                        </div>

                        <div className="div-infor-payment">
                            <label className="label-payment">Cidade</label>
                            <input
                                type="text"
                                className="input-payment"
                                placeholder="Ex: Itapetinga"
                                onChange={ e => setCidade( e.target.value ) }
                            />

                            <select onChange={ e => setRegiaoCode(e.target.value)}>
                                <option value="AC">AC</option>
                                <option value="AL">AL</option>
                                <option value="AP">AP</option>
                                <option value="AM">AM</option>
                                <option value="BA">BA</option>
                                <option value="CE">CE</option>
                                <option value="DF">DF</option>
                                <option value="ES">ES</option>
                                <option value="GO">GO</option>
                                <option value="MA">MA</option>
                                <option value="MT">MT</option>
                                <option value="MS">MS</option>
                                <option value="MG">MG</option>
                                <option value="PA">PA</option>
                                <option value="PB">PB</option>
                                <option value="PR">PR</option>
                                <option value="PE">PE</option>
                                <option value="PI">PI</option>
                                <option value="RJ">RJ</option>
                                <option value="RN">RN</option>
                                <option value="RS">RS</option>
                                <option value="RO">RO</option>
                                <option value="RR">RR</option>
                                <option value="SC">SC</option>
                                <option value="SP">SP</option>
                                <option value="SE">SE</option>
                                <option value="TO">TO</option>
                            </select>
                        </div>

                        <div className="div-infor-payment">
                            <label className="label-payment">Rua</label>
                            <input
                                type="text"
                                className="input-payment"
                                placeholder="Ex: Rua "
                                onChange={ e => setRua( e.target.value ) }
                            />
                        </div>

                        <div className="div-infor-payment">
                            <label className="label-payment">Bairro</label>
                            <input
                                type="text"
                                className="input-payment"
                                placeholder="Ex: Centro"
                                onChange={ e => setBairro( e.target.value ) }
                            />
                        </div>


                        <div className="div-infor-payment">
                            <label className="label-payment">numero</label>
                            <input
                                type="tel"
                                className="input-payment"
                                placeholder="Ex: 102"
                                onChange={ e => setNumero( e.target.value ) }
                            />
                        </div>

                        <div className="div-infor-payment">
                            <label className="label-payment">cep</label>
                            <input
                                type="tel"
                                className="input-payment"
                                placeholder="Ex: 45700000"
                                onChange={ e => setCep( e.target.value ) }
                            />
                        </div>

                        <button type="submit" className="btn-payment">Concluir</button>
                    </form>
                    
                ):(null)}

                

                {areaCobranca === "pix" ? (
                    <form onSubmit={ pix } className="form-payment">
                        <h2 className="title-name-payment"> Pix </h2>
                        <div className="div-infor-payment">
                            <label className="label-payment">Nome</label>
                            <input
                                type="text"
                                className="input-payment"
                                placeholder="Ex: Antonio Marcos da Silva"
                                onChange={ e => setNome( e.target.value ) }
                            />
                        </div>

                        <div className="div-infor-payment">
                            <label className="label-payment">cpf</label>
                            <input
                                type="number"
                                className="input-payment"
                                placeholder="Ex: 41444444444"
                                onChange={ e => setCpf( e.target.value ) }
                            />
                        </div>

                        <div className="div-infor-payment">
                            <label className="label-payment">chave pix</label>
                            <input
                                type="text"
                                className="input-payment"
                                placeholder="Nome, CPF/CNPJ ou chave pix"
                                onChange={ e => setChavepix( e.target.value ) }
                            />
                        </div>
                        <button type="submit" className="btn-payment">concluir</button>
                    </form>
                ):(null)}
            </div>
            {linkBoleto !== ''? <a id="link_boleto" href={linkBoleto}>Acesse o boleto</a>:null}
        </div>
    );
}


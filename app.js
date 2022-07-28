import express from 'express';
import { dirname } from 'path';


import { fileURLToPath } from 'url';
import multer from 'multer';
import * as ipfsClient from 'ipfs-http-client'
import fs from 'fs'
import Web3 from 'web3';
 const web3 = new Web3("");
 const abi=
    [
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "x",
                    "type": "string"
                }
            ],
            "name": "sendHash",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "getHash",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ]
 
 const address='';
  const contract = new web3.eth.Contract(abi,address);
   console.log(contract);
const app = express()
var upload = multer({ dest: 'uploads/' })
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const account="";

const privateKey=""

const ipfs= ipfsClient.create({ host: 'ipfs.infura.io', port: 5001, protocol: 'https'})
 
app.get('/', function (req, res) {
//   
    res.sendFile(__dirname+'/public/index.html');
})

app.post('/profile', upload.single('avatar'), async function (req, res, next) {
       
      

    const file = {
        path: req.file.path,
        content: req.file.body
      }
     
        
      
      const result=Buffer.from(fs.readFileSync(file.path));
      const value = await ipfs.add(result)
      
      console.log(value.path);
      res.send(value.path)
})
     ///
     app.get('/getHash/:ID',function(req,res){
          console.log(req.params.ID);
        

        contract.methods.getHash().call({from: account}, function(error, result){
            console.log(result)
            res.send(result);
        });
     })
     app.post('/send/:ID',function(req,res){
        console.log(req.params.ID);
        //prepare data,sign transaction,send to ethereum blokchain
      //data in encoded format
      console.log(contract)
        var encodedData = contract.methods.sendHash(req.params.ID).encodeABI();
        console.log(encodedData)

        let transactionObject = {
            gas : '47000',
            data: encodedData,
            from: account,
            to  : address
        }

                //signtransaction
        web3.eth.accounts.signTransaction(transactionObject, privateKey,function(error,response){
            if(error){
                console.log(error);
            }
            else{
                console.log(response);
                web3.eth.sendSignedTransaction(response.rawTransaction)
                .on('receipt',function(response){
                    res.send(response)
               })
            }
    })
            
})

  app.get('/download/:ID',function(req,res){
   
      console.log(req.params.ID);
      res.redirect(`https://ipfs.infura.io/ipfs/${req.params.ID}`);
  })
 
app.listen(8080,()=>{
    console.log("server running on port 8080")
})


//ganache cli
//infura roupsten link/
//refer web3.eth in website
//web3.eth.contract documentation
//get account and private key in metamask
//

//creating byte code->signtran->send raw transaction to ethereum network

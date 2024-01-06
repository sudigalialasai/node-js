const http=require('http');
const fs=require("fs");
const url=require(`url`);
const replaceTemplate=require('./replaceTemplate');
//blocking , schnychornus
// const text=fs.readFileSync('input.txt','utf-8')
// console.log(text)
// texts=`${text}\nCreated on ${Date.now()}`;
// fs.writeFileSync('output.txt',texts)

// //Non blocking,asychronous
// fs.readFile('input.txt','utf-8',(err,data)=>{
//     if(err) return console.log('error');
//     fs.readFile('output.txt','utf-8',(err,data1)=>{
//         console.log(data1);
//         fs.writeFile('final.txt',`${data}\n${data1}`,'utf-8',err=>{
//             console.log("your file has been created");
//         })
//     })
// });

//console.log("file read");
//console.log("*****")
//server

        // const replaceTemplate=(temp,product)=>{
        //     let output=temp
        //     .replace(/{%PRODUCTNAME%}/g,product.productName)
        //     .replace(/{%IMAGE%}/g,product.image)
        //     .replace(/{%PRICE%}/g,product.price)
        //     .replace(/{%FROM%}/g,product.from)
        //     .replace(/{%NUTRIENTS%}/g,product.nutrients)
        //     .replace(/{%QUANTITY%}/g,product.quantity)
        //     .replace(/{%DESCRIPTION%}/g,product.description)
        //     .replace(/{%ID%}/g,product.id)

        //     if(!product.organic)   output=output.replace(/{%NOT_ORGANIC%}/g,'not-organic');
            
        //     return output;
        // };

const server=http.createServer((req,res)=>{

    const {query,pathname}=url.parse(req.url,true);
    console.log(req.url);
    console.log(url.parse(req.url,true));

    const pathName=req.url;
    const tempOverview=fs.readFileSync(`${__dirname}/templare-overview.html`,`utf-8`);
    const tempCard=fs.readFileSync(`${__dirname}/template-card.html`,`utf-8`);
    const tempProduct=fs.readFileSync(`${__dirname}/product.html`,`utf-8`);
    
    const data=fs.readFileSync(`${__dirname}/data.json`,`utf-8`);
    const dataObj=JSON.parse(data);
    
    //OVERVIEW
    if(pathName=='/overview' || pathName=='/'){
        res.writeHead(200,{'Content-type':'text/html'});
        const cardHtml=dataObj.map(el=>replaceTemplate(tempCard,el)).join('');
        //console.log(cardHtml);
        const output=tempOverview.replace(/{%PRODUCT_CARDS%}/g,cardHtml);

        res.end(output);
    
    //PRODUCT
    }else if(pathname=='/product'){
        res.writeHead(200,{'Content-type':'text/html'});
        const product=dataObj[query.id];
        const output=replaceTemplate(tempProduct,product);


        console.log(query);
        res.end(output);
    }
    
    //API
    else if(pathName==`/api`){
            res.writeHead(200,{'Content-type':'application/json'});
            res.end(data);
       
         
    }
    //NOT FOUND
    else{

    res.writeHead(404,{
        'Content-type':`text/html`
    })
    res.end(`<h1>hello from the server</h1>`);}
});

server.listen(8000,`127.0.0.1`,()=>{
    console.log("lisening");
})
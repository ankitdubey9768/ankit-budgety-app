const express=require('express');
const path=require('path');
const port =process.env.PORT||3000;
const app=express()
const htmlfile=path.join(__dirname)
app.use(express.static(htmlfile))

app.get('*',(req,res)=>{
	res.sendFile(path.resolve(__dirname,'index.html'))
});






app.listen(port);
console.log('service started');
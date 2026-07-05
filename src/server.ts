

async function main(){
    try{
        app.listen(PORT, ()=>{
            console.log(`Server is running on port ${PORT}`);
        })
    }catch(err){
        console.error("Error starting the server:", err);
    }
}
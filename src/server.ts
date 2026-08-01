import app from "./app";

function main(){
    app.listen(5000, ()=>{
        console.log("Server is running on properly");
    })
}

main()
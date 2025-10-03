export const rootController = async (req,res)=>{
    console.log("Root controller");
    
    res.send("Root controller");

}

export const registerController = async (req,res)=>{
    res.send("User Registered");
}
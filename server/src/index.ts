function myName(name : String){
    console.log(name)
}



function myNumber(num : Number){
    console.log("Number is :" + num)
}
myName("Hi Developer : This is a typescript project");
myNumber(35);

interface name {
    FirstName : String
    LastName : String
    userId : number
}

function giveDetails(info : name){

    console.log(info)
}

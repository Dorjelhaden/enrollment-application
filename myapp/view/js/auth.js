if (document.cookie == "") {
    alert("User not logged in!!")
    window.open("indexedDB.html", "_self")
}else{
    console.log("cookie set");
    
}
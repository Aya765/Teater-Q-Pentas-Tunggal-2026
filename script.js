//======================================
// TEATER Q SCANNER
//======================================

const API_URL = "https://script.google.com/macros/s/AKfycbyR3Xikacz3GhF4rDk5DDyOm7lU4tbzo0yHayq3GYTrY1JWWbKuRSIYcMOyyLtLELF-/exec";

const reader = document.getElementById("reader");
const hasil = document.getElementById("hasil");
const scanLagi = document.getElementById("scanLagi");

let html5QrCode;
let lastScan = "";

//======================================
// MULAI SCANNER
//======================================

async function mulaiScanner(){

    hasil.innerHTML = "Menunggu scan...";

    scanLagi.style.display = "none";

    reader.style.display = "block";

    html5QrCode = new Html5Qrcode("reader");

    await html5QrCode.start(

        {
            facingMode:"environment"
        },

        {
            fps:10,
            qrbox:250
        },

        onScanSuccess

    );

}

//======================================
// SAAT QR BERHASIL DIBACA
//======================================

async function onScanSuccess(decodedText){

    if(decodedText == lastScan){
        return;
    }

    lastScan = decodedText;

    await html5QrCode.stop();

    reader.style.display = "none";

    hasil.innerHTML = "Mencari tiket...";

    cariTiket(decodedText);

}

//======================================
// CARI TIKET
//======================================

async function cariTiket(ticketID){

    try{

        const response = await fetch(API_URL,{

            method:"POST",

            body:JSON.stringify({

                action:"cari",

                ticketID:ticketID

            })

        });

        const data = await response.json();

        console.log(data);

    }

    catch(err){

        hasil.innerHTML =
        "❌ Gagal terhubung ke server";

    }

}

mulaiScanner();


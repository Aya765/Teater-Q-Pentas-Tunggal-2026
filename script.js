//======================================
// TEATER Q SCANNER
//======================================

const API_URL = "https://script.google.com/macros/s/AKfycbzr1zpetaG6kr95ISQhA8t1fXVSAXp209VzNwxvZDH-k83tpONTRNNc4WPC3jCA1xlk/exec";

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

if(!data.found){

    hasil.innerHTML = "❌ Tiket tidak ditemukan";

    scanLagi.style.display = "inline-block";

    return;

}

tampilkanData(data);

    }
        
    catch(err){

        hasil.innerHTML =
        "❌ Gagal terhubung ke server";

    }

}


//======================================
// TAMPILKAN DATA TIKET
//======================================

function tampilkanData(data){

    hasil.innerHTML = `
<b>Nama</b><br>${data.nama}<br><br>

<b>ID Tiket</b><br>${data.ticketID}<br><br>

<b>Jumlah Tiket</b><br>${data.jumlah}<br><br>

<b>Sudah Masuk</b><br>${data.masuk}<br><br>

<b>Sisa Tiket</b><br>${data.sisa}<br><br>

<button id="btnCheckin">
✅ CHECK IN
</button>
`;

    document
        .getElementById("btnCheckin")
        .onclick = () => prosesCheckIn(data.ticketID);

}

//======================================
// PROSES CHECK IN
//======================================

async function prosesCheckIn(ticketID){

    hasil.innerHTML = "Memproses check-in...";

    try{

       const response = await fetch(API_URL,{
    method:"POST",

    body:JSON.stringify({
        action:"checkin",
        ticketID:ticketID
    })
});

        const data = await response.json();

        if(!data.success){

            hasil.innerHTML = data.message;

            scanLagi.style.display = "inline-block";

            return;

        }

        hasil.innerHTML = `
${data.message}

<br><br>

<b>${data.nama}</b>

<br>

Sudah Masuk : ${data.masuk}

<br>

Sisa : ${data.sisa}
`;

        scanLagi.style.display = "inline-block";

    }

    catch(err){

        hasil.innerHTML = "❌ Gagal menghubungi server";

        scanLagi.style.display = "inline-block";

    }

}

//======================================
// SCAN LAGI
//======================================

scanLagi.onclick = ()=>{

    lastScan = "";

    mulaiScanner();

};

mulaiScanner();

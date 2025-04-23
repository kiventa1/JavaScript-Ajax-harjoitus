// kutsu funktiota, jolla haetaan tuoteryhmät valintalistaan, kun sivu avataan
haeKategoriat();
haejanaytaTuotteet(); //luo tuotekortit

// hae tuoteryhmät ja tulosta käyttöliittymään painikkeet
function haeKategoriat() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://fakestoreapi.com/products/categories', true); // kategoriarajapinnan osoite
    xhr.onload = function () {
        if (xhr.status === 200) { // käsitellään vastaus jos pyyntö onnistuu
            const categories = JSON.parse(xhr.responseText); // parsitaan vastaus

            const kategorianapit = document.getElementById('kategoriat'); // valitaan oikea div käyttöliittymästä
            categories.forEach(category => { // lisätään vastauksena saadut kategoriat
                const kategoriapainike = document.createElement('button'); // luodaan painike
                
                // asetetaan onclick-kuuntelija, joka näyttää kategorian tuotteet
                kategoriapainike.onclick = function () { haejanaytaKategorianTuotteet(category); }; 
                
                // asetetaan painikkeelle kategorian nimi tekstiksi
                kategoriapainike.textContent = category
                
                // asetetaan painikkeelle tyylit
                kategoriapainike.className = "btn btn-secondary m-1"
                
                // lisätään painike käyttöliittymään
                kategorianapit.appendChild(kategoriapainike);
            });
        } else {
            console.error('Error fetching categories:', xhr.statusText); // jos tulee virhe
        }
    };
    xhr.onerror = function () {
        console.error('Request error');
    };
    xhr.send();
}

// hae ja näytä tuotteet tuoteryhmävalinnan mukaan
function haejanaytaKategorianTuotteet(category) {

    if (!category) return;

    const xhr = new XMLHttpRequest();
    xhr.open('GET', `https://fakestoreapi.com/products/category/${category}`, true);
    xhr.onload = function () {
        if (xhr.status === 200) { // käsitellään vastaus jos kutsu onnistui
            const products = JSON.parse(xhr.responseText); // parsitaan vastaus

             // kutsutaan funktiota, joka tulostaa vastauksena saadut datan tuotekorttina käyttöliittymään
            printtaaTuotteet(products);
        } else {
            console.error('Error fetching products:', xhr.statusText);
        }
    };
    xhr.onerror = function () {
        console.error('Request error');
    };
    xhr.send();
}


// FUNKTIO hae kaikki tuotteet
function haejanaytaTuotteet() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://fakestoreapi.com/products', true);
    xhr.onload = function () {
        if (xhr.status === 200) {
            const products = JSON.parse(xhr.responseText);
            printtaaTuotteet(products); // tulostetaan tuoteet ruudulle
        } else {
            console.error('Error fetching products:', xhr.statusText);
        }
    };
    xhr.onerror = function () {
        console.error('Request error');
    };
    xhr.send()
}

// FUNKTIO Tulostetaan parametrina saadut tuotteet ruudulle korteiksi
function printtaaTuotteet(products) {
    // haetaan käyttöliittymästä DOMilla tuotelista
    let tuotteet = document.getElementById("tuotelista");

    // Tyhjennä sisältö
    tuotteet.innerHTML = "";

    // käy kaikki parametrina saadut tuotteet läpi
    products.forEach(tuote => {
        // luo bootstrap-kortin div-rakenteet
        let tuoteDiv = document.createElement("div");
        tuoteDiv.className = "col m-2";

        let korttiDiv = document.createElement("div");
        korttiDiv.className = "card h-100";
        korttiDiv.style = "width: 18em";

        let korttiBodyDiv = document.createElement("div");
        korttiBodyDiv.className = "card-body";

        // tulosta kuvaelementti ja aseta lähteeksi rajapinnalta saatu kuvaosoite
        let kuva = document.createElement("img");
        kuva.className = "card-img-top p-2"
        kuva.style = "height: 200px; object-fit: contain;"
        kuva.src = tuote.image;
        korttiDiv.appendChild(kuva);

        // tulosta otsikko
        let titleDiv = document.createElement("div");
        titleDiv.textContent = `${tuote.title}`;
        titleDiv.className = "card-title"
        korttiBodyDiv.appendChild(titleDiv);

        // tuoosta hinta
        let priceDiv = document.createElement("div");
        priceDiv.textContent = `Hinta: ${tuote.price} €`;
        priceDiv.className = "card-text"
        korttiBodyDiv.appendChild(priceDiv);

        // tulosta ostoskorinappula
        const ostosnappi = document.createElement('img');
        ostosnappi.src = "ostoskori.png"
        ostosnappi.width = 50
        ostosnappi.style.float = 'right'
        
        // näytä alert kun napia klikkaa
        ostosnappi.onclick = function () { alert("Tämä tuote lisättiin ostokoriin: " + tuote.title); };
        ostosnappi.onmouseover = function () {
            ostosnappi.style.transform = 'scale(1.1)';
            ostosnappi.style.transition = 'transform 0.2s ease';
            ostosnappi.style.cursor = 'pointer';
        };

        ostosnappi.onmouseout = function () {
            ostosnappi.style.transform = 'scale(1)';
        };

        korttiBodyDiv.appendChild(ostosnappi);

        // lisää kortit käyttöliittmään
        korttiDiv.appendChild(korttiBodyDiv);
        tuoteDiv.appendChild(korttiDiv);
        tuotteet.appendChild(tuoteDiv);
    });
}

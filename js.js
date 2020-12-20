'use strict';

window.onload = function () {
    if(localStorage.getItem('lkr')){
        document.getElementById('inputLkr').value = localStorage.getItem('lkr');
    }
}

function searchLkr(){
    let lkr = document.getElementById('inputLkr').value;
    let result = ``
    localStorage.setItem('lkr', lkr);
    fetch(`https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_Landkreisdaten/FeatureServer/0/query?`+
                                `where=GEN%20%3D%20'${lkr}'&outFields=GEN,death_rate,cases,deaths,cases_per_100k,`+
                                `cases_per_population,cases7_per_100k,cases7_bl_per_100k,recovered,BL,bez&outSR=4326&f=json`)
    .then((response) => response.json())
    .then(function(data){
        console.log(data);
        if (data['features'].length === 0){
            document.getElementById('currentCity').innerHTML = 'Landkreis existiert nicht!';
            return;
        }
        data['features'].forEach(element => {

            result +=`
            <ul style="list-style-type:none;">
                <li><b>${element['attributes']['BEZ']} ${element['attributes']['GEN']}</b></li>
                <li><b>Fälle (aktiv/genesen):</b> ${element['attributes']['cases']}</li>
                <li><b>Fälle/100.000 EW:</b> ${Number(element['attributes']['cases_per_100k']).toFixed(2)}</li>
                <li><b>Fälle 7 Tage/100.000 EW:</b> ${Number(element['attributes']['cases7_per_100k']).toFixed(2)}</li>
                <li><b>Anzahl Todesfälle:</b> ${element['attributes']['deaths']}</li>
                <li><b>Sterberate:</b> ${Number(element['attributes']['death_rate']).toFixed(2)}</li>
                <li><b>Bundesland Fälle 7 Tage/100.000 EW</b>: <br> ${Number(element['attributes']['cases7_bl_per_100k']).toFixed(2)}</li>
            </ul>
            `;
            if(data['features'].length > 1){
                result +=`
                <button id="${element['attributes']['BEZ']}${element['attributes']['GEN']}" 
                onclick="showLight(${Number(element['attributes']['cases7_per_100k']).toFixed(2)},'${element['attributes']['BL']}',
                '${element['attributes']['BEZ']} ${element['attributes']['GEN']}')">
                Zeige ${element['attributes']['BEZ']} ${element['attributes']['GEN']}
                </button>
                `
            }
        });
        document.getElementById('result').innerHTML = result;
        let cases = Number(data['features']['0']['attributes']['cases7_per_100k']).toFixed(2);
        let bl = data['features']['0']['attributes']['BL'];
        let city = data['features']['0']['attributes']['BEZ'] +' '+ data['features']['0']['attributes']['GEN'];
        showLight(cases, bl, city)

    })
}
function showLight(cases, bl, city){
    document.getElementById('currentCity').innerHTML = `<b>Die Ampel in ${city}:</b>`
    if(bl === 'Bayern'){
        document.getElementById('color0').style = 'display: block';
        document.getElementById('traffic-light').style = 'height: 425px';
        if(cases < 35){
            document.getElementById('color3').checked = 'checked';
        } else if (cases > 35 && cases < 50){
            document.getElementById('color2').checked = 'checked';
        } else if (cases > 50 && cases < 100){
            document.getElementById('color1').checked = 'checked';
        } else if (cases > 100){
            document.getElementById('color0').checked = 'checked';
        }
    }
    else{
        document.getElementById('color0').style = 'display: none';
        document.getElementById('traffic-light').style = 'height: 320px';
        if(cases < 35){
            document.getElementById('color3').checked = 'checked';
        } else if (cases > 35 && cases < 50){
            document.getElementById('color2').checked = 'checked';
        } else if (cases > 50){
            document.getElementById('color1').checked = 'checked';
        }
    }
}
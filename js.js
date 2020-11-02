function searchLkr(){
    var lkr = document.getElementById('inputLkr').value;
    var result = ``
    fetch(`https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_Landkreisdaten/FeatureServer/0/query?`+
                                `where=GEN%20%3D%20'${lkr}'&outFields=GEN,death_rate,cases,deaths,cases_per_100k,`+
                                `cases_per_population,cases7_per_100k,cases7_bl_per_100k,recovered,bez&outSR=4326&f=json`)
    .then((response) => response.json())
    .then(function(data){
        console.log(data);
        data['features'].forEach(element => {

            result +=`
            <ul style="list-style-type:none;">
                <li>${element['attributes']['BEZ']} ${element['attributes']['GEN']}</li>
                <li>Fälle: ${element['attributes']['cases']}</li>
                <li>Fälle/100.000 EW: ${Number(element['attributes']['cases_per_100k']).toFixed(2)}</li>
                <li>Fälle 7 Tage/100.000 EW: ${Number(element['attributes']['cases7_per_100k']).toFixed(2)}</li>
                <li>Anzahl Todesfälle: ${element['attributes']['deaths']}</li>
                <li>Sterberate: ${Number(element['attributes']['death_rate']).toFixed(2)}</li>
                <li>Bundeslandw Fälle 7 Tage/100.000 EW: ${Number(element['attributes']['cases7_bl_per_100k']).toFixed(2)}</li>
            </ul>
            `
        });
        document.getElementById('result').innerHTML = result;
        
        cases = Number(data['features']['0']['attributes']['cases7_per_100k']).toFixed(2)
        if(cases < 35){
            document.getElementById('color3').checked = 'checked'
        } else if (cases > 35 && cases < 50){
            document.getElementById('color2').checked = 'checked'
        } else if (cases > 50){
            document.getElementById('color1').checked = 'checked'
        }
    
    })
    
}
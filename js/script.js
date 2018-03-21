console.log('Script started');
const addDescription = document.querySelector('#addDescription');
const addName = document.querySelector('#objectName');
const addAuthor = document.querySelector('#authorName');
const addLat = document.querySelector('#objectLat');
const addLng = document.querySelector('#objectLng');
const iconBar = document.querySelector('#iconBar');
const allIcons = iconBar.querySelectorAll('.icons');
const firstIcon = document.querySelector('#firstIcon');
const secondIcon = document.querySelector('#secondIcon');
const thirdIcon = document.querySelector('#thirdIcon');
const extendAddObject = document.querySelector('#addObject');
const addOptions = document.querySelector('#addOptions');
const newObjectBtn = document.querySelector('#newObject');
const menuHome = document.querySelector('#menuHome');
const menuMap = document.querySelector('#menuMap');
const menuList = document.querySelector('#menuList');
let smallBoxes = document.getElementsByClassName('smallBox');

const redMarker = 'media/redMarker.png';
const greenMarker = 'media/greenMarker.png';
const blueMarker = 'media/blueMarker.png';
const motorolaMarker = 'media/motorola.png';
const motorolaName = '<img src="media/motorolasolutions.png">';

const motorolaDescription = 'You can find me in the place, where real magic happens. We help people be their best in their moments that matter.';
const oakDescription = 'Hidden in the place, where is a lot of leaves and beautiful routes.';
const fireDescription = "I am small, red and really wet. Use me when it will be 'too hot'.";

const motorolaSolutions = {lat: 41.8804802, lng: -87.640543};
const douglasPark = {lat: 41.878, lng: -87.734};
const hydrant = {lat: 41.861, lng: -87.694};

let contentString;
let selectedIcon;
let markers = [];
let zoomLevel = 12;
let objLocations = [motorolaSolutions, douglasPark, hydrant];
let gameObjects = {
    locations: objLocations,
    names: [motorolaName, 'Big Oak', 'Johnny Pump'],
    authors: ['David', 'Gardener', 'Firefighter'],
    descriptions: [motorolaDescription, oakDescription, fireDescription],
    icons: [motorolaMarker, redMarker, greenMarker]
};

//Create new marker object
let addMarker = () => {
    markers = [];
    for(let i in objLocations){
        var marker = new google.maps.Marker({
            position: objLocations[i],
            title: gameObjects['names'][i],
            author: gameObjects['authors'][i],
            description: gameObjects['descriptions'][i],
            icon: gameObjects['icons'][i],
            map: map
        });
        markers.push(marker);
    }
    let infoWindow = new google.maps.InfoWindow({
            maxWidth: 300
          });


    //Show info of each marker
    for(let i in markers){
      google.maps.event.addListener(markers[i], 'click', function() {
       infoWindow.setContent(
           '<div id="content">'+
            '<div id="siteNotice">'+
            '</div>'+
            '<h2>'+
            gameObjects['names'][i]+
            '</h2>'+
            '<div id="bodyContent">'+
            '<h3 style="color: #3069A0;">'+
            gameObjects['descriptions'][i]+
            '</h3>'+
            'Position: ('+
            objLocations[i]['lat'] + ' | ' + objLocations[i]['lng']+')</br>'+
            'Author: <b>'+gameObjects['authors'][i]+'</b></br>'+
            '<p class="markerOptions" id="editBtn">Edit</p>'+
            '<p class="markerOptions" id="removeBtn">Remove</p>'+
            '</div>'+

            '</div>'

       );
       infoWindow.open(map, markers[i]);

       let editBtn = document.querySelector('#editBtn');
       editBtn.addEventListener('click', function(event){
           console.log('EDIT');
           editObject(i);
           addOptions.style.display = 'block';
       });

       let removeBtn = document.querySelector('#removeBtn');
       removeBtn.addEventListener('click', function(event){
           loadObject(i);
           removeObject(i);
           initMap();
//Timeout clears values after initMap(), because there was a 'fake point'
           setTimeout(() => {
               clearValues();
               addOptions.style.display = 'none';
           }, 0);
       });
    });
  //   google.maps.event.addListener(markers[i], 'mouseout', function() {
  //    infoWindow.close();
  // });
}
}


function initMap() {
    markers = [];
    let mapOptions = {
        zoom: zoomLevel,
        center: objLocations[objLocations.length-1],
        disableDefaultUI: true,
        zoomControl: true,
        zoomControlOptions: {
            position: google.maps.ControlPosition.RIGHT_CENTER
        },
        styles: mapStyle,
    };
    map = new google.maps.Map(document.querySelector('#map'), mapOptions);

    map.addListener('zoom_changed', function() {
          zoomLevel = map.getZoom();
        });

    addMarker();
    newObjectBtn.addEventListener('click', addMarker);
    newObjectBtn.innerText = 'Create new object';

//Place on the map, where user wants to create a new marker
    google.maps.event.addListener(map, 'click', function(event) {
          addOptions.style.display = 'block';
          addLat.value = event.latLng.lat().toFixed(3);
          addLng.value = event.latLng.lng().toFixed(3);
        });

        if(markers.length === 0){
            map.setCenter(motorolaSolutions);
        }
}

// let setMapOnAll = map => {
//         for (let i of markers) {
//           i.setMap(map);
//         }
//       }

let clearValues = () => {
    addDescription.value = '';
    addName.value = '';
    addAuthor.value = '';
    addLat.value = '';
    addLng.value = '';
}

let smallBox;
let addObject = () => {
    objLocations.push({lat: Number(addLat.value),
        lng: Number(addLng.value)});

    gameObjects['names'].push(addName.value);
    gameObjects['authors'].push(addAuthor.value);
    gameObjects['descriptions'].push(addDescription.value);
    gameObjects['icons'].push(selectedIcon);

    addDiv(1); //length-1
    newObjectBtn.innerText = 'Create new object';

    console.log('New Object Created');
}

let addDiv = j => {
    //Adding div to the list of items with a description
    smallBox = document.createElement('div');
    smallBox.className = 'smallBox';
    document.querySelector('#intro').appendChild(smallBox);

    let temporaryLocation = objLocations[objLocations.length-j];
    smallBox.addEventListener('click', function(event){
        zoomLevel = 15;
        initMap();
        map.setCenter(temporaryLocation);
        scrollTo(document.body, page2.offsetTop);
    });

    smallBox.innerHTML =
    gameObjects['names'][gameObjects['names'].length-j]+
    '<div class="insBox">'+
    gameObjects['descriptions'][gameObjects['descriptions'].length-j]+
    '<div class="insPosition">Position: '+
    objLocations[objLocations.length-j]['lat']+
    ' | '+
    objLocations[objLocations.length-j]['lng']+
    '</div>'+
    '</div>';
}


let removeObject = i => {
    //Removes exact object/marker by index
    for(let key in gameObjects){
        gameObjects[key].splice(i, 1);
    }

    //Removes exact div with item by index
    smallBoxes[i].parentElement.removeChild(smallBoxes[i]);

    console.log('Object Removed');
}

let loadObject = i => {
    addName.value = gameObjects['names'][i];
    addAuthor.value = gameObjects['authors'][i];
    addDescription.value = gameObjects['descriptions'][i];
    addLat.value = gameObjects['locations'][i]['lat'];
    addLng.value = gameObjects['locations'][i]['lng'];
    selectedIcon = gameObjects['icons'][i];
}

let editObject = i => {
    let temporaryLocation = markers[i].position;
    loadObject(i);
    removeObject(i);
    setTimeout(() => {
        initMap();
        map.setCenter(temporaryLocation);
        newObjectBtn.innerText = 'Edit object';
    }, 100);
    if(addName.value === '<img src="media/motorolasolutions.png">'){
        addName.value = 'Motorola Solutions';
    }
    // if (newObjectBtn.innerText = 'Edit object'){
    //     addOptions.addEventListener('mouseleave', function(event){
    //         alert('You need to edit object!');
    //     });
    // }
}

let showMarkers = () => {
    //Show marker from list of items (divs)
    for(let i = 3; i > 0; i--){
        addDiv(i);
        // smallBoxes[i].addEventListener('click', function(event){
        //     map.setCenter(objLocations[i]);
        //     console.log(smallBoxes);
        //     console.log(i);
        // });
    }
}

document.addEventListener('DOMContentLoaded', function(){
    showMarkers();
    //Selecting icons
    let iconOpacity = ['1', '1', '1'];
    for(let i = 0; i < allIcons.length; i++){
        allIcons[i].addEventListener('click', function(event){
            iconOpacity = iconOpacity.map(function(bool){
                return '1'
            });
            for(icon of allIcons){
                icon.style.opacity = '1';
            }
            iconOpacity[i] = '0.6';
            selectedIcon = this.src;
            this.style.opacity = iconOpacity[i];
            console.log(iconOpacity);
        });

    }

    //Options hover
    addOptions.addEventListener('mouseleave', function(event){
        addOptions.style.display = 'none';
    });
    extendAddObject.addEventListener('mouseenter', function(event){
        addOptions.style.display = 'block';
    });
    extendAddObject.addEventListener('mouseleave', function(event){
        addOptions.style.display = 'none';
    });

    //New object on click
    newObject.addEventListener('click', function(event){
        iconOpacity.sort();
        if(addName.value.length > 0 && addAuthor.value.length > 0 &&
        addLat.value.length > 0 && addLng.value.length > 0 &&
        addDescription.value.length > 0){
                if(iconOpacity[0] === '1'){
                    alert('Icon must be chosen.')
                } else {
                    addObject();
                    clearValues();
                    //initMap();
                }
        } else {
            alert('All fields must be filled.');
        }
    });

    //Scrolling
    let page1 = document.querySelector('#page1');
    menuHome.addEventListener('click', function(event){
        scrollTo(document.body, page1.offsetTop);
    });

    let page2 = document.querySelector('#page2');
    menuMap.addEventListener('click', function(event){
        scrollTo(document.body, page2.offsetTop);
    });

    let page3 = document.querySelector('#page3');
    menuList.addEventListener('click', function(event){
        scrollTo(document.body, page3.offsetTop);
    });

});

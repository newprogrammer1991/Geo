/**
 * Created by ALI on 3/28/2017.
 */
"use strict";
let myMap;
let name;
let MyBalloonContentLayoutClass;
let coords;
let placeMark;
let myGeoObjects = [];
let myCluster;
let test = true;
function init() {
    myMap = new ymaps.Map("map", {
        center: [55.7, 37.62],
        zoom: 11
    });
    myMap.cursors.push("pointer");
    myMap.events.add("click", function (e) {
        coords = e.get("coords");
        let result = ymaps.geocode(coords);

        result.then(
            function (res) {
                name = res.geoObjects.get(0).properties.get("text");

                let balloonData = new ymaps.data.Manager({
                    balloonContentHeader: name
                })
                ModifyBalloon();
            },
            function () {
                console.log("error");
            }
        );
        function ModifyBalloon() {
            MyBalloonContentLayoutClass = ymaps.templateLayoutFactory.createClass(
                '<div class="pop-up" id="popup">' +
                `<div> </div>` +
                `<div id="recalls"><p id="attention">Отзывов пока нет...</p>{{properties.data}}</div>` +
                '<form class="info" id="opinion">' +
                '<p id="recall">Ваш отзыв</p>' +
                '<p><input type="text" id="name"placeholder="Ваше имя"></p>' +
                '<p><input type="text" id="place" placeholder="Укажите место"></p>' +
                '<p><textarea rows="10" id="message" placeholder="Поделитесь впечатлениями"></textarea></p>' +
                '<p><input class="btn" id="accept" type="button" value="Добавить"></p>' +
                '</form></div>', {
                    build: function () {
                        MyBalloonContentLayoutClass.superclass.build.call(this);
                        accept.addEventListener("click", this.addGeoObject);
                    },
                    addGeoObject: function () {
                        add(recalls, opinion);
                        console.log("yes");

                        placeMark = new ymaps.Placemark(coords, {
                            iconContent: "1",
                            clusterCaption: "metka",
                            //balloonContent:popup.innerHTML
                        }, {
                            preset: 'islands#darkBlueIcon'
                            // balloonContentLayout:popup
                        });
                        placeMark.options.set("balloonContentLayout", MyBalloonContentLayoutClass);
                        myMap.geoObjects.add(placeMark);// добавляеться метка на карту
                        myGeoObjects.push(placeMark);
                        myCluster = new ymaps.Clusterer({
                                clusterDisableClickZoom: true,
                            }
                        );
                        myCluster.add(myGeoObjects);//добавляем объекты в кластер
                        myMap.geoObjects.add(myCluster);//создаем кластер на карте
                        placeMark.events.add("click", function (e) {
                            console.log(e);
                            //placeMark.balloon.open();
                        })
                        / myCluster.events.add("click", function (e) {
                            console.log(myCluster.getGeoObjects());
                        })
                    }
                }
            );
            myMap.options.set({
                balloonContentLayout: MyBalloonContentLayoutClass
            });
        };
        myMap.balloon.open(coords);
    })

    function addReview(element, form) {
        test = false;
        element.firstChild.style.display = "none";
        let p = document.createElement("p");
        p.id = "comment";
        p.innerHTML = form.elements[0].value + " " + form.elements[1].value + " " + form.elements[2].value + " " + getTime();
        element.appendChild(p);
    }
};

function getTime() {
    let date = new Date();
    return date.toLocaleString();
}







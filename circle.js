// объявяление тега и контекста
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

// опорные константы
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const radius = canvas.width / 2;
const sectorAngle = Math.PI / 2;

// круг по центру
const centerCircle = document.querySelector('.center-circle');

// массив данных о секторе
let simpleCircle;
let arraySectorsData = [];

// конструктор для данных круга
function SimpleCircle(spinCounter, arraySectorsData) {
    this.spinCounter = spinCounter;
    this.arraySectorsData = arraySectorsData;
}

// конструктор для данных сектора
function SectorData(id, X, Y, imgLink, color, num1, num2) {
    this.id = id;
    this.X = X;
    this.Y = Y;
    this.imgLink = imgLink;
    this.text = `${num1} : ${num2}`;
    this.color = color;
}

// Генерация случайного целого числа от min до max
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Читаем JSON и заполняем объекты
function readJSON() {
// Создаем новый объект XMLHttpRequest
    const xhr = new XMLHttpRequest();

// Открываем файл "data.json"
    xhr.open('GET', 'data.json');

// Устанавливаем заголовок Content-Type
    xhr.setRequestHeader('Content-Type', 'application/json');

// Обработчик загрузки файла
    xhr.onload = function() {
        // Если статус запроса успешный (код 200)
        if (xhr.status === 200) {
            // Парсим содержимое файла JSON в объект
            const json = JSON.parse(xhr.responseText);
            for (const obj of json["sectors"]) {
                let sectorData = new SectorData(obj.id, obj.X, obj.Y, obj.link, obj.color,getRandomInt(1, 10), getRandomInt(1, 10));
                arraySectorsData.push(sectorData);
            }
            console.log(arraySectorsData);
            simpleCircle = new SimpleCircle(json["spins_count"], arraySectorsData);
            console.log(simpleCircle);
            console.log(`Total spin count: ${simpleCircle.spinCounter}`);
        }
    };

// Отправляем запрос на сервер
    xhr.send();
}

// Пишем JSON
function writeJSON() {
    const data = {
        spins_count: simpleCircle.spinCounter,
        sectors: [
            {
                "id":    simpleCircle.arraySectorsData[0].id,
                "X":     simpleCircle.arraySectorsData[0].X,
                "Y":     simpleCircle.arraySectorsData[0].Y,
                "color": simpleCircle.arraySectorsData[0].color,
                "link":  simpleCircle.arraySectorsData[0].imgLink
            },
            {
                "id":    simpleCircle.arraySectorsData[1].id,
                "X":     simpleCircle.arraySectorsData[1].X,
                "Y":     simpleCircle.arraySectorsData[1].Y,
                "color": simpleCircle.arraySectorsData[1].color,
                "link":  simpleCircle.arraySectorsData[1].imgLink
            },
            {
                "id":   simpleCircle.arraySectorsData[2].id,
                "X":    simpleCircle.arraySectorsData[2].X,
                "Y":    simpleCircle.arraySectorsData[2].Y,
                "color":simpleCircle.arraySectorsData[2].color,
                "link": simpleCircle.arraySectorsData[2].imgLink
            },
            {
                "id":   simpleCircle.arraySectorsData[3].id,
                "X":    simpleCircle.arraySectorsData[3].X,
                "Y":    simpleCircle.arraySectorsData[3].Y,
                "color":simpleCircle.arraySectorsData[3].color,
                "link": simpleCircle.arraySectorsData[3].imgLink
            }
        ]
    };
    const jsonString = JSON.stringify(data, null, 4);
    console.log("JSON str:\n" + jsonString);
}

// Сопоставление пары x-y и пары startAngle-endAngle
function nextCoordinatesPair(x, y) {
    if(x === 1 && y === 1) return { X: 0, Y: 1 };
    if(x === 0 && y === 1) return { X: 0, Y: 0 };
    if(x === 0 && y === 0) return { X: 1, Y: 0 };
    if(x === 1 && y === 0) return { X: 1, Y: 1 };
}

// Сопоставление пары x-y и пары startAngle-endAngle
function translateCoordinates(x, y) {
    if(x === 1 && y === 1) return { startAngle: 0, endAngle: sectorAngle };
    if(x === 0 && y === 1) return { startAngle: sectorAngle, endAngle: 2 * sectorAngle };
    if(x === 0 && y === 0) return { startAngle: 2 * sectorAngle, endAngle: 3 * sectorAngle };
    if(x === 1 && y === 0) return { startAngle: 3 * sectorAngle, endAngle: 4 * sectorAngle };
}

// Закрасить круг
function fillCircleWhite() {
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius  + 1, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'white';
    ctx.fill();
}

// Отрисовка сектора, его картинки и текста внутри
function drawSector(X, Y, color, text, imgLink) {
    let sectorAngles = translateCoordinates(X, Y);
    let startAngle = sectorAngles["startAngle"];
    let endAngle = sectorAngles["endAngle"];
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, endAngle, false);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();

    ctx.fillStyle = '#000';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const textX = centerX + (radius / 2) * Math.cos((startAngle + endAngle) /  2);
    const textY = centerY + (radius / 2) * Math.sin((startAngle + endAngle) / 2) - 30;
    const imgX = centerX + (radius / 2) * Math.cos(startAngle + sectorAngle / 2) - 50 / 2;
    const imgY =  centerY + (radius / 2) * Math.sin(startAngle + sectorAngle / 2) - 50 / 2 + 10;
    ctx.fillText(text, textX, textY);
    const img = new Image();
    img.src = imgLink;
    img.onload = function() {
        ctx.drawImage(img, 0, 0, img.width, img.height, imgX, imgY, 50, 50);
    }
}

// Меняет координаты для поворота по часовой стрелке
function turnClockwise() {
    for (const sector of simpleCircle.arraySectorsData){
        let nextCoordinates = nextCoordinatesPair(sector.X, sector.Y);
        sector.X = nextCoordinates["X"];
        sector.Y = nextCoordinates["Y"];
    }
}

// Отрисовывает все сектора
function drawSectors() {
    for (const sector of simpleCircle.arraySectorsData)
        drawSector(sector.X, sector.Y, sector.color, sector.text, sector.imgLink);
}

// Функция для изменения порядка секторов при клике на центральный круг
function changeSectorsOrder() {
    fillCircleWhite();
    turnClockwise()
    drawSectors();
    ++simpleCircle.spinCounter;
    writeJSON();
}

centerCircle.addEventListener('click', changeSectorsOrder);


fillCircleWhite();
readJSON();
// даем время на чтение JSON
setTimeout(() => {
    drawSectors()
}, 10);
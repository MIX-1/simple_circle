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
let arraySectorsData = [];

// конструктор для данных сектора
function SectorData(imgLink, color, num1, num2) {
    this.imgLink = imgLink;
    this.text = `${num1} : ${num2}`;
    this.color = color;
}

// генерация случайного целого числа от min до max
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//читаем JSON и заполняем объекты
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
            for (const obj of json) {
                let sectorData = new SectorData(obj.link, obj.color,getRandomInt(1, 10), getRandomInt(1, 10));
                arraySectorsData.push(sectorData);
            }
            console.log(arraySectorsData)
        }
    };

// Отправляем запрос на сервер
    xhr.send();
}

// Закрасить круг
function fillCircleWhite() {
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius  + 1, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'white';
    ctx.fill();
}

// Отрисовка секторов и текста внутри них
function drawSector(startAngle, endAngle, color, text, imgLink) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, endAngle, false);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();

    ctx.fillStyle = '#000';
    ctx.font = '10px Arial';
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

function drawSectors() {
    drawSector(0, sectorAngle, arraySectorsData[0].color, arraySectorsData[0].text, arraySectorsData[0].imgLink);
    drawSector(sectorAngle, 2 * sectorAngle, arraySectorsData[1].color, arraySectorsData[1].text, arraySectorsData[1].imgLink);
    drawSector(2 * sectorAngle, 3 * sectorAngle, arraySectorsData[2].color, arraySectorsData[2].text, arraySectorsData[2].imgLink);
    drawSector(3 * sectorAngle, 4 * sectorAngle, arraySectorsData[3].color, arraySectorsData[3].text, arraySectorsData[3].imgLink);
}

// Функция для изменения порядка секторов при клике на центральный круг
function changeSectorsOrder() {
    fillCircleWhite();
    arraySectorsData.unshift(arraySectorsData.pop());
    drawSectors()
}

centerCircle.addEventListener('click', changeSectorsOrder);


fillCircleWhite();
readJSON();
// даем время на чтение JSON
setTimeout(() => {
    drawSectors()
}, 10);
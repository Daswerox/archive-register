// ===== Параметры URL =====
const urlParams = new URLSearchParams(window.location.search);
const filterShelf = urlParams.get('shelf');
const filterFloor = urlParams.get('floor');

// ===== Главный контейнер =====
const main = document.querySelector('main');
main.innerHTML = '';

// ===== Поиск =====
const searchInput = document.getElementById('search');
const searchBtn = document.getElementById('searchBtn');

// ===== Данные архива =====
let data = null;

// ===== Функция фильтрации и поиска с ? и * =====
function wildcardToRegExp(str) {
  if (!str) return /.*/;
  let escaped = str.replace(/[-\/\\^$+?.()|[\]{}]/g, '\\$&');
  escaped = escaped.replace(/\\\*/g, '.*');
  escaped = escaped.replace(/\\\?/g, '.');
  return new RegExp(escaped, 'i');
}

function filterData(query, shelfId, floorId) {
  const regex = wildcardToRegExp(query);

  const filteredShelves = data.shelves.map(shelf => {
    if (shelfId && shelf.id != shelfId) return null;
    const floors = shelf.floors.map(floor => {
      if (floorId && floor.id != floorId) return null;
      const boxes = floor.boxes.map(box => {
        const cases = box.cases.filter(c => regex.test(c));
        if (cases.length === 0) return null;
        return { ...box, cases };
      }).filter(b => b !== null);
      if (boxes.length === 0) return null;
      return { ...floor, boxes };
    }).filter(f => f !== null);
    if (floors.length === 0) return null;
    return { ...shelf, floors };
  }).filter(s => s !== null);

  return filteredShelves;
}

// ===== Отображение архива =====
function displayArchive(shelves) {
  main.innerHTML = '';
  main.appendChild(searchInput);
  main.appendChild(searchBtn);

  if (!shelves || shelves.length === 0) {
    const msg = document.createElement('p');
    msg.textContent = 'Ничего не найдено.';
    main.appendChild(msg);
    return;
  }

  shelves.forEach(shelf => {
    const shelfCard = document.createElement('div');
    shelfCard.className = 'card';
    const shelfHeader = document.createElement('h2');
    shelfHeader.textContent = shelf.name + ' (Полка ' + shelf.id + ')';
    shelfCard.appendChild(shelfHeader);

    const floorsContainer = document.createElement('div');
    floorsContainer.style.marginLeft = '15px';
    floorsContainer.style.display = 'block'; // по умолчанию открыто

    shelf.floors.forEach(floor => {
      const floorCard = document.createElement('div');
      floorCard.className = 'card';

      const floorHeader = document.createElement('h3');
      floorHeader.textContent = floor.name + ' (Этаж ' + floor.id + ')';
      floorCard.appendChild(floorHeader);

      const boxesContainer = document.createElement('div');
      boxesContainer.style.marginLeft = '15px';
      boxesContainer.style.display = 'block'; // открыто

      floor.boxes.forEach(box => {
        const boxCard = document.createElement('div');
        boxCard.className = 'card';

        const boxHeader = document.createElement('h4');
        boxHeader.textContent = box.name + ' (Короб ' + box.id + ')';
        boxCard.appendChild(boxHeader);

        const casesList = document.createElement('ul');
        casesList.style.display = 'block';

        box.cases.forEach(c => {
          const li = document.createElement('li');
          li.textContent = c;
          casesList.appendChild(li);
        });

        boxHeader.addEventListener('click', () => {
          casesList.style.display = casesList.style.display === 'none' ? 'block' : 'none';
        });

        boxCard.appendChild(casesList);
        boxesContainer.appendChild(boxCard);
      });

      floorHeader.addEventListener('click', () => {
        boxesContainer.style.display = boxesContainer.style.display === 'none' ? 'block' : 'none';
      });

      floorCard.appendChild(boxesContainer);
      floorsContainer.appendChild(floorCard);
    });

    shelfHeader.addEventListener('click', () => {
      floorsContainer.style.display = floorsContainer.style.display === 'none' ? 'block' : 'none';
    });

    shelfCard.appendChild(floorsContainer);
    main.appendChild(shelfCard);
  });
}

// ===== Кнопки полок =====
function filterByShelf(shelfId) {
  const result = filterData(searchInput.value, shelfId, null);
  displayArchive(result);
}

// ===== Поиск по кнопке =====
searchBtn.addEventListener('click', () => {
  const result = filterData(searchInput.value, filterShelf, filterFloor);
  displayArchive(result);
});

// ===== Загрузка JSON =====
fetch('data/archive.json')
  .then(res => res.json())
  .then(json => {
    data = json;
    const initial = filterData('', filterShelf, filterFloor);
    displayArchive(initial);
  })
  .catch(err => {
    main.innerHTML = `<p>Ошибка загрузки архива: ${err}</p>`;
  });

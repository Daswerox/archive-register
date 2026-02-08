// ===== Чтение параметров URL =====
const urlParams = new URLSearchParams(window.location.search);
const filterShelf = urlParams.get('shelf'); // номер полки
const filterFloor = urlParams.get('floor'); // номер этажа
const filterBox = urlParams.get('box'); // можно добавить отдельно коробку

// ===== Главный контейнер =====
const main = document.querySelector('main');
main.innerHTML = '';

// ===== Создаём поле поиска =====
const searchInput = document.createElement('input');
searchInput.id = 'search';
searchInput.placeholder = 'Поиск по архиву...';
searchInput.style.marginBottom = '20px';
main.appendChild(searchInput);

// ===== Загружаем JSON =====
fetch('data/archive.json')
  .then(response => response.json())
  .then(data => {

    // ===== Функция построения интерфейса =====
    function displayArchive(items) {
      main.innerHTML = ''; // очищаем
      main.appendChild(searchInput); // добавляем поиск

      if (!items || items.length === 0) {
        const msg = document.createElement('p');
        msg.textContent = 'Ничего не найдено.';
        main.appendChild(msg);
        return;
      }

      items.forEach(shelf => {
        const shelfCard = document.createElement('div');
        shelfCard.className = 'card';

        const shelfHeader = document.createElement('h2');
        shelfHeader.textContent = shelf.name + ' (Полка ' + shelf.id + ')';
        shelfCard.appendChild(shelfHeader);

        // показываем этажи сразу только если фильтруем по полке/этаже
        const floorsContainer = document.createElement('div');
        floorsContainer.style.marginLeft = '15px';

        shelf.floors.forEach(floor => {
          const floorCard = document.createElement('div');
          floorCard.className = 'card';

          const floorHeader = document.createElement('h3');
          floorHeader.textContent = floor.name + ' (Этаж ' + floor.id + ')';
          floorCard.appendChild(floorHeader);

          const boxesContainer = document.createElement('div');
          boxesContainer.style.marginLeft = '15px';

          floor.boxes.forEach(box => {
            const boxCard = document.createElement('div');
            boxCard.className = 'card';

            const boxHeader = document.createElement('h4');
            boxHeader.textContent = box.name + ' (Короб ' + box.id + ')';
            boxCard.appendChild(boxHeader);

            const casesList = document.createElement('ul');

            box.cases.forEach(c => {
              const li = document.createElement('li');
              li.textContent = c;
              casesList.appendChild(li);
            });

            boxCard.appendChild(casesList);
            boxesContainer.appendChild(boxCard);
          });

          floorCard.appendChild(boxesContainer);
          floorsContainer.appendChild(floorCard);
        });

        shelfCard.appendChild(floorsContainer);
        main.appendChild(shelfCard);
      });
    }

    // ===== Функция фильтрации =====
    function filterData(query, shelfId, floorId) {
      // сначала фильтруем по тексту
      const byText = data.shelves.map(shelf => {
        const cShelves = {
          id: shelf.id,
          name: shelf.name,
          floors: shelf.floors.map(floor => {
            const cFloors = {
              id: floor.id,
              name: floor.name,
              boxes: floor.boxes.map(box => {
                const cBoxes = {
                  id: box.id,
                  name: box.name,
                  cases: box.cases.filter(x => 
                    x.toLowerCase().includes(query.toLowerCase())
                  )
                };
                return cBoxes;
              }).filter(b => b.cases.length > 0)
            };
            return cFloors;
          }).filter(f => f.boxes.length > 0)
        };
        return cShelves;
      }).filter(s => s.floors.length > 0);

      // затем применяем фильтр уровней
      const byLevels = byText.map(shelf => {
        if (shelfId && shelf.id != shelfId) return null;
        return {
          ...shelf,
          floors: shelf.floors.map(floor => {
            if (floorId && floor.id != floorId) return null;
            return floor;
          }).filter(f => f !== null)
        };
      }).filter(s => s !== null);

      return byLevels;
    }

    // ===== Начальный показ на основе фильтра URL =====
    const initial = filterData('', filterShelf, filterFloor);
    displayArchive(initial);

    // ===== Поиск =====
    searchInput.addEventListener('input', () => {
      const q = searchInput.value.trim();
      const result = filterData(q, filterShelf, filterFloor);
      displayArchive(result);
    });

  })
  .catch(err => {
    main.innerHTML = `<p>Ошибка загрузки архива: ${err}</p>`;
  });

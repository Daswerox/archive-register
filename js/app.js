// ===== Получаем параметры URL для фильтрации =====
const urlParams = new URLSearchParams(window.location.search);
const filterShelf = urlParams.get('shelf'); // номер полки, если задан
const filterFloor = urlParams.get('floor'); // номер этажа, если задан

// ===== Получаем контейнер main =====
const main = document.querySelector('main');
main.innerHTML = '<p>Загрузка архива...</p>';

// ===== Загружаем JSON с данными =====
fetch('data/archive.json')
  .then(response => response.json())
  .then(data => {
    main.innerHTML = ''; // очищаем место для контента

    data.shelves.forEach(shelf => {
      // ===== Фильтрация по полке =====
      if (filterShelf && shelf.id != filterShelf) return;

      // ===== Создаём карточку полки =====
      const shelfCard = document.createElement('div');
      shelfCard.className = 'card';

      const shelfHeader = document.createElement('h2');
      shelfHeader.textContent = shelf.name;
      shelfHeader.style.cursor = 'pointer';
      shelfCard.appendChild(shelfHeader);

      // ===== Контейнер для этажей =====
      const floorsContainer = document.createElement('div');
      floorsContainer.style.display = filterShelf ? 'block' : 'none'; // если фильтр, показываем сразу
      floorsContainer.style.marginLeft = '20px';

      shelf.floors.forEach(floor => {
        // ===== Фильтрация по этажу =====
        if (filterFloor && floor.id != filterFloor) return;

        const floorCard = document.createElement('div');
        floorCard.className = 'card';

        const floorHeader = document.createElement('h3');
        floorHeader.textContent = floor.name;
        floorHeader.style.cursor = 'pointer';
        floorCard.appendChild(floorHeader);

        // ===== Контейнер для коробок =====
        const boxesContainer = document.createElement('div');
        boxesContainer.style.display = filterFloor ? 'block' : 'none';
        boxesContainer.style.marginLeft = '20px';

        floor.boxes.forEach(box => {
          const boxCard = document.createElement('div');
          boxCard.className = 'card';

          const boxHeader = document.createElement('h4');
          boxHeader.textContent = box.name;
          boxHeader.style.cursor = 'pointer';
          boxCard.appendChild(boxHeader);

          // ===== Список дел =====
          const casesList = document.createElement('ul');
          casesList.style.display = filterFloor ? 'block' : 'none';

          box.cases.forEach(c => {
            const li = document.createElement('li');
            li.textContent = c;
            casesList.appendChild(li);
          });

          // ===== Раскрытие дел по клику =====
          boxHeader.addEventListener('click', () => {
            casesList.style.display = casesList.style.display === 'none' ? 'block' : 'none';
          });

          boxCard.appendChild(casesList);
          boxesContainer.appendChild(boxCard);
        });

        // ===== Раскрытие коробок =====
        floorHeader.addEventListener('click', () => {
          boxesContainer.style.display = boxesContainer.style.display === 'none' ? 'block' : 'none';
        });

        floorCard.appendChild(boxesContainer);
        floorsContainer.appendChild(floorCard);
      });

      // ===== Раскрытие этажей =====
      shelfHeader.addEventListener('click', () => {
        floorsContainer.style.display = floorsContainer.style.display === 'none' ? 'block' : 'none';
      });

      shelfCard.appendChild(floorsContainer);
      main.appendChild(shelfCard);
    });

    // ===== Если фильтр по полке/этажу и нет данных =====
    if (!main.hasChildNodes()) {
      main.innerHTML = '<p>Нет данных для выбранной полки/этажа.</p>';
    }
  })
  .catch(err => {
    main.innerHTML = `<p>Ошибка загрузки архива: ${err}</p>`;
  });

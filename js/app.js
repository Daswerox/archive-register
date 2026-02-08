// Загружаем JSON и строим структуру
fetch('data/archive.json')
  .then(response => response.json())
  .then(data => {
    const main = document.querySelector('main');
    main.innerHTML = ''; // очищаем место для контента

    data.shelves.forEach(shelf => {
      // Создаём карточку полки
      const shelfCard = document.createElement('div');
      shelfCard.className = 'card';
      const shelfHeader = document.createElement('h2');
      shelfHeader.textContent = shelf.name;
      shelfHeader.style.cursor = 'pointer';
      shelfCard.appendChild(shelfHeader);

      // Контейнер для этажей
      const floorsContainer = document.createElement('div');
      floorsContainer.style.display = 'none';
      floorsContainer.style.marginLeft = '20px';

      shelf.floors.forEach(floor => {
        const floorCard = document.createElement('div');
        floorCard.className = 'card';
        const floorHeader = document.createElement('h3');
        floorHeader.textContent = floor.name;
        floorHeader.style.cursor = 'pointer';
        floorCard.appendChild(floorHeader);

        // Контейнер для коробок
        const boxesContainer = document.createElement('div');
        boxesContainer.style.display = 'none';
        boxesContainer.style.marginLeft = '20px';

        floor.boxes.forEach(box => {
          const boxCard = document.createElement('div');
          boxCard.className = 'card';
          const boxHeader = document.createElement('h4');
          boxHeader.textContent = box.name;
          boxHeader.style.cursor = 'pointer';
          boxCard.appendChild(boxHeader);

          const casesList = document.createElement('ul');
          casesList.style.display = 'none';
          box.cases.forEach(c => {
            const li = document.createElement('li');
            li.textContent = c;
            casesList.appendChild(li);
          });

          // Раскрытие дел
          boxHeader.addEventListener('click', () => {
            casesList.style.display = casesList.style.display === 'none' ? 'block' : 'none';
          });

          boxCard.appendChild(casesList);
          boxesContainer.appendChild(boxCard);
        });

        // Раскрытие коробок
        floorHeader.addEventListener('click', () => {
          boxesContainer.style.display = boxesContainer.style.display === 'none' ? 'block' : 'none';
        });

        floorCard.appendChild(boxesContainer);
        floorsContainer.appendChild(floorCard);
      });

      // Раскрытие этажей
      shelfHeader.addEventListener('click', () => {
        floorsContainer.style.display = floorsContainer.style.display === 'none' ? 'block' : 'none';
      });

      shelfCard.appendChild(floorsContainer);
      main.appendChild(shelfCard);
    });
  });

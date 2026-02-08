let archive = null;

// Загрузка данных
fetch('data/archive.json')
  .then(res => res.json())
  .then(json => {
    archive = json;
  })
  .catch(err => alert("Ошибка загрузки archive.json: " + err));

// ===== DOM =====
const actionSelect = document.getElementById('action');
const shelfInput = document.getElementById('shelfInput');
const floorInput = document.getElementById('floorInput');
const boxInput = document.getElementById('boxInput');
const caseInput = document.getElementById('caseInput');
const submitBtn = document.getElementById('submitBtn');
const exportBtn = document.getElementById('exportBtn');
const tableContainer = document.getElementById('tableContainer');

// ===== Добавление / редактирование =====
submitBtn.addEventListener('click', () => {
  const shelfName = shelfInput.value.trim();
  const floorName = floorInput.value.trim();
  const boxName = boxInput.value.trim();
  const casesText = caseInput.value.trim();
  const casesArray = casesText ? casesText.split(',').map(s => s.trim()) : [];

  if (!shelfName || !floorName || !boxName) {
    alert("Полка, этаж и коробка обязательны!");
    return;
  }

  // Найти или создать полку
  let shelf = archive.shelves.find(s => s.name === shelfName);
  if (!shelf) {
    if (actionSelect.value === 'add') {
      shelf = { id: archive.shelves.length + 1, name: shelfName, floors: [] };
      archive.shelves.push(shelf);
    } else {
      alert("Полка не найдена для редактирования");
      return;
    }
  }

  // Найти или создать этаж
  let floor = shelf.floors.find(f => f.name === floorName);
  if (!floor) {
    if (actionSelect.value === 'add') {
      floor = { id: shelf.floors.length + 1, name: floorName, boxes: [] };
      shelf.floors.push(floor);
    } else {
      alert("Этаж не найден для редактирования");
      return;
    }
  }

  // Найти или создать коробку
  let box = floor.boxes.find(b => b.name === boxName);
  if (!box) {
    if (actionSelect.value === 'add') {
      box = { id: floor.boxes.length + 1, name: boxName, cases: [] };
      floor.boxes.push(box);
    } else {
      alert("Коробка не найдена для редактирования");
      return;
    }
  }

  // Добавляем дела
  if (actionSelect.value === 'add') {
    box.cases.push(...casesArray);
  }

  // Очистка
  shelfInput.value = '';
  floorInput.value = '';
  boxInput.value = '';
  caseInput.value = '';

  alert("Данные обновлены (только в памяти, нужно экспортировать)");
});

// ===== Удаление =====
function deleteElement(level, parentObj, name) {
  if (!confirm(`Удалить ${level} "${name}" и все содержимое?`)) return;

  if (level === 'shelf') {
    archive.shelves = archive.shelves.filter(s => s.name !== name);
  } else if (level === 'floor') {
    parentObj.floors = parentObj.floors.filter(f => f.name !== name);
  } else if (level === 'box') {
    parentObj.boxes = parentObj.boxes.filter(b => b.name !== name);
  }
  alert(`${level} удалена`);
}

// ===== Экспорт таблицы =====
exportBtn.addEventListener('click', () => {
  let html = '<table><tr><th>Полка</th><th>Этаж</th><th>Коробка</th><th>Дело</th></tr>';
  archive.shelves.forEach(shelf => {
    shelf.floors.forEach(floor => {
      floor.boxes.forEach(box => {
        box.cases.forEach(c => {
          html += `<tr><td>${shelf.name}</td><td>${floor.name}</td><td>${box.name}</td><td>${c}</td></tr>`;
        });
      });
    });
  });
  html += '</table>';
  tableContainer.innerHTML = html;
});

let archive = null;
const shelfSelect = document.getElementById('shelfSelect');
const floorSelect = document.getElementById('floorSelect');
const boxSelect = document.getElementById('boxSelect');
const caseInput = document.getElementById('caseInput');
const submitBtn = document.getElementById('submitBtn');
const exportBtn = document.getElementById('exportBtn');
const tableContainer = document.getElementById('tableContainer');
const actionSelect = document.getElementById('action');

// ===== Загрузка данных =====
fetch('data/archive.json')
  .then(res => res.json())
  .then(json => {
    archive = json;
    updateSelects();
  })
  .catch(err => alert("Ошибка загрузки archive.json: " + err));

// ===== Обновление выпадающих списков =====
function updateSelects() {
  // Полки
  shelfSelect.innerHTML = '';
  archive.shelves.forEach(s => {
    const opt = document.createElement('option');
    opt.value = s.name;
    opt.textContent = s.name;
    shelfSelect.appendChild(opt);
  });
  const addOpt = document.createElement('option');
  addOpt.value = "__add__";
  addOpt.textContent = "Добавить полку";
  shelfSelect.appendChild(addOpt);

  updateFloors();
}

// ===== Фильтрация этажей по выбранной полке =====
function updateFloors() {
  const shelfName = shelfSelect.value;
  floorSelect.innerHTML = '';
  if(shelfName === "__add__") {
    floorSelect.style.display = "none";
    boxSelect.style.display = "none";
    return;
  } else {
    floorSelect.style.display = "block";
    boxSelect.style.display = "block";
  }
  const shelf = archive.shelves.find(s => s.name === shelfName);
  shelf.floors.forEach(f => {
    const opt = document.createElement('option');
    opt.value = f.name;
    opt.textContent = f.name;
    floorSelect.appendChild(opt);
  });
  const addOpt = document.createElement('option');
  addOpt.value = "__add__";
  addOpt.textContent = "Добавить этаж";
  floorSelect.appendChild(addOpt);

  updateBoxes();
}

// ===== Фильтрация коробок по выбранному этажу =====
function updateBoxes() {
  const shelfName = shelfSelect.value;
  const floorName = floorSelect.value;
  boxSelect.innerHTML = '';
  if(floorName === "__add__") return;

  const shelf = archive.shelves.find(s => s.name === shelfName);
  const floor = shelf.floors.find(f => f.name === floorName);
  floor.boxes.forEach(b => {
    const opt = document.createElement('option');
    opt.value = b.name;
    opt.textContent = b.name;
    boxSelect.appendChild(opt);
  });
  const addOpt = document.createElement('option');
  addOpt.value = "__add__";
  addOpt.textContent = "Добавить коробку";
  boxSelect.appendChild(addOpt);
}

// ===== Обработчики выбора добавления =====
shelfSelect.addEventListener('change', ()=> {
  if(shelfSelect.value === "__add__") {
    const name = prompt("Введите название новой полки");
    if(name) {
      archive.shelves.push({id: archive.shelves.length+1, name:name, floors:[]});
      updateSelects();
    }
  } else updateFloors();
});

floorSelect.addEventListener('change', ()=> {
  if(floorSelect.value === "__add__") {
    const shelf = archive.shelves.find(s => s.name === shelfSelect.value);
    const name = prompt("Введите название нового этажа");
    if(name) {
      shelf.floors.push({id:shelf.floors.length+1, name:name, boxes:[]});
      updateFloors();
    }
  } else updateBoxes();
});

boxSelect.addEventListener('change', ()=> {
  if(boxSelect.value === "__add__") {
    const shelf = archive.shelves.find(s => s.name === shelfSelect.value);
    const floor = shelf.floors.find(f => f.name === floorSelect.value);
    const name = prompt("Введите название новой коробки");
    if(name) {
      floor.boxes.push({id:floor.boxes.length+1, name:name, cases:[]});
      updateBoxes();
    }
  }
});

// ===== Добавление / редактирование =====
submitBtn.addEventListener('click', ()=> {
  const shelfName = shelfSelect.value;
  const floorName = floorSelect.value;
  const boxName = boxSelect.value;
  const casesText = caseInput.value.trim();
  const casesArray = casesText ? casesText.split(',').map(s=>s.trim()) : [];

  if(actionSelect.value === "add") {
    const shelf = archive.shelves.find(s => s.name===shelfName);
    const floor = shelf.floors.find(f => f.name===floorName);
    const box = floor.boxes.find(b => b.name===boxName);
    box.cases.push(...casesArray);
    alert("Данные добавлены");
  } else {
    const shelf = archive.shelves.find(s => s.name===shelfName);
    const floor = shelf.floors.find(f => f.name===floorName);
    const box = floor.boxes.find(b => b.name===boxName);
    if(confirm("Удалить все записи в коробке?")) {
      box.cases = [];
      alert("Содержимое удалено");
    }
  }
  caseInput.value = "";
});

// ===== Экспорт / таблица =====
exportBtn.addEventListener('click', ()=> {
  if(tableContainer.style.display === "block") {
    tableContainer.style.display = "none";
    return;
  }
  let html = "<table><tr><th>Полка</th><th>Этаж</th><th>Коробка</th><th>Содержимое</th></tr>";
  archive.shelves.forEach(s=>{
    s.floors.forEach(f=>{
      f.boxes.forEach(b=>{
        const content = b.cases.join(", ");
        html += `<tr><td>${s.name}</td><td>${f.name}</td><td>${b.name}</td><td>${content}</td></tr>`;
      });
    });
  });
  html += "</table>";
  tableContainer.innerHTML = html;
  tableContainer.style.display = "block";
});

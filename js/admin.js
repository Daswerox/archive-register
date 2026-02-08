// ===== Добавление =====
addBtn.addEventListener('click', ()=> {
  const shelfName = shelfSelect.value;
  const floorName = floorSelect.value;
  const boxName = boxSelect.value;
  const text = newCaseInput.value.trim();
  if(!text) {
    alert("Введите дело для добавления");
    return;
  }

  // Найти или создать структуру
  let shelf = archive.shelves.find(s=>s.name===shelfName);
  if(!shelf) { shelf={id:archive.shelves.length+1,name:shelfName,floors:[]}; archive.shelves.push(shelf); }

  let floor = shelf.floors.find(f=>f.name===floorName);
  if(!floor){ floor={id:shelf.floors.length+1,name:floorName,boxes:[]}; shelf.floors.push(floor); }

  let box = floor.boxes.find(b=>b.name===boxName);
  if(!box){ box={id:floor.boxes.length+1,name:boxName,cases:[]}; floor.boxes.push(box); }

  box.cases.push(text);
  newCaseInput.value="";
  renderCases();
  alert("Добавлено");
});

// ===== Редактирование =====
editBtn.addEventListener('click', ()=>{
  const shelfName = shelfSelect.value;
  const floorName = floorSelect.value;
  const boxName = boxSelect.value;

  const shelf = archive.shelves.find(s=>s.name===shelfName);
  if(!shelf){ alert("Полка не найдена"); return; }
  const floor = shelf.floors.find(f=>f.name===floorName);
  if(!floor){ alert("Этаж не найден"); return; }
  const box = floor.boxes.find(b=>b.name===boxName);
  if(!box){ alert("Коробка не найдена"); return; }

  // Выбираем запись для редактирования
  const oldVal = prompt("Введите текст для редактирования", box.cases[0]||"");
  if(oldVal!==null && box.cases.length>0){
    box.cases[0]=oldVal;
    renderCases();
    alert("Изменено");
  }
});

// ===== Удаление =====
deleteBtn.addEventListener('click', ()=>{
  const shelfName = shelfSelect.value;
  const floorName = floorSelect.value;
  const boxName = boxSelect.value;

  if(confirm("Удалить выбранную коробку и все дела внутри?")){
    const shelf = archive.shelves.find(s=>s.name===shelfName);
    if(!shelf) return;
    const floor = shelf.floors.find(f=>f.name===floorName);
    if(!floor) return;
    floor.boxes = floor.boxes.filter(b=>b.name!==boxName);
    renderCases();
    alert("Коробка удалена");
  }
});

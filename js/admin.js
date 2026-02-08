document.addEventListener("DOMContentLoaded", () => {

  let archive = null;
  const shelfSelect = document.getElementById('shelfSelect');
  const floorSelect = document.getElementById('floorSelect');
  const boxSelect = document.getElementById('boxSelect');
  const caseList = document.getElementById('caseList');
  const newCaseInput = document.getElementById('newCaseInput');
  const addCaseBtn = document.getElementById('addCaseBtn');
  const exportBtn = document.getElementById('exportBtn');
  const tableContainer = document.getElementById('tableContainer');

  if(!shelfSelect || !floorSelect || !boxSelect || !caseList){
    console.error("Не найдены элементы страницы. Проверьте HTML!");
    return;
  }

  // ===== Загрузка данных =====
  fetch('data/archive.json')
    .then(res => res.json())
    .then(json => {
      archive = json;
      updateShelfSelect();
    })
    .catch(err => alert("Ошибка загрузки archive.json: " + err));

  // ===== Функции =====
  function updateShelfSelect() {
    shelfSelect.innerHTML = '';
    archive.shelves.forEach(s => {
      const opt = document.createElement('option'); opt.value=s.name; opt.textContent=s.name;
      shelfSelect.appendChild(opt);
    });
    const addOpt = document.createElement('option'); addOpt.value="__add__"; addOpt.textContent="Добавить полку"; shelfSelect.appendChild(addOpt);
    updateFloorSelect();
  }

  function updateFloorSelect() {
    floorSelect.innerHTML='';
    const shelf = archive.shelves.find(s=>s.name===shelfSelect.value);
    if(!shelf) return;
    shelf.floors.forEach(f=>{
      const opt=document.createElement('option'); opt.value=f.name; opt.textContent=f.name; floorSelect.appendChild(opt);
    });
    const addOpt = document.createElement('option'); addOpt.value="__add__"; addOpt.textContent="Добавить этаж"; floorSelect.appendChild(addOpt);
    updateBoxSelect();
  }

  function updateBoxSelect(){
    boxSelect.innerHTML='';
    const shelf = archive.shelves.find(s=>s.name===shelfSelect.value);
    const floor = shelf?.floors.find(f=>f.name===floorSelect.value);
    if(!floor) return;
    floor.boxes.forEach(b=>{
      const opt=document.createElement('option'); opt.value=b.name; opt.textContent=b.name; boxSelect.appendChild(opt);
    });
    const addOpt = document.createElement('option'); addOpt.value="__add__"; addOpt.textContent="Добавить коробку"; boxSelect.appendChild(addOpt);
    renderCases();
  }

  // ===== Обновление при выборе "Добавить" =====
  shelfSelect.addEventListener('change', ()=>{
    if(shelfSelect.value==="__add__"){
      const name=prompt("Название новой полки:");
      if(name){ archive.shelves.push({id:archive.shelves.length+1,name:name,floors:[]}); updateShelfSelect(); }
    } else updateFloorSelect();
  });

  floorSelect.addEventListener('change', ()=>{
    if(floorSelect.value==="__add__"){
      const shelf = archive.shelves.find(s=>s.name===shelfSelect.value);
      const name=prompt("Название нового этажа:");
      if(name){ shelf.floors.push({id:shelf.floors.length+1,name:name,boxes:[]}); updateFloorSelect(); }
    } else updateBoxSelect();
  });

  boxSelect.addEventListener('change', ()=>{
    if(boxSelect.value==="__add__"){
      const shelf = archive.shelves.find(s=>s.name===shelfSelect.value);
      const floor = shelf.floors.find(f=>f.name===floorSelect.value);
      const name=prompt("Название новой коробки:");
      if(name){ floor.boxes.push({id:floor.boxes.length+1,name:name,cases:[]}); updateBoxSelect(); }
    } else renderCases();
  });

  // ===== Рендер содержимого коробки =====
  function renderCases(){
    caseList.innerHTML='';
    const shelf = archive.shelves.find(s=>s.name===shelfSelect.value);
    const floor = shelf?.floors.find(f=>f.name===floorSelect.value);
    const box = floor?.boxes.find(b=>b.name===boxSelect.value);
    if(!box) return;

    box.cases.forEach((c,i)=>{
      const div=document.createElement('div'); div.className="case-item";

      const input=document.createElement('input'); input.value=c;
      input.addEventListener('change', ()=>{ box.cases[i]=input.value; });

      const editBtn=document.createElement('button'); editBtn.textContent="Ред."; editBtn.className="edit-btn";
      editBtn.addEventListener('click', ()=>{ const newVal=prompt("Редактировать дело", box.cases[i]); if(newVal!==null){ box.cases[i]=newVal; renderCases(); } });

      const delBtn=document.createElement('button'); delBtn.textContent="Удал."; delBtn.className="delete-btn";
      delBtn.addEventListener('click', ()=>{ if(confirm("Удалить запись?")){ box.cases.splice(i,1); renderCases(); } });

      div.appendChild(input); div.appendChild(editBtn); div.appendChild(delBtn);
      caseList.appendChild(div);
    });
  }

  // ===== Добавление нового дела =====
  addCaseBtn.addEventListener('click', ()=>{
    const shelf = archive.shelves.find(s=>s.name===shelfSelect.value);
    const floor = shelf?.floors.find(f=>f.name===floorSelect.value);
    const box = floor?.boxes.find(b=>b.name===boxSelect.value);
    if(!box) return;
    const text=newCaseInput.value.trim(); if(!text) return;
    box.cases.push(text);
    newCaseInput.value='';
    renderCases();
  });

  // ===== Экспорт таблицы =====
  exportBtn.addEventListener('click', ()=>{
    if(tableContainer.style.display==="block"){ tableContainer.style.display="none"; return; }
    let html="<table><tr><th>Полка</th><th>Этаж</th><th>Коробка</th><th>Содержимое</th></tr>";
    archive.shelves.forEach(s=>{
      s.floors.forEach(f=>{
        f.boxes.forEach(b=>{
          const content=b.cases.join(", ");
          html+=`<tr><td>${s.name}</td><td>${f.name}</td><td>${b.name}</td><td>${content}</td></tr>`;
        });
      });
    });
    html+="</table>";
    tableContainer.innerHTML=html;
    tableContainer.style.display="block";
  });

}); // DOMContentLoaded

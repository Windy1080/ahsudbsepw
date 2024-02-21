// import eventManager from '../utils/eventManager';

function loadInventory() {
  fetch('/api/inventory')
    .then(response => response.json())
    .then(data => {
      // console.log('Loading data from database ... Data: ', data);
      populateTableWithData(data);
    })
    .catch(error => console.error('Error fetching inventory:', error));
}

async function deleteEntry(id, row) {
  try {
    const response = await fetch(`/api/deleteEntry/${id}`, { method: 'DELETE' });
    if (response.ok) {
      // Entfernen der Zeile aus der Tabelle
      row.remove();
    } else {
      throw new Error('Fehler beim Löschen des Eintrags');
    }
  } catch (error) {
    console.error('Fehler beim Löschen des Eintrags:', error);
  }
}


// Funktion, um Daten in die Tabelle einzufügen
function populateTableWithData(data) {

  // Sortieren der Daten nach process_id und process
  data.sort((a, b) => {
    // Zuerst nach process_id sortieren
    if (a.process_id < b.process_id) {
      return -1;
    }
    if (a.process_id > b.process_id) {
      return 1;
    }

    // Wenn process_id gleich ist, dann nach process sortieren
    if (a.process < b.process) {
      return -1;
    }
    if (a.process > b.process) {
      return 1;
    }

    return 0;
  });

  let open_processes_cell_ids = [];
  let old_pid = data[0].process_id;
  let roasted_idxs = []
  let roasted_volume = 0
  let packing_total_volume = 0;
  data.forEach((row, idx) => {
    let new_pid = row.process_id;

    if (row.process == 'röstkaffee') {

      roasted_volume += parseFloat(row.total);

      if (!(roasted_idxs.includes(idx))) {

        roasted_idxs.push(idx);
      }
    }

    if (row.process == 'verpackung') {

      packing_total_volume += parseFloat(row.total);
    }

    if ((new_pid != old_pid) || (row == data[data.length - 1])) {

      if (packing_total_volume != roasted_volume) {

        console.error('ERROR in process with p_id:', old_pid, '!');
        let mes = {
          [`Process #${old_pid}`]: {
            packingVolume: packing_total_volume,
            roastedVolume: roasted_volume,
          },
        };
        console.table(mes);
        console.warn('Total packing volume:', packing_total_volume, '< roasted volume:', roasted_volume);
        console.log('Please make sure, to finish process', `#${old_pid}.`, 'Add item with \'process\'-attribute \'röstkaffee\'.\n')
        open_processes_cell_ids = open_processes_cell_ids.concat(roasted_idxs);
      }
      
      roasted_volume = 0;
      packing_total_volume = 0;
      roasted_idxs = [];
      old_pid = new_pid;
    }
  });

  const tableBody = document.getElementById("inventarListe");
  tableBody.innerHTML = ''; // Bestehende Zeilen löschen

  data.forEach((item, idx) => {
    const row = tableBody.insertRow();
    row.insertCell(0).textContent = item.process_id;
    row.insertCell(1).textContent = item.process;
    row.insertCell(2).textContent = item.item;
    row.insertCell(3).textContent = item.amount;
    row.insertCell(4).textContent = item.package_size;
    row.insertCell(5).textContent = item.total;
    row.insertCell(6).textContent = item.unit;
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Löschen';
    deleteButton.onclick = () => deleteEntry(item.id, row);
    row.insertCell(7).appendChild(deleteButton);
    // Weitere Zellen oder Aktionen können hier hinzugefügt werden

    if (open_processes_cell_ids.includes(idx)) {
      for (let i = 0; i < row.cells.length; i++) {
        row.cells[i].classList.add('open-process');
      }
    }
  });
}

async function insertEntryInDatabase(process_id, process, item, amount, package_size, unit) {
  try {
    const response = await fetch('/api/insertEntry', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ process_id, process, item, amount, package_size, unit }),
    });

    if (response.ok) {
      // Eintrag erfolgreich in der Datenbank erstellt
      return response.json();
    } else {
      // Fehler beim Erstellen des Eintrags in der Datenbank
      throw new Error('Fehler beim Erstellen des Eintrags',);
    }
  } catch (error) {
    console.error('Fehler beim Einfügen in die Datenbank!!!!:', error);
  }
}

let isButtonEnabled = true; // Eine Variable zur Verfolgung, ob der Button aktiv ist

function neuerEintragHinzufuegen() {
  // tabelle.innerHTML = '';
  // loadInventory();
  const tabelle = document.getElementById("inventarListe");
  const zeile = tabelle.insertRow(-1);
  const process_id_cell = zeile.insertCell(0);
  const process_cell = zeile.insertCell(1);
  const item_cell = zeile.insertCell(2);
  const amount_cell = zeile.insertCell(3);
  const pacakge_size_cell = zeile.insertCell(4);
  const total_cell = zeile.insertCell(5);
  const unit_cell = zeile.insertCell(6);

  process_id_cell.innerHTML = '<input type="num" placeholder="Prozess ID">';
  process_cell.innerHTML = `<select>
                                <option value="rohkaffee" selected>Rohkaffee</option>
                                <option value="röstkaffee">Röstkaffee</option>
                                <option value="verpackung">Verpackung</option>
                            </select>`;
  item_cell.innerHTML = '<input type="text" placeholder="Warenbezeichnung">';
  amount_cell.innerHTML = '<input type="number" placeholder="Menge">';
  pacakge_size_cell.innerHTML = '<input type="num" placeholder="Verpackungsvolumen">';
  unit_cell.innerHTML = '<input type="text" placeholder="Einheit">';

  // Hinzufügen eines Buttons zum Hinzufügen des Eintrags in die Datenbank
  const addButton = document.createElement('button');
  addButton.textContent = 'Speichern';

  addButton.addEventListener('click', () => {
    if (!isButtonEnabled) {
      // Wenn der Button deaktiviert ist, verlassen Sie die Funktion, um mehrfache Klicks zu verhindern
      return;
    }

    // Deaktivieren Sie den Button, um mehrfache Klicks zu verhindern
    isButtonEnabled = false;

    const process_id = parseInt(process_id_cell.querySelector('input').value);
    const process = process_cell.querySelector('select').value;
    const item = item_cell.querySelector('input').value;
    const amount = parseFloat(amount_cell.querySelector('input').value);
    const package_size = parseFloat(pacakge_size_cell.querySelector('input').value);
    const unit = unit_cell.querySelector('input').value;



    // Übergeben Sie die Daten an die Funktion zur Einfügung in die Datenbank
    insertEntryInDatabase(process_id, process, item, amount, package_size, unit)
      .then((response) => {
        // Hier können Sie die Rückgabe verarbeiten, z.B. Benachrichtigung anzeigen
        console.log('Eintrag erfolgreich in die Datenbank eingefügt:', response);

        let data = [process_id, process, item, amount, package_size, unit];

        // console.log('data: ', data)
        for (let i = 0; i < 5; i++) {
          let cell = zeile.cells[i];
          if (cell.children[0].tagName === 'INPUT' || cell.children[0].tagName === 'SELECT') {
            cell.textContent = data[i];
          }
        }
        zeile.cells[6].textContent = data[5]

        zeile.cells[7].removeChild(addButton);

        // Aktivieren Sie den Button nach erfolgreicher Verarbeitung wieder
        isButtonEnabled = true;
      })
      .catch((error) => {
        console.error('Fehler beim Einfügen in die Datenbank:', req.body);
        // Senden Sie eine Fehlerantwort
        res.status(500).json({ error: 'Eintrag konnte nicht in die Datenbank eingefügt werden' });

        // Aktivieren Sie den Button, um erneute Versuche zu ermöglichen
        isButtonEnabled = true;
      });
  });

  zeile.insertCell(7).appendChild(addButton); // Button hinzufügen

  // Fügen Sie die Event Listener für die Input-Felder hinzu
  amount_cell.querySelector('input').addEventListener('input', () => {
    updateTotalPrice(amount_cell.querySelector('input'));
  });

  pacakge_size_cell.querySelector('input').addEventListener('input', () => {
    updateTotalPrice(item_cell.querySelector('input'));
  });
}

function updateTotalPrice(element) {
  const currentRow = element.parentElement.parentElement;
  const menge = currentRow.cells[3].querySelector('input').value;
  const preis = currentRow.cells[4].querySelector('input').value;



  const gesamt = menge * preis;
  currentRow.cells[5].innerHTML = gesamt.toFixed(2); // Runden auf zwei Dezimalstellen
}

function initTable() {
  // Stellen Sie sicher, dass ein Container mit der ID 'content' in Ihrer index.html vorhanden ist
  const container = document.getElementById('content');
  container.innerHTML = createTable();
  loadInventory();
}

function createTable() {
  const tableHtml = `
        <div class="container">
            <h2>Inventarliste</h2>
            <table class="table table-info">
                <thead>
                    <tr>
                        <th>Prozess ID</th>
                        <th>Prozess</th>
                        <th>Warenbezeichnung</th>
                        <th>Anzahl</th>
                        <th>Packungsgröße</th>
                        <th>Gesamtvolumen</th>
                        <th>Einheit</th>
                        <th>Aktion</th>
                    </tr>
                </thead>
                <tbody id="inventarListe">
                    <!-- Einträge werden hier hinzugefügt -->
                </tbody>
            </table>
            <button id="neuerEintragButton" onclick="neuerEintragHinzufuegen()">Neuer Eintrag</button>
        </div>
    `;

  return tableHtml;
}

window.neuerEintragHinzufuegen = neuerEintragHinzufuegen;
export { initTable };
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import './styles/main.css';

import { initTable } from './components/tablecomponent';
import { initImpressum } from './components/impressum';
import { initPrivacy } from './components/privacy';
document.getElementById('inventurLink').addEventListener('click', (event) => {
    event.preventDefault();
    initTable(); // Ruft initTable auf, um die Tabelle zu initialisieren
});

document.getElementById('impressumLink').addEventListener('click', (event) => {
    event.preventDefault();
    initImpressum(); // Ruft initImpressum auf, um das Impressum zu laden
});
document.getElementById('privacyLink').addEventListener('click', (event) => {
    event.preventDefault();
    initPrivacy(); // Ruft initImpressum auf, um das Impressum zu laden
});
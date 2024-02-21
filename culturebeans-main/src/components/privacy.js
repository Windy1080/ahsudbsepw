function initPrivacy() {
    // Inhalt für die Datenschutzerklärung erstellen und ins DOM einfügen
    const content = document.getElementById('content');
    content.innerHTML = /*html*/`
        <div style="width: 50%; margin: 0 auto 0 auto; text-align: left;">
            <div class="row mt-5 mb-5">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Datenschutzerklärung</h5>
                        <p>Die Datenschutzerklärung gilt für Apps, die von mir entwickelt wurden. Diese Apps können personenbezogene Daten speichern, jedoch werden keine Daten von mir als Entwickler gesammelt oder gespeichert. Die Verantwortung für die Sicherheit und Verarbeitung dieser Daten liegt bei den Nutzern der Apps.</p>
                        <p>Nutzer, die diese Apps verwenden, sind dafür verantwortlich, eigene Datenschutzbestimmungen zu erstellen und die Einhaltung aller relevanten Datenschutzgesetze sicherzustellen.</p>
                        <p>Bei Fragen zur Handhabung personenbezogener Daten in diesen Apps kontaktieren Sie bitte direkt den Nutzer der App.</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

export { initPrivacy };

function initImpressum() {
    // Hier den Inhalt für das Impressum erstellen und ins DOM einfügen
    const content = document.getElementById('content');
    content.innerHTML = /*html*/`
                            <div style="width: 50%; margin: 0 auto 0 auto; text-align: left;">
                                <div class="row mt-5 mb-5">
                                    <div class="card">
                                        <div class="card-body">
                                            <h5 class="card-title">Impressum</h5>
                                            <p>Paul Fritz Nathan Barthel</p>
                                            <p>Frankfurt am Main</p>
                                            <p>Email: paul.barthel@robo-studio.de</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="card">
                                        <div class="card-body">
                                            <h5 class="card-title">Urheberrecht und Nutzungsrechte</h5>
                                            <p>Die von mir entwickelten Apps sowie die zugehörigen Inhalte 
                                            sind urheberrechtlich geschützt. Jegliche kommerzielle Nutzung, 
                                            Vervielfältigung, Bearbeitung, Verbreitung und jede Art der 
                                            Verwertung außerhalb der Grenzen des Urheberrechts bedürfen 
                                            meiner vorherigen schriftlichen Zustimmung.</p>
                                            <p>Die bereitgestellten Apps sind ausschließlich für den 
                                            privaten, nicht-kommerziellen Gebrauch bestimmt. Durch den 
                                            Download oder die Nutzung der Apps wird keine Lizenz oder 
                                            Rechte an den Inhalten oder geistigem Eigentum übertragen.</p>
                                            <p>Ich übernehme keine Haftung für Missbrauch oder Nutzung 
                                            der Apps, die gegen diese Nutzungsbedingungen verstoßen.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `;
}

export { initImpressum };
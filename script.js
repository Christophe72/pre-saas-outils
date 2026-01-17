// Modal Management
function openTool(toolId) {
    document.getElementById(toolId).style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeTool(toolId) {
    document.getElementById(toolId).style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const modals = document.querySelectorAll('.tool-modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
});

// Validation helper function
function validatePositiveNumber(value, resultDiv, errorMessage = 'Veuillez entrer des valeurs valides et positives.') {
    if (isNaN(value) || value <= 0) {
        resultDiv.innerHTML = `<p style="color: #ef4444;">${errorMessage}</p>`;
        resultDiv.className = 'result show warning';
        return false;
    }
    return true;
}

// Power Calculator
function calculatePower() {
    const voltage = parseFloat(document.getElementById('voltage').value);
    const current = parseFloat(document.getElementById('current').value);
    const resultDiv = document.getElementById('power-result');

    if (!validatePositiveNumber(voltage, resultDiv) || !validatePositiveNumber(current, resultDiv)) {
        return;
    }

    const power = voltage * current;
    const powerKW = (power / 1000).toFixed(2);

    resultDiv.innerHTML = `
        <h4>Résultats du calcul</h4>
        <div class="result-highlight">Puissance: ${power.toFixed(2)} W (${powerKW} kW)</div>
        <p><strong>Formule utilisée:</strong> P = U × I</p>
        <p><strong>Tension:</strong> ${voltage} V</p>
        <p><strong>Courant:</strong> ${current} A</p>
        <p><strong>Puissance apparente:</strong> ${power.toFixed(2)} VA</p>
    `;
    resultDiv.className = 'result show success';
}

// Cable Sizer Calculator
function calculateCableSize() {
    const current = parseFloat(document.getElementById('cable-current').value);
    const typeSelect = document.getElementById('cable-type');
    const typeCoef = parseFloat(typeSelect.value);
    const resultDiv = document.getElementById('cable-result');

    if (!validatePositiveNumber(current, resultDiv, 'Veuillez entrer un courant valide.')) {
        return;
    }

    // Cable sizing table (simplified for demonstration)
    const cableSizes = [
        { section: 1.5, maxCurrent: 16 },
        { section: 2.5, maxCurrent: 21 },
        { section: 4, maxCurrent: 27 },
        { section: 6, maxCurrent: 35 },
        { section: 10, maxCurrent: 46 },
        { section: 16, maxCurrent: 61 },
        { section: 25, maxCurrent: 80 },
        { section: 35, maxCurrent: 99 },
        { section: 50, maxCurrent: 119 }
    ];

    const adjustedCurrent = current * typeCoef;
    let recommendedCable = cableSizes.find(cable => cable.maxCurrent >= adjustedCurrent);

    if (!recommendedCable) {
        resultDiv.innerHTML = '<p style="color: #ef4444;">Courant trop élevé. Consultez un professionnel.</p>';
        resultDiv.className = 'result show warning';
        return;
    }

    resultDiv.innerHTML = `
        <h4>Section de câble recommandée</h4>
        <div class="result-highlight">${recommendedCable.section} mm²</div>
        <p><strong>Courant nominal:</strong> ${current} A</p>
        <p><strong>Courant ajusté (avec facteurs):</strong> ${adjustedCurrent.toFixed(2)} A</p>
        <p><strong>Courant max du câble:</strong> ${recommendedCable.maxCurrent} A</p>
        <p><strong>Type d'installation:</strong> ${typeSelect.options[typeSelect.selectedIndex].text}</p>
        <p style="margin-top: 1rem; font-size: 0.9rem; color: #6b7280;">
            ⚠️ Ces valeurs sont indicatives. Consultez la norme NFC 15-100 pour votre projet spécifique.
        </p>
    `;
    resultDiv.className = 'result show success';
}

// Energy Cost Calculator
function calculateEnergyCost() {
    const power = parseFloat(document.getElementById('equipment-power').value);
    const hoursPerDay = parseFloat(document.getElementById('usage-hours').value);
    const pricePerKWh = parseFloat(document.getElementById('energy-price').value);
    const resultDiv = document.getElementById('energy-result');

    if (!validatePositiveNumber(power, resultDiv) || 
        !validatePositiveNumber(hoursPerDay, resultDiv) || 
        !validatePositiveNumber(pricePerKWh, resultDiv)) {
        return;
    }

    if (hoursPerDay > 24) {
        resultDiv.innerHTML = '<p style="color: #ef4444;">Les heures d\'utilisation ne peuvent pas dépasser 24h par jour.</p>';
        resultDiv.className = 'result show warning';
        return;
    }

    const dailyConsumption = (power / 1000) * hoursPerDay; // kWh per day
    const monthlyConsumption = dailyConsumption * 30;
    const yearlyConsumption = dailyConsumption * 365;

    const dailyCost = dailyConsumption * pricePerKWh;
    const monthlyCost = monthlyConsumption * pricePerKWh;
    const yearlyCost = yearlyConsumption * pricePerKWh;

    resultDiv.innerHTML = `
        <h4>Estimation des coûts énergétiques</h4>
        <div style="background: white; padding: 1rem; border-radius: 8px; margin: 1rem 0;">
            <p><strong>Consommation quotidienne:</strong> ${dailyConsumption.toFixed(2)} kWh</p>
            <p><strong>Coût quotidien:</strong> ${dailyCost.toFixed(2)} €</p>
        </div>
        <div style="background: white; padding: 1rem; border-radius: 8px; margin: 1rem 0;">
            <p><strong>Consommation mensuelle:</strong> ${monthlyConsumption.toFixed(2)} kWh</p>
            <p><strong>Coût mensuel:</strong> <span style="color: #f59e0b; font-size: 1.2rem; font-weight: bold;">${monthlyCost.toFixed(2)} €</span></p>
        </div>
        <div style="background: white; padding: 1rem; border-radius: 8px; margin: 1rem 0;">
            <p><strong>Consommation annuelle:</strong> ${yearlyConsumption.toFixed(2)} kWh</p>
            <p><strong>Coût annuel:</strong> <span style="color: #2563eb; font-size: 1.3rem; font-weight: bold;">${yearlyCost.toFixed(2)} €</span></p>
        </div>
        <p style="margin-top: 1rem; font-size: 0.9rem; color: #6b7280;">
            💡 Basé sur ${hoursPerDay}h d'utilisation par jour à ${pricePerKWh}€/kWh
        </p>
    `;
    resultDiv.className = 'result show success';
}

// Voltage Drop Calculator
function calculateVoltageDrop() {
    const current = parseFloat(document.getElementById('drop-current').value);
    const length = parseFloat(document.getElementById('cable-length').value);
    const section = parseFloat(document.getElementById('cable-section').value);
    const voltage = parseFloat(document.getElementById('supply-voltage').value);
    const resultDiv = document.getElementById('voltage-drop-result');

    if (!validatePositiveNumber(current, resultDiv) || 
        !validatePositiveNumber(length, resultDiv) || 
        !validatePositiveNumber(section, resultDiv) || 
        !validatePositiveNumber(voltage, resultDiv)) {
        return;
    }

    // Copper resistivity at 20°C: 0.01724 Ω·mm²/m
    const rho = 0.01724;
    
    // Calculate resistance: R = ρ × L / S (for one-way, need to multiply by 2 for round trip)
    const resistance = (rho * length * 2) / section;
    
    // Calculate voltage drop: ΔU = R × I
    const voltageDrop = resistance * current;
    
    // Calculate percentage drop
    const dropPercentage = (voltageDrop / voltage) * 100;
    
    // Determine if it's acceptable (< 3% for lighting, < 5% for power)
    let status, statusClass, recommendation;
    
    if (dropPercentage <= 3) {
        status = "✅ Conforme (excellent)";
        statusClass = "success";
        recommendation = "La chute de tension est acceptable pour tous types de circuits.";
    } else if (dropPercentage <= 5) {
        status = "⚠️ Acceptable pour circuits de puissance";
        statusClass = "warning";
        recommendation = "Convient pour les circuits de puissance, mais peut être trop élevé pour l'éclairage.";
    } else {
        status = "❌ Non conforme";
        statusClass = "warning";
        recommendation = "La chute de tension est trop élevée. Augmentez la section du câble ou réduisez la longueur.";
    }

    const finalVoltage = voltage - voltageDrop;

    resultDiv.innerHTML = `
        <h4>Résultats du calcul de chute de tension</h4>
        <div class="result-highlight">Chute de tension: ${voltageDrop.toFixed(2)} V (${dropPercentage.toFixed(2)}%)</div>
        <p><strong>Statut:</strong> ${status}</p>
        <p><strong>Tension finale:</strong> ${finalVoltage.toFixed(2)} V</p>
        <p><strong>Résistance du câble:</strong> ${resistance.toFixed(4)} Ω</p>
        <hr style="margin: 1rem 0; border: none; border-top: 1px solid #e5e7eb;">
        <p><strong>Paramètres:</strong></p>
        <p>• Courant: ${current} A</p>
        <p>• Longueur: ${length} m</p>
        <p>• Section: ${section} mm²</p>
        <p>• Tension d'alimentation: ${voltage} V</p>
        <hr style="margin: 1rem 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="margin-top: 1rem;"><strong>Recommandation:</strong></p>
        <p>${recommendation}</p>
        <p style="margin-top: 1rem; font-size: 0.9rem; color: #6b7280;">
            📋 Selon la norme NFC 15-100: max 3% pour l'éclairage, max 5% pour autres usages
        </p>
    `;
    resultDiv.className = `result show ${statusClass}`;
}

// Add keyboard support for Enter key
document.addEventListener('DOMContentLoaded', function() {
    // Power calculator
    document.getElementById('voltage')?.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') calculatePower();
    });
    document.getElementById('current')?.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') calculatePower();
    });

    // Cable sizer
    document.getElementById('cable-current')?.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') calculateCableSize();
    });

    // Energy cost
    document.getElementById('energy-price')?.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') calculateEnergyCost();
    });

    // Voltage drop
    document.getElementById('supply-voltage')?.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') calculateVoltageDrop();
    });
});

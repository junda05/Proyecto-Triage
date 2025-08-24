document.addEventListener('DOMContentLoaded', function() {
    // Variables
    const screens = document.querySelectorAll('.screen');
    const progressBar = document.getElementById('progress-bar');
    const totalScreens = screens.length;
    let currentScreen = 1;
    let patientData = {};

    // Theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.addEventListener('click', function() {
        document.documentElement.classList.toggle('dark');
    });

    // Update progress bar
    function updateProgressBar() {
        const progress = ((currentScreen - 1) / (totalScreens - 1)) * 100;
        progressBar.style.width = `${progress}%`;
    }

    // Show screen
    function showScreen(screenNumber) {
        screens.forEach((screen, index) => {
            if (index + 1 === screenNumber) {
                screen.classList.add('active');
            } else {
                screen.classList.remove('active');
            }
        });
        currentScreen = screenNumber;
        updateProgressBar();
    }

    // Generate reference number
    function generateReferenceNumber() {
        const prefix = 'PRE';
        const randomNum = Math.floor(10000 + Math.random() * 90000);
        return `${prefix}-${randomNum}`;
    }

    // Start button
    document.getElementById('start-button').addEventListener('click', function() {
        showScreen(2);
    });

    // Role selection
    document.getElementById('patient-role').addEventListener('click', function() {
        showScreen(3);
    });

    // Staff role - Modified to navigate to new medical panel instead of showing alert
    document.getElementById('staff-role').addEventListener('click', function() {
        showScreen(8);
        initializeMedicalStaffPanel(); // Initialize the medical staff panel
    });

    // Back to role selection
    document.getElementById('back-to-role').addEventListener('click', function() {
        showScreen(2);
    });

    // Back to role selection from staff panel
    if (document.getElementById('back-to-role-staff')) {
        document.getElementById('back-to-role-staff').addEventListener('click', function() {
            showScreen(2);
        });
    }

    // Back to basic data
    document.getElementById('back-to-basic').addEventListener('click', function() {
        showScreen(3);
    });

    // Back to medical history
    document.getElementById('back-to-history').addEventListener('click', function() {
        showScreen(4);
    });

    // Back to symptoms
    document.getElementById('back-to-symptoms').addEventListener('click', function() {
        showScreen(5);
    });

    // Restart button
    document.getElementById('restart-button').addEventListener('click', function() {
        showScreen(1);
        // Reset forms
        document.getElementById('basic-data-form').reset();
        document.getElementById('medical-history-form').reset();
        document.getElementById('symptoms-form').reset();
        document.getElementById('dynamic-form').reset();
        document.getElementById('selected-allergies').innerHTML = '';
        document.getElementById('selected-conditions').innerHTML = '';
        document.getElementById('high-risk-alert').classList.add('hidden');
        document.getElementById('pregnancy-question').classList.add('hidden');
    });

    // Calculate age from birthdate
    document.getElementById('birthdate').addEventListener('change', function() {
        const birthdate = new Date(this.value);
        const today = new Date();
        let age = today.getFullYear() - birthdate.getFullYear();
        const monthDiff = today.getMonth() - birthdate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthdate.getDate())) {
            age--;
        }
        
        document.getElementById('age').value = age;
        
        // Show high risk alert if age >= 65
        if (age >= 65) {
            document.getElementById('high-risk-alert').classList.remove('hidden');
        } else {
            document.getElementById('high-risk-alert').classList.add('hidden');
        }
    });

    // Show pregnancy question if female is selected
    document.querySelectorAll('input[name="sex"]').forEach(function(radio) {
        radio.addEventListener('change', function() {
            if (this.value === 'female') {
                document.getElementById('pregnancy-question').classList.remove('hidden');
            } else {
                document.getElementById('pregnancy-question').classList.add('hidden');
            }
        });
    });

    // Form validation for basic data
    const basicDataForm = document.getElementById('basic-data-form');
    const registerButton = document.getElementById('register-button');
    
    function validateBasicDataForm() {
        const fullname = document.getElementById('fullname').value;
        const birthdate = document.getElementById('birthdate').value;
        const docType = document.getElementById('docType').value;
        const docNumber = document.getElementById('docNumber').value;
        const sex = document.querySelector('input[name="sex"]:checked');
        const emergencyContactName = document.getElementById('emergency-contact-name').value;
        const emergencyContactPhone = document.getElementById('emergency-contact-phone').value;
        
        // Check if female and pregnancy question is answered
        const isFemale = sex && sex.value === 'female';
        const pregnancyAnswered = !isFemale || document.querySelector('input[name="pregnant"]:checked');
        
        if (fullname && birthdate && docType && docNumber && sex && emergencyContactName && emergencyContactPhone && pregnancyAnswered) {
            registerButton.classList.remove('bg-gray-400', 'cursor-not-allowed');
            registerButton.classList.add('bg-primary', 'hover:bg-blue-700');
            registerButton.disabled = false;
        } else {
            registerButton.classList.add('bg-gray-400', 'cursor-not-allowed');
            registerButton.classList.remove('bg-primary', 'hover:bg-blue-700');
            registerButton.disabled = true;
        }
    }
    
    basicDataForm.addEventListener('input', validateBasicDataForm);
    
    document.querySelectorAll('input[name="pregnant"]').forEach(function(radio) {
        radio.addEventListener('change', validateBasicDataForm);
    });

    // Submit basic data form
    basicDataForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Collect data
        patientData.fullname = document.getElementById('fullname').value;
        patientData.birthdate = document.getElementById('birthdate').value;
        patientData.age = document.getElementById('age').value;
        patientData.docType = document.getElementById('docType').value;
        patientData.docNumber = document.getElementById('docNumber').value;
        patientData.sex = document.querySelector('input[name="sex"]:checked').value;
        patientData.emergencyContactName = document.getElementById('emergency-contact-name').value;
        patientData.emergencyContactPhone = document.getElementById('emergency-contact-phone').value;
        
        if (patientData.sex === 'female') {
            patientData.pregnant = document.querySelector('input[name="pregnant"]:checked').value;
        }
        
        showScreen(4);
    });

    // Handle multi-select dropdowns
    function setupMultiSelect(selectId, displayId) {
        const select = document.getElementById(selectId);
        const display = document.getElementById(displayId);
        
        select.addEventListener('change', function() {
            display.innerHTML = '';
            
            const selectedOptions = Array.from(this.selectedOptions);
            
            // If "None" is selected, deselect other options
            if (selectedOptions.some(option => option.value === 'none')) {
                Array.from(this.options).forEach(option => {
                    if (option.value !== 'none') {
                        option.selected = false;
                    }
                });
                selectedOptions.length = 0;
                selectedOptions.push(Array.from(this.options).find(option => option.value === 'none'));
            }
            
            // If any other option is selected, deselect "None"
            if (selectedOptions.some(option => option.value !== 'none')) {
                const noneOption = Array.from(this.options).find(option => option.value === 'none');
                if (noneOption) {
                    noneOption.selected = false;
                }
            }
            
            // Show/hide the "other allergies" input field if applicable
            if (selectId === 'allergies') {
                const otherAllergiesContainer = document.getElementById('other-allergies-container');
                if (selectedOptions.some(option => option.value === 'other')) {
                    otherAllergiesContainer.classList.remove('hidden');
                } else {
                    otherAllergiesContainer.classList.add('hidden');
                    // Clear the input when "other" is deselected
                    document.getElementById('other-allergies').value = '';
                }
            }
            
            // Create tags for selected options
            Array.from(this.selectedOptions).forEach(option => {
                const tag = document.createElement('span');
                tag.className = 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium px-2.5 py-0.5 rounded-full';
                tag.textContent = option.textContent;
                display.appendChild(tag);
            });
        });
    }
    
    // Setup custom allergies dropdown
    function setupCustomAllergiesDropdown() {
        const allergiesSelect = document.getElementById('allergies');
        const allergiesDropdown = document.getElementById('allergies-dropdown');
        const allergiesToggle = document.getElementById('allergies-dropdown-toggle');
        const allergiesText = document.getElementById('allergies-dropdown-text');
        const allergiesMenu = document.getElementById('allergies-dropdown-menu');
        const allergiesDisplay = document.getElementById('selected-allergies');
        
        // Toggle dropdown visibility
        allergiesToggle.addEventListener('click', function() {
            allergiesDropdown.classList.toggle('dropdown-open');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(event) {
            if (!allergiesDropdown.contains(event.target)) {
                allergiesDropdown.classList.remove('dropdown-open');
            }
        });
        
        // Handle checkbox changes
        const checkboxes = allergiesMenu.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                updateSelectedOptions();
            });
        });
        
        function updateSelectedOptions() {
            allergiesDisplay.innerHTML = '';
            const selectedCheckboxes = Array.from(checkboxes).filter(cb => cb.checked);
            
            // Handle "None" option
            const noneCheckbox = document.getElementById('allergy-none');
            if (noneCheckbox.checked) {
                // If "None" is checked, uncheck others
                checkboxes.forEach(cb => {
                    if (cb !== noneCheckbox) cb.checked = false;
                });
                
                // Update the hidden select for form submission
                Array.from(allergiesSelect.options).forEach(option => {
                    option.selected = option.value === 'none';
                });
            } else {
                // If any other is checked, uncheck "None"
                if (selectedCheckboxes.some(cb => cb.id !== 'allergy-none')) {
                    noneCheckbox.checked = false;
                }
                
                // Update the hidden select for form submission
                Array.from(allergiesSelect.options).forEach(option => {
                    option.selected = Array.from(selectedCheckboxes).some(
                        cb => cb.value === option.value
                    );
                });
            }
            
            // Update display text
            if (selectedCheckboxes.length === 0) {
                allergiesText.textContent = 'Seleccione...';
            } else {
                allergiesText.textContent = `${selectedCheckboxes.length} seleccionadas`;
            }
            
            // Create tags for selected options
            selectedCheckboxes.forEach(checkbox => {
                const tag = document.createElement('span');
                tag.className = 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium px-2.5 py-0.5 rounded-full';
                tag.textContent = checkbox.nextElementSibling.textContent;
                allergiesDisplay.appendChild(tag);
            });
            
            // Show/hide other allergies input
            const otherAllergiesContainer = document.getElementById('other-allergies-container');
            if (selectedCheckboxes.some(cb => cb.value === 'other')) {
                otherAllergiesContainer.classList.remove('hidden');
            } else {
                otherAllergiesContainer.classList.add('hidden');
                document.getElementById('other-allergies').value = '';
            }
            
            // Trigger change event on the hidden select for compatibility
            const event = new Event('change');
            allergiesSelect.dispatchEvent(event);
        }
    }
    
    // Setup custom conditions dropdown
    function setupCustomConditionsDropdown() {
        const conditionsSelect = document.getElementById('conditions');
        const conditionsDropdown = document.getElementById('conditions-dropdown');
        const conditionsToggle = document.getElementById('conditions-dropdown-toggle');
        const conditionsText = document.getElementById('conditions-dropdown-text');
        const conditionsMenu = document.getElementById('conditions-dropdown-menu');
        const conditionsDisplay = document.getElementById('selected-conditions');
        
        // Toggle dropdown visibility
        conditionsToggle.addEventListener('click', function() {
            conditionsDropdown.classList.toggle('dropdown-open');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(event) {
            if (!conditionsDropdown.contains(event.target)) {
                conditionsDropdown.classList.remove('dropdown-open');
            }
        });
        
        // Handle checkbox changes
        const checkboxes = conditionsMenu.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                updateSelectedOptions();
            });
        });
        
        function updateSelectedOptions() {
            conditionsDisplay.innerHTML = '';
            const selectedCheckboxes = Array.from(checkboxes).filter(cb => cb.checked);
            
            // Handle "None" option
            const noneCheckbox = document.getElementById('condition-none');
            if (noneCheckbox.checked) {
                // If "None" is checked, uncheck others
                checkboxes.forEach(cb => {
                    if (cb !== noneCheckbox) cb.checked = false;
                });
                
                // Update the hidden select for form submission
                Array.from(conditionsSelect.options).forEach(option => {
                    option.selected = option.value === 'none';
                });
            } else {
                // If any other is checked, uncheck "None"
                if (selectedCheckboxes.some(cb => cb.id !== 'condition-none')) {
                    noneCheckbox.checked = false;
                }
                
                // Update the hidden select for form submission
                Array.from(conditionsSelect.options).forEach(option => {
                    option.selected = Array.from(selectedCheckboxes).some(
                        cb => cb.value === option.value
                    );
                });
            }
            
            // Update display text
            if (selectedCheckboxes.length === 0) {
                conditionsText.textContent = 'Seleccione...';
            } else {
                conditionsText.textContent = `${selectedCheckboxes.length} seleccionadas`;
            }
            
            // Create tags for selected options
            selectedCheckboxes.forEach(checkbox => {
                const tag = document.createElement('span');
                tag.className = 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium px-2.5 py-0.5 rounded-full';
                tag.textContent = checkbox.nextElementSibling.textContent;
                conditionsDisplay.appendChild(tag);
            });
            
            // Show/hide other conditions input
            const otherConditionsContainer = document.getElementById('other-conditions-container');
            if (selectedCheckboxes.some(cb => cb.value === 'other')) {
                otherConditionsContainer.classList.remove('hidden');
            } else {
                otherConditionsContainer.classList.add('hidden');
                document.getElementById('other-conditions').value = '';
            }
            
            // Trigger change event on the hidden select for compatibility
            const event = new Event('change');
            conditionsSelect.dispatchEvent(event);
        }
    }
    
    setupMultiSelect('allergies', 'selected-allergies');
    setupMultiSelect('conditions', 'selected-conditions');
    setupCustomAllergiesDropdown();
    setupCustomConditionsDropdown();

    // Submit medical history form
    document.getElementById('medical-history-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Collect data
        patientData.allergies = Array.from(document.getElementById('allergies').selectedOptions).map(option => option.value);
        
        // If "other" is selected, add the custom allergies text
        if (patientData.allergies.includes('other')) {
            patientData.otherAllergies = document.getElementById('other-allergies').value;
        }
        
        patientData.conditions = Array.from(document.getElementById('conditions').selectedOptions).map(option => option.value);
        
        // If "other" is selected, add the custom conditions text
        if (patientData.conditions.includes('other')) {
            patientData.otherConditions = document.getElementById('other-conditions').value;
        }
        
        patientData.surgeries = document.getElementById('surgeries').value;
        
        showScreen(5);
    });

    // Submit symptoms form
    document.getElementById('symptoms-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Collect data
        patientData.mainSymptoms = document.getElementById('main-symptoms').value;
        patientData.symptomsDuration = document.getElementById('symptoms-duration').value;
        
        // Generate dynamic questions based on keywords
        generateDynamicQuestions(patientData.mainSymptoms);
        
        showScreen(6);
    });

    // Generate dynamic questions based on keywords
    function generateDynamicQuestions(symptoms) {
        const dynamicQuestions = document.getElementById('dynamic-questions');
        dynamicQuestions.innerHTML = '';
        
        const symptomsLower = symptoms.toLowerCase();
        const questionsToAdd = [];
        
        // Check for keywords and add relevant questions
        if (symptomsLower.includes('dolor') && symptomsLower.includes('pecho')) {
            questionsToAdd.push({
                type: 'radio',
                id: 'chest-pain-type',
                label: '¿Cómo describiría el dolor en el pecho?',
                options: [
                    { value: 'pressure', label: 'Opresivo (como un peso)' },
                    { value: 'sharp', label: 'Agudo/punzante' },
                    { value: 'burning', label: 'Ardor/quemazón' },
                    { value: 'other', label: 'Otro tipo' }
                ]
            });
            
            questionsToAdd.push({
                type: 'checkbox',
                id: 'chest-pain-associated',
                label: '¿El dolor se acompaña de alguno de estos síntomas?',
                options: [
                    { value: 'shortness-breath', label: 'Dificultad para respirar' },
                    { value: 'sweating', label: 'Sudoración' },
                    { value: 'nausea', label: 'Náuseas o vómitos' },
                    { value: 'arm-pain', label: 'Dolor que se extiende al brazo, hombro o mandíbula' },
                    { value: 'none', label: 'Ninguno de los anteriores' }
                ]
            });
        }
        
        if (symptomsLower.includes('respira') || symptomsLower.includes('ahogo') || symptomsLower.includes('falta de aire')) {
            questionsToAdd.push({
                type: 'radio',
                id: 'breathing-difficulty',
                label: '¿Cómo calificaría su dificultad para respirar?',
                options: [
                    { value: 'mild', label: 'Leve (puedo hablar normalmente)' },
                    { value: 'moderate', label: 'Moderada (me cuesta hablar sin pausar)' },
                    { value: 'severe', label: 'Severa (apenas puedo hablar)' }
                ]
            });
        }
        
        if (symptomsLower.includes('fiebre') || symptomsLower.includes('temperatura')) {
            questionsToAdd.push({
                type: 'radio',
                id: 'fever-duration',
                label: '¿Desde cuándo tiene fiebre?',
                options: [
                    { value: 'today', label: 'Hoy' },
                    { value: 'yesterday', label: 'Desde ayer' },
                    { value: 'days', label: 'Varios días' },
                    { value: 'week', label: 'Una semana o más' }
                ]
            });
            
            questionsToAdd.push({
                type: 'dropdown',
                id: 'fever-temperature',
                label: '¿Cuál es la temperatura más alta que ha registrado?',
                options: [
                    { value: '', label: 'Seleccione...' },
                    { value: 'below-38', label: 'Menos de 38°C' },
                    { value: '38-38.5', label: 'Entre 38°C y 38.5°C' },
                    { value: '38.5-39', label: 'Entre 38.5°C y 39°C' },
                    { value: 'above-39', label: 'Más de 39°C' },
                    { value: 'unknown', label: 'No lo sé' }
                ]
            });
        }
        
        if (symptomsLower.includes('dolor de cabeza') || symptomsLower.includes('cefalea')) {
            questionsToAdd.push({
                type: 'radio',
                id: 'headache-intensity',
                label: '¿Cómo calificaría la intensidad de su dolor de cabeza?',
                options: [
                    { value: 'mild', label: 'Leve' },
                    { value: 'moderate', label: 'Moderado' },
                    { value: 'severe', label: 'Severo' }
                ]
            });
        }
        
        if (symptomsLower.includes('vómito') || symptomsLower.includes('vomito') || symptomsLower.includes('náusea') || symptomsLower.includes('nausea')) {
            questionsToAdd.push({
                type: 'radio',
                id: 'vomit-frequency',
                label: '¿Con qué frecuencia ha vomitado?',
                options: [
                    { value: 'once', label: 'Una vez' },
                    { value: 'few', label: 'Pocas veces (2-3)' },
                    { value: 'several', label: 'Varias veces (más de 3)' },
                    { value: 'continuous', label: 'Continuamente' }
                ]
            });
            
            questionsToAdd.push({
                type: 'checkbox',
                id: 'vomit-characteristics',
                label: '¿Cómo describiría el vómito?',
                options: [
                    { value: 'food', label: 'Restos de comida' },
                    { value: 'yellow', label: 'Amarillento/bilioso' },
                    { value: 'blood', label: 'Con sangre' },
                    { value: 'coffee', label: 'Color café/posos de café' }
                ]
            });
        }
        
        if (symptomsLower.includes('diarrea')) {
            questionsToAdd.push({
                type: 'radio',
                id: 'diarrhea-frequency',
                label: '¿Cuántas deposiciones diarreicas ha tenido en las últimas 24 horas?',
                options: [
                    { value: '1-3', label: '1-3' },
                    { value: '4-6', label: '4-6' },
                    { value: 'more-6', label: 'Más de 6' }
                ]
            });
            
            questionsToAdd.push({
                type: 'checkbox',
                id: 'diarrhea-characteristics',
                label: '¿Ha notado alguna de estas características?',
                options: [
                    { value: 'blood', label: 'Sangre' },
                    { value: 'mucus', label: 'Moco' },
                    { value: 'black', label: 'Heces negras' },
                    { value: 'none', label: 'Ninguna de las anteriores' }
                ]
            });
        }
        
        // If no specific questions were generated, add general ones
        if (questionsToAdd.length === 0) {
            questionsToAdd.push({
                type: 'radio',
                id: 'pain-intensity',
                label: '¿Cómo calificaría la intensidad de su malestar?',
                options: [
                    { value: 'mild', label: 'Leve' },
                    { value: 'moderate', label: 'Moderado' },
                    { value: 'severe', label: 'Severo' }
                ]
            });
            
            questionsToAdd.push({
                type: 'checkbox',
                id: 'general-symptoms',
                label: '¿Presenta alguno de estos síntomas?',
                options: [
                    { value: 'fever', label: 'Fiebre' },
                    { value: 'headache', label: 'Dolor de cabeza' },
                    { value: 'fatigue', label: 'Fatiga/cansancio' },
                    { value: 'dizziness', label: 'Mareo' },
                    { value: 'none', label: 'Ninguno de los anteriores' }
                ]
            });
        }
        
        // Add questions to the DOM
        questionsToAdd.forEach(question => {
            const questionDiv = document.createElement('div');
            questionDiv.className = 'mb-6';
            
            const label = document.createElement('label');
            label.className = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2';
            label.textContent = question.label;
            questionDiv.appendChild(label);
            
            if (question.type === 'radio') {
                const optionsDiv = document.createElement('div');
                optionsDiv.className = 'space-y-2';
                
                question.options.forEach(option => {
                    const optionDiv = document.createElement('div');
                    optionDiv.className = 'flex items-center';
                    
                    const input = document.createElement('input');
                    input.type = 'radio';
                    input.id = `${question.id}-${option.value}`;
                    input.name = question.id;
                    input.value = option.value;
                    input.className = 'h-5 w-5 text-primary dark:text-blue-400 focus:ring-primary dark:focus:ring-blue-400';
                    
                    const optionLabel = document.createElement('label');
                    optionLabel.htmlFor = `${question.id}-${option.value}`;
                    optionLabel.className = 'ml-2 text-gray-700 dark:text-gray-300';
                    optionLabel.textContent = option.label;
                    
                    optionDiv.appendChild(input);
                    optionDiv.appendChild(optionLabel);
                    optionsDiv.appendChild(optionDiv);
                });
                
                questionDiv.appendChild(optionsDiv);
            } else if (question.type === 'checkbox') {
                const optionsDiv = document.createElement('div');
                optionsDiv.className = 'space-y-2';
                
                question.options.forEach(option => {
                    const optionDiv = document.createElement('div');
                    optionDiv.className = 'flex items-center';
                    
                    const input = document.createElement('input');
                    input.type = 'checkbox';
                    input.id = `${question.id}-${option.value}`;
                    input.name = `${question.id}[]`;
                    input.value = option.value;
                    input.className = 'h-5 w-5 text-primary dark:text-blue-400 focus:ring-primary dark:focus:ring-blue-400';
                    
                    const optionLabel = document.createElement('label');
                    optionLabel.htmlFor = `${question.id}-${option.value}`;
                    optionLabel.className = 'ml-2 text-gray-700 dark:text-gray-300';
                    optionLabel.textContent = option.label;
                    
                    optionDiv.appendChild(input);
                    optionDiv.appendChild(optionLabel);
                    optionsDiv.appendChild(optionDiv);
                });
                
                questionDiv.appendChild(optionsDiv);
            } else if (question.type === 'dropdown') {
                const select = document.createElement('select');
                select.id = question.id;
                select.name = question.id;
                select.className = 'w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-primary dark:focus:ring-blue-400 focus:border-primary dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white';
                
                question.options.forEach(option => {
                    const optionElement = document.createElement('option');
                    optionElement.value = option.value;
                    optionElement.textContent = option.label;
                    select.appendChild(optionElement);
                });
                
                questionDiv.appendChild(select);
            }
            
            dynamicQuestions.appendChild(questionDiv);
        });
    }

    // Submit dynamic form
    document.getElementById('dynamic-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Generate reference number
        document.getElementById('reference-number').textContent = generateReferenceNumber();
        
        showScreen(7);
    });

    // New functions for Medical Staff Panel
    function initializeMedicalStaffPanel() {
        // Update current date and time
        updateDateTime();
        setInterval(updateDateTime, 60000); // Update every minute

        // Add event listeners for the medical panel
        addMedicalPanelEventListeners();
    }

    function updateDateTime() {
        const dateTimeElement = document.getElementById('current-datetime');
        if (dateTimeElement) {
            const now = new Date();
            const options = { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            };
            dateTimeElement.textContent = now.toLocaleDateString('es-ES', options);
        }
    }

    function addMedicalPanelEventListeners() {
        // Filters functionality
        const esiFilter = document.getElementById('esi-filter');
        const statusFilter = document.getElementById('status-filter');
        const sortBy = document.getElementById('sort-by');

        if (esiFilter) {
            esiFilter.addEventListener('change', filterPatients);
        }

        if (statusFilter) {
            statusFilter.addEventListener('change', filterPatients);
        }

        if (sortBy) {
            sortBy.addEventListener('change', filterPatients);
        }

        // View history buttons
        const viewHistoryButtons = document.querySelectorAll('.view-history-btn');
        viewHistoryButtons.forEach(button => {
            button.addEventListener('click', function() {
                const patientId = this.getAttribute('data-patient-id');
                showPatientHistory(patientId);
            });
        });

        // Start evaluation buttons
        const startEvaluationButtons = document.querySelectorAll('.start-evaluation-btn');
        startEvaluationButtons.forEach(button => {
            button.addEventListener('click', function() {
                const patientId = this.getAttribute('data-patient-id');
                showVitalSignsModal(patientId);
            });
        });

        // Close history modal
        const closeHistoryModal = document.getElementById('close-history-modal');
        if (closeHistoryModal) {
            closeHistoryModal.addEventListener('click', function() {
                document.getElementById('history-modal').classList.add('hidden');
            });
        }

        // Close vital signs modal
        const closeVitalSignsModal = document.getElementById('close-vital-signs-modal');
        if (closeVitalSignsModal) {
            closeVitalSignsModal.addEventListener('click', function() {
                document.getElementById('vital-signs-modal').classList.add('hidden');
            });
        }

        // ESI buttons in vital signs modal
        const esiButtons = document.querySelectorAll('.esi-btn');
        esiButtons.forEach(button => {
            button.addEventListener('click', function() {
                const esiValue = this.getAttribute('data-esi');
                document.getElementById('selected-esi').value = esiValue;
                
                // Remove active class from all buttons
                esiButtons.forEach(btn => btn.classList.remove('ring-2'));
                // Add active class to selected button
                this.classList.add('ring-2');
            });
        });

        // Vital signs form submission
        const vitalSignsForm = document.getElementById('vital-signs-form');
        if (vitalSignsForm) {
            vitalSignsForm.addEventListener('submit', function(e) {
                e.preventDefault();
                saveVitalSigns();
            });
        }

        // Generate report button
        const generateReportBtn = document.getElementById('generate-report-btn');
        if (generateReportBtn) {
            generateReportBtn.addEventListener('click', function() {
                generatePatientReport();
            });
        }
    }

    function filterPatients() {
        // In a real application, this would filter the patient list based on selected criteria
        console.log('Filtering patients...');
    }

    function showPatientHistory(patientId) {
        // In a real application, this would fetch the patient history from a database
        console.log('Showing history for patient:', patientId);
        
        // For demo purposes, just show the modal with static data
        document.getElementById('history-modal').classList.remove('hidden');
        
        // Update modal with patient info based on ID
        // In a real app, this would fetch data from a server
        if (patientId === 'PRE-12345') {
            document.getElementById('modal-patient-name').textContent = 'Carlos Rodríguez';
            document.getElementById('modal-patient-age').textContent = '72';
            document.getElementById('modal-patient-sex').textContent = 'Masculino';
        } else if (patientId === 'PRE-23456') {
            document.getElementById('modal-patient-name').textContent = 'Ana Martínez';
            document.getElementById('modal-patient-age').textContent = '45';
            document.getElementById('modal-patient-sex').textContent = 'Femenino';
        }
        
        document.getElementById('modal-patient-id').textContent = patientId;
    }

    function showVitalSignsModal(patientId) {
        console.log('Starting evaluation for patient:', patientId);
        
        // Show the modal
        document.getElementById('vital-signs-modal').classList.remove('hidden');
        
        // Update modal with patient info based on ID
        if (patientId === 'PRE-12345') {
            document.getElementById('vital-signs-patient-name').textContent = 'Carlos Rodríguez';
            document.getElementById('vital-signs-reason').textContent = 'Dolor de pecho intenso';
        } else if (patientId === 'PRE-23456') {
            document.getElementById('vital-signs-patient-name').textContent = 'Ana Martínez';
            document.getElementById('vital-signs-reason').textContent = 'Dificultad para respirar severa';
        }
    }

    function saveVitalSigns() {
        // In a real application, this would save the vital signs to a database
        alert('Evaluación guardada correctamente.');
        document.getElementById('vital-signs-modal').classList.add('hidden');
    }

    function generatePatientReport() {
        // In a real application, this would generate a PDF or CSV report
        alert('Generando reporte... En una aplicación real, esto descargaría un archivo PDF o CSV.');
    }
});
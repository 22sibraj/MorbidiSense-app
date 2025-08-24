class MultiStepForm {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = document.querySelectorAll('.form-step').length;
        this.formData = {};
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.showStep(1);
    }

    setupEventListeners() {
        // Next button
        document.addEventListener('click', (e) => {
            if (e.target.matches('.btn-next') || e.target.closest('.btn-next')) {
                e.preventDefault();
                if (this.validateStep(this.currentStep)) {
                    this.saveStepData(this.currentStep);
                    this.nextStep();
                }
            }

            // Previous button
            if (e.target.matches('.btn-prev') || e.target.closest('.btn-prev')) {
                e.preventDefault();
                this.prevStep();
            }

            // Submit button
            if (e.target.matches('.btn-submit') || e.target.closest('.btn-submit')) {
                e.preventDefault();
                this.submitForm();
            }
        });

        // Handle input changes to update form data
        document.addEventListener('input', (e) => {
            const input = e.target;
            if (input.name) {
                this.formData[input.name] = input.type === 'checkbox' ? input.checked : input.value;
            }
        });
    }

    showStep(stepNumber) {
        // Hide all steps
        document.querySelectorAll('.form-step').forEach(step => {
            step.classList.remove('active');
        });

        // Show current step
        const currentStepElement = document.getElementById(`step-${stepNumber}`);
        if (currentStepElement) {
            currentStepElement.classList.add('active');
        }

        // Update progress indicators
        this.updateProgress(stepNumber);

        // Update navigation buttons
        this.updateNavigationButtons(stepNumber);

        // Update review summary if on the last step
        if (stepNumber === this.totalSteps) {
            this.updateReviewSummary();
        }
    }

    updateProgress(stepNumber) {
        // Update step indicators
        document.querySelectorAll('.step').forEach((step, index) => {
            const stepNum = index + 1;
            if (stepNum < stepNumber) {
                step.classList.remove('active');
                step.classList.add('completed');
            } else if (stepNum === stepNumber) {
                step.classList.add('active');
                step.classList.remove('completed');
            } else {
                step.classList.remove('active', 'completed');
            }
        });
    }

    updateNavigationButtons(stepNumber) {
        // Hide all navigation buttons first
        document.querySelectorAll('.navigation-buttons').forEach(nav => {
            nav.style.display = 'none';
        });

        // Show appropriate navigation buttons for current step
        const currentStepNav = document.querySelector(`#step-${stepNumber} .navigation-buttons`);
        if (currentStepNav) {
            currentStepNav.style.display = 'flex';
        }

        // Update button states
        const prevButtons = document.querySelectorAll('.btn-prev');
        const nextButtons = document.querySelectorAll('.btn-next');
        
        prevButtons.forEach(btn => {
            btn.disabled = stepNumber === 1;
        });

        nextButtons.forEach(btn => {
            btn.disabled = stepNumber === this.totalSteps;
        });
    }

    nextStep() {
        if (this.currentStep < this.totalSteps) {
            this.currentStep++;
            this.showStep(this.currentStep);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    prevStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.showStep(this.currentStep);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    validateStep(stepNumber) {
        const currentStep = document.getElementById(`step-${stepNumber}`);
        const requiredFields = currentStep.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.classList.add('error');
                isValid = false;
                
                // Add error message if not already present
                if (!field.nextElementSibling || !field.nextElementSibling.classList.contains('error-message')) {
                    const errorMsg = document.createElement('div');
                    errorMsg.className = 'error-message';
                    errorMsg.textContent = field.dataset.error || 'This field is required';
                    errorMsg.style.color = 'var(--danger-color)';
                    errorMsg.style.fontSize = '0.8rem';
                    errorMsg.style.marginTop = '0.25rem';
                    field.parentNode.insertBefore(errorMsg, field.nextSibling);
                }
            } else {
                field.classList.remove('error');
                const errorMsg = field.nextElementSibling;
                if (errorMsg && errorMsg.classList.contains('error-message')) {
                    errorMsg.remove();
                }
            }
        });

        // Custom validation for specific steps
        if (stepNumber === 3) { // Example: Additional validation for step 3
            const bloodPressureSystolic = document.getElementById('systolic');
            const bloodPressureDiastolic = document.getElementById('diastolic');
            
            if (bloodPressureSystolic.value && bloodPressureDiastolic.value) {
                const systolic = parseInt(bloodPressureSystolic.value);
                const diastolic = parseInt(bloodPressureDiastolic.value);
                
                if (systolic <= diastolic) {
                    alert('Systolic pressure must be greater than diastolic pressure');
                    return false;
                }
            }
        }

        return isValid;
    }

    saveStepData(stepNumber) {
        const currentStep = document.getElementById(`step-${stepNumber}`);
        const formElements = currentStep.querySelectorAll('input, select, textarea');
        
        formElements.forEach(element => {
            if (element.name) {
                if (element.type === 'checkbox') {
                    this.formData[element.name] = element.checked;
                } else if (element.type === 'radio' && element.checked) {
                    this.formData[element.name] = element.value;
                } else if (element.type !== 'radio') {
                    this.formData[element.name] = element.value;
                }
            }
        });
        
        console.log('Form data updated:', this.formData);
    }

    updateReviewSummary() {
        const summaryContainer = document.getElementById('review-summary');
        if (!summaryContainer) return;

        // Clear previous summary
        summaryContainer.innerHTML = '';

        // Group data by sections
        const sections = {
            'Personal Information': ['firstName', 'lastName', 'email', 'phone', 'age', 'gender'],
            'Lifestyle': ['smoking', 'alcohol', 'activityLevel', 'diet', 'sleepHours'],
            'Medical History': ['conditions', 'allergies', 'medications', 'familyHistory'],
            'Vital Signs': ['height', 'weight', 'systolic', 'diastolic', 'heartRate'],
            'Symptoms': ['symptoms', 'symptomDuration', 'symptomSeverity', 'notes']
        };

        // Create summary sections
        for (const [sectionName, fields] of Object.entries(sections)) {
            const sectionData = fields
                .filter(field => this.formData[field] !== undefined && this.formData[field] !== '')
                .map(field => ({
                    label: this.formatLabel(field),
                    value: this.formatValue(field, this.formData[field])
                }));

            if (sectionData.length > 0) {
                const sectionElement = document.createElement('div');
                sectionElement.className = 'summary-section';
                sectionElement.innerHTML = `
                    <h4>${sectionName}</h4>
                    ${sectionData.map(item => `
                        <div class="summary-item">
                            <span class="summary-label">${item.label}:</span>
                            <span class="summary-value">${item.value}</span>
                        </div>
                    `).join('')}
                `;
                summaryContainer.appendChild(sectionElement);
            }
        }
    }

    formatLabel(fieldName) {
        // Convert camelCase to Title Case and add spaces
        return fieldName
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase())
            .trim();
    }

    formatValue(field, value) {
        if (value === true) return 'Yes';
        if (value === false) return 'No';
        if (Array.isArray(value)) return value.join(', ');
        if (!value) return 'Not specified';
        
        // Format specific fields
        if (field === 'gender') {
            return value.charAt(0).toUpperCase() + value.slice(1);
        }
        
        if (field === 'activityLevel') {
            const levels = {
                'sedentary': 'Sedentary (little or no exercise)',
                'light': 'Lightly active (light exercise/sports 1-3 days/week)',
                'moderate': 'Moderately active (moderate exercise/sports 3-5 days/week)',
                'very': 'Very active (hard exercise/sports 6-7 days a week)',
                'extra': 'Extra active (very hard exercise/sports & physical job or 2x training)'
            };
            return levels[value] || value;
        }
        
        return value;
    }

    submitForm() {
        if (this.validateStep(this.currentStep)) {
            this.saveStepData(this.currentStep);
            
            // Show loading state
            const submitButton = document.querySelector('.btn-submit');
            const originalText = submitButton.innerHTML;
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
            
            // Simulate API call
            console.log('Submitting form data:', this.formData);
            
            // In a real app, you would make an API call here
            setTimeout(() => {
                // Show success message
                alert('Your advanced health assessment has been submitted successfully!');
                
                // Reset form and return to first step
                // this.resetForm();
                
                // In a real app, you might redirect to a results page
                // window.location.href = 'assessment-results.html';
                
                // Reset button state
                submitButton.disabled = false;
                submitButton.innerHTML = originalText;
            }, 1500);
        }
    }

    resetForm() {
        // Reset form data
        this.formData = {};
        this.currentStep = 1;
        
        // Reset all form elements
        document.querySelectorAll('input, select, textarea').forEach(element => {
            if (element.type === 'checkbox' || element.type === 'radio') {
                element.checked = false;
            } else {
                element.value = '';
            }
            element.classList.remove('error');
            const errorMsg = element.nextElementSibling;
            if (errorMsg && errorMsg.classList.contains('error-message')) {
                errorMsg.remove();
            }
        });
        
        // Return to first step
        this.showStep(1);
    }
}

// Initialize the multi-step form when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const multiStepForm = new MultiStepForm();
    
    // Make form accessible globally if needed
    window.multiStepForm = multiStepForm;
});

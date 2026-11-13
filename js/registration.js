const RegistrationPage = {
    selectedEventId: null,
    unitPrice: 0,

    init() {
        this.loadEventFromUrl();
        this.populateEventSelect();
        this.initForm();
        this.initQuantityButtons();
        this.updatePaymentSummary();
    },

    loadEventFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        this.selectedEventId = urlParams.get('id');

        if (this.selectedEventId) {
            const event = Eventify.getEventById(this.selectedEventId);
            if (event) {
                this.displayEventSummary(event);
                this.preSelectEvent(event.id);
            }
        }
    },

    populateEventSelect() {
        const select = document.getElementById('eventSelect');
        if (!select) return;

        Eventify.events.forEach(event => {
            const option = document.createElement('option');
            option.value = event.id;
            option.textContent = `${event.title} - ${Eventify.formatDate(event.date)} - ${Eventify.formatCurrency(event.price)}`;
            select.appendChild(option);
        });
    },

    preSelectEvent(eventId) {
        const select = document.getElementById('eventSelect');
        if (select) {
            select.value = eventId;
            this.onEventChange(eventId);
        }
    },

    displayEventSummary(event) {
        const summaryContainer = document.getElementById('eventSummary');
        const img = document.getElementById('summaryEventImg');
        const title = document.getElementById('summaryEventTitle');
        const meta = document.getElementById('summaryEventMeta');
        const price = document.getElementById('summaryEventPrice');

        if (img) img.src = event.image;
        if (img) img.alt = event.title;
        if (title) title.textContent = event.title;
        if (meta) {
            meta.innerHTML = `
                <span><i class="fas fa-calendar"></i> ${Eventify.formatDate(event.date)}</span>
                <span><i class="fas fa-clock"></i> ${Eventify.formatTime(event.time)}</span>
                <span><i class="fas fa-map-marker-alt"></i> ${event.venue}, ${event.location}</span>
            `;
        }
        if (price) {
            price.innerHTML = `<span>${Eventify.formatCurrency(event.price)}</span> per ticket`;
        }
    },

    initForm() {
        const form = document.getElementById('registrationForm');
        const cancelBtn = document.getElementById('cancelBtn');
        const eventSelect = document.getElementById('eventSelect');

        if (form) {
            form.addEventListener('submit', (e) => this.handleSubmit(e));
        }

        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.resetForm());
        }

        if (eventSelect) {
            eventSelect.addEventListener('change', (e) => this.onEventChange(e.target.value));
        }

        this.initValidation();
    },

    initValidation() {
        const fields = [
            { id: 'fullName', validate: (v) => v.trim().length >= 2, message: 'Name must be at least 2 characters' },
            { id: 'email', validate: (v) => Eventify.validateEmail(v), message: 'Please enter a valid email address' },
            { id: 'phone', validate: (v) => Eventify.validatePhone(v), message: 'Please enter a valid phone number' },
            { id: 'eventSelect', validate: (v) => v !== '', message: 'Please select an event' },
            { id: 'ticketQuantity', validate: (v) => parseInt(v) >= 1, message: 'Minimum 1 ticket required' }
        ];

        fields.forEach(field => {
            const input = document.getElementById(field.id);
            if (input) {
                input.addEventListener('blur', () => this.validateField(field));
                input.addEventListener('input', () => this.clearError(field.id));
            }
        });
    },

    validateField(field) {
        const input = document.getElementById(field.id);
        const errorEl = document.getElementById(`${field.id}Error`);

        if (!input) return true;

        const isValid = field.validate(input.value);

        if (!isValid) {
            input.classList.add('error');
            if (errorEl) errorEl.textContent = field.message;
            return false;
        } else {
            input.classList.remove('error');
            if (errorEl) errorEl.textContent = '';
            return true;
        }
    },

    clearError(fieldId) {
        const input = document.getElementById(fieldId);
        const errorEl = document.getElementById(`${fieldId}Error`);

        if (input) input.classList.remove('error');
        if (errorEl) errorEl.textContent = '';
    },

    validateForm() {
        const fields = [
            { id: 'fullName', validate: (v) => v.trim().length >= 2, message: 'Name must be at least 2 characters' },
            { id: 'email', validate: (v) => Eventify.validateEmail(v), message: 'Please enter a valid email address' },
            { id: 'phone', validate: (v) => Eventify.validatePhone(v), message: 'Please enter a valid phone number' },
            { id: 'eventSelect', validate: (v) => v !== '', message: 'Please select an event' },
            { id: 'ticketQuantity', validate: (v) => parseInt(v) >= 1, message: 'Minimum 1 ticket required' }
        ];

        let isValid = true;
        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    },

    onEventChange(eventId) {
        if (!eventId) {
            this.unitPrice = 0;
            this.updatePaymentSummary();
            return;
        }

        const event = Eventify.getEventById(eventId);
        if (event) {
            this.unitPrice = event.price;
            this.displayEventSummary(event);
            this.updatePaymentSummary();
        }
    },

    initQuantityButtons() {
        const decreaseBtn = document.getElementById('decreaseQty');
        const increaseBtn = document.getElementById('increaseQty');
        const quantityInput = document.getElementById('ticketQuantity');

        if (decreaseBtn) {
            decreaseBtn.addEventListener('click', () => {
                const current = parseInt(quantityInput.value) || 1;
                if (current > 1) {
                    quantityInput.value = current - 1;
                    this.updatePaymentSummary();
                }
            });
        }

        if (increaseBtn) {
            increaseBtn.addEventListener('click', () => {
                const current = parseInt(quantityInput.value) || 1;
                if (current < 10) {
                    quantityInput.value = current + 1;
                    this.updatePaymentSummary();
                }
            });
        }

        if (quantityInput) {
            quantityInput.addEventListener('change', () => {
                let value = parseInt(quantityInput.value) || 1;
                if (value < 1) value = 1;
                if (value > 10) value = 10;
                quantityInput.value = value;
                this.updatePaymentSummary();
            });
        }
    },

    updatePaymentSummary() {
        const quantity = parseInt(document.getElementById('ticketQuantity').value) || 1;
        const ticketType = document.getElementById('ticketType').value;

        let priceMultiplier = 1;
        switch (ticketType) {
            case 'vip': priceMultiplier = 2.5; break;
            case 'early-bird': priceMultiplier = 0.8; break;
            default: priceMultiplier = 1;
        }

        const unitPrice = this.unitPrice * priceMultiplier;
        const serviceFee = 2.50;
        const subtotal = unitPrice * quantity;
        const total = subtotal + serviceFee;

        const unitPriceEl = document.getElementById('unitPrice');
        const qtyDisplayEl = document.getElementById('qtyDisplay');
        const totalPriceEl = document.getElementById('totalPrice');

        if (unitPriceEl) unitPriceEl.textContent = Eventify.formatCurrency(unitPrice);
        if (qtyDisplayEl) qtyDisplayEl.textContent = quantity;
        if (totalPriceEl) totalPriceEl.textContent = Eventify.formatCurrency(total);
    },

    handleSubmit(e) {
        e.preventDefault();

        if (!this.validateForm()) {
            Eventify.showToast('Please fix the errors above', 'error');
            return;
        }

        const submitBtn = document.getElementById('submitBtn');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        submitBtn.disabled = true;

        setTimeout(() => {
            this.processRegistration();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 1000);
    },

    processRegistration() {
        const formData = {
            fullName: document.getElementById('fullName').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            eventId: parseInt(document.getElementById('eventSelect').value),
            ticketQuantity: parseInt(document.getElementById('ticketQuantity').value),
            ticketType: document.getElementById('ticketType').value,
            bookingRef: Eventify.generateBookingRef(),
            registrationDate: new Date().toISOString()
        };

        const event = Eventify.getEventById(formData.eventId);
        if (!event) {
            Eventify.showToast('Event not found', 'error');
            return;
        }

        let priceMultiplier = 1;
        switch (formData.ticketType) {
            case 'vip': priceMultiplier = 2.5; break;
            case 'early-bird': priceMultiplier = 0.8; break;
        }

        const unitPrice = event.price * priceMultiplier;
        const total = (unitPrice * formData.ticketQuantity) + 2.50;

        const registration = {
            id: Date.now(),
            ...formData,
            eventTitle: event.title,
            eventDate: event.date,
            eventTime: event.time,
            eventVenue: event.venue,
            eventLocation: event.location,
            eventImage: event.image,
            unitPrice: unitPrice,
            totalPrice: total,
            status: 'confirmed'
        };

        const existingRegs = Eventify.registrations.filter(r =>
            r.email === formData.email && r.eventId === formData.eventId && r.status === 'confirmed'
        );

        if (existingRegs.length > 0) {
            Eventify.showToast('You are already registered for this event', 'warning');
            return;
        }

        Eventify.registrations.push(registration);
        Eventify.saveRegistrations();

        this.showSuccessModal(formData.email, registration.bookingRef);
        this.resetForm();
    },

    showSuccessModal(email, bookingRef) {
        const modal = document.getElementById('successModal');
        const confirmEmail = document.getElementById('confirmEmail');
        const bookingRefEl = document.getElementById('bookingRef');

        if (confirmEmail) confirmEmail.textContent = email;
        if (bookingRefEl) bookingRefEl.textContent = bookingRef;

        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    },

    resetForm() {
        const form = document.getElementById('registrationForm');
        if (form) {
            form.reset();
            document.getElementById('ticketQuantity').value = 1;
            this.unitPrice = 0;
            this.updatePaymentSummary();
            this.displayEventSummary({ title: 'Select an event', image: '', categoryLabel: '' });
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('registrationForm')) {
        RegistrationPage.init();
    }
});

window.RegistrationPage = RegistrationPage;
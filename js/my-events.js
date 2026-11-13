const MyEventsPage = {
    currentTab: 'upcoming',
    eventToCancel: null,

    init() {
        this.renderEvents();
        this.initTabs();
        this.initCancelModal();
    },

    initTabs() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.switchTab(btn.dataset.tab);
            });
        });
    },

    switchTab(tab) {
        this.currentTab = tab;

        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tab);
        });

        document.querySelectorAll('.tab-pane').forEach(pane => {
            pane.classList.toggle('active', pane.id === `${tab}Pane`);
        });

        this.renderEvents();
    },

    getFilteredRegistrations() {
        const now = new Date();
        return Eventify.registrations.filter(reg => {
            const eventDate = new Date(reg.eventDate);
            switch (this.currentTab) {
                case 'upcoming':
                    return reg.status === 'confirmed' && eventDate >= now;
                case 'past':
                    return reg.status === 'confirmed' && eventDate < now;
                case 'cancelled':
                    return reg.status === 'cancelled';
                default:
                    return true;
            }
        });
    },

    renderEvents() {
        const registrations = this.getFilteredRegistrations();
        const listContainer = document.getElementById(`${this.currentTab}EventsList`);
        const emptyContainer = document.getElementById(`${this.currentTab}Empty`);

        if (!listContainer) return;

        if (registrations.length === 0) {
            listContainer.innerHTML = '';
            if (emptyContainer) emptyContainer.style.display = 'block';
            return;
        }

        if (emptyContainer) emptyContainer.style.display = 'none';

        listContainer.innerHTML = registrations.map(reg => this.createEventCard(reg)).join('');
        this.initCancelButtons();
    },

    createEventCard(reg) {
        const eventDate = new Date(reg.eventDate);
        const formattedDate = Eventify.formatDate(reg.eventDate);
        const formattedTime = Eventify.formatTime(reg.eventTime);
        const isPast = eventDate < new Date();
        const statusClass = reg.status === 'cancelled' ? 'status-cancelled' :
                           isPast ? 'status-past' : 'status-upcoming';
        const statusText = reg.status === 'cancelled' ? 'Cancelled' :
                          isPast ? 'Past Event' : 'Upcoming';

        return `
            <article class="my-event-card" data-reg-id="${reg.id}">
                <div class="my-event-image">
                    <img src="${reg.eventImage}" alt="${reg.eventTitle}" loading="lazy">
                </div>
                <div class="my-event-content">
                    <h3 class="my-event-title">${reg.eventTitle}</h3>
                    <div class="my-event-meta">
                        <div class="my-event-meta-item">
                            <i class="fas fa-calendar"></i>
                            <span>${formattedDate} at ${formattedTime}</span>
                        </div>
                        <div class="my-event-meta-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${reg.eventVenue}, ${reg.eventLocation}</span>
                        </div>
                        <div class="my-event-meta-item">
                            <i class="fas fa-ticket-alt"></i>
                            <span>${reg.ticketQuantity} Ticket${reg.ticketQuantity > 1 ? 's' : ''} (${reg.ticketType})</span>
                        </div>
                        <div class="my-event-meta-item">
                            <i class="fas fa-user"></i>
                            <span>${reg.fullName}</span>
                        </div>
                        <div class="my-event-meta-item">
                            <i class="fas fa-receipt"></i>
                            <span>Ref: ${reg.bookingRef}</span>
                        </div>
                    </div>
                </div>
                <div class="my-event-actions">
                    <span class="my-event-status ${statusClass}">${statusText}</span>
                    ${reg.status === 'confirmed' && !isPast ? `
                        <button class="cancel-btn" data-reg-id="${reg.id}" aria-label="Cancel registration">
                            <i class="fas fa-times"></i> Cancel
                        </button>
                    ` : ''}
                </div>
            </article>
        `;
    },

    initCancelButtons() {
        document.querySelectorAll('.cancel-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const regId = parseInt(btn.dataset.regId);
                this.openCancelModal(regId);
            });
        });
    },

    initCancelModal() {
        const modal = document.getElementById('cancelConfirmModal');
        const noBtn = document.getElementById('cancelNoBtn');
        const yesBtn = document.getElementById('cancelYesBtn');
        const overlay = modal ? modal.querySelector('.modal-overlay') : null;

        if (noBtn) {
            noBtn.addEventListener('click', () => this.closeCancelModal());
        }

        if (yesBtn) {
            yesBtn.addEventListener('click', () => this.confirmCancel());
        }

        if (overlay) {
            overlay.addEventListener('click', () => this.closeCancelModal());
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal && modal.style.display === 'flex') {
                this.closeCancelModal();
            }
        });
    },

    openCancelModal(regId) {
        const registration = Eventify.registrations.find(r => r.id === regId);
        if (!registration) return;

        this.eventToCancel = regId;

        const eventNameEl = document.getElementById('cancelEventName');
        const modal = document.getElementById('cancelConfirmModal');

        if (eventNameEl) eventNameEl.textContent = registration.eventTitle;
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    },

    closeCancelModal() {
        this.eventToCancel = null;
        const modal = document.getElementById('cancelConfirmModal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    },

    confirmCancel() {
        if (!this.eventToCancel) return;

        const regIndex = Eventify.registrations.findIndex(r => r.id === this.eventToCancel);
        if (regIndex !== -1) {
            Eventify.registrations[regIndex].status = 'cancelled';
            Eventify.registrations[regIndex].cancelledDate = new Date().toISOString();
            Eventify.saveRegistrations();
        }

        Eventify.showToast('Registration cancelled successfully', 'success');
        this.closeCancelModal();
        this.renderEvents();
    }
};

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('upcomingEventsList')) {
        MyEventsPage.init();
    }
});

window.MyEventsPage = MyEventsPage;
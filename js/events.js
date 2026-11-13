const EventsPage = {
    filteredEvents: [],
    currentSort: 'date-asc',
    currentCategory: '',
    searchQuery: '',

    init() {
        this.loadUrlParams();
        this.renderEvents();
        this.initEventListeners();
        this.populateCategoryFilter();
    },

    loadUrlParams() {
        const urlParams = new URLSearchParams(window.location.search);
        this.currentCategory = urlParams.get('category') || '';
        this.currentSort = urlParams.get('sort') || 'date-asc';
    },

    populateCategoryFilter() {
        const categoryFilter = document.getElementById('categoryFilter');
        const sortFilter = document.getElementById('sortFilter');

        if (categoryFilter) {
            categoryFilter.value = this.currentCategory;
        }

        if (sortFilter) {
            sortFilter.value = this.currentSort;
        }
    },

    initEventListeners() {
        const searchInput = document.getElementById('searchInput');
        const categoryFilter = document.getElementById('categoryFilter');
        const sortFilter = document.getElementById('sortFilter');
        const clearFiltersBtn = document.getElementById('clearFiltersBtn');
        const resetFiltersBtn = document.getElementById('resetFiltersBtn');

        if (searchInput) {
            searchInput.addEventListener('input', Eventify.debounce((e) => {
                this.searchQuery = e.target.value.toLowerCase().trim();
                this.filterAndRender();
            }, 300));
        }

        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                this.currentCategory = e.target.value;
                this.filterAndRender();
            });
        }

        if (sortFilter) {
            sortFilter.addEventListener('change', (e) => {
                this.currentSort = e.target.value;
                this.filterAndRender();
            });
        }

        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', () => this.clearFilters());
        }

        if (resetFiltersBtn) {
            resetFiltersBtn.addEventListener('click', () => this.clearFilters());
        }
    },

    clearFilters() {
        this.searchQuery = '';
        this.currentCategory = '';
        this.currentSort = 'date-asc';

        const searchInput = document.getElementById('searchInput');
        const categoryFilter = document.getElementById('categoryFilter');
        const sortFilter = document.getElementById('sortFilter');

        if (searchInput) searchInput.value = '';
        if (categoryFilter) categoryFilter.value = '';
        if (sortFilter) sortFilter.value = 'date-asc';

        this.filterAndRender();
    },

    filterAndRender() {
        this.filteredEvents = Eventify.events.filter(event => {
            const matchesSearch = !this.searchQuery ||
                event.title.toLowerCase().includes(this.searchQuery) ||
                event.category.toLowerCase().includes(this.searchQuery) ||
                event.location.toLowerCase().includes(this.searchQuery) ||
                event.venue.toLowerCase().includes(this.searchQuery);

            const matchesCategory = !this.currentCategory || event.category === this.currentCategory;

            return matchesSearch && matchesCategory;
        });

        this.sortEvents();
        this.renderEvents();
    },

    sortEvents() {
        switch (this.currentSort) {
            case 'date-asc':
                this.filteredEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
                break;
            case 'date-desc':
                this.filteredEvents.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            case 'price-asc':
                this.filteredEvents.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                this.filteredEvents.sort((a, b) => b.price - a.price);
                break;
            case 'name-asc':
                this.filteredEvents.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'name-desc':
                this.filteredEvents.sort((a, b) => b.title.localeCompare(a.title));
                break;
        }
    },

    renderEvents() {
        const grid = document.getElementById('eventsGrid');
        const emptyState = document.getElementById('emptyState');
        const resultsCount = document.getElementById('resultsCount');

        if (!grid) return;

        if (resultsCount) {
            const count = this.filteredEvents.length;
            resultsCount.textContent = `${count} event${count !== 1 ? 's' : ''} found`;
        }

        if (this.filteredEvents.length === 0) {
            grid.innerHTML = '';
            if (emptyState) emptyState.style.display = 'block';
            return;
        }

        if (emptyState) emptyState.style.display = 'none';

        grid.innerHTML = this.filteredEvents.map(event => this.createEventCard(event)).join('');

        this.initEventCardButtons();
    },

    createEventCard(event) {
        const isFree = event.price === 0;
        const formattedDate = Eventify.formatDate(event.date);
        const formattedTime = Eventify.formatTime(event.time);

        return `
            <article class="event-card" data-event-id="${event.id}">
                <div class="event-card-image">
                    <img src="${event.image}" alt="${event.title}" loading="lazy">
                    <span class="event-category">${event.categoryLabel}</span>
                    <button class="event-favorite" aria-label="Add to favorites" data-event-id="${event.id}">
                        <i class="far fa-heart"></i>
                    </button>
                </div>
                <div class="event-card-content">
                    <h3 class="event-card-title">${event.title}</h3>
                    <div class="event-card-meta">
                        <div class="event-card-meta-item">
                            <i class="fas fa-calendar"></i>
                            <span>${formattedDate}</span>
                        </div>
                        <div class="event-card-meta-item">
                            <i class="fas fa-clock"></i>
                            <span>${formattedTime}</span>
                        </div>
                        <div class="event-card-meta-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${event.venue}, ${event.location}</span>
                        </div>
                    </div>
                    <div class="event-card-footer">
                        <span class="event-price ${isFree ? 'free' : ''}">${Eventify.formatCurrency(event.price)}</span>
                        <a href="event-details.html?id=${event.id}" class="btn btn-primary btn-sm event-card-btn">View Details</a>
                    </div>
                </div>
            </article>
        `;
    },

    initEventCardButtons() {
        document.querySelectorAll('.event-favorite').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const eventId = btn.dataset.eventId;
                this.toggleFavorite(eventId, btn);
            });
        });
    },

    toggleFavorite(eventId, btn) {
        const favorites = JSON.parse(localStorage.getItem('eventify_favorites') || '[]');
        const isFavorite = favorites.includes(parseInt(eventId));

        if (isFavorite) {
            const index = favorites.indexOf(parseInt(eventId));
            favorites.splice(index, 1);
            btn.innerHTML = '<i class="far fa-heart"></i>';
            btn.classList.remove('active');
            Eventify.showToast('Removed from favorites', 'info');
        } else {
            favorites.push(parseInt(eventId));
            btn.innerHTML = '<i class="fas fa-heart"></i>';
            btn.classList.add('active');
            Eventify.showToast('Added to favorites', 'success');
        }

        localStorage.setItem('eventify_favorites', JSON.stringify(favorites));
    },

    renderFeaturedEvents(containerId, limit = 4) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const featured = Eventify.events.filter(e => e.featured).slice(0, limit);
        container.innerHTML = featured.map(event => this.createEventCard(event)).join('');
        this.initEventCardButtons();
    },

    renderCategories(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const categories = [
            { id: 'music', label: 'Music & Concerts', icon: 'fa-music', count: 3 },
            { id: 'tech', label: 'Technology', icon: 'fa-laptop-code', count: 2 },
            { id: 'business', label: 'Business', icon: 'fa-briefcase', count: 3 },
            { id: 'arts', label: 'Arts & Culture', icon: 'fa-palette', count: 2 },
            { id: 'food', label: 'Food & Drink', icon: 'fa-utensils', count: 2 },
            { id: 'sports', label: 'Sports', icon: 'fa-running', count: 2 },
            { id: 'education', label: 'Education', icon: 'fa-graduation-cap', count: 3 },
            { id: 'health', label: 'Health & Wellness', icon: 'fa-spa', count: 1 }
        ];

        container.innerHTML = categories.map(cat => `
            <a href="events.html?category=${cat.id}" class="category-card">
                <i class="fas ${cat.icon}"></i>
                <h3>${cat.label}</h3>
                <span>${cat.count} Events</span>
            </a>
        `).join('');
    },

    renderRelatedEvents(containerId, currentEventId, limit = 4) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const currentEvent = Eventify.getEventById(currentEventId);
        if (!currentEvent) return;

        const related = Eventify.events
            .filter(e => e.id !== currentEventId && e.category === currentEvent.category)
            .slice(0, limit);

        if (related.length === 0) {
            container.innerHTML = '<p class="empty-state">No related events found.</p>';
            return;
        }

        container.innerHTML = related.map(event => this.createEventCard(event)).join('');
        this.initEventCardButtons();
    }
};

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('eventsGrid') || document.getElementById('featuredEventsGrid')) {
        EventsPage.init();
    }

    if (document.getElementById('featuredEventsGrid')) {
        EventsPage.renderFeaturedEvents('featuredEventsGrid', 4);
    }

    if (document.getElementById('categoriesGrid')) {
        EventsPage.renderCategories('categoriesGrid');
    }

    if (document.getElementById('relatedEventsGrid')) {
        const urlParams = new URLSearchParams(window.location.search);
        const eventId = urlParams.get('id');
        if (eventId) {
            EventsPage.renderRelatedEvents('relatedEventsGrid', eventId, 4);
        }
    }
});

const EventDetailsPage = {
    init() {
        this.loadEventFromUrl();
        this.initRegisterButton();
        this.initShareButtons();
    },

    loadEventFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        const eventId = urlParams.get('id');

        if (!eventId) {
            window.location.href = 'events.html';
            return;
        }

        const event = Eventify.getEventById(eventId);
        if (!event) {
            window.location.href = 'events.html';
            return;
        }

        this.renderEventDetails(event);
        this.updateBreadcrumb(event.title);
        EventsPage.renderRelatedEvents('relatedEventsGrid', eventId, 4);
    },

    renderEventDetails(event) {
        const bannerImg = document.getElementById('eventBannerImg');
        const categoryBadge = document.getElementById('eventCategoryBadge');
        const title = document.getElementById('eventTitle');
        const meta = document.getElementById('eventMeta');
        const description = document.getElementById('eventDescription');
        const detailsList = document.getElementById('eventDetailsList');
        const organizerInfo = document.getElementById('organizerInfo');
        const bookingPrice = document.getElementById('bookingPrice');
        const bookingDetails = document.getElementById('bookingDetails');
        const registerBtn = document.getElementById('registerBtn');

        if (bannerImg) {
            bannerImg.src = event.image;
            bannerImg.alt = event.title;
        }

        if (categoryBadge) {
            categoryBadge.textContent = event.categoryLabel;
        }

        if (title) title.textContent = event.title;

        if (meta) {
            meta.innerHTML = `
                <div class="event-meta-item">
                    <i class="fas fa-calendar"></i>
                    <span>${Eventify.formatDate(event.date)}</span>
                </div>
                <div class="event-meta-item">
                    <i class="fas fa-clock"></i>
                    <span>${Eventify.formatTime(event.time)} - ${Eventify.formatTime(event.endTime)}</span>
                </div>
                <div class="event-meta-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${event.venue}, ${event.location}</span>
                </div>
                <div class="event-meta-item">
                    <i class="fas fa-tag"></i>
                    <span>${Eventify.formatCurrency(event.price)}</span>
                </div>
            `;
        }

        if (description) {
            description.textContent = event.longDescription || event.description;
        }

        if (detailsList) {
            detailsList.innerHTML = `
                <div class="detail-item">
                    <div class="detail-icon"><i class="fas fa-calendar-alt"></i></div>
                    <div class="detail-content">
                        <h3>Date & Time</h3>
                        <p>${Eventify.formatDate(event.date)} • ${Eventify.formatTime(event.time)} - ${Eventify.formatTime(event.endTime)}</p>
                    </div>
                </div>
                <div class="detail-item">
                    <div class="detail-icon"><i class="fas fa-map-marked-alt"></i></div>
                    <div class="detail-content">
                        <h3>Venue</h3>
                        <p>${event.venue}, ${event.location}</p>
                    </div>
                </div>
                <div class="detail-item">
                    <div class="detail-icon"><i class="fas fa-ticket-alt"></i></div>
                    <div class="detail-content">
                        <h3>Ticket Price</h3>
                        <p>${Eventify.formatCurrency(event.price)} per ticket</p>
                    </div>
                </div>
                <div class="detail-item">
                    <div class="detail-icon"><i class="fas fa-tags"></i></div>
                    <div class="detail-content">
                        <h3>Categories</h3>
                        <p>${event.tags.join(', ')}</p>
                    </div>
                </div>
            `;
        }

        if (organizerInfo) {
            organizerInfo.innerHTML = `
                <div class="organizer-avatar">
                    <i class="fas fa-building"></i>
                </div>
                <div class="organizer-details">
                    <h3>${event.organizer}</h3>
                    <p><i class="fas fa-envelope"></i> ${event.organizerEmail}</p>
                    <p><i class="fas fa-phone"></i> ${event.organizerPhone}</p>
                </div>
            `;
        }

        if (bookingPrice) {
            bookingPrice.textContent = Eventify.formatCurrency(event.price);
        }

        if (bookingDetails) {
            bookingDetails.innerHTML = `
                <div class="booking-detail-row">
                    <span class="booking-detail-label">Event</span>
                    <span class="booking-detail-value">${event.title}</span>
                </div>
                <div class="booking-detail-row">
                    <span class="booking-detail-label">Date</span>
                    <span class="booking-detail-value">${Eventify.formatDate(event.date)}</span>
                </div>
                <div class="booking-detail-row">
                    <span class="booking-detail-label">Time</span>
                    <span class="booking-detail-value">${Eventify.formatTime(event.time)} - ${Eventify.formatTime(event.endTime)}</span>
                </div>
                <div class="booking-detail-row">
                    <span class="booking-detail-label">Venue</span>
                    <span class="booking-detail-value">${event.venue}</span>
                </div>
                <div class="booking-detail-row">
                    <span class="booking-detail-label">Location</span>
                    <span class="booking-detail-value">${event.location}</span>
                </div>
                <div class="booking-detail-row">
                    <span class="booking-detail-label">Price (per ticket)</span>
                    <span class="booking-detail-value">${Eventify.formatCurrency(event.price)}</span>
                </div>
            `;
        }

        if (registerBtn) {
            registerBtn.href = `register.html?id=${event.id}`;
        }
    },

    updateBreadcrumb(eventTitle) {
        const breadcrumbEvent = document.getElementById('breadcrumbEvent');
        if (breadcrumbEvent) {
            breadcrumbEvent.textContent = eventTitle;
        }
    },

    initRegisterButton() {
        const registerBtn = document.getElementById('registerBtn');
        if (registerBtn) {
            registerBtn.addEventListener('click', (e) => {
                const urlParams = new URLSearchParams(window.location.search);
                const eventId = urlParams.get('id');
                if (eventId) {
                    e.preventDefault();
                    window.location.href = `register.html?id=${eventId}`;
                }
            });
        }
    },

    initShareButtons() {
        window.shareEvent = (platform) => {
            const url = window.location.href;
            const title = document.getElementById('eventTitle')?.textContent || 'Event';
            let shareUrl = '';

            switch (platform) {
                case 'facebook':
                    shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
                    break;
                case 'twitter':
                    shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out: ${title}`)}&url=${encodeURIComponent(url)}`;
                    break;
                case 'linkedin':
                    shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
                    break;
                case 'email':
                    shareUrl = `mailto:?subject=${encodeURIComponent(`Event: ${title}`)}&body=${encodeURIComponent(`Check out this event: ${url}`)}`;
                    break;
            }

            if (shareUrl) {
                window.open(shareUrl, '_blank', 'width=600,height=400');
            }
        };
    }
};

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('eventBannerImg')) {
        EventDetailsPage.init();
    }
});

window.EventDetailsPage = EventDetailsPage;
window.EventsPage = EventsPage;
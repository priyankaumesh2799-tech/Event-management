const Eventify = {
    events: [],
    registrations: [],
    currentEvent: null,

    init() {
        this.loadEvents();
        this.loadRegistrations();
        this.initNavigation();
        this.initMobileMenu();
        this.initScrollHeader();
        this.updateActiveNavLink();
    },

    loadEvents() {
        const storedEvents = localStorage.getItem('eventify_events');
        if (storedEvents) {
            this.events = JSON.parse(storedEvents);
        } else {
            this.events = this.getDefaultEvents();
            this.saveEvents();
        }
    },

    getDefaultEvents() {
        return [
            {
                id: 1,
                title: "Tech Innovation Summit 2025",
                category: "tech",
                categoryLabel: "Technology",
                date: "2025-02-15",
                time: "09:00",
                endTime: "18:00",
                venue: "Moscone Center",
                location: "San Francisco, CA",
                price: 299,
                image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop",
                description: "Join the world's leading technology conference featuring keynotes from industry pioneers, hands-on workshops, and networking opportunities with top tech companies. Discover the latest trends in AI, blockchain, cloud computing, and more.",
                longDescription: "The Tech Innovation Summit 2025 brings together over 5,000 technology professionals, entrepreneurs, and innovators for three days of learning, networking, and inspiration. This year's theme 'Building Tomorrow' focuses on emerging technologies that will shape the next decade.",
                organizer: "TechEvents Inc.",
                organizerEmail: "info@techevents.com",
                organizerPhone: "+1 (555) 100-0001",
                tags: ["AI", "Blockchain", "Cloud", "Startups"],
                featured: true
            },
            {
                id: 2,
                title: "Summer Music Festival",
                category: "music",
                categoryLabel: "Music & Concerts",
                date: "2025-03-20",
                time: "14:00",
                endTime: "23:00",
                venue: "Central Park",
                location: "New York, NY",
                price: 149,
                image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&h=600&fit=crop",
                description: "Experience the biggest summer music festival with top artists across multiple stages. Food vendors, art installations, and unforgettable performances await.",
                longDescription: "The annual Summer Music Festival returns to Central Park with an incredible lineup of international and local artists. Three stages, 30+ performances, food from around the world, and interactive art installations make this the can't-miss event of the season.",
                organizer: "NYC Events Co.",
                organizerEmail: "festivals@nycevents.com",
                organizerPhone: "+1 (555) 100-0002",
                tags: ["Live Music", "Outdoor", "Food", "Art"],
                featured: true
            },
            {
                id: 3,
                title: "Global Business Leadership Conference",
                category: "business",
                categoryLabel: "Business",
                date: "2025-02-28",
                time: "08:30",
                endTime: "17:30",
                venue: "McCormick Place",
                location: "Chicago, IL",
                price: 599,
                image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop",
                description: "Premier business conference featuring Fortune 500 CEOs, leadership workshops, and exclusive networking sessions for executives and aspiring leaders.",
                longDescription: "The Global Business Leadership Conference is the premier event for business leaders worldwide. Join 3,000+ executives for keynotes from industry titans, interactive workshops on leadership strategy, and unparalleled networking opportunities.",
                organizer: "Business Leaders Association",
                organizerEmail: "conference@bla.org",
                organizerPhone: "+1 (555) 100-0003",
                tags: ["Leadership", "Networking", "Strategy", "Executive"],
                featured: true
            },
            {
                id: 4,
                title: "Contemporary Art Exhibition",
                category: "arts",
                categoryLabel: "Arts & Culture",
                date: "2025-03-10",
                time: "10:00",
                endTime: "19:00",
                venue: "MoMA",
                location: "New York, NY",
                price: 25,
                image: "https://images.unsplash.com/photo-1531058020387-3f4e8a6c4e0e?w=800&h=600&fit=crop",
                description: "Explore groundbreaking contemporary art from emerging and established artists. Interactive installations, digital art, and thought-provoking exhibitions.",
                longDescription: "The Museum of Modern Art presents its annual contemporary art exhibition showcasing works from 50+ artists across multiple mediums. Experience immersive installations, digital art experiences, and engage with artist talks throughout the exhibition period.",
                organizer: "MoMA",
                organizerEmail: "exhibitions@moma.org",
                organizerPhone: "+1 (555) 100-0004",
                tags: ["Contemporary Art", "Installations", "Digital Art", "Museum"],
                featured: false
            },
            {
                id: 5,
                title: "International Food & Wine Festival",
                category: "food",
                categoryLabel: "Food & Drink",
                date: "2025-04-05",
                time: "12:00",
                endTime: "22:00",
                venue: "Pier 39",
                location: "San Francisco, CA",
                price: 89,
                image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop",
                description: "Taste cuisines from 30+ countries and sample wines from world-renowned vineyards. Cooking demos, tasting sessions, and culinary workshops included.",
                longDescription: "The International Food & Wine Festival brings together the world's finest cuisines and wines in one spectacular waterfront location. Over 100 vendors, celebrity chef demonstrations, wine pairing sessions, and hands-on cooking workshops await food enthusiasts.",
                organizer: "Culinary Events Group",
                organizerEmail: "festival@culinaryevents.com",
                organizerPhone: "+1 (555) 100-0005",
                tags: ["Food", "Wine", "Cooking Demos", "Tasting"],
                featured: true
            },
            {
                id: 6,
                title: "Marathon & Health Expo",
                category: "sports",
                categoryLabel: "Sports",
                date: "2025-05-12",
                time: "06:00",
                endTime: "14:00",
                venue: "Downtown City Center",
                location: "Boston, MA",
                price: 75,
                image: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&h=600&fit=crop",
                description: "Annual city marathon with 5K, 10K, half and full marathon options. Health expo with fitness vendors, nutrition experts, and wellness workshops.",
                longDescription: "Join 20,000+ runners for the annual Boston Marathon & Health Expo. Whether you're a seasoned marathoner or a first-time 5K runner, this event offers something for everyone. The health expo features 100+ vendors, free health screenings, and expert panels.",
                organizer: "Boston Athletic Association",
                organizerEmail: "marathon@baa.org",
                organizerPhone: "+1 (555) 100-0006",
                tags: ["Running", "Marathon", "Health", "Fitness"],
                featured: false
            },
            {
                id: 7,
                title: "Data Science & ML Workshop",
                category: "education",
                categoryLabel: "Education",
                date: "2025-03-25",
                time: "09:00",
                endTime: "17:00",
                venue: "Stanford University",
                location: "Palo Alto, CA",
                price: 399,
                image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
                description: "Intensive hands-on workshop covering machine learning fundamentals, deep learning, and practical applications. Led by industry experts and academics.",
                longDescription: "This comprehensive 3-day workshop covers the complete machine learning pipeline from data preparation to model deployment. Participants will work on real-world projects using Python, TensorFlow, and PyTorch under expert guidance.",
                organizer: "Stanford Continuing Studies",
                organizerEmail: "workshops@stanford.edu",
                organizerPhone: "+1 (555) 100-0007",
                tags: ["Machine Learning", "Python", "Data Science", "Workshop"],
                featured: false
            },
            {
                id: 8,
                title: "Wellness & Mindfulness Retreat",
                category: "health",
                categoryLabel: "Health & Wellness",
                date: "2025-04-18",
                time: "08:00",
                endTime: "20:00",
                venue: "Sedona Retreat Center",
                location: "Sedona, AZ",
                price: 449,
                image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=600&fit=crop",
                description: "Three-day wellness retreat featuring yoga, meditation, nutrition workshops, and holistic healing sessions in the beautiful red rocks of Sedona.",
                longDescription: "Escape to the stunning red rocks of Sedona for a transformative three-day wellness retreat. Daily yoga and meditation sessions, nutrition workshops with certified dietitians, sound healing, nature hikes, and organic farm-to-table meals.",
                organizer: "Serenity Wellness",
                organizerEmail: "retreats@serenitywellness.com",
                organizerPhone: "+1 (555) 100-0008",
                tags: ["Yoga", "Meditation", "Wellness", "Retreat"],
                featured: false
            },
            {
                id: 9,
                title: "Startup Pitch Competition",
                category: "business",
                categoryLabel: "Business",
                date: "2025-02-20",
                time: "13:00",
                endTime: "20:00",
                venue: "Y Combinator HQ",
                location: "Mountain View, CA",
                price: 0,
                image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=600&fit=crop",
                description: "Watch 20 innovative startups pitch to top VCs for $100K in funding. Networking reception with investors and entrepreneurs included.",
                longDescription: "The quarterly Startup Pitch Competition showcases the most promising early-stage startups. 20 selected companies pitch to a panel of top-tier VCs and angel investors competing for $100K in funding and mentorship packages.",
                organizer: "Y Combinator",
                organizerEmail: "events@ycombinator.com",
                organizerPhone: "+1 (555) 100-0009",
                tags: ["Startups", "VC", "Pitch", "Funding"],
                featured: false
            },
            {
                id: 10,
                title: "Jazz Night at the Blue Note",
                category: "music",
                categoryLabel: "Music & Concerts",
                date: "2025-03-08",
                time: "20:00",
                endTime: "23:30",
                venue: "Blue Note Jazz Club",
                location: "New York, NY",
                price: 65,
                image: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=800&h=600&fit=crop",
                description: "Intimate jazz evening featuring world-renowned musicians in the legendary Blue Note Jazz Club. Premium seating and dinner packages available.",
                longDescription: "Experience jazz at its finest in the iconic Blue Note Jazz Club. This intimate evening features a lineup of Grammy-winning artists in an historic venue that has hosted jazz legends for decades. Dinner and premium seating packages available.",
                organizer: "Blue Note Entertainment",
                organizerEmail: "bookings@bluenote.net",
                organizerPhone: "+1 (555) 100-0010",
                tags: ["Jazz", "Live Music", "Intimate Venue", "Dinner"],
                featured: false
            },
            {
                id: 11,
                title: "Digital Marketing Masterclass",
                category: "education",
                categoryLabel: "Education",
                date: "2025-03-30",
                time: "09:00",
                endTime: "16:00",
                venue: "Google Campus",
                location: "Mountain View, CA",
                price: 299,
                image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
                description: "Master the latest digital marketing strategies including SEO, social media, content marketing, and analytics. Google certified instructors.",
                longDescription: "This intensive masterclass covers the complete digital marketing ecosystem. Learn from Google certified experts about search optimization, paid advertising, social media strategy, content marketing, email automation, and analytics.",
                organizer: "Digital Marketing Institute",
                organizerEmail: "courses@dmi.com",
                organizerPhone: "+1 (555) 100-0011",
                tags: ["SEO", "Social Media", "Analytics", "Marketing"],
                featured: false
            },
            {
                id: 12,
                title: "Craft Beer & Food Pairing Festival",
                category: "food",
                categoryLabel: "Food & Drink",
                date: "2025-04-26",
                time: "13:00",
                endTime: "22:00",
                venue: "Denver Convention Center",
                location: "Denver, CO",
                price: 55,
                image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop",
                description: "Sample 100+ craft beers from local and national breweries paired with gourmet food. Brewing workshops and meet-the-brewer sessions.",
                longDescription: "The premier craft beer festival returns to Denver with over 100 breweries showcasing their finest creations. Expertly curated food pairings, brewing demonstrations, educational sessions with master brewers, and exclusive limited-release beers.",
                organizer: "Colorado Brewers Guild",
                organizerEmail: "festival@cobrewers.org",
                organizerPhone: "+1 (555) 100-0012",
                tags: ["Craft Beer", "Food Pairing", "Breweries", "Workshops"],
                featured: false
            },
            {
                id: 13,
                title: "Photography Masterclass Workshop",
                category: "arts",
                categoryLabel: "Arts & Culture",
                date: "2025-05-03",
                time: "08:00",
                endTime: "18:00",
                venue: "National Geographic HQ",
                location: "Washington, DC",
                price: 499,
                image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&h=600&fit=crop",
                description: "Learn from National Geographic photographers. Landscape, portrait, and wildlife photography techniques. Field shooting session included.",
                longDescription: "This exclusive workshop brings together world-renowned National Geographic photographers for an intensive day of learning. Morning classroom sessions cover composition, lighting, and storytelling, followed by an afternoon field shooting session.",
                organizer: "National Geographic",
                organizerEmail: "workshops@natgeo.com",
                organizerPhone: "+1 (555) 100-0013",
                tags: ["Photography", "National Geographic", "Workshop", "Field Session"],
                featured: false
            },
            {
                id: 14,
                title: "E-Sports Championship Finals",
                category: "sports",
                categoryLabel: "Sports",
                date: "2025-06-15",
                time: "10:00",
                endTime: "22:00",
                venue: "Staples Center",
                location: "Los Angeles, CA",
                price: 89,
                image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=600&fit=crop",
                description: "Watch the world's best e-sports teams compete for $1M prize pool. Multiple games, fan zone, meet-and-greets with pro players.",
                longDescription: "The E-Sports Championship Finals bring together the top 16 teams from around the world competing across multiple game titles for a $1 million prize pool. Fan zone with gaming stations, merchandise, and pro player meet-and-greets.",
                organizer: "ESL Gaming",
                organizerEmail: "finals@eslgaming.com",
                organizerPhone: "+1 (555) 100-0014",
                tags: ["E-Sports", "Gaming", "Championship", "Prize Pool"],
                featured: true
            },
            {
                id: 15,
                title: "Sustainable Living Expo",
                category: "education",
                categoryLabel: "Education",
                date: "2025-04-12",
                time: "10:00",
                endTime: "18:00",
                venue: "Oregon Convention Center",
                location: "Portland, OR",
                price: 15,
                image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=600&fit=crop",
                description: "Discover sustainable products, renewable energy solutions, and eco-friendly lifestyle tips. Workshops on zero-waste living and green technology.",
                longDescription: "The Sustainable Living Expo showcases the latest in green technology, sustainable products, and eco-friendly lifestyle solutions. 200+ exhibitors, expert panels on climate action, hands-on workshops, and family-friendly activities.",
                organizer: "Green Future Foundation",
                organizerEmail: "expo@greenfuture.org",
                organizerPhone: "+1 (555) 100-0015",
                tags: ["Sustainability", "Green Tech", "Zero Waste", "Eco-Friendly"],
                featured: false
            }
        ];
    },

    saveEvents() {
        localStorage.setItem('eventify_events', JSON.stringify(this.events));
    },

    loadRegistrations() {
        const stored = localStorage.getItem('eventify_registrations');
        this.registrations = stored ? JSON.parse(stored) : [];
    },

    saveRegistrations() {
        localStorage.setItem('eventify_registrations', JSON.stringify(this.registrations));
    },

    getEventById(id) {
        return this.events.find(e => e.id === parseInt(id));
    },

    getRegistrationsByEvent(eventId) {
        return this.registrations.filter(r => r.eventId === parseInt(eventId));
    },

    initNavigation() {
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const navLinks = document.getElementById('navLinks');

        if (mobileMenuBtn && navLinks) {
            mobileMenuBtn.addEventListener('click', () => {
                navLinks.classList.toggle('active');
                mobileMenuBtn.innerHTML = navLinks.classList.contains('active')
                    ? '<i class="fas fa-times"></i>'
                    : '<i class="fas fa-bars"></i>';
            });

            navLinks.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    navLinks.classList.remove('active');
                    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                });
            });
        }
    },

    initMobileMenu() {
        document.addEventListener('click', (e) => {
            const navLinks = document.getElementById('navLinks');
            const mobileMenuBtn = document.getElementById('mobileMenuBtn');

            if (navLinks && navLinks.classList.contains('active') &&
                !navLinks.contains(e.target) &&
                !mobileMenuBtn.contains(e.target)) {
                navLinks.classList.remove('active');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    },

    initScrollHeader() {
        const header = document.querySelector('.header');
        let lastScroll = 0;

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;

            if (currentScroll > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            lastScroll = currentScroll;
        });
    },

    updateActiveNavLink() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-links a');

        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage || (currentPage === '' && href === 'index.html')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    },

    showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;

        container.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideIn 0.3s ease reverse';
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    },

    formatDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    },

    formatTime(timeStr) {
        if (!timeStr) return '';
        const [hours, minutes] = timeStr.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    },

    formatCurrency(amount) {
        if (amount === 0) return 'Free';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    },

    generateBookingRef() {
        return 'EVT-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substr(2, 4).toUpperCase();
    },

    validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },

    validatePhone(phone) {
        return /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(phone);
    },

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    initContactForm() {
        const form = document.getElementById('contactForm');
        const successSection = document.getElementById('contactSuccess');
        const contactSection = document.querySelector('.contact-section');

        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            if (!this.validateContactForm(form)) {
                this.showToast('Please fix the errors above', 'error');
                return;
            }

            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            setTimeout(() => {
                if (contactSection) contactSection.style.display = 'none';
                if (successSection) successSection.style.display = 'block';
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                this.showToast('Message sent successfully!', 'success');
            }, 1000);
        });

        const fields = [
            { id: 'contactName', validate: (v) => v.trim().length >= 2, message: 'Name must be at least 2 characters' },
            { id: 'contactEmail', validate: (v) => this.validateEmail(v), message: 'Please enter a valid email address' },
            { id: 'contactSubject', validate: (v) => v !== '', message: 'Please select a subject' },
            { id: 'contactMessage', validate: (v) => v.trim().length >= 10, message: 'Message must be at least 10 characters' }
        ];

        fields.forEach(field => {
            const input = document.getElementById(field.id);
            if (input) {
                input.addEventListener('blur', () => this.validateField(field));
                input.addEventListener('input', () => this.clearError(field.id));
            }
        });
    },

    validateContactForm(form) {
        const fields = [
            { id: 'contactName', validate: (v) => v.trim().length >= 2, message: 'Name must be at least 2 characters' },
            { id: 'contactEmail', validate: (v) => this.validateEmail(v), message: 'Please enter a valid email address' },
            { id: 'contactSubject', validate: (v) => v !== '', message: 'Please select a subject' },
            { id: 'contactMessage', validate: (v) => v.trim().length >= 10, message: 'Message must be at least 10 characters' }
        ];

        let isValid = true;
        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
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

    animateStats() {
        const statNumbers = document.querySelectorAll('.stat-number[data-count]');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseInt(el.dataset.count);
                    this.animateNumber(el, 0, target, 2000);
                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.5 });

        statNumbers.forEach(el => observer.observe(el));
    },

    animateNumber(element, start, end, duration) {
        const startTime = performance.now();
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const current = Math.floor(start + (end - start) * this.easeOutQuart(progress));
            element.textContent = current.toLocaleString();
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.textContent = end.toLocaleString();
            }
        };
        requestAnimationFrame(animate);
    },

    easeOutQuart(t) {
        return 1 - Math.pow(1 - t, 4);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    Eventify.init();
    Eventify.initContactForm();
    Eventify.animateStats();
});

window.Eventify = Eventify;
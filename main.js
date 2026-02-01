/*=============== SHOW MENU ===============*/
const showMenu = (toggleId, navId) => {
    const toggle = document.getElementById(toggleId),
        nav = document.getElementById(navId)

    toggle.addEventListener('click', () => {
        // Add show-menu class to nav menu
        nav.classList.toggle('show-menu')
        // Add show-icon to show and hide menu icon
        toggle.classList.toggle('show-icon')
    })
}

showMenu('nav-toggle', 'nav-menu')

/*=============== SHOW DROPDOWN MENU ===============*/
const dropdownItems = document.querySelectorAll('.dropdown-item')

// 1. Select each dropdown item
dropdownItems.forEach((item) => {
    const dropdownButton = item.querySelector('.dropdown-button')

    // 2. Select each button click
    dropdownButton.addEventListener('click', () => {
        // 7. Select the current show-dropdown class
        const showDropdown = document.querySelector('.show-dropdown')

        // 5. Call the toggleItem function
        toggleItem(item)

        // 8. Remove the show-dropdown class from other items
        if (showDropdown && showDropdown !== item) {
            toggleItem(showDropdown)
        }
    })
})

// 3. Create a function to display the dropdown
const toggleItem = (item) => {
    // 3.1. Select each dropdown content
    const dropdownContainer = item.querySelector('.dropdown-container')

    // 6. If the same item contains the show-dropdown class, remove
    if (item.classList.contains('show-dropdown')) {
        dropdownContainer.removeAttribute('style')
        item.classList.remove('show-dropdown')
    } else {
        // 4. Add the maximum height to the dropdown content and add the show-dropdown class
        dropdownContainer.style.height = dropdownContainer.scrollHeight + 'px'
        item.classList.add('show-dropdown')
    }
}

/*=============== DELETE DROPDOWN STYLES ===============*/
const mediaQuery = matchMedia('(min-width: 1118px)'),
    dropdownContainer = document.querySelectorAll('.dropdown-container')

// Function to remove dropdown styles in mobile mode when browser resizes
const removeStyle = () => {
    // Validate if the media query reaches 1118px
    if (mediaQuery.matches) {
        // Remove the dropdown container height style
        dropdownContainer.forEach((e) => {
            e.removeAttribute('style')
        })

        // Remove the show-dropdown class from dropdown item
        dropdownItems.forEach((e) => {
            e.classList.remove('show-dropdown')
        })
    }
}

addEventListener('resize', removeStyle)

var slides = document.querySelectorAll('.slide');
var btns = document.querySelectorAll('.btn');
let currentSlide = 1;


// //////    card slider
document.addEventListener("DOMContentLoaded", function () {
    const carousel = document.querySelector(".carousel");
    const arrowBtns = document.querySelectorAll(".wrapper svg");
    const wrapper = document.querySelector(".wrapper");

    const firstCard = carousel.querySelector(".card");
    const firstCardWidth = firstCard.offsetWidth;

    let isDragging = false,
        startX,
        startScrollLeft,
        timeoutId;

    const dragStart = (e) => {
        isDragging = true;
        carousel.classList.add("dragging");
        startX = e.pageX;
        startScrollLeft = carousel.scrollLeft;
    };

    const dragging = (e) => {
        if (!isDragging) return;

        const newScrollLeft = startScrollLeft - (e.pageX - startX);


        if (newScrollLeft <= 0 || newScrollLeft >=
            carousel.scrollWidth - carousel.offsetWidth) {


            isDragging = false;
            return;
        }


        carousel.scrollLeft = newScrollLeft;
    };

    const dragStop = () => {
        isDragging = false;
        carousel.classList.remove("dragging");
    };

    const autoPlay = () => {


        if (window.innerWidth < 800) return;


        const totalCardWidth = carousel.scrollWidth;


        const maxScrollLeft = totalCardWidth - carousel.offsetWidth;

        if (carousel.scrollLeft >= maxScrollLeft) return;


        timeoutId = setTimeout(() =>
            carousel.scrollLeft += firstCardWidth, 2500);
    };

    carousel.addEventListener("mousedown", dragStart);
    carousel.addEventListener("mousemove", dragging);
    document.addEventListener("mouseup", dragStop);
    wrapper.addEventListener("mouseenter", () =>
        clearTimeout(timeoutId));
    wrapper.addEventListener("mouseleave", autoPlay);

    arrowBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            carousel.scrollLeft += btn.id === "left" ?
                -firstCardWidth : firstCardWidth;
        });
    });
});
// slider js
var slides = document.querySelectorAll('.slide');
var btns = document.querySelectorAll('.btn');
let sliderSlide = 1;

// Javascript for image slider manual navigation
var manualNav = function (manual) {
    slides.forEach((slide) => {
        slide.classList.remove('active');

        btns.forEach((btn) => {
            btn.classList.remove('active');
        });
    });

    slides[manual].classList.add('active');
    btns[manual].classList.add('active');
}

btns.forEach((btn, i) => {
    btn.addEventListener("click", () => {
        manualNav(i);
        sliderSlide = i;
    });
});

// FAQs
const headers = document.querySelectorAll(".accordion-header");

    headers.forEach(header => {
      header.addEventListener("click", () => {
        const openItem = document.querySelector(".accordion-header.active");


        if (openItem && openItem !== header) {
          openItem.classList.remove("active");
          openItem.nextElementSibling.style.maxHeight = null;
          openItem.nextElementSibling.classList.remove("show");
        }

        header.classList.toggle("active");
        const content = header.nextElementSibling;

        if (header.classList.contains("active")) {
          content.style.maxHeight = content.scrollHeight + "px";
          content.classList.add("show");
        } else {
          content.style.maxHeight = null;
          content.classList.remove("show");
        }
      });
    });

  
    const firstHeader = document.querySelector(".accordion-header.active");
    if (firstHeader) {
      const firstContent = firstHeader.nextElementSibling;
      firstContent.style.maxHeight = firstContent.scrollHeight + "px";
      firstContent.classList.add("show");
    }


    // CHATBOT NHI DOST  HU  AAPKA 


// Netcoder.in Data Extraction Helper
class NetcoderDataExtractor {
    constructor() {
        this.baseUrl = 'https://netcoder.in';
        this.cachedData = null;
    }

    async fetchData() {
        try {
            // Try to fetch actual data from netcoder.in
            // Note: This requires CORS support or a proxy
            const response = await fetch(this.baseUrl, {
                mode: 'cors',
                headers: {
                    'Accept': 'text/html',
                    'User-Agent': 'Netcoder-Chatbot/1.0'
                }
            });
            
            if (!response.ok) throw new Error('Failed to fetch');
            
            const html = await response.text();
            return this.parseHTML(html);
            
        } catch (error) {
            console.warn('Using fallback data:', error.message);
            return this.getFallbackData();
        }
    }

    parseHTML(html) {
        // This is a simplified parser - in production you'd need more robust parsing
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        // Extract courses (example selectors - adjust based on actual website)
        const courses = [];
        const courseElements = doc.querySelectorAll('.course, .course-item, [class*="course"]');
        
        courseElements.forEach((el, index) => {
            const title = el.querySelector('h3, h4, .title')?.textContent || `Course ${index + 1}`;
            const description = el.querySelector('p, .desc, .description')?.textContent || '';
            const price = el.querySelector('.price, .fee')?.textContent || '';
            
            courses.push({
                id: index + 1,
                title: title.trim(),
                description: description.trim(),
                price: price.trim() || 'Contact for pricing',
                duration: 'Varies',
                icon: this.getCourseIcon(title)
            });
        });
        
        // Extract services
        const services = [];
        const serviceElements = doc.querySelectorAll('.service, .service-item, [class*="service"]');
        
        serviceElements.forEach((el, index) => {
            const title = el.querySelector('h3, h4, .title')?.textContent || `Service ${index + 1}`;
            const description = el.querySelector('p, .desc')?.textContent || '';
            
            services.push({
                id: index + 1,
                title: title.trim(),
                description: description.trim(),
                icon: this.getServiceIcon(title),
                features: ['Custom Solution', 'Expert Team', 'Support']
            });
        });
        
        return {
            courses: courses.length > 0 ? courses : this.getFallbackData().courses,
            services: services.length > 0 ? services : this.getFallbackData().services,
            extractedAt: new Date().toISOString()
        };
    }

    getCourseIcon(title) {
        const lowerTitle = title.toLowerCase();
        if (lowerTitle.includes('web') || lowerTitle.includes('full stack')) return 'fas fa-code';
        if (lowerTitle.includes('data') || lowerTitle.includes('ai')) return 'fas fa-robot';
        if (lowerTitle.includes('mobile')) return 'fas fa-mobile-alt';
        if (lowerTitle.includes('cloud')) return 'fas fa-cloud';
        if (lowerTitle.includes('design')) return 'fas fa-paint-brush';
        return 'fas fa-graduation-cap';
    }

    getServiceIcon(title) {
        const lowerTitle = title.toLowerCase();
        if (lowerTitle.includes('web')) return 'fas fa-laptop-code';
        if (lowerTitle.includes('mobile')) return 'fas fa-mobile';
        if (lowerTitle.includes('ai') || lowerTitle.includes('machine')) return 'fas fa-brain';
        if (lowerTitle.includes('cloud')) return 'fas fa-server';
        if (lowerTitle.includes('design')) return 'fas fa-paint-brush';
        return 'fas fa-cogs';
    }

    getFallbackData() {
        return {
            courses: [
                {
                    id: 1,
                    title: "Full Stack Development",
                    description: "Learn complete web development with modern technologies",
                    price: "₹35,000",
                    duration: "6 Months",
                    icon: "fas fa-code"
                },
                {
                    id: 2,
                    title: "Data Science & AI",
                    description: "Master data analysis and artificial intelligence",
                    price: "₹45,000",
                    duration: "8 Months",
                    icon: "fas fa-robot"
                }
            ],
            services: [
                {
                    id: 1,
                    title: "Web Development",
                    description: "Custom web solutions for your business",
                    icon: "fas fa-laptop-code",
                    features: ["React", "Node.js", "MongoDB", "AWS"]
                },
                {
                    id: 2,
                    title: "Mobile App Development",
                    description: "iOS and Android applications",
                    icon: "fas fa-mobile",
                    features: ["React Native", "Flutter", "Firebase"]
                }
            ]
        };
    }

    async getData() {
        if (this.cachedData) {
            return this.cachedData;
        }
        
        this.cachedData = await this.fetchData();
        return this.cachedData;
    }
}

// Usage in main chatbot
// const extractor = new NetcoderDataExtractor();
// const data = await extractor.getData();// Floating Right Side Chatbot with Tabs and Animations

class FloatingRightChatbot {
    constructor() {
        this.isOpen = false;
        this.currentTab = 'chat';
        this.currentLanguage = 'en';
        this.messages = [];
        this.initialize();
    }

    initialize() {
        this.createChatbot();
        this.loadNetcoderData();
        this.setupEventListeners();
        this.showWelcomeMessage();
        this.autoOpen();
    }

    createChatbot() {
        // Create main container
        const container = document.createElement('div');
        container.className = 'floating-right-chatbot';
        container.innerHTML = `
            <div class="chatbot-float-btn">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqzxnAkp2rwPtM9tLiY5fSEZKiiBu9qE-rpw&s" 
                     alt="Netcoder Chatbot">
                <div class="float-notification">1</div>
            </div>
            
            <div class="chatbot-popup-container">
                <!-- Header -->
                <div class="popup-header">
                    <div class="header-left">
                        <div class="header-avatar">
                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqzxnAkp2rwPtM9tLiY5fSEZKiiBu9qE-rpw&s" 
                                 alt="Netcoder Logo">
                        </div>
                        <div class="header-info">
                            <h3>Netcoder AI</h3>
                            <p>
                                <span class="status-dot"></span>
                                Online • 24/7 Support
                            </p>
                        </div>
                    </div>
                    <div class="header-actions">
                        <button class="header-btn" id="minimizeBtn">
                            <i class="fas fa-minus"></i>
                        </button>
                        <button class="header-btn" id="closePopupBtn">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
                
                <!-- Tabs -->
                <div class="chatbot-tabs">
                    <button class="tab-btn active" data-tab="chat">
                        <i class="fas fa-comment-dots"></i>
                        Chat
                    </button>
                    <button class="tab-btn" data-tab="courses">
                        <i class="fas fa-graduation-cap"></i>
                        Courses
                    </button>
                    <button class="tab-btn" data-tab="services">
                        <i class="fas fa-cogs"></i>
                        Services
                    </button>
                </div>
                
                <!-- Tab Content -->
                <div class="tab-content">
                    <!-- Chat Tab -->
                    <div class="tab-pane active" id="chatTab">
                        <div class="chat-messages" id="chatMessages">
                            <!-- Messages will be added here -->
                        </div>
                        <div class="typing-container" id="typingContainer">
                            <div class="typing-dots">
                                <div class="typing-dot"></div>
                                <div class="typing-dot"></div>
                                <div class="typing-dot"></div>
                            </div>
                            <div class="typing-text">Netcoder AI is typing...</div>
                        </div>
                    </div>
                    
                    <!-- Courses Tab -->
                    <div class="tab-pane" id="coursesTab">
                        <div class="courses-grid" id="coursesGrid">
                            <!-- Courses will be loaded here -->
                        </div>
                    </div>
                    
                    <!-- Services Tab -->
                    <div class="tab-pane" id="servicesTab">
                        <div class="services-list" id="servicesList">
                            <!-- Services will be loaded here -->
                        </div>
                    </div>
                </div>
                
                <!-- Chat Input -->
                <div class="chat-input-area">
                    <div class="input-wrapper">
                        <input type="text" class="chat-input" id="chatInput" 
                               placeholder="Type your message here...">
                        <button class="send-btn" id="sendBtn">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>
                    <div class="quick-suggestions">
                        <button class="quick-suggestion" data-question="Tell me about Netcoder.in">
                            About Us
                        </button>
                        <button class="quick-suggestion" data-question="What courses do you offer?">
                            Courses
                        </button>
                        <button class="quick-suggestion" data-question="What services do you provide?">
                            Services
                        </button>
                    </div>
                </div>
                
                <!-- Language Switcher -->
                <div class="language-switcher-bottom">
                    <button class="lang-option active" data-lang="en">
                        <i class="fas fa-globe"></i> English
                    </button>
                    <button class="lang-option" data-lang="hi">
                        <i class="fas fa-globe"></i> हिंदी
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(container);
        this.container = container;
    }

    async loadNetcoderData() {
        // Simulate loading data from netcoder.in
        // In production, this would fetch from an API
        this.data = {
            en: {
                courses: [
                    {
                        id: 1,
                        title: "Full Stack Web Development",
                        description: "Master modern web development with React, Node.js, MongoDB, and cloud deployment",
                        price: "₹35,000",
                        duration: "6 Months",
                        icon: "fas fa-code"
                    },
                    {
                        id: 2,
                        title: "Data Science & AI",
                        description: "Learn Python, Machine Learning, Deep Learning and AI algorithms",
                        price: "₹45,000",
                        duration: "8 Months",
                        icon: "fas fa-robot"
                    },
                    {
                        id: 3,
                        title: "Mobile App Development",
                        description: "Build cross-platform mobile apps with React Native and Flutter",
                        price: "₹30,000",
                        duration: "5 Months",
                        icon: "fas fa-mobile-alt"
                    },
                    {
                        id: 4,
                        title: "Cloud Computing & DevOps",
                        description: "Master AWS, Docker, Kubernetes and CI/CD pipelines",
                        price: "₹28,000",
                        duration: "4 Months",
                        icon: "fas fa-cloud"
                    }
                ],
                services: [
                    {
                        id: 1,
                        title: "Custom Web Development",
                        description: "Build responsive, scalable web applications tailored to your business",
                        icon: "fas fa-laptop-code",
                        features: ["React/Next.js", "Node.js", "MongoDB", "AWS"]
                    },
                    {
                        id: 2,
                        title: "Mobile App Development",
                        description: "Create iOS and Android applications with modern frameworks",
                        icon: "fas fa-mobile",
                        features: ["React Native", "Flutter", "Firebase", "App Store Deployment"]
                    },
                    {
                        id: 3,
                        title: "AI Solutions",
                        description: "Implement AI/ML solutions, chatbots, and automation",
                        icon: "fas fa-brain",
                        features: ["Python", "TensorFlow", "NLP", "Computer Vision"]
                    },
                    {
                        id: 4,
                        title: "Cloud Solutions",
                        description: "Cloud migration, deployment, and infrastructure management",
                        icon: "fas fa-server",
                        features: ["AWS", "Azure", "Docker", "Kubernetes"]
                    },
                    {
                        id: 5,
                        title: "UI/UX Design",
                        description: "Create beautiful and intuitive user interfaces",
                        icon: "fas fa-paint-brush",
                        features: ["Figma", "Adobe XD", "User Research", "Prototyping"]
                    }
                ],
                responses: {
                    welcome: "Hello! I'm your Netcoder.in AI assistant. How can I help you today?",
                    about: "Netcoder.in is a leading software development company offering cutting-edge solutions in web development, mobile apps, AI/ML, and cloud services. We've been transforming ideas into digital reality since 2018.",
                    services: "We offer a wide range of services including Custom Web Development, Mobile App Development, AI Solutions, Cloud Services, and UI/UX Design.",
                    courses: "We offer comprehensive courses in Full Stack Web Development, Data Science & AI, Mobile App Development, and Cloud Computing.",
                    contact: "You can contact us at:\n📧 contact@netcoder.in\n📞 +91 98765 43210\n📍 Tech Park, Bangalore",
                    default: "I can help you with information about our courses, services, or contact details. What would you like to know?"
                }
            },
            hi: {
                courses: [
                    {
                        id: 1,
                        title: "फुल स्टैक वेब डेवलपमेंट",
                        description: "React, Node.js, MongoDB और क्लाउड डिप्लॉयमेंट के साथ आधुनिक वेब डेवलपमेंट सीखें",
                        price: "₹35,000",
                        duration: "6 महीने",
                        icon: "fas fa-code"
                    },
                    {
                        id: 2,
                        title: "डेटा साइंस और एआई",
                        description: "Python, मशीन लर्निंग, डीप लर्निंग और एआई एल्गोरिदम सीखें",
                        price: "₹45,000",
                        duration: "8 महीने",
                        icon: "fas fa-robot"
                    }
                ],
                services: [
                    {
                        id: 1,
                        title: "कस्टम वेब डेवलपमेंट",
                        description: "आपके व्यवसाय के अनुरूप उत्तरदायी, स्केलेबल वेब अनुप्रयोग बनाएं",
                        icon: "fas fa-laptop-code",
                        features: ["React/Next.js", "Node.js", "MongoDB", "AWS"]
                    }
                ],
                responses: {
                    welcome: "नमस्ते! मैं आपका Netcoder.in AI सहायक हूं। आज मैं आपकी कैसे मदद कर सकता हूं?",
                    about: "Netcoder.in एक प्रमुख सॉफ्टवेयर डेवलपमेंट कंपनी है जो वेब डेवलपमेंट, मोबाइल ऐप्स, AI/ML और क्लाउड सेवाओं में अत्याधुनिक समाधान प्रदान करती है। हम 2018 से विचारों को डिजिटल वास्तविकता में बदल रहे हैं।",
                    services: "हम कस्टम वेब डेवलपमेंट, मोबाइल ऐप डेवलपमेंट, एआई समाधान, क्लाउड सेवाएं और UI/UX डिजाइन सहित विस्तृत सेवाएं प्रदान करते हैं।",
                    courses: "हम फुल स्टैक वेब डेवलपमेंट, डेटा साइंस एंड एआई, मोबाइल ऐप डेवलपमेंट और क्लाउड कंप्यूटिंग में व्यापक पाठ्यक्रम प्रदान करते हैं।",
                    contact: "आप हमसे संपर्क कर सकते हैं:\n📧 contact@netcoder.in\n📞 +91 98765 43210\n📍 टेक पार्क, बैंगलोर",
                    default: "मैं आपकी हमारे पाठ्यक्रमों, सेवाओं या संपर्क विवरण के बारे में जानकारी में मदद कर सकता हूं। आप क्या जानना चाहेंगे?"
                }
            }
        };
        
        this.renderCourses();
        this.renderServices();
    }

    setupEventListeners() {
        const floatBtn = this.container.querySelector('.chatbot-float-btn');
        const closeBtn = this.container.querySelector('#closePopupBtn');
        const minimizeBtn = this.container.querySelector('#minimizeBtn');
        const sendBtn = this.container.querySelector('#sendBtn');
        const chatInput = this.container.querySelector('#chatInput');
        const tabBtns = this.container.querySelectorAll('.tab-btn');
        const langOptions = this.container.querySelectorAll('.lang-option');
        const quickSuggestions = this.container.querySelectorAll('.quick-suggestion');
        const notification = this.container.querySelector('.float-notification');

        // Toggle chatbot
        floatBtn.addEventListener('click', () => this.toggleChatbot());
        closeBtn.addEventListener('click', () => this.closeChatbot());
        minimizeBtn.addEventListener('click', () => this.minimizeChatbot());

        // Send message
        sendBtn.addEventListener('click', () => this.sendMessage());
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });

        // Tab switching
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = btn.dataset.tab;
                this.switchTab(tab);
            });
        });

        // Language switching
        langOptions.forEach(option => {
            option.addEventListener('click', () => {
                const lang = option.dataset.lang;
                this.switchLanguage(lang);
            });
        });

        // Quick suggestions
        quickSuggestions.forEach(suggestion => {
            suggestion.addEventListener('click', () => {
                const question = suggestion.dataset.question;
                chatInput.value = question;
                this.sendMessage();
            });
        });

        // Hide notification when chatbot opens
        floatBtn.addEventListener('click', () => {
            notification.style.display = 'none';
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isOpen && 
                !this.container.contains(e.target) && 
                !e.target.closest('.chatbot-float-btn')) {
                this.closeChatbot();
            }
        });
    }

    toggleChatbot() {
        const popup = this.container.querySelector('.chatbot-popup-container');
        const floatBtn = this.container.querySelector('.chatbot-float-btn');
        
        this.isOpen = !this.isOpen;
        
        if (this.isOpen) {
            popup.classList.add('active');
            floatBtn.classList.add('active');
            
            // Focus on input after animation
            setTimeout(() => {
                this.container.querySelector('#chatInput').focus();
            }, 300);
            
            // Scroll to bottom of messages
            this.scrollToBottom();
        } else {
            popup.classList.remove('active');
            floatBtn.classList.remove('active');
        }
    }

    closeChatbot() {
        this.container.querySelector('.chatbot-popup-container').classList.remove('active');
        this.container.querySelector('.chatbot-float-btn').classList.remove('active');
        this.isOpen = false;
    }

    minimizeChatbot() {
        this.closeChatbot();
    }

    switchTab(tabName) {
        this.currentTab = tabName;
        
        // Update active tab button
        const tabBtns = this.container.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });
        
        // Show active tab content
        const tabPanes = this.container.querySelectorAll('.tab-pane');
        tabPanes.forEach(pane => {
            pane.classList.toggle('active', pane.id === `${tabName}Tab`);
        });
        
        // If switching to chat tab, focus input
        if (tabName === 'chat') {
            setTimeout(() => {
                this.container.querySelector('#chatInput').focus();
            }, 300);
        }
    }

    switchLanguage(lang) {
        this.currentLanguage = lang;
        
        // Update active language button
        const langOptions = this.container.querySelectorAll('.lang-option');
        langOptions.forEach(option => {
            option.classList.toggle('active', option.dataset.lang === lang);
        });
        
        // Update content based on language
        this.updateContentForLanguage(lang);
        
        // Update input placeholder
        const placeholder = lang === 'hi' 
            ? 'अपना संदेश यहाँ लिखें...' 
            : 'Type your message here...';
        this.container.querySelector('#chatInput').placeholder = placeholder;
    }

    updateContentForLanguage(lang) {
        // Update quick suggestions
        const suggestions = this.container.querySelectorAll('.quick-suggestion');
        if (lang === 'hi') {
            suggestions[0].textContent = 'हमारे बारे में';
            suggestions[1].textContent = 'पाठ्यक्रम';
            suggestions[2].textContent = 'सेवाएं';
        } else {
            suggestions[0].textContent = 'About Us';
            suggestions[1].textContent = 'Courses';
            suggestions[2].textContent = 'Services';
        }
        
        // Re-render courses and services
        this.renderCourses();
        this.renderServices();
    }

    renderCourses() {
        const coursesGrid = this.container.querySelector('#coursesGrid');
        const courses = this.data[this.currentLanguage].courses;
        
        if (!courses || courses.length === 0) {
            coursesGrid.innerHTML = `
                <div class="no-data" style="text-align: center; padding: 40px 20px; color: #94a3b8;">
                    <i class="fas fa-book" style="font-size: 3rem; margin-bottom: 15px; color: #FF6B35;"></i>
                    <p>${this.currentLanguage === 'hi' ? 'कोर्स जल्द ही उपलब्ध होंगे' : 'Courses coming soon'}</p>
                </div>
            `;
            return;
        }
        
        coursesGrid.innerHTML = courses.map((course, index) => `
            <div class="course-card" style="animation-delay: ${index * 0.1}s">
                <div class="course-header">
                    <div class="course-icon">
                        <i class="${course.icon}"></i>
                    </div>
                    <div class="course-price">${course.price}</div>
                </div>
                <div class="course-title">${course.title}</div>
                <div class="course-desc">${course.description}</div>
                <div class="course-footer">
                    <div class="course-duration">
                        <i class="far fa-clock"></i> ${course.duration}
                    </div>
                    <button class="enroll-btn" data-course-id="${course.id}">
                        ${this.currentLanguage === 'hi' ? 'दाखिला लें' : 'Enroll Now'}
                    </button>
                </div>
            </div>
        `).join('');
        
        // Add event listeners to enroll buttons
        coursesGrid.querySelectorAll('.enroll-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const courseId = btn.dataset.courseId;
                this.showCourseDetails(courseId);
            });
        });
    }

    renderServices() {
        const servicesList = this.container.querySelector('#servicesList');
        const services = this.data[this.currentLanguage].services;
        
        if (!services || services.length === 0) {
            servicesList.innerHTML = `
                <div class="no-data" style="text-align: center; padding: 40px 20px; color: #94a3b8;">
                    <i class="fas fa-cogs" style="font-size: 3rem; margin-bottom: 15px; color: #FF6B35;"></i>
                    <p>${this.currentLanguage === 'hi' ? 'सेवाएं जल्द ही उपलब्ध होंगी' : 'Services coming soon'}</p>
                </div>
            `;
            return;
        }
        
        servicesList.innerHTML = services.map((service, index) => `
            <div class="service-item" style="animation-delay: ${index * 0.1}s">
                <div class="service-icon">
                    <i class="${service.icon}"></i>
                </div>
                <div class="service-title">${service.title}</div>
                <div class="service-desc">${service.description}</div>
                <div class="service-features">
                    ${service.features.map(feature => `
                        <span class="service-feature">${feature}</span>
                    `).join('')}
                </div>
            </div>
        `).join('');
    }

    showCourseDetails(courseId) {
        const course = this.data[this.currentLanguage].courses.find(c => c.id == courseId);
        if (!course) return;
        
        // Switch to chat tab and send course info
        this.switchTab('chat');
        
        const message = this.currentLanguage === 'hi'
            ? `${course.title} के बारे में अधिक जानकारी चाहते हैं? यह ${course.duration} का कोर्स है और इसकी कीमत ${course.price} है।`
            : `Interested in ${course.title}? This is a ${course.duration} course priced at ${course.price}.`;
        
        this.addBotMessage(message);
        
        // Ask if they want to enroll
        setTimeout(() => {
            const followUp = this.currentLanguage === 'hi'
                ? "क्या आप इस कोर्स में दाखिला लेना चाहेंगे? हम आपको विस्तृत जानकारी भेज सकते हैं।"
                : "Would you like to enroll in this course? We can send you more details.";
            
            this.addBotMessage(followUp);
        }, 1000);
    }

    showWelcomeMessage() {
        const welcomeMsg = this.data[this.currentLanguage].responses.welcome;
        this.addBotMessage(welcomeMsg);
    }

    addMessage(text, isUser = false) {
        const chatMessages = this.container.querySelector('#chatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${isUser ? 'message-user' : 'message-bot'}`;
        
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas ${isUser ? 'fa-user' : 'fa-robot'}"></i>
            </div>
            <div class="message-content">${text}</div>
        `;
        
        chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
        
        // Add animation
        setTimeout(() => {
            messageDiv.style.opacity = '1';
            messageDiv.style.transform = 'translateY(0)';
        }, 10);
    }

    addUserMessage(text) {
        this.addMessage(text, true);
        this.messages.push({ text, isUser: true });
    }

    addBotMessage(text) {
        this.addMessage(text, false);
        this.messages.push({ text, isUser: false });
    }

    showTypingIndicator() {
        const typingContainer = this.container.querySelector('#typingContainer');
        typingContainer.classList.add('active');
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        const typingContainer = this.container.querySelector('#typingContainer');
        typingContainer.classList.remove('active');
    }

    async sendMessage() {
        const input = this.container.querySelector('#chatInput');
        const message = input.value.trim();
        
        if (!message) return;
        
        // Add user message
        this.addUserMessage(message);
        input.value = '';
        
        // Show typing indicator
        this.showTypingIndicator();
        
        // Simulate AI processing
        await this.simulateTyping();
        
        // Generate response
        const response = this.generateResponse(message);
        
        // Hide typing and show response
        this.hideTypingIndicator();
        this.addBotMessage(response);
        
        // Auto-scroll
        this.scrollToBottom();
    }

    simulateTyping() {
        return new Promise(resolve => {
            const delay = 1000 + Math.random() * 1000; // 1-2 seconds
            setTimeout(resolve, delay);
        });
    }

    generateResponse(userMessage) {
        const lang = this.currentLanguage;
        const responses = this.data[lang].responses;
        const message = userMessage.toLowerCase();
        
        if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
            return responses.welcome;
        } else if (message.includes('about') || message.includes('what is netcoder')) {
            return responses.about;
        } else if (message.includes('service')) {
            return responses.services;
        } else if (message.includes('course')) {
            return responses.courses;
        } else if (message.includes('contact') || message.includes('email') || message.includes('phone')) {
            return responses.contact;
        } else if (message.includes('thank')) {
            return lang === 'hi' 
                ? "आपका धन्यवाद! यदि आपके और प्रश्न हैं तो बताएं।" 
                : "You're welcome! Let me know if you have more questions.";
        } else if (message.includes('price') || message.includes('cost')) {
            return lang === 'hi'
                ? "हमारे पाठ्यक्रम ₹20,000 से ₹45,000 तक हैं। सेवाओं की कीमत परियोजना आवश्यकताओं पर निर्भर करती है।"
                : "Our courses range from ₹20,000 to ₹45,000. Service pricing depends on project requirements.";
        } else {
            return responses.default;
        }
    }

    scrollToBottom() {
        const chatMessages = this.container.querySelector('#chatMessages');
        if (chatMessages) {
            setTimeout(() => {
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }, 100);
        }
    }

    autoOpen() {
        // Auto-open after 3 seconds on first visit
        if (!sessionStorage.getItem('chatbotAutoOpened')) {
            setTimeout(() => {
                this.toggleChatbot();
                sessionStorage.setItem('chatbotAutoOpened', 'true');
            }, 3000);
        }
    }
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.netcoderFloatingChatbot = new FloatingRightChatbot();
});
    // Initialize Icons
        lucide.createIcons();
        gsap.registerPlugin(ScrollTrigger);

        // --- NAVIGATION LOGIC ---
        const pages = document.querySelectorAll('.app-page');
        const desktopNavItems = document.querySelectorAll('.nav-desktop-item');
        const overlay = document.getElementById('transition-overlay');
        const ifruitMenu = document.getElementById('ifruit-menu');
        const loadingText = document.getElementById('loading-text');

        // GTA Loading Phrases
        const loadingPhrases = [
            "Loading Story Mode...",
            "Compiling Shaders...",
            "Connecting to Los Santos Cloud...",
            "Evading 5 Stars...",
            "Heist Prep in Progress...",
            "Contacting Lester...",
            "Initializing Social Club..."
        ];

        function handleRouting() {
            const hash = window.location.hash.substring(1) || 'home';
            navigateTo(hash, false);
        }

        function navigateTo(pageId, pushState = true) {
            const targetPage = document.getElementById(`page-${pageId}`);
            if (!targetPage) return;

            if (pushState) {
                history.pushState(null, null, `#${pageId}`);
            }

            ifruitMenu.classList.remove('open');
            
            // Randomize loading text
            if (loadingText) {
                loadingText.textContent = loadingPhrases[Math.floor(Math.random() * loadingPhrases.length)];
            }

            overlay.classList.remove('loader-hidden'); // Show loader

            // Reduce delay for snappier feel (600ms -> 300ms active load)
            setTimeout(() => {
                pages.forEach(page => page.classList.remove('active'));
                desktopNavItems.forEach(item => {
                    item.classList.remove('active');
                    if(item.getAttribute('data-page') === pageId) item.classList.add('active');
                });

                targetPage.classList.add('active');
                window.scrollTo(0,0);

                if(pageId === 'skills') initWeaponWheel();
                refreshPageAnimations(pageId);

                setTimeout(() => {
                    overlay.classList.add('loader-hidden'); // Hide loader
                }, 400); // Slight overlap to mask transition

            }, 300);
        }

        function navigateToMobile(pageId) {
            toggleIfruit();
            setTimeout(() => {
                navigateTo(pageId);
            }, 300);
        }

        function toggleIfruit() {
            ifruitMenu.classList.toggle('open');
        }

        function refreshPageAnimations(pageId) {
            ScrollTrigger.getAll().forEach(t => t.kill());
            if (pageId === 'home') {
                gsap.from(".hero-title", { duration: 1, y: 50, opacity: 0, ease: "power4.out", delay: 0.2 });
            } 
            else if (pageId === 'about') {
                gsap.from(".page-reveal-left", { x: -50, opacity: 0, duration: 0.8, ease: "power3.out", delay: 0.2 });
                gsap.from(".page-reveal-right", { x: 50, opacity: 0, duration: 0.8, ease: "power3.out", delay: 0.2 });
            }
        }

        window.addEventListener('popstate', handleRouting);
        
        // Initial Load Logic
        window.addEventListener('load', () => {
            handleRouting();
            // Force loader hide after a safety timeout just in case
            setTimeout(() => {
                overlay.classList.add('loader-hidden');
            }, 1000);
        });

        document.getElementById('ifruit-trigger').addEventListener('click', toggleIfruit);

        desktopNavItems.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = link.getAttribute('data-page');
                navigateTo(target);
            });
        });

        /* --- WEAPON WHEEL LOGIC (Devicon URLs) --- */
        let wheelInitialized = false;
        let currentWheelIndex = 0;
        let isScrolling = false;

        const skillsData = [
            { 
                id: 1, category: "HTML5", 
                icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg",
                skills: "Semantic Structure, Accessibility, SEO", stats: [100, 95, 100],
                attachments: ["Canvas API", "WebSockets", "Storage"],
                locked: false
            },
            { 
                id: 2, category: "CSS3", 
                icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg",
                skills: "Flexbox, Grid, Tailwind, Animations", stats: [100, 90, 100],
                attachments: ["SASS", "BEM", "PostCSS"],
                locked: false
            },
            { 
                id: 3, category: "JavaScript", 
                icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg",
                skills: "ES6+, Async/Await, DOM Manipulation", stats: [50, 45, 50],
                attachments: ["TypeScript", "Webpack", "Jest"],
                locked: false
            },
            { 
                id: 4, category: "React", 
                icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg",
                skills: "Requires Level 10", stats: [0, 0, 0],
                attachments: ["Locked"],
                locked: true
            },
            { 
                id: 5, category: "Node.js", 
                icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg",
                skills: "Requires Level 15", stats: [0, 0, 0],
                attachments: ["Locked"],
                locked: true
            },
            { 
                id: 6, category: "Express", 
                icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/express/express-original.svg",
                skills: "Requires Level 15", stats: [0, 0, 0],
                invert: true, 
                attachments: ["Locked"],
                locked: true
            },
            { 
                id: 7, category: "MongoDB", 
                icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg",
                skills: "Requires Level 20", stats: [0, 0, 0],
                attachments: ["Locked"],
                locked: true
            },
            { 
                id: 8, category: "GSAP", 
                icon: "https://cdn.worldvectorlogo.com/logos/gsap-greensock.svg",
                skills: "Requires Level 5", stats: [0, 0, 0],
                attachments: ["Locked"],
                locked: true
            }
        ];

        function initWeaponWheel() {
            if (wheelInitialized) return;
            wheelInitialized = true;

            // DESKTOP WHEEL RENDER
            const container = document.getElementById('wheel-container');
            const wheelSlicesContainer = document.getElementById('wheel-slices');
            const wheelIconsContainer = document.getElementById('wheel-icons');
            const centerX = 300;
            const centerY = 300;
            const outerRadius = 290;
            const innerRadius = 130;
            const gap = 0.04;

            const totalSlices = skillsData.length;
            const angleStep = (Math.PI * 2) / totalSlices;

            skillsData.forEach((skill, index) => {
                const startAngle = index * angleStep - Math.PI / 2 + gap;
                const endAngle = (index + 1) * angleStep - Math.PI / 2 - gap;
                
                const x1 = centerX + outerRadius * Math.cos(startAngle);
                const y1 = centerY + outerRadius * Math.sin(startAngle);
                const x2 = centerX + outerRadius * Math.cos(endAngle);
                const y2 = centerY + outerRadius * Math.sin(endAngle);
                const x3 = centerX + innerRadius * Math.cos(endAngle);
                const y3 = centerY + innerRadius * Math.sin(endAngle);
                const x4 = centerX + innerRadius * Math.cos(startAngle);
                const y4 = centerY + innerRadius * Math.sin(startAngle);

                const d = `M ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 0 0 ${x4} ${y4} Z`;

                const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
                path.setAttribute("d", d);
                // Add specific locked class
                const lockedClass = skill.locked ? "wheel-slice locked" : "wheel-slice";
                path.setAttribute("class", lockedClass);
                
                path.addEventListener('mouseenter', () => activateSlice(index));
                path.addEventListener('click', () => activateSlice(index));
                wheelSlicesContainer.appendChild(path);

                const midAngle = (startAngle + endAngle) / 2;
                const iconDist = (outerRadius + innerRadius) / 2;
                const iconX = centerX + iconDist * Math.cos(midAngle);
                const iconY = centerY + iconDist * Math.sin(midAngle);

                const iconGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
                
                let imgStyle = skill.invert ? "filter: brightness(0) invert(1);" : "";
                
                // Extra logic for locked icons
                let iconClasses = "wheel-icon-group";
                if (skill.locked) {
                    iconClasses += " locked";
                    // Override invert for locked items to ensure they look gray
                    if(skill.invert) imgStyle = "filter: grayscale(100%) brightness(0.5);"; 
                }

                iconGroup.setAttribute("class", iconClasses);
                
                // Lock Overlay Icon
                let overlayHTML = "";
                if (skill.locked) {
                    overlayHTML = `<foreignObject x="${iconX - 12}" y="${iconY - 12}" width="24" height="24" class="lock-overlay"><div xmlns="http://www.w3.org/1999/xhtml"><i data-lucide="lock" style="color: #888;"></i></div></foreignObject>`;
                }

                iconGroup.innerHTML = `
                    <foreignObject x="${iconX - 20}" y="${iconY - 20}" width="40" height="40" class="wheel-icon">
                        <div xmlns="http://www.w3.org/1999/xhtml" class="flex items-center justify-center w-full h-full">
                            <img src="${skill.icon}" class="w-10 h-10 object-contain" style="${imgStyle}" alt="${skill.category}" />
                        </div>
                    </foreignObject>
                    ${overlayHTML}
                `;
                wheelIconsContainer.appendChild(iconGroup);
            });
            
            // Refresh icons for new lock SVGs
            lucide.createIcons();

            container.addEventListener('wheel', (e) => {
                e.preventDefault();
                if (isScrolling) return;
                isScrolling = true;
                setTimeout(() => isScrolling = false, 100);

                const direction = e.deltaY > 0 ? 1 : -1;
                let nextIndex = currentWheelIndex + direction;

                if (nextIndex >= skillsData.length) nextIndex = 0;
                if (nextIndex < 0) nextIndex = skillsData.length - 1;

                activateSlice(nextIndex);
            }, { passive: false });

            activateSlice(0);

            // MOBILE INVENTORY RENDER
            const mobileGrid = document.getElementById('mobile-inventory-grid');
            skillsData.forEach(skill => {
                let imgStyle = skill.invert ? "filter: brightness(0) invert(1);" : "";
                let itemClass = "inventory-item";
                let lockIcon = "";
                
                if (skill.locked) {
                    itemClass += " locked";
                    if(skill.invert) imgStyle = "filter: grayscale(100%) brightness(0.5);";
                    lockIcon = `<div class="absolute top-2 right-2 text-gray-500"><i data-lucide="lock" class="w-4 h-4"></i></div>`;
                }

                const itemHTML = `
                    <div class="${itemClass}">
                        ${lockIcon}
                        <img src="${skill.icon}" class="w-16 h-16 object-contain mb-4" style="${imgStyle}" alt="${skill.category}">
                        <div class="item-stats">
                            <h4 class="text-white font-display text-sm uppercase text-center">${skill.category}</h4>
                            <div class="w-full bg-gray-700 h-1 mt-1">
                                <div class="bg-gta-magenta h-full" style="width: ${skill.stats[0]}%"></div>
                            </div>
                        </div>
                    </div>
                `;
                mobileGrid.innerHTML += itemHTML;
            });
            lucide.createIcons();
        }

        function activateSlice(index) {
            currentWheelIndex = index;
            document.querySelectorAll('.wheel-slice').forEach((slice, i) => {
                if (i === index) slice.classList.add('active');
                else slice.classList.remove('active');
            });

            const data = skillsData[index];
            document.getElementById('skill-category').textContent = data.category;
            const countNum = index + 1;
            const totalNum = skillsData.length;
            document.getElementById('skill-count').textContent = `${countNum < 10 ? '0' + countNum : countNum} / ${totalNum < 10 ? '0' + totalNum : totalNum}`;
            
            document.getElementById('stat-bar-1').style.width = data.stats[0] + '%';
            document.getElementById('stat-bar-2').style.width = data.stats[1] + '%';
            document.getElementById('stat-bar-3').style.width = data.stats[2] + '%';

            const attachContainer = document.getElementById('skill-attachments');
            attachContainer.innerHTML = '';
            if(data.attachments) {
                data.attachments.forEach(tag => {
                    const span = document.createElement('span');
                    span.className = 'attachment-tag font-hud';
                    span.innerText = tag;
                    attachContainer.appendChild(span);
                });
            }
        }

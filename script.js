document.addEventListener("DOMContentLoaded", () => {
    injectDynamicStyles();
    initThemeToggle();
    initInteractivePricingTable();
    initFeatureSelection();
    initScrollReveal();
});

/**
 * 1. Injects helper styles for the theme toggle, active states, and glass modal
 *    so no manual edits to style.css are needed.
 */
function injectDynamicStyles() {
    const style = document.createElement("style");
    style.textContent = `
        /* Light Frosted Glass Theme Variables */
        body.light-theme {
            --bg-base: #eef4fb;
            --glow-cyan: rgba(14, 165, 233, 0.22);
            --glow-indigo: rgba(99, 102, 241, 0.18);
            --glow-emerald: rgba(16, 185, 129, 0.15);

            --glass-bg: rgba(255, 255, 255, 0.62);
            --glass-bg-hover: rgba(255, 255, 255, 0.85);
            --glass-border: rgba(15, 23, 42, 0.12);
            --glass-highlight: rgba(255, 255, 255, 0.9);

            --text-primary: #0f172a;
            --text-secondary: #334155;
            --text-muted: #64748b;
            --accent-cyan: #0284c7;
            --accent-indigo: #4f46e5;
            --accent-emerald: #059669;
        }

        body.light-theme h1 {
            background: linear-gradient(135deg, #0f172a 20%, #0284c7 65%, #4f46e5 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        body.light-theme table {
            background: rgba(255, 255, 255, 0.55);
        }

        body.light-theme li {
            background: rgba(255, 255, 255, 0.55);
            border-color: rgba(15, 23, 42, 0.1);
        }

        /* Floating Glass Theme Toggle Button */
        .sb-theme-btn {
            position: fixed;
            top: 1.25rem;
            right: 1.25rem;
            z-index: 900;
            width: auto !important;
            max-width: none !important;
            padding: 0.6rem 1rem;
            border-radius: 999px;
            border: 1px solid var(--glass-border);
            background: var(--glass-bg);
            color: var(--text-primary);
            font-family: inherit;
            font-size: 0.85rem;
            font-weight: 600;
            cursor: pointer;
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
            transition: transform 0.25s ease, background 0.25s ease, border-color 0.25s ease;
        }

        .sb-theme-btn:hover {
            transform: translateY(-2px);
            background: var(--glass-bg-hover);
            border-color: var(--accent-cyan);
        }

        /* Interactive Table Rows */
        table tr:not(:first-child) {
            cursor: pointer;
        }

        table tr.selected-model {
            background: rgba(56, 189, 248, 0.18) !important;
            outline: 1px solid var(--accent-cyan);
        }

        .sb-table-hint {
            margin-top: 0.85rem;
            font-size: 0.85rem;
            color: var(--text-muted);
            text-align: right;
        }

        /* Active Feature Pill */
        li {
            cursor: pointer;
            user-select: none;
        }

        li.feature-pinned {
            border-color: var(--accent-cyan);
            background: rgba(56, 189, 248, 0.16);
            box-shadow: 0 6px 20px rgba(56, 189, 248, 0.18);
        }

        /* Scroll Reveal Animation */
        .sb-reveal {
            opacity: 0;
            transform: translateY(18px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }

        .sb-reveal.visible {
            opacity: 1;
            transform: translateY(0);
        }

        /* Frosted Glass Order Modal */
        .sb-modal-backdrop {
            position: fixed;
            inset: 0;
            z-index: 1000;
            width: 100% !important;
            max-width: none !important;
            background: rgba(4, 7, 15, 0.65);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1.25rem;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s ease;
        }

        .sb-modal-backdrop.open {
            opacity: 1;
            pointer-events: auto;
        }

        .sb-modal {
            width: 100%;
            max-width: 430px;
            background: var(--bg-base);
            background-image: linear-gradient(145deg, rgba(56, 189, 248, 0.12), rgba(129, 140, 248, 0.1));
            border: 1px solid var(--glass-border);
            border-radius: 24px;
            padding: 1.75rem;
            color: var(--text-primary);
            box-shadow: 0 24px 60px rgba(0, 0, 0, 0.55);
            transform: scale(0.94);
            transition: transform 0.3s ease;
        }

        .sb-modal-backdrop.open .sb-modal {
            transform: scale(1);
        }

        .sb-modal h3 {
            font-size: 1.3rem;
            margin-bottom: 0.4rem;
            color: var(--accent-cyan);
        }

        .sb-price-box {
            margin: 1.1rem 0;
            padding: 1rem;
            border-radius: 14px;
            background: var(--glass-bg);
            border: 1px solid var(--glass-border);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .sb-old-price {
            text-decoration: line-through;
            color: var(--text-muted);
            font-size: 0.9rem;
        }

        .sb-final-price {
            font-size: 1.35rem;
            font-weight: 800;
            color: var(--accent-emerald);
        }

        .sb-modal-actions {
            display: flex;
            gap: 0.75rem;
            margin-top: 1.25rem;
        }

        .sb-btn-primary, .sb-btn-secondary {
            flex: 1;
            padding: 0.75rem 1rem;
            border-radius: 12px;
            font-family: inherit;
            font-weight: 600;
            font-size: 0.95rem;
            cursor: pointer;
            border: 1px solid var(--glass-border);
            transition: transform 0.2s ease, opacity 0.2s ease;
        }

        .sb-btn-primary {
            background: linear-gradient(135deg, var(--accent-cyan), var(--accent-indigo));
            color: #ffffff;
            border: none;
        }

        .sb-btn-secondary {
            background: var(--glass-bg);
            color: var(--text-primary);
        }

        .sb-btn-primary:hover, .sb-btn-secondary:hover {
            transform: translateY(-2px);
        }
    `;
    document.head.appendChild(style);
}

/**
 * 2. Dark / Light Glass Mode Toggle with localStorage persistence
 */
function initThemeToggle() {
    const toggleBtn = document.createElement("button");
    toggleBtn.className = "sb-theme-btn";
    toggleBtn.type = "button";

    const savedTheme = localStorage.getItem("smartband-theme");
    if (savedTheme === "light") {
        document.body.classList.add("light-theme");
    }

    const updateButtonLabel = () => {
        const isLight = document.body.classList.contains("light-theme");
        toggleBtn.textContent = isLight ? "🌙 Dark Glass" : "☀️ Light Glass";
    };

    updateButtonLabel();

    toggleBtn.addEventListener("click", () => {
        document.body.classList.toggle("light-theme");
        const isLight = document.body.classList.contains("light-theme");
        localStorage.setItem("smartband-theme", isLight ? "light" : "dark");
        updateButtonLabel();
    });

    document.body.appendChild(toggleBtn);
}

/**
 * 3. Interactive Table Row Selection + Automatic First-Purchase Discount Modal
 */
function initInteractivePricingTable() {
    const table = document.querySelector("table");
    if (!table) return;

    // Add a subtle instruction below the table
    const hint = document.createElement("p");
    hint.className = "sb-table-hint";
    hint.textContent = "Click a model row to preview your first-purchase discount.";
    table.insertAdjacentElement("afterend", hint);

    // Create reusable Glass Order Modal
    const backdrop = document.createElement("div");
    backdrop.className = "sb-modal-backdrop";
    backdrop.innerHTML = `
        <div class="sb-modal" role="dialog" aria-modal="true">
            <h3 id="sb-modal-title">SmartBand X</h3>
            <p id="sb-modal-offer" style="font-size: 0.92rem;"></p>
            <div class="sb-price-box">
                <div>
                    <div style="font-size: 0.8rem; color: var(--text-muted);">First-Purchase Price</div>
                    <span class="sb-old-price" id="sb-old-price"></span>
                </div>
                <div class="sb-final-price" id="sb-final-price"></div>
            </div>
            <p id="sb-order-status" style="font-size: 0.9rem; color: var(--accent-emerald); min-height: 1.4em;"></p>
            <div class="sb-modal-actions">
                <button type="button" class="sb-btn-secondary" id="sb-close-btn">Close</button>
                <button type="button" class="sb-btn-primary" id="sb-confirm-btn">Reserve Offer</button>
            </div>
        </div>
    `;
    document.body.appendChild(backdrop);

    const titleEl = backdrop.querySelector("#sb-modal-title");
    const offerEl = backdrop.querySelector("#sb-modal-offer");
    const oldPriceEl = backdrop.querySelector("#sb-old-price");
    const finalPriceEl = backdrop.querySelector("#sb-final-price");
    const statusEl = backdrop.querySelector("#sb-order-status");
    const closeBtn = backdrop.querySelector("#sb-close-btn");
    const confirmBtn = backdrop.querySelector("#sb-confirm-btn");

    const closeModal = () => backdrop.classList.remove("open");
    closeBtn.addEventListener("click", closeModal);
    backdrop.addEventListener("click", (e) => {
        if (e.target === backdrop) closeModal();
    });
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeModal();
    });

    confirmBtn.addEventListener("click", () => {
        statusEl.textContent = `✓ Offer applied for ${titleEl.textContent}!`;
    });

    // Attach click handlers to data rows (skipping header row)
    const rows = Array.from(table.querySelectorAll("tr")).slice(1);
    rows.forEach((row) => {
        row.addEventListener("click", () => {
            rows.forEach((r) => r.classList.remove("selected-model"));
            row.classList.add("selected-model");

            const cells = row.querySelectorAll("td");
            const modelName = cells[0]?.textContent.trim() || "SmartBand X";
            const rawPriceText = cells[1]?.textContent.trim() || "Rs.0";
            const offerText = cells[2]?.textContent.trim() || "";

            // Parse numeric price and discount percentage from table text
            const numericPrice = parseFloat(rawPriceText.replace(/[^\d.]/g, "")) || 0;
            const discountMatch = offerText.match(/(\d+)\s*%/);
            const discountPercent = discountMatch ? parseFloat(discountMatch[1]) : 0;
            const discountedPrice = Math.round(numericPrice * (1 - discountPercent / 100));

            titleEl.textContent = modelName;
            offerEl.textContent = `Included Offer: ${offerText}`;
            oldPriceEl.textContent = `Rs.${numericPrice.toLocaleString("en-IN")}`;
            finalPriceEl.textContent = `Rs.${discountedPrice.toLocaleString("en-IN")}`;
            statusEl.textContent = "";

            backdrop.classList.add("open");
        });
    });
}

/**
 * 4. Click-to-Pin Feature Cards
 */
function initFeatureSelection() {
    const items = document.querySelectorAll("ul li");
    items.forEach((item) => {
        item.title = "Click to highlight feature";
        item.addEventListener("click", () => {
            item.classList.toggle("feature-pinned");
        });
    });
}

/**
 * 5. Smooth Scroll Reveal for Sections, Image, and Footer
 */
function initScrollReveal() {
    const targets = document.querySelectorAll("img, section, footer");
    targets.forEach((el) => el.classList.add("sb-reveal"));

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.12 }
    );

    targets.forEach((el) => observer.observe(el));
}